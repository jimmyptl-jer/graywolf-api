// post.route.js

import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Post from '../Models/post.model.js';
import { errorHandler } from '../Utils/Error.js';

const router = express.Router();
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


router.post(
  '/create',
  upload.array("imageFiles", 6),
  async (req, res) => {
    try {
      const imageFiles = req.files
      const newPost = req.body

      //1. Upload IMages to Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64")
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI)

        return res.url;
      })


      //2. Upload Successful,add the urls to the new hotel
      const imageUrls = await Promise.all(uploadPromises)
      newPost.imageUrls = imageUrls
      newPost.lastUpdated = new Date();

      //3. Save new hotel to database
      const post = new Post(newPost)
      await post.save()

      res.status(201).send(post)
    } catch (error) {
      console.log("Error while creating hotel:", error)
      res.status(500).json({
        message: "Error while creating hotel"
      })
    }
  })


// // api/get
// router.get('/getPosts');

// router.get('/getPosts', async (req, res) => {
//   try {
//     const posts = await Post.find()
//     res.json(posts)
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching Post'
//     })
//   }
// })



// // api/post
// router.post(
//   '/create',
//   upload.array('image', 6), // Use multer to handle file uploads
//   async (req, res, next) => {
//     try {

//       console.log("Request Body:", req.body);
//       console.log("Image Files:", req.files);

//       if (req.body.isAdmin) {
//         return next(errorHandler(403, "Sorry! you are not allowed to create a post"));
//       }

//       if (!req.body.title || !req.body.description) {
//         return next(errorHandler(400, "Please provide a title and description for the post."));
//       }

//       const slug = req.body.title.split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, '-');

//       // const imageFiles = req.files;

//       // if (!imageFiles) {
//       //   return res.status(400).json({ message: 'No valid image files provided.' });
//       // }

//       // // 1. Upload the images to Cloudinary
//       // const imageUrls = await uploadImages(imageFiles);

//       // 2. If upload was successful, add the URLs to the new post
//       const newPost = {
//         ...req.body,
//         slug,
//         userId: req.userId,
//         // image: imageUrls,
//       };

//       const post = new Post(newPost);
//       await post.save();

//       res.status(201).send(post);
//     } catch (error) {
//       console.error('Error in post creation', error);
//       next(errorHandler(500, "Error in post creation"));
//     }
//   }
// );

// export async function uploadImages(imageFiles) {
//   try {
//     const uploadPromises = imageFiles.map(async (image) => {
//       const b64 = Buffer.from(image.buffer).toString('base64');
//       let dataURI = 'data:' + image.mimetype + ';base64,' + b64;
//       const res = await cloudinary.v2.uploader.upload(dataURI);
//       return res.url;
//     });

//     const imageUrls = await Promise.all(uploadPromises);
//     return imageUrls;
//   } catch (error) {
//     console.error('Error uploading images to Cloudinary:', error);
//     throw new Error('Failed to upload one or more images.');
//   }
// }

export default router;
