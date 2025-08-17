<template>
  <!-- Desktop Row -->
  <div v-if="!isMobile" class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
    <!-- Order Info -->
    <div class="col-span-3">
      <div class="flex items-start space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
          {{ order.orderNumber.slice(-3) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 truncate">#{{ order.orderNumber }}</div>
          <div class="text-sm text-gray-600">{{ formatDate(order.date) }}</div>
          <div class="text-sm text-gray-500">{{ order.customerInfo.name }}</div>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="col-span-2 flex items-center">
      <StatusBadge :status="order.status" />
    </div>

    <!-- Prescription Status -->
    <div class="col-span-1 flex items-center justify-center">
      <div v-if="order.prescriptionId" class="flex flex-col items-center space-y-1">
        <!-- Has Prescription -->
        <div class="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
          <i class="fas fa-prescription-bottle-alt text-blue-600"></i>
          <span>Có đơn thuốc</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">ID: {{ order.prescriptionId }}</div>
      </div>
      <div v-else class="text-center text-gray-400">
        <div class="flex flex-col items-center space-y-1">
          <i class="fas fa-minus text-xs"></i>
          <span class="text-xs">Không có</span>
        </div>
      </div>
    </div>

    <!-- Delivery Type -->
    <div class="col-span-2 flex items-center">
      <div class="flex items-center space-x-2">
        <i :class="getDeliveryIcon(order.deliveryType)" class="text-gray-500"></i>
        <span class="text-sm text-gray-700 capitalize">{{ getDeliveryTypeName(order.deliveryType) }}</span>
      </div>
    </div>

    <!-- Total Amount -->
    <div class="col-span-2 flex items-center">
      <div class="text-right">
        <div class="font-semibold text-gray-900">{{ formatCurrency(order.pricing.total) }}</div>
        <div class="text-sm text-gray-500">{{ order.items.length }} sản phẩm</div>
      </div>
    </div>

    <!-- Customer Phone -->
    <div class="col-span-1 flex items-center">
      <div class="text-sm text-gray-700">{{ order.customerInfo.phone }}</div>
    </div>

    <!-- Actions -->
    <div class="col-span-1 flex items-center justify-center space-x-1">
      <button
        @click="$emit('view-details', order)"
        class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
        title="Xem chi tiết"
      >
        <i class="fas fa-eye text-xs"></i>
      </button>
      
      <button
        v-if="hasPrescription"
        @click="$emit('validate-prescription', order)"
        class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
        title="Xác thực đơn thuốc"
      >
        <i class="fas fa-prescription-bottle-alt text-xs"></i>
      </button>
      
      <button
        v-if="canChangeStatus"
        @click="$emit('change-status', order)"
        class="w-7 h-7 flex items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
        title="Thay đổi trạng thái"
      >
        <i class="fas fa-edit text-xs"></i>
      </button>
      
      <button
        v-if="canCancel"
        @click="$emit('cancel-order', order)"
        class="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors duration-200"
        title="Hủy đơn hàng"
      >
        <i class="fas fa-times text-xs"></i>
      </button>
    </div>
  </div>

  <!-- Mobile Card -->
  <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            {{ order.orderNumber.slice(-3) }}
          </div>
          <div>
            <div class="font-semibold text-gray-900">#{{ order.orderNumber }}</div>
            <div class="text-sm text-gray-600">{{ formatDate(order.date) }}</div>
          </div>
        </div>
        <StatusBadge :status="order.status" />
      </div>

      <!-- Customer Info -->
      <div class="space-y-2 mb-4">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Khách hàng:</span>
          <span class="text-sm font-medium text-gray-900">{{ order.customerInfo.name }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Số điện thoại:</span>
          <span class="text-sm text-gray-700">{{ order.customerInfo.phone }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Giao hàng:</span>
          <div class="flex items-center space-x-1">
            <i :class="getDeliveryIcon(order.deliveryType)" class="text-gray-500 text-xs"></i>
            <span class="text-sm text-gray-700">{{ getDeliveryTypeName(order.deliveryType) }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Tổng tiền:</span>
          <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(order.pricing.total) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Số sản phẩm:</span>
          <span class="text-sm text-gray-700">{{ order.items.length }} sản phẩm</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Đơn thuốc:</span>
          <div v-if="order.prescriptionId" class="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            <i class="fas fa-prescription-bottle-alt text-blue-600"></i>
            <span>Có đơn thuốc</span>
          </div>
          <div v-else class="text-gray-400 text-xs">
            Không có
          </div>
        </div>
      </div>

      <!-- Additional Fields Slot -->
      <slot name="additional-fields" :order="order"></slot>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 pt-3 border-t border-gray-100">
        <button
          @click="$emit('view-details', order)"
          class="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
        >
          <i class="fas fa-eye text-xs"></i>
          <span>Chi tiết</span>
        </button>
        
        <button
          v-if="hasPrescription"
          @click="$emit('validate-prescription', order)"
          class="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1"
        >
          <i class="fas fa-prescription-bottle-alt text-xs"></i>
          <span>Đơn thuốc</span>
        </button>
        
        <button
          v-if="canChangeStatus"
          @click="$emit('change-status', order)"
          class="px-3 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200 flex items-center space-x-1"
        >
          <i class="fas fa-edit text-xs"></i>
          <span>Cập nhật</span>
        </button>
        
        <button
          v-if="canCancel"
          @click="$emit('cancel-order', order)"
          class="px-3 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors duration-200 flex items-center space-x-1"
        >
          <i class="fas fa-times text-xs"></i>
          <span>Hủy</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view-details', 'change-status', 'cancel-order', 'validate-prescription'])

// Computed properties
const canChangeStatus = computed(() => {
      return ['pending', 'confirmed', 'processing', 'shipped'].includes(props.order.status)
})

const canCancel = computed(() => {
  return ['pending', 'confirmed', 'processing'].includes(props.order.status)
})

const hasPrescription = computed(() => {
  return props.order.prescriptionId !== null && props.order.prescriptionId !== undefined
})

// Helper functions
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

function getDeliveryIcon(deliveryType) {
  const icons = {
    grab: 'fas fa-motorcycle',
    store: 'fas fa-store',
    standard: 'fas fa-truck',
    express: 'fas fa-shipping-fast'
  }
  return icons[deliveryType] || 'fas fa-truck'
}

function getDeliveryTypeName(deliveryType) {
  const names = {
    grab: 'Grab',
    store: 'Tại cửa hàng',
    standard: 'Giao hàng tiêu chuẩn',
    express: 'Giao hàng nhanh'
  }
  return names[deliveryType] || deliveryType
}
</script>