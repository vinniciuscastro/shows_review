/**
 * Routes Controller
 * All route handlers in one place
 */

// Home page handler
export function renderHome(req, res) {
    res.render('home', {
        title: 'Home - Shows Review',
        currentPage: 'home'
    });
}

// Movies page handler
export function renderMovies(req, res) {
    res.render('movies', {
        title: 'Movies - Shows Review',
        currentPage: 'movies'
    });
}

// TV Shows page handler
export function renderTVShows(req, res) {
    res.render('tv-shows', {
        title: 'TV Shows - Shows Review',
        currentPage: 'tv-shows'
    });
}
