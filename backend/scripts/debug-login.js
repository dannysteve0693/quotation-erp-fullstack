require('dotenv').config();
const { User } = require('../src/models');
const bcrypt = require('bcryptjs');

async function debugLogin() {
  try {
    console.log('🔍 Debugging login issues...\n');
    
    // Check database connection
    const { sequelize } = require('../src/config/database');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if users exist
    console.log('\n📋 Checking existing users...');
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'is_active', 'created_at']
    });
    
    console.log(`Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Active: ${user.is_active}`);
    });
    
    if (users.length === 0) {
      console.log('\n⚠️  No users found! Database might not be initialized.');
      console.log('Run: npm run create-test-users');
      return;
    }
    
    // Test login for each user
    console.log('\n🔐 Testing login with "password123"...');
    
    for (const user of users) {
      const fullUser = await User.findByPk(user.id);
      
      console.log(`\nTesting: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Active: ${user.is_active}`);
      console.log(`- Password hash: ${fullUser.password_hash.substring(0, 20)}...`);
      
      const isValid = await fullUser.validatePassword('password123');
      console.log(`- Password validation: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
      
      // Test bcrypt directly
      const directTest = await bcrypt.compare('password123', fullUser.password_hash);
      console.log(`- Direct bcrypt test: ${directTest ? '✅ PASS' : '❌ FAIL'}`);
    }
    
    // Test login API endpoint simulation
    console.log('\n🌐 Simulating API login...');
    const testEmail = 'customer@example.com';
    const testPassword = 'password123';
    
    const user = await User.findOne({ where: { email: testEmail } });
    if (!user) {
      console.log(`❌ User not found: ${testEmail}`);
      return;
    }
    
    if (!user.is_active) {
      console.log(`❌ User is not active: ${testEmail}`);
      return;
    }
    
    const isValidPassword = await user.validatePassword(testPassword);
    if (!isValidPassword) {
      console.log(`❌ Invalid password for: ${testEmail}`);
      return;
    }
    
    console.log(`✅ Login simulation successful for: ${testEmail}`);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    process.exit(0);
  }
}

debugLogin();