# DoubtBuddy Frontend

Welcome to the frontend of **DoubtBuddy**!

This is a React-based web application that allows students to post their doubts and tutors to answer them. The frontend connects to the backend API to provide a smooth and interactive experience for both students and tutors.

## Features

- **User Authentication:**
  - Register as a student or tutor
  - Login and logout securely

- **Dashboard:**
  - Students can view their posted doubts and answers
  - Tutors can see assigned and available doubts

- **Ask and Answer Doubts:**
  - Students can post new questions
  - Tutors can view, answer, and rate doubts

- **Comments and Ratings:**
  - Add comments to questions
  - Rate answers for quality

- **Navigation:**
  - Easy navigation with a responsive navbar

## Project Structure

- `src/components/` - Reusable UI components (Navbar, QuestionCard, etc.)
- `src/pages/` - Main pages (Dashboard, Login, Register, etc.)
- `src/contexts/` - Context for authentication
- `src/services/` - API service for backend communication

## How to Run

1. Go to the frontend directory:
   ```powershell
   cd frontend/doubtbuddy
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Requirements
- Node.js and npm installed
- Backend server running (see backend README)

## Notes
- Make sure to update the API URL in `src/services/api.js` if your backend runs on a different port.
- This project is for learning and demonstration purposes.

---

Enjoy using DoubtBuddy!
