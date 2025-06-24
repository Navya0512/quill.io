import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../axios";
import useAuth from "../context/AuthContext";
import Navbar from "../components/Navbar";

const AdminBlogs = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBlogs = async () => {
    try {
      const res = await axios.get("/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar("Blog deleted successfully", { variant: "success" });
      fetchAllBlogs();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error deleting blog", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
            <svg
              className="w-32 h-32 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🤔 Hmm... It's Pretty Empty Here
            </h3>
            <p className="text-gray-600 text-center max-w-sm mb-4">
              Looks like all our blogs went on vacation! Time to encourage some authors to
              start writing... or maybe the blogs are just playing hide and seek? 🙈
            </p>
            <div className="text-sm text-gray-500 italic">
              * tumbleweeds roll by *
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <li key={blog._id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={blog.blogImage}
                        alt={blog.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">{blog.title}</h2>
                        <p className="text-sm text-gray-500">
                          By {blog.authorId.username} • {blog.category}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{blog.views} views</span>
                          <span className="text-sm text-gray-500">{blog.likes.length} likes</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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

export default AdminBlogs;