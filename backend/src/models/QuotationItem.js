const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuotationItem = sequelize.define('QuotationItem', {
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
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  sub_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'quotation_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeSave: (item) => {
      const gross_total = item.quantity * item.unit_price;
      item.discount_amount = (gross_total * item.discount_percentage) / 100;
      item.sub_total = gross_total - item.discount_amount;
    }
  }
});

module.exports = QuotationItem;