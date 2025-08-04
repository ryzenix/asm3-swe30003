import { ref, computed, watch } from 'vue'

// Global cart state
const cartItems = ref([])
const isCartOpen = ref(false)

export function useCart() {
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

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      // Trigger animation for existing item
      triggerItemAnimation(product.id, 'increase')
    } else {
      cartItems.value.push({
        ...product,
        quantity: quantity,
        addedAt: new Date()
      })
      // Trigger animation for new item
      triggerItemAnimation(product.id, 'add')
    }
    
    // Save to localStorage
    saveCartToStorage()
    
    // Show success feedback
    showCartFeedback('add', product.title)
  }

  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index > -1) {
      const removedItem = cartItems.value[index]
      cartItems.value.splice(index, 1)
      saveCartToStorage()
      showCartFeedback('remove', removedItem.title)
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      const oldQuantity = item.quantity
      if (newQuantity <= 0) {
        removeFromCart(productId)
      } else {
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
  }

  const increaseQuantity = (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      item.quantity += 1
      saveCartToStorage()
      triggerItemAnimation(productId, 'increase')
    }
  }

  const decreaseQuantity = (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
        saveCartToStorage()
        triggerItemAnimation(productId, 'decrease')
      } else {
        removeFromCart(productId)
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveCartToStorage()
    showCartFeedback('clear')
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

  // Watch for cart changes and save to storage
  watch(cartItems, saveCartToStorage, { deep: true })

  return {
    // State
    cartItems: computed(() => cartItems.value),
    isCartOpen: computed(() => isCartOpen.value),
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
    
    // Utils
    loadCartFromStorage,
    saveCartToStorage
  }
}