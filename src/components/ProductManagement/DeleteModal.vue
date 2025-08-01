<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Xác nhận xóa</h2>
            <p class="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex items-start gap-4 mb-6">
          <img 
            :src="product?.image || '/img/products/placeholder-product.jpg'" 
            :alt="product?.title"
            class="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            @error="handleImageError"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">{{ product?.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ product?.manufacturer }}</p>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-blue-600">{{ product?.price }}</span>
              <span class="text-sm text-gray-500">/ {{ product?.unit }}</span>
            </div>
          </div>
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

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button 
          @click="$emit('close')"
          class="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
        >
          Hủy bỏ
        </button>
        <button 
          @click="handleDelete"
          :disabled="isDeleting"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="isDeleting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ isDeleting ? 'Đang xóa...' : 'Xóa sản phẩm' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const isDeleting = ref(false)

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}

const handleDelete = async () => {
  if (isDeleting.value) return

  isDeleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('confirm')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Có lỗi xảy ra khi xóa sản phẩm')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom animations */
@keyframes pulse-warning {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-warning {
  animation: pulse-warning 2s infinite;
}
</style> 