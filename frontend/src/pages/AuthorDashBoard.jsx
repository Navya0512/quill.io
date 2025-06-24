import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import useAuth from "../context/AuthContext";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";

const AuthorDashboard = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthorBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/blogs/author", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(res.data.blogs);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error fetching blogs", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      enqueueSnackbar("Blog deleted successfully", { variant: "success" });
      fetchAuthorBlogs();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error deleting blog", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchAuthorBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <Link
            to="/create-blog"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create New Blog
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500">No blogs found</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <li key={blog._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="flex items-center hover:opacity-75 transition-opacity"
                        >
                          <img
                            src={blog.blogImage}
                            alt={blog.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <h2 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                              {blog.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {blog.category}
                            </p>
                          </div>
                        </Link>
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          to={`/edit-blog/${blog.slug}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;