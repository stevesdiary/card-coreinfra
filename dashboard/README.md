
#POSTMAN COLLECTION - https://grey-space-129421.postman.co/workspace/New-Team-Workspace~3e5a2bfd-0d46-4882-af08-b2478d38fa77/collection/25707938-75fd14d0-415d-44e7-a3f4-0046712bba3b?action=share&creator=25707938

Documentation for this project is here  -  https://docs.google.com/document/d/1qbXhfB2DAL7JOahl-RVti3ibBVqtWXvUYiBqGadUf_k/edit?usp=sharing 


CARD MANAGEMENT DASHBOARD
Documentation
Contents
Application Documentation
API Documentation

Application Documentation
 Overview


 Key Features
- Card Creation and Fees management
- Card Request and Approval flow
- Secure User Authentication and authorisation

Tech Stack
- Backend: Node.js, TypeScript
- Database: PostgreSQL
- ORM: Sequelize-typescript
- Authentication: JWT

 Quick Start

 Prerequisites
- Node.js (v18+)
- PostgreSQL (v13+)

 Installation

 Clone the repository
git clone https://github.com/stevesdiary/card-coreinfra

 Navigate to project directory
cd card-dashboard

 Install dependencies
npm install

 Setup environment variables
Rename the sample environment variable to .env and replace the values with your credentials.
.env.example

 Run database migrations
Automatically runs with npm start  and you can also run 

npx sequelize-cli db:migrate


 Start development server
npm run dev or npm start

Microservices Overview
1. Authentication Service
   - Handles user registration
   - Manages JWT tokens
   - Implements role-based access control

2. Card Profile Service
   - Manages Card creation
   - Manage card fees
   - Manages Card requests and approval

3. User Management Service
   - Manages user profiles
