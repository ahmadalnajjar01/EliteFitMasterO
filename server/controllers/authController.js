const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, given_name, family_name } = ticket.getPayload();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // Return existing user + token
      const token = generateToken(existingUser.id);
      return res.json({ success: true, user: existingUser, token });
    }

    // Otherwise, create new user
    const newUser = await User.create({
      firstName: given_name,
      lastName: family_name,
      email,
    });
    const token = generateToken(newUser.id);

    return res.json({ success: true, user: newUser, token });
  } catch (error) {
    console.error("Google login error:", error); // Make sure you log the error
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Return token in the response
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return token in the response
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Get user details from database
    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "firstName", "lastName", "email"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.logout = (req, res) => {
  // Since the token is not stored in cookies, there's no need to clear it
  res.json({ success: true, message: "Logged out successfully" });
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and is an admin
    if (!user || user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Invalid credentials or not an admin" });
    }

    // Check if password is correct (for non-Google auth users)
    if (user.password && !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is activated
    if (!user.isActivated) {
      return res.status(403).json({ message: "Account not activated" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActivated: user.isActivated,
    };

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};
