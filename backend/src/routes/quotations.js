const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { authenticateToken, authorizeRole, authorizeCustomerOrSales } = require('../middleware/auth');
const { validateQuotation, validateQuotationApproval } = require('../middleware/validation');
const { roles } = require('../config/auth');

/**
 * @swagger
 * /quotations:
 *   post:
 *     summary: Create a new quotation
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/QuotationItem'
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *               valid_until:
 *                 type: string
 *                 format: date-time
 *           example:
 *             items:
 *               - product_id: "123e4567-e89b-12d3-a456-426614174000"
 *                 quantity: 2
 *                 unit_price: 100.00
 *                 discount_percentage: 10
 *             notes: "Special requirements for this quotation"
 *             valid_until: "2024-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Quotation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quotation:
 *                   $ref: '#/components/schemas/Quotation'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only customers can create quotations
 */

/**
 * @swagger
 * /quotations:
 *   get:
 *     summary: Get list of quotations
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, converted_to_order]
 *         description: Filter by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by customer ID (sales users only)
 *     responses:
 *       200:
 *         description: List of quotations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quotations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quotation'
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
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /quotations/{id}:
 *   get:
 *     summary: Get quotation by ID
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quotation ID
 *     responses:
 *       200:
 *         description: Quotation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quotation:
 *                   $ref: '#/components/schemas/Quotation'
 *       404:
 *         description: Quotation not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /quotations/{id}/approve:
 *   put:
 *     summary: Approve or reject a quotation
 *     tags: [Quotations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quotation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *           example:
 *             action: "approve"
 *             reason: "All requirements met"
 *     responses:
 *       200:
 *         description: Quotation processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quotation:
 *                   $ref: '#/components/schemas/Quotation'
 *                 salesOrder:
 *                   $ref: '#/components/schemas/SalesOrder'
 *       400:
 *         description: Invalid request or quotation cannot be processed
 *       403:
 *         description: Only sales users can approve/reject quotations
 *       404:
 *         description: Quotation not found
 */

router.post('/', 
  authenticateToken,
  authorizeRole(roles.CUSTOMER),
  validateQuotation,
  quotationController.createQuotation
);

router.get('/',
  authenticateToken,
  authorizeCustomerOrSales,
  quotationController.getQuotations
);

router.get('/:id',
  authenticateToken,
  authorizeCustomerOrSales,
  quotationController.getQuotationById
);

router.put('/:id/approve',
  authenticateToken,
  authorizeRole(roles.SALES),
  validateQuotationApproval,
  quotationController.approveRejectQuotation
);

module.exports = router;