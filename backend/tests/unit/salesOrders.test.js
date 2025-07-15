const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const salesOrderRoutes = require('../../src/routes/salesOrders');
const { User, Product, Quotation, QuotationItem, SalesOrder, SalesOrderItem } = require('../../src/models');
const { jwtSecret } = require('../../src/config/auth');
const { testCustomer, testSales } = require('../fixtures/users');
const { testProduct1 } = require('../fixtures/products');

require('../setup');

const app = express();
app.use(express.json());
app.use('/sales-orders', salesOrderRoutes);

describe('Sales Orders', () => {
  let customer, salesUser, product1, quotation, salesOrder;
  let customerToken, salesToken;

  beforeEach(async () => {
    customer = await User.create(testCustomer);
    salesUser = await User.create(testSales);
    product1 = await Product.create(testProduct1);

    customerToken = jwt.sign({ userId: customer.id }, jwtSecret);
    salesToken = jwt.sign({ userId: salesUser.id }, jwtSecret);

    quotation = await Quotation.create({
      customer_id: customer.id,
      quotation_number: 'Q-1001',
      status: 'converted_to_order',
      total_amount: 999.99,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      created_by: customer.id,
      approved_by: salesUser.id
    });

    salesOrder = await SalesOrder.create({
      quotation_id: quotation.id,
      customer_id: customer.id,
      order_number: 'SO-1001',
      status: 'pending',
      total_amount: 999.99,
      created_by: salesUser.id
    });

    await SalesOrderItem.create({
      sales_order_id: salesOrder.id,
      product_id: product1.id,
      quantity: 1,
      unit_price: 999.99,
      total_price: 999.99
    });
  });

  describe('GET /sales-orders', () => {
    it('should get sales orders for customer', async () => {
      const response = await request(app)
        .get('/sales-orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('salesOrders');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.salesOrders).toHaveLength(1);
      expect(response.body.salesOrders[0].customer_id).toBe(customer.id);
      expect(response.body.salesOrders[0].id).toBe(salesOrder.id);
    });

    it('should get all sales orders for sales user', async () => {
      const anotherCustomer = await User.create({
        ...testCustomer,
        email: 'another@test.com'
      });

      const anotherSalesOrder = await SalesOrder.create({
        quotation_id: quotation.id,
        customer_id: anotherCustomer.id,
        order_number: 'SO-1002',
        status: 'pending',
        total_amount: 500.00,
        created_by: salesUser.id
      });

      const response = await request(app)
        .get('/sales-orders')
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.salesOrders).toHaveLength(2);
    });

    it('should filter sales orders by quotation ID', async () => {
      const response = await request(app)
        .get(`/sales-orders?quotationId=${quotation.id}`)
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.salesOrders).toHaveLength(1);
      expect(response.body.salesOrders[0].quotation_id).toBe(quotation.id);
    });

    it('should filter sales orders by status', async () => {
      const response = await request(app)
        .get('/sales-orders?status=pending')
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.salesOrders).toHaveLength(1);
      expect(response.body.salesOrders[0].status).toBe('pending');
    });

    it('should paginate sales orders', async () => {
      const response = await request(app)
        .get('/sales-orders?page=1&limit=1')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.salesOrders).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/sales-orders')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });
  });

  describe('GET /sales-orders/:id', () => {
    it('should get sales order by ID for customer', async () => {
      const response = await request(app)
        .get(`/sales-orders/${salesOrder.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('salesOrder');
      expect(response.body.salesOrder.id).toBe(salesOrder.id);
      expect(response.body.salesOrder.customer_id).toBe(customer.id);
      expect(response.body.salesOrder.items).toHaveLength(1);
    });

    it('should get sales order by ID for sales user', async () => {
      const response = await request(app)
        .get(`/sales-orders/${salesOrder.id}`)
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.salesOrder.id).toBe(salesOrder.id);
    });

    it('should return 403 for customer trying to access other customer sales order', async () => {
      const anotherCustomer = await User.create({
        ...testCustomer,
        email: 'another@test.com'
      });
      
      const anotherSalesOrder = await SalesOrder.create({
        quotation_id: quotation.id,
        customer_id: anotherCustomer.id,
        order_number: 'SO-1002',
        status: 'pending',
        total_amount: 500.00,
        created_by: salesUser.id
      });

      const response = await request(app)
        .get(`/sales-orders/${anotherSalesOrder.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Access denied. You can only view your own sales orders.');
    });

    it('should return 404 for non-existent sales order', async () => {
      const response = await request(app)
        .get('/sales-orders/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Sales order not found');
    });
  });

  describe('PUT /sales-orders/:id/status', () => {
    it('should update sales order status successfully', async () => {
      const updateData = {
        status: 'processing',
        notes: 'Order is being processed',
        expected_delivery_date: '2024-12-31T23:59:59Z'
      };

      const response = await request(app)
        .put(`/sales-orders/${salesOrder.id}/status`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Sales order updated successfully');
      expect(response.body.salesOrder.status).toBe('processing');
      expect(response.body.salesOrder.notes).toBe(updateData.notes);
    });

    it('should update only status without optional fields', async () => {
      const response = await request(app)
        .put(`/sales-orders/${salesOrder.id}/status`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({ status: 'shipped' })
        .expect(200);

      expect(response.body.salesOrder.status).toBe('shipped');
    });

    it('should return 403 for customer trying to update status', async () => {
      const response = await request(app)
        .put(`/sales-orders/${salesOrder.id}/status`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ status: 'processing' })
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Insufficient permissions.');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .put(`/sales-orders/${salesOrder.id}/status`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for notes too long', async () => {
      const longNotes = 'a'.repeat(1001);
      
      const response = await request(app)
        .put(`/sales-orders/${salesOrder.id}/status`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({ 
          status: 'processing',
          notes: longNotes 
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 404 for non-existent sales order', async () => {
      const response = await request(app)
        .put('/sales-orders/123e4567-e89b-12d3-a456-426614174000/status')
        .set('Authorization', `Bearer ${salesToken}`)
        .send({ status: 'processing' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Sales order not found');
    });
  });

  describe('GET /sales-orders/quotation/:quotationId', () => {
    it('should get sales orders by quotation ID', async () => {
      const response = await request(app)
        .get(`/sales-orders/quotation/${quotation.id}`)
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('salesOrders');
      expect(response.body.salesOrders).toHaveLength(1);
      expect(response.body.salesOrders[0].quotation_id).toBe(quotation.id);
    });

    it('should filter by customer for customer user', async () => {
      const anotherCustomer = await User.create({
        ...testCustomer,
        email: 'another@test.com'
      });

      const anotherQuotation = await Quotation.create({
        customer_id: anotherCustomer.id,
        quotation_number: 'Q-1002',
        status: 'converted_to_order',
        total_amount: 500.00,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: anotherCustomer.id
      });

      const anotherSalesOrder = await SalesOrder.create({
        quotation_id: anotherQuotation.id,
        customer_id: anotherCustomer.id,
        order_number: 'SO-1002',
        status: 'pending',
        total_amount: 500.00,
        created_by: salesUser.id
      });

      const response = await request(app)
        .get(`/sales-orders/quotation/${quotation.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.salesOrders).toHaveLength(1);
      expect(response.body.salesOrders[0].customer_id).toBe(customer.id);
    });

    it('should return empty array for non-existent quotation', async () => {
      const response = await request(app)
        .get('/sales-orders/quotation/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.salesOrders).toHaveLength(0);
    });
  });
});