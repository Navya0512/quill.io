import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  let token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    let err = new Error("Token not set");
    err.statusCode = 401;
    throw err;
  }
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decodedToken.id);
  if (!user) {
    let err = new Error("User not found Please register");
    err.statusCode = 401;
    throw err;
  }
  req.userId = user._id;
  next();
};

export const verifyRole=(...roles)=>{
    return async (req,res,next)=>{
      let user=await User.findById(req.userId)
      if(!roles.includes(user.role)){
        let err=new Error("Permission denied")
        err.statusCode=403;
        throw err;
      }
      next()
    }
}

export default auth;
