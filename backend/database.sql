CREATE DATABASE IF NOT EXISTS smart_resume_ranking;
USE smart_resume_ranking;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidate','hr','admin') DEFAULT 'candidate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills TEXT,
    min_experience INT DEFAULT 0,
    location VARCHAR(255),
    salary VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,
    resume_path VARCHAR(500),
    extracted_text LONGTEXT,
    status ENUM('pending','shortlisted','rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    skills_score DECIMAL(5,2) DEFAULT 0,
    experience_score DECIMAL(5,2) DEFAULT 0,
    education_score DECIMAL(5,2) DEFAULT 0,
    total_score DECIMAL(5,2) DEFAULT 0,
    rank_position INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS extracted_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    skill_name VARCHAR(100),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    skill_name VARCHAR(100),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Dummy HR user (password: hr123)
INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
(1, 'Sarah Johnson', 'hr@company.com', '$2a$10$B.J78W.fXvT2b6cI4zQn4uR2.ZJ2wH1H.UuGvU7C42C6uO1A8GfP.', 'hr');

-- Dummy Candidate user (password: cand123)
INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
(2, 'John Smith', 'candidate@email.com', '$2a$10$l41LgM9rR2n/U8/s56F1vOVxT5O4/P9gH7u8B1G11hA6F3kPqRzRy', 'candidate');
