const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dnyzy8xh1/image/upload/c_thumb,g_face,h_300,w_600/v1715289584/Yelpcamp/lx3xzvp0ped1pceqrnil.jpg
// ImageSchema so we can make virtual thumbnails for our edit page, optional
const ImageSchema = new Schema({
    
    url: String,
    filename: String
        
});
// create a virtual thumbnail property we can query for transformed images without storing them in db
ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/h_300,w_600');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [
      ImageSchema
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({_id: {$in: doc.reviews}})
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);