// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // assuming model is defined in models/Order.js

// POST: Save a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

module.exports = router;
