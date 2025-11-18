# CISE_SPEED - QWEN Context File

## Project Overview

CISE_SPEED is the "Software Practice Empirical Evidence Database (SPEED)", a full-stack web application designed as a searchable database of evidence about different claims regarding various Software Engineering (SE) practices. The application consists of:

- **Backend**: A NestJS API server with MongoDB integration
- **Frontend**: A Next.js web application with React

## Architecture

The project follows a modern full-stack architecture with:

- **Backend**: NestJS (Node.js/TypeScript) with MongoDB via Mongoose
- **Frontend**: Next.js (React/TypeScript) with Tailwind CSS, Sass, and CSS Modules
- **Authentication**: Next-Auth for frontend, JWT-based system for backend
- **Database**: MongoDB with Mongoose ODM
- **API Communication**: REST API endpoints

## Backend Details

The backend is built with NestJS and includes:

- API modules for articles and users
- MongoDB integration with Mongoose schemas
- JWT-based authentication
- User management (registration, login)
- Article submission and management features
- Environment-based configuration
- Duplicate checking functionality
- Role-based access control (admin, moderator)

### Backend Technologies:

- NestJS 11.x
- TypeScript 5.x
- MongoDB/Mongoose
- BCrypt for password hashing
- JWT for authentication
- Nodemailer for email functionality
- Class-validator and class-transformer for validation
- Jest for testing

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
- Article submission form with validation
- Search functionality
- Admin dashboard for user and content management
- Moderator interface for article review
- Navigation bar with authentication context
- Responsive design with Sass styling and CSS Modules
- Rating system for articles
- Protected route components

### Frontend Technologies:

- Next.js 15.5.3
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS v4
- Sass for styling
- CSS Modules for component-specific styles
- Formik and Yup for form validation
- React Hook Form for form management
- React Icons for UI elements
- Jest and React Testing Library for testing

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

# Testing
npm run test          # run tests
npm run test:watch    # run tests in watch mode
npm run test:coverage # generate test coverage
```

The frontend runs on port 3000 by default and communicates with the backend API running on port 8082.

## Project Structure

```
CISE_SPEED/
├── backend/                      # NestJS API server
│   ├── src/
│   │   ├── api/                  # API modules (article, user)
│   │   │   ├── article/          # Article management
│   │   │   │   ├── article.controller.ts
│   │   │   │   ├── article.service.ts
│   │   │   │   ├── article.schema.ts
│   │   │   │   └── create-article.dto.ts
│   │   │   └── user/             # User management and auth
│   │   │       ├── user.controller.ts
│   │   │       ├── user.service.ts
│   │   │       ├── user.schema.ts
│   │   │       ├── jwt-auth.guard.ts
│   │   │       ├── admin.guard.ts
│   │   │       └── user.dto.ts
│   │   ├── controllers/          # Additional controllers
│   │   ├── services/             # Additional services
│   │   ├── app.module.ts         # Main application module
│   │   └── main.ts               # Entry point
│   └── package.json
├── frontend/                     # Next.js web application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── nav/              # Navigation components
│   │   │   ├── table/            # Table components
│   │   │   ├── ArticleRating.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── ModeratorQueue.tsx
│   │   │   ├── PopulatedNavBar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SearchArticles.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── SubmissionForm.tsx
│   │   │   └── SubmitterForm.tsx
│   │   ├── contexts/             # React contexts (AuthContext)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Next.js pages
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── articles/         # Article pages
│   │   │   ├── _app.tsx          # Custom App component
│   │   │   ├── index.tsx         # Home page
│   │   │   ├── login.tsx         # Login page
│   │   │   ├── moderator.tsx     # Moderator page
│   │   │   ├── ratings.tsx       # Ratings page
│   │   │   ├── register.tsx      # Registration page
│   │   │   ├── search.tsx        # Search page
│   │   │   └── submit.tsx        # Article submission page
│   │   ├── styles/               # Sass stylesheets and CSS modules
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
│   └── package.json
├── test_duplicate_check.js       # Standalone duplicate checking script
└── README.md
```

## Key Features

1. **User Authentication**: Registration, login, and role-based access (admin, moderator, regular user)
2. **Article Management**: Submit, search, rate, and review articles with empirical evidence
3. **Database Integration**: MongoDB-based storage for articles and user data
4. **Search Functionality**: Searchable database of SE practice evidence with filtering
5. **Role-based UI**: Different interfaces for regular users, moderators, and admins
6. **Article Rating System**: Users can rate articles to provide quality feedback
7. **Moderation Queue**: Moderators can review and approve submitted articles
8. **Admin Dashboard**: Admins can manage users and articles
9. **Duplicate Checking**: System to identify potential duplicate article submissions
10. **Protected Routes**: Ensuring proper access control throughout the application

## Development Conventions

- TypeScript is used throughout both frontend and backend
- REST API conventions for backend endpoints
- Component-based architecture in React
- Context API for state management
- Sass and CSS Modules for styling
- Form validation with Yup and Formik
- Git-based version control with .gitignore files in both subprojects
- Design system: Use the unified styling system defined in `design-system.scss` for consistent UI components
- Component styling: Always use CSS custom properties and predefined class names from the design system when creating new components
- Testing: Jest for unit and integration tests, React Testing Library for component tests
- API controllers should validate input using DTOs with class-validator
- Use guards for authentication and authorization checks

## Environment Configuration

The application requires environment variables for:

- Database connection (DB_URI)
- Port configurations
- Authentication secrets (JWT_SECRET, JWT_EXPIRES_IN)
- Email configuration (for password reset, if implemented)

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
- Frontend: Jest with React Testing Library for unit and integration tests
- Run `npm run test` in each directory to run tests
- Run `npm run test:coverage` for frontend to generate test coverage

## Design System

The frontend uses a comprehensive design system defined in `frontend/src/styles/design-system.scss` that provides:

- CSS custom properties (variables) for consistent design tokens:
  - Color palette (primary, secondary, neutral, success, warning, error)
  - Typography (fonts, sizes, weights)
  - Spacing
  - Border radius
  - Shadows
  - Transitions
- Reusable component classes:
  - Buttons (btn, btn-primary, btn-secondary, btn-success)
  - Form elements (form-group, form-label, form-input, form-select, form-textarea)
  - Cards (card, card-header, card-body, card-title)
  - Alerts (alert, alert-success, alert-error, alert-warning)
  - Utility classes (text-center, d-flex, justify-content-center, etc.)

When creating new components:

- Always use CSS custom properties from the design system (e.g., `var(--primary-600)`, `var(--spacing-md)`)
- Apply predefined class names from the design system when possible
- Use CSS Modules for component-specific styling to avoid global CSS conflicts
- Follow the existing component structure and naming conventions
- Use `@extend` directive when creating similar components to leverage existing Sass styles

## Notes

- The application is actively developed with regular updates and feature additions
- The project focuses on creating a repository of empirical evidence for software engineering practices
- Authentication is required for article submission, ratings, and administrative functions
- The project uses both Sass stylesheets and CSS Modules for styling flexibility
- API endpoints are protected with JWT tokens and role-based access control
- The application includes automated duplicate checking to maintain data quality