// src/components/ManagerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import StockMovements from './StockMovements';
import OrderApproval from './OrderApproval';
import Notifications from './Notifications';

const predefinedProducts = [
  { productName: 'Skol 65 cl', stockQuantity: 63, empties: 1125 },
  { productName: 'Skol 50 cl', stockQuantity: 60, empties: 54 },
  { productName: 'Skol 33 cl', stockQuantity: 16, empties: 1515 },
  { productName: 'Gatanu 65 cl', stockQuantity: 200, empties: 2287 },
  { productName: 'Gatanu 50 cl', stockQuantity: 142, empties: 240 },
  { productName: 'Lager 65 cl', stockQuantity: 204, empties: 0 },
  { productName: 'Lager 50 cl', stockQuantity: 33, empties: 432 },
  { productName: 'Lager 33 cl', stockQuantity: 55, empties: 962 },
  { productName: 'Panache 65 cl', stockQuantity: 8, empties: 0 },
  { productName: 'Panache 33 cl', stockQuantity: 79, empties: 372 },
  { productName: 'Virunga 50 cl mist', stockQuantity: 28, empties: 254 },
  { productName: 'Virunga 33 cl mist', stockQuantity: 14, empties: 216 },
  { productName: 'Virunga 65 cl gold', stockQuantity: 144, empties: 304 },
  { productName: 'Virunga 50 cl gold', stockQuantity: 0, empties: 0 },
  { productName: 'Virunga 33 cl gold', stockQuantity: 21, empties: 0 },
  { productName: 'Virunga Silver', stockQuantity: 10, empties: 57 },
  { productName: 'Mineral Water', stockQuantity: 0, empties: 0 },
  { productName: 'Pulse', stockQuantity: 24, empties: 72 },
];

function ManagerDashboard() {
  const [products, setProducts] = useState(predefinedProducts);

  useEffect(() => {
    // Optionally fetch real-time data here if the backend API is connected
  }, []);

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <Notifications />
      <ProductList products={products} setProducts={setProducts} />
      <StockMovements />
      <OrderApproval />
    </div>
  );
}

export default ManagerDashboard;