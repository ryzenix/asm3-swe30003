import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export function useCheckout() {
  const router = useRouter()
  
  // Reactive state
  const isProcessing = ref(false)
  const currentStep = ref('cart') // cart, prescription, issues, processing, success
  const prescriptionData = ref(null)
  const cartIssues = ref(null)
  const orderResult = ref(null)
  
  // Modal states
  const showPrescriptionModal = ref(false)
  const showCartIssuesModal = ref(false)
  
  // Computed
  const canProceedToCheckout = computed(() => {
    return !isProcessing.value
  })
  
  // Check if cart has prescription required products
  const checkPrescriptionRequirements = (cartItems) => {
    return cartItems.filter(item => item.requiresPrescription === true)
  }
  
  // Check cart for issues (out of stock, discontinued)
  const checkCartIssues = async (cartItems) => {
    // Simulate API call to check product availability
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock logic for demonstration
    const issues = {
      outOfStock: [],
      discontinued: [],
      available: []
    }
    
    cartItems.forEach(item => {
      // Simulate random issues for demo
      const random = Math.random()
      if (random < 0.1) { // 10% chance out of stock
        issues.outOfStock.push(item)
      } else if (random < 0.15) { // 5% chance discontinued
        issues.discontinued.push(item)
      } else {
        issues.available.push(item)
      }
    })
    
    return issues
  }
  
  // Main checkout flow
  const initiateCheckout = async (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Giỏ hàng trống')
    }
    
    isProcessing.value = true
    currentStep.value = 'processing'
    
    try {
      // Step 1: Check for cart issues
      console.log('Checking cart issues...')
      const issues = await checkCartIssues(cartItems)
      
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
      const prescriptionProducts = checkPrescriptionRequirements(cartItems)
      
      if (prescriptionProducts.length > 0) {
        currentStep.value = 'prescription'
        showPrescriptionModal.value = true
        isProcessing.value = false
        return { step: 'prescription', data: prescriptionProducts }
      }
      
      // Step 3: Process order directly if no issues
      return await processOrder(cartItems)
      
    } catch (error) {
      console.error('Checkout initiation error:', error)
      isProcessing.value = false
      throw error
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
  const processOrder = async (cartItems, prescriptionData = null) => {
    try {
      isProcessing.value = true
      currentStep.value = 'processing'
      
      // Simulate order processing
      console.log('Processing order...', { cartItems, prescriptionData })
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate order result
      const orderId = Math.floor(Math.random() * 9000000) + 1000000
      const orderTotal = cartItems.reduce((total, item) => total + (item.priceValue * item.quantity), 0)
      
      const result = {
        orderId,
        items: cartItems,
        total: orderTotal,
        prescriptionData,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdAt: new Date()
      }
      
      orderResult.value = result
      currentStep.value = 'success'
      
      return result
      
    } catch (error) {
      console.error('Order processing error:', error)
      throw error
    } finally {
      isProcessing.value = false
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