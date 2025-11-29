import { createShow, getOrCreateGenre, addGenresToShow } from '../models/showModel.js';

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
                genres: ['Sci-Fi', 'Adventure', 'Action', 'Fantasy', 'Drama']
            },
            {
                name: 'Dune: Part 2',
                startDate: 2024,
                endDate: 2024,
                genres: ['Sci-Fi', 'Adventure', 'Action', 'Fantasy', 'Drama']
            },
            {
                name: 'Inception',
                startDate: 2010,
                endDate: 2010,
                genres: ['Sci-Fi', 'Mystery & Thriller', 'Action']
            },
            {
                name: 'Wicked',
                startDate: 2024,
                endDate: 2024,
                genres: ['Kids & Family', 'Musical', 'Fantasy', 'Adventure']
            }
        ];

        // TV Shows data from the frontend
        const tvShows = [
            {
                name: 'Breaking Bad',
                startDate: 2008,
                endDate: 2013,
                genres: ['Crime', 'Drama']
            },
            {
                name: 'Game of Thrones',
                startDate: 2011,
                endDate: 2019,
                genres: ['Fantasy', 'Drama']
            },
            {
                name: 'The Office',
                startDate: 2005,
                endDate: 2013,
                genres: ['Comedy']
            },
            {
                name: 'Stranger Things',
                startDate: 2016,
                endDate: null, // Still ongoing
                genres: ['Sci-Fi', 'Horror']
            }
        ];

        // Seed movies
        console.log('\nSeeding movies...');
        for (const movie of movies) {
            const show = await createShow(
                movie.name,
                movie.startDate,
                movie.endDate,
                'movie'
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
            const show = await createShow(
                tvShow.name,
                tvShow.startDate,
                tvShow.endDate,
                'tv-show'
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
