// src/components/StockMovements.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockMovements() {
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get('/stock-movements');
        setMovements(response.data);
      } catch (error) {
        console.error("Error fetching stock movements:", error);
      }
    };

    fetchMovements();
  }, []);

  return (
    <div>
      <h2>Stock Movements</h2>
      <ul>
        {movements.map((movement) => (
          <li key={movement._id}>
            {movement.productId} - {movement.quantity} ({movement.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockMovements;