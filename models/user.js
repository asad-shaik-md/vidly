const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema ={
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;