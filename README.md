# ERP Quotation Module - Backend

A Node.js REST API backend for an ERP Quotation Management System built with Express.js, Sequelize ORM, and PostgreSQL (Supabase).

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Customer, Sales)
  - Secure password hashing with bcrypt

- **Quotation Management**
  - Create quotations with multiple items
  - Automatic total calculation
  - Status tracking (pending, approved, rejected, converted_to_order)
  - Audit trail for all changes

- **Sales Order Management**
  - Automatic generation from approved quotations
  - Status tracking and updates
  - Customer and sales user access control

- **Product Management**
  - Product catalog with search and filtering
  - Stock quantity tracking
  - Category-based organization

## Technology Stack

- **Runtime**: Node.js v18 LTS
- **Framework**: Express.js ~4.19.2
- **Database**: PostgreSQL (Supabase)
- **ORM**: Sequelize ~6.37.3
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Database configuration
│   │   └── auth.js          # Authentication configuration
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Product.js       # Product model
│   │   ├── Quotation.js     # Quotation model
│   │   ├── QuotationItem.js # Quotation items model
│   │   ├── SalesOrder.js    # Sales order model
│   │   ├── SalesOrderItem.js # Sales order items model
│   │   ├── QuotationAuditTrail.js # Audit trail model
│   │   └── index.js         # Model associations
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── quotationController.js # Quotation management
│   │   ├── salesOrderController.js # Sales order management
│   │   └── productController.js   # Product management
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   └── validation.js    # Input validation
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── quotations.js    # Quotation routes
│   │   ├── salesOrders.js   # Sales order routes
│   │   ├── products.js      # Product routes
│   │   └── index.js         # Route aggregation
│   └── app.js               # Main application file
├── package.json
├── .env.example
└── README.md
```

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: 'customer', 'sales')
- `first_name`, `last_name`, `phone` (Optional)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamps)

### Products
- `id` (UUID, Primary Key)
- `name`, `description`, `sku` (String)
- `price` (Decimal)
- `stock_quantity` (Integer)
- `category` (String, Optional)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamps)

### Quotations
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key)
- `quotation_number` (String, Unique)
- `status` (Enum: 'pending', 'approved', 'rejected', 'converted_to_order')
- `total_amount` (Decimal)
- `notes`, `valid_until` (Optional)
- `created_by`, `approved_by` (UUID, Foreign Keys)
- `approved_at`, `created_at`, `updated_at` (Timestamps)

### Quotation Items
- `id` (UUID, Primary Key)
- `quotation_id`, `product_id` (UUID, Foreign Keys)
- `quantity` (Integer)
- `unit_price`, `sub_total` (Decimal)
- `discount_percentage`, `discount_amount` (Decimal)
- `created_at`, `updated_at` (Timestamps)

### Sales Orders
- `id` (UUID, Primary Key)
- `quotation_id`, `customer_id` (UUID, Foreign Keys)
- `order_number` (String, Unique)
- `status` (Enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `total_amount` (Decimal)
- `notes`, `expected_delivery_date` (Optional)
- `created_by` (UUID, Foreign Key)
- `order_date`, `created_at`, `updated_at` (Timestamps)

### Sales Order Items
- Similar structure to Quotation Items
- `sales_order_id` instead of `quotation_id`

### Quotation Audit Trail
- `id` (UUID, Primary Key)
- `quotation_id`, `changed_by` (UUID, Foreign Keys)
- `event_type` (Enum: 'created', 'updated', 'status_changed', 'approved', 'rejected', 'converted_to_order')
- `old_status`, `new_status` (String)
- `change_reason` (Text)
- `metadata` (JSON)
- `changed_at` (Timestamp)

## Setup Instructions

### Option 1: Docker Deployment (Recommended)

The easiest way to run the application is using Docker, which provides a complete environment with PostgreSQL database included.

#### Quick Start with Docker

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   git clone <your-repo-url>
   cd quotation-erp-fullstack/backend
   ```

2. **Build and run with Docker Compose:**
   ```bash
   # For production deployment
   docker-compose up -d
   
   # For development with hot reloading
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Access the application:**
   - API: http://localhost:3000
   - pgAdmin (database management): http://localhost:5050
     - Email: admin@admin.com
     - Password: admin123

#### Docker Services

- **backend**: Node.js API server
- **postgres**: PostgreSQL database with sample data
- **pgadmin**: Web-based PostgreSQL administration tool

#### Environment Variables for Docker

The Docker setup includes default environment variables. For production, update the following in `docker-compose.yml`:

```yaml
environment:
  JWT_SECRET: your-super-secure-jwt-secret-change-this-in-production
  DATABASE_URL: postgresql://postgres:secure-password@postgres:5432/erp_quotation
```

#### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose down && docker-compose up -d --build

# Access backend container
docker exec -it erp-backend sh

# Access database
docker exec -it erp-postgres psql -U postgres -d erp_quotation
```

### Option 2: Manual Setup (Local Development)

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Configure your Supabase database connection:
   ```bash
   # Get your Supabase connection string from your project settings
   # It should look like: postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   DATABASE_URL=postgresql://username:password@db.supabase.co:5432/postgres
   ```

3. Set a secure JWT secret:
   ```bash
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The application will automatically create and sync the database tables when you start the server in development mode.

For production, you should:
1. Set `NODE_ENV=production` in your environment
2. Run migrations manually if needed
3. Ensure your database is properly configured

### 4. Start the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Products
- `GET /api/products` - Get all products (authenticated)
- `GET /api/products/:id` - Get product by ID (authenticated)

### Quotations
- `POST /api/quotations` - Create quotation (customer only)
- `GET /api/quotations` - Get quotations (filtered by role)
- `GET /api/quotations/:id` - Get quotation by ID
- `PUT /api/quotations/:id/approve` - Approve/reject quotation (sales only)

### Sales Orders
- `GET /api/sales-orders` - Get sales orders (filtered by role)
- `GET /api/sales-orders/:id` - Get sales order by ID
- `PUT /api/sales-orders/:id/status` - Update sales order status (sales only)
- `GET /api/sales-orders/quotation/:quotationId` - Get sales orders by quotation

### Health Check
- `GET /api/health` - API health check

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for customers and sales users
- **Password Hashing**: Secure password storage using bcrypt
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet**: Security headers for Express apps

## Development Notes

### CORS Configuration
- Development: Allows `localhost:3000`, `localhost:3001`, `localhost:5173`
- Production: Configure `FRONTEND_URL` in environment variables

### Database Transactions
Critical operations use database transactions to ensure data consistency:
- Quotation creation with items
- Quotation approval and sales order generation
- Complex updates involving multiple tables

### Error Handling
- Global error handler for consistent error responses
- Specific handling for Sequelize validation errors
- Proper HTTP status codes for different error types

## Production Deployment

### Docker Production Deployment

1. **Update environment variables** in `docker-compose.yml`:
   ```yaml
   environment:
     NODE_ENV: production
     DATABASE_URL: postgresql://postgres:SECURE_PASSWORD@postgres:5432/erp_quotation
     JWT_SECRET: YOUR_SUPER_SECURE_JWT_SECRET_256_BITS_OR_MORE
     FRONTEND_URL: https://your-frontend-domain.com
   ```

2. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

3. **Set up reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-api-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Enable SSL/TLS** with Let's Encrypt or your preferred certificate provider

### Manual Production Deployment

1. Set `NODE_ENV=production`
2. Configure secure environment variables
3. Set up proper CORS origins
4. Configure rate limiting appropriately
5. Set up database backups
6. Configure logging and monitoring
7. Use process managers like PM2

### Docker Production Checklist

- [ ] Update all default passwords
- [ ] Configure secure JWT secret (256+ bits)
- [ ] Set proper CORS origins
- [ ] Enable SSL/TLS
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set up monitoring and alerting
- [ ] Configure firewall rules
- [ ] Enable container restart policies

## Sample Data

The Docker setup includes sample data for testing:

**Sample Users:**
- Sales User: `admin@example.com` / `password123`
- Customer: `customer@example.com` / `password123`

**Sample Products:**
- Laptop Computer ($999.99) - Electronics - SKU: LAP001
- Office Chair ($299.99) - Furniture - SKU: CHR001
- Wireless Mouse ($49.99) - Electronics - SKU: MOU001
- Desk Lamp ($79.99) - Office Supplies - SKU: LMP001
- Monitor Stand ($89.99) - Electronics - SKU: STD001

**API Testing Workflow:**
1. Login with test credentials to get JWT token
2. Use token to browse products (`GET /api/products`)
3. Create quotation with product IDs (`POST /api/quotations`)
4. Sales user approves quotation (`PUT /api/quotations/{id}/approve`)
5. View generated sales order (`GET /api/sales-orders`)

## API Usage Examples

### Register a new customer:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123",
    "role": "customer",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Create a quotation:
```bash
curl -X POST http://localhost:3000/api/quotations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "product_id": "product-uuid",
        "quantity": 2,
        "unit_price": 100.00,
        "discount_percentage": 10
      }
    ],
    "notes": "Special requirements here"
  }'
```

### Approve a quotation (sales user):
```bash
curl -X PUT http://localhost:3000/api/quotations/quotation-uuid/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "action": "approve",
    "reason": "Approved by sales manager"
  }'
```

## API Documentation

### Swagger/OpenAPI Documentation

The API includes comprehensive Swagger documentation available at:
- **Local Development**: http://localhost:3000/api-docs
- **Production**: https://your-api-domain.com/api-docs

#### Features:
- Complete API endpoint documentation
- Interactive testing interface
- Request/response schemas
- Authentication examples
- Error response documentation

#### Authentication in Swagger:
1. Register or login via `/api/auth/register` or `/api/auth/login`
2. Copy the JWT token from the response
3. Click "Authorize" button in Swagger UI
4. Enter: `Bearer YOUR_JWT_TOKEN`
5. Now you can test authenticated endpoints

### API Testing

The project includes comprehensive unit tests covering:
- Authentication and authorization
- Quotation management
- Sales order management
- Input validation
- Error handling

#### Running Tests

```bash
# Install dependencies (including test dependencies)
npm install

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

#### Test Coverage

The test suite aims for 70% coverage across:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

#### Test Structure

```
tests/
├── setup.js              # Test environment setup
├── fixtures/              # Test data
│   ├── users.js           # Sample user data
│   └── products.js        # Sample product data
└── unit/                  # Unit tests
    ├── auth.test.js       # Authentication tests
    ├── quotations.test.js # Quotation management tests
    └── salesOrders.test.js # Sales order tests
```

#### Test Database

Tests use SQLite in-memory database for:
- Fast test execution
- Isolated test environment
- No external dependencies
- Automatic cleanup between tests

#### Sample Test Commands

```bash
# Run specific test file
npx jest tests/unit/auth.test.js

# Run tests matching pattern
npx jest --testNamePattern="should create quotation"

# Run tests with verbose output
npx jest --verbose

# Generate and open coverage report
npm run test:coverage && open coverage/lcov-report/index.html
```

#### Continuous Integration

The test suite is designed to run in CI/CD environments:
- No external database dependencies
- Fast execution (< 30 seconds)
- Deterministic results
- Comprehensive error reporting

-------------------------------------------------
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

  
## License

This project is licensed under the ISC License.
