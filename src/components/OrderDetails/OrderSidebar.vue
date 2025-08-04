<template>
  <div class="space-y-6">


    <!-- Order Actions -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i class="fas fa-cog text-blue-600 mr-3"></i>
        Thao tác đơn hàng
      </h3>

      <div class="space-y-3">


        <!-- Cancel Order Button -->
        <button 
          v-if="canCancelOrder"
          @click="$emit('cancel-order')"
          class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <i class="fas fa-times"></i>
          <span>Hủy đơn hàng</span>
        </button>

        <!-- Contact Support -->
        <button 
          @click="$emit('contact-support')"
          class="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
        >
          <i class="fas fa-headset"></i>
          <span>Liên hệ hỗ trợ</span>
        </button>

        <!-- Reorder Button -->
        <button 
          v-if="order.status === 'delivered'"
          @click="reorder"
          class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <i class="fas fa-redo"></i>
          <span>Đặt lại đơn hàng</span>
        </button>
      </div>
    </div>

    <!-- Delivery Tracking -->
    <div v-if="order.status === 'shipping'" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i class="fas fa-map-marker-alt text-green-600 mr-3"></i>
        Theo dõi giao hàng
      </h3>

      <div class="space-y-4">
        <!-- Delivery Status -->
        <div class="p-4 bg-green-50 rounded-xl border border-green-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-truck text-green-600"></i>
            </div>
            <div>
              <div class="font-medium text-green-800">Đang giao hàng</div>
              <div class="text-sm text-green-600">Dự kiến {{ order.estimatedDelivery.timeRange }}</div>
            </div>
          </div>
        </div>

        <!-- Track Button -->
        <button 
          @click="trackDelivery"
          class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <i class="fas fa-route"></i>
          <span>Theo dõi trên bản đồ</span>
        </button>
      </div>
    </div>

    <!-- Promotion Banner -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <div class="text-center space-y-3">
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-gift text-2xl"></i>
        </div>
        <h4 class="font-semibold">FREESHIP NHẬN THUỐC ĐÚNG TỎA</h4>
        <p class="text-sm text-blue-100">GIAO HÀNG TẬN NHÀ TRONG GIỜ!</p>
        <button class="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel-order', 'contact-support'])

// Computed properties
const canCancelOrder = computed(() => {
  return ['pending', 'confirmed', 'processing'].includes(props.order.status)
})

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function reorder() {
  // Add items to cart and redirect to cart
  console.log('Reordering items:', props.order.items)
  // In real app: addToCart(order.items) then router.push('/cart')
}

function trackDelivery() {
  // Open delivery tracking map
  console.log('Opening delivery tracking for order:', props.order.id)
  // In real app: open tracking modal or redirect to tracking page
}
</script>