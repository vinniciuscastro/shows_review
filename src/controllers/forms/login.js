import { validationResult } from 'express-validator';
import pool from '../../config/database.js';
import bcrypt from 'bcryptjs';

// ============================================
// MODEL FUNCTIONS
// ============================================

/**
 * Authenticate a user with username/email and password
 * @param {string} identifier - Username or email
 * @param {string} password - Plain text password
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
async function authenticateUser(identifier, password) {
    try {
        const query = `
            SELECT id, username, email, first_name, last_name, password_hash, created_at
            FROM users
            WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)
        `;

        const result = await pool.query(query, [identifier]);

        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return null;
        }

        // Remove password hash from returned user object
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
}

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

/**
 * Render the login page
 */
export function renderLogin(req, res) {
    res.render('forms/login/form', {
        title: 'Login',
        currentPage: 'login',
        errors: [],
        formData: {}
    });
}

/**
 * Handle user login
 */
export async function handleLogin(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('forms/login/form', {
            title: 'Login',
            currentPage: 'login',
            errors: errors.array(),
            formData: req.body
        });
    }

    const { identifier, password } = req.body;

    try {
        // Authenticate user
        const user = await authenticateUser(identifier, password);

        if (!user) {
            return res.status(401).render('forms/login/form', {
                title: 'Login',
                currentPage: 'login',
                errors: [{ msg: 'Invalid username/email or password' }],
                formData: req.body
            });
        }

        // Set up session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.firstName = user.first_name;

        // Redirect to home page
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'An error occurred during login. Please try again.'
        });
    }
}

/**
 * Handle user logout
 */
export function handleLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).render('errors/500', {
                title: 'Server Error',
                error: 'An error occurred during logout.'
            });
        }
        res.redirect('/');
    });
}
