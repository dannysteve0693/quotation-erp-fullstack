// Use test models when in test environment
if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test-models');
} else {
  const { sequelize } = require('../config/database');
  const User = require('./User');
  const Product = require('./Product');
  const Quotation = require('./Quotation');
  const QuotationItem = require('./QuotationItem');
  const SalesOrder = require('./SalesOrder');
  const SalesOrderItem = require('./SalesOrderItem');
  const QuotationAuditTrail = require('./QuotationAuditTrail');

  User.hasMany(Quotation, { foreignKey: 'customer_id', as: 'quotations' });
  User.hasMany(Quotation, { foreignKey: 'created_by', as: 'createdQuotations' });
  User.hasMany(Quotation, { foreignKey: 'approved_by', as: 'approvedQuotations' });
  User.hasMany(SalesOrder, { foreignKey: 'customer_id', as: 'salesOrders' });
  User.hasMany(SalesOrder, { foreignKey: 'created_by', as: 'createdSalesOrders' });
  User.hasMany(QuotationAuditTrail, { foreignKey: 'changed_by', as: 'auditTrails' });

  Quotation.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
  Quotation.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Quotation.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
  Quotation.hasMany(QuotationItem, { foreignKey: 'quotation_id', as: 'items' });
  Quotation.hasOne(SalesOrder, { foreignKey: 'quotation_id', as: 'salesOrder' });
  Quotation.hasMany(QuotationAuditTrail, { foreignKey: 'quotation_id', as: 'auditTrail' });

  Product.hasMany(QuotationItem, { foreignKey: 'product_id', as: 'quotationItems' });
  Product.hasMany(SalesOrderItem, { foreignKey: 'product_id', as: 'salesOrderItems' });

  QuotationItem.belongsTo(Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
  QuotationItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  SalesOrder.belongsTo(Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
  SalesOrder.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
  SalesOrder.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  SalesOrder.hasMany(SalesOrderItem, { foreignKey: 'sales_order_id', as: 'items' });

  SalesOrderItem.belongsTo(SalesOrder, { foreignKey: 'sales_order_id', as: 'salesOrder' });
  SalesOrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  QuotationAuditTrail.belongsTo(Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
  QuotationAuditTrail.belongsTo(User, { foreignKey: 'changed_by', as: 'user' });

  const models = {
    User,
    Product,
    Quotation,
    QuotationItem,
    SalesOrder,
    SalesOrderItem,
    QuotationAuditTrail,
    sequelize
  };

  module.exports = models;
}