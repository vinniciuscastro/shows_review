import { validationResult } from 'express-validator';
import pool from '../config/database.js';
import { getShowById } from '../models/showModel.js';

// ============================================
// MODEL FUNCTIONS
// ============================================

/**
 * Add or update a vote for a show
 */
async function addOrUpdateVote(showId, userId, score, description) {
    try {
        const query = `
            INSERT INTO votes (show_id, user_id, score, description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (show_id, user_id)
            DO UPDATE SET score = $3, description = $4, created_at = CURRENT_TIMESTAMP
            RETURNING *
        `;

        const result = await pool.query(query, [showId, userId, score, description]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding/updating vote:', error);
        throw error;
    }
}

/**
 * Get user's vote for a specific show
 */
async function getUserVoteForShow(showId, userId) {
    try {
        const query = `
            SELECT * FROM votes
            WHERE show_id = $1 AND user_id = $2
        `;

        const result = await pool.query(query, [showId, userId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting user vote:', error);
        throw error;
    }
}

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

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
        const existingVote = await getUserVoteForShow(showId, req.session.userId);

        res.render('rating/form', {
            title: `Rate ${show.name}`,
            currentPage: 'rating',
            show: show,
            existingVote: existingVote,
            errors: [],
            formData: existingVote || {}
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
            const existingVote = await getUserVoteForShow(showId, req.session.userId);

            return res.status(400).render('rating/form', {
                title: `Rate ${show.name}`,
                currentPage: 'rating',
                show: show,
                existingVote: existingVote,
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
        // Add or update the vote
        await addOrUpdateVote(showId, req.session.userId, score, description);

        // Flash success message
        req.flash('success', 'Your rating has been submitted successfully!');

        // Redirect back to the show's page
        const show = await getShowById(showId);
        if (show.media_type === 'movie') {
            return res.redirect('/movies');
        } else {
            return res.redirect('/tv-shows');
        }
    } catch (error) {
        console.error('Rating submission error:', error);
        req.flash('error', 'An error occurred while submitting your rating');
        return res.redirect(`/rate/${showId}`);
    }
}
