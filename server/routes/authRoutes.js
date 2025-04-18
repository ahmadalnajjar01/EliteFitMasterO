const express = require("express");
const {
  signup,
  login,
  getProfile,
  logout,
  googleLogin,
  adminLogin,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Authentication Routes
router.post("/google-login", googleLogin);
router.post("/register", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", logout);
router.post("/admin/login", adminLogin);

module.exports = router;
