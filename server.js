// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log every incoming request for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// MongoDB connection (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Load Order model
const Order = require('./models/Order');

// Route: POST /api/orders → Save a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { name, mobile, table, orderType, dishes, total } = req.body;

    // Validate required fields
    if (!name || !mobile || !orderType || !Array.isArray(dishes) || total == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = new Order({
      name,
      mobile,
      table,
      orderType,
      dishes,
      total,
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Order received and saved:', savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('❌ Error saving order:', error.message);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Route: GET /api/orders → Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Health check (root) route
app.get('/', (req, res) => {
  res.send('🍽️ Food Ordering Backend is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
