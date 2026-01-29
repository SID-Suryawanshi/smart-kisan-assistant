const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
  getProducts,
} = require("../controllers/buyerController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/products", getProducts);

module.exports = router;
