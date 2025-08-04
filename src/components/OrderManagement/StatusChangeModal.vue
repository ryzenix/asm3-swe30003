<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <i class="fas fa-edit text-white text-sm"></i>
            </div>
            <h3 class="text-lg font-semibold text-white">Thay đổi trạng thái đơn hàng</h3>
          </div>
          <button 
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
          >
            <i class="fas fa-times text-white"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Order Info -->
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {{ order?.orderNumber?.slice(-3) }}
            </div>
            <div>
              <div class="font-semibold text-gray-900">#{{ order?.orderNumber }}</div>
              <div class="text-sm text-gray-600">{{ order?.customerInfo?.name }}</div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Trạng thái hiện tại:</span>
            <StatusBadge :status="currentStatus" />
          </div>
        </div>

        <!-- Status Selection -->
        <div class="space-y-4 mb-6">
          <label class="block text-sm font-medium text-gray-700">Trạng thái mới</label>
          <div class="space-y-2">
            <div 
              v-for="status in availableStatuses" 
              :key="status.value"
              class="flex items-center"
            >
              <input
                :id="`status-${status.value}`"
                v-model="selectedStatus"
                :value="status.value"
                type="radio"
                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label 
                :for="`status-${status.value}`"
                class="ml-3 flex items-center space-x-2 cursor-pointer"
              >
                <StatusBadge :status="status.value" />
                <span class="text-sm text-gray-600">{{ status.description }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Note Input -->
        <div class="space-y-2 mb-6">
          <label for="status-note" class="block text-sm font-medium text-gray-700">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            id="status-note"
            v-model="note"
            rows="3"
            placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center space-x-2">
            <i class="fas fa-exclamation-triangle text-red-600"></i>
            <span class="text-sm text-red-700">{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
        >
          Hủy
        </button>
        <button
          @click="handleConfirm"
          :disabled="!selectedStatus || saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          <span>{{ saving ? 'Đang cập nhật...' : 'Xác nhận' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  },
  currentStatus: {
    type: String,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm'])

// Reactive state
const selectedStatus = ref('')
const note = ref('')

// Status flow configuration
const statusFlow = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: [],
  cancelled: []
}

const statusDescriptions = {
  confirmed: 'Xác nhận đơn hàng và bắt đầu xử lý',
  processing: 'Đang chuẩn bị thuốc theo đơn hàng',
  shipping: 'Đơn hàng đang được giao đến khách hàng',
  delivered: 'Đơn hàng đã được giao thành công',
  cancelled: 'Hủy đơn hàng này'
}

// Computed properties
const availableStatuses = computed(() => {
  const nextStatuses = statusFlow[props.currentStatus] || []
  return nextStatuses.map(status => ({
    value: status,
    description: statusDescriptions[status] || ''
  }))
})

// Methods
function handleConfirm() {
  if (!selectedStatus.value) return
  
  const statusData = {
    status: selectedStatus.value,
    note: note.value.trim()
  }
  
  emit('confirm', statusData)
}

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    selectedStatus.value = ''
    note.value = ''
  }
})
</script>