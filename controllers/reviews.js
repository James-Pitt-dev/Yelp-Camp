const Campground = require('../models/campground'); //import schema object
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
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
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review!');
    res.redirect(`/campgrounds/${id}`);
}