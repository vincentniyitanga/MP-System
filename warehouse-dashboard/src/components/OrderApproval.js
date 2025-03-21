// src/components/OrderApproval.js
import React from 'react';
import axios from 'axios';

function OrderApproval({ orders, setOrders }) {
  const handleApprove = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/approve`);
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'approved' } : order));
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/reject`);
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'rejected' } : order));
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  return (
    <div>
      <h2>Order Approval</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order {order._id} - {order.status}
            <button onClick={() => handleApprove(order._id)}>Approve</button>
            <button onClick={() => handleReject(order._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderApproval;