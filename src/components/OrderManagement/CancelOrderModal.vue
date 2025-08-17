<template>
  <!-- Modal Backdrop with Blur -->
  <Transition name="modal-backdrop">
    <div 
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <!-- Modal Container -->
      <Transition name="modal-content">
        <div 
          v-if="show"
          class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transform"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-user-shield text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Hủy đơn hàng (Admin)</h3>
                  <p class="text-red-100 text-sm">Xác nhận hủy đơn hàng từ phía quản lý</p>
                </div>
              </div>
              <button 
                @click="$emit('close')"
                :disabled="saving"
                class="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <!-- Admin Warning Message -->
            <div class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-user-shield text-red-600 text-sm"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-red-800 mb-2">Xác nhận hủy đơn hàng (Quản lý)</h4>
                  <p class="text-sm text-red-700 leading-relaxed">
                    Bạn đang thực hiện hủy đơn hàng <strong class="font-semibold">#{{ order?.orderNumber || order?.id }}</strong> 
                    từ phía quản lý. Hành động này sẽ thông báo cho khách hàng và không thể hoàn tác.
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h5 class="font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-receipt text-gray-600 mr-2"></i>
                Thông tin đơn hàng
              </h5>
              <div class="grid grid-cols-1 gap-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span class="text-sm text-gray-600 font-medium">Mã đơn hàng:</span>
                  <span class="text-sm font-semibold text-gray-900">#{{ order?.orderNumber || order?.id }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span class="text-sm text-gray-600 font-medium">Khách hàng:</span>
                  <span class="text-sm font-semibold text-gray-900">{{ order?.customerInfo?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span class="text-sm text-gray-600 font-medium">SĐT:</span>
                  <span class="text-sm font-semibold text-gray-900">{{ order?.customerInfo?.phone || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span class="text-sm text-gray-600 font-medium">Ngày đặt:</span>
                  <span class="text-sm font-semibold text-gray-900">{{ formatDate(order?.date || order?.createdAt) }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span class="text-sm text-gray-600 font-medium">Tổng tiền:</span>
                  <span class="text-sm font-bold text-blue-600">{{ formatPrice(order?.pricing?.total || order?.totalAmount || 0) }}đ</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600 font-medium">Số sản phẩm:</span>
                  <span class="text-sm font-semibold text-gray-900">{{ order?.items?.length || order?.itemCount || 0 }} sản phẩm</span>
                </div>
              </div>
            </div>

            <!-- Cancellation Reason -->
            <div class="space-y-4">
              <label class="text-sm font-semibold text-gray-800 flex items-center">
                <i class="fas fa-clipboard-list text-gray-600 mr-2"></i>
                Lý do hủy đơn hàng (Admin) <span class="text-red-500 ml-1">*</span>
              </label>
              
              <div class="space-y-3">
                <div 
                  v-for="reason in cancelReasons" 
                  :key="reason.value"
                  class="relative"
                >
                  <input 
                    v-model="selectedReason"
                    :value="reason.value"
                    :disabled="saving"
                    type="radio"
                    :id="reason.value"
                    class="sr-only"
                  >
                  <label 
                    :for="reason.value"
                    :class="[
                      'flex items-center p-4 rounded-xl border transition-all duration-200',
                      saving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-sm',
                      selectedReason === reason.value 
                        ? 'border-red-500 bg-red-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    <div 
                      :class="[
                        'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200',
                        selectedReason === reason.value 
                          ? 'border-red-500 bg-red-500' 
                          : 'border-gray-300'
                      ]"
                    >
                      <div 
                        v-if="selectedReason === reason.value"
                        class="w-2 h-2 bg-white rounded-full"
                      ></div>
                    </div>
                    <div class="flex-1">
                      <span :class="[
                        'text-sm font-medium',
                        selectedReason === reason.value ? 'text-red-800' : 'text-gray-800'
                      ]">{{ reason.text }}</span>
                      <p v-if="reason.description" :class="[
                        'text-xs mt-1',
                        selectedReason === reason.value ? 'text-red-600' : 'text-gray-500'
                      ]">{{ reason.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Custom Reason -->
            <Transition name="slide-down">
              <div v-if="selectedReason === 'other'" class="space-y-3">
                <label class="text-sm font-semibold text-gray-800 flex items-center">
                  <i class="fas fa-edit text-gray-600 mr-2"></i>
                  Lý do khác <span class="text-red-500 ml-1">*</span>
                </label>
                <textarea 
                  v-model="customReason"
                  :disabled="saving"
                  placeholder="Vui lòng mô tả chi tiết lý do hủy đơn hàng từ phía quản lý..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows="4"
                ></textarea>
                <div v-if="selectedReason === 'other' && customReason.trim().length === 0" class="text-xs text-red-600 mt-1">
                  <i class="fas fa-exclamation-circle mr-1"></i>
                  Vui lòng nhập lý do hủy đơn hàng
                </div>
              </div>
            </Transition>

            <!-- Additional Note -->
            <div class="space-y-3">
              <label class="text-sm font-semibold text-gray-800 flex items-center">
                <i class="fas fa-sticky-note text-gray-600 mr-2"></i>
                Ghi chú thêm cho khách hàng (tùy chọn)
              </label>
              <textarea 
                v-model="note"
                :disabled="saving"
                placeholder="Ghi chú sẽ được gửi đến khách hàng cùng thông báo hủy đơn hàng..."
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                rows="3"
              ></textarea>
            </div>

            <!-- Error Message -->
            <Transition name="slide-down">
              <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
                <div class="flex items-center space-x-3">
                  <i class="fas fa-exclamation-circle text-red-600"></i>
                  <p class="text-sm text-red-700 font-medium">{{ error }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                @click="$emit('close')"
                :disabled="saving"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <i class="fas fa-arrow-left"></i>
                <span>Giữ đơn hàng</span>
              </button>
              <button 
                @click="handleConfirm"
                :disabled="!isFormValid || saving"
                :class="[
                  'px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 min-w-[140px]',
                  isFormValid && !saving
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <i v-if="saving" class="fas fa-spinner animate-spin"></i>
                <i v-else class="fas fa-user-shield"></i>
                <span>{{ saving ? 'Đang hủy...' : 'Xác nhận hủy (Admin)' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
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

// Admin/Pharmacist specific cancel reasons
const cancelReasons = [
  { 
    value: 'out_of_stock', 
    text: 'Hết hàng', 
    description: 'Sản phẩm tạm thời hết hàng hoặc không có sẵn' 
  },
  { 
    value: 'prescription_invalid', 
    text: 'Đơn thuốc không hợp lệ', 
    description: 'Đơn thuốc hết hạn, không đúng định dạng hoặc thiếu thông tin' 
  },
  { 
    value: 'customer_request', 
    text: 'Khách hàng yêu cầu hủy', 
    description: 'Khách hàng liên hệ trực tiếp để hủy đơn hàng' 
  },
  { 
    value: 'payment_failed', 
    text: 'Thanh toán thất bại', 
    description: 'Không thể xử lý thanh toán hoặc thẻ bị từ chối' 
  },
  { 
    value: 'address_unreachable', 
    text: 'Không thể giao đến địa chỉ', 
    description: 'Địa chỉ không chính xác hoặc nằm ngoài vùng giao hàng' 
  },
  { 
    value: 'quality_issue', 
    text: 'Vấn đề chất lượng sản phẩm', 
    description: 'Phát hiện sản phẩm có vấn đề về chất lượng hoặc hạn sử dụng' 
  },
  { 
    value: 'pharmacy_closure', 
    text: 'Nhà thuốc tạm đóng cửa', 
    description: 'Nhà thuốc phụ trách không thể xử lý đơn hàng' 
  },
  { 
    value: 'system_error', 
    text: 'Lỗi hệ thống', 
    description: 'Lỗi kỹ thuật trong quá trình xử lý đơn hàng' 
  },
  { 
    value: 'regulatory_issue', 
    text: 'Vấn đề quy định pháp lý', 
    description: 'Đơn hàng vi phạm quy định về thuốc hoặc dược phẩm' 
  },
  { 
    value: 'other', 
    text: 'Lý do khác', 
    description: 'Vui lòng mô tả chi tiết lý do hủy đơn hàng' 
  }
]

// Computed properties
const isFormValid = computed(() => {
  if (!selectedReason.value) return false
  if (selectedReason.value === 'other') {
    return customReason.value.trim().length > 0
  }
  return true
})

const finalReason = computed(() => {
  const noteText = note.value && note.value.trim().length > 0 ? ` - Ghi chú: ${note.value.trim()}` : ''
  if (selectedReason.value === 'other') {
    return customReason.value.trim() + noteText || 'Cancelled by admin' + noteText
  }
  return "Cancelled by admin" + noteText
})

// Methods
function formatPrice(price) {
  if (!price && price !== 0) return '0'
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'N/A'
  }
}

function handleConfirm() {
  if (!isFormValid.value || props.saving) return
  
  const cancelData = {
    reason: finalReason.value,
    reasonCode: selectedReason.value,
    note: note.value.trim(),
    adminAction: true // Flag to indicate this is an admin action
  }
  
  emit('confirm', cancelData)
}

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    // Reset form when modal opens
    selectedReason.value = ''
    customReason.value = ''
    note.value = ''
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
  }
})

watch(() => selectedReason.value, (newValue) => {
  if (newValue !== 'other') {
    customReason.value = ''
  }
})
</script>

<style scoped>
/* Modal backdrop animation */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: all 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-backdrop-enter-to,
.modal-backdrop-leave-from {
  opacity: 1;
  backdrop-filter: blur(4px);
}

/* Modal content animation */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-content-enter-to,
.modal-content-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Slide down animation for conditional content */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

/* Custom scrollbar */
.max-h-\[60vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[60vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[60vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[60vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles */
input[type="radio"]:focus + label {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}

textarea:focus {
  outline: none;
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Admin specific styling */
.admin-modal .bg-red-50 {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.admin-modal .border-red-200 {
  border-color: #fecaca;
}
</style>