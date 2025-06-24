import User from "../models/user.model.js"

export const updateUser=async (req,res,next)=>{
  
    if(req.body.password || req.body.email || req.body.confirmPassword ||req.body.role){
        delete req.body.password
        delete req.body.confirmPassword
        delete req.body.email
        delete req.body.role
    }
    let user=await User.findByIdAndUpdate(req.userId,{...req.body,displayPicture:req.file.path},{new:true,runValidators:true})
    res.status(200).json(user)
}

export const updateUserRole=async (req,res,next)=>{
    let user = await User.findById(req.userId);
    
    if (user.role === "author") {
      let err = new Error("User is already an author");
      err.statusCode = 400;
      throw err;
    }

    let updatedUser=await User.findByIdAndUpdate(req.userId,{role:"author"},{new:true,runValidators:true})
    res.status(200).json(updatedUser)
}

export const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User deleted successfully" });
};