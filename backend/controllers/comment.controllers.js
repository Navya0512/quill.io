import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import userModel from "../models/user.model.js";

export const postComment = async (req, res, next) => {
  let { id } = req.params;
  let { comment } = req.body;
  let blog = await Blog.findById(id);

  let newComment = await Comment.create({
    comment,
    blogId: id,
    userId: req?.userId,
  });
  blog.comments.push(newComment._id);
  await blog.save();
  res.status(201).json({
    message: "Comment posted successfully",
    newComment,
  });
};

export const deleteComment = async (req, res, next) => {
  let { id, commentId } = req.params;
  let user=await userModel.findById(req.userId);
  console.log(user);
  
  if (!user) {
    let err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  let blog = await Blog.findById(id);
  let comment = await Comment.findById(commentId);
  if (user.role!=="admin" && (comment.userId.toString() !== req.userId.toString())) {
    let err = new Error("Not permitted");
    err.statusCode = 403;
    throw err;
  }
  let deletedBlog = await Comment.findByIdAndDelete(commentId);
  let index = blog.comments.findIndex(
    (comment) => comment.toString() === commentId.toString()
  );
  if (index < 0) {
    let err = new Error("Invalid operation");
    err.statusCode = 400;
    throw err;
  }
  blog.comments.splice(index, 1);
  await blog.save();
  res.status(200).json({
    message: "Commented deleted successfully",
    deletedBlog,
  });
};
