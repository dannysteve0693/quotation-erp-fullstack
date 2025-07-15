const { Op } = require('sequelize');
const { sequelize, Quotation, QuotationItem, Product, User, SalesOrder, SalesOrderItem, QuotationAuditTrail } = require('../models');
const { roles } = require('../config/auth');

const createQuotation = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items, notes, valid_until } = req.body;
    
    let total_amount = 0;
    const quotationItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product || !product.is_active) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Product with ID ${item.product_id} not found or inactive`
        });
      }

      const unit_price = item.unit_price || product.price;
      const discount_percentage = item.discount_percentage || 0;
      const gross_total = item.quantity * unit_price;
      const discount_amount = (gross_total * discount_percentage) / 100;
      const sub_total = gross_total - discount_amount;

      quotationItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unit_price,
        discount_percentage: discount_percentage,
        discount_amount: discount_amount,
        sub_total: sub_total
      });

      total_amount += sub_total;
    }

    const quotation = await Quotation.create({
      customer_id: req.user.id,
      total_amount: total_amount,
      notes,
      valid_until,
      created_by: req.user.id
    }, { transaction });

    for (const item of quotationItems) {
      await QuotationItem.create({
        quotation_id: quotation.id,
        ...item
      }, { transaction });
    }

    await QuotationAuditTrail.create({
      quotation_id: quotation.id,
      event_type: 'created',
      new_status: 'pending',
      changed_by: req.user.id,
      change_reason: 'Quotation created'
    }, { transaction });

    await transaction.commit();

    const createdQuotation = await Quotation.findByPk(quotation.id, {
      include: [
        {
          model: QuotationItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'customer' },
        { model: User, as: 'creator' }
      ]
    });

    res.status(201).json({
      message: 'Quotation created successfully',
      quotation: createdQuotation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create quotation error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const getQuotations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, customerId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (req.user.role === roles.CUSTOMER) {
      where.customer_id = req.user.id;
    } else if (customerId) {
      where.customer_id = customerId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      where.created_at = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      where.created_at = {
        [Op.lte]: new Date(endDate)
      };
    }

    const { count, rows } = await Quotation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'approver', attributes: ['id', 'email', 'first_name', 'last_name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      quotations: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get quotations error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quotation = await Quotation.findByPk(id, {
      include: [
        {
          model: QuotationItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'approver', attributes: ['id', 'email', 'first_name', 'last_name'] },
        {
          model: QuotationAuditTrail,
          as: 'auditTrail',
          include: [{ model: User, as: 'user', attributes: ['id', 'email', 'first_name', 'last_name'] }],
          order: [['changed_at', 'DESC']]
        }
      ]
    });

    if (!quotation) {
      return res.status(404).json({
        error: 'Quotation not found'
      });
    }

    if (req.user.role === roles.CUSTOMER && quotation.customer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied. You can only view your own quotations.'
      });
    }

    res.json({
      quotation
    });
  } catch (error) {
    console.error('Get quotation error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const approveRejectQuotation = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    const quotation = await Quotation.findByPk(id, {
      include: [
        {
          model: QuotationItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!quotation) {
      await transaction.rollback();
      return res.status(404).json({
        error: 'Quotation not found'
      });
    }

    if (quotation.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Only pending quotations can be approved or rejected'
      });
    }

    const oldStatus = quotation.status;
    let newStatus;
    let salesOrder = null;

    if (action === 'approve') {
      newStatus = 'approved';
      
      salesOrder = await SalesOrder.create({
        quotation_id: quotation.id,
        customer_id: quotation.customer_id,
        total_amount: quotation.total_amount,
        created_by: req.user.id,
        notes: quotation.notes
      }, { transaction });

      for (const item of quotation.items) {
        await SalesOrderItem.create({
          sales_order_id: salesOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_percentage: item.discount_percentage,
          discount_amount: item.discount_amount,
          sub_total: item.sub_total
        }, { transaction });
      }

      await quotation.update({
        status: 'converted_to_order',
        approved_by: req.user.id,
        approved_at: new Date()
      }, { transaction });

      newStatus = 'converted_to_order';
    } else if (action === 'reject') {
      newStatus = 'rejected';
      await quotation.update({
        status: newStatus,
        approved_by: req.user.id,
        approved_at: new Date()
      }, { transaction });
    }

    await QuotationAuditTrail.create({
      quotation_id: quotation.id,
      event_type: action === 'approve' ? 'converted_to_order' : 'rejected',
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: req.user.id,
      change_reason: reason || `Quotation ${action}d`
    }, { transaction });

    await transaction.commit();

    const updatedQuotation = await Quotation.findByPk(quotation.id, {
      include: [
        {
          model: QuotationItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'approver', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: SalesOrder, as: 'salesOrder' }
      ]
    });

    res.json({
      message: `Quotation ${action}d successfully`,
      quotation: updatedQuotation,
      salesOrder: salesOrder ? await SalesOrder.findByPk(salesOrder.id, {
        include: [
          {
            model: SalesOrderItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }]
          }
        ]
      }) : null
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Approve/Reject quotation error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createQuotation,
  getQuotations,
  getQuotationById,
  approveRejectQuotation
};