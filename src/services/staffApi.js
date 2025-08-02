// services/staffApi.js
import { useErrorHandler } from '../composables/useErrorHandler.js'

const API_BASE_URL = 'http://localhost:3000/management/users'

export function useStaffApi() {
  const { makeApiRequest } = useErrorHandler()

  // Get staff list with filters and pagination
  const getStaffList = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      
      // Add filter parameters
      if (params.search) queryParams.append('search', params.search)
      if (params.role) queryParams.append('role', params.role)
      if (params.isActive !== undefined) queryParams.append('is_active', params.isActive)

      const url = `${API_BASE_URL}/list?${queryParams.toString()}`
      const response = await makeApiRequest(url)
      
      return response
    } catch (error) {
      console.error('Get staff list error:', error)
      throw error
    }
  }

  // Create new staff user
  const createStaff = async (staffData) => {
    try {
      const url = `${API_BASE_URL}/create-staff`
      const response = await makeApiRequest(url, {
        method: 'POST',
        body: JSON.stringify(staffData)
      })
      
      return response
    } catch (error) {
      console.error('Create staff error:', error)
      throw error
    }
  }

  // Update existing staff user
  const updateStaff = async (id, staffData) => {
    try {
      const url = `${API_BASE_URL}/modify/${id}`
      const response = await makeApiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(staffData)
      })
      
      return response
    } catch (error) {
      console.error('Update staff error:', error)
      throw error
    }
  }

  // Delete staff user
  const deleteStaff = async (id) => {
    try {
      const url = `${API_BASE_URL}/delete/${id}`
      const response = await makeApiRequest(url, {
        method: 'DELETE'
      })
      
      return response
    } catch (error) {
      console.error('Delete staff error:', error)
      throw error
    }
  }

  // Toggle staff status (active/inactive)
  const toggleStaffStatus = async (id, isActive) => {
    try {
      const url = `${API_BASE_URL}/modify/${id}`
      const response = await makeApiRequest(url, {
        method: 'PUT',
        body: JSON.stringify({ isActive })
      })
      
      return response
    } catch (error) {
      console.error('Toggle staff status error:', error)
      throw error
    }
  }

  return {
    getStaffList,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus
  }
} 