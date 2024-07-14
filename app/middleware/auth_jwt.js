const api_response = require("../helper/response")
const EnvConfig = require("../config/config");
const jwt = require("jsonwebtoken")

exports.generateAuthToken = async (userData) => {
  return jwt.sign(userData, EnvConfig.ACCESS_SECRET_KEY, { expiresIn: EnvConfig.EXPIRESIN })
}

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return api_response.UnAuthorized(res, "No token provide!")
  jwt.verify(token, EnvConfig.ACCESS_SECRET_KEY, async (err, decoded) => {
    if (err) return api_response.UnAuthorized(res, "refreshtoken")
    req.myId = decoded._id;
    next()
  })
}