import { getUserReviews, deleteReview } from '../models/rating.js';

/**
 * Render user dashboard with their reviews
 */
export async function renderDashboard(req, res) {
    try {
        const reviews = await getUserReviews(req.session.userId);

        res.render('forms/login/dashboard', {
            title: 'My Dashboard',
            currentPage: 'dashboard',
            reviews: reviews,
            user: {
                username: req.session.username,
                firstName: req.session.firstName
            }
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load dashboard'
        });
    }
}

/**
 * Handle review deletion
 */
export async function handleDeleteReview(req, res) {
    const showId = req.params.id;
    const userId = req.session.userId;

    try {
        const deletedReview = await deleteReview(showId, userId);

        if (!deletedReview) {
            req.flash('error', 'Review not found or you do not have permission to delete it');
            return res.redirect('/dashboard');
        }

        req.flash('success', 'Review deleted successfully!');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'An error occurred while deleting your review');
        res.redirect('/dashboard');
    }
}
