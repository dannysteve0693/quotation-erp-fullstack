# ERP Quotation Module - Frontend

A modern React/Next.js frontend for the ERP Quotation Management System.

## Features

### Authentication & User Management
- User login and registration with role selection (Customer/Sales)
- JWT token management with automatic persistence
- Role-based UI and navigation

### For Customers
- **Quotation Creation**: Interactive form to select products and quantities
- **Quotation Management**: View quotation history with status tracking
- **Real-time Calculations**: Dynamic total amount calculation
- **Responsive Design**: Mobile-first design with tablet/desktop scaling

### For Sales Users
- **Product Management**: Add, edit, and manage product catalog
- **Quotation Approval**: Review and approve/reject customer quotations
- **Sales Order Creation**: Convert approved quotations to sales orders
- **Advanced Dashboard**: Comprehensive overview with statistics

### Common Features
- **Dark/Light Mode**: Toggle with persistent user preference
- **Responsive Layout**: Mobile-first design that scales beautifully
- **Real-time Updates**: Live status updates and notifications
- **Loading States**: Skeleton loading for better UX
- **Form Validation**: Client-side validation with clear error messages
- **Audit Trail**: Complete history of quotation status changes

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Native fetch API
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see environment configuration below)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env.local` and update the API URL:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Environment Configuration

The application is configured to use production API by default:
- **Production API**: `https://quotation-erp-fullstack.onrender.com/api`
- **Local Development**: `http://localhost:3000/api`

Update `.env.local` to switch between environments.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application component
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   ├── products/          # Product management
│   ├── quotations/        # Quotation components
│   ├── sales-orders/      # Sales order components
│   └── ui/                # Reusable UI components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and API client
└── types/                 # TypeScript type definitions
```

## Key Components

### Authentication
- `LoginForm`: User authentication with validation
- `RegisterForm`: User registration with role selection

### Dashboard
- Role-specific dashboards with relevant statistics
- Quick actions and recent activity summaries

### Product Management (Sales Only)
- CRUD operations for product catalog
- Stock quantity tracking
- Form validation and error handling

### Quotation Management
- `QuotationForm`: Interactive quotation creation
- `QuotationList`: Filterable and sortable quotation list
- `QuotationDetail`: Detailed view with audit trail

### Sales Orders (Sales Only)
- Order status management with timeline
- Integration with quotation system

## API Integration

The frontend communicates with the backend API through:
- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Comprehensive error handling with user feedback

## Responsive Design

The application follows a mobile-first approach:
- **Mobile**: Optimized layouts for phones
- **Tablet**: Enhanced layouts with better space utilization
- **Desktop**: Full-featured layouts with multiple columns

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Consistent component patterns
- Proper error boundaries

### State Management
- React Context for global state
- Local component state for UI state
- Optimistic updates where appropriate

### Performance
- Code splitting with Next.js
- Image optimization
- Bundle size optimization
- Loading states for better UX

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file for local configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Deployment

The application can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+