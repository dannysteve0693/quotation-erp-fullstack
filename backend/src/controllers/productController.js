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

module.exports = {
  getProducts,
  getProductById
};