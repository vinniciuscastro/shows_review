import { createShow, getOrCreateGenre, addGenresToShow } from '../models/showModel.js';
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Check if a show already exists by name and media type
 */
async function showExists(name, mediaType) {
    const query = 'SELECT EXISTS(SELECT 1 FROM shows WHERE LOWER(name) = LOWER($1) AND media_type = $2) as exists';
    const result = await pool.query(query, [name, mediaType]);
    return result.rows[0].exists;
}

/**
 * Seed admin user
 */
async function seedAdmin() {
    try {
        // Check if admin already exists
        const checkQuery = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) as exists';
        const checkResult = await pool.query(checkQuery, ['admin_user']);

        if (checkResult.rows[0].exists) {
            
            return;
        }

        // Create admin user
        const passwordHash = await bcrypt.hash('1234', 10);
        const query = `
            INSERT INTO users (username, email, first_name, last_name, password_hash, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, username
        `;

        const result = await pool.query(query, [
            'admin_user',
            'admin@showsreview.com',
            'Admin',
            'User',
            passwordHash,
            true
        ]);

       
    } catch (error) {
        console.error('Error seeding admin:', error);
        throw error;
    }
}

/**
 * Seed the database with initial shows and movies
 */
export async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Seed admin user first
        console.log('\nSeeding admin user...');
        await seedAdmin();

        // Movies data from the frontend
        const movies = [
            {
                name: 'Dune: Part 1',
                startDate: 2021,
                endDate: 2021,
                genres: ['Sci-Fi', 'Adventure', 'Action', 'Fantasy', 'Drama'],
                imageUrl: '/images/Dune_1.jpg'
            },
            {
                name: 'Dune: Part 2',
                startDate: 2024,
                endDate: 2024,
                genres: ['Sci-Fi', 'Adventure', 'Action', 'Fantasy', 'Drama'],
                imageUrl: '/images/dune_2.jpg'
            },
            {
                name: 'Inception',
                startDate: 2010,
                endDate: 2010,
                genres: ['Sci-Fi', 'Mystery & Thriller', 'Action'],
                imageUrl: '/images/inception.jpg'
            },
            {
                name: 'Wicked',
                startDate: 2024,
                endDate: 2024,
                genres: ['Kids & Family', 'Musical', 'Fantasy', 'Adventure'],
                imageUrl: '/images/wicked.jpg'
            }
        ];

        // TV Shows data from the frontend
        const tvShows = [
            {
                name: 'Breaking Bad',
                startDate: 2008,
                endDate: 2013,
                genres: ['Crime', 'Drama'],
                imageUrl: '/images/breaking_bad.jpg'
            },
            {
                name: 'Game of Thrones',
                startDate: 2011,
                endDate: 2019,
                genres: ['Fantasy', 'Drama'],
                imageUrl: '/images/got.jpg'
            },
            {
                name: 'The Office',
                startDate: 2005,
                endDate: 2013,
                genres: ['Comedy'],
                imageUrl: '/images/the_office.jpg'
            },
            {
                name: 'Stranger Things',
                startDate: 2016,
                endDate: null, // Still ongoing
                genres: ['Sci-Fi', 'Horror'],
                imageUrl: '/images/stranger_things.jpg'
            }
        ];

        // Seed movies
        for (const movie of movies) {
            // Check if movie already exists
            if (await showExists(movie.name, 'movie')) {
                console.log(`⊘ Skipped (already exists): ${movie.name}`);
                continue;
            }

            const show = await createShow(
                movie.name,
                movie.startDate,
                movie.endDate,
                'movie',
                movie.imageUrl
            );
            

            // Add genres
            const genreIds = [];
            for (const genreName of movie.genres) {
                const genre = await getOrCreateGenre(genreName);
                genreIds.push(genre.id);
            }
            await addGenresToShow(show.id, genreIds);
            
        }

        // Seed TV shows
        console.log('\nSeeding TV shows...');
        for (const tvShow of tvShows) {
            // Check if TV show already exists
            if (await showExists(tvShow.name, 'tv-show')) {
                continue;
            }

            const show = await createShow(
                tvShow.name,
                tvShow.startDate,
                tvShow.endDate,
                'tv-show',
                tvShow.imageUrl
            );
            

            // Add genres
            const genreIds = [];
            for (const genreName of tvShow.genres) {
                const genre = await getOrCreateGenre(genreName);
                genreIds.push(genre.id);
            }
            await addGenresToShow(show.id, genreIds);
            
        }

        
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}
