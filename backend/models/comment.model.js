import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment field is required"],
      trim: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Comment",commentSchema)