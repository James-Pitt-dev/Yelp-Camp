module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log('session:', req.session);
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
// store originalURL in session, then pass that into locals variables. This is a workaround for passport deleting OriginalURL
// when isAuthenticated() is called.
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        console.log('session:', req.session.returnTo);
        res.locals.returnTo = req.session.returnTo;
        console.log('local:', res.locals.returnTo);
    }
    next();
}