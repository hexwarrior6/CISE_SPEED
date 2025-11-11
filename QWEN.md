# CISE_SPEED - QWEN Context File

## Project Overview

CISE_SPEED is the "Software Practice Empirical Evidence Database (SPEED)", a full-stack web application designed as a searchable database of evidence about different claims regarding various Software Engineering (SE) practices. The application consists of:

- **Backend**: A NestJS API server with MongoDB integration
- **Frontend**: A Next.js web application with React

## Architecture

The project follows a modern full-stack architecture with:

- **Backend**: NestJS (Node.js/TypeScript) with MongoDB via Mongoose
- **Frontend**: Next.js (React/TypeScript) with Tailwind CSS and Sass
- **Authentication**: Next-Auth for frontend, JWT-based system for backend
- **Database**: MongoDB with Mongoose ODM
- **API Communication**: REST API endpoints

## Backend Details

The backend is built with NestJS and includes:

- API modules for articles, users, and analysis
- MongoDB integration with Mongoose
- JWT-based authentication
- User management (registration, login)
- Article submission and management features
- Environment-based configuration

### Backend Technologies:
- NestJS 11.x
- TypeScript 5.x
- MongoDB/Mongoose
- BCrypt for password hashing
- JWT for authentication

### Backend Scripts:
```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test          # unit tests
npm run test:e2e      # end-to-end tests
npm run test:cov      # test coverage
```

The backend runs on port 8082 by default and enables CORS for frontend communication.

## Frontend Details

The frontend is built with Next.js and provides:

- Main landing page with database overview
- User authentication (login/register)
- Article submission form
- Search functionality
- Admin and moderator interfaces
- Navigation bar with authentication context
- Responsive design with Sass styling

### Frontend Technologies:
- Next.js 15.x
- React 19.x
- TypeScript 5.x
- Tailwind CSS v4
- Sass for styling
- Formik and Yup for form validation
- React Hook Form for form management

### Frontend Scripts:
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

The frontend runs on port 3000 by default and communicates with the backend API running on port 8082.

## Project Structure

```
CISE_SPEED/
├── backend/              # NestJS API server
│   ├── src/
│   │   ├── api/          # API modules (article, user, analysis)
│   │   ├── app.module.ts # Main application module
│   │   └── main.ts       # Entry point
│   └── package.json
└── frontend/             # Next.js web application
    ├── src/
    │   ├── components/   # React components
    │   ├── contexts/     # React contexts (AuthContext)
    │   ├── pages/        # Next.js pages (index, login, submit, etc.)
    │   └── styles/       # Sass stylesheets
    └── package.json
```

## Key Features

1. **User Authentication**: Registration, login, and role-based access (admin, moderator)
2. **Article Management**: Submit, search, and review articles with empirical evidence
3. **Database Integration**: MongoDB-based storage for articles and user data
4. **Search Functionality**: Searchable database of SE practice evidence
5. **Role-based UI**: Different interfaces for regular users, moderators, and admins

## Development Conventions

- TypeScript is used throughout both frontend and backend
- REST API conventions for backend endpoints
- Component-based architecture in React
- Context API for state management
- Sass for complex styling, Tailwind CSS for utility classes
- Form validation with Yup and Formik
- Git-based version control with .gitignore files in both subprojects

## Environment Configuration

The application requires environment variables for:
- Database connection (DB_URI)
- Port configurations
- Authentication secrets (JWT)

## Building and Running

### Development:
1. Start the backend: `cd backend && npm run start:dev`
2. In a separate terminal, start the frontend: `cd frontend && npm run dev`
3. Access the application at http://localhost:3000

### Production:
1. Build the backend: `cd backend && npm run build`
2. Build the frontend: `cd frontend && npm run build`
3. Start the backend: `cd backend && npm run start:prod`
4. Start the frontend: `cd frontend && npm run start`

## Testing

- Backend: Jest-based unit and e2e tests
- Frontend: Standard Next.js testing capabilities

## Notes

- The application appears to be under active development based on the version numbers and architecture
- The project focuses on creating a repository of empirical evidence for software engineering practices
- Authentication is required for article submission and administrative functions