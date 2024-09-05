if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express(); // use to set up server and listen
const mongoose = require('mongoose'); // Used as ODM and mongdoDB interaction
const path = require('path'); //Helps with file paths
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const methodOverride = require('method-override'); // lets you listen for PUT/DELETE requests on POST Reqs
const ejsMate = require('ejs-mate'); // lets you use body templates
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

// routes
const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

const User = require('./models/user.js');

const secret = process.env.SECRET || 'test';
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
// app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbPassword,
    touchAfter: 24*60*60,
    crypto: {
        secret: secret
    }
});

store.on('error', function(e){
    console.log('Session Store Error: ', e);
});
const sessionConfig = { //initialize session with some options
    store: store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    //store: mongodb

}
app.use(session(sessionConfig));

app.use(passport.initialize()); //initialize it and use session for persistent log in
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // tell it to use local strat and use user model auth
passport.serializeUser(User.serializeUser()); //how d we store a user in session?
passport.deserializeUser(User.deserializeUser());
app.use(helmet()); //cybersecurity module, helps mitigate a variety of common attacks, crossorigin="anonymous" needs to be applied to media originating outside our app to work.

// HELMET SRCS **************
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnyzy8xh1/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//***************** */
app.use(flash()); //make another middleware to store flash(key, values) for global access rather than passing to each route
app.use((req, res, next) => { 
    //the flash global middleware. On every req, takes the defined key:value stored in req, then appends it to the locals object 
    // that all views have access to by default.   
    res.locals.currentUser = req.user; //add a global curUser object so log in status can be checked across pages.                        
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error'); // if no req(error) exists, it does nothing. Predefine your flash msgs
    next();
})


// Routing
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App Connected: ${PORT}`);
});
