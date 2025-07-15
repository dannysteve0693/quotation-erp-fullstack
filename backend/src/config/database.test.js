require('dotenv').config({ path: '.env.test' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Test database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the test database:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection
};