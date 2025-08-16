import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { api } from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Status options for filtering
  const statusOptions = [
    { value: '', label: '全部狀態' },
    { value: '處理中', label: '處理中' },
    { value: '已出貨', label: '已出貨' }
  ];

  const statusText = {
    '處理中': '處理中',
    '已出貨': '已出貨',
    'pending': '處理中',
    'shipped': '已出貨'
  };

  const statusColor = {
    '處理中': 'bg-blue-100 text-blue-800',
    '已出貨': 'bg-green-100 text-green-800',
    'pending': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-green-100 text-green-800'
  };

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Convert Chinese status to English for API call
      const apiFilters = { ...filters };
      if (filters.status) {
        const statusMapping = {
          '處理中': 'pending',
          '已出貨': 'shipped'
        };
        apiFilters.status = statusMapping[filters.status] || filters.status;
      }

      console.log('Filters applied:', apiFilters); // Debug log
      const data = await api.admin.getAllOrders(apiFilters);

      if (data.status === 'success') {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
      } else {
        setError(data.message || '載入訂單失敗');
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update order status
  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      const data = await api.admin.updateOrderStatus(orderNumber, newStatus);

      if (data.status === 'success') {
        // Check if current filter is active and if the new status matches
        const currentFilter = filters.status;
        const newStatusChinese = statusText[newStatus] || newStatus;
        
        if (currentFilter && currentFilter !== '' && currentFilter !== newStatusChinese) {
          // If there's an active filter and the new status doesn't match, remove the order from view
          setOrders(prevOrders => 
            prevOrders.filter(order => order.orderNumber !== orderNumber)
          );
          
          // Close detail modal if it's the order being updated
          if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }
        } else {
          // If no filter is active or the new status matches the filter, update the order in place
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.orderNumber === orderNumber 
                ? { ...order, status: newStatus }
                : order
            )
          );

          // Update selected order if it's the one being updated
          if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
          }
        }

        // alert('訂單狀態更新成功！');
      } else {
        alert(data.message || '更新失敗');
      }
    } catch (err) {
      alert('網路錯誤，請稍後再試');
      console.error('Error updating order status:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    console.log('Filter change:', field, value); // Debug log
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  // Close order details
  const closeOrderDetails = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  // Handle refresh with date filter reset
  const handleRefresh = () => {
    setFilters(prev => ({
      ...prev,
      startDate: '',
      endDate: '',
      page: 1
    }));
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, fetchOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">載入中...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">訂單管理</h1>
          <p className="text-gray-600">管理和追蹤所有訂單狀態</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                訂單狀態
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                開始日期
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                結束日期
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重新載入
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    寄件人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    收件人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    總金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      沒有找到訂單
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.sender?.name}</div>
                          <div className="text-gray-500">{order.sender?.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.receiver?.name}</div>
                          <div className="text-gray-500">{order.receiver?.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        NT$ {order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {statusText[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            查看詳情
                          </button>
                          <select
                            value={statusText[order.status] || order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value === '處理中' ? 'pending' : 'shipped';
                              updateOrderStatus(order.orderNumber, newStatus);
                            }}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            title="更新狀態"
                          >
                            {statusOptions.filter(option => option.value !== '').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card Layout */}
          <div className="md:hidden">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">載入中...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                沒有找到訂單
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order._id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusText[order.status] || order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs">寄件人</div>
                        <div className="font-medium">{order.sender?.name}</div>
                        <div className="text-gray-600 text-xs">{order.sender?.phone}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">收件人</div>
                        <div className="font-medium">{order.receiver?.name}</div>
                        <div className="text-gray-600 text-xs">{order.receiver?.phone}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-900">
                        NT$ {order.totalAmount?.toLocaleString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          查看詳情
                        </button>
                        <select
                          value={statusText[order.status] || order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value === '處理中' ? 'pending' : 'shipped';
                            updateOrderStatus(order.orderNumber, newStatus);
                          }}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          title="更新狀態"
                        >
                          {statusOptions.filter(option => option.value !== '').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一頁
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一頁
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      顯示第 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> 到{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span> 筆，共{' '}
                      <span className="font-medium">{pagination.total}</span> 筆結果
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {/* Page numbers */}
                      {[...Array(pagination.pages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.page
                                ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    訂單詳情 - {selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={closeOrderDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Sender Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      寄件人資訊
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">姓名：</span>{selectedOrder.sender?.name}</div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedOrder.sender?.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{selectedOrder.sender?.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Receiver Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      收件人資訊
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">姓名：</span>{selectedOrder.receiver?.name}</div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedOrder.receiver?.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{selectedOrder.receiver?.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    訂單商品
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedOrder.orderItems?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <span className="font-medium">{item.productName}</span>
                            <span className="text-gray-500 ml-2">x {item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">NT$ {item.subtotal?.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">單價: NT$ {item.price?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">金額明細</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>小計</span>
                        <span>NT$ {selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>運費</span>
                        <span>NT$ {selectedOrder.shippingFee?.toLocaleString()}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>總計</span>
                        <span>NT$ {selectedOrder.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">備註</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Order Status and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">目前狀態：</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor[selectedOrder.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusText[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">更新狀態：</span>
                    <select
                      value={statusText[selectedOrder.status] || selectedOrder.status}
                      onChange={(e) => {
                        const newStatus = e.target.value === '處理中' ? 'pending' : 'shipped';
                        updateOrderStatus(selectedOrder.orderNumber, newStatus);
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {statusOptions.filter(option => option.value !== '').map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;