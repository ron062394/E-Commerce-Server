const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      rated: { type: Boolean, default: false },
    },
  ],
  shippingInfo: {
    name: String,  // Add full name field
    contactNumber: String,  // Add contact number field
    address: String,
    city: String,
    postalCode: String,
  },
  orderTotal: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['pending', 'preparing to ship', 'shipped', 'product received'],
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
