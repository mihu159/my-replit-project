# PostureTrack Pro - AI-Powered Posture Analysis Application

## Overview

PostureTrack Pro is a full-stack web application that provides AI-powered posture analysis and fitness coaching. The application combines real-time camera-based posture detection with personalized exercise recommendations, progress tracking, and educational content to help users improve their posture and prevent pain.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESNext modules
- **API Design**: RESTful API with middleware-based request processing
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: Role-based access control (user/admin roles)
- **Security**: HTTPS-only cookies with secure session management

### Posture Analysis Engine
- **Camera Integration**: WebRTC MediaDevices API for real-time video capture
- **AI Processing**: Simulated pose detection (placeholder for TensorFlow.js integration)
- **Real-time Feedback**: Live posture scoring with visual feedback overlay
- **Session Tracking**: Timestamped posture sessions with performance metrics

### Exercise Management
- **Exercise Library**: Categorized exercises with difficulty levels and instructions
- **User Assignments**: Daily exercise schedules with progress tracking
- **Completion Tracking**: Status management (scheduled, in_progress, completed, skipped)
- **Multimedia Support**: Video and image assets for exercise demonstrations

### Progress Analytics
- **Performance Metrics**: Weekly progress, streak tracking, and correction counts
- **Historical Data**: Time-series data for posture improvements
- **Feedback System**: Categorized feedback (corrections, achievements, tips)
- **Statistical Analysis**: Aggregated metrics for user insights

## Data Flow

### User Authentication Flow
1. User initiates login via Replit Auth
2. OpenID Connect authentication with JWT tokens
3. Session creation with PostgreSQL storage
4. Role-based route protection and API access

### Posture Analysis Flow
1. Camera permission request and stream initialization
2. Real-time video processing with pose detection hooks
3. Posture scoring algorithm execution
4. Live feedback display and session data storage
5. Progress metrics calculation and dashboard updates

### Exercise Management Flow
1. Admin creates exercises in the system
2. Daily exercise assignments generated for users
3. Users interact with exercises (start, complete, skip)
4. Progress tracking updates and statistics recalculation
5. Feedback generation based on completion patterns

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **passport & openid-client**: Authentication infrastructure

### Development Dependencies
- **vite**: Fast development server and build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Production build optimization
- **tailwindcss**: Utility-first CSS framework

### Authentication Dependencies
- **connect-pg-simple**: PostgreSQL session store
- **express-session**: Session management middleware
- **memoizee**: Function memoization for performance

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Assets**: Static assets served from build output directory

### Environment Configuration
- **Database**: `DATABASE_URL` for Neon PostgreSQL connection
- **Authentication**: `SESSION_SECRET`, `REPL_ID`, `ISSUER_URL` for auth
- **Development**: Automatic Replit integration with cartographer plugin

### Production Deployment
- **Server**: Express.js serves both API routes and static frontend
- **Database**: Serverless PostgreSQL with connection pooling
- **Sessions**: Persistent session storage in database
- **Security**: HTTPS enforcement and secure cookie configuration

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```