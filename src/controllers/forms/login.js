import { validationResult } from 'express-validator';
import { authenticateUser } from '../../models/forms/login.js';

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
        req.session.isAdmin = user.is_admin || false;

        // Flash success message and redirect
        req.flash('success', `Welcome back, ${user.first_name}!`);

        // Redirect admin to admin panel, regular users to dashboard
        if (user.is_admin) {
            res.redirect('/admin');
        } else {
            res.redirect('/dashboard');
        }
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
