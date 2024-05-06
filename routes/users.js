const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
// const { userSchema } = require('../schemas.js');
const users = require('../controllers/users');

router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.registerUser));

router.get('/login', users.renderLogin);

// call passport authenticate method, using the local or google or whatever strategy, 
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(users.login));

router.get('/logout', users.logout); 

// if (!req.isAuthenticated()){
//     req.flash('error', 'Logout Failed: You Are Not Logged In');
//    return res.redirect('/campgrounds');
// }

module.exports = router;