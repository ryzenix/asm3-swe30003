import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'
import { useErrorHandler } from './useErrorHandler'
import { useToast } from './useToast'
import { useCart } from './useCart'
import { nextTick } from 'vue'

// API base URL
const API_BASE_URL = 'http://localhost:3000'

export function useCheckout() {
  const router = useRouter()
  const { isLoggedIn, user, checkSession } = useAuth()
  const { makeApiRequest, handleApiError, handleApiResponseError } = useErrorHandler()
  const { showError } = useToast()
  const { cartItems } = useCart()
  
  // Reactive state             
  const isProcessing = ref(false)
  const currentStep = ref('cart') // cart, prescription, issues, processing, success
  const prescriptionData = ref(null)
  const cartIssues = ref({
    outOfStock: [],
    discontinued: [],
    available: []
  })
  const orderResult = ref(null)
  const error = ref(null)
  
  // Modal states
  const showPrescriptionModal = ref(false)
  const showCartIssuesModal = ref(false)

  // API helper function using standardized error handling
  const apiCall = async (url, options = {}) => {
    return await makeApiRequest(`${API_BASE_URL}${url}`, options)
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
  
  // Watch for cart changes and update cartIssues automatically
  watch(cartItems, async (newCartItems, oldCartItems) => {
    console.log('Cart items changed, updating cart issues:', { 
      newLength: newCartItems?.length, 
      oldLength: oldCartItems?.length,
      currentStep: currentStep.value
    })
    
    // Only check stock once when page loads (cart is populated)
    // Don't auto-refresh during cart browsing - stock will be checked during checkout
    if (currentStep.value === 'cart' && 
        newCartItems && 
        newCartItems.length > 0 && 
        (!oldCartItems || oldCartItems.length === 0)) {
      // Initial page load - check stock once for user awareness
      try {
        console.log('Initial page load - checking stock once for user awareness...')
        const issues = await checkCartIssues(newCartItems)
        cartIssues.value = {
          outOfStock: issues.outOfStock || [],
          discontinued: issues.discontinued || [],
          available: issues.available || [],
          lowStock: issues.lowStock || [],
          filtered: []
        }
        console.log('Initial stock check completed for user awareness:', cartIssues.value)
      } catch (err) {
        console.error('Error in initial stock check:', err)
      }
    } else if (!newCartItems || newCartItems.length === 0) {
      // Reset issues when cart is empty
      console.log('Cart is empty, resetting cart issues')
      cartIssues.value = {
        outOfStock: [],
        discontinued: [],
        available: [],
        lowStock: [],
        filtered: []
      }
    } else {
      // Skip updates during cart browsing - stock will be checked during checkout
      console.log('Skipping cart issues update - cart browsing, stock will be checked during checkout')
    }
  }, { immediate: false, deep: true }) // Changed immediate to false to prevent API call on page load
  
  // Check cart for issues (out of stock, discontinued)
  const checkCartIssues = async (cartItems) => {
    try {
      // Ensure cartItems is an array (convert from reactive proxy if needed)
      const itemsArray = Array.isArray(cartItems) ? cartItems : Array.from(cartItems || [])
      
      // Filter out items with 0 quantity - they shouldn't be in the cart
      const validItems = itemsArray.filter(item => item.quantity > 0)
      
      console.log('Checking cart issues for items:', validItems.map(item => ({ 
        id: item.id, 
        title: item.title, 
        quantity: item.quantity,
        fullItem: item // Log the full item to see its structure
      })))
      console.log('Filtered out items with 0 quantity:', itemsArray.filter(item => item.quantity === 0).map(item => ({ id: item.id, title: item.title, quantity: item.quantity })))
      
      if (validItems.length === 0) {
        console.log('No valid items to check (all items have 0 quantity), returning empty issues')
        return {
          outOfStock: [],
          discontinued: [],
          available: []
        }
      }
      
      // Check product availability with backend
      const productIds = validItems.map(item => item.id)
      console.log('Checking availability for product IDs:', productIds)
      
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

        console.log('Backend availability response:', response.data)

        validItems.forEach(item => {
          const productStatus = response.data.find(p => p.id === item.id)
          console.log(`Product ${item.title} (ID: ${item.id}):`, productStatus)
          console.log(`Looking for product ID ${item.id} in response:`, response.data.map(p => ({ id: p.id, stockQuantity: p.stockQuantity, isActive: p.isActive })))
          
          if (!productStatus || !productStatus.isActive) {
            console.log(`Product ${item.title} is discontinued or inactive`)
            issues.discontinued.push(item)
          } else if (productStatus.stockQuantity < item.quantity || (item.quantity > 0 && productStatus.stockQuantity === 0)) {
            // Check if stock is insufficient OR if requesting > 0 quantity but stock is 0
            console.log(`Product ${item.title} is out of stock (requested: ${item.quantity}, available: ${productStatus.stockQuantity})`)
            issues.outOfStock.push({
              ...item,
              availableStock: productStatus.stockQuantity
            })
          } else {
            console.log(`Product ${item.title} is available (stock: ${productStatus.stockQuantity})`)
            issues.available.push(item)
          }
        })

        console.log('Final cart issues:', issues)
        console.log('Out of stock items:', issues.outOfStock.map(item => ({ id: item.id, title: item.title })))
        console.log('Discontinued items:', issues.discontinued.map(item => ({ id: item.id, title: item.title })))
        console.log('Available items:', issues.available.map(item => ({ id: item.id, title: item.title })))
        
        return issues
      }
    } catch (err) {
      console.error('Error checking cart issues:', err)
      
      // Use centralized error handling but don't show toast for this non-critical error
      if (err.response) {
        handleApiResponseError(err.response)
      } else {
        handleApiError(err)
      }
      
      // Ensure cartItems is an array for fallback
      const itemsArray = Array.isArray(cartItems) ? cartItems : Array.from(cartItems || [])
      const validItems = itemsArray.filter(item => item.quantity > 0)
      
      // Fallback: assume all valid items are available
      console.log('Using fallback: assuming all valid items are available')
      return {
        outOfStock: [],
        discontinued: [],
        available: validItems
      }
    }
  }
  
  // Manual refresh of cart issues (only called during checkout)
  const refreshCartIssues = async () => {
    console.log('refreshCartIssues called with cartItems:', cartItems.value)
    
    // Only refresh when explicitly called during checkout, not during normal cart operations
    if (currentStep.value !== 'cart') {
      console.log('Skipping refreshCartIssues - currently in checkout flow step:', currentStep.value)
      return cartIssues.value
    }
    
    if (cartItems.value && cartItems.value.length > 0) {
      try {
        console.log('Manually refreshing cart issues during checkout...')
        const issues = await checkCartIssues(cartItems.value)
        console.log('Issues returned from checkCartIssues:', issues)
        
        // Preserve existing filtered items if they exist
        const existingFiltered = cartIssues.value.filtered || []
        
        // Explicitly update the cartIssues ref
        cartIssues.value = {
          outOfStock: issues.outOfStock || [],
          discontinued: issues.discontinued || [],
          available: issues.available || [],
          lowStock: issues.lowStock || [],
          filtered: existingFiltered // Preserve filtered items
        }
        
        console.log('Cart issues refreshed and updated during checkout:', cartIssues.value)
        return cartIssues.value
      } catch (err) {
        console.error('Error manually refreshing cart issues:', err)
        throw err
      }
    } else {
      console.log('No cart items, resetting cart issues')
      cartIssues.value = {
        outOfStock: [],
        discontinued: [],
        available: [],
        lowStock: [],
        filtered: []
      }
      return cartIssues.value
    }
  }
  
  // Helper function to verify login state with retry
  const verifyLoginState = async (retryCount = 2) => {
    for (let i = 0; i <= retryCount; i++) {
      // Force refresh session to get latest state
      const sessionResult = await checkSession()
      
      if (sessionResult && isLoggedIn.value) {
        console.log(`Login verification successful on attempt ${i + 1}`)
        return true
      }
      
      if (i < retryCount) {
        console.log(`Login verification failed on attempt ${i + 1}, retrying...`)
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    console.log('Login verification failed after all attempts')
    return false
  }

  // Main checkout flow
  const initiateCheckout = async (orderData) => {
    console.log('initiateCheckout called with orderData:', orderData)
    console.log('orderData.items:', orderData?.items)
    console.log('Cart items from useCart:', cartItems.value)
    
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      throw new Error('Giỏ hàng trống')
    }

    // Filter out items with 0 quantity - they shouldn't be processed
    const validItems = orderData.items.filter(item => item.quantity > 0)
    if (validItems.length === 0) {
      throw new Error('Không có sản phẩm hợp lệ trong giỏ hàng (tất cả sản phẩm có số lượng 0)')
    }
    
    console.log('Valid items for checkout (quantity > 0):', validItems)
    console.log('Filtered out items with 0 quantity:', orderData.items.filter(item => item.quantity === 0).map(item => ({ id: item.id, title: item.title, quantity: item.quantity })))

    // Verify login state with retry mechanism
    const isActuallyLoggedIn = await verifyLoginState()
    if (!isActuallyLoggedIn) {
      throw new Error('Vui lòng đăng nhập để tiếp tục thanh toán')
    }

    // Check if user is superuser - they cannot make purchases
    if (user.value?.role === 'superuser') {
      throw new Error('Tài khoản quản trị viên không thể thực hiện mua hàng')
    }
    
    isProcessing.value = true
    currentStep.value = 'processing'
    error.value = null
    
    try {
      // Step 1: Always check for cart issues (availability, discontinued) FIRST
      console.log('Checking cart issues (availability, discontinued) during checkout...')
      
      // Check if there were items filtered out due to 0 quantity FIRST
      const filteredItems = orderData.items.filter(item => item.quantity === 0)
      const hasFilteredItems = filteredItems.length > 0
      
      console.log('Items filtered out due to 0 quantity:', filteredItems)
      console.log('Has filtered items:', hasFilteredItems)
      
      // Check cart issues directly with the valid items from orderData to ensure consistency
      // This is the ONLY time we check stock during normal user flow
      const issues = await checkCartIssuesWithRealTimeValidation(validItems)
      console.log('Cart issues check result during checkout:', issues)
      
      // Update cartIssues with the result AND filtered items
      cartIssues.value = {
        outOfStock: issues.outOfStock || [],
        discontinued: issues.discontinued || [],
        available: issues.available || [],
        lowStock: issues.lowStock || [],
        filtered: filteredItems // Add filtered items to cartIssues
      }
      
      // Debug: Log the current cartIssues state
      console.log('Cart issues after checkout check:', cartIssues.value)
      console.log('Out of stock count:', cartIssues.value.outOfStock.length)
      console.log('Discontinued count:', cartIssues.value.discontinued.length)
      console.log('Available count:', cartIssues.value.available.length)
      console.log('Filtered count:', cartIssues.value.filtered.length)
      console.log('Filtered items in cartIssues:', cartIssues.value.filtered)
      
      // Show cart issues modal if there are ANY issues OR filtered items
      // This ensures users see what happened to their cart before proceeding
      if (cartIssues.value.outOfStock.length > 0 || 
          cartIssues.value.discontinued.length > 0 || 
          hasFilteredItems) {
        console.log('Cart issues or filtered items found, showing issues modal:', cartIssues.value)
        console.log('Modal will show with filtered items:', cartIssues.value.filtered)
        
        // Set modal state first
        currentStep.value = 'issues'
        showCartIssuesModal.value = true
        isProcessing.value = false
        
        // Small delay to ensure reactivity
        await nextTick()
        
        console.log('Modal state set, cartIssues should be reactive now:', cartIssues.value)
        console.log('Final check - filtered items still present:', cartIssues.value.filtered)
        
        return { step: 'issues', data: cartIssues.value }
      }
      
      // Step 2: Only check prescription requirements if no issues and no filtered items
      console.log('No availability issues or filtered items, checking prescription requirements...')
      const prescriptionProducts = checkPrescriptionRequirements(validItems)
      
      if (prescriptionProducts.length > 0) {
        console.log('Prescription required, showing prescription modal:', prescriptionProducts)
        currentStep.value = 'prescription'
        showPrescriptionModal.value = true
        isProcessing.value = false
        return { step: 'prescription', data: prescriptionProducts }
      }
      
      // Step 3: Process order directly if no issues, no filtered items, and no prescription required
      console.log('No issues found, proceeding with order...')
      // Use validItems instead of orderData.items
      const orderDataWithValidItems = {
        ...orderData,
        items: validItems
      }
      return await processOrder(orderDataWithValidItems)
      
    } catch (err) {
      console.error('Checkout initiation error:', err)
      
      // Use centralized error handling
      let errorInfo
      if (err.errorInfo) {
        // Error already processed by makeApiRequest
        errorInfo = err.errorInfo
      } else if (err.response) {
        errorInfo = handleApiResponseError(err.response)
      } else {
        errorInfo = handleApiError(err)
      }
      
      error.value = errorInfo.message || err.message
      isProcessing.value = false
      
      // Enhance error with errorInfo for Cart.vue to handle
      throw { ...err, errorInfo }
    }
  }
  
  // Handle prescription upload completion
  const handlePrescriptionSubmit = async (prescriptionData, orderData) => {
    try {
      isProcessing.value = true
      showPrescriptionModal.value = false
      
      // Store prescription data
      prescriptionData.value = prescriptionData
      
      // Filter out items with 0 quantity
      const validItems = orderData.items.filter(item => item.quantity > 0)
      if (validItems.length === 0) {
        throw new Error('Không có sản phẩm hợp lệ trong giỏ hàng (tất cả sản phẩm có số lượng 0)')
      }
      
      // IMPORTANT: Check for availability issues even after prescription submission
      // This ensures that prescription-required products are also checked for stock/discontinued status
      console.log('Prescription submitted, checking for availability issues...')
      
      // Check cart issues directly with the valid items
      const issues = await checkCartIssuesWithRealTimeValidation(validItems)
      console.log('Cart issues check result after prescription:', issues)
      
      // Update cartIssues with the result
      cartIssues.value = {
        outOfStock: issues.outOfStock || [],
        discontinued: issues.discontinued || [],
        available: issues.available || [],
        lowStock: issues.lowStock || [],
        filtered: issues.filtered || [] // Ensure filtered is also updated
      }
      
      // If there are availability issues, show issues modal
      if (cartIssues.value.outOfStock.length > 0 || cartIssues.value.discontinued.length > 0) {
        console.log('Availability issues found after prescription submission:', cartIssues.value)
        currentStep.value = 'issues'
        showCartIssuesModal.value = true
        isProcessing.value = false
        return { step: 'issues', data: cartIssues.value }
      }
      
      // No availability issues, proceed with order processing
      console.log('No availability issues, proceeding with order processing...')
      const orderDataWithValidItems = {
        ...orderData,
        items: validItems
      }
      return await processOrder(orderDataWithValidItems, prescriptionData)
      
    } catch (error) {
      console.error('Prescription submission error:', error)
      
      // Use centralized error handling
      let errorInfo
      if (error.errorInfo) {
        // Error already processed by makeApiRequest
        errorInfo = error.errorInfo
      } else if (error.response) {
        errorInfo = handleApiResponseError(error.response)
      } else {
        errorInfo = handleApiError(error)
      }
      
      isProcessing.value = false
      
      // Enhance error with errorInfo for Cart.vue to handle
      throw { ...error, errorInfo }
    }
  }
  
  // Handle cart issues resolution
  const handleCartIssuesResolution = async (orderData) => {
    try {
      isProcessing.value = true
      showCartIssuesModal.value = false
      
      // Extract available items from the resolution and filter out 0 quantity items
      const availableItems = orderData.resolution?.availableItems || orderData.items || []
      const validAvailableItems = availableItems.filter(item => item.quantity > 0)
      
      if (validAvailableItems.length > 0) {
        // IMPORTANT: Check for availability issues again with the available items
        // This ensures that even after resolving some issues, we check the remaining items
        console.log('Cart issues resolved, checking availability for remaining items...')
        
        // Create a temporary cart issues check for the available items
        const remainingIssues = await checkCartIssuesWithRealTimeValidation(validAvailableItems)
        
        if (remainingIssues.outOfStock.length > 0 || remainingIssues.discontinued.length > 0) {
          console.log('Additional availability issues found:', remainingIssues)
          // Update cartIssues to show the new issues
          cartIssues.value = remainingIssues
          currentStep.value = 'issues'
          showCartIssuesModal.value = true
          isProcessing.value = false
          return { step: 'issues', data: remainingIssues }
        }
        
        // Check prescription requirements for available items
        const prescriptionProducts = checkPrescriptionRequirements(validAvailableItems)
        
        if (prescriptionProducts.length > 0) {
          console.log('Prescription required for remaining items:', prescriptionProducts)
          currentStep.value = 'prescription'
          showPrescriptionModal.value = true
          isProcessing.value = false
          return { step: 'prescription', data: prescriptionProducts }
        }
        
        // No issues and no prescription required, process order with available items
        console.log('No additional issues, processing order with available items...')
        const orderDataForProcessing = {
          ...orderData,
          items: validAvailableItems
        }
        return await processOrder(orderDataForProcessing)
      } else {
        // No available items, go back to cart
        currentStep.value = 'cart'
        isProcessing.value = false
        return { step: 'cart' }
      }
      
    } catch (error) {
      console.error('Cart issues resolution error:', error)
      
      // Use centralized error handling
      let errorInfo
      if (error.errorInfo) {
        // Error already processed by makeApiRequest
        errorInfo = error.errorInfo
      } else if (error.response) {
        errorInfo = handleApiResponseError(error.response)
      } else {
        errorInfo = handleApiError(error)
      }
      
      isProcessing.value = false
      
      // Enhance error with errorInfo for Cart.vue to handle
      throw { ...error, errorInfo }
    }
  }
  
  // Process the actual order
  const processOrder = async (orderData, prescriptionData = null) => {
    try {
      isProcessing.value = true
      currentStep.value = 'processing'
      error.value = null
      
      console.log('Processing order...', { orderData, prescriptionData })
      
      // Validate required data
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Không có sản phẩm trong đơn hàng')
      }
      
      if (!orderData.customerInfo) {
        throw new Error('Thiếu thông tin khách hàng')
      }
      
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
        shippingMethod: orderData.deliveryInfo?.deliveryMethod || 'standard',
        shippingCost: 0,
        notes: orderData.notes || null,
        prescriptionRequired: prescriptionData ? true : false
      }

      // Khi tạo order từ prescription, chỉ cần thêm prescriptionId
      if (prescriptionData?.prescriptionId) {
        orderPayload.prescriptionId = prescriptionData.prescriptionId
      }

      console.log('Order payload:', orderPayload)

      // Create order via API
      // Backend sẽ tự động liên kết với prescription nếu có prescriptionId
      const response = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      })

      if (response.success) {
        // Prescription was already created in PrescriptionUploadModal
        // The prescription exists independently and will be validated by pharmacists
        console.log('Order created successfully. Prescription ID:', response.data.prescriptionId)

        const result = {
          orderId: response.data.id,
          orderNumber: response.data.id,
          items: orderData.items,
          total: response.data.totalAmount,
          prescriptionId: response.data.prescriptionId, // Frontend biết order này từ prescription nào
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
      
      // Use centralized error handling
      let errorInfo
      if (err.errorInfo) {
        // Error already processed by makeApiRequest
        errorInfo = err.errorInfo
      } else if (err.response) {
        errorInfo = handleApiResponseError(err.response)
      } else {
        errorInfo = handleApiError(err)
      }
      
      error.value = errorInfo.message || err.message
      
      // Enhance error with errorInfo for Cart.vue to handle
      throw { ...err, errorInfo }
    } finally {
      isProcessing.value = false
    }
  }

  // Note: Prescription upload is now handled in PrescriptionUploadModal
  // This function is no longer needed as prescriptions are created independently
  
  // Navigate to order details
  const navigateToOrder = (orderId) => {
    router.push(`/orders/${orderId}`)
  }
  
  // Reset checkout state
  const resetCheckout = () => {
    isProcessing.value = false
    currentStep.value = 'cart'
    prescriptionData.value = null
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

  // Real-time stock availability check (useful for high-demand products)
  const checkRealTimeStock = async (cartItems) => {
    try {
      const validItems = cartItems.filter(item => item.quantity > 0)
      if (validItems.length === 0) return null
      
      console.log('Performing real-time stock check for high-demand products...')
      
      const productIds = validItems.map(item => item.id)
      const response = await apiCall('/products/check-availability', {
        method: 'POST',
        body: JSON.stringify({ productIds })
      })

      if (response.success) {
        const stockWarnings = []
        
        validItems.forEach(item => {
          const productStatus = response.data.find(p => p.id === item.id)
          if (productStatus) {
            // Check if stock has decreased significantly since being added to cart
            if (productStatus.stockQuantity < item.quantity) {
              stockWarnings.push({
                item,
                currentStock: productStatus.stockQuantity,
                requestedQuantity: item.quantity,
                type: 'insufficient_stock'
              })
            } else if (productStatus.stockQuantity <= 2 && item.quantity > 0) {
              // Warn about low stock (2 or fewer items left)
              stockWarnings.push({
                item,
                currentStock: productStatus.stockQuantity,
                requestedQuantity: item.quantity,
                type: 'low_stock'
              })
            }
          }
        })
        
        return stockWarnings
      }
    } catch (err) {
      console.error('Error checking real-time stock:', err)
      return null
    }
  }

  // Enhanced cart issues check with real-time stock validation
  const checkCartIssuesWithRealTimeValidation = async (cartItems) => {
    try {
      // First, check current stock status
      const issues = await checkCartIssues(cartItems)
      
      // Then, perform real-time stock check for additional warnings
      const realTimeWarnings = await checkRealTimeStock(cartItems)
      
      if (realTimeWarnings && realTimeWarnings.length > 0) {
        console.log('Real-time stock warnings found:', realTimeWarnings)
        
        // Add real-time warnings to the issues
        realTimeWarnings.forEach(warning => {
          if (warning.type === 'insufficient_stock') {
            // Update out of stock items with real-time data
            const existingIndex = issues.outOfStock.findIndex(item => item.id === warning.item.id)
            if (existingIndex >= 0) {
              issues.outOfStock[existingIndex].availableStock = warning.currentStock
            } else {
              issues.outOfStock.push({
                ...warning.item,
                availableStock: warning.currentStock
              })
            }
          }
        })
        
        // Add low stock warnings to a new category
        const lowStockItems = realTimeWarnings.filter(w => w.type === 'low_stock')
        if (lowStockItems.length > 0) {
          issues.lowStock = lowStockItems.map(w => ({
            ...w.item,
            currentStock: w.currentStock
          }))
        }
      }
      
      // Ensure all required properties exist
      return {
        outOfStock: issues.outOfStock || [],
        discontinued: issues.discontinued || [],
        available: issues.available || [],
        lowStock: issues.lowStock || [],
        filtered: issues.filtered || []
      }
    } catch (err) {
      console.error('Error in enhanced cart issues check:', err)
      // Fallback to basic check
      const basicIssues = await checkCartIssues(cartItems)
      return {
        outOfStock: basicIssues.outOfStock || [],
        discontinued: basicIssues.discontinued || [],
        available: basicIssues.available || [],
        lowStock: basicIssues.lowStock || [],
        filtered: basicIssues.filtered || []
      }
    }
  }
  
  // Periodic stock check during cart session (optional enhancement)
  const startPeriodicStockCheck = (intervalMs = 30000) => { // Check every 30 seconds
    if (window.stockCheckInterval) {
      clearInterval(window.stockCheckInterval)
    }
    
    window.stockCheckInterval = setInterval(async () => {
      if (cartItems.value && cartItems.value.length > 0 && currentStep.value === 'cart') {
        try {
          console.log('Performing periodic stock check...')
          const warnings = await checkRealTimeStock(cartItems.value)
          
          if (warnings && warnings.length > 0) {
            // Update cartIssues with real-time warnings
            const currentIssues = { ...cartIssues.value }
            
            warnings.forEach(warning => {
              if (warning.type === 'insufficient_stock') {
                // Add to out of stock if not already there
                const existingIndex = currentIssues.outOfStock.findIndex(item => item.id === warning.item.id)
                if (existingIndex < 0) {
                  currentIssues.outOfStock.push({
                    ...warning.item,
                    availableStock: warning.currentStock
                  })
                }
              }
            })
            
            // Only update if there are new issues
            if (warnings.some(w => w.type === 'insufficient_stock')) {
              cartIssues.value = currentIssues
              console.log('Cart issues updated with periodic stock check:', cartIssues.value)
            }
          }
        } catch (err) {
          console.error('Error in periodic stock check:', err)
        }
      }
    }, intervalMs)
    
    return () => {
      if (window.stockCheckInterval) {
        clearInterval(window.stockCheckInterval)
        window.stockCheckInterval = null
      }
    }
  }
  
  const stopPeriodicStockCheck = () => {
    if (window.stockCheckInterval) {
      clearInterval(window.stockCheckInterval)
      window.stockCheckInterval = null
    }
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
    refreshCartIssues,
    formatPrice,
    formatDate,
    startPeriodicStockCheck,
    stopPeriodicStockCheck
  }
}