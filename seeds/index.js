const mongoose = require("mongoose");
const Campground = require("../models/campground");

const citiesArr = require('./cities');
const { places, descriptors } = require('./seedHelpers');
// const citiesArr = require('./cities');

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to database");
});

function getRandElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const newCity = getRandElement(citiesArr);
        const randPrice = Math.floor(Math.random() * 100 + 10);
        const newCamp = new Campground({
            title: `${getRandElement(descriptors)} ${getRandElement(places)}`,
            location: `${newCity.city}, ${newCity.state}`,
            price: randPrice,
            author: "60cb5212312349277816bd80",
            image: "https://source.unsplash.com/collection/483251",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi illum adipisci molestias, ut omnis sit. Officiis sed minus non nostrum, ratione placeat maiores? Repellat, asperiores illum? Sed non autem labore?",
        });
        await newCamp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})