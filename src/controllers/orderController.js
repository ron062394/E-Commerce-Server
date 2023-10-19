// controllers/orderController.js

const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel'); // Import the cart model

// controllers/orderController.js
// Place a new order
// controllers/orderController.js
// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { shippingInfo } = req.body;
    const user = req.user; // Assuming user is authenticated

    // Retrieve the contents of the buyer's cart
    const cart = await Cart.findOne({ user: user._id }).populate('items.product');

    if (!cart) {
      return res.status(400).json({ message: 'No items in the cart. Cannot place an empty order.' });
    }

    // Create a new order for each seller
    const orders = [];

    // Group items by seller
    const sellerOrders = {};

    cart.items.forEach(async (item) => {
      const sellerId = item.product.seller.toString();
      if (!sellerOrders[sellerId]) {
        sellerOrders[sellerId] = {
          user: user._id,
          seller: sellerId, // Save seller's ID in the order
          products: [],
          shippingInfo,
          orderTotal: 0,
          orderStatus: 'pending',
        };
      }

      const productPrice = item.product.price;
      sellerOrders[sellerId].products.push({
        product: item.product._id,
        quantity: item.quantity,
        price: productPrice,
      });

      sellerOrders[sellerId].orderTotal += item.quantity * productPrice;

      // Update stock quantities here
      item.product.stock -= item.quantity; // Decrease stock by the ordered quantity
      await item.product.save(); // Save the updated product

    });

    for (const sellerId in sellerOrders) {
      if (sellerOrders.hasOwnProperty(sellerId)) {
        const orderData = sellerOrders[sellerId];
        const order = new Order(orderData);
        await order.save();
        orders.push(order);
      }
    }

    // Clear the buyer's cart or update its status
    const clearCart = await Cart.findOne({ user: user._id });
    if (clearCart) {
      // If you need to update the cart status, you can do so here.
      // For example, set a status like 'order-placed' or 'active'.
      cart.items = []; // Clear the items in the cart
      await cart.save();
    }

    res.status(201).json({ message: 'Order placed successfully', orders });
  } catch (error) {
    res.status(400).json({ message: 'Placing an order failed', error: error.message });
  }
};





// View order history for a user
const viewOrderHistory = async (req, res) => {
  try {
    const user = req.user; // Assuming user is authenticated

    const orders = await Order.find({ user: user._id }).sort({ date: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};



const viewSellerOrders = async (req, res) => {
  try {
    const seller = req.user; // Assuming the user is a seller

    // Find orders where the seller's ID matches the user's ID
    const orders = await Order.find({ 'seller': seller._id }).sort({ date: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller order history', error: error.message });
  }
};

module.exports = {
  // ... other controller functions
  viewSellerOrders,
};


// View order details
const viewOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('products.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Utility function to calculate the total price of products in an order
const calculateOrderTotal = (products) => {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const newStatus = req.body.orderStatus;
      const user = req.user; // Assuming user is authenticated
  
      const order = await Order.findById(orderId).populate('products.product');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the new status is one of the allowed enum values
      if (!['pending', 'preparing to ship', 'shipped', 'product received'].includes(newStatus)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }
  
      // Check if the user is the seller of the product in the order
      const isSeller = order.products.some((product) => product.product.seller.toString() === user._id.toString());
  
      if (newStatus === 'preparing to ship' || newStatus === 'shipped') {
        if (!isSeller) {
          return res.status(403).json({ message: 'Unauthorized: Only sellers can update to preparing to ship or shipped' });
        }
      } else if (newStatus === 'product received') {
        if (order.user.toString() !== user._id.toString()) {
          return res.status(403).json({ message: 'Unauthorized: Only the user who placed the order can update to product received' });
        }
      }
  
      // Update the order status
      order.orderStatus = newStatus;
  
      // Save the updated order
      await order.save();
  
      res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
  };
  

module.exports = { placeOrder, viewOrderHistory, viewOrderDetails, updateOrderStatus, viewSellerOrders };