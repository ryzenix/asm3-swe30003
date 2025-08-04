<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
    <!-- Order Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Đơn hàng #{{ order.orderNumber }}
          </h3>
          <p class="text-sm text-gray-600">
            <i class="fas fa-calendar-alt mr-2"></i>
            {{ formatDate(order.date) }}
          </p>
        </div>
        <OrderStatusBadge :status="order.status" />
      </div>
    </div>

    <!-- Order Content -->
    <div class="p-6 flex-1">
      <!-- Items Preview -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <i class="fas fa-pills mr-2 text-blue-600"></i>
          Sản phẩm ({{ order.items.length }} món)
        </h4>
        <div class="space-y-2">
          <div 
            v-for="(item, index) in displayItems" 
            :key="item.id"
            class="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-10 h-10 object-cover rounded-lg"
              @error="handleImageError"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-600">SL: {{ item.quantity }}</p>
            </div>
            <div class="text-sm font-semibold text-blue-600">
              {{ formatCurrency(item.price * item.quantity) }}
            </div>
          </div>
          
          <!-- Show more items indicator -->
          <div v-if="order.items.length > maxDisplayItems" class="text-center">
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              +{{ order.items.length - maxDisplayItems }} sản phẩm khác
            </span>
          </div>
        </div>
      </div>

      <!-- Delivery Info -->
      <div class="mb-4 p-3 bg-blue-50 rounded-lg">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <i class="fas fa-truck text-blue-600 mt-1"></i>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 mb-1">
              {{ getDeliveryTypeLabel(order.deliveryType) }}
            </p>
            <p class="text-xs text-gray-600">
              {{ order.estimatedDelivery.timeRange }} {{ order.estimatedDelivery.date }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pricing Summary -->
      <div class="border-t border-gray-100 pt-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Tạm tính:</span>
          <span class="text-sm text-gray-900">{{ formatCurrency(order.pricing.subtotal) }}</span>
        </div>
        <div v-if="order.pricing.shippingFee > 0" class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Phí giao hàng:</span>
          <span class="text-sm text-gray-900">{{ formatCurrency(order.pricing.shippingFee) }}</span>
        </div>
        <div class="flex justify-between items-center font-semibold text-lg border-t border-gray-100 pt-2">
          <span class="text-gray-900">Tổng cộng:</span>
          <span class="text-blue-600">{{ formatCurrency(order.pricing.total) }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 mt-auto">
      <button 
        @click="$emit('view-details', order)"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <i class="fas fa-eye"></i>
        <span>Xem chi tiết</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import OrderStatusBadge from './OrderStatusBadge.vue'

// Props
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['view-details'])

// Constants
const maxDisplayItems = 3

// Computed properties
const displayItems = computed(() => {
  return props.order.items.slice(0, maxDisplayItems)
})

// Methods
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

function getDeliveryTypeLabel(type) {
  const labels = {
    grab: 'Giao hàng Grab',
    standard: 'Giao hàng tiêu chuẩn',
    express: 'Giao hàng nhanh',
    store: 'Nhận tại cửa hàng'
  }
  return labels[type] || 'Giao hàng'
}

function handleImageError(event) {
  event.target.src = '/img/product-placeholder.png'
}
</script>

<style scoped>
/* Custom hover effects */
.hover\:-translate-y-1:hover {
  transform: translateY(-4px);
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Custom scrollbar for items list if needed */
.space-y-2::-webkit-scrollbar {
  width: 4px;
}

.space-y-2::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.space-y-2::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.space-y-2::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>