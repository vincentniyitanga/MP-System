// src/components/ProductList.js
import React, { useState } from 'react';
import axios from 'axios';

function ProductList({ products, setProducts }) {
  const [newProduct, setNewProduct] = useState({
    productName: '',
    stockQuantity: 0,
    empties: 0,
  });

  const handleAddProduct = async () => {
    // Add product logic
    if (newProduct.productName) {
      try {
        const response = await axios.post('/products', newProduct);
        setProducts([...products, response.data]);
        setNewProduct({ productName: '', stockQuantity: 0, empties: 0 });
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  const handleEditProduct = (productId) => {
    // Placeholder function for editing a product
    alert(`Edit product with ID: ${productId}`);
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.productName}
          onChange={(e) =>
            setNewProduct({ ...newProduct, productName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={newProduct.stockQuantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stockQuantity: +e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Empties"
          value={newProduct.empties}
          onChange={(e) =>
            setNewProduct({ ...newProduct, empties: +e.target.value })
          }
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.productName} - {product.stockQuantity} Full / {product.empties} Empties
            <button onClick={() => handleEditProduct(product._id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;