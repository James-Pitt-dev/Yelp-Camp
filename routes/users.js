const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
// const { userSchema } = require('../schemas.js');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {  
    try {
        const {email, username, password} = req.body.campground;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp! ' + user.username);
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

module.exports = router;