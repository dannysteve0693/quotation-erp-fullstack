const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  const saltRounds = 12;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Bcrypt Hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation:', isValid);
    
    // Generate SQL insert statements
    console.log('\n--- SQL Insert Statements ---');
    console.log(`-- Sales User`);
    console.log(`INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, created_at, updated_at)`);
    console.log(`VALUES (uuid_generate_v4(), 'admin@example.com', '${hash}', 'sales', 'Admin', 'User', true, NOW(), NOW());`);
    
    console.log(`\n-- Customer User`);
    console.log(`INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, created_at, updated_at)`);
    console.log(`VALUES (uuid_generate_v4(), 'customer@example.com', '${hash}', 'customer', 'John', 'Doe', true, NOW(), NOW());`);
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();