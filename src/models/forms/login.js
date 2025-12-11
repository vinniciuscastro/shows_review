import pool from '../db.js';
import bcrypt from 'bcryptjs';

/**
 * Authenticate a user with username/email and password
 * @param {string} identifier - Username or email
 * @param {string} password - Plain text password
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export async function authenticateUser(identifier, password) {
    try {
        const query = `
            SELECT id, username, email, first_name, last_name, password_hash, is_admin, created_at
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
