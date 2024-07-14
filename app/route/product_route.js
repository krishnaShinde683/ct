const route= require("express").Router()
const authjwt = require("../middleware/auth_jwt")
const controller = require("../controller/product_controller")
const { productSchema, validate}=require("../middleware/validation")

const fs = require("fs");
const multer =require("multer")

const now = Date.now();
  
      const localStorage = multer.diskStorage({
        destination: function (req, file, cb) {
          let folderName=file?.fieldname
          let dir = `public/assets/${folderName}`;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        
        filename: function (req, file, cb) {
          cb(null, `${now}-${file.fieldname}-${file.originalname}`);
        },
        
      });
  
      const uploadLocal = multer({
         storage: localStorage,
         limits: {
         fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
         },
      });
    //   validate(productSchema),

route.post("/create",  authjwt.verifyToken, uploadLocal.array("image",10), validate(productSchema), controller.create_product)
route.get("/list", authjwt.verifyToken, controller.get_all_product)
route.get("/myproduct-list", authjwt.verifyToken, controller.get_all_myproduct)
route.get("/detail/:id", authjwt.verifyToken, controller.get_product_detail)
route.put("/update/", authjwt.verifyToken, controller.product_update)
route.delete("/delete/:id", authjwt.verifyToken, controller.product_delete)
route.post("/csv-import",uploadLocal.array("csv",1), controller.add_data_using_csv)

module.exports=route
