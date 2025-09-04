# Overview

SAK Constructions is a premium house plans platform that allows users to browse, purchase, and download professional architectural plans. The platform serves as a marketplace for construction plans featuring villas, bungalows, townhouses, and other residential designs. Users can select from different package tiers (Basic, Standard, Premium) and make secure payments through Paystack integration. The system includes both customer-facing features and administrative capabilities for managing plans, orders, and users.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Technology Stack**: React 18 with TypeScript, built using Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives, styled using Tailwind CSS with a custom design system
- **State Management**: React Context for authentication state, TanStack Query for server state management and caching
- **Routing**: React Router for client-side navigation with protected routes for admin and user dashboards
- **Build Configuration**: Monorepo structure with separate client and server directories, shared TypeScript configuration

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database Layer**: Drizzle ORM with PostgreSQL database, using connection pooling for scalability
- **Authentication**: Session-based authentication with secure session management
- **File Handling**: Multer middleware for file uploads with organized storage structure for plan files and images
- **API Design**: RESTful API structure with comprehensive error handling and logging middleware

## Data Storage Solutions
- **Primary Database**: PostgreSQL with structured schemas for users, profiles, plans, orders, and downloads
- **Schema Management**: Drizzle-kit for database migrations and schema evolution
- **File Storage**: Local file system with organized directory structure for uploaded plan files and images
- **Session Storage**: Database-backed session storage using connect-pg-simple

## Authentication and Authorization
- **User Authentication**: Email/password based authentication with secure password hashing
- **Role-Based Access**: Three-tier system (user, admin, super_admin) with route-level protection
- **Session Management**: Secure server-side sessions with configurable expiration
- **Admin Protection**: Dedicated admin routes with role verification middleware

## External Dependencies

### Payment Processing
- **Paystack Integration**: Primary payment gateway for processing transactions in Ghana
- **Demo Mode**: Fallback system when Paystack credentials are not configured
- **Payment Verification**: Server-side payment verification with order status updates

### Database Services
- **PostgreSQL**: Primary database with connection string configuration
- **Optional Supabase**: Alternative database hosting option (configuration present but not required)

### Development and Deployment
- **Vercel Deployment**: Configured for seamless deployment with custom build scripts
- **Environment Configuration**: Comprehensive environment variable management for different deployment stages
- **Build System**: Custom build scripts for handling client-server coordination in deployment

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Custom Design System**: Brand-specific color palette and component styling focused on construction/architecture theme

### File Processing
- **Multer**: File upload handling with type validation and size limits
- **Image Processing**: Support for various image formats with organized storage
- **Plan File Management**: Structured storage system for different plan file types and tiers