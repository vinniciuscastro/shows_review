import { getShowById } from '../models/showModel.js';

/**
 * Render the review choice page
 * Allows users to choose between logging in or posting as a guest
 */
export async function renderReviewChoice(req, res) {
    const showId = req.params.id;

    try {
        const show = await getShowById(showId);

        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/');
        }

        res.render('review', {
            title: `Review ${show.name}`,
            currentPage: 'review',
            show: show
        });
    } catch (error) {
        console.error('Error rendering review choice page:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load review options'
        });
    }
}
