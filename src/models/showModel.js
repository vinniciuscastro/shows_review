import pool from './db.js';

/**
 * Get all shows by media type (movie or tv-show) with optional sorting
 * @param {string} mediaType - 'movie' or 'tv-show'
 * @param {string} sortBy - 'name', 'rating', or 'reviews' (default: 'name')
 * @param {string} order - 'asc' or 'desc' (default: 'asc')
 */
export async function getShowsByType(mediaType, sortBy = 'name', order = 'asc') {
    try {
        // Validate sortBy to prevent SQL injection
        const allowedSortFields = {
            'name': 's.name',
            'rating': 'average_score',
            'reviews': 'review_count'
        };

        const sortField = allowedSortFields[sortBy] || 's.name';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

        const query = `
            SELECT
                s.id,
                s.name,
                s.start_date,
                s.end_date,
                s.media_type,
                s.image_url,
                COALESCE(ROUND(AVG(r.score), 1), 0) as average_score,
                COUNT(DISTINCT r.id) as review_count,
                ARRAY_AGG(DISTINCT g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL) as genres
            FROM shows s
            LEFT JOIN show_genres sg ON s.id = sg.show_id
            LEFT JOIN genres g ON sg.genre_id = g.id
            LEFT JOIN reviews r ON s.id = r.show_id
            WHERE s.media_type = $1
            GROUP BY s.id, s.name, s.start_date, s.end_date, s.media_type, s.image_url
            ORDER BY ${sortField} ${sortOrder}
        `;

        const result = await pool.query(query, [mediaType]);
        return result.rows;
    } catch (error) {
        console.error('Error getting shows by type:', error);
        throw error;
    }
}

/**
 * Get a show by ID with all details
 */
export async function getShowById(showId) {
    try {
        const query = `
            SELECT
                s.id,
                s.name,
                s.start_date,
                s.end_date,
                s.media_type,
                s.image_url,
                COALESCE(ROUND(AVG(r.score), 1), 0) as average_score,
                COUNT(DISTINCT r.id) as review_count,
                ARRAY_AGG(DISTINCT g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL) as genres
            FROM shows s
            LEFT JOIN show_genres sg ON s.id = sg.show_id
            LEFT JOIN genres g ON sg.genre_id = g.id
            LEFT JOIN reviews r ON s.id = r.show_id
            WHERE s.id = $1
            GROUP BY s.id, s.name, s.start_date, s.end_date, s.media_type, s.image_url
        `;

        const result = await pool.query(query, [showId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting show by ID:', error);
        throw error;
    }
}

/**
 * Add a review for a show
 */
export async function addReview(showId, userId, score) {
    try {
        const query = `
            INSERT INTO reviews (show_id, user_id, score)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await pool.query(query, [showId, userId, score]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

/**
 * Create a new show
 */
export async function createShow(name, startDate, endDate, mediaType, imageUrl = null) {
    try {
        const query = `
            INSERT INTO shows (name, start_date, end_date, media_type, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const result = await pool.query(query, [name, startDate, endDate, mediaType, imageUrl]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating show:', error);
        throw error;
    }
}

/**
 * Add genres to a show
 */
export async function addGenresToShow(showId, genreIds) {
    try {
        const values = genreIds.map((genreId, index) =>
            `($1, $${index + 2})`
        ).join(', ');

        const query = `
            INSERT INTO show_genres (show_id, genre_id)
            VALUES ${values}
        `;

        await pool.query(query, [showId, ...genreIds]);
    } catch (error) {
        console.error('Error adding genres to show:', error);
        throw error;
    }
}

/**
 * Get or create a genre by name
 */
export async function getOrCreateGenre(genreName) {
    try {
        // First try to get existing genre
        let result = await pool.query('SELECT * FROM genres WHERE name = $1', [genreName]);

        if (result.rows.length > 0) {
            return result.rows[0];
        }

        // If not exists, create it
        result = await pool.query(
            'INSERT INTO genres (name) VALUES ($1) RETURNING *',
            [genreName]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error getting or creating genre:', error);
        throw error;
    }
}
