/**
 * Controllers - Business Logic
 * All route handlers with database interactions
 */

import { getShowsByType } from '../models/showModel.js';

// Home page handler
export function renderHome(req, res) {
    res.render('home', {
        title: 'Home - Shows Review',
        currentPage: 'home'
    });
}

// Movies page handler
export async function renderMovies(req, res) {
    try {
        // Get query parameters for sorting
        const sortBy = req.query.sort || 'name';
        // Name sorts A-Z (ascending), rating and reviews sort high to low (descending)
        const order = sortBy === 'name' ? 'asc' : 'desc';

        const movies = await getShowsByType('movie', sortBy, order);

        res.render('movies', {
            title: 'Movies - Shows Review',
            currentPage: 'movies',
            shows: movies,
            currentSort: sortBy
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load movies'
        });
    }
}

// TV Shows page handler
export async function renderTVShows(req, res) {
    try {
        // Get query parameters for sorting
        const sortBy = req.query.sort || 'name';
        // Name sorts A-Z (ascending), rating and reviews sort high to low (descending)
        const order = sortBy === 'name' ? 'asc' : 'desc';

        const tvShows = await getShowsByType('tv-show', sortBy, order);

        res.render('tv-shows', {
            title: 'TV Shows - Shows Review',
            currentPage: 'tv-shows',
            shows: tvShows,
            currentSort: sortBy
        });
    } catch (error) {
        console.error('Error fetching TV shows:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load TV shows'
        });
    }
}
