import React from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: 'text-yellow-600 bg-yellow-100',
      Confirmed: 'text-blue-600 bg-blue-100',
      Preparing: 'text-orange-600 bg-orange-100',
      'Out for Delivery': 'text-purple-600 bg-purple-100',
      Delivered: 'text-green-600 bg-green-100',
      Cancelled: 'text-red-600 bg-red-100',
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  console.log('order Items', orders);
  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>My Orders</h1>
      </div>
      {!orders[0] && <NoData />}
      {orders.map((order, index) => {
        return (
          <div
            key={order._id + index + 'order'}
            className="border rounded-lg p-4 m-2 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600">
                  Order No:{' '}
                  <span className="font-medium">{order?.orderId}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(order?.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                    order?.order_status || 'Pending'
                  )}`}
                >
                  {order?.order_status || 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-center mb-3">
              <img
                src={order.product_details.image[0]}
                className="w-16 h-16 object-cover rounded-lg"
                alt={order.product_details.name}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {order.product_details.name}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {order.quantity || 1}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {formatCurrency(order.totalAmt)}
                </p>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment:</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.payment_status === 'CASH ON DELIVERY'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
