const mongoose = require("mongoose")

const productImageSchema = new mongoose.Schema({
    product_id:{type: mongoose.Types.ObjectId},
    image:{type: String, default:""},
    type:{type: String, default:""},
    created_at:{type:Date, default : Date.now()},
    updated_at:{type:Date, default : Date.now()},
})

module.exports = mongoose.model("productImage",productImageSchema)