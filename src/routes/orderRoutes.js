// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const {
    placeOrder,
    viewOrderHistory,
    viewOrderDetails,
    updateOrderStatus,
    viewSellerOrders
} = require('../controllers/orderController');

// Place a new order
router.post('/place', authenticateUser, placeOrder);

// View order history
router.get('/history', authenticateUser, viewOrderHistory);

// View order details
router.get('/:orderId', authenticateUser, viewOrderDetails);

// Update Order Status
router.put('/:orderId/status', authenticateUser, updateOrderStatus);

// Seller-specific route
router.get('/seller/orders', authenticateUser, viewSellerOrders);


module.exports = router;
