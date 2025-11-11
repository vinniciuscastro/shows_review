# 🎬 Shows Review - TV & Movie Review Platform

A full-stack web application for learning **backend development best practices** using Express.js and the MVC (Model-View-Controller) architecture. Users can review TV shows and movies, create accounts, or post as guests.

## 📚 Learning Objectives

This project teaches essential backend development skills:

- **MVC Architecture** - Separating concerns (Models, Views, Controllers)
- **RESTful API Design** - Following REST principles
- **Database Design & Management** - PostgreSQL with proper relationships
- **Authentication & Authorization** - User accounts and session management
- **Input Validation & Sanitization** - Security best practices
- **Error Handling** - Graceful error management
- **Middleware** - Custom middleware for validation and authentication
- **SQL & ORM** - Working with databases efficiently
- **Environment Configuration** - Managing secrets and configs
- **Code Organization** - Professional project structure

---

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.x** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Frontend (Views)
- **EJS** - Templating engine
- **HTML/CSS** - Structure and styling

### Development Tools
- **Nodemon** - Auto-restart on file changes
- **dotenv** - Environment variable management
- **pnpm** - Fast package manager

---

## ✨ Features

### Core Functionality
- ✅ Browse TV shows and movies
- ✅ Read reviews from other users
- ✅ Post reviews (authenticated or guest)
- ✅ User registration and login
- ✅ User profile management
- ✅ Edit/delete own reviews
- ✅ Search and filter content
- ✅ Rating system (1-5 stars)

### User Types
1. **Guest Users** - Can view and post reviews (with limited features)
2. **Registered Users** - Full access, can manage their reviews
3. **Admin** (Stretch goal) - Moderate content

---

## 📁 Project Structure (MVC Pattern)

```
shows_review/
├── src/
│   ├── models/              # Data layer (Database interactions)
│   │   ├── database.js      # Database connection
│   │   ├── userModel.js     # User CRUD operations
│   │   ├── reviewModel.js   # Review CRUD operations
│   │   └── showModel.js     # Show/Movie CRUD operations
│   │
│   ├── controllers/         # Business logic layer
│   │   ├── homeController.js
│   │   ├── authController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   │
│   ├── views/               # Presentation layer (EJS templates)
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   ├── footer.ejs
│   │   │   └── navbar.ejs
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── show-detail.ejs
│   │   └── profile.ejs
│   │
│   ├── routes/              # Route definitions
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── showRoutes.js
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── validation.js    # Input validation
│   │   ├── errorHandler.js  # Error handling
│   │   └── global.js        # Global middleware
│   │
│   └── utils/               # Helper functions
│       ├── validation.js    # Validation helpers
│       └── helpers.js       # General utilities
│
├── public/                  # Static files
│   ├── css/
│   ├── js/
│   └── images/
│
├── database/                # Database files
│   ├── schema.sql          # Database schema
│   ├── seed.sql            # Sample data
│   └── migrations/         # Database migrations
│
├── .gitignore              # Git ignore file
├── server.js               # Application entry point
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (or npm)

### Installation

1. **Clone the repository**
   ```bash
   cd "C:\Users\u858345317\Documents\CSE - Final Project\shows_review"
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env

   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Create database
   psql -U postgres
   CREATE DATABASE shows_review;
   \q

   # Run schema
   psql -U postgres -d shows_review -f database/schema.sql

   # (Optional) Load sample data
   psql -U postgres -d shows_review -f database/seed.sql
   ```

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   pnpm run dev

   # Production mode
   pnpm start
   ```

6. **Visit the application**
   ```
   http://localhost:3000
   ```

---

## 📅 4-Week Development Roadmap

### **Week 1: Foundation & Database Setup**
**Goal:** Set up project structure, database, and basic MVC architecture

**Tasks:**
- [ ] Set up PostgreSQL database
- [ ] Design database schema (users, shows, reviews)
- [ ] Create database connection module
- [ ] Implement basic models (User, Show, Review)
- [ ] Set up MVC folder structure
- [ ] Create basic routes and controllers
- [ ] Implement home page (view all shows)
- [ ] Create show detail page

**Deliverable:** Basic app showing list of shows and details

---

### **Week 2: User Authentication & Authorization**
**Goal:** Implement user registration, login, and session management

**Tasks:**
- [ ] Install authentication dependencies (bcrypt, express-session)
- [ ] Create user registration form and logic
- [ ] Implement password hashing
- [ ] Create login/logout functionality
- [ ] Set up session management
- [ ] Create authentication middleware
- [ ] Implement "Remember me" feature
- [ ] Add user profile page
- [ ] Create authorization checks (own reviews only)

**Deliverable:** Users can register, login, and manage profiles

---

### **Week 3: Review System & CRUD Operations**
**Goal:** Build the core review functionality

**Tasks:**
- [ ] Create review submission form
- [ ] Implement review creation (authenticated & guest)
- [ ] Add rating system (1-5 stars)
- [ ] Build review display on show pages
- [ ] Implement edit review functionality
- [ ] Implement delete review functionality
- [ ] Add input validation and sanitization
- [ ] Create error handling middleware
- [ ] Add success/error flash messages
- [ ] Implement review pagination

**Deliverable:** Full CRUD operations for reviews

---

### **Week 4: Polish, Search, & Best Practices**
**Goal:** Add advanced features and implement best practices

**Tasks:**
- [ ] Implement search functionality (shows/movies)
- [ ] Add filter by rating/genre
- [ ] Create admin moderation (stretch)
- [ ] Add comprehensive error handling
- [ ] Implement input validation on all forms
- [ ] Add SQL injection protection
- [ ] Implement XSS protection
- [ ] Add CSRF protection
- [ ] Write API documentation
- [ ] Code refactoring and cleanup
- [ ] Add loading states and UI polish
- [ ] Testing and bug fixes

**Deliverable:** Production-ready application with best practices

---

## 🎯 Backend Best Practices Implemented

### Security
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (input sanitization)
- ✅ CSRF tokens
- ✅ Environment variables for secrets
- ✅ Secure session configuration

### Code Quality
- ✅ MVC architecture separation
- ✅ DRY (Don't Repeat Yourself) principle
- ✅ Meaningful variable/function names
- ✅ Error handling middleware
- ✅ Input validation middleware
- ✅ Modular code structure

### Database
- ✅ Normalized database design
- ✅ Proper relationships (foreign keys)
- ✅ Indexed columns for performance
- ✅ Parameterized queries
- ✅ Connection pooling

---

## 🔧 Development Commands

```bash
# Start development server (auto-reload)
pnpm run dev

# Start production server
pnpm start

# Database commands
psql -U postgres -d shows_review       # Connect to database
psql -U postgres -d shows_review -f database/schema.sql   # Run schema
```

---

## 📖 API Routes (Planned)

### Public Routes
- `GET /` - Home page (list all shows)
- `GET /shows/:id` - Show detail page
- `GET /login` - Login page
- `GET /register` - Registration page

### Authentication Routes
- `POST /register` - Create new account
- `POST /login` - User login
- `POST /logout` - User logout

### Review Routes (Protected)
- `POST /shows/:id/reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### User Routes (Protected)
- `GET /profile` - User profile
- `PUT /profile` - Update profile

---

## 🐛 Common Issues & Solutions

### Database Connection Errors
```bash
# Make sure PostgreSQL is running
pg_ctl status

```

### Port Already in Use
```bash
# Change port in .env or kill the process
PORT=3001
```

---

## 📝 Weekly Checklist

Use `ROADMAP.md` for detailed weekly tasks and progress tracking!

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MVC Pattern Explained](https://developer.mozilla.org/en-US/docs/Glossary/MVC)
- [RESTful API Design](https://restfulapi.net/)
- [OWASP Security Practices](https://owasp.org/www-project-top-ten/)

---

## 📄 License

This project is for educational purposes.

---

## 👤 Author

CSE 340 Final Project

---

**Good luck with your 4-week journey! 🚀**

Remember: Focus on learning best practices, not just making it work!
