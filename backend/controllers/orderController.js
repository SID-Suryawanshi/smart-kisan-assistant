const Order = require("../models/Order");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { buyerId, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const ordersByKisan = {};

    for (let item of cart) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `${product.name} out of stock` });
      }

      if (!ordersByKisan[product.kisanId]) {
        ordersByKisan[product.kisanId] = [];
      }

      ordersByKisan[product.kisanId].push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      product.quantity -= item.quantity;
      await product.save();
    }

    for (let kisanId in ordersByKisan) {
      const items = ordersByKisan[kisanId];

      const totalAmount = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );

      await Order.create({
        buyerId,
        kisanId,
        items,
        totalAmount,
      });
    }

    res.json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Order failed" });
  }
};

exports.getKisanOrders = async (req, res) => {
  const orders = await Order.find({ kisanId: req.params.kisanId })
    .populate("buyerId", "name")
    .sort({ createdAt: -1 });

  res.json({ orders });
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  await Order.findByIdAndUpdate(req.params.id, { status });

  res.json({ message: "Status updated" });
};

exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyerId: req.params.buyerId,
    })
      .populate("kisanId", "name")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyer orders" });
  }
};
