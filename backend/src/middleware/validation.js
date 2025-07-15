const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .isIn(['customer', 'sales'])
    .withMessage('Role must be either customer or sales'),
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name cannot be empty'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name cannot be empty'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateQuotation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.product_id')
    .isUUID()
    .withMessage('Product ID must be a valid UUID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('items.*.unit_price')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('items.*.discount_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0 and 100'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('valid_until')
    .optional()
    .isISO8601()
    .withMessage('Valid until must be a valid date'),
  handleValidationErrors
];

const validateQuotationApproval = [
  body('action')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be either approve or reject'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateQuotation,
  validateQuotationApproval,
  handleValidationErrors
};