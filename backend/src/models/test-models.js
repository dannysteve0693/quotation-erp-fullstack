const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.test');
const bcrypt = require('bcryptjs');

// Define User model for tests
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('customer', 'sales'),
    allowNull: false,
    defaultValue: 'customer'
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password_hash;
  return values;
};

// Define Product model for tests
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define Quotation model for tests
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
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'draft'
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
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
  updatedAt: 'updated_at'
});

// Define QuotationItem model for tests
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
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'quotation_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define SalesOrder model for tests
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
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sales_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define SalesOrderItem model for tests
const SalesOrderItem = sequelize.define('SalesOrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sales_order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sales_orders',
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
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'sales_order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define QuotationAuditTrail model for tests
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
  changed_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'quotation_audit_trails',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Set up associations
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