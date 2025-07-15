require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase') ? {
      require: true,
      rejectUnauthorized: false
    } : false
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