const mongoose = require('mongoose');
const Schema = mongoose.Schema; // shortcut for schema
const Review = require("./review");

const CampgroundSchema = new Schema({
    title: String,
    price: {
        type: Number,
        min: 0
    },
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
})

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});


const Campground = new mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;