const bcrypt = require('bcryptjs');

module.exports = {
  testCustomer: {
    email: 'customer@test.com',
    password_hash: 'password123',
    role: 'customer',
    first_name: 'Test',
    last_name: 'Customer',
    phone: '+1234567890',
    is_active: true
  },
  
  testSales: {
    email: 'sales@test.com',
    password_hash: 'password123',
    role: 'sales',
    first_name: 'Test',
    last_name: 'Sales',
    phone: '+1234567891',
    is_active: true
  },
  
  inactiveUser: {
    email: 'inactive@test.com',
    password_hash: 'password123',
    role: 'customer',
    first_name: 'Inactive',
    last_name: 'User',
    is_active: false
  }
};