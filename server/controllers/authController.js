// server/controllers/authController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @method  POST
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    generateToken(res, user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Authenticate a user and set a token cookie
 * @route   POST /api/auth/login
 * @method  POST
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bookmarks: user.bookmarks,
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Log out a user by clearing the token cookie
 * @route   POST /api/auth/logout
 * @method  POST
 * @access  Public
 */
const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get the authenticated user's profile
 * @route   GET /api/auth/profile
 * @method  GET
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, logoutUser, getUserProfile };
