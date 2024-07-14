
const { add_to_cart_model } = require("../model")
const api_response = require("../helper/response")
const ObjectId = require("mongoose").Types.ObjectId

exports.add_product_in_cart = async (req, res) => {
    try {
        if (!req.body?.product_id) { return api_response.BadRequest(res, "please provide product_id") }
        if (!req.body?.quantity) { return api_response.BadRequest(res, "please provide quantity") }
        req.body.created_at = new Date()
        req.body.updated_at = new Date()
        req.body.user_id=req.myId
        let cartResult
        let check = await add_to_cart_model.findOne({product_id:req.body?.product_id,user_id:req.myId})
        if(check){
            let quantity=check.quantity+req.body.quantity
             cartResult = await add_to_cart_model.findByIdAndUpdate({_id:check?._id},{quantity:quantity},{new:true})
             return api_response.SuccessResponeWithData(res, 'Product added in cart successfully', cartResult);
        }
         cartResult = await add_to_cart_model.create(req.body)
        return api_response.SuccessResponeWithData(res, 'Product added in cart successfully', cartResult);
    } catch (error) {
        console.log(error)
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.get_all_productOfcart = async (req, res) => {
    try {
        let query={}
        let filter=[
            {$match:query},
            {
              $lookup: {
                from: "products",
                let: { id: "$product_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$id", "$_id"] } } },
                  { $project: { name:1,price:1,created_by:1 } },
                  {
                    $lookup:{
                        from: "users",
                        let: { id: "$created_by" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$$id", "$_id"] } } },
                            { $project: { user_name:1,email:1,image:1 } },
                        ],
                        as: "sellerDetail"
                    }
                  },
                  {
                      $unwind: {
                          path: "$sellerDetail", preserveNullAndEmptyArrays: true
                      }
                  }
                  
                ],
                as: "productDetail"
              }
            },
            {
                $unwind: {
                    path: "$productDetail", preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    total_amount:{$multiply:[ "$quantity","$productDetail.price"]}
                }
            }
        ]
        let productResult = await add_to_cart_model.aggregate(filter).sort({ created_at: "desc" })
        return api_response.SuccessResponeWithData(res, 'Cart list generated successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

