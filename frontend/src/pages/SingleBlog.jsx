import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../axios";
import useAuth from "../context/AuthContext";
import Navbar from "../components/Navbar";

const SingleBlog = () => {
  const { slug } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const fetchSingleBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/blogs/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setBlog(res.data.blog);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching blog");
      enqueueSnackbar(error.response?.data?.message || "Error fetching blog", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBlog();
  }, [slug]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(
        `/blogs/${blog._id}/comments`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment("");
      fetchSingleBlog();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      let res=await axios.delete(`/blogs/${blog._id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      enqueueSnackbar("Comment deleted successfully", { variant: "success",autoHideDuration:3000 });
      fetchSingleBlog(); // Refresh comments after deletion
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Error deleting comment",
        {
          variant: "error",
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={blog.blogImage}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {blog.category}
              </span>
              <div className="flex items-center text-gray-500">
                <svg
                  className="h-5 w-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {blog.views} views
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            <p className="text-gray-700 leading-relaxed mb-6">
              {blog.description}
            </p>

            {/* Author Info */}
            <div className="flex items-center border-t pt-6">
              <img
                src={blog.authorId.displayPicture}
                alt={blog.authorId.username}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {blog.authorId.username.toString().toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">{blog.authorId.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>

          {/* Comment Form */}
          {user && (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                style={{ resize: "none" }}
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Post Comment
              </button>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {blog.comments.length === 0 ? (
              <p className="text-gray-500">No comments yet</p>
            ) : (
              blog.comments.map((comment) => (
                <div key={comment._id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={comment.userId.displayPicture}
                        alt={comment.userId.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.userId.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {user && comment.userId._id === user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;