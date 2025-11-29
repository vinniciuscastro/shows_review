import pool from '../config/database.js';

/**
 * Add or update a review for a show
 */
export async function addOrUpdateReview(showId, userId, score, description) {
    try {
        const query = `
            INSERT INTO reviews (show_id, user_id, score, description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (show_id, user_id)
            DO UPDATE SET score = $3, description = $4, created_at = CURRENT_TIMESTAMP
            RETURNING *
        `;

        const result = await pool.query(query, [showId, userId, score, description]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding/updating review:', error);
        throw error;
    }
}

/**
 * Get user's review for a specific show
 */
export async function getUserReviewForShow(showId, userId) {
    try {
        const query = `
            SELECT * FROM reviews
            WHERE show_id = $1 AND user_id = $2
        `;

        const result = await pool.query(query, [showId, userId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting user review:', error);
        throw error;
    }
}

/**
 * Get all reviews by a user
 */
export async function getUserReviews(userId) {
    try {
        const query = `
            SELECT
                r.id,
                r.show_id,
                r.score,
                r.description,
                r.created_at,
                s.name as show_name,
                s.media_type,
                s.start_date,
                s.image_url
            FROM reviews r
            JOIN shows s ON r.show_id = s.id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC
        `;

        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error getting user reviews:', error);
        throw error;
    }
}

/**
 * Delete a user's review for a specific show
 */
export async function deleteReview(showId, userId) {
    try {
        const query = `
            DELETE FROM reviews
            WHERE show_id = $1 AND user_id = $2
            RETURNING *
        `;

        const result = await pool.query(query, [showId, userId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
}

/**
 * Get all reviews for a specific show
 */
export async function getAllReviewsForShow(showId) {
    try {
        const query = `
            SELECT
                r.id,
                r.show_id,
                r.user_id,
                r.score,
                r.description,
                r.created_at,
                u.username,
                u.first_name,
                u.last_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.show_id = $1
            ORDER BY r.created_at DESC
        `;

        const result = await pool.query(query, [showId]);
        return result.rows;
    } catch (error) {
        console.error('Error getting all reviews for show:', error);
        throw error;
    }
}
