<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300 relative" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-trash text-xl"></i>
                <div>
                  <h2 class="text-xl font-semibold">Xác nhận xóa sản phẩm</h2>
                  <p class="text-red-100 text-sm mt-1">Hành động này không thể hoàn tác</p>
                </div>
              </div>
              <button
                @click="$emit('close')"
                :disabled="isDeleting"
                :class="[
                  'p-2 rounded-full transition-colors duration-200',
                  isDeleting 
                    ? 'text-white/40 cursor-not-allowed' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                ]"
              >
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Loading overlay -->
          <div v-if="isDeleting" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span class="text-sm text-gray-600 mt-2">Đang xóa sản phẩm...</span>
              <p class="text-xs text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <!-- Error Alert -->
            <div v-if="props.formError" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-red-800 font-medium mb-1">Có lỗi xảy ra</h4>
                  <p class="text-red-700 text-sm">{{ props.formError }}</p>
                  <div v-if="props.fieldErrors.length > 0" class="mt-2">
                    <ul class="text-red-600 text-xs space-y-1">
                      <li v-for="error in props.fieldErrors" :key="error" class="flex items-center">
                        <i class="fas fa-dot-circle mr-2 text-xs"></i>
                        {{ error }}
                      </li>
                    </ul>
                  </div>
                </div>
                <button 
                  @click="emit('clear-errors')"
                  type="button"
                  class="text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>
        <div v-if="product" class="flex items-start gap-4 mb-6">
          <img 
            :src="getProductImage(product) || '/img/products/placeholder-product.jpg'" 
            :alt="product?.title"
            class="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            @error="handleImageError"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">{{ product?.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ product?.manufacturer }}</p>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-blue-600">{{ formatPrice(product?.priceValue || product?.price_value || product?.price) }}</span>
              <span class="text-sm text-gray-500">/ {{ product?.unit }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="flex items-center justify-center p-8 text-gray-500">
          <p>Không có thông tin sản phẩm</p>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800 mb-1">Cảnh báo</p>
              <p class="text-sm text-red-700">
                Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống và không thể khôi phục.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900 mb-2">Thông tin sản phẩm sẽ bị xóa:</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              Thông tin sản phẩm và mô tả
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              Hình ảnh và tài liệu liên quan
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              Lịch sử bán hàng và đánh giá
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              Cấu hình giá và khuyến mãi
            </li>
          </ul>
          </div>

          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <button 
              type="button"
              @click="$emit('close')"
              :disabled="isDeleting"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i class="fas fa-times mr-2"></i>
              Hủy bỏ
            </button>
            <button 
              @click="handleDelete"
              :disabled="isDeleting"
              class="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <i v-if="isDeleting" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-trash mr-2"></i>
              {{ isDeleting ? 'Đang xóa...' : 'Xóa sản phẩm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    required: false,
    default: null
  },
  formError: {
    type: String,
    default: ''
  },
  fieldErrors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'confirm', 'clear-errors'])

const isDeleting = ref(false)

const getProductImage = (product) => {
  if (!product) return '/img/products/placeholder-product.jpg'
  
  // Handle backend response structure
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const mainIndex = product.mainImageIndex || product.main_image_index || 0
    return product.images[mainIndex] || product.images[0]
  }
  // Fallback to single image field
  return product.image || '/img/products/placeholder-product.jpg'
}

const formatPrice = (price) => {
  if (!price && price !== 0) return 'N/A'
  // If price is already formatted (string), return as is
  if (typeof price === 'string' && price.includes('đ')) {
    return price
  }
  // If price is a number, format it
  const numPrice = parseInt(price)
  if (isNaN(numPrice)) return 'N/A'
  return numPrice.toLocaleString('vi-VN') + 'đ'
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}

const handleDelete = async () => {
  if (isDeleting.value) return

  isDeleting.value = true

  try {
    // Clear any previous errors
    emit('clear-errors')
    emit('confirm')
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
/* Modal fade-in and fade-out transition styles */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}

/* Custom scrollbar for modal body */
.max-h-\[70vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[70vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 