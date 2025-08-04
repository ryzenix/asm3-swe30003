<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <i class="fas fa-times-circle text-white text-sm"></i>
            </div>
            <h3 class="text-lg font-semibold text-white">Hủy đơn hàng</h3>
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
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Tổng tiền:</span>
            <span class="font-semibold text-gray-900">{{ formatCurrency(order?.pricing?.total) }}</span>
          </div>
        </div>

        <!-- Warning -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3">
            <i class="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
            <div>
              <h4 class="font-medium text-yellow-800 mb-1">Xác nhận hủy đơn hàng</h4>
              <p class="text-sm text-yellow-700">
                Việc hủy đơn hàng không thể hoàn tác. Vui lòng chọn lý do hủy và xác nhận.
              </p>
            </div>
          </div>
        </div>

        <!-- Cancel Reason -->
        <div class="space-y-4 mb-6">
          <label class="block text-sm font-medium text-gray-700">Lý do hủy đơn hàng</label>
          <div class="space-y-2">
            <div 
              v-for="reason in cancelReasons" 
              :key="reason.value"
              class="flex items-center"
            >
              <input
                :id="`reason-${reason.value}`"
                v-model="selectedReason"
                :value="reason.value"
                type="radio"
                class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <label 
                :for="`reason-${reason.value}`"
                class="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {{ reason.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Custom Reason -->
        <div v-if="selectedReason === 'other'" class="space-y-2 mb-6">
          <label for="custom-reason" class="block text-sm font-medium text-gray-700">
            Lý do khác
          </label>
          <textarea
            id="custom-reason"
            v-model="customReason"
            rows="3"
            placeholder="Nhập lý do hủy đơn hàng..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
          ></textarea>
        </div>

        <!-- Additional Note -->
        <div class="space-y-2 mb-6">
          <label for="cancel-note" class="block text-sm font-medium text-gray-700">
            Ghi chú thêm (tùy chọn)
          </label>
          <textarea
            id="cancel-note"
            v-model="note"
            rows="2"
            placeholder="Ghi chú thêm về việc hủy đơn hàng..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
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
          Hủy bỏ
        </button>
        <button
          @click="handleConfirm"
          :disabled="!isFormValid || saving"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-times-circle"></i>
          <span>{{ saving ? 'Đang hủy...' : 'Xác nhận hủy' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
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
const selectedReason = ref('')
const customReason = ref('')
const note = ref('')

// Cancel reasons
const cancelReasons = [
  { value: 'out_of_stock', label: 'Hết hàng' },
  { value: 'customer_request', label: 'Khách hàng yêu cầu hủy' },
  { value: 'payment_failed', label: 'Thanh toán thất bại' },
  { value: 'address_issue', label: 'Vấn đề về địa chỉ giao hàng' },
  { value: 'pharmacy_issue', label: 'Vấn đề từ phía nhà thuốc' },
  { value: 'system_error', label: 'Lỗi hệ thống' },
  { value: 'other', label: 'Lý do khác' }
]

// Computed properties
const isFormValid = computed(() => {
  if (!selectedReason.value) return false
  if (selectedReason.value === 'other' && !customReason.value.trim()) return false
  return true
})

// Methods
function handleConfirm() {
  if (!isFormValid.value) return
  
  const reason = selectedReason.value === 'other' 
    ? customReason.value.trim()
    : cancelReasons.find(r => r.value === selectedReason.value)?.label
  
  const cancelData = {
    reason,
    note: note.value.trim()
  }
  
  emit('confirm', cancelData)
}

function formatCurrency(amount) {
  if (!amount) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    selectedReason.value = ''
    customReason.value = ''
    note.value = ''
  }
})
</script>