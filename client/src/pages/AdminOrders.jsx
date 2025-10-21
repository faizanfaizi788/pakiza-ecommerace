import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import { FaEdit, FaEye } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { IoMdCheckmarkCircle } from 'react-icons/io';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const orderStatuses = [
    {
      value: 'Pending',
      label: 'Pending',
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      value: 'Confirmed',
      label: 'Confirmed',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      value: 'Preparing',
      label: 'Preparing',
      color: 'text-orange-600 bg-orange-100',
    },
    {
      value: 'Out for Delivery',
      label: 'Out for Delivery',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      value: 'Delivered',
      label: 'Delivered',
      color: 'text-green-600 bg-green-100',
    },
    {
      value: 'Cancelled',
      label: 'Cancelled',
      color: 'text-red-600 bg-red-100',
    },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllOrdersAdmin,
        params: { page: currentPage, limit: 10 },
      });

      if (response.data.success) {
        setOrders(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderStats,
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, status: newStatus },
      });

      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        fetchStats();
        setShowStatusModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.color : 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage]);

  if (loading && orders.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 border border-purple-100">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4">
          Order Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 sm:p-3 rounded-xl border border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-yellow-600 font-medium">Pending</p>
            <p className="text-sm sm:text-lg font-bold text-yellow-700">
              {stats.pendingOrders || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-3 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-blue-600 font-medium">Confirmed</p>
            <p className="text-sm sm:text-lg font-bold text-blue-700">
              {stats.confirmedOrders || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 sm:p-3 rounded-xl border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-orange-600 font-medium">Preparing</p>
            <p className="text-sm sm:text-lg font-bold text-orange-700">
              {stats.preparingOrders || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 sm:p-3 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-purple-600 font-medium">Delivery</p>
            <p className="text-sm sm:text-lg font-bold text-purple-700">
              {stats.outForDeliveryOrders || 0}
            </p>
          </div>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mt-2 sm:mt-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-3 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-green-600 font-medium">Delivered</p>
            <p className="text-sm sm:text-lg font-bold text-green-700">
              {stats.deliveredOrders || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-2 sm:p-3 rounded-xl border border-red-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-red-600 font-medium">Cancelled</p>
            <p className="text-sm sm:text-lg font-bold text-red-700">
              {stats.cancelledOrders || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-gray-600 font-medium">Total</p>
            <p className="text-sm sm:text-lg font-bold text-gray-700">
              {stats.totalOrders || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-2 sm:p-3 rounded-xl border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-xs text-emerald-600 font-medium">Revenue</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-700 truncate">
              {formatCurrency(stats.totalRevenue || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-xl overflow-hidden border border-purple-100">
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border-b border-purple-100 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.orderId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowStatusModal(true);
                  }}
                  className="text-orange-600 hover:text-orange-900 p-1 ml-2"
                  title="Update Status"
                >
                  <FaEdit size={14} />
                </button>
              </div>

              <div className="flex items-center mb-2">
                <img
                  src={order.product_details?.image?.[0]}
                  alt={order.product_details?.name}
                  className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.product_details?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {order.quantity || 1}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900 truncate ml-1">
                    {order.userId?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.totalAmt)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment:</span>
                  <span
                    className={`px-1 py-0.5 text-xs rounded ${
                      order.payment_status === 'CASH ON DELIVERY'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {order.payment_status === 'CASH ON DELIVERY'
                      ? 'COD'
                      : order.payment_status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-1 py-0.5 text-xs rounded font-medium ${getStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
              <tr>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider min-w-[100px]">
                  Order ID
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider min-w-[120px]">
                  Customer
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider min-w-[150px]">
                  Product
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider min-w-[80px]">
                  Amount
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider min-w-[80px]">
                  Payment
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider min-w-[90px]">
                  Status
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Date
                </th>
                <th className="px-2 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
                >
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    <div className="max-w-[100px] truncate">
                      {order.orderId}
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap">
                    <div className="max-w-[120px]">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {order.userId?.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {order.userId?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center max-w-[150px]">
                      <img
                        src={order.product_details?.image?.[0]}
                        alt={order.product_details?.name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg object-cover mr-2"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {order.product_details?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {order.quantity || 1}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="max-w-[80px] truncate">
                      {formatCurrency(order.totalAmt)}
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-1 py-1 text-xs rounded-full ${
                        order.payment_status === 'CASH ON DELIVERY'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.payment_status === 'CASH ON DELIVERY'
                        ? 'COD'
                        : order.payment_status}
                    </span>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-1 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    <div className="max-w-[100px] truncate">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 py-3 whitespace-nowrap text-xs font-medium">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowStatusModal(true);
                      }}
                      className="text-orange-600 hover:text-orange-900 p-1"
                      title="Update Status"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return page;
                  }).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
            <div className="p-5">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Update Order Status
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Order ID: {selectedOrder.orderId}
                </p>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {orderStatuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        updateOrderStatus(selectedOrder._id, status.value)
                      }
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        selectedOrder.order_status === status.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
