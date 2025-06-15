# 🎓 DoubtBuddy - Educational Q&A Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://doubtbuddy-iota.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)](https://www.mongodb.com/)

**DoubtBuddy** is a comprehensive full-stack web application designed to bridge the gap between students and tutors. Students can post their academic doubts and get expert help from qualified tutors in real-time, creating an interactive learning environment.

🌐 **Live Application**: [DoubtBuddy App](https://doubtbuddy-iota.vercel.app/)

---

## 🎯 Project Overview

DoubtBuddy is an educational platform that facilitates seamless interaction between students and tutors:

- **Students** can register, post academic questions (doubts), and receive expert guidance
- **Tutors** can view available questions, provide detailed responses, and track their performance
- **Real-time engagement** through comments, ratings, and feedback systems
- **Role-based access control** ensuring appropriate permissions for different user types

### 🎯 Target Audience

- Educational institutions looking for internal Q&A systems
- Online tutoring platforms
- Student communities and study groups
- Individual tutors and students seeking structured interaction

---

## ✨ Key Features

### 🎓 For Students
- **Easy Registration**: Quick sign-up process with role selection
- **Post Doubts**: Submit questions with detailed descriptions
- **Track Progress**: Monitor status of posted questions
- **Interactive Comments**: Engage with tutors through comment threads
- **Rate Responses**: Provide feedback on tutor answers
- **Personal Dashboard**: View all submitted doubts and their status

### 🧑‍🏫 For Tutors
- **Question Management**: Access to assigned and available doubts
- **Response System**: Provide detailed answers to student questions
- **Comment Engagement**: Interact with students through comments
- **Performance Analytics**: Track ratings and engagement statistics
- **Quality Control**: Rate doubt quality and relevance

### 🔐 System Features
- **JWT Authentication**: Secure token-based user sessions
- **Role-based Access**: Different interfaces for students and tutors
- **Protected Routes**: Secure pages requiring authentication
- **Responsive Design**: Works seamlessly across devices
- **Real-time Updates**: Dynamic content updates without page refresh

---

## 🏗️ Architecture

DoubtBuddy follows a modern **client-server architecture** with clear separation of concerns:

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │ ◄──────────────────► │                 │
│   React.js      │                     │   Node.js       │
│   Frontend      │                     │   Backend       │
│                 │                     │                 │
└─────────────────┘                     └─────────────────┘
                                                   │
                                                   ▼
                                        ┌─────────────────┐
                                        │                 │
                                        │   MongoDB       │
                                        │   Database      │
                                        │                 │
                                        └─────────────────┘
```

---

## 🔧 Tech Stack

### Backend Technologies
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Frontend Technologies
- **React.js** - UI library with hooks
- **React Router** - Client-side routing
- **Context API** - Global state management
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design

### Development Tools
- **npm** - Package management
- **Git** - Version control
- **VS Code** - Development environment

---

## 📁 Project Structure

```
DoubtBuddy/
├── backend/                    # Backend API server
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.js  # Authentication logic
│   │   └── questionController.js # Question management
│   ├── models/               # Database models
│   │   ├── User.js          # User schema
│   │   └── Question.js      # Question schema
│   ├── routes/              # API route definitions
│   │   ├── auth.js         # Authentication routes
│   │   └── questions.js    # Question routes
│   ├── middleware/         # Custom middleware
│   │   └── auth.js        # JWT authentication middleware
│   ├── config/            # Configuration files
│   │   └── db.js         # Database connection
│   ├── package.json      # Backend dependencies
│   └── server.js         # Main server file
│
├── frontend/doubtbuddy/      # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.js   # Navigation component
│   │   │   ├── QuestionCard.js # Question display component
│   │   │   ├── PrivateRoute.js # Protected route component
│   │   │   └── dialogs/    # Modal dialogs
│   │   ├── pages/          # Main application pages
│   │   │   ├── Login.js    # User login page
│   │   │   ├── Register.js # User registration page
│   │   │   ├── Dashboard.js # Main dashboard
│   │   │   ├── AvailableDoubts.js # Available questions
│   │   │   ├── AssignedDoubts.js # Assigned questions
│   │   │   └── TutorStats.js # Tutor performance stats
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── services/       # API service layer
│   │   │   └── api.js      # HTTP client configuration
│   │   ├── theme.js        # UI theme configuration
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Application entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── README.md               # This file
└── .gitignore              # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/doubtbuddy.git
cd doubtbuddy
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env
# MONGODB_URI=mongodb://localhost:27017/doubtbuddy
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

#### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend/doubtbuddy

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on `http://localhost:3000`

### 4. Database Setup

#### Using MongoDB Locally:
1. Install MongoDB on your system
2. Start MongoDB service
3. The application will automatically create the required database

#### Using MongoDB Atlas:
1. Create a MongoDB Atlas account
2. Set up a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

---

## 📝 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "tutor"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Question Endpoints

#### GET `/api/questions`
Get all questions (protected route)

#### POST `/api/questions`
Create a new question (students only)
```json
{
  "title": "Question Title",
  "description": "Detailed question description",
  "subject": "Mathematics"
}
```

#### PUT `/api/questions/:id`
Update question (tutors can add answers)

#### DELETE `/api/questions/:id`
Delete question (author only)

---

## 🎨 Frontend Features

### Component Architecture

#### Reusable Components
- **Navbar**: Navigation with role-based menu items
- **QuestionCard**: Display question information with actions
- **PrivateRoute**: Protected route wrapper for authenticated users
- **Dialogs**: Modal components for comments and interactions

#### Page Components
- **Login/Register**: User authentication forms
- **Dashboard**: Role-specific main interface
- **AvailableDoubts**: List of questions available for tutors
- **AssignedDoubts**: Tutor's assigned questions
- **TutorStats**: Performance analytics for tutors

### State Management
- **AuthContext**: Global authentication state
- **Local State**: Component-specific state using React hooks

---

## 🔐 Authentication

### JWT Token Flow
1. User registers/logs in with credentials
2. Server validates credentials and generates JWT token
3. Token is stored in localStorage/sessionStorage
4. Token is included in subsequent API requests
5. Server validates token for protected routes

### Role-Based Access
- **Students**: Can post questions, comment, and rate answers
- **Tutors**: Can view questions, provide answers, and access analytics

---

**Made with ❤️ by the DoubtBuddy Team**

*Empowering students and tutors through seamless educational interaction*
