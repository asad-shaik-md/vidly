const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { Register } = require('../models/register');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Register.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is incorrect');

    const validpassword = await bcrypt.compare(req.body.password, user.password);
    if (!validpassword) return res.status(400).send('Email or password is incorrect');

    const token = user.generateAuthToken();

    res.send(token)
})

function validate(details) {
    const schema ={
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
    };

    return Joi.validate(details, schema);
}

module.exports = router;