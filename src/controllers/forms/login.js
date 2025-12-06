import { validationResult } from 'express-validator';
import { authenticateUser } from '../../models/forms/login.js';

/**
 * Render the login page
 */
export function renderLogin(req, res) {
    const redirect = req.query.redirect || null;

    res.render('forms/login/form', {
        title: 'Login',
        currentPage: 'login',
        errors: [],
        formData: {},
        redirect: redirect
    });
}

/**
 * Handle user login
 */
export async function handleLogin(req, res) {
    const errors = validationResult(req);
    const redirect = req.body.redirect || req.query.redirect || null;

    if (!errors.isEmpty()) {
        return res.status(400).render('forms/login/form', {
            title: 'Login',
            currentPage: 'login',
            errors: errors.array(),
            formData: req.body,
            redirect: redirect
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
                formData: req.body,
                redirect: redirect
            });
        }

        // Set up session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.firstName = user.first_name;
        req.session.isAdmin = user.is_admin || false;

        // Flash success message
        req.flash('success', `Welcome back, ${user.first_name}!`);

        // Redirect based on redirect parameter or default behavior
        if (redirect) {
            res.redirect(redirect);
        } else if (user.is_admin) {
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
