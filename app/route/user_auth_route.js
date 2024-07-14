const route= require("express").Router()
const authjwt = require("../middleware/auth_jwt")
// const file_uploader =require("../helper/file_uploader")
const controller=require("../controller/user_auth_controller")
const { userRegisterSchema, userLoginSchema, validate}=require("../middleware/validation")

route.post("/sign-up", validate(userRegisterSchema), controller.user_sign_up)
route.post("/login", validate(userLoginSchema), controller.user_login)
route.get("/profile-detail",authjwt.verifyToken,controller.user_detail)
// route.put("/profile-update",authjwt.verifyToken, file_uploader.uploadFile().singleUpload("profile_pic"),controller.user_update)//multer process remaining
// route.get("/get-all-users-with-order-and-product", authjwt.verifyToken, controller.get_all_user_with_order_and_product)

module.exports=route
