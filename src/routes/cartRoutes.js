const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const {
  addToCart,
  removeFromCart,
  viewCart,
} = require('../controllers/cartController');

// Add a product to the cart (requires authentication)
router.post('/add', authenticateUser, addToCart);

// Remove a product from the cart (requires authentication)
router.delete('/remove/:id', authenticateUser, removeFromCart);

// View the contents of the cart (requires authentication)
router.get('/view', authenticateUser, viewCart);

module.exports = router;
