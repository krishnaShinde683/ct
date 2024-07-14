const Router = require("express").Router()

Router.use("/user/",require("./user_auth_route"))
Router.use("/product/",require("./product_route"))
Router.use("/add-to-cart/",require("./add_to_cart_route"))



module.exports=Router