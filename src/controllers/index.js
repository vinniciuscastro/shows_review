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
        const movies = await getShowsByType('movie');

        res.render('movies', {
            title: 'Movies - Shows Review',
            currentPage: 'movies',
            shows: movies
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
        const tvShows = await getShowsByType('tv-show');

        res.render('tv-shows', {
            title: 'TV Shows - Shows Review',
            currentPage: 'tv-shows',
            shows: tvShows
        });
    } catch (error) {
        console.error('Error fetching TV shows:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'Failed to load TV shows'
        });
    }
}
