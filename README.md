# Cyber Cafe Management System

A full-stack web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) to manage and automate cyber cafe operations. The platform provides role-based access for customers and administrators, enabling terminal booking, printing services, real-time availability tracking, and operational oversight from a single dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Default Test Accounts](#default-test-accounts)
- [Key Concepts](#key-concepts)
- [Future Enhancements](#future-enhancements)

---

## Overview

The Cyber Cafe Management System streamlines day-to-day cafe operations by giving users a self-service portal to book computer terminals and access printing, while giving administrators full control over inventory, usage, and revenue.

Users can browse live terminal availability, request a session by usage type and duration, and receive automatic allocation of the next available machine. When all terminals of a selected type are occupied, the system displays remaining session time and the expected availability window for each terminal.

Administrators manage the terminal fleet, monitor active sessions, review registered users, and track sales performance through daily and monthly revenue summaries.

---

## Features

### User Module

| Feature | Description |
| --- | --- |
| **Terminal availability** | View all terminals with real-time status (Available / Occupied) |
| **Smart booking** | Request a terminal by type; the system auto-assigns the first available machine |
| **Usage categories** | Gaming, Academic, and Browsing (internet) terminals |
| **Flexible duration** | 30 minutes, 1 hour, 2 hours, 3 hours, or 4 hours |
| **Dynamic pricing** | Hourly rates per terminal type; 30-minute sessions billed at half the hourly rate |
| **Occupancy insights** | When no terminal is free, view countdown timers and next-available times for occupied machines |
| **Session management** | One active session per user; terminals auto-release when the session expires |
| **Printing services** | Upload documents (PDF, DOC, DOCX, TXT) with configurable copies, color mode, page size, orientation, and sides |
| **Print pricing** | Black & White — ₹5/copy · Color — ₹10/copy |
| **User registration** | Sign up with validated profile fields (username, email, phone, date of birth, address) |
| **Authentication** | JWT-based login with optional Google OAuth sign-in |
| **Profile management** | View and edit personal details from the user dashboard |
| **Usage history** | Booking and print transactions recorded for reference |

### Admin Module

| Feature | Description |
| --- | --- |
| **Terminal CRUD** | Add, update, and delete computer terminals with type, specs, and hourly pricing |
| **Live monitoring** | Track active sessions — terminal name, user, start time, duration, and remaining time |
| **User management** | View all registered users with search; expand profiles to see usage history |
| **User deletion** | Remove users and automatically free any terminals they occupy |
| **Sales overview** | Dashboard stats for today's revenue and monthly revenue |
| **Quick metrics** | Total terminals, currently active users, and occupancy at a glance |
| **Role-based access** | Admin-only routes protected by JWT authentication and admin middleware |

---

## How It Works

### Terminal Booking Flow

```
User selects type + duration
        │
        ▼
System finds first available terminal of that type
        │
   ┌────┴────┐
   │         │
Available   All occupied
   │         │
   ▼         ▼
Auto-       Show remaining time &
allocate    next-available time for
terminal    each occupied terminal
   │
   ▼
Calculate charge (hourly rate × duration;
30 min = half rate)
   │
   ▼
Session starts → terminal marked Occupied
   │
   ▼
Session expires → terminal auto-released
```

### Role-Based Routing

- **User** — Access to booking, printing, profile, and personal dashboard
- **Admin** — Access to admin dashboard with terminal management, user oversight, and revenue analytics

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | UI components and page routing |
| React Router DOM | Client-side navigation |
| Axios | HTTP requests to the REST API |
| React Hook Form | Form handling |
| JWT Decode | Token parsing for OAuth flows |
| Google OAuth | Social sign-in integration |
| CSS3 | Custom styling and responsive layout |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | Runtime environment |
| Express.js | REST API server |
| MongoDB | Persistent data storage |
| Mongoose | ODM for schema modeling |
| JWT (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

### Architecture

- **MVC pattern** on the backend — models, controllers, and routes are separated
- **Middleware layer** — JWT `protect` and role-based `admin` guards
- **Centralized DB connection** — `connectDB()` in `config/db.js`
- **Modular frontend** — page-based React components with shared layout (Navbar, Header, Footer)

---

## Project Structure

```
cyber-cafe-management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection helper
│   ├── controllers/
│   │   ├── adminController.js    # Admin terminal & user operations
│   │   ├── authController.js     # Register & login
│   │   ├── bookingController.js  # Terminal booking logic
│   │   └── systemController.js   # System availability endpoints
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protect & admin role checks
│   ├── models/
│   │   ├── Booking.js            # Booking sessions
│   │   ├── System.js             # Terminals (computer / printer)
│   │   └── User.js               # User accounts & roles
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin-only API routes
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── bookingRoutes.js      # User booking routes
│   │   └── systemRoutes.js       # Public system routes
│   ├── server.js                 # Application entry point
│   ├── setup.js                  # Seed script for test users
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Header, Footer
│   │   ├── pages/
│   │   │   ├── Home.js             # Landing page
│   │   │   ├── Login.js            # User & admin login
│   │   │   ├── Register.js         # User registration
│   │   │   ├── UserDashboard.js    # User service hub
│   │   │   ├── AdminDashboard.js   # Admin control panel
│   │   │   ├── BookComputer.js     # Terminal booking
│   │   │   ├── PrinterServices.js  # Print job submission
│   │   │   └── Profile.js          # Profile view & edit
│   │   ├── styles/                 # CSS stylesheets
│   │   ├── App.js                  # Route definitions
│   │   └── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/bharanidharan-2106/Cyber-Cafe.git
cd Cyber-Cafe
```

### 2. Install Dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory (see [Environment Variables](#environment-variables) below).

### 4. Seed Test Users (Optional)

```bash
cd backend
node setup.js
```

This creates default admin and user accounts for local development.

### 5. Run the Application

**Start the backend** (runs on port 5000 by default):

```bash
cd backend
npm start
```

For development with auto-reload:

```bash
npm run dev
```

**Start the frontend** (runs on port 3000 by default):

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create `backend/.env` with the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

> **Note:** The `.env` file is excluded from version control. Never commit secrets to the repository.

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `PORT` | Backend server port (default: `5000`) |

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT token |

### Systems

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/system/available` | Public | List all available terminals |

### Bookings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/booking/` | Authenticated | Book a terminal and create a session (JWT required) |

### Admin

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/admin/add-system` | Admin | Add a new terminal |
| `GET` | `/admin/view-systems` | Admin | View available systems |
| `GET` | `/admin/view-users` | Admin | List all registered users |

> Admin routes require a valid JWT in the `Authorization: Bearer <token>` header and an `admin` role.

---

## Default Test Accounts

After running `node setup.js`:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| User | `user1` | `user123` |

---

## Key Concepts

- Full-stack MERN application with separated frontend and backend
- RESTful API design with Express route modules
- Role-based access control (Admin / User) via JWT middleware
- Automated terminal allocation based on type and availability
- Time-based session management with auto-release on expiry
- CRUD operations on terminals and user records
- Revenue tracking from booking and print service history
- Component-based React UI with protected route navigation

---

## Future Enhancements

- Online payment gateway integration
- Full backend persistence for terminal booking and print jobs
- Email notifications for booking confirmations
- Cloud deployment (AWS / Render / Vercel)

---

## Author

**Bharanidharan M**

Full Stack Developer
