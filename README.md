# COORD.TRAVEL - DMC Web Application

A comprehensive Destination Management Company (DMC) web application built with Next.js, designed to streamline travel booking management, vendor relationships, and business operations.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Support for multiple organizations with isolated data
- **Booking Management**: Complete booking lifecycle from creation to completion
- **Vendor Management**: Hotels, Restaurants, Activities, Shops, and Transport services
- **User Management**: Role-based access control with Clerk authentication
- **Payment Integration**: PayHere payment gateway integration
- **Reporting & Analytics**: Comprehensive reporting dashboard
- **Voucher System**: Automated voucher generation and management
- **Task Management**: Workflow management for booking processes

### Key Modules
- **Dashboard**: Overview of business metrics and recent activities
- **Bookings**: Create, edit, and manage travel bookings
- **Vendors**: Manage hotel, restaurant, activity, shop, and transport vendors
- **Agents**: Manage travel agents and their permissions
- **Reports**: Generate business reports and analytics
- **Settings**: Organization settings and user management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **TanStack Table** - Data table component
- **Recharts** - Chart and visualization library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **Clerk** - Authentication and user management
- **PayHere** - Payment processing
- **Nodemailer** - Email notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Drizzle Kit** - Database migrations and studio
- **TypeScript** - Static type checking

## 📋 Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended package manager)
- **PostgreSQL** database
- **Clerk** account for authentication
- **PayHere** account for payments

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dmc-web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   POSTGRES_URL="your_postgres_connection_string"
   PROD_POSTGRES_URL="your_production_postgres_url"
   DEV_POSTGRES_URL="your_development_postgres_url"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

   # PayHere Payment Gateway
   PAYHERE_MERCHANT_ID="your_merchant_id"
   PAYHERE_MERCHANT_SECRET="your_merchant_secret"
   PAYHERE_APP_ID="your_app_id"
   PAYHERE_APP_SECRET="your_app_secret"
   PAYHERE_AUTHORIZATION="your_authorization_token"
   PAYHERE_ENDPOINT="https://sandbox.payhere.lk/pay/checkout"
   NEXT_PUBLIC_PAYHERE_ENDPOINT="https://sandbox.payhere.lk/pay/checkout"
   NEXT_PUBLIC_PAYHERE_NOTIFY_URL="your_notify_url"
   NEXT_PUBLIC_PAYHERE_RETURN_URL="your_return_url"
   NEXT_PUBLIC_PAYHERE_CANCEL_URL="your_cancel_url"

   # Email Configuration
   EMAIL_USER="your_email_user"
   EMAIL_PASS="your_email_password"
   NOTIFICATION_EMAIL="your_notification_email"

   # Discord (Optional)
   DISCORD_CLIENT_ID="your_discord_client_id"
   DISCORD_CLIENT_SECRET="your_discord_client_secret"

   # NextAuth
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate database migrations
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # Seed the database (optional)
   pnpm db:seed
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── sign-in/           # Authentication pages
│   └── sign-up/
├── components/            # React components
│   ├── bookings/          # Booking-related components
│   ├── common/            # Shared components
│   ├── hotels/            # Hotel management components
│   ├── restaurants/       # Restaurant management components
│   ├── activities/        # Activity management components
│   ├── shops/             # Shop management components
│   ├── transports/        # Transport management components
│   └── ui/                # UI component library
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── constants/         # Application constants
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Server-side code
│   ├── auth.ts            # Authentication configuration
│   └── db/                # Database configuration and queries
│       ├── migrations/    # Database migrations
│       ├── queries/       # Database query functions
│       └── schema.ts      # Database schema
└── styles/                # Global styles
```

## 🚀 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate database migrations
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database with initial data
```

## 🔐 Authentication & Authorization

The application uses **Clerk** for authentication with role-based access control:

- **Super Admin**: Full system access
- **Admin**: Organization-level administration
- **Manager**: Booking and vendor management
- **Agent**: Limited booking access

## 💳 Payment Integration

Integrated with **PayHere** payment gateway for:
- Subscription payments
- Booking payments
- Automated payment processing
- Webhook handling for payment status updates

## 📊 Database Schema

Key entities include:
- **Tenants**: Multi-tenant organizations
- **Users**: System users with roles
- **Bookings**: Travel bookings and itineraries
- **Vendors**: Hotels, restaurants, activities, shops, transport
- **Vouchers**: Automated voucher generation
- **Payments**: Payment tracking and history

## 🔧 Configuration

### Multi-tenant Setup
Each organization operates in isolation with:
- Separate data access
- Custom voucher settings
- Individual payment configurations
- Role-based permissions

### Environment Variables
All environment variables are validated using Zod schemas for type safety and runtime validation.

## 📈 Deployment

### Production Build
```bash
pnpm build
```

### Environment Variables for Production
Ensure all production environment variables are set in your deployment platform (Vercel, Railway, etc.)

### Database Migrations
Run migrations in production:
```bash
pnpm db:migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**COORD.TRAVEL** - Streamlining Destination Management Operations