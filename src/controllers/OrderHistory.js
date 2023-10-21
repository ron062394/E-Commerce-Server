import React, { useEffect, useState } from 'react';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch order history using an API request
    const token = localStorage.getItem('token'); // Replace with your token retrieval logic

    if (token) {
      fetch('/api/orders/history', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setOrders(data))
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <div>
      <h1>Order History</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            {/* Display order details here */}
            <p>Order ID: {order._id}</p>
            <p>Order Date: {new Date(order.date).toLocaleString()}</p>
            {/* Add more order details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderHistory;
