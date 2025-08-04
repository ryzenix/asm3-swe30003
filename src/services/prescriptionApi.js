// Prescription API Service
const API_BASE_URL = 'http://localhost:3000'

export function usePrescriptionApi() {
  // API helper function
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (err) {
      console.error('API call error:', err)
      throw err
    }
  }

  // Create new prescription
  async function createPrescription(prescriptionData) {
    try {
      const response = await apiCall('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(prescriptionData)
      })
      
      return response
    } catch (error) {
      console.error('Create prescription error:', error)
      return {
        success: false,
        error: error.message || 'Failed to create prescription'
      }
    }
  }

  // Get prescription details
  async function getPrescriptionDetails(prescriptionId) {
    try {
      const response = await apiCall(`/prescriptions/${prescriptionId}`)
      return response
    } catch (error) {
      console.error('Get prescription details error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch prescription details'
      }
    }
  }

  // List user's prescriptions
  async function getUserPrescriptions(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      
      // Add filter parameters
      if (params.status) queryParams.append('status', params.status)
      if (params.patientName) queryParams.append('patient_name', params.patientName)
      if (params.doctorName) queryParams.append('doctor_name', params.doctorName)
      if (params.startDate) queryParams.append('start_date', params.startDate)
      if (params.endDate) queryParams.append('end_date', params.endDate)
      
      const url = `/prescriptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await apiCall(url)
      return response
    } catch (error) {
      console.error('Get user prescriptions error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch prescriptions'
      }
    }
  }

  // Get user prescription summary
  async function getUserPrescriptionSummary() {
    try {
      const response = await apiCall('/prescriptions/summary')
      return response
    } catch (error) {
      console.error('Get prescription summary error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch prescription summary'
      }
    }
  }

  // Upload prescription image
  async function uploadPrescriptionImage(prescriptionId, imageFile) {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}/images`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Upload prescription image error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload prescription image'
      }
    }
  }

  // Delete prescription image
  async function deletePrescriptionImage(prescriptionId, imageIndex) {
    try {
      const response = await apiCall(`/prescriptions/${prescriptionId}/images/${imageIndex}`, {
        method: 'DELETE'
      })
      
      return response
    } catch (error) {
      console.error('Delete prescription image error:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete prescription image'
      }
    }
  }

  // Update prescription status (admin only)
  async function updatePrescriptionStatus(prescriptionId, statusData) {
    try {
      const response = await apiCall(`/prescriptions/${prescriptionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
      })
      
      return response
    } catch (error) {
      console.error('Update prescription status error:', error)
      return {
        success: false,
        error: error.message || 'Failed to update prescription status'
      }
    }
  }

  // Delete prescription
  async function deletePrescription(prescriptionId) {
    try {
      const response = await apiCall(`/prescriptions/${prescriptionId}`, {
        method: 'DELETE'
      })
      
      return response
    } catch (error) {
      console.error('Delete prescription error:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete prescription'
      }
    }
  }

  // Get prescription statistics (admin only)
  async function getPrescriptionStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
      if (params.dateTo) queryParams.append('dateTo', params.dateTo)
      
      const url = `/prescriptions/admin/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await apiCall(url)
      return response
    } catch (error) {
      console.error('Get prescription statistics error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch prescription statistics'
      }
    }
  }

  return {
    createPrescription,
    getPrescriptionDetails,
    getUserPrescriptions,
    getUserPrescriptionSummary,
    uploadPrescriptionImage,
    deletePrescriptionImage,
    updatePrescriptionStatus,
    deletePrescription,
    getPrescriptionStatistics
  }
}