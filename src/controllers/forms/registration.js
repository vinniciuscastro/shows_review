import { validationResult } from 'express-validator';
import pool from '../../config/database.js';
import bcrypt from 'bcryptjs';

// ============================================
// MODEL FUNCTIONS
// ============================================

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} password - User's plain text password
 * @returns {Promise<Object>} The created user object (without password)
 */
async function registerUser(username, email, firstName, lastName, password) {
    try {
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (username, email, first_name, last_name, password_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, first_name, last_name, created_at
        `;

        const result = await pool.query(query, [
            username.toLowerCase(),
            email.toLowerCase(),
            firstName,
            lastName,
            passwordHash
        ]);

        return result.rows[0];
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

/**
 * Check if a username already exists
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} True if username exists, false otherwise
 */
async function usernameExists(username) {
    try {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM users WHERE LOWER(username) = LOWER($1)
            ) as exists
        `;

        const result = await pool.query(query, [username]);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking username existence:', error);
        throw error;
    }
}

/**
 * Check if an email already exists
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
async function emailExists(email) {
    try {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM users WHERE LOWER(email) = LOWER($1)
            ) as exists
        `;

        const result = await pool.query(query, [email]);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking email existence:', error);
        throw error;
    }
}

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

/**
 * Render the registration page
 */
export function renderRegister(req, res) {
    res.render('forms/registration/form', {
        title: 'Register',
        currentPage: 'register',
        errors: [],
        formData: {}
    });
}

/**
 * Handle user registration
 */
export async function handleRegister(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('forms/registration/form', {
            title: 'Register',
            currentPage: 'register',
            errors: errors.array(),
            formData: req.body
        });
    }

    const { username, email, firstName, lastName, password } = req.body;

    try {
        // Check if username already exists
        const usernameTaken = await usernameExists(username);
        if (usernameTaken) {
            return res.status(400).render('forms/registration/form', {
                title: 'Register',
                currentPage: 'register',
                errors: [{ msg: 'Username is already taken' }],
                formData: req.body
            });
        }

        // Check if email already exists
        const emailTaken = await emailExists(email);
        if (emailTaken) {
            return res.status(400).render('forms/registration/form', {
                title: 'Register',
                currentPage: 'register',
                errors: [{ msg: 'Email is already registered' }],
                formData: req.body
            });
        }

        // Register the user
        const user = await registerUser(username, email, firstName, lastName, password);

        // Set up session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.firstName = user.first_name;

        // Redirect to home page
        res.redirect('/');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'An error occurred during registration. Please try again.'
        });
    }
}
