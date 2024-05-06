const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground'); //import schema object
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){//we check if req has authentication object appended to it by passport
        req.session.returnTo = req.originalUrl;
        console.log('session:', req.session);
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
// store originalURL in session, then pass that into locals variables. This is a workaround for passport deleting OriginalURL
// when isAuthenticated() is called.
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        console.log('session:', req.session.returnTo);
        res.locals.returnTo = req.session.returnTo;
        console.log('local:', res.locals.returnTo);
    }
    next();
}
// URL: /campgrounds/id
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params; //we take the id from the url
    const campground = await Campground.findById(id); //we find the campground matching it
    if(!campground.author.equals(req.user._id)){ //if the author id of that campground is not the requesters id
        req.flash('error', 'You do not have permission to do that!'); 
        return res.redirect(`/campgrounds/${id}`); //give error, redirect.
    }
    next(); // if it matches, continue on with next logic
}
// we use the joi library to make sure incoming data models follow the defined schema constraints
module.exports.validateCampground = (req, res, next) => { // Joi: Server-side validation middleware
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
//joi
module.exports.validateReview = (req, res, next) => { 
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//URL: /campgrounds/id/review/reviewId
module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params; //we take the id from the url
    const review = await Review.findById(reviewId); //we find the campground matching it
    if(!review.author.equals(req.user._id)){ //if the author id of that campground is not the requesters id
        req.flash('error', 'You do not have permission to do that!'); 
        return res.redirect(`/campgrounds/${id}`); //give error, redirect.
    }
    next(); // if it matches, continue on with next logic
}