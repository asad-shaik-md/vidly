const Joi = require('joi');
const mongoose = require('mongoose');

const Register = mongoose.model('Register', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}))

function validateRegister(details) {
    const schema ={
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
    };

    return Joi.validate(details, schema);
}

exports.Register = Register;
exports.validate = validateRegister;