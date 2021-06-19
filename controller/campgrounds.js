const Campground = require('../models/campground');

const exp = module.exports;

exp.index = async (req, res) => {
    const allCamps = await Campground.find({});
    res.render("campgrounds/index.ejs", { allCamps });
};

exp.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
};

exp.createCamp = async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully created a new campground!")
    res.redirect(`/campgrounds/${newCamp._id}`);
};

exp.showCamp = async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!currCamp) {
        req.flash("error", "Cannot find the requested Campground!")
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { camp: currCamp });
};

exp.showEditForm = async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id);
    if (!currCamp) {
        req.flash("error", "Cannot find the requested Campground!");
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit.ejs", { camp: currCamp });
}

exp.editCamp = async (req, res) => {
    const { id } = req.params;
    const oldCamp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "Successfully edited the campground!")
    res.redirect(`/campgrounds/${oldCamp._id}`);
}

exp.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const oldCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!")
    res.redirect(`/campgrounds`);
}