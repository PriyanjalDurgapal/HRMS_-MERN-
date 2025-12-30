**HRMS - Human Resource Management System**
    A comprehensive, scalable Human Resource Management System (HRMS) designed to streamline the entire employee lifecycle — from recruitment and onboarding to performance management, payroll processing, and offboarding.
    This full-stack application delivers real-time collaboration, robust security, and enterprise-grade efficiency through a modern MERN stack architecture. 

**Features**
    -**Role-Based Access Control: Secure authentication with JWT, supporting Admin, HR, Manager, and Employee roles. Includes OTP-based password recovery.

    -Payroll Management: Automated monthly salary calculations, handling taxes, deductions, leave adjustments, and PDF payslip generation.

    -Attendance & Leave Management: Shift scheduling, overtime tracking, leave requests/approvals, and seamless payroll integration.

    -Task & Project Management: Assignment tracking, deadlines, progress monitoring, and automated notifications.

    -Real-Time Communication: Instant messaging, group chats, and event-driven notifications powered by Socket.IO.

    -Employee Profiles: Upload and manage profile images, documents, and personal/professional details.

    -Dashboards & Analytics: Customized role-specific dashboards with key metrics for performance, payroll, attendance, and tasks.

    -Document Management: Secure, encrypted storage with access controls for sensitive files.

***Tech Stack***
-Frontend: React.js + Tailwind CSS
-Backend: Node.js + Express.js
-Database: MongoDB
-Real-Time: Socket.IO (WebSockets)
-Authentication: JWT + bcrypt
-Other: PDF generation (payslips), Docker for containerization

**Project Structure**
HRMS/
├── backend/                  # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── Dockerfile
├── frontend/
│   └── hrms-frontend/        # React frontend
│       ├── src/
│       ├── dist/
│       ├── Dockerfile
│       └── nginx.conf
├── docker-compose.yml        # Docker Compose orchestration
└── README.md                 # Project documentation

**Prerequisites**
Before running the project, make sure you have:
-Node.js (v18 or higher)
-Docker & Docker Compose (recommended for easy setup)
-Git

**Environment Variables**
Backend (.env in backend/)
-PORT=5000
-MONGO_URI=your_mongodb_atlas_uri
-JWT_SECRET=your-secret-key
-EMAIL_USER=your_email
-EMAIL_PASS=you_email_app_password
-FRONTEND_URL=http://localhost:3000

Getting Started
**Option 1: Using Docker (Recommended)**
From the project root directory:
# Build and start containers (backend, frontend, and MongoDB if configured)
docker-compose up --build -d

# To stop and remove containers
docker-compose down

Access URLs:
    Frontend: http://localhost:3000
    Backend API: http://localhost:5000

**Option 2: Running Locally (Without Docker)**
**Backend**
cd backend
npm install
node server.js  # or npm start if configured

**Frontend**
cd frontend/hrms-frontend
npm install
npm run build
npm run preview  # Or npm start for development mode

Access URLs:
    Frontend: http://localhost:5173 (dev) or configured preview port
    Backend API: http://localhost:5000

Troubleshooting
CORS Issues
If you encounter CORS errors during local development:
Ensure the backend includes allowed origins:
    app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
    }));


MongoDB Connection Issues

Verify your MONGO_URI is correct.
Whitelist your IP address in MongoDB Atlas network access settings.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch for your feature/bugfix.
Commit your changes with clear messages.
Open a Pull Request with a detailed description.