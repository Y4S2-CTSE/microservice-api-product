const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateQuery, validateId } = require('../middleware/validateProduct');

router.post('/', validateProduct, productController.createProduct);
router.get('/', validateQuery, productController.getAllProducts);
router.get('/:id', validateId, productController.getProductById);
router.put('/:id', [validateId, validateProduct], productController.updateProduct);
router.delete('/:id', validateId, productController.deleteProduct);

module.exports = router;