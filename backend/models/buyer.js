const mongoose = require("mongoose")

const buyerSchema = new mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    password : String,
    address : String
});

module.exports = mongoose.model("Buyer", buyerSchema)