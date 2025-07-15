const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesOrder = sequelize.define('SalesOrder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quotation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'quotations',
      key: 'id'
    }
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expected_delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'sales_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (order) => {
      if (!order.order_number) {
        const timestamp = Date.now();
        order.order_number = `SO-${timestamp}`;
      }
    }
  }
});

module.exports = SalesOrder;