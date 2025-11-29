import express from 'express';
// Import route handlers from controllers
import { renderHome, renderMovies, renderTVShows } from './index.js';
import { renderRegister, handleRegister } from './forms/registration.js';
import { renderLogin, handleLogin, handleLogout } from './forms/login.js';
import { renderRatingPage, handleRating } from './ratingController.js';
import { registerValidation, loginValidation, ratingValidation } from '../middleware/validation.js';
import { requireGuest, requireAuth } from '../middleware/auth.js';

// Create router
const router = express.Router();

// Define routes
router.get('/', renderHome);
router.get('/movies', renderMovies);
router.get('/tv-shows', renderTVShows);

// Authentication routes
router.get('/auth/register', requireGuest, renderRegister);
router.post('/auth/register', requireGuest, registerValidation, handleRegister);
router.get('/auth/login', requireGuest, renderLogin);
router.post('/auth/login', requireGuest, loginValidation, handleLogin);
router.get('/auth/logout', handleLogout);

// Rating routes
router.get('/rate/:id', requireAuth, renderRatingPage);
router.post('/rate/:id', requireAuth, ratingValidation, handleRating);

// Export router
export default router;