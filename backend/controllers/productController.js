const Product = require("../models/Product");

exports.add = async (req, res) => {
  console.log("Request Body : ", req.body);
  console.log("Rested file : ", req.file);

  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      image: req.file.filename,
      kisanId: req.body.kisanId,
    });

    await product.save();
    // console.log(product);

    res.status(201).json({
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};

exports.getMyProducts = async (req, res) => {
  const kisanId = req.params.id;

  try {
    const products = await Product.find({ kisanId });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;

    await product.save();

    res.json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log("Deleted : ", deletedProduct);

    res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
