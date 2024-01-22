const express = require('express');
const app = express(); // use to set up server and listen
const mongoose = require('mongoose'); // Used as ODM and mongdoDB interaction
const path = require('path'); //Helps with file paths
const methodOverride = require('method-override'); // lets you listen for PUT/DELETE requests on POST Reqs
const morgan = require('morgan'); // logging middleware, just for fun
const ejsMate = require('ejs-mate'); // lets you use body templates
const cities = require('./seeds/cities');
const seedHelpers = require('./seeds/seedHelpers'); // dreate dummy db
//cd C:\\Users\\James\\OneDrive\\Documents\\SCHOOL\\VSCode\\Udemy\\YelpCamp
const Campground = require('./models/campground'); //import schema object
//mongodb://127.0.0.1:27017/yelp-camp
//mongodb+srv://jamespitt1:cTiHNKFp4QSL9x6B@cluster0.eimml8f.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://jamespitt1:cTiHNKFp4QSL9x6B@cluster0.eimml8f.mongodb.net/?retryWrites=true&w=majority')
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
app.engine('ejs', ejsMate); //tell express we want to use ejs-mate as engine
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
