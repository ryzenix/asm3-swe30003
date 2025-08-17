// Order API Service
import { useErrorHandler } from '../composables/useErrorHandler'

const API_BASE_URL = 'http://localhost:3000'

export function useOrderApi() {
  const { makeStandardizedApiRequest } = useErrorHandler()
  // Get orders list with pagination and filters
  async function getOrdersList(params = {}) {
    const queryParams = new URLSearchParams()
    
    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    // Add filter parameters
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.paymentStatus) queryParams.append('payment_status', params.paymentStatus)
    if (params.dateFrom) queryParams.append('start_date', params.dateFrom)
    if (params.dateTo) queryParams.append('end_date', params.dateTo)
    
    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return await makeStandardizedApiRequest(`${API_BASE_URL}${url}`)
  }

  // Get single order details
  async function getOrderDetails(orderId) {
    return await makeStandardizedApiRequest(`${API_BASE_URL}/orders/${orderId}`)
  }

  // Update order status
  async function updateOrderStatus(orderId, statusData) {
    return await makeStandardizedApiRequest(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    })
  }

  // Cancel order
  async function cancelOrder(orderId, cancelData) {
    return await makeStandardizedApiRequest(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(cancelData)
    })
  }

  // Update delivery information
  async function updateDeliveryInfo(orderId, deliveryData) {
    return await makeStandardizedApiRequest(`${API_BASE_URL}/orders/${orderId}/delivery`, {
      method: 'PUT',
      body: JSON.stringify(deliveryData)
    })
  }

  // Get order statistics
  async function getOrderStatistics(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params.dateTo) queryParams.append('dateTo', params.dateTo)
    
    const url = `/orders/admin/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return await makeStandardizedApiRequest(`${API_BASE_URL}${url}`)
  }

  return {
    getOrdersList,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
    updateDeliveryInfo,
    getOrderStatistics
  }
}