# UoaSwap: University of Auckland Campus Resource Integration Platform

UoaSwap is a centralized, user-friendly platform designed specifically for University of Auckland (UoA) students. It integrates a second-hand marketplace with an academic resource-sharing ecosystem to enhance information accessibility and resource efficiency within the student community.

---

## Project Overview

- **Objective**: To create a trusted environment where students can trade physical goods, share study materials, and access course information in one place.
- **Core Value**: Unlike general platforms, UoaSwap is tailored to the UoA academic structure, featuring a points-based economy to incentivize high-quality material sharing.

---

## Key Features

### 1. User Authentication & Profile

- Verified login via Google OAuth (UoA emails only)
- New users receive 1,000 starting points
- Profile management for uploads, listings, and personal info

---

### 2. Administrative Capabilities

- Role-Based Access Control (RBAC)
- Admin dashboard for content moderation and management
- Admin features only visible to authorized users

---

### 3. Material Sharing (Points System)

- Upload PDF/DOCX files with integrity declaration → earn 500 points
- Spend points to download peer materials
- Reporting system for inappropriate content

---

### 4. Campus Marketplace (Cash-Based)

- Trade textbooks, labwear, electronics, etc.
- Offline transactions via contact methods (WhatsApp/WeChat)

---

### 5. Course Hub

- Search courses by code (e.g., CS732)
- Centralized course pages with materials and listings

---

## Technology Stack

- Frontend: React, React Router, Vite, TinyMCE  
- Backend: Node.js, Express  
- Database: MongoDB  
- Security: JWT, bcryptjs  

---

## Installation and Setup

### Prerequisites

- Node.js v18+
- MongoDB

### Setup

```bash
git clone https://github.com/UOA-CS732-S1-2026/group-project-404-not-found

cd backend
npm install

cd ../frontend
npm install
Run
cd backend
npm start

cd frontend
npm run dev
Test Accounts
Admin: sky@aucklanduni.ac.nz
Password: sky123
Access: Full admin permissions
Team & Management

Developed using Agile Scrum over a 7-week sprint.

Team Members: Yuning Fan, Wei Wang, Theresa Zhu, Xiting Li, Junxi Chen, Seul Lee

Documentation (GitHub Wiki):

Meeting minutes
Task breakdown (WBS)
Role assignments
Development notes