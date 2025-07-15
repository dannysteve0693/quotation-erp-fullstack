require('dotenv').config();
const { Sequelize } = require('sequelize');

// Alternative configuration using individual parameters
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection
};