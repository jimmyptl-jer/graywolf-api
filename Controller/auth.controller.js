import User from "../Models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import generateTokenAndSetCookie from "../Utils/generateToken.js";

import { errorHandler } from "../Utils/Error.js";

export const registerUser = async (req, res, next) => {
  try {
    // Extracting user input from the request body
    const { firstName, lastName, username, email, password } = req.body;

    // Check if any required field is missing or empty
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(errorHandler(409, "Username or email already exists"));
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword
    });

    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    generateTokenAndSetCookie(validUser._id, res);

    res.status(200).json({
      _id: validUser._id,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      username: validUser.username,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logout = (req, res) => {
  try {
    // Clear the access token cookie
    res.cookie("access_token", "", { maxAge: 0 });

    // Send a success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
