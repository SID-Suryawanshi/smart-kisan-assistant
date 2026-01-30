const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getDashboardStats,
} = require("../controllers/kisanController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/dashboard/:kisanId", getDashboardStats);

module.exports = router;
