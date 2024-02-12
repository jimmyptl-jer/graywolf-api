import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser } from '../Controller/auth.controller.js';

const router = express.Router();

router.post(
  '/register',
  [check('username', 'Username is required'),
  check('email', "Email is required"),
  check('password', "Password is required").isLength({ min: 5 })],
  registerUser
);

router.post('/login', loginUser)

export default router;