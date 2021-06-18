const mongoose = require("mongoose");
const Schema = mongoose.Schema; // shortcut for schema

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;