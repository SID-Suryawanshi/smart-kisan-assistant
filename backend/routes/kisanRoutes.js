const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getDashboardStats,
} = require("../controllers/kisanController");

const {
  getWeatherData,
  getCropRecommendation,
} = require("../controllers/farmingController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/dashboard/:kisanId", getDashboardStats);

router.get("/weather/:city", getWeatherData);
router.post("/recommend-crop", getCropRecommendation);

module.exports = router;
