import { getShowById } from '../models/showModel.js';
import { getAllReviewsForShow, deleteReview } from '../models/rating.js';

/**
 * Render all reviews for a show
 */
export async function renderShowReviews(req, res) {
    const showId = req.params.id;

    try {
        const show = await getShowById(showId);

        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/');
        }

        const reviews = await getAllReviewsForShow(showId);

        res.render('reviews/show-reviews', {
            title: `Reviews - ${show.name}`,
            currentPage: 'reviews',
            show: show,
            reviews: reviews
        });
    } catch (error) {
        console.error('Error rendering show reviews:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load reviews'
        });
    }
}

/**
 * Handle deleting a review from the reviews page
 */
export async function handleDeleteReviewFromShowPage(req, res) {
    const showId = req.params.id;
    const userId = req.session.userId;

    try {
        const deletedReview = await deleteReview(showId, userId);

        if (!deletedReview) {
            req.flash('error', 'Review not found or you do not have permission to delete it');
            return res.redirect(`/reviews/${showId}`);
        }

        req.flash('success', 'Review deleted successfully!');
        res.redirect(`/reviews/${showId}`);
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'An error occurred while deleting your review');
        res.redirect(`/reviews/${showId}`);
    }
}
