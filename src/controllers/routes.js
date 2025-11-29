import express from 'express';
// Import route handlers from controllers
import { renderHome, renderMovies, renderTVShows } from './index.js';
import { renderRegister, handleRegister } from './forms/registration.js';
import { renderLogin, handleLogin, handleLogout } from './forms/login.js';
import { renderRatingPage, handleRating } from './rating.js';
import { renderDashboard, handleDeleteReview } from './dashboard.js';
import { renderAdminPanel, renderAddShowForm, handleAddShow, renderEditShowForm, handleEditShow, handleDeleteShow } from './admin.js';
import { renderShowReviews, handleDeleteReviewFromShowPage } from './reviews.js';
import { registerValidation, loginValidation, ratingValidation } from '../middleware/validation.js';
import { requireGuest, requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

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

// Dashboard routes
router.get('/dashboard', requireAuth, renderDashboard);
router.post('/review/delete/:id', requireAuth, handleDeleteReview);

// Rating routes
router.get('/rate/:id', requireAuth, renderRatingPage);
router.post('/rate/:id', requireAuth, ratingValidation, handleRating);

// Reviews routes
router.get('/reviews/:id', renderShowReviews);
router.post('/reviews/:id/delete', requireAuth, handleDeleteReviewFromShowPage);

// Admin routes
router.get('/admin', requireAdmin, renderAdminPanel);
router.get('/admin/add-show', requireAdmin, renderAddShowForm);
router.post('/admin/add-show', requireAdmin, handleAddShow);
router.get('/admin/edit/:id', requireAdmin, renderEditShowForm);
router.post('/admin/edit/:id', requireAdmin, handleEditShow);
router.post('/admin/delete/:id', requireAdmin, handleDeleteShow);

// Export router
export default router;