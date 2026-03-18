# Cyber Cafe Management System

A full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) to manage and automate cyber cafe operations. The system enables efficient computer booking, service management, and administrative control through a role-based architecture.

This project demonstrates practical implementation of full-stack development, RESTful APIs, and scalable application design.

---

## Project Overview

The Cyber Cafe Management System is designed to streamline daily operations of a cyber cafe by providing a structured platform for both users and administrators.

Users can book computer terminals based on different usage types such as gaming, academic work, browsing, and printing. The system ensures optimal utilization of available resources through controlled allocation.

Administrators can manage terminals, monitor usage, and oversee system activity, enabling efficient operational control.

---

## Key Highlights

* Full-stack implementation using MERN stack
* Role-based access control (Admin and User)
* Modular backend architecture (MVC pattern)
* RESTful API design
* Scalable and maintainable code structure
* Separation of frontend and backend

---

## Features

### User Module

* Book computer terminals for:

  * Gaming
  * Academic purposes
  * Internet browsing
  * Printing services
* View booking status
* Simple and intuitive interface

### Admin Module

* View registered users
* Manage computer terminals (add, update, delete)
* Monitor terminal usage
* View system activity and usage details

---

## Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Tools

* Git and GitHub
* Visual Studio Code

---

## Project Structure

```text id="5tr6wq"
Cyber-Cafe/
│── backend/
│   ├── config/        # Database and configuration setup
│   ├── controllers/   # Request handling logic
│   ├── middleware/    # Custom middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── server.js      # Entry point
│   ├── setup.js       # Initial setup scripts
│   └── .env           # Environment variables (not included)
│
│── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│
│── .gitignore
│── package.json
│── README.md
```

---

## Setup and Installation

### 1. Clone the Repository

```bash id="g8e5mf"
git clone https://github.com/bharanidharan-2106/Cyber-Cafe.git
cd Cyber-Cafe
```

---

### 2. Install Dependencies

#### Backend

```bash id="y5xq9h"
cd backend
npm install
```

#### Frontend

```bash id="rqxj3y"
cd ../frontend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env id="y9j0v1"
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Note:
The `.env` file is not included in this repository to protect sensitive configuration data.

---

### 4. Run the Application

#### Start Backend

```bash id="9m4yte"
cd backend
npm start
```

#### Start Frontend

```bash id="z7px2f"
cd frontend
npm start
```

---

## Key Concepts Demonstrated

* Full-stack application development
* REST API design and integration
* CRUD operations with MongoDB
* MVC architecture in backend
* Middleware usage in Express
* Component-based UI in React
* Environment-based configuration

---

## Future Enhancements

* Payment integration
* Advanced reporting and analytics
* Real-time notifications
* Cloud deployment

---

