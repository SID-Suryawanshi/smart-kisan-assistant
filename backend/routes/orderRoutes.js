const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// buyer
router.post("/place", orderController.placeOrder);

// kisan
router.get("/kisan/:kisanId", orderController.getKisanOrders);

// update status
router.put("/status/:orderId", orderController.updateOrderStatus);

router.get("/buyer/:buyerId", orderController.getBuyerOrders);


module.exports = router;
