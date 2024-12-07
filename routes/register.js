const auth = require('../middleware/auth')
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { Register, validate } = require('../models/register');

router.get('/me', auth,  async (req, res) => {
    const user = await Register.findById(req.user._id).select('-password');
    res.send(user)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Register.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    let details = new Register(_.pick(req.body, [ 'name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    details.password = await bcrypt.hash(details.password, salt)

    await details.save();

    const token = details.generateAuthToken();
        
    res.header('x-auth-token', token).send(_.pick(details, ['_id', 'name', 'email']));
})

module.exports = router;