import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../../axios"
import useAuth from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import AuthorInfo from "./AuthorInfo";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const SingleBlog = () => {
  const { slug } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const hasIncrementedView = useRef(false);

  const fetchSingleBlog = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/blogs/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Fetch blog data when slug changes
  useEffect(() => {
    fetchSingleBlog();
    hasIncrementedView.current = false; // Reset for new blog
  }, [slug]);

  // Increment view only once per mount
  useEffect(() => {
    if (blog && !hasIncrementedView.current) {
      hasIncrementedView.current = true;
      axios
        .post(`/blogs/${blog._id}/views`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(() => {});
    }
  }, [blog, token]);

  useEffect(() => {
    if (blog && user) {
      setIsLiked(blog.likes.includes(user._id));
      setLikeCount(blog.likes.length);
    }
  }, [blog, user]);

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
      let res = await axios.delete(`/blogs/${blog._id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      enqueueSnackbar("Comment deleted successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });
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

  const handleLike = async () => {
    // Optimistically update UI
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    try {
      await axios.put(`/blogs/${blog._id}/likes`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // No need to refetch the blog here!
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error updating like", {
        variant: "error",
      });
      // Revert optimistic update on error
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
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
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: blog.description,
              }}
            />

            {/* Author Info */}
            <AuthorInfo author={blog.authorId} />
          </div>
        </div>

        {/* Like and Comment Section */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-6">
          <LikeButton
            isLiked={isLiked}
            likeCount={likeCount}
            onLike={handleLike}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
          {user && (
            <CommentForm
              comment={comment}
              setComment={setComment}
              onSubmit={handleComment}
            />
          )}
          <CommentList
            comments={blog.comments}
            user={user}
            onDelete={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;