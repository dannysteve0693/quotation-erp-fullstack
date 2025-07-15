const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = require('../../src/controllers/authController');
const authRoutes = require('../../src/routes/auth');
const { User } = require('../../src/models');
const { jwtSecret } = require('../../src/config/auth');
const { testCustomer, testSales } = require('../fixtures/users');

require('../setup');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Authentication', () => {
  describe('POST /auth/register', () => {
    it('should register a new customer successfully', async () => {
      const userData = {
        email: 'newcustomer@test.com',
        password: 'SecurePass123',
        role: 'customer',
        first_name: 'New',
        last_name: 'Customer'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user).not.toHaveProperty('password_hash');

      const user = await User.findOne({ where: { email: userData.email } });
      expect(user).toBeTruthy();
      expect(await bcrypt.compare(userData.password, user.password_hash)).toBe(true);
    });

    it('should register a new sales user successfully', async () => {
      const userData = {
        email: 'newsales@test.com',
        password: 'SecurePass123',
        role: 'sales',
        first_name: 'New',
        last_name: 'Sales'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.role).toBe('sales');
    });

    it('should return 400 for duplicate email', async () => {
      await User.create(testCustomer);

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: testCustomer.email,
          password: 'SecurePass123',
          role: 'customer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User with this email already exists');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123',
          role: 'customer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: '123',
          role: 'customer'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for invalid role', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'SecurePass123',
          role: 'admin'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await User.create(testCustomer);
      await User.create(testSales);
    });

    it('should login customer successfully', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testCustomer.email,
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testCustomer.email);
      expect(response.body.user.role).toBe('customer');

      const decoded = jwt.verify(response.body.token, jwtSecret);
      expect(decoded).toHaveProperty('userId');
    });

    it('should login sales user successfully', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testSales.email,
          password: 'password123'
        })
        .expect(200);

      expect(response.body.user.role).toBe('sales');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testCustomer.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for inactive user', async () => {
      const inactiveUser = await User.create({
        ...testCustomer,
        email: 'inactive@test.com',
        is_active: false
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'inactive@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testCustomer.email
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('GET /auth/profile', () => {
    let customerToken;
    let customer;

    beforeEach(async () => {
      customer = await User.create(testCustomer);
      customerToken = jwt.sign({ userId: customer.id }, jwtSecret);
    });

    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(customer.id);
      expect(response.body.user.email).toBe(customer.email);
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });

    it('should return 403 for invalid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Invalid token.');
    });

    it('should return 401 for expired token', async () => {
      const expiredToken = jwt.sign({ userId: customer.id }, jwtSecret, { expiresIn: '0s' });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token expired.');
    });
  });

  describe('PUT /auth/profile', () => {
    let customerToken;
    let customer;

    beforeEach(async () => {
      customer = await User.create(testCustomer);
      customerToken = jwt.sign({ userId: customer.id }, jwtSecret);
    });

    it('should update profile successfully', async () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Name',
        phone: '+9876543210'
      };

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user.first_name).toBe(updateData.first_name);
      expect(response.body.user.last_name).toBe(updateData.last_name);
      expect(response.body.user.phone).toBe(updateData.phone);

      const updatedUser = await User.findByPk(customer.id);
      expect(updatedUser.first_name).toBe(updateData.first_name);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .put('/auth/profile')
        .send({ first_name: 'Updated' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });
  });
});