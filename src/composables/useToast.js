import { ref, reactive } from 'vue'

// Global toast state
const toasts = ref([])

export const useToast = () => {
  const showToast = (message, type = 'success', duration = 3000) => {
    const toast = {
      id: Date.now() + Math.random(),
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      timestamp: Date.now()
    }
    
    console.log('🍞 Adding toast:', toast)
    toasts.value.push(toast)
    
    // Auto remove
    setTimeout(() => {
      removeToast(toast.id)
    }, duration)
    
    return toast.id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      console.log('🗑️ Removing toast:', id)
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value = []
  }
  
  // Convenience methods
  const showSuccess = (message, duration = 3000) => showToast(message, 'success', duration)
  const showError = (message, duration = 5000) => showToast(message, 'error', duration)
  const showWarning = (message, duration = 4000) => showToast(message, 'warning', duration)
  const showInfo = (message, duration = 3000) => showToast(message, 'info', duration)
  
  return {
    toasts: toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts
  }
}