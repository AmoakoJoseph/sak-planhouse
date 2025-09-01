# Overview

This is a full-stack construction house plans marketplace application called "SAK Constructions GH" built with React frontend and Express.js backend. The platform allows users to browse, purchase, and download architectural plans for various residential building types including villas, bungalows, and townhouses. The application includes user authentication, admin management capabilities, and a complete e-commerce workflow for digital plan sales.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 and TypeScript, using a modern component-based architecture with the following key design decisions:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for accessible, customizable interface components
- **Styling**: Tailwind CSS with a custom design system focused on construction/orange color theming
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: React Router for client-side navigation with role-based route protection
- **Authentication Context**: Custom useAuth hook providing authentication state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
The server uses Express.js with TypeScript in a RESTful API pattern:

- **Framework**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
- **Development Setup**: Vite middleware integration for seamless full-stack development
- **Session Management**: Uses connect-pg-simple for PostgreSQL-backed session storage

## Database Design
Uses PostgreSQL with Drizzle ORM for schema management:

- **Schema Location**: Shared schema definitions in `/shared/schema.ts` for type consistency
- **Migration Strategy**: Drizzle Kit for database migrations and schema updates
- **Connection**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Type Safety**: Full TypeScript integration with inferred types from schema

## Authentication & Authorization
Implements a role-based authentication system:

- **User Roles**: Three-tier system (user, admin, super_admin) with different access levels
- **Authentication Provider**: Supabase integration for user management and authentication
- **Profile Management**: Extended user profiles with company information and preferences
- **Route Protection**: Component-level and route-level access control based on user roles

## Application Structure
The codebase follows a monorepo pattern with clear separation of concerns:

- **Client Directory**: Contains all React frontend code with organized component structure
- **Server Directory**: Express.js backend with modular route handling
- **Shared Directory**: Common types, schemas, and utilities used by both client and server
- **Component Organization**: UI components separated into reusable components and page-specific components

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database for data persistence
- **Authentication**: Supabase for user authentication and session management
- **File Storage**: Assumed integration for storing plan files and images (not explicitly configured)

## Development & Build Tools
- **Package Manager**: npm with lockfile for consistent dependency management
- **TypeScript**: Full TypeScript setup for type safety across the stack
- **ESLint/Prettier**: Code quality and formatting (implied by modern React setup)
- **Replit Integration**: Custom Replit plugins for development environment optimization

## Third-Party UI Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives for all interactive components
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom construction-themed design tokens
- **React Query**: Server state management for efficient data fetching and caching

## Payment Processing
- **Payment Gateway**: Not yet implemented but checkout flow is prepared for integration
- **E-commerce Features**: Shopping cart functionality and order management system ready for payment processor integration