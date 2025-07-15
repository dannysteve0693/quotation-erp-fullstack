require('dotenv').config();
const { User } = require('../src/models');
const bcrypt = require('bcryptjs');

async function createTestUsers() {
  try {
    console.log('🔄 Creating test users...');
    
    // Check if users already exist
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    const existingCustomer = await User.findOne({ where: { email: 'customer@example.com' } });
    
    if (existingAdmin || existingCustomer) {
      console.log('⚠️  Test users already exist. Updating passwords...');
      
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      if (existingAdmin) {
        await existingAdmin.update({ password_hash: hashedPassword });
        console.log('✅ Updated admin@example.com password');
      }
      
      if (existingCustomer) {
        await existingCustomer.update({ password_hash: hashedPassword });
        console.log('✅ Updated customer@example.com password');
      }
    } else {
      // Create new users
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const adminUser = await User.create({
        email: 'admin@example.com',
        password_hash: hashedPassword,
        role: 'sales',
        first_name: 'Admin',
        last_name: 'User',
        is_active: true
      });
      console.log('✅ Created admin user:', adminUser.email);
      
      const customerUser = await User.create({
        email: 'customer@example.com',
        password_hash: hashedPassword,
        role: 'customer',
        first_name: 'John',
        last_name: 'Doe',
        is_active: true
      });
      console.log('✅ Created customer user:', customerUser.email);
    }
    
    // Test login for both users
    console.log('\n🔍 Testing login for both users...');
    
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    const customerUser = await User.findOne({ where: { email: 'customer@example.com' } });
    
    if (adminUser) {
      const adminValidPassword = await adminUser.validatePassword('password123');
      console.log('Admin login test:', adminValidPassword ? '✅ PASS' : '❌ FAIL');
    }
    
    if (customerUser) {
      const customerValidPassword = await customerUser.validatePassword('password123');
      console.log('Customer login test:', customerValidPassword ? '✅ PASS' : '❌ FAIL');
    }
    
    console.log('\n📋 Test Credentials:');
    console.log('Admin (Sales): admin@example.com / password123');
    console.log('Customer: customer@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
createTestUsers();