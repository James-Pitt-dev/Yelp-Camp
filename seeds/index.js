require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const dbPassword = process.env.DATABASE_PASSWORD;
const userID = process.env.USER_ID;
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

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
    //Make the DB empty
    await Campground.deleteMany({});
    //Random entries img:483251
   for(let i =0; i<200;i++){
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
        author: '6629c348b8f425604264885a',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        price, 
        geometry: {
            type:"Point",
            coordinates:[cities[random1000].longitude, cities[random1000].latitude]
        },
        images: [
            {
              url: 'https://res.cloudinary.com/dnyzy8xh1/image/upload/v1715288265/Yelpcamp/rgidyhsg7nehqjor5ayn.jpg',
              filename: 'Yelpcamp/rpubwsgo7cb0mpoxr0he'
            },
            {
              url: 'https://res.cloudinary.com/dnyzy8xh1/image/upload/v1715288266/Yelpcamp/ouqmynpfrpyr17szvxyr.jpg',
              filename: 'Yelpcamp/ouqmynpfrpyr17szvxyr'
            }
          ],
        description: `
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda accusantium non dolorem veritatis ipsam corporis quibusdam at, quas repellat doloremque, quo distinctio sit, quaerat optio illo blanditiis! Sunt, architecto nulla?`,
    })
    await camp.save();
   }    
}

seedDB().then(() => mongoose.connection.close()).catch(e => {console.log(e)});