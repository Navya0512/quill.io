import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import axios from "../axios";
import useAuth from "../context/AuthContext";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";

const EditBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    category: "",
    blogImage: "",
    id: "",
    slug: "", // Add slug to track the blog
  });

  const categories = [
    "Technology",
    "Programming",
    "Web Development",
    "Mobile Development",
    "AI & Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Design & UX",
    "Business",
    "Startups",
  ];

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const blogData = res.data.blog;

      setBlog({
        id: blogData._id,
        title: blogData.title,
        description: blogData.description,
        category: blogData.category,
        blogImage: blogData.blogImage,
        slug: blogData.slug // Add slug to track the blog
      });
      setPreviewImage(blogData.blogImage);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error fetching blog", {
        variant: "error",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlog((prev) => ({ ...prev, blogImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorRef.current) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("description", editorRef.current.getContent());
      formData.append("category", blog.category);
      
      // Only append blogImage if it's a new File
      if (blog.blogImage instanceof File) {
        formData.append("blogImage", blog.blogImage);
      }

      // Use the blog id for the update request
      const response = await axios.put(`/blogs/${blog.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        enqueueSnackbar("Blog updated successfully", { variant: "success" });
        navigate("/dashboard");
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error updating blog", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={blog.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Blog Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Blog Image
            </label>
            <div className="mt-1 flex items-center">
              <div className="relative">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <Editor
              apiKey='39kcliwoi3u0gacfwnouvnhpvwgxcumig9ium79h7q7cjxlm'
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={blog.description}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;