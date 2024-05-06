import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Post from '../Models/post.model.js';

import { uploadFile, getObjectSignedUrl } from "../Config/aws/aws.js";
const router = express.Router();

// Multer configuration for storing images in memory
// Multer configuration for handling image uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage
})


// Route for creating a new post
router.post('/', upload.single("imageFile"), async (req, res) => {
  try {

    const {
      title,
      description,
      videoLink,
      blogLink } = req.body

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'No valid image file provided.' });
    }

    const imageUrl = await uploadFile(req.file.buffer, req.file.originalname);

    console.log(imageUrl)

    const newPost = new Post({
      title,
      description,
      videoLink,
      blogLink,
      imageUrl: imageUrl
    })

    const savedPost = await newPost.save()

    res.status(201).send(savedPost);
  } catch (error) {
    console.error("Error while creating post:", error);
    res.status(500).json({ message: "Error while creating post" });
  }
});


// Endpoint to get all businesses from the database
router.get("/", async (req, res) => {
  try {
    // Retrieve all businesses from the database
    const posts = await Post.find();

    for (const post of posts) {
      post.imageUrl = getObjectSignedUrl(post.imageUrl)
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Failed to fetch businesses.' });
  }
});


export default router;
