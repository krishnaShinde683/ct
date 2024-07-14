exports.SuccessResponse = async (res, message) => {
    let responsedata = {
        status: true,
        message: message
    }
    return res.status(200).json(responsedata)
}

exports.SuccessResponeWithData = async (res, message, data) => {
    let responsedata = {
        status: true,
        message: message,
        data: data
    }
    return res.status(200).json(responsedata)
}

exports.BadRequest = async (res, message) => {
    let responsedata = {
        status: false,
        message: message
    }
    return res.status(400).json(responsedata)
}

exports.NotFound = async (res, message) => {
    let responsedata = {
        status: false,
        message: message
    }
    return res.status(404).json(responsedata)
}

exports.UnAuthorized = async (res, message) => {
    let responsedata = {
        status: false,
        message: message
    }
    return res.status(401).json(responsedata)
}

exports.ErrorResponse = async (res, message) => {
    let responsedata = {
        status: false,
        message: message
    }
    return res.status(500).json(responsedata)
}

exports.ErrorResponseWithData = async (res, message, data) => {
    let responsedata = {
        status: true,
        message: message,
        data: data
    }
    return res.status(500).json(responsedata)
}
