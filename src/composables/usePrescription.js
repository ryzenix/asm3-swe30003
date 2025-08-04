import { ref, computed } from 'vue'
import { usePrescriptionApi } from '../services/prescriptionApi.js'

// Global state for prescriptions
const prescriptions = ref([])
const prescriptionSummary = ref(null)
const isLoading = ref(false)
const error = ref('')

export function usePrescription() {
  const { 
    createPrescription,
    getPrescriptionDetails,
    getUserPrescriptions,
    getUserPrescriptionSummary,
    uploadPrescriptionImage,
    deletePrescriptionImage,
    updatePrescriptionStatus,
    deletePrescription,
    getPrescriptionStatistics
  } = usePrescriptionApi()

  // Computed properties
  const pendingPrescriptions = computed(() => 
    prescriptions.value.filter(p => p.status === 'pending')
  )

  const approvedPrescriptions = computed(() => 
    prescriptions.value.filter(p => p.status === 'approved')
  )

  const rejectedPrescriptions = computed(() => 
    prescriptions.value.filter(p => p.status === 'rejected')
  )

  const expiredPrescriptions = computed(() => 
    prescriptions.value.filter(p => p.status === 'expired')
  )

  // Load user's prescriptions
  const loadPrescriptions = async (params = {}) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await getUserPrescriptions(params)
      
      if (response.success) {
        prescriptions.value = response.data.prescriptions || []
        return response
      } else {
        error.value = response.error || 'Failed to load prescriptions'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to load prescriptions'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Load prescription summary
  const loadPrescriptionSummary = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await getUserPrescriptionSummary()
      
      if (response.success) {
        prescriptionSummary.value = response.data.summary
        return response
      } else {
        error.value = response.error || 'Failed to load prescription summary'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to load prescription summary'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Create new prescription
  const submitPrescription = async (prescriptionData) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await createPrescription(prescriptionData)
      
      if (response.success) {
        // Add to local state
        prescriptions.value.unshift(response.data)
        
        // Update summary if available
        if (prescriptionSummary.value) {
          prescriptionSummary.value.totalPrescriptions += 1
          prescriptionSummary.value.pendingPrescriptions += 1
        }
        
        return response
      } else {
        error.value = response.error || 'Failed to create prescription'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to create prescription'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Get prescription details
  const getPrescription = async (prescriptionId) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await getPrescriptionDetails(prescriptionId)
      
      if (!response.success) {
        error.value = response.error || 'Failed to get prescription details'
      }
      
      return response
    } catch (err) {
      error.value = err.message || 'Failed to get prescription details'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Upload prescription image
  const addPrescriptionImage = async (prescriptionId, imageFile) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await uploadPrescriptionImage(prescriptionId, imageFile)
      
      if (response.success) {
        // Update local prescription if it exists
        const prescriptionIndex = prescriptions.value.findIndex(p => p.id === prescriptionId)
        if (prescriptionIndex !== -1) {
          const prescription = prescriptions.value[prescriptionIndex]
          prescription.images = response.data.updatedImages || []
        }
        
        return response
      } else {
        error.value = response.error || 'Failed to upload prescription image'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to upload prescription image'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Delete prescription image
  const removePrescriptionImage = async (prescriptionId, imageIndex) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await deletePrescriptionImage(prescriptionId, imageIndex)
      
      if (response.success) {
        // Update local prescription if it exists
        const prescriptionIndex = prescriptions.value.findIndex(p => p.id === prescriptionId)
        if (prescriptionIndex !== -1) {
          const prescription = prescriptions.value[prescriptionIndex]
          prescription.images = response.data.updatedImages || []
        }
        
        return response
      } else {
        error.value = response.error || 'Failed to delete prescription image'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete prescription image'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update prescription status (admin only)
  const updateStatus = async (prescriptionId, statusData) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await updatePrescriptionStatus(prescriptionId, statusData)
      
      if (response.success) {
        // Update local prescription if it exists
        const prescriptionIndex = prescriptions.value.findIndex(p => p.id === prescriptionId)
        if (prescriptionIndex !== -1) {
          prescriptions.value[prescriptionIndex] = {
            ...prescriptions.value[prescriptionIndex],
            ...response.data
          }
        }
        
        return response
      } else {
        error.value = response.error || 'Failed to update prescription status'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to update prescription status'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Delete prescription
  const removePrescription = async (prescriptionId) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await deletePrescription(prescriptionId)
      
      if (response.success) {
        // Remove from local state
        const prescriptionIndex = prescriptions.value.findIndex(p => p.id === prescriptionId)
        if (prescriptionIndex !== -1) {
          prescriptions.value.splice(prescriptionIndex, 1)
        }
        
        // Update summary if available
        if (prescriptionSummary.value) {
          prescriptionSummary.value.totalPrescriptions -= 1
        }
        
        return response
      } else {
        error.value = response.error || 'Failed to delete prescription'
        return response
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete prescription'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Get prescription statistics (admin only)
  const getStatistics = async (params = {}) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await getPrescriptionStatistics(params)
      
      if (!response.success) {
        error.value = response.error || 'Failed to get prescription statistics'
      }
      
      return response
    } catch (err) {
      error.value = err.message || 'Failed to get prescription statistics'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = ''
  }

  // Reset state
  const resetState = () => {
    prescriptions.value = []
    prescriptionSummary.value = null
    isLoading.value = false
    error.value = ''
  }

  return {
    // State
    prescriptions,
    prescriptionSummary,
    isLoading,
    error,
    
    // Computed
    pendingPrescriptions,
    approvedPrescriptions,
    rejectedPrescriptions,
    expiredPrescriptions,
    
    // Methods
    loadPrescriptions,
    loadPrescriptionSummary,
    submitPrescription,
    getPrescription,
    addPrescriptionImage,
    removePrescriptionImage,
    updateStatus,
    removePrescription,
    getStatistics,
    clearError,
    resetState
  }
}