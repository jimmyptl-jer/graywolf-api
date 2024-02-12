import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: [{
    type: String,
    required: true
  }],
  imageUrls: [{
    type: String,
    required: true
  }],
  lastUpdate: { type: Date }
})

const Post = mongoose.model('Post', postSchema)

export default Post;