const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    first_name:{ type : String, required:[true, "first_name is required"]},
    last_name:{ type : String, required:[true, "last_name is required"]},
    user_name:{type:String, required:[true, "user_name is required"] },
    email:{type:String,unique:true, required:[true, "email is required"], lowercase:true },
    password:{type:String, required:[true, "password is required"] },
    image:{type:String, default : "" },
    token:{type:String, default : "" },
    status:{type:Boolean,default:true},
    created_at:{type:Date, default : Date.now()},
    updated_at:{type:Date, default : Date.now()},
})

module.exports = mongoose.model("user",userSchema)