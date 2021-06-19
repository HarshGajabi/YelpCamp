const User = require("../models/user");

const exp = module.exports;

exp.renderRegisterForm = (req, res) => {
    res.render("users/register.ejs")
}

exp.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campgrounds");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

exp.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

exp.loginUser = (req, res) => {
    req.flash("success", "Welcome back to YelpCamp!");
    const redirectUrl = req.session.returnToUrl || "/campgrounds";
    delete req.session.returnToUrl;
    res.redirect(redirectUrl);
}

exp.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out")
    res.redirect("/campgrounds");
}