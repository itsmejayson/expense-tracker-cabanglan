import bcrypt from "bcrypt"; // Import bcrypt to hash passwords
import User from "../models/userModel.js"; // Import User model
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation

export const createUser = async (req, res, next) => {
  // next lets us pass errors to the central error handler
  try {
    const { name, email, password } = req.body; // Read user input from request body

    const passwordHash = await bcrypt.hash(password, 10); // Hash password before saving

    const user = await User.create({
      name, // User name
      email, // User email
      passwordHash, // Hashed password
    });

    delete user.password_hash; // Do not send password hash back to the client

    res.status(201).json({
      message: "User created successfully", // Success message
      user, // Created user data
    });
  } catch (error) {
    next(error); // Send error to the central error handler
  }
};

export const getAllUsers = async (req, res, next) => {
  // Controller for getting all users
  try {
    const users = await User.getAllUsers(); // Call static model method directly from User class

    res.status(200).json({
      message: "Users retrieved successfully", // Success message
      users, // Return users from database
    });
  } catch (error) {
    next(error); // Send error to the central error handler
  }
};

export const getUserById = async (req, res, next) => {
  // Controller for getting one user by id
  try {
    const userId = req.params.id; // Get user id from route parameter

    const user = await User.getUserById(userId); // Call static model method directly from User class

    if (!user) {
      return res.status(404).json({
        message: "User not found", // Return 404 if no user exists with that id
      });
    }

    res.status(200).json({
      message: "User retrieved successfully", // Success message
      user, // Return found user
    });
  } catch (error) {
    next(error); // Send error to the central error handler
  }
};

export const loginUser = async (req, res, next) => {
  // Controller for user login
  try {
    const { email, password } = req.body; // Get email and password from request body
    const user = await User.login({ email, password }); // Call static login method on User class

    if (!user) {
        return res.status(401).json({
        message: "Invalid email or password", // Return 401 if login fails
        });
    }

    const accesstoken = jwt.sign(
    { id: user.id, email: user.email }, // Store user id in token
    process.env.JWT_SECRET, // Secret from .env
    { expiresIn: "1d" } // Token expiration
    );

    res.status(200).json({
        message: "Login successful", // Success message
        user, // Return user data (without password hash)
        accesstoken, // Return the generated token
    });
  } catch (error) {
    next(error); // Send error to the central error handler
  }
};