const { Op } = require('sequelize');
const { SalesOrder, SalesOrderItem, Product, User, Quotation } = require('../models');
const { roles } = require('../config/auth');

const getSalesOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, quotationId, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (req.user.role === roles.CUSTOMER) {
      where.customer_id = req.user.id;
    }

    if (quotationId) {
      where.quotation_id = quotationId;
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await SalesOrder.findAndCountAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { 
          model: Quotation, 
          as: 'quotation', 
          attributes: ['id', 'quotation_number', 'status'] 
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      salesOrders: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get sales orders error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const getSalesOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salesOrder = await SalesOrder.findByPk(id, {
      include: [
        {
          model: SalesOrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { 
          model: Quotation, 
          as: 'quotation', 
          attributes: ['id', 'quotation_number', 'status', 'created_at'] 
        }
      ]
    });

    if (!salesOrder) {
      return res.status(404).json({
        error: 'Sales order not found'
      });
    }

    if (req.user.role === roles.CUSTOMER && salesOrder.customer_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied. You can only view your own sales orders.'
      });
    }

    res.json({
      salesOrder
    });
  } catch (error) {
    console.error('Get sales order error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const updateSalesOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, expected_delivery_date } = req.body;

    const salesOrder = await SalesOrder.findByPk(id);

    if (!salesOrder) {
      return res.status(404).json({
        error: 'Sales order not found'
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const updateData = { status };
    if (notes) updateData.notes = notes;
    if (expected_delivery_date) updateData.expected_delivery_date = expected_delivery_date;

    await salesOrder.update(updateData);

    const updatedSalesOrder = await SalesOrder.findByPk(id, {
      include: [
        {
          model: SalesOrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { 
          model: Quotation, 
          as: 'quotation', 
          attributes: ['id', 'quotation_number', 'status', 'created_at'] 
        }
      ]
    });

    res.json({
      message: 'Sales order updated successfully',
      salesOrder: updatedSalesOrder
    });
  } catch (error) {
    console.error('Update sales order error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const getSalesOrdersByQuotation = async (req, res) => {
  try {
    const { quotationId } = req.params;
    
    const salesOrders = await SalesOrder.findAll({
      where: { quotation_id: quotationId },
      include: [
        {
          model: SalesOrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'customer', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: User, as: 'creator', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { 
          model: Quotation, 
          as: 'quotation', 
          attributes: ['id', 'quotation_number', 'status', 'created_at'] 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    if (req.user.role === roles.CUSTOMER) {
      const filteredOrders = salesOrders.filter(order => order.customer_id === req.user.id);
      return res.json({
        salesOrders: filteredOrders
      });
    }

    res.json({
      salesOrders
    });
  } catch (error) {
    console.error('Get sales orders by quotation error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrderStatus,
  getSalesOrdersByQuotation
};