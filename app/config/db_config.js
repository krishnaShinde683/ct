const mongoose = require("mongoose")
const config= require("./config");
mongoose.connect(config.MONGOURL,{useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("DB connection established");
}).catch((error)=>console.log("Error connecting to MongoDB",error))