// Set NODE_ENV for test
process.env.NODE_ENV = 'test';

// Use test database configuration
const { sequelize } = require('../src/config/database.test');

// Import test models with test database
const testModels = require('../src/models/test-models');

// Make test models globally available
global.testModels = testModels;

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Test database cleanup failed:', error);
  }
});

beforeEach(async () => {
  const models = sequelize.models;
  for (const model of Object.values(models)) {
    await model.destroy({ where: {}, force: true });
  }
});