const express = require('express');
const app = express(); // use to set up server and listen
const mongoose = require('mongoose'); // Used as ODM and mongdoDB interaction
require('dotenv').config();
const path = require('path'); //Helps with file paths
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const methodOverride = require('method-override'); // lets you listen for PUT/DELETE requests on POST Reqs
const morgan = require('morgan'); // logging middleware, just for fun
const ejsMate = require('ejs-mate'); // lets you use body templates

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const apiKey = process.env.API_KEY;
const dbPassword = process.env.DATABASE_PASSWORD;


mongoose.connect(dbPassword, {})
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

// APP SETTINGS
app.engine('ejs', ejsMate); //tell express we want to use ejs-mate as engine
app.set('view engine', 'ejs');
app.set('path', path.join(__dirname, 'views'));
// MIDDLEWARE
app.use(express.urlencoded({extended: true})); // To parse req.body
app.use(methodOverride('_method')); // To enable PUT/PATCH requests. Pass in string pattern we want app to watch for.
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
// 
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
// ROUTE HANDLING
app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
}) 

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Oh No, Something Went Wrong!';
    }
    res.status(statusCode).render('errors', {err});
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App Connected: ${PORT}`);
});
