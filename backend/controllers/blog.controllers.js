import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import slugify from "../utils/slugify.js";
import destroyFile from "../utils/destroyCloudinaryFile.js";

const createBlog = async (req, res, next) => {
  let { userId } = req;
  console.log(userId);

  let { title, description, category } = req.body;
  // Check for duplicate blog title
  const existingBlog = await Blog.findOne({
    title: { $regex: new RegExp(`^${title}$`, "i") },
  });

  if (existingBlog) {
    // Delete uploaded image if exists
    if (req.file?.path) {
      await destroyFile(req.file.path);
    }

    let err = new Error("A blog with this title already exists");
    err.statusCode = 409;
    throw err;
  }

  // Validate required fields
  if (!title || !description || !category || !req.file) {
    if (req.file?.path) {
      await destroyFile(req.file.path);
    }
    let err = new Error("Please provide all required fields including image");
    err.statusCode = 400;
    throw err;
  }
  let newBlog = await Blog.create({
    title,
    slug: slugify(title),
    category,
    description,
    authorId: userId,
    blogImage: req.file.path,
  });

  if (!newBlog) {
    // Delete uploaded image if blog creation fails
    await destroyFile(req.file.path);
    let err = new Error("Failed to create blog");
    err.statusCode = 400;
    throw err;
  }

  res.status(201).json({
    message: "Blog created Successfully",
    newBlog,
  });
};

const getBlogs = async (req, res, next) => {
  let { search = "", category = "", page = 1, limit = 5 } = req.query;

  let queryObj = { title: { $regex: search, $options: "i" } };

  if (req.query.category) {
    queryObj.category = category;
  }
  let blogs = await Blog.find(queryObj)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  let totalBlogs = await Blog.countDocuments();
  res.status(200).json({
    message: "Fetched Blogs Successfully",
    totalBlogs,
    page,
    blogs: blogs.map((blog) => {
      return {
        title: blog.title,
        id:blog._id,
        blogImage: blog.blogImage,
        category: blog.category,
        slug: blog.slug,
        likes: blog?.likes,
        views: blog?.views,
        comments: blog.comments,
      };
    }),
  });
};

const getBlog = async (req, res, next) => {
  let { slug } = req.params;
  let blog = await Blog.findOne({ slug })
    .populate({
      path: "comments",
      populate: { path: "userId", select: "username displayPicture" },
    })
    .populate("authorId", "username email role displayPicture");
  res.status(200).json({
    message: "Feteched blog Successfully",
    blog,
  });
};

const updateBlog = async (req, res, next) => {
  let { id } = req.params;
  const { userId } = req;
  //find logged in user
  let user = await User.findById(userId);
  console.log(user);
  if (!user) {
    let err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }
  // Find and verify blog exists
  const blog = await Blog.findById(id);

  if (!blog) {
    let err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }

  // Verify author
  if (blog.authorId.toString() !== userId.toString() && user.role !== "admin") {
    let err = new Error("You can only update your own blogs");
    err.statusCode = 403;
    throw err;
  }
  
  let updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { ...req.body,blogImage:req.file.path },
    { new: true }
  );
  if (!updatedBlog) {
    let err = new Error("Failed to update blog");
    err.statusCode = 400;
    throw err;
  }

  res.status(201).json({
    message: "Blog updated Successfully",
    updatedBlog,
  });
};

const deleteBlog = async (req, res, next) => {
  let { id } = req.params;
  const { userId } = req;
  //find logged in user
  let user = await User.findById(userId);
  console.log(user);
  if (!user) {
    let err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }
  // Find and verify blog exists
  const blog = await Blog.findById(id);

  if (!blog) {
    let err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }

  // Verify author
  if (blog.authorId.toString() !== userId.toString() && user.role !== "admin") {
    let err = new Error("You can only delete your own blogs");
    err.statusCode = 403;
    throw err;
  }

  // Delete blog image if exists
  if (blog.blogImage) {
    await destroyFile(blog.blogImage);
  }

  await Blog.findByIdAndDelete(id);
  res.status(201).json({
    message: "Blog deleted Successfully",
  });
};

const updateViews = async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findById(req.userId);
  if (!user) {
    let err = new Error("Please login!!");
    err.statusCode = 403;
    throw err;
  }
  let blog = await Blog.findById(id);
  blog.views = blog.views + 1;
  await blog.save();
  return res.status(200).send();
};

const toggleLike = async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findById(req.userId);
  if (!user) {
    let err = new Error("Please login!!");
    err.statusCode = 403;
    throw err;
  }
  let blog = await Blog.findById(id);
  let result = blog.likes.includes(req.userId);
  if (result) {
    let index = blog.likes.findIndex((id) => id == req.userId);
    blog.likes.splice(index, 1);
    await blog.save();
    return res.status(200).send();
  }
  //user is not present we push user into likes array
  blog.likes.push(user?._id);
  await blog.save();
  return res.status(200).send();
};

export {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  updateViews,
  toggleLike,
};