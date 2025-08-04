<template>
  <div class="cart-button-container">
    <!-- Add to Cart Button (when not in cart) -->
    <button 
      v-if="!isInCart(product.id)"
      @click="handleAddToCart" 
      :disabled="isLoading || product.stockQuantity === 0" 
      :class="[
        'w-full text-sm py-3 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative',
        product.stockQuantity === 0 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      ]"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span>Đang thêm...</span>
      </div>
      
      <!-- Success State -->
      <div v-else-if="showSuccessAnimation" class="flex items-center space-x-2 text-green-100">
        <i class="fas fa-check"></i>
        <span>Đã thêm!</span>
      </div>
      
      <!-- Default State -->
      <div v-else class="flex items-center">
        <i v-if="product.stockQuantity === 0" class="fas fa-times mr-2"></i>
        <i v-else class="fas fa-cart-plus mr-2"></i>
        {{ product.stockQuantity === 0 ? 'Hết hàng' : 'Chọn mua' }}
      </div>
    </button>

    <!-- Quantity Controls (when in cart) -->
    <div 
      v-else 
      class="quantity-controls bg-white border-2 border-blue-600 rounded-lg p-2 flex items-center justify-between transition-all duration-200"
    >
      <!-- Decrease Button -->
      <button 
        @click="handleDecrease"
        :disabled="isLoading"
        class="quantity-btn w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
      >
        <i class="fas fa-minus text-xs"></i>
      </button>

      <!-- Quantity Display -->
      <div class="quantity-display flex items-center space-x-2 mx-3">
        <span class="quantity-number font-bold text-blue-600 text-lg min-w-[2rem] text-center">
          {{ currentQuantity }}
        </span>
        <span class="text-gray-500 text-xs">{{ product.unit }}</span>
      </div>

      <!-- Increase Button -->
      <button 
        @click="handleIncrease"
        :disabled="isLoading || currentQuantity >= product.stockQuantity"
        class="quantity-btn w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
      >
        <i class="fas fa-plus text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useCart } from '../../composables/useCart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['added-to-cart', 'quantity-changed'])

const { 
  addToCart, 
  increaseQuantity, 
  decreaseQuantity, 
  getItemQuantity, 
  isInCart,
  animationTriggers 
} = useCart()

// Local state
const isLoading = ref(false)
const showSuccessAnimation = ref(false)

// Computed
const currentQuantity = computed(() => getItemQuantity(props.product.id))

// Removed complex animation triggers

// Methods
const handleAddToCart = async () => {
  if (isLoading.value || props.product.stockQuantity === 0) return
  
  isLoading.value = true
  
  try {
    // Simulate API call delay (reduced)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addToCart(props.product, 1)
    
    // Show simple success state
    showSuccessAnimation.value = true
    
    setTimeout(() => {
      showSuccessAnimation.value = false
    }, 800)
    
    emit('added-to-cart', props.product)
    
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    isLoading.value = false
  }
}

const handleIncrease = () => {
  if (isLoading.value || currentQuantity.value >= props.product.stockQuantity) return
  
  increaseQuantity(props.product.id)
  emit('quantity-changed', { product: props.product, quantity: currentQuantity.value + 1 })
}

const handleDecrease = () => {
  if (isLoading.value) return
  
  decreaseQuantity(props.product.id)
  emit('quantity-changed', { product: props.product, quantity: Math.max(0, currentQuantity.value - 1) })
}

// Simplified - no complex animations
</script>

<style scoped>
.cart-button-container {
  position: relative;
}

.quantity-controls {
  min-width: 140px;
}

.quantity-btn {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quantity-btn:hover:not(:disabled) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style>