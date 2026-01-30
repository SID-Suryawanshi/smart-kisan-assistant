const express = require("express");
const router = express.Router();
const {
  add,
  getMyProducts,
  update,
  remove,
} = require("../controllers/productController");

const upload = require("../middlewares/upload");

router.post("/add", upload.single("image"), add);
router.get("/my-products/:id", getMyProducts);
router.put("/update/:id", update);
router.delete("/remove/:id", remove);

module.exports = router;
