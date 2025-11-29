import { getUserReviews } from '../models/rating.js';

/**
 * Render user dashboard with their reviews
 */
export async function renderDashboard(req, res) {
    try {
        const reviews = await getUserReviews(req.session.userId);

        res.render('dashboard', {
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
