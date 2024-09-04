
const mapboxToken = process.env.MAPBOX_TOKEN;
const Campground = require('../models/campground'); //import schema object
const {cloudinary} = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.cookie('name', 'test');
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send(); 

    const campground = new Campground(req.body.campground); // need middleware to parse body (express.Router().use)
    campground.images = req.files.map((f) => ({
            url: f.path, 
            filename: f.filename
        }));
        console.log(campground.images)
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }}).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground, loadStarsCSS: true});
};

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;    
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map((f) => ({
        url: f.path, 
        filename: f.filename
    }));
    campground.images.push(...imgs);
    console.log(req.body);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: { images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Deleted Campground: ${campground.title}`);
    res.redirect('/campgrounds');
};
