# 📅 4-Week Development Roadmap
## Detailed Week-by-Week Plan

---

# 🏗️ Week 1: Foundation & Database Setup
**Timeline:** Days 1-7
**Goal:** Set up project structure, database, and basic MVC architecture
**Focus:** Database design, MVC setup, basic routing

## Day 1-2: Database Design & Setup

### Tasks:
- [ ] Install PostgreSQL (if not already installed)
- [ ] Create `shows_review` database
- [ ] Design database schema with 3 main tables:
  - **users** table
  - **shows** table (for TV shows and movies)
  - **reviews** table
- [ ] Create `database/schema.sql` file
- [ ] Implement proper relationships (foreign keys)
- [ ] Add indexes for performance

### Database Schema Example:
```sql
-- users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- shows table
CREATE TABLE shows (
    show_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('movie', 'tv_show')),
    genre VARCHAR(50),
    release_year INT,
    description TEXT,
    poster_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    show_id INT REFERENCES shows(show_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    guest_name VARCHAR(100),  -- for guest reviews
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Deliverables:
- ✅ PostgreSQL installed and running
- ✅ Database created
- ✅ schema.sql file created
- ✅ Tables created with proper relationships

---

## Day 3-4: MVC Structure & Database Connection

### Tasks:
- [ ] Create MVC folder structure (models, views, controllers)
- [ ] Install required packages: `pg`, `dotenv`, `ejs`
- [ ] Create `.env` file for database credentials
- [ ] Create `src/models/database.js` for DB connection
- [ ] Implement connection pooling
- [ ] Test database connection

### Code to Write:

**`.env` file:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shows_review
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
```

**`src/models/database.js`:**
```javascript
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default pool;
```

### Install Dependencies:
```bash
pnpm install pg dotenv ejs express-session
```

### Deliverables:
- ✅ MVC folder structure created
- ✅ Database connection module working
- ✅ Environment variables configured

---

## Day 5-6: Models & Controllers

### Tasks:
- [ ] Create `src/models/showModel.js` with CRUD functions
- [ ] Create `src/models/reviewModel.js` with CRUD functions
- [ ] Create `src/controllers/homeController.js`
- [ ] Create `src/controllers/showController.js`
- [ ] Implement "Get all shows" functionality
- [ ] Implement "Get show by ID" functionality
- [ ] Create seed data (`database/seed.sql`)

### Example Model Function:
```javascript
// src/models/showModel.js
import pool from './database.js';

export async function getAllShows() {
  const result = await pool.query('SELECT * FROM shows ORDER BY title');
  return result.rows;
}

export async function getShowById(id) {
  const result = await pool.query('SELECT * FROM shows WHERE show_id = $1', [id]);
  return result.rows[0];
}
```

### Deliverables:
- ✅ Show model with getAllShows(), getShowById()
- ✅ Review model with basic functions
- ✅ Controllers that use models
- ✅ Sample data seeded into database

---

## Day 7: Views & Routing

### Tasks:
- [ ] Create EJS views (home, show-detail)
- [ ] Create partials (header, footer, navbar)
- [ ] Set up routes in `src/routes/`
- [ ] Configure Express to use EJS
- [ ] Test the application end-to-end

### Views to Create:
- `src/views/home.ejs` - Display all shows
- `src/views/show-detail.ejs` - Show details + reviews
- `src/views/partials/header.ejs`
- `src/views/partials/footer.ejs`
- `src/views/partials/navbar.ejs`

### Test URLs:
- `http://localhost:3000/` - Should show list of shows
- `http://localhost:3000/shows/1` - Should show details of show #1

### Deliverables:
- ✅ Home page displays list of shows from database
- ✅ Show detail page displays show info and reviews
- ✅ Navigation works between pages
- ✅ **WEEK 1 COMPLETE!**

---

# 🔐 Week 2: User Authentication & Authorization
**Timeline:** Days 8-14
**Goal:** Implement secure user registration, login, and session management
**Focus:** Security, password hashing, sessions

## Day 8-9: User Registration

### Tasks:
- [ ] Install `bcrypt` for password hashing
- [ ] Create registration form view (`src/views/register.ejs`)
- [ ] Create `src/models/userModel.js`
- [ ] Create `src/controllers/authController.js`
- [ ] Implement user registration logic
- [ ] Hash passwords before storing
- [ ] Add validation (email format, password strength)

### Install Dependencies:
```bash
pnpm install bcrypt express-validator
```

### Key Functions:
```javascript
// src/models/userModel.js
import pool from './database.js';
import bcrypt from 'bcrypt';

export async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email',
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}
```

### Validation Rules:
- Username: 3-50 characters
- Email: Valid email format
- Password: Minimum 8 characters, at least 1 number, 1 uppercase

### Deliverables:
- ✅ Registration form
- ✅ User registration working
- ✅ Passwords securely hashed
- ✅ Input validation implemented

---

## Day 10-11: User Login & Sessions

### Tasks:
- [ ] Create login form view (`src/views/login.ejs`)
- [ ] Set up express-session
- [ ] Implement login logic
- [ ] Compare hashed passwords
- [ ] Create user sessions
- [ ] Implement logout functionality
- [ ] Add "Remember Me" feature (optional)

### Session Configuration:
```javascript
// server.js
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));
```

### Login Controller:
```javascript
// src/controllers/authController.js
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.render('login', { error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.render('login', { error: 'Invalid credentials' });
  }

  req.session.userId = user.user_id;
  req.session.username = user.username;
  res.redirect('/');
}
```

### Deliverables:
- ✅ Login form working
- ✅ Sessions created on successful login
- ✅ Logout functionality
- ✅ User stays logged in between page loads

---

## Day 12-13: Authentication Middleware & Authorization

### Tasks:
- [ ] Create `src/middleware/auth.js`
- [ ] Implement `requireAuth` middleware
- [ ] Implement `checkAuth` middleware for optional auth
- [ ] Protect routes that need authentication
- [ ] Add authorization checks (users can only edit their own content)
- [ ] Display username in navbar when logged in

### Authentication Middleware:
```javascript
// src/middleware/auth.js

// Require user to be logged in
export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Check if user is logged in (but don't require it)
export function checkAuth(req, res, next) {
  res.locals.isAuthenticated = !!req.session.userId;
  res.locals.username = req.session.username || null;
  next();
}

// Check if user owns the resource
export function requireOwnership(resourceUserId) {
  return (req, res, next) => {
    if (req.session.userId !== resourceUserId) {
      return res.status(403).send('Unauthorized');
    }
    next();
  };
}
```

### Protected Routes Example:
```javascript
// src/routes/reviewRoutes.js
import { requireAuth } from '../middleware/auth.js';

router.post('/shows/:id/reviews', requireAuth, createReview);
router.put('/reviews/:id', requireAuth, updateReview);
router.delete('/reviews/:id', requireAuth, deleteReview);
```

### Deliverables:
- ✅ Authentication middleware working
- ✅ Protected routes require login
- ✅ Users can only edit/delete their own reviews
- ✅ Navbar shows username when logged in

---

## Day 14: User Profile & Polish

### Tasks:
- [ ] Create profile page (`src/views/profile.ejs`)
- [ ] Display user's reviews on profile
- [ ] Add ability to edit profile information
- [ ] Add flash messages for success/error
- [ ] Test all authentication flows

### Profile Features:
- Display username, email
- Show all reviews by this user
- Edit profile button
- Change password functionality

### Flash Messages:
```bash
pnpm install connect-flash
```

```javascript
// server.js
import flash from 'connect-flash';
app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
```

### Deliverables:
- ✅ User profile page working
- ✅ Flash messages for feedback
- ✅ Edit profile functionality
- ✅ **WEEK 2 COMPLETE!**

---

# 📝 Week 3: Review System & CRUD Operations
**Timeline:** Days 15-21
**Goal:** Build complete review functionality with full CRUD
**Focus:** Forms, validation, CRUD operations

## Day 15-16: Create Reviews

### Tasks:
- [ ] Create review form on show detail page
- [ ] Implement review creation for authenticated users
- [ ] Implement review creation for guests
- [ ] Add star rating system (1-5 stars)
- [ ] Validate input (rating, review text)
- [ ] Display reviews on show page

### Review Form:
```html
<!-- In show-detail.ejs -->
<form action="/shows/<%= show.show_id %>/reviews" method="POST">
  <div>
    <label>Rating:</label>
    <select name="rating" required>
      <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
      <option value="4">⭐⭐⭐⭐ (4 stars)</option>
      <option value="3">⭐⭐⭐ (3 stars)</option>
      <option value="2">⭐⭐ (2 stars)</option>
      <option value="1">⭐ (1 star)</option>
    </select>
  </div>

  <% if (!isAuthenticated) { %>
    <input type="text" name="guest_name" placeholder="Your name" required>
  <% } %>

  <textarea name="review_text" required></textarea>
  <button type="submit">Submit Review</button>
</form>
```

### Controller Logic:
```javascript
export async function createReview(req, res) {
  const { show_id } = req.params;
  const { rating, review_text, guest_name } = req.body;
  const userId = req.session.userId || null;

  await addReview(show_id, userId, guest_name, rating, review_text);

  req.flash('success', 'Review submitted successfully!');
  res.redirect(`/shows/${show_id}`);
}
```

### Deliverables:
- ✅ Review form on show pages
- ✅ Authenticated users can post reviews
- ✅ Guests can post reviews with name
- ✅ Star rating system working

---

## Day 17-18: Edit & Delete Reviews

### Tasks:
- [ ] Add "Edit" button to user's own reviews
- [ ] Create edit review page/modal
- [ ] Implement edit functionality
- [ ] Add "Delete" button to user's own reviews
- [ ] Implement delete with confirmation
- [ ] Add authorization checks (only owner can edit/delete)

### Edit Review View:
```html
<!-- src/views/edit-review.ejs -->
<form action="/reviews/<%= review.review_id %>?_method=PUT" method="POST">
  <select name="rating">
    <option value="5" <%= review.rating === 5 ? 'selected' : '' %>>5 stars</option>
    <!-- ... -->
  </select>
  <textarea name="review_text"><%= review.review_text %></textarea>
  <button type="submit">Update Review</button>
</form>
```

### Install Method Override:
```bash
pnpm install method-override
```

```javascript
// server.js
import methodOverride from 'method-override';
app.use(methodOverride('_method'));
```

### Delete with Confirmation:
```html
<form action="/reviews/<%= review.review_id %>?_method=DELETE" method="POST"
      onsubmit="return confirm('Are you sure you want to delete this review?')">
  <button type="submit">Delete</button>
</form>
```

### Deliverables:
- ✅ Edit review functionality
- ✅ Delete review functionality
- ✅ Authorization checks in place
- ✅ Confirmation before delete

---

## Day 19-20: Input Validation & Error Handling

### Tasks:
- [ ] Add comprehensive input validation
- [ ] Sanitize user input (prevent XSS)
- [ ] Create error handling middleware
- [ ] Create 404 page
- [ ] Create 500 error page
- [ ] Handle database errors gracefully

### Input Validation:
```javascript
// src/middleware/validation.js
import { body, validationResult } from 'express-validator';

export const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review_text').trim().isLength({ min: 10, max: 1000 }).withMessage('Review must be 10-1000 characters'),
  body('guest_name').optional().trim().isLength({ min: 2, max: 100 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('error', { errors: errors.array() });
    }
    next();
  }
];
```

### Error Handler Middleware:
```javascript
// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
}

export function notFound(req, res) {
  res.status(404).render('404', { url: req.url });
}
```

### Deliverables:
- ✅ All forms have validation
- ✅ XSS protection (input sanitization)
- ✅ Error pages (404, 500)
- ✅ Graceful error handling

---

## Day 21: Pagination & Review Display

### Tasks:
- [ ] Implement pagination for reviews
- [ ] Show average rating for each show
- [ ] Sort reviews (newest first, highest rated)
- [ ] Display review count
- [ ] Polish review display UI

### Pagination Logic:
```javascript
export async function getReviewsByShowId(showId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT r.*, u.username
     FROM reviews r
     LEFT JOIN users u ON r.user_id = u.user_id
     WHERE r.show_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [showId, limit, offset]
  );

  return result.rows;
}
```

### Average Rating:
```javascript
export async function getAverageRating(showId) {
  const result = await pool.query(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE show_id = $1',
    [showId]
  );
  return result.rows[0];
}
```

### Deliverables:
- ✅ Pagination working
- ✅ Average ratings displayed
- ✅ Review sorting options
- ✅ **WEEK 3 COMPLETE!**

---

# 🚀 Week 4: Polish, Search, & Best Practices
**Timeline:** Days 22-28
**Goal:** Add advanced features and implement security best practices
**Focus:** Search, security, optimization, polish

## Day 22-23: Search & Filter

### Tasks:
- [ ] Create search bar in navbar
- [ ] Implement search by show title
- [ ] Add filter by genre
- [ ] Add filter by rating
- [ ] Add filter by type (movie/TV show)
- [ ] Create search results page

### Search Query:
```javascript
export async function searchShows(query, filters = {}) {
  let sql = 'SELECT * FROM shows WHERE title ILIKE $1';
  const params = [`%${query}%`];
  let paramCount = 1;

  if (filters.genre) {
    paramCount++;
    sql += ` AND genre = $${paramCount}`;
    params.push(filters.genre);
  }

  if (filters.type) {
    paramCount++;
    sql += ` AND type = $${paramCount}`;
    params.push(filters.type);
  }

  sql += ' ORDER BY title';

  const result = await pool.query(sql, params);
  return result.rows;
}
```

### Deliverables:
- ✅ Search functionality working
- ✅ Filter by genre, type, rating
- ✅ Search results page

---

## Day 24-25: Security Implementation

### Tasks:
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add helmet.js for security headers
- [ ] Prevent SQL injection (parameterized queries everywhere)
- [ ] Implement XSS protection
- [ ] Add input sanitization
- [ ] Secure session configuration
- [ ] Add HTTPS redirect (production)

### Install Security Packages:
```bash
pnpm install helmet express-rate-limit csurf
```

### Security Configuration:
```javascript
// server.js
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Make CSRF token available in all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

### Add CSRF to Forms:
```html
<form method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <!-- form fields -->
</form>
```

### Deliverables:
- ✅ CSRF protection on all forms
- ✅ Rate limiting implemented
- ✅ Security headers configured
- ✅ All SQL queries parameterized

---

## Day 26-27: Code Quality & Optimization

### Tasks:
- [ ] Refactor duplicate code
- [ ] Add JSDoc comments
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Implement connection pooling properly
- [ ] Add loading states in UI
- [ ] Optimize images
- [ ] Add CSS for better UI

### Performance Optimizations:
```sql
-- Add indexes for better query performance
CREATE INDEX idx_reviews_show_id ON reviews(show_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_shows_title ON shows(title);
CREATE INDEX idx_shows_genre ON shows(genre);
```

### Code Review Checklist:
- [ ] No hardcoded values
- [ ] All functions have clear names
- [ ] No code duplication
- [ ] Proper error handling everywhere
- [ ] Comments on complex logic
- [ ] Consistent code style

### Deliverables:
- ✅ Code refactored and clean
- ✅ Database optimized
- ✅ UI polished

---

## Day 28: Final Testing & Documentation

### Tasks:
- [ ] Test all user flows
- [ ] Fix any remaining bugs
- [ ] Update README with final instructions
- [ ] Create API documentation
- [ ] Test on different browsers
- [ ] Add demo account credentials
- [ ] Create deployment guide
- [ ] Final security audit

### Testing Checklist:
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works (if implemented)
- [ ] Review creation works (both user and guest)
- [ ] Review editing works
- [ ] Review deletion works
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works
- [ ] Authorization prevents unauthorized access
- [ ] Error pages display correctly
- [ ] Mobile responsive (basic)

### Final Deliverables:
- ✅ All features working
- ✅ No critical bugs
- ✅ Documentation complete
- ✅ **PROJECT COMPLETE! 🎉**

---

# 📊 Weekly Progress Tracker

## Week 1 Status: ⬜ Not Started
- [ ] Database setup
- [ ] MVC structure
- [ ] Basic models and controllers
- [ ] Home and show detail pages

## Week 2 Status: ⬜ Not Started
- [ ] User registration
- [ ] User login
- [ ] Sessions
- [ ] Authentication middleware
- [ ] User profile

## Week 3 Status: ⬜ Not Started
- [ ] Create reviews
- [ ] Edit reviews
- [ ] Delete reviews
- [ ] Input validation
- [ ] Error handling

## Week 4 Status: ⬜ Not Started
- [ ] Search functionality
- [ ] Security implementation
- [ ] Code optimization
- [ ] Testing and bug fixes

---

# 🎯 Success Metrics

By the end of 4 weeks, you should have:

✅ **Functional Application**
- Users can register and login
- Users can post, edit, and delete reviews
- Guests can post reviews
- Search and filter functionality

✅ **Backend Best Practices**
- MVC architecture implemented
- Secure password handling
- SQL injection prevention
- XSS protection
- CSRF protection
- Proper error handling
- Input validation

✅ **Clean Code**
- Organized file structure
- Reusable code
- Clear naming conventions
- Commented code

✅ **Professional Documentation**
- Complete README
- Code comments
- API documentation

---

# 💡 Tips for Success

1. **Commit often** - Commit your code at the end of each day
2. **Test as you go** - Don't wait until the end to test
3. **Read error messages** - They tell you what's wrong!
4. **Use console.log** - Debug by logging values
5. **Ask for help** - Don't get stuck for hours
6. **Take breaks** - Fresh eyes catch bugs better
7. **Focus on learning** - It's okay if everything isn't perfect

---

**Good luck! You've got this! 🚀**
