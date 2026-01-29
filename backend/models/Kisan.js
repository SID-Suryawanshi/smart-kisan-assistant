const mongoose = require("mongoose")

const kisanSchema = new mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    password : String,
    address : String
});

module.exports = mongoose.model("Kisan", kisanSchema);