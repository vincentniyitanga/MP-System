// Imports and Initial Setup
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); // Required for Socket.IO
const socketIo = require('socket.io'); // Socket.IO for real-time notifications
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Allow frontend connections
const Product = require('./models/Product'); // Product schema
const StockMovement = require('./models/StockMovement'); // StockMovement schema
const Order = require('./models/Order'); // Order schema
const User = require('./models/User'); // User schema
const Notification = require('./models/Notification'); // Notification schema
const { authenticateToken, authorizeRole } = require('./middleware/auth'); // Auth middleware

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*', // Replace '*' with your frontend's URL in production
    methods: ['GET', 'POST', 'PUT']
  }
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI || 'your_mongo_uri_here';
mongoose
  .connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Socket.IO: Real-time notification setup
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper function to send real-time notifications
const sendNotification = async (role, message) => {
  const notifications = await Notification.find({ userRole: role, read: false });
  io.emit('notification', notifications); // Emit notifications to all clients
};

// Product Management Routes
// - Add a new product (Admin and Manager only)
app.post('/products', authenticateToken, authorizeRole('admin', 'manager'), [
  check('productName').notEmpty().withMessage('Product name is required'),
  check('stockQuantity').isNumeric().withMessage('Stock quantity must be a number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// - Get all products (Accessible by various roles including subDepotManager)
app.get('/products', authenticateToken, authorizeRole('admin', 'manager', 'clerk', 'accountant', 'subDepotManager'), async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

// - Update product details (Admin and Manager only)
app.put('/products/:id', authenticateToken, authorizeRole('admin', 'manager'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const movement = new StockMovement({
      productId: product._id,
      quantity: req.body.stockQuantity,
      type: req.body.type || 'add'
    });
    await movement.save();

    res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// - Delete a product (Admin and Manager only)
app.delete('/products/:id', authenticateToken, authorizeRole('admin', 'manager'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Stock Movements Routes
// - Log stock movement (Admin, Manager, and Clerk)
app.post('/stock-movements', authenticateToken, authorizeRole('admin', 'manager', 'clerk'), async (req, res) => {
  try {
    const movement = new StockMovement(req.body);
    await movement.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error logging stock movement', error });
  }
});

// Sales summary Report
app.get('/reports/sales-summary', authenticateToken, authorizeRole('admin', 'manager', 'accountant'), async (req, res) => {
  try {
    const salesSummary = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$productId', totalSold: { $sum: '$quantity' } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    ]);
    res.json(salesSummary);
  } catch (error) {
    console.error('Error generating sales summary:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

// - View all stock movements (Admin, Manager, and Accountant)
app.get('/stock-movements', authenticateToken, authorizeRole('admin', 'manager', 'accountant'), async (req, res) => {
  try {
    const movements = await StockMovement.find().populate('productId');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving stock movements', error });
  }
});

// Reports Routes
// - View reports of stock movements (Admin, Manager, and Accountant)
app.get('/reports', authenticateToken, authorizeRole('admin', 'manager', 'accountant'), async (req, res) => {
  try {
    const movements = await StockMovement.find().populate('productId');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reports', error });
  }
});

// Order Routes for Sub-Depot Managers
// - Place an order (Sub-Depot Managers)
app.post('/orders', authenticateToken, authorizeRole('subDepotManager'), async (req, res) => {
  try {
    const order = new Order({
      productId: req.body.productId,
      quantity: req.body.quantity,
      placedBy: req.user.id,
      status: 'pending'
    });
    await order.save();

    // Notify MP Warehouse users about the new order
    const rolesToNotify = ['manager', 'accountant', 'clerk'];
    for (const role of rolesToNotify) {
      await Notification.create({
        message: `New order placed by sub-depot manager ${req.user.id}. Please review.`,
        userRole: role,
        orderId: order._id
      });
      sendNotification(role, `New order placed by sub-depot manager ${req.user.id}. Please review.`);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// - Check order status (Sub-Depot Managers)
app.get('/orders/status', authenticateToken, authorizeRole('subDepotManager'), async (req, res) => {
  try {
    const orders = await Order.find({ placedBy: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order status', error });
  }
});

// Notification Routes for MP Warehouse Users
// - Get notifications for logged-in user's role
app.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userRole: req.user.role, read: false });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications', error });
  }
});

// - Mark a notification as read
app.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
});

// User Management Routes (Admins only)
// - Add a new user (Admin only)
app.post('/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// - Delete a user (Admin only)
app.delete('/users/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// User Login Route (Generates JWT Token with dynamic role)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Start the Server with Socket.IO
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));