
const { user_model } = require("../model")
const api_response = require("../helper/response")
const utility = require("../helper/utility")
const auth_jwt = require("../middleware/auth_jwt")


exports.user_sign_up = async (req, res) => {
  try {
    if(req.body?.confirm_password!=req.body?.password){
        return api_response.BadRequest(res,"password and confirm password not match")
    }
    req.body.created_at = new Date()
    req.body.updated_at = new Date()
    let hash_password = await utility.create_hash(req.body?.password)
    req.body.password = hash_password
    let user = await user_model.create(req.body)
    let data = {
      email: user.email,
      _id: user._id
    }
    
    let token = await auth_jwt.generateAuthToken(data)
    let userUpdate = await user_model.findByIdAndUpdate({ _id: user._id }, { token: token }, { new: true }).select({ password: 0 })
    return api_response.SuccessResponeWithData(res, "user registered successfully", userUpdate)
  } catch (error) {
    if (error.code == 11000) return api_response.BadRequest(res, "email is already in use");
    return api_response.ErrorResponse(res, error.message);
  }
}

exports.user_login = async (req, res) => {
  try {

    let { email, password } = req.body
    const user = await user_model.findOne({ email: email })
    if (!user) return api_response.NotFound(res, 'Invalid email or password');
    
    const isMatch = await utility.pass_compare(password, user?.password);
    if (!isMatch) return api_response.UnAuthorized(res, 'Invalid email or password')
    
    let data = {
      email: user.email,
      _id: user._id
    }
    let token = await auth_jwt.generateAuthToken(data)
    let userUpdate = await user_model.findByIdAndUpdate({ _id: user._id }, { token: token }, { new: true }).select({ password: 0 })

    return api_response.SuccessResponeWithData(res, 'User Login Success', userUpdate);
  } catch (error) {
    return api_response.ErrorResponse(res, error.message);
  }
}


exports.user_detail = async (req, res) => {
  try {
    const user = await user_model.findById({ _id: req.myId }).select({ password: 0 })
    if (!user) return api_response.NotFound(res, 'Something Went Wrong');
    return api_response.SuccessResponeWithData(res, 'User detail fetched', user);

  } catch (error) {
    return api_response.ErrorResponse(res, error.message);
  }
}

exports.user_update = async (req, res) => {
  try {
    let updateobj = {
        updated_at: new Date()
    }
    if (req.body?.firstName) {
      updateobj.firstName = req.body?.firstName
    }
    if (req.body?.lastName) {
      updateobj.lastName = req.body?.lastName
    }
    if (req.body?.user_name) {
        updateobj.user_name = req.body?.user_name
      }

    if (Object.keys(req?.body)?.length === 0 && !req?.file) {
      delete updateobj.updated_at
    }
    if (req?.file) {
      updateobj.profile_pic = req.file.path.replace(/\\/g, "/")
    }
    const user = await user_model.findByIdAndUpdate({ _id: req.myId }, updateobj, { new: true }).select({ password: 0 })
    if (!user) return api_response.NotFound(res, 'Something Went Wrong');
    return api_response.SuccessResponeWithData(res, 'User update Successfully', user);

  } catch (error) {
    console.log(error);
    return api_response.ErrorResponse(res, error.message);
  }
}
