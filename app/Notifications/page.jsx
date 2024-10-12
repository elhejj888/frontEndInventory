'use client';
import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const notifications = [
  { id: 1, type: 'info', message: 'Your profile has been updated successfully.' },
  { id: 2, type: 'success', message: 'Your order has been confirmed and shipped.' },
  { id: 3, type: 'warning', message: 'Your subscription is about to expire soon.' },
  { id: 4, type: 'error', message: 'An error occurred during the payment attempt.' },
];

const getNotificationDetails = (type) => {
  switch (type) {
    case 'info':
      return { icon: <FiInfo />, borderColor: 'border-blue-500', textColor: 'text-blue-600' };
    case 'success':
      return { icon: <FiCheckCircle />, borderColor: 'border-green-500', textColor: 'text-green-600' };
    case 'warning':
      return { icon: <FiAlertTriangle />, borderColor: 'border-orange-500', textColor: 'text-orange-600' };
    case 'error':
      return { icon: <FiXCircle />, borderColor: 'border-red-500', textColor: 'text-red-600' };
    default:
      return { icon: null, borderColor: 'border-gray-500', textColor: 'text-gray-800' };
  }
};

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-white p-6 text-gray-900 flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {notifications.map((notification) => {
        const { icon, borderColor, textColor } = getNotificationDetails(notification.type);
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`w-full max-w-md p-4 rounded-lg border-l-4 ${borderColor} shadow-md flex items-start space-x-3`}
          >
            <div className={`text-2xl ${textColor}`}>
              {icon}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${textColor}`}>{notification.message}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default NotificationsPage;
