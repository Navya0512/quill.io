import express from 'express'
import auth, { verifyRole } from '../middlewares/auth.js'
import {  createBlog, deleteBlog, getAuthorBlogs, getBlog, getBlogs, toggleLike, updateBlog, updateViews } from '../controllers/blog.controllers.js'
let router=express.Router()
import multer from 'multer'
import storage from '../middlewares/fileUpload.js'
import { deleteComment, postComment } from '../controllers/comment.controllers.js'
let upload=multer({storage})

router.post("/",auth,verifyRole("admin","author"),upload.single("blogImage"),createBlog)
router.get("/",getBlogs)
router.get("/author",auth,verifyRole("author"),getAuthorBlogs)
router.get("/:slug",auth,getBlog)
router.put("/:id",auth,verifyRole("admin","author"),upload.single("blogImage"),updateBlog)
router.delete("/:id",auth,verifyRole("admin","author"),deleteBlog)

router.post("/:id/views", auth, updateViews)
router.put("/:id/likes",auth,toggleLike)


//comments
router.delete("/:id/comments/:commentId",auth,deleteComment)
router.post("/:id/comments",auth,postComment)

export default router;

