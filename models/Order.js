const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  table: String,
  orderType: String,
  dishes: [
    {
      name: String,
      price: Number,
    }
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);
