# Smart Resume Ranking System - Backend

This folder contains the complete Node.js + Express backend designed to perfectly integrate with the Next.js frontend.

## Features

- **Authentication**: JWT-based secure login/registration via bcryptjs.
- **Role Management**: Separate logic for `hr` and `candidate`.
- **Job Management**: CRUD operations for job postings.
- **Application Processing**: Candidates can upload PDF/DOCX resumes (via Multer).
- **Resume Parsing**: Automatically parses PDF/DOCX text to extract skills and estimate experience (using `pdf-parse` and `mammoth`).
- **AI-Powered Ranking**: Matches candidate skills against job requirements to assign scores for Skills, Experience, and Education.

## Setup Instructions

### 1. Database Setup
Ensure you have MySQL installed and running.
Run the following commands in your MySQL terminal or client (like MySQL Workbench):
```sql
SOURCE database.sql;
```
This will create the `smart_resume_ranking` database, all necessary tables, and insert two demo users:
- HR: `hr@company.com` / `hr123`
- Candidate: `candidate@email.com` / `cand123`

### 2. Install Dependencies
Navigate into the `backend` folder and run:
```bash
npm install
```

### 3. Environment Variables
The `.env` file is already created. Make sure the MySQL credentials match your local setup:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_resume_ranking
JWT_SECRET=super_secret_jwt_key_12345
```

### 4. Run the Server
Start the development server using nodemon:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

## Connecting to the Frontend
The frontend `AppContext.tsx` and `AuthContext.tsx` have already been updated to communicate with this backend API via standard `fetch` requests. 

1. Start the Node.js backend.
2. Start the Next.js frontend (`npm run dev` in `resume-ranking-frontend`).
3. Use the application naturally!

## API Structure
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs`
- `POST /api/jobs`
- `POST /api/applications/:jobId`
- `GET /api/applications/job/:jobId`
- `POST /api/rankings/job/:jobId`
- `GET /api/rankings/job/:jobId`
