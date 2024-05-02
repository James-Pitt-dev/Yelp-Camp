const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author: { //adding the user foreign key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', ReviewSchema);