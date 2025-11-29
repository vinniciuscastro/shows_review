import pool from '../config/database.js';

/**
 * Create all database tables
 */
export async function createTables() {
    try {
        console.log('Creating database tables...');

        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Users table created');

        // Create shows table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS shows (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                start_date INTEGER NOT NULL,
                end_date INTEGER,
                media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('movie', 'tv-show')),
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Shows table created');

        // Create genres table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS genres (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Genres table created');

        // Create show_genres junction table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS show_genres (
                show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
                genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
                PRIMARY KEY (show_id, genre_id)
            )
        `);
        console.log('✓ Show_genres junction table created');

        // Create votes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id SERIAL PRIMARY KEY,
                show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                score DECIMAL(3, 1) NOT NULL CHECK (score >= 1 AND score <= 10),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(show_id, user_id)
            )
        `);
        console.log('✓ Votes table created');

        // Create index on votes for better performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_votes_show_id ON votes(show_id)
        `);
        console.log('✓ Indexes created');

        console.log('All tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

/**
 * Drop all tables (use with caution!)
 */
export async function dropTables() {
    try {
        console.log('Dropping all tables...');

        await pool.query('DROP TABLE IF EXISTS votes CASCADE');
        await pool.query('DROP TABLE IF EXISTS show_genres CASCADE');
        await pool.query('DROP TABLE IF EXISTS genres CASCADE');
        await pool.query('DROP TABLE IF EXISTS shows CASCADE');
        await pool.query('DROP TABLE IF EXISTS users CASCADE');

        console.log('All tables dropped successfully!');
    } catch (error) {
        console.error('Error dropping tables:', error);
        throw error;
    }
}
