
const { product_model, product_image_model } = require("../model")
const api_response = require("../helper/response")
const ObjectId = require("mongoose").Types.ObjectId
const fs = require("fs");
const {parse}  = require("csv-parse");

exports.create_product = async (req, res) => {
    try {
        req.body.created_at = new Date()
        req.body.updated_at = new Date()
        req.body.created_by = req.myId
        let productResult = await product_model.create(req.body)

        if (req?.files?.length) {
            let arr = req?.files
            req.body.product_id = productResult._id
            for (const iterator of arr) {
                req.body.image = iterator?.path.replace(/\\/g, "/")
                await product_image_model.create(req.body)
            }
        }
        return api_response.SuccessResponeWithData(res, 'Product created successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.get_all_product = async (req, res) => {
    try {
        let query = { is_delete: false }
        let filter = [
            { $match: query },
            {
                $lookup: {
                    from: "productimages",
                    let: { id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$id", "$product_id"] } } },
                        { $project: { image: 1 } }
                    ],
                    as: "productimagelist"
                }
            }
        ]
        let productResult = await product_model.aggregate(filter).sort({ created_at: "desc" })
        return api_response.SuccessResponeWithData(res, 'Product list generated successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.get_all_myproduct = async (req, res) => {
    try {
        let query = { is_delete: false, created_by: new ObjectId(req.myId) }
        let filter = [
            { $match: query },
            {
                $lookup: {
                    from: "productimages",
                    let: { id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$id", "$product_id"] } } },
                        { $project: { image: 1 } }
                    ],
                    as: "productimagelist"
                }
            }
        ]
        let productResult = await product_model.aggregate(filter).sort({ created_at: "desc" })
        return api_response.SuccessResponeWithData(res, 'Product list generated successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.get_product_detail = async (req, res) => {
    try {
        if (!req.params?.id) { return api_response.BadRequest(res, "please provide id") }
        let query = { _id: new ObjectId(req.params?.id) }
        let filter = [
            { $match: query },
            {
                $lookup: {
                    from: "productimages",
                    let: { id: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$id", "$product_id"] } } },
                        { $project: { image: 1 } }
                    ],
                    as: "productimagelist"
                }
            }
        ]
        let productResult = await product_model.aggregate(filter)
        if (!productResult?.length) { return api_response.NotFound(res, "Something Went Wrong") }
        return api_response.SuccessResponeWithData(res, 'Product detail generated successfully', productResult[0]);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.product_update = async (req, res) => {
    try {
        if (!req.body?.id) { return api_response.BadRequest(res, "please provide id") }
        let updateobj = {
            updated_at: new Date()
        }
        if (req.body?.name) {
            updateobj.name = req.body?.name
        }
        if (req.body?.price) {
            updateobj.price = req.body?.price
        }
        if (req.body?.quantity) {
            updateobj.quantity = req.body?.quantity
        }
        if (req.body?.description) {
            updateobj.description = req.body?.description
        }

        if (Object.keys(req?.body)?.length === 0) {
            delete updateobj.updated_at
        }

        let productResult = await product_model.findByIdAndUpdate({ _id: req.body?.id }, updateobj, { new: true })
        if (!productResult) { return api_response.NotFound(res, "Something Went Wrong") }
        return api_response.SuccessResponeWithData(res, 'Product update successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.product_delete = async (req, res) => {
    try {
        if (!req.params?.id) { return api_response.BadRequest(res, "please provide id") }
        let productResult = await product_model.findByIdAndUpdate({ _id: req.params?.id }, { is_delete: true, updated_at: new Date() }, { new: true })
        if (!productResult) { return api_response.NotFound(res, "Something Went Wrong") }
        return api_response.SuccessResponeWithData(res, 'Product delete successfully', productResult);
    } catch (error) {
        return api_response.ErrorResponse(res, error.message)
    }
}

exports.add_data_using_csv = async (req, res) => {
    try {
        // const uploadedFilePath = "ctn_foody.products.csv";
        let uploadedFilePath 
        const errorLogFilePath = "error.log";
        const invoiceDetails = [];
        if(req?.files){
            uploadedFilePath=req.files[0]?.path
        }
        fs.createReadStream(uploadedFilePath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", async function (row) {
                try {
                    const obj = {
                        _id: row[0],
                        name: row[1],
                        description: row[2],
                        price: parseInt(row[3]),
                        quantity: parseInt(row[4]),
                        csv: row[5],
                        status: row[6],
                        is_delete: row[10],
                        created_by: row[11],
                        created_at: row[7],
                        updated_at: row[8]
                    };
                    await product_model.create(obj);
                    invoiceDetails.push(obj);
                } catch (err) {
                    console.error("Error importing data:", err);
                    fs.appendFileSync(errorLogFilePath, `${err}\n`);
                }
            })
            .on("end", function () {
                console.log("Import finished");
                return api_response.SuccessResponeWithData(res, 'File imported successfully',  invoiceDetails );
            })
            .on("error", function (error) {
                console.error("Error reading CSV:", error.message);
                if (error.code === 11000) {
                    return api_response.BadRequest(res, "ID is already in use");
                }
                return api_response.ErrorResponse(res, error.message);
            });
    } catch (error) {
        if (error.code === 11000) {
            return api_response.BadRequest(res, "ID is already in use");
        } else {
            return api_response.ErrorResponse(res, error.message);
        }
    }
}

exports.add_data_using_csv = async (req, res) => {
    try {
        // const uploadedFilePath = "ctn_foody.products.csv";
        let uploadedFilePath 
        const errorLogFilePath = "error.log";
        const invoiceDetails = [];
        if(req?.files){
            uploadedFilePath=req.files[0]?.path
        }
        
        fs.createReadStream(uploadedFilePath)
            .pipe(parse({}))
            .on("data", async function (row) {
                try {
                 invoiceDetails.push(row)
                } catch (err) {
                    console.error("Error importing data:", err);
                    fs.appendFileSync(errorLogFilePath, `${err}\n`);
                }
            })
            
            .on("end", async function () {
               try {
                console.log("Import finished");
                let flag =true
                let header=[]
                let finaldata=[]
                for (let iterator of invoiceDetails) {
                    if(flag){
                        header=iterator
                        flag=false
                        continue;
                    }
                    let count=0;
                    let obj={}
                    for (let index of iterator) {
                        obj[header[count]]=index
                        count++
                    }
                    finaldata.push(obj)
                }
                await product_model.create(finaldata)
                const htmlResponse = `
                    <html>
                        <head>
                            <title>Product Invoice Details</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                }
                                h1 {
                                    text-align: center;
                                    color: #333;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin: 20px auto;
                                }
                                th, td {
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    text-align: left;
                                }
                                th {
                                    background-color: #f2f2f2;
                                    color: #333;
                                }
                                tr:nth-child(even) {
                                    background-color: #f9f9f9;
                                }
                                tr:hover {
                                    background-color: #f5f5f5;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>Product Invoice Details</h1>
                            <table>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                                ${finaldata.map(product => `
                                    <tr>
                                        <td>${product._id}</td>
                                        <td>${product.name}</td>
                                        <td>${product.description}</td>
                                        <td>${product.quantity}</td>
                                        <td>${product.price}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </body>
                    </html>
                `;
                // res.setHeader('Content-Type', 'text/html');
                // res.status(200).send(htmlResponse);
                return api_response.SuccessResponeWithData(res, 'File imported successfully',  finaldata );
               } catch (error) {
                console.log(error)
                if (error.code === 11000) {
                    return api_response.BadRequest(res, "ID is already in use");
                }
                return api_response.ErrorResponse(res, error.message);
               }
            })
            .on("error", function (error) {
                console.error("Error reading CSV:", error.message);
                return api_response.ErrorResponse(res, error);
            });
    } catch (error) {
        if (error.code === 11000) {
            return api_response.BadRequest(res, "ID is already in use");
        } else {
            return api_response.ErrorResponse(res, error.message);
        }
    }
}

