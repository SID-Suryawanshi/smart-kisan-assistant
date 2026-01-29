const express = require("express");
const router = express.Router();
const {
  add,
  getMyProducts,
  update,
  remove
} = require("../controllers/productController");

router.post("/add", add);
router.get("/my-products/:id", getMyProducts);
router.put("/update/:id", update);
router.delete("/remove/:id", remove);


module.exports = router;
