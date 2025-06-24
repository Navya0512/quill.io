import { Router } from "express";
import auth, { verifyRole } from "../middlewares/auth.js";
import {
  deleteComment,
  deleteUser,
  getBlogs,
  getUsers,
  updateUserRole,
} from "../controllers/admin.controllers.js";

let router = Router();

router.get("/users", auth, verifyRole("admin"), getUsers);
router.get("/blogs", auth, verifyRole("admin"), getBlogs);

router.put("/users/:id/role", auth, verifyRole("admin"), updateUserRole);
router.delete("/users/:id", auth, verifyRole("admin"), deleteUser);


export default router;