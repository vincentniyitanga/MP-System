// models/StockMovement.js
const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['add', 'sell', 'transfer'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);