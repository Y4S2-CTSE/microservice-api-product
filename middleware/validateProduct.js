const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// Product validation rules
exports.validateProduct = validate([
  body('productName').trim().isLength({ min: 2 }).escape()
    .withMessage('Product name must be at least 2 characters'),
  body('productCode').trim().isLength({ min: 3 }).escape()
    .withMessage('Product code must be at least 3 characters'),
  body('productType').trim().isLength({ min: 2 }).escape()
    .withMessage('Product type must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).escape()
    .withMessage('Description must be at least 10 characters'),
  body('image').isURL().withMessage('Must be a valid URL'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
]);

// Query validation rules
exports.validateQuery = validate([
  query('name').optional().trim().escape(),
  query('minPrice').optional().isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('productType').optional().trim().escape()
]);

// ID validation middleware
exports.validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }
  next();
};