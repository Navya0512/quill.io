import { Schema, model } from "mongoose";

let blogSchema = new Schema(
  {
    title: {
      type: String,
      minLength: [6, "Title should be more than 6 characters"],
      trim: true,
      unique: true,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      validate: {
        validator: function (value) {
          // Split the text by whitespace characters and filter out any empty strings
          const words = value.trim().split(/\s+/);
          return words.length >= 20;
        },
        message: "Description should contain more than 20 words",
      },
    },
    blogImage: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREO3tkIJnmJZcWmgLLR-z973QVHQ8zbwDGnw&s",
    },
    category: {
      type: String,
      required:[true,"Category is required"],
      enum: {
        values: [
          "Technology",
          "Programming",
          "Web Development",
          "Mobile Development",
          "AI & Machine Learning",
          "Data Science",
          "Cybersecurity",
          "Design & UX",
          "Business",
          "Startups",
          "Productivity",
          "Marketing",
          "Finance",
          "Health & Wellness",
          "Travel",
          "Education",
          "Gaming",
          "Lifestyle",
          "News",
          "Opinion",
        ],
        message: "{VALUE} is not supported",
      },
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author field is required"],
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Blog", blogSchema);