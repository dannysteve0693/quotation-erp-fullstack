const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quotation = sequelize.define('Quotation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  quotation_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'converted_to_order'),
    allowNull: false,
    defaultValue: 'pending'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  valid_until: {
    type: DataTypes.DATE,
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
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'quotations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (quotation) => {
      if (!quotation.quotation_number) {
        const timestamp = Date.now();
        quotation.quotation_number = `Q-${timestamp}`;
      }
    }
  }
});

module.exports = Quotation;