const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 5000;

const kisanRoutes = require("./routes/kisanRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes")


app.use("/api/kisan", kisanRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes)



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
