import { ref, computed, watch } from 'vue'
import { useAuth } from './useAuth'

// Global cart state
const cartItems = ref([])
const isCartOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)

// API base URL
const API_BASE_URL = 'http://localhost:3000'

export function useCart() {
  const { isLoggedIn } = useAuth()

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
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Sync local cart with backend when user logs in
  const syncCartWithBackend = async () => {
    if (!isLoggedIn.value) return

    try {
      isLoading.value = true
      error.value = null

      // Get local cart items
      const localCartItems = cartItems.value

      if (localCartItems.length > 0) {
        // Sync with backend
        const response = await apiCall('/cart/sync', {
          method: 'POST',
          body: JSON.stringify({ localCartItems })
        })

        if (response.success && response.data) {
          cartItems.value = response.data.items || []
          showCartFeedback('sync', 'Đã đồng bộ giỏ hàng')
        }
      } else {
        // Just load from backend
        await loadCartFromBackend()
      }
    } catch (err) {
      console.error('Error syncing cart with backend:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
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
          showCartFeedback('add', product.title)
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
        showCartFeedback('add', product.title)
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      error.value = err.message
      
      // Fallback to local storage
      if (isLoggedIn.value) {
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
        showCartFeedback('add', product.title)
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
          showCartFeedback('remove', response.data.removedItem?.title || 'Sản phẩm')
        }
      } else {
        // Remove from local cart
        const index = cartItems.value.findIndex(item => item.id === productId)
        if (index > -1) {
          const removedItem = cartItems.value[index]
          cartItems.value.splice(index, 1)
          saveCartToStorage()
          showCartFeedback('remove', removedItem.title)
        }
      }
    } catch (err) {
      console.error('Error removing from cart:', err)
      error.value = err.message
      
      // Fallback to local removal
      const index = cartItems.value.findIndex(item => item.id === productId)
      if (index > -1) {
        const removedItem = cartItems.value[index]
        cartItems.value.splice(index, 1)
        saveCartToStorage()
        showCartFeedback('remove', removedItem.title)
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
      error.value = err.message
      
      // Fallback to local update
      const item = cartItems.value.find(item => item.id === productId)
      if (item) {
        item.quantity = newQuantity
        saveCartToStorage()
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
          showCartFeedback('clear')
        }
      } else {
        // Clear local cart
        cartItems.value = []
        saveCartToStorage()
        showCartFeedback('clear')
      }
    } catch (err) {
      console.error('Error clearing cart:', err)
      error.value = err.message
      
      // Fallback to local clear
      cartItems.value = []
      saveCartToStorage()
      showCartFeedback('clear')
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
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
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

  const feedbackMessages = ref([])
  
  const showCartFeedback = (action, productTitle = '') => {
    const messages = {
      add: `Đã thêm "${productTitle}" vào giỏ hàng`,
      remove: `Đã xóa "${productTitle}" khỏi giỏ hàng`,
      clear: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng'
    }
    
    const message = {
      id: Date.now(),
      text: messages[action] || 'Cập nhật giỏ hàng thành công',
      type: action,
      timestamp: Date.now()
    }
    
    feedbackMessages.value.push(message)
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      const index = feedbackMessages.value.findIndex(m => m.id === message.id)
      if (index > -1) {
        feedbackMessages.value.splice(index, 1)
      }
    }, 3000)
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
        cartItems.value = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      cartItems.value = []
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

  // Watch for login state changes
  watch(isLoggedIn, async (newValue, oldValue) => {
    if (newValue && !oldValue) {
      // User just logged in, sync cart
      await syncCartWithBackend()
    } else if (!newValue && oldValue) {
      // User just logged out, load from localStorage
      loadCartFromStorage()
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
    feedbackMessages: computed(() => feedbackMessages.value),
    
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