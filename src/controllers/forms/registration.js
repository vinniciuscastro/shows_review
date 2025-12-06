import { validationResult } from 'express-validator';
import { registerUser, usernameExists, emailExists } from '../../models/forms/registration.js';

/**
 * Render the registration page
 */
export function renderRegister(req, res) {
    const redirect = req.query.redirect || null;

    res.render('forms/registration/form', {
        title: 'Register',
        currentPage: 'register',
        errors: [],
        formData: {},
        redirect: redirect
    });
}

/**
 * Handle user registration
 */
export async function handleRegister(req, res) {
    const errors = validationResult(req);
    const redirect = req.body.redirect || req.query.redirect || null;

    if (!errors.isEmpty()) {
        return res.status(400).render('forms/registration/form', {
            title: 'Register',
            currentPage: 'register',
            errors: errors.array(),
            formData: req.body,
            redirect: redirect
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
                formData: req.body,
                redirect: redirect
            });
        }

        // Check if email already exists
        const emailTaken = await emailExists(email);
        if (emailTaken) {
            return res.status(400).render('forms/registration/form', {
                title: 'Register',
                currentPage: 'register',
                errors: [{ msg: 'Email is already registered' }],
                formData: req.body,
                redirect: redirect
            });
        }

        // Register the user
        const user = await registerUser(username, email, firstName, lastName, password);

        // Set up session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.firstName = user.first_name;

        // Flash success message
        req.flash('success', `Welcome to Shows Review, ${user.first_name}!`);

        // Redirect based on redirect parameter or default to dashboard
        if (redirect) {
            res.redirect(redirect);
        } else {
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('errors/500', {
            title: 'Server Error',
            error: 'An error occurred during registration. Please try again.'
        });
    }
}
