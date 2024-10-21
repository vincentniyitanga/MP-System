const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },  // Example: Skol 65 cl
  depot: { type: String, required: true },  // Location where stock is stored
  stockQuantity: { type: Number, required: true },  // Crates available
  emptyCrates: { type: Number, required: true },  // Returned empty crates
  difference: { type: Number, required: true },  // Stock discrepancies, if any
  pricePerCrate: { type: Number, required: true },  // Price per crate of product
  lastUpdated: { type: Date, default: Date.now }  // Timestamp of the last update
});

module.exports = mongoose.model('Product', productSchema);