const express = require("express");
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require("../controllers/kisanController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile)

module.exports = router;
