import { validationResult } from 'express-validator';
import { getShowById } from '../models/showModel.js';
import { addOrUpdateReview, getUserReviewForShow } from '../models/rating.js';

/**
 * Render the rating page for a show
 */
export async function renderRatingPage(req, res) {
    const showId = req.params.id;

    try {
        const show = await getShowById(showId);

        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/');
        }

        // Check if user has already rated this show
        const existingReview = await getUserReviewForShow(showId, req.session.userId);

        res.render('rating/form', {
            title: `Rate ${show.name}`,
            currentPage: 'rating',
            show: show,
            existingReview: existingReview,
            errors: [],
            formData: existingReview || {}
        });
    } catch (error) {
        console.error('Error rendering rating page:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load rating page'
        });
    }
}

/**
 * Handle rating submission
 */
export async function handleRating(req, res) {
    const showId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        try {
            const show = await getShowById(showId);
            const existingReview = await getUserReviewForShow(showId, req.session.userId);

            return res.status(400).render('rating/form', {
                title: `Rate ${show.name}`,
                currentPage: 'rating',
                show: show,
                existingReview: existingReview,
                errors: errors.array(),
                formData: req.body
            });
        } catch (error) {
            console.error('Error in validation:', error);
            return res.status(500).render('errors/500', {
                title: 'Server Error',
                error: 'An error occurred'
            });
        }
    }

    const { score, description } = req.body;

    try {
        // Add or update the review
        await addOrUpdateReview(showId, req.session.userId, score, description);

        // Flash success message
        req.flash('success', 'Your review has been submitted successfully!');

        // Redirect to dashboard
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Rating submission error:', error);
        req.flash('error', 'An error occurred while submitting your review');
        return res.redirect(`/rate/${showId}`);
    }
}
