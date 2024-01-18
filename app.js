const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan'); // logging middleware, just for fun
const cities = require('./seeds/cities');
const seedHelpers = require('./seeds/seedHelpers');
//cd C:\\Users\\James\\OneDrive\\Documents\\SCHOOL\\VSCode\\Udemy\\YelpCamp
const Campground = require('./models/campground');
//mongodb://127.0.0.1:27017/yelp-camp
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log(`Connected to DB: ${mongoose.connection.db.databaseName}`);
    })
    .catch((err) => {
        console.log(`Mongoose Error: ${err}`);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    req.realDate = new Date(Date.now()).toLocaleString();
    console.log(req.realDate);
    next();
}
// APP SETTINGS
app.set('view engine', 'ejs');
app.set('path', path.join(__dirname, 'views'));
// MIDDLEWARE
app.use(express.urlencoded({extended: true})); // To parse req.body
app.use(methodOverride('_method')); // To enable PUT/PATCH requests. Pass in string pattern we want app to watch for.
app.use(morgan('tiny'));
// 

// ROUTE HANDLING
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', requestTime, async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground); // need middleware to parse body (app.use)
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
});

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;    
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.get('/api', (req, res) => {
    const locations = [];
    for(let i =0; i<10;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const loc = {
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        }
        locations.push(loc);
    }
    res.json(locations);
});
// app.get('', (req, res) => {
    
// });

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({title: 'My Backyard', decription: 'Cheap Camping' });
    await camp.save();
    res.send(camp);
});

app.use((req, res) => {
    res.status(404).send('Error: Not Found');
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App Connected: ${PORT}`);
});
