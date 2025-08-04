<template>
  <div class="cart-item bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <div class="flex items-stretch">
      <!-- Main Item Content -->
      <div class="flex-1 p-3 flex items-start space-x-3">
        <!-- Product Image -->
        <div class="flex-shrink-0">
          <img 
            :src="item.image" 
            :alt="item.title"
            class="w-12 h-12 object-contain rounded border border-gray-200"
            @error="handleImageError"
          />
        </div>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
            {{ item.title }}
          </h4>
          
          <div class="flex items-center justify-between mt-2">
            <span class="text-blue-600 font-semibold text-sm">
              {{ formatPrice(item.priceValue) }}
            </span>
            <div class="flex items-center space-x-2">
              <!-- Quantity Controls -->
              <button 
                @click="handleDecrease"
                :disabled="isUpdating || localQuantity <= 1"
                class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <i class="fas fa-minus text-xs text-gray-600"></i>
              </button>
              
              <span class="w-8 text-center text-sm font-medium text-gray-900">
                {{ localQuantity }}
              </span>
              
              <button 
                @click="handleIncrease"
                :disabled="isUpdating || localQuantity >= item.stockQuantity"
                class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <i class="fas fa-plus text-xs text-gray-600"></i>
              </button>
            </div>
          </div>
          
          <!-- Item Total -->
          <div class="mt-2">
            <span class="text-lg font-bold text-gray-900">
              {{ formatPrice(itemTotal) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Remove Button - Full Height -->
      <button 
        @click="handleRemove"
        :disabled="isUpdating"
        class="w-12 bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center justify-center border-l border-gray-200"
        title="Xóa khỏi giỏ hàng"
      >
        <i class="fas fa-trash text-lg"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isUpdating" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCart } from '../../composables/useCart'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['quantity-changed', 'item-removed'])

const { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart
} = useCart()

// Local state
const localQuantity = ref(props.item.quantity)
const isUpdating = ref(false)

// Computed
const itemTotal = computed(() => {
  return props.item.priceValue * localQuantity.value
})

// Watch for prop changes
watch(() => props.item.quantity, (newQuantity) => {
  localQuantity.value = newQuantity
})

// Methods
const handleIncrease = async () => {
  if (isUpdating.value || localQuantity.value >= props.item.stockQuantity) return
  
  isUpdating.value = true
  try {
    increaseQuantity(props.item.id)
    emit('quantity-changed', { item: props.item, newQuantity: localQuantity.value + 1 })
  } finally {
    isUpdating.value = false
  }
}

const handleDecrease = async () => {
  if (isUpdating.value || localQuantity.value <= 1) return
  
  isUpdating.value = true
  try {
    decreaseQuantity(props.item.id)
    emit('quantity-changed', { item: props.item, newQuantity: localQuantity.value - 1 })
  } finally {
    isUpdating.value = false
  }
}

const handleRemove = async () => {
  if (isUpdating.value) return
  
  isUpdating.value = true
  try {
    removeFromCart(props.item.id)
    emit('item-removed', props.item)
  } finally {
    isUpdating.value = false
  }
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}
</script>

<style scoped>
.cart-item {
  position: relative;
}

/* Line clamp utility for title */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>