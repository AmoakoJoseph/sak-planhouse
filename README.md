# SAK Constructions - Premium Plans Platform

A modern house plans platform built with React, TypeScript, and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sak-planhouse
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/sak_planhouse
   
   # Paystack Payment Gateway (Optional for demo mode)
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   
   # Session
   SESSION_SECRET=your_session_secret
   
   # Supabase (if using)
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Note:** If you don't have Paystack credentials, the system will automatically use demo mode for payments.

4. **Database Setup**
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Seed sample data (optional)
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server
   npm run dev:server
   
   # Terminal 2: Start frontend
   npm run dev:client
   ```

## 🔧 Features

- **House Plans Management**: Upload, categorize, and manage architectural plans
- **User Authentication**: Secure login and registration system
- **Payment Integration**: Paystack payment gateway with demo mode
- **Plan Comparison**: Side-by-side comparison of different house plans
- **User Reviews**: Customer feedback and rating system
- **3D Viewer**: Interactive plan visualization (placeholder)
- **Admin Panel**: Comprehensive admin dashboard and analytics
- **Responsive Design**: Mobile-first, modern UI built with Tailwind CSS

## 🎯 Demo Mode

The platform includes a comprehensive demo mode that allows you to:
- Browse sample house plans
- Test the payment flow without real transactions
- Explore all features without external service dependencies

## 📁 Project Structure

```
sak-planhouse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and API client
├── server/                 # Node.js backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database operations
│   └── paystack.ts        # Payment service
├── shared/                 # Shared types and schemas
├── supabase/               # Database migrations
└── uploads/                # File uploads
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:client` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, Drizzle ORM
- **Database**: PostgreSQL
- **Payment**: Paystack (with demo fallback)
- **File Uploads**: Multer
- **Build Tools**: Vite, esbuild

## 🚨 Troubleshooting

### Common Issues

1. **Payment Initialization Fails**
   - Check if `PAYSTACK_SECRET_KEY` is set in `.env`
   - If not set, the system will use demo mode automatically

2. **Database Connection Issues**
   - Verify `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Run migrations: `npm run db:migrate`

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript compilation: `npm run type-check`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.
