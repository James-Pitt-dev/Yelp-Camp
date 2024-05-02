const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground'); //import schema object
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');
const {validateReview, isLoggedIn} = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id; //after review is validated, add the currentUser ID to review data
    campground.reviews.push(review);
    await Promise.all([
            review.save(),
        campground.save()
    ]);
    req.flash('success', 'Review Posted!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync( async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;