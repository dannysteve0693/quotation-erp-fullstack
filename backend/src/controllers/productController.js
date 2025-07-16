const { Op } = require('sequelize');
const { Product } = require('../models');

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    const where = { is_active: true };
    
    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);

    if (!product || !product.is_active) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.json({
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category, sku } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock_quantity,
      category,
      sku,
      is_active: true
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category, sku } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    await product.update({
      name,
      description,
      price,
      stock_quantity,
      category,
      sku
    });

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    // Soft delete - set is_active to false
    await product.update({ is_active: false });

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};