const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground'); //import schema object
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviews = require('../controllers/reviews.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;