import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import axios from "../axios"; // Use your custom axios instance!
import { useSnackbar } from "notistack";

const AuthorDashBoard = () => {
  const { user, token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorBlogs = async () => {
      try {
        const response = await axios.get("/blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            authorId: user._id,
          },
        });
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs");
        setLoading(false);
      }
    };

    if (user && token) {
      fetchAuthorBlogs();
    }
  }, [user, token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(blogs.filter((blog) => blog._id !== id));
        enqueueSnackbar("Blog deleted successfully", { variant: "success" });
      } catch (err) {
        enqueueSnackbar(err.response?.data?.message || "Failed to delete blog", {
          variant: "error",
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <Link
          to="/dashboard/create-blog"
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
        >
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No blogs created yet.</p>
          <Link
            to="/dashboard/create-blog"
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/blog/${blog.slug}`)}
            >
              <img
                src={blog.blogImage}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2
                className="text-xl font-semibold mb-2 text-indigo-700 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/blog/${blog.slug}`);
                }}
                style={{ cursor: "pointer" }}
              >
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-2">{blog.category}</p>
              <div
                className="flex justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to={`/dashboard/edit-blog/${blog.slug}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorDashBoard;