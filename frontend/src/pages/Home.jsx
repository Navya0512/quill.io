import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "../axios";
import { Link } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";

const Home = () => {
  let [blogs, setBlogs] = useState([]);
  let [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
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
    "Productivity",
    "Marketing",
    "Finance",
    "Health & Wellness",
    "Travel",
    "Education",
    "Gaming",
    "Lifestyle",
    "News",
    "Opinion",
  ];
  const didFetch = useRef(false);
  const lastFetchParams = useRef({ search: "", category: "", page: 1 });

  const fetchBlogs = async () => {
    try {
      let res = await axios.get(
        `/blogs?search=${search}&category=${category}&page=${page}&limit=${limit}`
      );
      setBlogs(res.data.blogs);
      setTotalPages(Math.ceil(res.data.totalBlogs / limit));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchBlogs();
    // eslint-disable-next-line
  }, [search, category, page]);

  useEffect(() => {
    // Only fetch if params actually changed
    if (
      lastFetchParams.current.search === search &&
      lastFetchParams.current.category === category &&
      lastFetchParams.current.page === page
    ) {
      return;
    }
    lastFetchParams.current = { search, category, page };
    setLoading(true);
    fetchBlogs();
    // eslint-disable-next-line
  }, [search, category, page]);

  // Sort blogs by views for popular section
  const popularBlogs = [...blogs].sort((a, b) => b.views - a.views);
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page on category change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center">
            Welcome to Quill.io
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-center text-xl text-gray-500">
            Your platform for meaningful stories and ideas
          </p>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
          />
        </div>
      </div>
      {/* Search section */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="w-full sm:w-1/3">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Blogs Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Blogs
            </h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center text-gray-500">No blogs found</div>
            ) : (
              <>
                <div className="space-y-6">
                  {blogs?.map((blog) => (
                    <Link to={`/blog/${blog.slug}`} key={blog.slug}>
                      <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {blog.title}
                        </h3>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <span>{blog.category}</span>
                            {/* <span className="mx-2">•</span> */}
                            {/* <span>{new Date(blog.date).toLocaleDateString()}</span> */}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            {blog.views}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          page === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </>
            )}
          </div>

          {/* Popular Blogs Section - Moved inside the grid */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Blogs
            </h2>
            <div className="bg-white shadow rounded-lg divide-y">
              {popularBlogs.map((blog) => (
                <Link to={`/blog/${blog.slug}`} key={blog.slug}>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900">
                      {blog.title}
                    </h3>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{blog.author}</span>
                      <div className="text-sm text-gray-500 flex items-center">
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {blog.views}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;