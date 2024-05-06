import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoLink: {
    type: String
  },
  blogLink: {
    type: String
  },
  imageUrl: {
    type: String,
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
