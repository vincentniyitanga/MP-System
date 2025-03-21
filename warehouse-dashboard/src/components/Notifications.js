// src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Notifications({ notifications }) {
  const [notificationList, setNotificationList] = useState(notifications);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Adjust based on backend server URL
    socket.on('notification', (notification) => {
      setNotificationList((prev) => [...prev, notification]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notificationList.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;