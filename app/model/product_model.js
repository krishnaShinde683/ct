const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{type:String, required:[true, "name is required"] },
    description:{type:String, default : "" },
    price:{type:Number, required:[true, "price is required"] },
    quantity:{type:Number, required:[true, "quantity is required"] },
    csv:{type:String, default : "" },
    status:{type:Boolean,default:true},
    is_delete:{type:Boolean, default:false},
    created_by:{type: mongoose.Types.ObjectId },
    created_at:{type:Date, default : Date.now()},
    updated_at:{type:Date, default : Date.now()},
})

module.exports = mongoose.model("product",productSchema)