import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'

// API base URL
const API_BASE_URL = 'http://localhost:3000'

export function useCheckout() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  
  // Reactive state
  const isProcessing = ref(false)
  const currentStep = ref('cart') // cart, prescription, issues, processing, success
  const prescriptionData = ref(null)
  const cartIssues = ref(null)
  const orderResult = ref(null)
  const error = ref(null)
  
  // Modal states
  const showPrescriptionModal = ref(false)
  const showCartIssuesModal = ref(false)

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
  
  // Computed
  const canProceedToCheckout = computed(() => {
    return !isProcessing.value
  })
  
  // Check if cart has prescription required products
  const checkPrescriptionRequirements = (cartItems) => {
    // Ensure cartItems is an array (convert from reactive proxy if needed)
    const itemsArray = Array.isArray(cartItems) ? cartItems : Array.from(cartItems || [])
    return itemsArray.filter(item => item.requiresPrescription === true)
  }
  
  // Check cart for issues (out of stock, discontinued)
  const checkCartIssues = async (cartItems) => {
    try {
      // Ensure cartItems is an array (convert from reactive proxy if needed)
      const itemsArray = Array.isArray(cartItems) ? cartItems : Array.from(cartItems || [])
      
      // Check product availability with backend
      const productIds = itemsArray.map(item => item.id)
      
      const response = await apiCall('/products/check-availability', {
        method: 'POST',
        body: JSON.stringify({ productIds })
      })

      if (response.success) {
        const issues = {
          outOfStock: [],
          discontinued: [],
          available: []
        }

        itemsArray.forEach(item => {
          const productStatus = response.data.find(p => p.id === item.id)
          
          if (!productStatus || !productStatus.isActive) {
            issues.discontinued.push(item)
          } else if (productStatus.stockQuantity < item.quantity) {
            issues.outOfStock.push({
              ...item,
              availableStock: productStatus.stockQuantity
            })
          } else {
            issues.available.push(item)
          }
        })

        return issues
      }
    } catch (err) {
      console.error('Error checking cart issues:', err)
      
      // Fallback: assume all items are available
      return {
        outOfStock: [],
        discontinued: [],
        available: itemsArray
      }
    }
  }
  
  // Main checkout flow
  const initiateCheckout = async (orderData) => {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      throw new Error('Giỏ hàng trống')
    }

    if (!isLoggedIn.value) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }
    
    isProcessing.value = true
    currentStep.value = 'processing'
    error.value = null
    
    try {
      // Step 1: Check for cart issues
      console.log('Checking cart issues...')
      const issues = await checkCartIssues(orderData.items)
      
      // If there are issues, show issues modal
      if (issues.outOfStock.length > 0 || issues.discontinued.length > 0) {
        cartIssues.value = issues
        currentStep.value = 'issues'
        showCartIssuesModal.value = true
        isProcessing.value = false
        return { step: 'issues', data: issues }
      }
      
      // Step 2: Check prescription requirements
      console.log('Checking prescription requirements...')
      const prescriptionProducts = checkPrescriptionRequirements(orderData.items)
      
      if (prescriptionProducts.length > 0) {
        currentStep.value = 'prescription'
        showPrescriptionModal.value = true
        isProcessing.value = false
        return { step: 'prescription', data: prescriptionProducts }
      }
      
      // Step 3: Process order directly if no issues
      return await processOrder(orderData)
      
    } catch (err) {
      console.error('Checkout initiation error:', err)
      error.value = err.message
      isProcessing.value = false
      throw err
    }
  }
  
  // Handle prescription upload completion
  const handlePrescriptionSubmit = async (prescriptionData, cartItems) => {
    try {
      isProcessing.value = true
      showPrescriptionModal.value = false
      
      // Store prescription data
      prescriptionData.value = prescriptionData
      
      // Continue with order processing
      return await processOrder(cartItems, prescriptionData)
      
    } catch (error) {
      console.error('Prescription submission error:', error)
      isProcessing.value = false
      throw error
    }
  }
  
  // Handle cart issues resolution
  const handleCartIssuesResolution = async (resolution) => {
    try {
      isProcessing.value = true
      showCartIssuesModal.value = false
      
      if (resolution.action === 'proceed') {
        // Continue with available items
        const availableItems = resolution.availableItems
        
        // Check prescription requirements for available items
        const prescriptionProducts = checkPrescriptionRequirements(availableItems)
        
        if (prescriptionProducts.length > 0) {
          currentStep.value = 'prescription'
          showPrescriptionModal.value = true
          isProcessing.value = false
          return { step: 'prescription', data: prescriptionProducts }
        }
        
        // Process order with available items
        return await processOrder(availableItems)
      } else {
        // User chose to go back to cart
        currentStep.value = 'cart'
        isProcessing.value = false
        return { step: 'cart' }
      }
      
    } catch (error) {
      console.error('Cart issues resolution error:', error)
      isProcessing.value = false
      throw error
    }
  }
  
  // Process the actual order
  const processOrder = async (orderData, prescriptionData = null) => {
    try {
      isProcessing.value = true
      currentStep.value = 'processing'
      error.value = null
      
      console.log('Processing order...', { orderData, prescriptionData })
      
      // Prepare order payload
      const orderPayload = {
        items: orderData.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.priceValue,
          productSku: item.sku || null
        })),
        totalAmount: orderData.items.reduce((total, item) => total + (item.priceValue * item.quantity), 0),
        shippingAddress: orderData.customerInfo,
        billingAddress: orderData.customerInfo,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        shippingMethod: orderData.deliveryInfo?.carrier?.toLowerCase() || 'standard',
        shippingCost: 0,
        notes: orderData.notes || null,
        prescriptionRequired: prescriptionData ? true : false
      }

      // Create order via API
      const response = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      })

      if (response.success) {
        // If prescription data exists, upload it
        if (prescriptionData) {
          try {
            await uploadPrescriptionForOrder(response.data.id, prescriptionData)
          } catch (prescErr) {
            console.warn('Prescription upload failed:', prescErr)
            // Continue with order creation even if prescription upload fails
          }
        }

        const result = {
          orderId: response.data.id,
          orderNumber: response.data.id,
          items: orderData.items,
          total: response.data.totalAmount,
          prescriptionData,
          status: response.data.status,
          estimatedDelivery: response.data.estimatedDeliveryDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdAt: response.data.createdAt
        }
        
        orderResult.value = result
        currentStep.value = 'success'
        
        return { step: 'success', data: result }
      } else {
        throw new Error(response.error || 'Đặt hàng thất bại')
      }
      
    } catch (err) {
      console.error('Order processing error:', err)
      error.value = err.message
      throw err
    } finally {
      isProcessing.value = false
    }
  }

  // Upload prescription for order
  const uploadPrescriptionForOrder = async (orderId, prescriptionData) => {
    try {
      // Import prescription API
      const { usePrescriptionApi } = await import('../services/prescriptionApi.js')
      const { createPrescription, uploadPrescriptionImage } = usePrescriptionApi()

      const prescriptionPayload = {
        patientName: prescriptionData.patientName,
        doctorName: prescriptionData.doctorName,
        doctorLicense: prescriptionData.doctorLicense,
        clinicName: prescriptionData.clinicName,
        issueDate: prescriptionData.issueDate,
        expiryDate: prescriptionData.expiryDate,
        diagnosis: prescriptionData.diagnosis,
        notes: prescriptionData.notes,
        // Add order reference
        orderId: orderId,
        // Add prescription items from order
        prescriptionItems: prescriptionData.prescriptionProducts?.map(product => ({
          medicationName: product.title,
          dosage: product.dosage || '',
          frequency: product.frequency || '',
          duration: product.duration || '',
          quantity: product.quantity,
          instructions: product.instructions || ''
        })) || []
      }

      const response = await createPrescription(prescriptionPayload)

      if (response.success && prescriptionData.files) {
        // Upload prescription images if any
        for (const file of prescriptionData.files) {
          if (file instanceof File) {
            try {
              await uploadPrescriptionImage(response.data.id, file)
            } catch (uploadErr) {
              console.warn(`Failed to upload image ${file.name}:`, uploadErr)
              // Continue with other files even if one fails
            }
          }
        }
      }

      return response
    } catch (err) {
      console.error('Prescription upload error:', err)
      throw err
    }
  }
  
  // Navigate to order details
  const navigateToOrder = (orderId) => {
    router.push(`/orders/${orderId}`)
  }
  
  // Reset checkout state
  const resetCheckout = () => {
    isProcessing.value = false
    currentStep.value = 'cart'
    prescriptionData.value = null
    cartIssues.value = null
    orderResult.value = null
    showPrescriptionModal.value = false
    showCartIssuesModal.value = false
  }
  
  // Close modals
  const closePrescriptionModal = () => {
    showPrescriptionModal.value = false
    currentStep.value = 'cart'
  }
  
  const closeCartIssuesModal = () => {
    showCartIssuesModal.value = false
    currentStep.value = 'cart'
  }
  
  // Utility functions
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ'
  }
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  return {
    // State
    isProcessing: computed(() => isProcessing.value),
    currentStep: computed(() => currentStep.value),
    prescriptionData: computed(() => prescriptionData.value),
    cartIssues: computed(() => cartIssues.value),
    orderResult: computed(() => orderResult.value),
    error: computed(() => error.value),
    showPrescriptionModal: computed(() => showPrescriptionModal.value),
    showCartIssuesModal: computed(() => showCartIssuesModal.value),
    canProceedToCheckout,
    
    // Actions
    initiateCheckout,
    handlePrescriptionSubmit,
    handleCartIssuesResolution,
    processOrder,
    navigateToOrder,
    resetCheckout,
    closePrescriptionModal,
    closeCartIssuesModal,
    
    // Utilities
    checkPrescriptionRequirements,
    checkCartIssues,
    formatPrice,
    formatDate
  }
}