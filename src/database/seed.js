import { createShow, getOrCreateGenre, addGenresToShow } from '../models/showModel.js';
import pool from '../config/database.js';

/**
 * Check if a show already exists by name and media type
 */
async function showExists(name, mediaType) {
    const query = 'SELECT EXISTS(SELECT 1 FROM shows WHERE LOWER(name) = LOWER($1) AND media_type = $2) as exists';
    const result = await pool.query(query, [name, mediaType]);
    return result.rows[0].exists;
}

/**
 * Seed the database with initial shows and movies
 */
export async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

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
        console.log('\nSeeding movies...');
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
            console.log(`✓ Created movie: ${movie.name}`);

            // Add genres
            const genreIds = [];
            for (const genreName of movie.genres) {
                const genre = await getOrCreateGenre(genreName);
                genreIds.push(genre.id);
            }
            await addGenresToShow(show.id, genreIds);
            console.log(`  Added ${movie.genres.length} genres`);
        }

        // Seed TV shows
        console.log('\nSeeding TV shows...');
        for (const tvShow of tvShows) {
            // Check if TV show already exists
            if (await showExists(tvShow.name, 'tv-show')) {
                console.log(`⊘ Skipped (already exists): ${tvShow.name}`);
                continue;
            }

            const show = await createShow(
                tvShow.name,
                tvShow.startDate,
                tvShow.endDate,
                'tv-show',
                tvShow.imageUrl
            );
            console.log(`✓ Created TV show: ${tvShow.name}`);

            // Add genres
            const genreIds = [];
            for (const genreName of tvShow.genres) {
                const genre = await getOrCreateGenre(genreName);
                genreIds.push(genre.id);
            }
            await addGenresToShow(show.id, genreIds);
            console.log(`  Added ${tvShow.genres.length} genres`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log(`Seeded ${movies.length} movies and ${tvShows.length} TV shows`);
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}
