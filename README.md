# LU Connect – Frontend

LU Connect is a career development platform built for students of the **University of Lucknow**. Its mission is to make career opportunities and professional development more accessible through curated job and internship listings, resume analysis, and AI-powered job compatibility insights.

This repository contains the **frontend application** of LU Connect. The backend is maintained separately in its own repository.

## Features

- **Job Opportunities:** Browse curated on-campus and off-campus job opportunities.
- **Internship Opportunities:** Explore available internship listings.
- **Job Applications:** Apply for jobs and track application status.
- **Internship Applications:** Apply for internships and track application status.
- **Resume Analyzer:** Get AI-powered feedback on your resume, including skill gaps and improvement suggestions.
- **AI Compatibility Analyzer:** Analyze how well your resume matches a job description and receive a compatibility score.
- **Student Authentication:** Secure student authentication using Clerk.
- **Student Dashboard:** Access career opportunities, applications, and resume tools in one place.
- **Responsive UI:** A user-friendly interface designed for desktop and mobile devices.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **UI Animations:** Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **AI Integration:** Google Gemini API

## Project Architecture

LU Connect is organized into two separate repositories:

| Repository | Responsibility |
|---|---|
| Frontend (this repository) | Next.js application, UI, student dashboard, and frontend API integration |
| Backend (separate repository) | NestJS REST APIs, database operations, authentication verification, and application logic |

The frontend communicates with the backend through REST APIs.

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git
- Access to the LU Connect backend

### 1. Clone the Repository

```bash
git clone https://github.com/abhishekpathak4860/LU-Connect-Frontend.git
cd lu-connect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and configure the required environment variables.

```env
NEXT_PUBLIC_BACKEND_URL=your_backend_api_url

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Add any additional environment variables required by your current Clerk, Supabase, or Gemini integrations.

**Important:** Never commit `.env.local` or expose secret API keys in the repository.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Integration

The frontend requires the separately maintained LU Connect backend to access features such as:

- Job and internship listings
- Job and internship applications
- Student profile management
- Resume analysis and compatibility checking
- AI-powered services

**Backend Repository:** [LU Connect – Backend](https://github.com/abhishekpathak4860/Lu-Connect_Backend.git)

Configure `NEXT_PUBLIC_BACKEND_URL` with the backend API URL before running the application.

## Production Deployment

The frontend is deployed separately from the backend.

For production deployment, configure the required environment variables in your hosting platform and ensure the backend API URL points to the production backend.



## Project Mission

LU Connect aims to democratize access to career opportunities and professional development for University of Lucknow students by bringing opportunities, resume tools, and AI-powered career insights together on one platform.

---

**Built to help University of Lucknow students connect with better career opportunities.**