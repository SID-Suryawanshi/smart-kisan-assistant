const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  reviews: [
    {
      buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  
  averageRating: { type: Number, default: 0 },

  kisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kisan",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
