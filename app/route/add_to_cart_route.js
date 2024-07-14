const route= require("express").Router()
const authjwt = require("../middleware/auth_jwt")
const controller=require("../controller/add_to_cart_controller")


route.post("/create",  authjwt.verifyToken, controller.add_product_in_cart)
route.get("/list", authjwt.verifyToken, controller.get_all_productOfcart)


module.exports=route
