const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuotationAuditTrail = sequelize.define('QuotationAuditTrail', {
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
  event_type: {
    type: DataTypes.ENUM('created', 'updated', 'status_changed', 'approved', 'rejected', 'converted_to_order'),
    allowNull: false
  },
  old_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  new_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  changed_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  change_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  changed_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'quotation_audit_trail',
  timestamps: false
});

module.exports = QuotationAuditTrail;