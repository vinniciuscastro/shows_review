/**
 * Middleware to require admin access
 */
export function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        req.flash('error', 'Please login to access this page');
        return res.redirect('/auth/login');
    }

    if (!req.session.isAdmin) {
        req.flash('error', 'Access denied. Admin privileges required.');
        return res.redirect('/dashboard');
    }

    next();
}
