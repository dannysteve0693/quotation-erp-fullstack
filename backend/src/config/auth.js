module.exports = {
  jwtSecret: process.env.JWT_SECRET || '3d24379807562d988f83aac5ea320684',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  saltRounds: 12,
  roles: {
    CUSTOMER: 'customer',
    SALES: 'sales'
  }
};