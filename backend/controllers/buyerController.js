const Buyer = require("../models/buyer");
const Products = require("../models/Product");

exports.signup = async (req, res) => {
  try {
    const buyer = new Buyer(req.body);
    await buyer.save();

    res.status(201).json({
      message: "Buyer registered successfully",
      buyer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const buyer = await Buyer.findOne({ email });

    if (!buyer) {
      return res.status(404).json({
        message: "buyer not found",
      });
    }

    if (buyer.password !== password) {
      return res.status(404).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      Role: "buyer",
      buyerId: buyer._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  const buyerId = req.params.id;

  try {
    const buyer = await Buyer.findById(buyerId).select("-password");

    if (!buyer) {
      return res.status(404).json({
        message: "Buyer not found",
      });
    }

    res.json(buyer);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

exports.updateProfile = async (req, res) => {
  const buyerId = req.params.id;

  try {
    const buyer = await Buyer.findById(buyerId).select("-password");

    if (!buyer) {
      return res.status(404).json({
        message: "buyer not found",
      });
    }

    buyer.name = req.body.name || buyer.name;
    buyer.phone = req.body.phone || buyer.phone;
    buyer.address = req.body.address || buyer.address;

    await buyer.save();

    res.status(200).json({
      message: "Profile updated successfully",
      kisan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getProducts = async function (req, res) {
  try {
    const products = await Products.find().populate("kisanId", "name");

    console.log(products);

    res.status(200).json({
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
