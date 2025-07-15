const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeCustomerOrSales } = require('../middleware/auth');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get list of products
 *     tags: [Products]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name, description, or SKU
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     pages:
 *                       type: integer
 *                       example: 3
 *             example:
 *               products:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   name: "Laptop Computer"
 *                   description: "High-performance business laptop"
 *                   sku: "LAP001"
 *                   price: "999.99"
 *                   stock_quantity: 50
 *                   category: "Electronics"
 *                   is_active: true
 *                   created_at: "2024-01-01T00:00:00Z"
 *                   updated_at: "2024-01-01T00:00:00Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 pages: 3
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
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product identifier
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               product:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 name: "Laptop Computer"
 *                 description: "High-performance business laptop with 16GB RAM and 512GB SSD"
 *                 sku: "LAP001"
 *                 price: "999.99"
 *                 stock_quantity: 50
 *                 category: "Electronics"
 *                 is_active: true
 *                 created_at: "2024-01-01T00:00:00Z"
 *                 updated_at: "2024-01-01T00:00:00Z"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/',
  authenticateToken,
  authorizeCustomerOrSales,
  productController.getProducts
);

router.get('/:id',
  authenticateToken,
  authorizeCustomerOrSales,
  productController.getProductById
);

module.exports = router;