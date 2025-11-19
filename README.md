# AI-Based Evaluation Platform

**Deployment:** [https://ai-based-evaluation-platform.onrender.com/](https://ai-based-evaluation-platform.onrender.com/)

## Overview

The AI-Based Evaluation Platform is a comprehensive web application designed to streamline and automate the process of academic evaluation and classroom management. It leverages artificial intelligence to assist educators in grading, assignment management, and student performance analysis, while providing an intuitive interface for students, faculty, and administrators.

## Key Features

### For Faculty
- **Assignment Creation & Management:** Faculty can create, edit, and manage assignments, including uploading supporting documents.
- **Automated Grading:** Utilizes AI-driven grading utilities to assist in evaluating student submissions efficiently and fairly.
- **Classroom Management:** Tools for creating and managing classrooms, enrolling students, and distributing assignments.
- **Performance Analytics:** Access to detailed statistics and analytics on student performance and assignment outcomes.
- **Communication:** Announcements and notifications to keep students informed.

### For Students
- **Assignment Submission:** Easy upload and management of assignment submissions, with real-time progress tracking.
- **Performance Tracking:** View grades, feedback, and analytics on personal performance.
- **Classroom Participation:** Join classrooms, receive notifications, and access all relevant course materials.

### For Administrators
- **User Management:** Oversee faculty and student accounts, manage roles, and monitor platform activity.
- **System Oversight:** Access to platform-wide analytics and administrative controls.

## System Architecture

### Backend
- **Node.js/Express API:** Handles authentication, authorization, assignment workflows, classroom management, and user roles.
- **Data Models:** Includes models for users, classrooms, assignments, and announcements.
- **AI Utilities:** Custom modules for grading and evaluation, as well as integration with email and cloud storage services.
- **Middleware:** Robust authentication and error handling to ensure secure and reliable operations.
- **File Management:** Supports uploading and storing assignment files and student submissions.

### Frontend
- **React Application:** Modern, responsive UI built with reusable components for assignments, classrooms, dashboards, and more.
- **Role-Based Dashboards:** Distinct interfaces for students, faculty, and administrators, each tailored to their needs.
- **Real-Time Feedback:** Loading spinners, notifications, and progress indicators for a smooth user experience.
- **Context Management:** Uses React Context for authentication and state updates across the app.

## Directory Structure

- **backend/**
  - `models/` — Data models for users, assignments, classrooms, and announcements.
  - `routes/` — RESTful API endpoints for admin, faculty, student, assignment, classroom, and file uploads.
  - `utils/` — AI grading, email services, cloud storage, and other backend utilities.
  - `middleware/` — Authentication and error handling.
  - `uploads/` & `submissions/` — Storage for assignment files and student submissions.

- **frontend/**
  - `src/components/` — Modular React components for assignments, classrooms, dashboards, authentication, and more.
  - `src/context/` — Context providers for authentication and state management.
  - `public/` — Static assets and HTML template.

## Technology Stack

- **Backend:** Node.js, Express, Firebase (for storage), custom AI utilities
- **Frontend:** React, Context API, CSS Modules
- **Deployment:** Hosted on Render

## AI/RAG Setup

- **Gemini Embeddings:** Set `GEMINI_API_KEY` and optionally `GEMINI_EMBED_MODEL` / `GEMINI_DETECTION_MODEL` to control the Google Generative Language models used for dense vectors and grading prompts.
- **DeepSeek OCR:** Provide `DEEPSEEK_API_KEY` (plus `DEEPSEEK_OCR_ENDPOINT` if self-hosting) so scanned or handwritten PDFs can be transcribed when native extraction fails.
- **Pinecone Vector Store:** Create a 768-dimension index, then configure `PINECONE_API_KEY` and `PINECONE_INDEX_NAME`. Reference documents and student submissions will be chunked, embedded, and upserted automatically for similarity search.
- **Reference-aware Grading:** Faculty can attach a reference PDF during assignment creation. The backend ingests it into Pinecone and the grader retrieves the most relevant chunks to power the RAG evaluation pipeline.
- **Handwritten Workflow:** Assignment creation now accepts a “Handwritten Required” checkbox/flag. When enabled, submissions must be detected as handwritten (via OCR extraction) or they are rejected; plagiarism matches automatically zero both the offending submission and the copied source with clear “cheating detected” feedback. Deleting an assignment also purges its Pinecone namespace automatically.

## Live Platform

Access the deployed platform here:  
**[https://ai-based-evaluation-platform.onrender.com/](https://ai-based-evaluation-platform.onrender.com/)** 