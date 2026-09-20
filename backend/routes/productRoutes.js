const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

router.get('/', productController.getAllProducts);
router.post('/', authMiddleware, adminMiddleware, upload.single('image_file'), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image_file'), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;