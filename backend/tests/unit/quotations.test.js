const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const quotationRoutes = require('../../src/routes/quotations');
const { User, Product, Quotation, QuotationItem } = require('../../src/models');
const { jwtSecret } = require('../../src/config/auth');
const { testCustomer, testSales } = require('../fixtures/users');
const { testProduct1, testProduct2 } = require('../fixtures/products');

require('../setup');

const app = express();
app.use(express.json());
app.use('/quotations', quotationRoutes);

describe('Quotations', () => {
  let customer, salesUser, product1, product2;
  let customerToken, salesToken;

  beforeEach(async () => {
    customer = await User.create(testCustomer);
    salesUser = await User.create(testSales);
    product1 = await Product.create(testProduct1);
    product2 = await Product.create(testProduct2);

    customerToken = jwt.sign({ userId: customer.id }, jwtSecret);
    salesToken = jwt.sign({ userId: salesUser.id }, jwtSecret);
  });

  describe('POST /quotations', () => {
    it('should create quotation successfully', async () => {
      const quotationData = {
        items: [
          {
            product_id: product1.id,
            quantity: 2,
            unit_price: 999.99,
            discount_percentage: 10
          },
          {
            product_id: product2.id,
            quantity: 1,
            unit_price: 49.99
          }
        ],
        notes: 'Test quotation',
        valid_until: '2024-12-31T23:59:59Z'
      };

      const response = await request(app)
        .post('/quotations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(quotationData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Quotation created successfully');
      expect(response.body).toHaveProperty('quotation');
      expect(response.body.quotation.customer_id).toBe(customer.id);
      expect(response.body.quotation.status).toBe('pending');
      expect(response.body.quotation.items).toHaveLength(2);
      
      const expectedTotal = (2 * 999.99 * 0.9) + (1 * 49.99);
      expect(parseFloat(response.body.quotation.total_amount)).toBeCloseTo(expectedTotal, 2);
    });

    it('should return 403 for sales user trying to create quotation', async () => {
      const quotationData = {
        items: [
          {
            product_id: product1.id,
            quantity: 1,
            unit_price: 999.99
          }
        ]
      };

      const response = await request(app)
        .post('/quotations')
        .set('Authorization', `Bearer ${salesToken}`)
        .send(quotationData)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Insufficient permissions.');
    });

    it('should return 400 for empty items array', async () => {
      const response = await request(app)
        .post('/quotations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ items: [] })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for invalid product ID', async () => {
      const quotationData = {
        items: [
          {
            product_id: 'invalid-uuid',
            quantity: 1,
            unit_price: 100
          }
        ]
      };

      const response = await request(app)
        .post('/quotations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(quotationData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for non-existent product', async () => {
      const quotationData = {
        items: [
          {
            product_id: '123e4567-e89b-12d3-a456-426614174000',
            quantity: 1,
            unit_price: 100
          }
        ]
      };

      const response = await request(app)
        .post('/quotations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(quotationData)
        .expect(400);

      expect(response.body.error).toContain('not found or inactive');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/quotations')
        .send({ items: [] })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });
  });

  describe('GET /quotations', () => {
    let quotation1, quotation2;

    beforeEach(async () => {
      quotation1 = await Quotation.create({
        customer_id: customer.id,
        quotation_number: 'Q-1001',
        status: 'pending',
        total_amount: 100.00,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: customer.id
      });

      quotation2 = await Quotation.create({
        customer_id: customer.id,
        quotation_number: 'Q-1002',
        status: 'approved',
        total_amount: 200.00,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: customer.id
      });
    });

    it('should get quotations for customer', async () => {
      const response = await request(app)
        .get('/quotations')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('quotations');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.quotations).toHaveLength(2);
      expect(response.body.quotations[0].customer_id).toBe(customer.id);
    });

    it('should get all quotations for sales user', async () => {
      const response = await request(app)
        .get('/quotations')
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.quotations).toHaveLength(2);
    });

    it('should filter quotations by status', async () => {
      const response = await request(app)
        .get('/quotations?status=pending')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.quotations).toHaveLength(1);
      expect(response.body.quotations[0].status).toBe('pending');
    });

    it('should paginate quotations', async () => {
      const response = await request(app)
        .get('/quotations?page=1&limit=1')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.quotations).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/quotations')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });
  });

  describe('GET /quotations/:id', () => {
    let quotation;

    beforeEach(async () => {
      quotation = await Quotation.create({
        customer_id: customer.id,
        quotation_number: 'Q-1001',
        status: 'pending',
        total_amount: 100.00,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: customer.id
      });
    });

    it('should get quotation by ID for customer', async () => {
      const response = await request(app)
        .get(`/quotations/${quotation.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('quotation');
      expect(response.body.quotation.id).toBe(quotation.id);
      expect(response.body.quotation.customer_id).toBe(customer.id);
    });

    it('should get quotation by ID for sales user', async () => {
      const response = await request(app)
        .get(`/quotations/${quotation.id}`)
        .set('Authorization', `Bearer ${salesToken}`)
        .expect(200);

      expect(response.body.quotation.id).toBe(quotation.id);
    });

    it('should return 403 for customer trying to access other customer quotation', async () => {
      const anotherCustomer = await User.create({
        ...testCustomer,
        email: 'another@test.com'
      });
      
      const anotherQuotation = await Quotation.create({
        customer_id: anotherCustomer.id,
        quotation_number: 'Q-1002',
        status: 'pending',
        total_amount: 100.00,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: anotherCustomer.id
      });

      const response = await request(app)
        .get(`/quotations/${anotherQuotation.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Access denied. You can only view your own quotations.');
    });

    it('should return 404 for non-existent quotation', async () => {
      const response = await request(app)
        .get('/quotations/123e4567-e89b-12d3-a456-426614174000')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Quotation not found');
    });
  });

  describe('PUT /quotations/:id/approve', () => {
    let quotation;

    beforeEach(async () => {
      quotation = await Quotation.create({
        customer_id: customer.id,
        quotation_number: 'Q-1001',
        status: 'pending',
        total_amount: 100.00,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: customer.id
      });

      await QuotationItem.create({
        quotation_id: quotation.id,
        product_id: product1.id,
        quantity: 1,
        unit_price: 100.00,
        total_price: 100.00
      });
    });

    it('should approve quotation successfully', async () => {
      const response = await request(app)
        .put(`/quotations/${quotation.id}/approve`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({
          action: 'approve',
          reason: 'All requirements met'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Quotation approved successfully');
      expect(response.body.quotation.status).toBe('converted_to_order');
      expect(response.body).toHaveProperty('salesOrder');
      expect(response.body.salesOrder.quotation_id).toBe(quotation.id);
    });

    it('should reject quotation successfully', async () => {
      const response = await request(app)
        .put(`/quotations/${quotation.id}/approve`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({
          action: 'reject',
          reason: 'Requirements not met'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Quotation rejected successfully');
      expect(response.body.quotation.status).toBe('rejected');
      expect(response.body.salesOrder).toBeNull();
    });

    it('should return 403 for customer trying to approve', async () => {
      const response = await request(app)
        .put(`/quotations/${quotation.id}/approve`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          action: 'approve'
        })
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Insufficient permissions.');
    });

    it('should return 400 for invalid action', async () => {
      const response = await request(app)
        .put(`/quotations/${quotation.id}/approve`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({
          action: 'invalid'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for already processed quotation', async () => {
      await quotation.update({ status: 'approved' });

      const response = await request(app)
        .put(`/quotations/${quotation.id}/approve`)
        .set('Authorization', `Bearer ${salesToken}`)
        .send({
          action: 'approve'
        })
        .expect(400);

      expect(response.body.error).toContain('Only pending quotations can be approved or rejected');
    });

    it('should return 404 for non-existent quotation', async () => {
      const response = await request(app)
        .put('/quotations/123e4567-e89b-12d3-a456-426614174000/approve')
        .set('Authorization', `Bearer ${salesToken}`)
        .send({
          action: 'approve'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Quotation not found');
    });
  });
});