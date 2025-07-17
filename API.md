# ERP Quotation API - Endpoint Contracts

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-api-domain.com/api`

## Authentication
All endpoints except registration and login require JWT authentication via `Authorization: Bearer <token>` header.

## Response Format
All responses follow a consistent JSON structure:

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated endpoints
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "customer", // "customer" or "sales"
  "first_name": "John", // optional
  "last_name": "Doe", // optional
  "phone": "+1234567890" // optional
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "customer",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Validation error or email already exists
- `500`: Internal server error

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "customer",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  }
}
```

**Error Responses:**
- `400`: Validation error
- `401`: Invalid credentials
- `500`: Internal server error

---

### GET /auth/profile
Get current user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "customer",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: Invalid token
- `404`: User not found

---

### PUT /auth/profile
Update current user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "first_name": "John", // optional
  "last_name": "Doe", // optional
  "phone": "+1234567890" // optional
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "customer",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `404`: User not found
- `500`: Internal server error

---

## Product Endpoints

### GET /products
Get list of active products with optional filtering and pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10, max: 100): Items per page
- `category` (string): Filter by product category
- `search` (string): Search in name, description, or SKU

**Access Control:**
- **Both customer and sales users** can access product catalog

**Success Response (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Laptop Computer",
      "description": "High-performance business laptop",
      "sku": "LAP001",
      "price": "999.99",
      "stock_quantity": 50,
      "category": "Electronics",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `500`: Internal server error

---

### GET /products/{id}
Get product details by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (uuid): Product identifier

**Success Response (200):**
```json
{
  "product": {
    "id": "uuid",
    "name": "Laptop Computer",
    "description": "High-performance business laptop",
    "sku": "LAP001",
    "price": "999.99",
    "stock_quantity": 50,
    "category": "Electronics",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `404`: Product not found
- `500`: Internal server error

---

## Quotation Endpoints

### POST /quotations
Create a new quotation (Customer role only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 999.99, // optional, defaults to product price
      "discount_percentage": 10 // optional, default: 0
    }
  ],
  "notes": "Special requirements", // optional
  "valid_until": "2024-12-31T23:59:59Z" // optional
}
```

**Success Response (201):**
```json
{
  "message": "Quotation created successfully",
  "quotation": {
    "id": "uuid",
    "quotation_number": "Q-1701234567890",
    "customer_id": "uuid",
    "status": "pending",
    "total_amount": "1899.98",
    "notes": "Special requirements",
    "valid_until": "2024-12-31T23:59:59Z",
    "created_by": "uuid",
    "approved_by": null,
    "approved_at": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "unit_price": "999.99",
        "discount_percentage": "10.00",
        "discount_amount": "199.998",
        "sub_total": "1799.982",
        "product": {
          "id": "uuid",
          "name": "Laptop Computer",
          "sku": "LAP001"
        }
      }
    ],
    "customer": {
      "id": "uuid",
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

**Error Responses:**
- `400`: Validation error or invalid product
- `401`: Authentication required
- `403`: Only customers can create quotations
- `500`: Internal server error

---

### GET /quotations
Get list of quotations with filtering and pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page
- `status` (string): Filter by status (pending, approved, rejected, converted_to_order)
- `startDate` (date): Filter from date (YYYY-MM-DD)
- `endDate` (date): Filter to date (YYYY-MM-DD)
- `customerId` (uuid): Filter by customer ID (sales users only)

**Access Control:**
- **Customer users**: Can only see their own quotations
- **Sales users**: Can see all quotations

**Success Response (200):**
```json
{
  "quotations": [
    {
      "id": "uuid",
      "quotation_number": "Q-1701234567890",
      "customer_id": "uuid",
      "status": "pending",
      "total_amount": "1899.98",
      "notes": "Special requirements",
      "valid_until": "2024-12-31T23:59:59Z",
      "created_at": "2024-01-01T00:00:00Z",
      "customer": {
        "id": "uuid",
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "creator": {
        "id": "uuid",
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "approver": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `500`: Internal server error

---

### GET /quotations/{id}
Get detailed quotation information including items and audit trail.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (uuid): Quotation identifier

**Access Control:**
- **Customer users**: Can only view their own quotations
- **Sales users**: Can view all quotations

**Success Response (200):**
```json
{
  "quotation": {
    "id": "uuid",
    "quotation_number": "Q-1701234567890",
    "customer_id": "uuid",
    "status": "pending",
    "total_amount": "1899.98",
    "notes": "Special requirements",
    "valid_until": "2024-12-31T23:59:59Z",
    "created_by": "uuid",
    "approved_by": null,
    "approved_at": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "unit_price": "999.99",
        "discount_percentage": "10.00",
        "discount_amount": "199.998",
        "sub_total": "1799.982",
        "product": {
          "id": "uuid",
          "name": "Laptop Computer",
          "description": "High-performance business laptop",
          "sku": "LAP001",
          "price": "999.99"
        }
      }
    ],
    "customer": {
      "id": "uuid",
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "creator": {
      "id": "uuid",
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "approver": null,
    "auditTrail": [
      {
        "id": "uuid",
        "event_type": "created",
        "old_status": null,
        "new_status": "pending",
        "change_reason": "Quotation created",
        "changed_at": "2024-01-01T00:00:00Z",
        "user": {
          "id": "uuid",
          "email": "customer@example.com",
          "first_name": "John",
          "last_name": "Doe"
        }
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: Access denied (customer trying to view other's quotation)
- `404`: Quotation not found
- `500`: Internal server error

---

### PUT /quotations/{id}/approve
Approve or reject a quotation (Sales role only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (uuid): Quotation identifier

**Request Body:**
```json
{
  "action": "approve", // "approve" or "reject"
  "reason": "All requirements met" // optional
}
```

**Access Control:**
- **Sales users only**: Can approve/reject quotations
- **Status requirement**: Only pending quotations can be processed

**Success Response (200):**
```json
{
  "message": "Quotation approved successfully",
  "quotation": {
    "id": "uuid",
    "quotation_number": "Q-1701234567890",
    "status": "converted_to_order",
    "approved_by": "uuid",
    "approved_at": "2024-01-01T01:00:00Z",
    // ... other quotation fields
  },
  "salesOrder": {
    "id": "uuid",
    "order_number": "SO-1701234567891",
    "quotation_id": "uuid",
    "customer_id": "uuid",
    "status": "pending",
    "total_amount": "1899.98",
    "order_date": "2024-01-01T01:00:00Z",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "unit_price": "999.99",
        "sub_total": "1799.982",
        "product": {
          "id": "uuid",
          "name": "Laptop Computer",
          "sku": "LAP001"
        }
      }
    ]
  }
}
```

**For Rejection (action: "reject"):**
```json
{
  "message": "Quotation rejected successfully",
  "quotation": {
    "id": "uuid",
    "status": "rejected",
    "approved_by": "uuid",
    "approved_at": "2024-01-01T01:00:00Z",
    // ... other quotation fields
  },
  "salesOrder": null
}
```

**Error Responses:**
- `400`: Validation error or quotation cannot be processed
- `401`: Authentication required
- `403`: Only sales users can approve/reject quotations
- `404`: Quotation not found
- `500`: Internal server error

---

## Sales Order Endpoints

### GET /sales-orders
Get list of sales orders with filtering and pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page
- `quotationId` (uuid): Filter by quotation ID
- `status` (string): Filter by status (pending, processing, shipped, delivered, cancelled)

**Access Control:**
- **Customer users**: Can only see their own sales orders
- **Sales users**: Can see all sales orders

**Success Response (200):**
```json
{
  "salesOrders": [
    {
      "id": "uuid",
      "order_number": "SO-1701234567891",
      "quotation_id": "uuid",
      "customer_id": "uuid",
      "status": "pending",
      "total_amount": "1899.98",
      "notes": null,
      "order_date": "2024-01-01T01:00:00Z",
      "expected_delivery_date": null,
      "created_at": "2024-01-01T01:00:00Z",
      "customer": {
        "id": "uuid",
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "creator": {
        "id": "uuid",
        "email": "sales@example.com",
        "first_name": "Sales",
        "last_name": "User"
      },
      "quotation": {
        "id": "uuid",
        "quotation_number": "Q-1701234567890",
        "status": "converted_to_order"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `500`: Internal server error

---

### GET /sales-orders/{id}
Get detailed sales order information including items.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (uuid): Sales order identifier

**Access Control:**
- **Customer users**: Can only view their own sales orders
- **Sales users**: Can view all sales orders

**Success Response (200):**
```json
{
  "salesOrder": {
    "id": "uuid",
    "order_number": "SO-1701234567891",
    "quotation_id": "uuid",
    "customer_id": "uuid",
    "status": "pending",
    "total_amount": "1899.98",
    "notes": null,
    "order_date": "2024-01-01T01:00:00Z",
    "expected_delivery_date": null,
    "created_by": "uuid",
    "created_at": "2024-01-01T01:00:00Z",
    "updated_at": "2024-01-01T01:00:00Z",
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "unit_price": "999.99",
        "discount_percentage": "10.00",
        "discount_amount": "199.998",
        "sub_total": "1799.982",
        "product": {
          "id": "uuid",
          "name": "Laptop Computer",
          "description": "High-performance business laptop",
          "sku": "LAP001",
          "price": "999.99"
        }
      }
    ],
    "customer": {
      "id": "uuid",
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "creator": {
      "id": "uuid",
      "email": "sales@example.com",
      "first_name": "Sales",
      "last_name": "User"
    },
    "quotation": {
      "id": "uuid",
      "quotation_number": "Q-1701234567890",
      "status": "converted_to_order",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: Access denied (customer trying to view other's sales order)
- `404`: Sales order not found
- `500`: Internal server error

---

### PUT /sales-orders/{id}/status
Update sales order status (Sales role only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (uuid): Sales order identifier

**Request Body:**
```json
{
  "status": "processing", // pending, processing, shipped, delivered, cancelled
  "notes": "Order is being processed", // optional
  "expected_delivery_date": "2024-01-15T10:00:00Z" // optional
}
```

**Access Control:**
- **Sales users only**: Can update sales order status

**Success Response (200):**
```json
{
  "message": "Sales order updated successfully",
  "salesOrder": {
    "id": "uuid",
    "order_number": "SO-1701234567891",
    "status": "processing",
    "notes": "Order is being processed",
    "expected_delivery_date": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-01T02:00:00Z",
    // ... other sales order fields including items
  }
}
```

**Error Responses:**
- `400`: Validation error (invalid status, notes too long)
- `401`: Authentication required
- `403`: Only sales users can update status
- `404`: Sales order not found
- `500`: Internal server error

---

### GET /sales-orders/quotation/{quotationId}
Get all sales orders related to a specific quotation.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `quotationId` (uuid): Quotation identifier

**Access Control:**
- **Customer users**: Can only see sales orders for their own quotations
- **Sales users**: Can see all sales orders

**Success Response (200):**
```json
{
  "salesOrders": [
    {
      "id": "uuid",
      "order_number": "SO-1701234567891",
      "quotation_id": "uuid",
      "customer_id": "uuid",
      "status": "pending",
      "total_amount": "1899.98",
      "order_date": "2024-01-01T01:00:00Z",
      "items": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "quantity": 2,
          "unit_price": "999.99",
          "sub_total": "1799.982",
          "product": {
            "id": "uuid",
            "name": "Laptop Computer",
            "sku": "LAP001"
          }
        }
      ],
      "customer": {
        "id": "uuid",
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "quotation": {
        "id": "uuid",
        "quotation_number": "Q-1701234567890",
        "status": "converted_to_order",
        "created_at": "2024-01-01T00:00:00Z"
      }
    }
  ]
}
```

**Error Responses:**
- `401`: Authentication required
- `500`: Internal server error

---

## Health Check Endpoint

### GET /health
Check API health status (no authentication required).

**Success Response (200):**
```json
{
  "status": "ok",
  "message": "ERP Quotation API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Codes Reference

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or malformed request |
| 401 | Unauthorized - Authentication required or token invalid |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists (duplicate email) |
| 500 | Internal Server Error - Server error |

---

## Data Types

### UUID
All entity identifiers use UUID v4 format: `123e4567-e89b-12d3-a456-426614174000`

### Decimal
Monetary values use decimal format with 2 decimal places: `"999.99"`

### DateTime
All timestamps use ISO 8601 format: `"2024-01-01T00:00:00.000Z"`

### Enums

#### User Roles
- `customer`: Customer user who can create quotations
- `sales`: Sales user who can approve/reject quotations and manage orders

#### Quotation Status
- `pending`: Awaiting approval from sales
- `approved`: Approved but not yet converted to order
- `rejected`: Rejected by sales
- `converted_to_order`: Approved and converted to sales order

#### Sales Order Status
- `pending`: Order created, awaiting processing
- `processing`: Order is being processed
- `shipped`: Order has been shipped
- `delivered`: Order delivered to customer
- `cancelled`: Order cancelled

#### Audit Trail Event Types
- `created`: Quotation created
- `updated`: Quotation updated
- `status_changed`: Status changed
- `approved`: Quotation approved
- `rejected`: Quotation rejected
- `converted_to_order`: Converted to sales order

---

## Rate Limiting

API requests are limited to:
- **100 requests per 15 minutes** per IP address
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

---

## Pagination

All list endpoints support pagination with query parameters:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10, max: 100): Items per page

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```