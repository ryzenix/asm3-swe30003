// Prescription API Service
import { useErrorHandler } from '../composables/useErrorHandler'

const API_BASE_URL = 'http://localhost:3000'

export function usePrescriptionApi() {
  const { makeStandardizedApiRequest, handleApiResponseError } = useErrorHandler()

  // API helper function using standardized error handling
  const apiCall = async (url, options = {}) => {
    return await makeStandardizedApiRequest(`${API_BASE_URL}${url}`, options)
  }

  // Create new prescription
  async function createPrescription(prescriptionData) {
    return await apiCall('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData)
    })
  }

  // Get prescription details
  async function getPrescriptionDetails(prescriptionId) {
    return await apiCall(`/prescriptions/${prescriptionId}`)
  }

  // List user's prescriptions
  async function getUserPrescriptions(params = {}) {
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
    
    return await apiCall(url)
  }

  // Get user prescription summary
  async function getUserPrescriptionSummary() {
    return await apiCall('/prescriptions/summary')
  }

  // Upload prescription image
  async function uploadPrescriptionImage(prescriptionId, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return await makeStandardizedApiRequest(`${API_BASE_URL}/prescriptions/${prescriptionId}/images`, {
      method: 'POST',
      body: formData
    })
  }

  // Delete prescription image
  async function deletePrescriptionImage(prescriptionId, imageIndex) {
    return await apiCall(`/prescriptions/${prescriptionId}/images/${imageIndex}`, {
      method: 'DELETE'
    })
  }

  // Update prescription status (admin only)
  async function updatePrescriptionStatus(prescriptionId, statusData) {
    return await apiCall(`/prescriptions/${prescriptionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    })
  }

  // Delete prescription
  async function deletePrescription(prescriptionId) {
    return await apiCall(`/prescriptions/${prescriptionId}`, {
      method: 'DELETE'
    })
  }

  // Get prescription statistics (admin only)
  async function getPrescriptionStatistics(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params.dateTo) queryParams.append('dateTo', params.dateTo)
    
    const url = `/prescriptions/admin/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return await apiCall(url)
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