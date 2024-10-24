// server.js
const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product'); // Product schema
const StockMovement = require('./models/StockMovement'); // StockMovement schema
const { authenticateToken, authorizeRole } = require('./middleware/auth'); // Auth middleware
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection (replace with your actual MongoDB URI)
const uri = 'mongodb+srv://vincentniyitanga:Cenzo%403854958245@clustermp.zzac2.mongodb.net/warehouseDB';
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// CREATE: Add a new product with validation (Managers only)
app.post(
  '/products',
  authenticateToken, 
  authorizeRole('manager'), 
  [
    check('productName').notEmpty().withMessage('Product name is required'),
    check('stockQuantity').isNumeric().withMessage('Stock quantity must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
    }
  }
);

// READ: Get all products (Open to authenticated users)
app.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

// UPDATE: Update product details and log stock movement (Authenticated users)
app.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Log stock movement
    const movement = new StockMovement({
      productId: product._id,
      quantity: req.body.stockQuantity,
      type: req.body.type || 'add', // Change to 'sell' or 'transfer' as needed
    });
    await movement.save();

    res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// DELETE: Delete a product (Managers only)
app.delete('/products/:id', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// CREATE: Log stock movement (Authenticated users)
app.post('/stock-movements', authenticateToken, async (req, res) => {
  try {
    const movement = new StockMovement(req.body);
    await movement.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error logging stock movement', error });
  }
});

// GET: View stock movement reports (Managers only)
app.get('/reports', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const movements = await StockMovement.find().populate('productId');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reports', error });
  }
});

// GET /movements: Retrieve all stock movements
app.get('/movements', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const movements = await StockMovement.find().populate('productId');
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock movements', error });
  }
});

// User Login Route (Generates JWT Token)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Placeholder authentication (replace with proper user lookup in production)
  const user = { username, role: 'manager' }; 

  const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

// CREATE: Add a new user (Managers only)
app.post('/users', authenticateToken, authorizeRole('manager'), async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the user to the database (assuming a User model)
    const user = { username, password: hashedPassword, role };
    // Replace with actual DB save logic
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// DELETE: Delete a user (Managers only)
app.delete('/users/:id', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    // Replace with actual DB delete logic
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));