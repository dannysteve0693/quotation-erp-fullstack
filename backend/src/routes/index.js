const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const quotationRoutes = require('./quotations');
const salesOrderRoutes = require('./salesOrders');
const productRoutes = require('./products');

router.use('/auth', authRoutes);
router.use('/quotations', quotationRoutes);
router.use('/sales-orders', salesOrderRoutes);
router.use('/products', productRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ERP Quotation API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;