import { validationResult } from 'express-validator';
import { getShowById } from '../models/showModel.js';
import { addOrUpdateReview, getUserReviewForShow } from '../models/rating.js';

/**
 * Render the rating page for a show
 * Allows both logged-in users and guests to access
 */
export async function renderRatingPage(req, res) {
    const showId = req.params.id;
    const userId = req.session.userId || null;
    const isGuest = !userId;

    try {
        const show = await getShowById(showId);

        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/');
        }

        // Check if logged-in user has already rated this show
        let existingReview = null;
        if (userId) {
            existingReview = await getUserReviewForShow(showId, userId);
        }

        res.render('rating/form', {
            title: `Rate ${show.name}`,
            currentPage: 'rating',
            show: show,
            existingReview: existingReview,
            isGuest: isGuest,
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
 * Supports both logged-in users and guests
 */
export async function handleRating(req, res) {
    const showId = req.params.id;
    const userId = req.session.userId || null;
    const isGuest = !userId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        try {
            const show = await getShowById(showId);
            const existingReview = userId ? await getUserReviewForShow(showId, userId) : null;

            return res.status(400).render('rating/form', {
                title: `Rate ${show.name}`,
                currentPage: 'rating',
                show: show,
                existingReview: existingReview,
                isGuest: isGuest,
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
        // Add or update the review (userId can be null for guests)
        await addOrUpdateReview(showId, userId, score, description);

        // Flash success message
        if (isGuest) {
            req.flash('success', 'Your review has been submitted! Create an account to manage your reviews.');
        } else {
            req.flash('success', 'Your review has been submitted successfully!');
        }

        // Redirect - guests go to the show's reviews page, logged-in users go to dashboard
        if (isGuest) {
            return res.redirect(`/reviews/${showId}`);
        } else {
            return res.redirect('/dashboard');
        }
    } catch (error) {
        console.error('Rating submission error:', error);
        req.flash('error', 'An error occurred while submitting your review');
        return res.redirect(`/rate/${showId}`);
    }
}
