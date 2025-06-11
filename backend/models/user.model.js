import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: "String",
      required: [true, "username is required"],
      trim: true,
      minLength: [4, "username should be more than 4 characters"],
    },
    email: {
      type: "String",
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return String(value)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        },
        message: "Please enter proper email",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password should be more than 6 characters"],
    },
    confirmPassword: {
      type: String,
      required: [true, "password is required"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password and confirm password",
      },
      
    },
    role:{
      type: String,
      enum: {
        values: ["author", "user", "admin"],
        message: "{VALUE} is not supported",
      },
      default:'user'
    },
    displayPicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //checking whether password is modified to 
  // if(!this.password.isModified){
  //   return next()
  // }
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword=undefined;
  next();
});


userSchema.methods.verifyPassword=async function(pwd,pwdDb){
    return await bcrypt.compare(pwd,pwdDb)
}


export default model("User", userSchema);