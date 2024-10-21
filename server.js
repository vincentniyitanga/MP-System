const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas URI (replace <user>, <password> with your credentials)
const uri = 'mongodb+srv://vincentniyitanga:Cenzo%403854958245@clustermp.zzac2.mongodb.net/';

// Connect to MongoDB Atlas
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch((err) => console.error('Failed to connect to MongoDB', err));
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(express.json()); // Enable JSON request body parsing

// Test route to ensure backend is running
app.get('/', (req, res) => {
  res.send('Warehouse System Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Add a new product
app.post('/products', async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send({ message: 'Error adding product', error });
    }
  });

  // GET/products : Get all products
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching products', error });
    }
  });

  // PUT/products:id :    Update a product
  app.put('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(400).send({ message: 'Error updating product', error });
    }
  });

  // Delete product
  app.delete('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }
      res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error deleting product', error });
    }
  });