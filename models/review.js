const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
});

module.exports = mongoose.model('Review', ReviewSchema);