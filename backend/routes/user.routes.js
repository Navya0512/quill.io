import express from 'express'
import auth from '../middlewares/auth.js';
import { updateUser, updateUserRole } from '../controllers/user.controllers.js';
import multer from 'multer';
import storage from '../middlewares/fileUpload.js';
let upload=multer({storage:storage})
let router=express.Router()


//route to update user details
router.put("/settings",auth,upload.single("displayPicture"),updateUser)
//route to update user to author
router.put("/settings/role",auth,updateUserRole)



export default router;