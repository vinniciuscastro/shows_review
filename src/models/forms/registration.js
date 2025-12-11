import pool from '../db.js';
import bcrypt from 'bcryptjs';

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} password - User's plain text password
 * @returns {Promise<Object>} The created user object (without password)
 */
export async function registerUser(username, email, firstName, lastName, password) {
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
export async function usernameExists(username) {
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
export async function emailExists(email) {
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
