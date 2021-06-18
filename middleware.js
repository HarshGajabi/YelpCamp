module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl
        req.session.returnToUrl = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

// module.exports.isAuthor = (req, res, next) {
//     const { id } = req.params;
//     const camp = 
// }