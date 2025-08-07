# 🎓 Mini EduTech Learning Platform

A comprehensive EdTech web application built with modern technologies, featuring course management, role-based access control, and an intuitive user interface.

## ✨ Features

### Core Functionality
- **Course Management**: Browse, view, and manage educational courses
- **Role-Based Access**: Distinct permissions for Students and Professors
- **User Authentication**: Secure login/registration system with JWT
- **Enrollment System**: Easy course enrollment and unenrollment
- **Real-time Updates**: Live data synchronization across the platform

### Student Features
- Browse and enroll in available courses
- View course details and participant information
- Access enrolled courses dashboard
- Track learning progress

### Professor Features
- Create new courses with detailed descriptions
- Edit and manage existing courses
- View enrollment statistics
- Delete courses (with confirmation)

## 🛠️ Technology Stack

### Backend
- **GraphQL API**: Apollo Server with Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based auth system
- **Node.js**: Runtime environment with TypeScript

### Frontend
- **Next.js 14**: React framework with TypeScript
- **Apollo Client**: GraphQL client for state management
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Beautiful notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

#### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
setup.bat
```

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup

1. **Clone and install dependencies:**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

2. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

### Running the Application

```bash
# Start both backend and frontend (from root directory)
npm run dev

# Or start them separately:
npm run dev:backend  # Backend on http://localhost:4000
npm run dev:frontend # Frontend on http://localhost:3000
```

## 📝 Demo Accounts

The application comes pre-seeded with demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | john@student.com | password123 |
| Professor | jane@professor.com | password123 |
| Admin | admin@edutech.com | password123 |

## 📊 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Playground**: Available in development mode

### Core Operations

#### Queries
- `courses`: Fetch all available courses
- `course(id)`: Get a specific course by ID
- `me`: Get current user information
- `userEnrollments(userId)`: Get user's enrollments

#### Mutations
- `login(email, password)`: User authentication
- `register(name, email, password)`: User registration
- `createCourse(input)`: Create a new course (Professor only)
- `updateCourse(id, input)`: Update course details (Professor only)
- `deleteCourse(id)`: Delete a course (Professor only)
- `enrollInCourse(courseId, role)`: Enroll in a course
- `unenrollFromCourse(courseId)`: Unenroll from a course

## 🗂️ Project Structure

```
Mini-EduTech-Nexus/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts           # Database seeding
│   ├── src/
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── resolvers.ts      # GraphQL resolvers
│   │   ├── schema.ts         # GraphQL schema
│   │   └── server.ts         # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── lib/             # Utilities and configurations
│   │   ├── pages/           # Next.js pages
│   │   ├── store/           # State management
│   │   └── styles/          # CSS styles
│   └── package.json
├── setup.sh                 # Linux/Mac setup script
├── setup.bat                # Windows setup script
└── package.json             # Root package configuration
```

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Role-based Authorization**: Different permissions for Students and Professors
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Input Validation**: Comprehensive validation on both client and server
- **CORS Configuration**: Properly configured for development and production

## 🎨 User Interface

### Design Principles
- **Modern & Clean**: Minimalist design with intuitive navigation
- **Responsive**: Mobile-first approach with responsive layouts
- **Accessible**: WCAG-compliant design patterns
- **Fast Loading**: Optimized performance with Next.js

### Key Pages
- **Home**: Course catalog with search and filtering
- **Course Details**: Comprehensive course information and enrollment
- **My Courses**: Personal dashboard for enrolled and teaching courses
- **Authentication**: Clean login and registration forms
- **Course Management**: Create and edit course interfaces

## 🚦 Development Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Building
npm run build           # Build both projects
npm run build:backend   # Build backend only
npm run build:frontend  # Build frontend only

# Production
npm start              # Start both in production mode

# Database
cd backend
npx prisma studio      # Open Prisma Studio (Database GUI)
npx prisma migrate dev # Create new migration
npx prisma db seed     # Re-seed database
```

## 🧪 Testing

### Sample Workflows

1. **As a Student:**
   - Register/Login → Browse Courses → Enroll → View My Courses

2. **As a Professor:**
   - Login → Create Course → Manage Enrollments → Edit Course Content

3. **Course Management:**
   - Create → Edit → Manage Participants → Delete (if needed)

## 🌐 Deployment

### Backend Deployment
- Configure environment variables for production
- Set up PostgreSQL for production database
- Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
- Build optimized production bundle
- Deploy to Vercel, Netlify, or similar platforms
- Configure environment variables

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
PORT=4000
NODE_ENV=production
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT="your-api-endpoint"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] Video content integration
- [ ] Course progress tracking
- [ ] Discussion forums
- [ ] Assignment submissions
- [ ] Grading system
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Course categories and tags
- [ ] Payment integration
- [ ] Mobile application

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the EduTech development team.

---

**Need Help?** Check out the demo accounts above or create your own account to explore all features!
