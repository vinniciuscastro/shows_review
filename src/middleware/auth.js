/**
 * Middleware to check if user is authenticated
 * Redirects to login page if not authenticated
 */
export function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

/**
 * Middleware to check if user is a guest (not authenticated)
 * Redirects to home page if already authenticated
 */
export function requireGuest(req, res, next) {
    if (req.session && req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}

/**
 * Middleware to make user data available to all views
 * Adds isAuthenticated and user object to res.locals
 */
export function setUserLocals(req, res, next) {
    if (req.session && req.session.userId) {
        res.locals.isAuthenticated = true;
        res.locals.user = {
            id: req.session.userId,
            username: req.session.username,
            firstName: req.session.firstName,
            isAdmin: req.session.isAdmin || false
        };
    } else {
        res.locals.isAuthenticated = false;
        res.locals.user = null;
    }
    next();
}
