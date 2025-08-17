import { ref, computed, watch } from 'vue'
import { useAuth } from './useAuth'
import { useToast } from './useToast'
import { useErrorHandler } from './useErrorHandler'

// Global cart state
const cartItems = ref([])
const isCartOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)
const isSyncing = ref(false)
const isOpeningCart = ref(false) // Flag to prevent cart clearing during sidebar opening

// API base URL
const API_BASE_URL = 'http://localhost:3000'

export function useCart() {
  const { isLoggedIn } = useAuth()
  const { showSuccess, showError, showInfo } = useToast()
  const { makeApiRequest } = useErrorHandler()

  // Computed properties
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.priceValue * item.quantity)
    }, 0)
  })

  const formattedTotalPrice = computed(() => {
    return totalPrice.value.toLocaleString('vi-VN') + 'đ'
  })

  // API helper function using standardized error handling
  const apiCall = async (url, options = {}) => {
    return await makeApiRequest(`${API_BASE_URL}${url}`, options)
  }

  // Load cart from backend
  const loadCartFromBackend = async () => {
    if (!isLoggedIn.value) return

    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiCall('/cart')
      
      if (response.success && response.data) {
        cartItems.value = response.data.items || []
      }
    } catch (err) {
      console.error('Error loading cart from backend:', err)
      error.value = err.errorInfo?.message || err.message || 'Lỗi khi tải giỏ hàng'
    } finally {
      isLoading.value = false
    }
  }

  // Sync local cart with backend when user logs in
  const syncCartWithBackend = async () => {
    if (!isLoggedIn.value || isSyncing.value) {
      console.log('Cart: Skipping sync - not logged in or already syncing')
      return
    }

    try {
      isSyncing.value = true
      isLoading.value = true
      error.value = null

      // Get local cart items
      const localCartItems = cartItems.value
      console.log('Cart: Starting sync with', localCartItems.length, 'local items')

      if (localCartItems.length > 0) {
        // Sync with backend
        const response = await apiCall('/cart/sync', {
          method: 'POST',
          body: JSON.stringify({ localCartItems })
        })

        if (response.success && response.data) {
          cartItems.value = response.data.items || []
          console.log('Cart: Sync successful, received', cartItems.value.length, 'items from backend')
          // Sync is internal operation, no need to show toast to user
        }
      } else {
        // Just load from backend
        console.log('Cart: No local items, loading from backend')
        await loadCartFromBackend()
      }
    } catch (err) {
      console.error('Error syncing cart with backend:', err)
      error.value = err.errorInfo?.message || err.message || 'Lỗi khi đồng bộ giỏ hàng'
    } finally {
      isLoading.value = false
      isSyncing.value = false
      console.log('Cart: Sync completed')
    }
  }

  // Cart actions
  const addToCart = async (product, quantity = 1) => {
    try {
      isLoading.value = true
      error.value = null

      if (isLoggedIn.value) {
        // Add to backend cart
        const response = await apiCall('/cart/add', {
          method: 'POST',
          body: JSON.stringify({
            productId: product.id,
            quantity: quantity
          })
        })

        if (response.success && response.data) {
          cartItems.value = response.data.cart.items || []
          showSuccess(`Đã thêm "${product.title}" vào giỏ hàng`)
          triggerItemAnimation(product.id, 'add')
        }
      } else {
        // Add to local cart
        const existingItem = cartItems.value.find(item => item.id === product.id)
        
        if (existingItem) {
          existingItem.quantity += quantity
          triggerItemAnimation(product.id, 'increase')
        } else {
          cartItems.value.push({
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
          })
          triggerItemAnimation(product.id, 'add')
        }
        
        // Save to localStorage
        saveCartToStorage()
        showSuccess(`Đã thêm "${product.title}" vào giỏ hàng`)
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      const errorMessage = err.errorInfo?.message || err.message || 'Lỗi không xác định'
      error.value = errorMessage
      
      // Show error feedback
      showError(`Lỗi khi thêm "${product.title}": ${errorMessage}`)
      
      // Fallback to local storage
      if (isLoggedIn.value) {
        try {
          const existingItem = cartItems.value.find(item => item.id === product.id)
          
          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            cartItems.value.push({
              ...product,
              quantity: quantity,
              addedAt: new Date().toISOString()
            })
          }
          
          saveCartToStorage()
          showSuccess(`Đã thêm "${product.title}" vào giỏ hàng`)
        } catch (fallbackErr) {
          console.error('Fallback error:', fallbackErr)
          showError('Không thể thêm sản phẩm vào giỏ hàng')
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const removeFromCart = async (productId) => {
    try {
      isLoading.value = true
      error.value = null

      if (isLoggedIn.value) {
        // Remove from backend cart
        const response = await apiCall(`/cart/items/${productId}`, {
          method: 'DELETE'
        })

        if (response.success && response.data) {
          cartItems.value = response.data.cart.items || []
          showSuccess(`Đã xóa "${response.data.removedItem?.title || 'Sản phẩm'}" khỏi giỏ hàng`)
        }
      } else {
        // Remove from local cart
        const index = cartItems.value.findIndex(item => item.id === productId)
        if (index > -1) {
          const removedItem = cartItems.value[index]
          cartItems.value.splice(index, 1)
          saveCartToStorage()
          showSuccess(`Đã xóa "${removedItem.title}" khỏi giỏ hàng`)
        }
      }
    } catch (err) {
      console.error('Error removing from cart:', err)
      const errorMessage = err.errorInfo?.message || err.message || 'Lỗi không xác định'
      error.value = errorMessage
      
      // Show error feedback
      showError(`Lỗi khi xóa sản phẩm: ${errorMessage}`)
      
      // Fallback to local removal
      try {
        const index = cartItems.value.findIndex(item => item.id === productId)
        if (index > -1) {
          const removedItem = cartItems.value[index]
          cartItems.value.splice(index, 1)
          saveCartToStorage()
          showSuccess(`Đã xóa "${removedItem.title}" khỏi giỏ hàng`)
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr)
        showError('Không thể xóa sản phẩm khỏi giỏ hàng')
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    try {
      isLoading.value = true
      error.value = null

      if (newQuantity <= 0) {
        await removeFromCart(productId)
        return
      }

      if (isLoggedIn.value) {
        // Update in backend cart
        const response = await apiCall(`/cart/items/${productId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity: newQuantity })
        })

        if (response.success && response.data) {
          cartItems.value = response.data.items || []
        }
      } else {
        // Update local cart
        const item = cartItems.value.find(item => item.id === productId)
        if (item) {
          const oldQuantity = item.quantity
          item.quantity = newQuantity
          saveCartToStorage()
          
          // Trigger animation based on quantity change
          if (newQuantity > oldQuantity) {
            triggerItemAnimation(productId, 'increase')
          } else {
            triggerItemAnimation(productId, 'decrease')
          }
        }
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
      const errorMessage = err.errorInfo?.message || err.message || 'Lỗi không xác định'
      error.value = errorMessage
      
      // Show error feedback
      showError(`Lỗi khi cập nhật số lượng: ${errorMessage}`)
      
      // Fallback to local update
      try {
        const item = cartItems.value.find(item => item.id === productId)
        if (item) {
          item.quantity = newQuantity
          saveCartToStorage()
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr)
        showError('Không thể cập nhật số lượng sản phẩm')
      }
    } finally {
      isLoading.value = false
    }
  }

  const increaseQuantity = async (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      await updateQuantity(productId, item.quantity + 1)
      triggerItemAnimation(productId, 'increase')
    }
  }

  const decreaseQuantity = async (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        await updateQuantity(productId, item.quantity - 1)
        triggerItemAnimation(productId, 'decrease')
      } else {
        await removeFromCart(productId)
      }
    }
  }

  const clearCart = async () => {
    try {
      isLoading.value = true
      error.value = null

      if (isLoggedIn.value) {
        // Clear backend cart
        const response = await apiCall('/cart', {
          method: 'DELETE'
        })

        if (response.success) {
          cartItems.value = []
          showSuccess('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
        }
      } else {
        // Clear local cart
        cartItems.value = []
        saveCartToStorage()
        showSuccess('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
      }
    } catch (err) {
      console.error('Error clearing cart:', err)
      const errorMessage = err.errorInfo?.message || err.message || 'Lỗi không xác định'
      error.value = errorMessage
      
      // Fallback to local clear
      cartItems.value = []
      saveCartToStorage()
      showSuccess('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
    } finally {
      isLoading.value = false
    }
  }

  const getItemQuantity = (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const isInCart = (productId) => {
    return cartItems.value.some(item => item.id === productId)
  }

  // Cart UI actions
  const openCart = () => {
    isOpeningCart.value = true
    isCartOpen.value = true
    // Clear the flag after a short delay
    setTimeout(() => {
      isOpeningCart.value = false
    }, 500)
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    console.log('Cart: Toggle cart called, current state:', isCartOpen.value, 'items:', cartItems.value.length)
    if (!isCartOpen.value) {
      openCart()
    } else {
      closeCart()
    }
  }

  // Animation and feedback
  const animationTriggers = ref({})
  
  const triggerItemAnimation = (productId, type) => {
    const key = `${productId}-${type}-${Date.now()}`
    animationTriggers.value[key] = {
      productId,
      type,
      timestamp: Date.now()
    }
    
    // Clean up old triggers after animation duration
    setTimeout(() => {
      delete animationTriggers.value[key]
    }, 1000)
  }



  // Storage functions
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Only update cart if we're not currently opening it and if the parsed cart is valid
        if (!isOpeningCart.value && Array.isArray(parsedCart)) {
          cartItems.value = parsedCart
          console.log('Cart: Loaded from localStorage:', parsedCart.length, 'items')
        }
      } else if (!isOpeningCart.value) {
        // Only clear cart if we're not opening it
        cartItems.value = []
        console.log('Cart: No saved cart found in localStorage')
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      if (!isOpeningCart.value) {
        cartItems.value = []
      }
    }
  }

  // Initialize cart from storage
  if (typeof window !== 'undefined') {
    loadCartFromStorage()
  }

  // Watch for cart changes and save to storage (only for local cart)
  watch(cartItems, () => {
    if (!isLoggedIn.value) {
      saveCartToStorage()
    }
  }, { deep: true })

  // Watch for login state changes (with debounce to prevent multiple syncs)
  let syncTimeout = null
  let lastLoginState = isLoggedIn.value
  
  watch(isLoggedIn, async (newValue, oldValue) => {
    // Add additional check to prevent race conditions during session checks
    // Only act on "real" login state changes, not temporary fluctuations
    if (newValue === lastLoginState) {
      return // No real change, ignore
    }
    
    if (newValue && !oldValue) {
      // User just logged in, sync cart (debounced)
      console.log('Cart: User logged in, syncing cart with backend')
      if (syncTimeout) clearTimeout(syncTimeout)
      syncTimeout = setTimeout(async () => {
        await syncCartWithBackend()
        lastLoginState = newValue
      }, 200) // Increased debounce to 200ms
    } else if (!newValue && oldValue) {
      // User just logged out, load from localStorage
      // But only if this is a real logout, not a temporary session check issue
      console.log('Cart: User logged out, loading cart from localStorage')
      if (syncTimeout) clearTimeout(syncTimeout)
      
      // Add a small delay to ensure this isn't just a temporary auth state fluctuation
      // Also check if we're currently opening the cart to avoid clearing it
      syncTimeout = setTimeout(() => {
        if (!isLoggedIn.value && !isOpeningCart.value) { // Double-check both login state and cart opening state
          loadCartFromStorage()
          lastLoginState = newValue
        }
      }, 300) // Wait 300ms before clearing cart
    }
  })

  return {
    // State
    cartItems,
    isCartOpen: computed(() => isCartOpen.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    totalItems,
    totalPrice,
    formattedTotalPrice,
    animationTriggers: computed(() => animationTriggers.value),
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    
    // UI Actions
    openCart,
    closeCart,
    toggleCart,
    
    // Backend sync
    loadCartFromBackend,
    syncCartWithBackend,
    
    // Utils
    loadCartFromStorage,
    saveCartToStorage
  }
}