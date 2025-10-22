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
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  console.log('order Items', orders);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 shadow-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {!orders[0] && <NoData />}
        {orders.map((order, index) => {
          return (
            <div
              key={order._id + index + 'order'}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 overflow-hidden border border-gray-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      Order #{order?.orderId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Placed on {formatDate(order?.createdAt)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        order?.order_status || 'Pending'
                      )}`}
                    >
                      {order?.order_status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={order.product_details.image[0]}
                      className="w-full h-full object-cover"
                      alt={order.product_details.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {order.product_details.name}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-gray-600">
                        Qty:{' '}
                        <span className="font-medium">
                          {order.quantity || 1}
                        </span>
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {formatCurrency(order.totalAmt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment & Delivery Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Payment Method:
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          order.payment_status === 'CASH ON DELIVERY'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Amount:
                      </span>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(order.totalAmt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
