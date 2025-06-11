import { v2 as cloudinary } from "cloudinary";


const destroyFile = async (path) => {
  try {
    if (!path) return;
    
    // Extracting public ID from the full path
    //split by / 
    //pop will give last element in array that is file name and split by dot to remove extension
    //prefix quill.io folder name to filename
    const publicId = `quill.io/${path.split("/").pop().split(".")[0]}`;
    
    // Deleting the file from Cloudinary
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    let err=new Error(error.message)
    err.statusCode=400;
    throw err;
  }
};

export default destroyFile;