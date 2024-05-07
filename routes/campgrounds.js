const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground'); //import schema object
const { campgroundSchema } = require('../schemas.js');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js');
// controllers
const campgrounds = require('../controllers/campgrounds.js');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const requestTime = (req, res, next) => { // unnecessary, just cool. Logs date when client connects
    req.requestTime = Date.now();
    req.realDate = new Date(Date.now()).toLocaleString();
    console.log(req.realDate);
    next();
}
//order of routes matter
// Using the router.route().get().put().chaining.. as example of being even more concise in our code
router.route('/')
    .get(requestTime, catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;