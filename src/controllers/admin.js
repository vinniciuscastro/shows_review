import { validationResult } from 'express-validator';
import { createShow, getOrCreateGenre, addGenresToShow, getShowById } from '../models/showModel.js';
import pool from '../models/db.js';

/**
 * Render admin panel
 */
export async function renderAdminPanel(req, res) {
    try {
        // Get all shows
        const query = `
            SELECT s.id, s.name, s.start_date, s.end_date, s.media_type, s.image_url,
                   ARRAY_AGG(DISTINCT g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL) as genres
            FROM shows s
            LEFT JOIN show_genres sg ON s.id = sg.show_id
            LEFT JOIN genres g ON sg.genre_id = g.id
            GROUP BY s.id
            ORDER BY s.media_type, s.name
        `;
        const result = await pool.query(query);

        res.render('admin/panel', {
            title: 'Admin Panel',
            currentPage: 'admin',
            shows: result.rows
        });
    } catch (error) {
        console.error('Error rendering admin panel:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load admin panel'
        });
    }
}

/**
 * Render add show form
 */
export function renderAddShowForm(req, res) {
    res.render('admin/add-show', {
        title: 'Add Show',
        currentPage: 'admin',
        errors: [],
        formData: {}
    });
}

/**
 * Handle adding a new show
 */
export async function handleAddShow(req, res) {
    const { name, startDate, endDate, mediaType, imageUrl, genres} = req.body;

    try {
        // Create the show
        const show = await createShow(
            name,
            parseInt(startDate),
            endDate ? parseInt(endDate) : null,
            mediaType,
            imageUrl || null
        );

        // Add genres if provided
        if (genres && genres.trim()) {
            const genreList = genres.split(',').map(g => g.trim());
            const genreIds = [];

            for (const genreName of genreList) {
                const genre = await getOrCreateGenre(genreName);
                genreIds.push(genre.id);
            }

            await addGenresToShow(show.id, genreIds);
        }

        req.flash('success', `Successfully added ${mediaType === 'movie' ? 'movie' : 'TV show'}: ${name}`);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding show:', error);
        req.flash('error', 'Failed to add show');
        res.redirect('/admin/add-show');
    }
}

/**
 * Render edit show form
 */
export async function renderEditShowForm(req, res) {
    const showId = req.params.id;

    try {
        const show = await getShowById(showId);

        if (!show) {
            req.flash('error', 'Show not found');
            return res.redirect('/admin');
        }

        res.render('admin/edit-show', {
            title: `Edit ${show.name}`,
            currentPage: 'admin',
            show: show,
            errors: [],
            formData: show
        });
    } catch (error) {
        console.error('Error rendering edit form:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load edit form'
        });
    }
}

/**
 * Handle editing a show
 */
export async function handleEditShow(req, res) {
    const showId = req.params.id;
    const { name, startDate, endDate, mediaType, imageUrl, genres } = req.body;

    try {
        // Update the show
        const updateQuery = `
            UPDATE shows
            SET name = $1, start_date = $2, end_date = $3, media_type = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;

        await pool.query(updateQuery, [
            name,
            parseInt(startDate),
            endDate ? parseInt(endDate) : null,
            mediaType,
            imageUrl || null,
            showId
        ]);

        // Update genres
        if (genres !== undefined) {
            // Delete existing genre associations
            await pool.query('DELETE FROM show_genres WHERE show_id = $1', [showId]);

            // Add new genres
            if (genres.trim()) {
                const genreList = genres.split(',').map(g => g.trim());
                const genreIds = [];

                for (const genreName of genreList) {
                    const genre = await getOrCreateGenre(genreName);
                    genreIds.push(genre.id);
                }

                await addGenresToShow(showId, genreIds);
            }
        }

        req.flash('success', `Successfully updated: ${name}`);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error editing show:', error);
        req.flash('error', 'Failed to update show');
        res.redirect(`/admin/edit/${showId}`);
    }
}

/**
 * Handle deleting a show
 */
export async function handleDeleteShow(req, res) {
    const showId = req.params.id;

    try {
        await pool.query('DELETE FROM shows WHERE id = $1', [showId]);
        req.flash('success', 'Show deleted successfully');
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting show:', error);
        req.flash('error', 'Failed to delete show');
        res.redirect('/admin');
    }
}

/**
 * Handle deleting a guest review (admin only)
 */
export async function handleDeleteGuestReview(req, res) {
    const reviewId = req.params.id;

    try {
        // Get the show_id before deleting so we can redirect back
        const getReviewQuery = 'SELECT show_id FROM reviews WHERE id = $1 AND user_id IS NULL';
        const reviewResult = await pool.query(getReviewQuery, [reviewId]);

        if (reviewResult.rows.length === 0) {
            req.flash('error', 'Guest review not found');
            return res.redirect('/admin');
        }

        const showId = reviewResult.rows[0].show_id;

        // Delete the guest review
        await pool.query('DELETE FROM reviews WHERE id = $1 AND user_id IS NULL', [reviewId]);

        req.flash('success', 'Guest review deleted successfully');
        res.redirect(`/reviews/${showId}`);
    } catch (error) {
        console.error('Error deleting guest review:', error);
        req.flash('error', 'Failed to delete guest review');
        res.redirect('/admin');
    }
}
