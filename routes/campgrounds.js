const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground'); //import schema object
const { campgroundSchema } = require('../schemas.js');

const requestTime = (req, res, next) => { // unnecessary, just cool
    req.requestTime = Date.now();
    req.realDate = new Date(Date.now()).toLocaleString();
    console.log(req.realDate);
    next();
}

const validateCampground = (req, res, next) => { // Joi: Server-side validation middleware
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', requestTime, catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.cookie('name', 'test');
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
        // if(!req.body.campground){throw new ExpressError('Invalid Campground Data', 400)}
        const campground = new Campground(req.body.campground); // need middleware to parse body (express.Router().use)
        await campground.save();
        res.redirect(`campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;    
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;