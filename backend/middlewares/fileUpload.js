import { configDotenv } from "dotenv";
configDotenv()
import { v2 as cloudinary } from "cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

let storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"quill.io"
    }
})

export default storage;