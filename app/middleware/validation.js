const Joi = require('joi');

// User registration validation schema
const userRegisterSchema = Joi.object({
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    user_name: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
        .min(8).max(30).required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
        .message('Password must be between 8 and 30 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    confirm_password: Joi.string().required()
});

// User login validation schema
const userLoginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
});



// Product creation validation schema
const productSchema = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().min(1).required(),
    quantity: Joi.number().min(1).required(),
    description: Joi.string().trim().required(),
});


function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req?.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        next();
    };
}

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    productSchema,
    validate
};