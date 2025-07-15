const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrderController');
const { authenticateToken, authorizeRole, authorizeCustomerOrSales } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { roles } = require('../config/auth');

/**
 * @swagger
 * /sales-orders:
 *   get:
 *     summary: Get list of sales orders
 *     tags: [Sales Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: quotationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by quotation ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of sales orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 salesOrders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalesOrder'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *             example:
 *               salesOrders:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   order_number: "SO-1701234567891"
 *                   quotation_id: "123e4567-e89b-12d3-a456-426614174001"
 *                   customer_id: "123e4567-e89b-12d3-a456-426614174002"
 *                   status: "pending"
 *                   total_amount: "1899.98"
 *                   order_date: "2024-01-01T01:00:00Z"
 *                   customer:
 *                     id: "123e4567-e89b-12d3-a456-426614174002"
 *                     email: "customer@example.com"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                   quotation:
 *                     id: "123e4567-e89b-12d3-a456-426614174001"
 *                     quotation_number: "Q-1701234567890"
 *                     status: "converted_to_order"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 3
 *                 pages: 1
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sales-orders/{id}:
 *   get:
 *     summary: Get sales order by ID
 *     tags: [Sales Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sales order identifier
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Sales order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 salesOrder:
 *                   allOf:
 *                     - $ref: '#/components/schemas/SalesOrder'
 *                     - type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               product_id:
 *                                 type: string
 *                                 format: uuid
 *                               quantity:
 *                                 type: integer
 *                               unit_price:
 *                                 type: string
 *                                 format: decimal
 *                               discount_percentage:
 *                                 type: string
 *                                 format: decimal
 *                               discount_amount:
 *                                 type: string
 *                                 format: decimal
 *                               sub_total:
 *                                 type: string
 *                                 format: decimal
 *                               product:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                   name:
 *                                     type: string
 *                                   sku:
 *                                     type: string
 *                                   price:
 *                                     type: string
 *                                     format: decimal
 *                         customer:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             email:
 *                               type: string
 *                             first_name:
 *                               type: string
 *                             last_name:
 *                               type: string
 *                         quotation:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             quotation_number:
 *                               type: string
 *                             status:
 *                               type: string
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *             example:
 *               salesOrder:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 order_number: "SO-1701234567891"
 *                 quotation_id: "123e4567-e89b-12d3-a456-426614174001"
 *                 customer_id: "123e4567-e89b-12d3-a456-426614174002"
 *                 status: "pending"
 *                 total_amount: "1899.98"
 *                 notes: null
 *                 order_date: "2024-01-01T01:00:00Z"
 *                 expected_delivery_date: null
 *                 created_at: "2024-01-01T01:00:00Z"
 *                 updated_at: "2024-01-01T01:00:00Z"
 *                 items:
 *                   - id: "123e4567-e89b-12d3-a456-426614174003"
 *                     product_id: "123e4567-e89b-12d3-a456-426614174004"
 *                     quantity: 2
 *                     unit_price: "999.99"
 *                     discount_percentage: "10.00"
 *                     discount_amount: "199.998"
 *                     sub_total: "1799.982"
 *                     product:
 *                       id: "123e4567-e89b-12d3-a456-426614174004"
 *                       name: "Laptop Computer"
 *                       sku: "LAP001"
 *                       price: "999.99"
 *                 customer:
 *                   id: "123e4567-e89b-12d3-a456-426614174002"
 *                   email: "customer@example.com"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                 quotation:
 *                   id: "123e4567-e89b-12d3-a456-426614174001"
 *                   quotation_number: "Q-1701234567890"
 *                   status: "converted_to_order"
 *                   created_at: "2024-01-01T00:00:00Z"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Access denied (customer trying to view other's sales order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Access denied. You can only view your own sales orders."
 *       404:
 *         description: Sales order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Sales order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sales-orders/{id}/status:
 *   put:
 *     summary: Update sales order status (Sales role only)
 *     tags: [Sales Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sales order identifier
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 description: New status for the sales order
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Optional notes about the status change
 *               expected_delivery_date:
 *                 type: string
 *                 format: date-time
 *                 description: Expected delivery date (ISO 8601 format)
 *           example:
 *             status: "processing"
 *             notes: "Order is being processed and will ship within 2 business days"
 *             expected_delivery_date: "2024-01-15T10:00:00Z"
 *     responses:
 *       200:
 *         description: Sales order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 salesOrder:
 *                   $ref: '#/components/schemas/SalesOrder'
 *             example:
 *               message: "Sales order updated successfully"
 *               salesOrder:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 order_number: "SO-1701234567891"
 *                 status: "processing"
 *                 notes: "Order is being processed and will ship within 2 business days"
 *                 expected_delivery_date: "2024-01-15T10:00:00Z"
 *                 updated_at: "2024-01-01T02:00:00Z"
 *       400:
 *         description: Validation error (invalid status, notes too long)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation failed"
 *               details:
 *                 - field: "status"
 *                   message: "Invalid status"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Only sales users can update status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Insufficient permissions."
 *       404:
 *         description: Sales order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Sales order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sales-orders/quotation/{quotationId}:
 *   get:
 *     summary: Get all sales orders related to a specific quotation
 *     tags: [Sales Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quotationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quotation identifier
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       200:
 *         description: Sales orders for quotation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 salesOrders:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/SalesOrder'
 *                       - type: object
 *                         properties:
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                 product_id:
 *                                   type: string
 *                                   format: uuid
 *                                 quantity:
 *                                   type: integer
 *                                 unit_price:
 *                                   type: string
 *                                   format: decimal
 *                                 sub_total:
 *                                   type: string
 *                                   format: decimal
 *                                 product:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       format: uuid
 *                                     name:
 *                                       type: string
 *                                     sku:
 *                                       type: string
 *                           customer:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               email:
 *                                 type: string
 *                               first_name:
 *                                 type: string
 *                               last_name:
 *                                 type: string
 *                           quotation:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               quotation_number:
 *                                 type: string
 *                               status:
 *                                 type: string
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *             example:
 *               salesOrders:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   order_number: "SO-1701234567891"
 *                   quotation_id: "123e4567-e89b-12d3-a456-426614174001"
 *                   customer_id: "123e4567-e89b-12d3-a456-426614174002"
 *                   status: "pending"
 *                   total_amount: "1899.98"
 *                   order_date: "2024-01-01T01:00:00Z"
 *                   items:
 *                     - id: "123e4567-e89b-12d3-a456-426614174003"
 *                       product_id: "123e4567-e89b-12d3-a456-426614174004"
 *                       quantity: 2
 *                       unit_price: "999.99"
 *                       sub_total: "1799.982"
 *                       product:
 *                         id: "123e4567-e89b-12d3-a456-426614174004"
 *                         name: "Laptop Computer"
 *                         sku: "LAP001"
 *                   customer:
 *                     id: "123e4567-e89b-12d3-a456-426614174002"
 *                     email: "customer@example.com"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                   quotation:
 *                     id: "123e4567-e89b-12d3-a456-426614174001"
 *                     quotation_number: "Q-1701234567890"
 *                     status: "converted_to_order"
 *                     created_at: "2024-01-01T00:00:00Z"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const validateSalesOrderUpdate = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('expected_delivery_date')
    .optional()
    .isISO8601()
    .withMessage('Expected delivery date must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

router.get('/',
  authenticateToken,
  authorizeCustomerOrSales,
  salesOrderController.getSalesOrders
);

router.get('/:id',
  authenticateToken,
  authorizeCustomerOrSales,
  salesOrderController.getSalesOrderById
);

router.put('/:id/status',
  authenticateToken,
  authorizeRole(roles.SALES),
  validateSalesOrderUpdate,
  salesOrderController.updateSalesOrderStatus
);

router.get('/quotation/:quotationId',
  authenticateToken,
  authorizeCustomerOrSales,
  salesOrderController.getSalesOrdersByQuotation
);

module.exports = router;