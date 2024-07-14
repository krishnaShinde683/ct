require("dotenv").config()

module.exports={
    PORT:process.env.PORT,
    ACCESS_SECRET_KEY:process.env.ACCESS_SECRET_KEY,
    SALT:process.env.SALT,
    MONGOURL:process.env.MONGOURL,
    EXPIRESIN:process.env.EXPIRESIN

}
