import express from 'express';
// Import route handlers from controllers
import { renderHome, renderMovies, renderTVShows } from './index.js';

// Create router
const router = express.Router();

// Define routes
router.get('/', renderHome);
router.get('/movies', renderMovies);
router.get('/tv-shows', renderTVShows);

// Export router
export default router;