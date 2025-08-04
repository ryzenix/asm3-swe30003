// Order API Service
const API_BASE_URL = 'http://localhost:3000/api'

export function useOrderApi() {
  // Get orders list with pagination and filters
  async function getOrdersList(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      
      // Add filter parameters
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.deliveryType) queryParams.append('deliveryType', params.deliveryType)
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params.dateTo) queryParams.append('dateTo', params.dateTo)
      
      const url = `${API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when available
          // 'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Get orders list error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch orders'
      }
    }
  }

  // Get single order details
  async function getOrderDetails(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Get order details error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch order details'
      }
    }
  }

  // Update order status
  async function updateOrderStatus(orderId, statusData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statusData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Update order status error:', error)
      return {
        success: false,
        error: error.message || 'Failed to update order status'
      }
    }
  }

  // Cancel order
  async function cancelOrder(orderId, cancelData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cancelData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Cancel order error:', error)
      return {
        success: false,
        error: error.message || 'Failed to cancel order'
      }
    }
  }

  // Update delivery information
  async function updateDeliveryInfo(orderId, deliveryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deliveryData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Update delivery info error:', error)
      return {
        success: false,
        error: error.message || 'Failed to update delivery information'
      }
    }
  }

  // Get order statistics
  async function getOrderStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params.dateTo) queryParams.append('dateTo', params.dateTo)
      
      const url = `${API_BASE_URL}/orders/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Get order statistics error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch order statistics'
      }
    }
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