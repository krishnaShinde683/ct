const mongoose = require("mongoose")

const add_to_cartSchema = new mongoose.Schema({
    product_id:{type: mongoose.Types.ObjectId },
    user_id:{type: mongoose.Types.ObjectId },
    quantity:{type:Number, required:[true, "quantity is required"] },
    status:{type:Boolean,default:true},
    created_at:{type:Date, default : Date.now()},
    updated_at:{type:Date, default : Date.now()},
})

module.exports = mongoose.model("add_to_cart",add_to_cartSchema)