const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const {
  login, getStats, getLocalProducts, createProduct,
  updateProduct, deleteProduct, getCustomers, getSearchLogs, logSearch
} = require('../controllers/adminController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

router.post('/login', login);
router.get('/stats', auth, getStats);
router.get('/products', auth, getLocalProducts);
router.post('/products', auth, upload.single('image'), createProduct);
router.put('/products/:id', auth, upload.single('image'), updateProduct);
router.delete('/products/:id', auth, deleteProduct);
router.get('/orders', auth, (req, res) => {
  const { getAllOrders } = require('../controllers/orderController');
  getAllOrders(req, res);
});
router.put('/orders/:id', auth, (req, res) => {
  const { updateOrderStatus } = require('../controllers/orderController');
  updateOrderStatus(req, res);
});
router.get('/customers', auth, getCustomers);
router.get('/search-logs', auth, getSearchLogs);

module.exports = router;
