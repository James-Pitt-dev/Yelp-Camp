const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
// const { userSchema } = require('../schemas.js');

router.get('/register', (req, res) => {
    res.render('users/register');
})

module.exports = router;