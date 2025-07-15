const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ERP Quotation API',
      version: '1.0.0',
      description: 'A comprehensive REST API for ERP Quotation Management System',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://your-api-domain.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['customer', 'sales'],
              description: 'User role'
            },
            first_name: {
              type: 'string',
              description: 'User first name'
            },
            last_name: {
              type: 'string',
              description: 'User last name'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            is_active: {
              type: 'boolean',
              description: 'User active status'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Product unique identifier',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              description: 'Product name',
              example: 'Laptop Computer'
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'High-performance business laptop with 16GB RAM and 512GB SSD'
            },
            sku: {
              type: 'string',
              description: 'Product SKU (Stock Keeping Unit)',
              example: 'LAP001'
            },
            price: {
              type: 'string',
              format: 'decimal',
              description: 'Product price',
              example: '999.99'
            },
            stock_quantity: {
              type: 'integer',
              minimum: 0,
              description: 'Available stock quantity',
              example: 50
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'Electronics'
            },
            is_active: {
              type: 'boolean',
              description: 'Product active status',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Product last update timestamp'
            }
          },
          required: ['id', 'name', 'sku', 'price', 'stock_quantity', 'is_active']
        },
        QuotationItem: {
          type: 'object',
          properties: {
            product_id: {
              type: 'string',
              format: 'uuid',
              description: 'Product identifier'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Quantity of the product'
            },
            unit_price: {
              type: 'number',
              format: 'decimal',
              description: 'Unit price of the product'
            },
            discount_percentage: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              maximum: 100,
              description: 'Discount percentage'
            }
          },
          required: ['product_id', 'quantity']
        },
        Quotation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Quotation unique identifier'
            },
            quotation_number: {
              type: 'string',
              description: 'Quotation number'
            },
            customer_id: {
              type: 'string',
              format: 'uuid',
              description: 'Customer identifier'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'converted_to_order'],
              description: 'Quotation status'
            },
            total_amount: {
              type: 'number',
              format: 'decimal',
              description: 'Total quotation amount'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            valid_until: {
              type: 'string',
              format: 'date-time',
              description: 'Quotation validity date'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/QuotationItem'
              }
            }
          }
        },
        SalesOrder: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Sales order unique identifier'
            },
            order_number: {
              type: 'string',
              description: 'Sales order number',
              example: 'SO-1701234567891'
            },
            quotation_id: {
              type: 'string',
              format: 'uuid',
              description: 'Related quotation identifier'
            },
            customer_id: {
              type: 'string',
              format: 'uuid',
              description: 'Customer identifier'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'Sales order status',
              example: 'pending'
            },
            total_amount: {
              type: 'string',
              format: 'decimal',
              description: 'Total order amount',
              example: '1899.98'
            },
            notes: {
              type: 'string',
              description: 'Order notes',
              nullable: true
            },
            order_date: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date'
            },
            expected_delivery_date: {
              type: 'string',
              format: 'date-time',
              description: 'Expected delivery date',
              nullable: true
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'User who created the order'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        SalesOrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Sales order item unique identifier'
            },
            sales_order_id: {
              type: 'string',
              format: 'uuid',
              description: 'Sales order identifier'
            },
            product_id: {
              type: 'string',
              format: 'uuid',
              description: 'Product identifier'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Quantity ordered'
            },
            unit_price: {
              type: 'string',
              format: 'decimal',
              description: 'Unit price at time of order'
            },
            discount_percentage: {
              type: 'string',
              format: 'decimal',
              description: 'Discount percentage applied'
            },
            discount_amount: {
              type: 'string',
              format: 'decimal',
              description: 'Discount amount'
            },
            sub_total: {
              type: 'string',
              format: 'decimal',
              description: 'Line item subtotal'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi
};