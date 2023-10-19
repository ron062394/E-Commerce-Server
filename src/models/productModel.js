const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }, // Add a stock field with a default value of 0
  images: [String], // An array of image URLs
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [String], // An array of tags
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Product', productSchema);
