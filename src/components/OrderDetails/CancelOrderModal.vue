<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <i class="fas fa-exclamation-triangle mr-3"></i>
            Hủy đơn hàng
          </h3>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Warning Message -->
        <div class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-red-600 text-sm"></i>
            </div>
            <div>
              <h4 class="font-medium text-red-800 mb-1">Xác nhận hủy đơn hàng</h4>
              <p class="text-sm text-red-700">
                Bạn có chắc chắn muốn hủy đơn hàng <strong>#{{ order.orderNumber }}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h5 class="font-medium text-gray-800 mb-3">Thông tin đơn hàng:</h5>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Mã đơn hàng:</span>
              <span class="font-medium">#{{ order.orderNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày đặt:</span>
              <span class="font-medium">{{ order.date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tổng tiền:</span>
              <span class="font-medium text-blue-600">{{ formatPrice(order.pricing?.total || 0) }}đ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số sản phẩm:</span>
              <span class="font-medium">{{ order.items?.length || 0 }} sản phẩm</span>
            </div>
          </div>
        </div>

        <!-- Cancellation Reason -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Lý do hủy đơn hàng:</label>
          <div class="space-y-2">
            <div 
              v-for="reason in cancellationReasons" 
              :key="reason.value"
              class="relative"
            >
              <input 
                v-model="selectedReason"
                :value="reason.value"
                type="radio"
                :id="reason.value"
                class="sr-only"
              >
              <label 
                :for="reason.value"
                :class="[
                  'flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200',
                  selectedReason === reason.value 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <div 
                  :class="[
                    'w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center',
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
                <span class="text-sm text-gray-800">{{ reason.text }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Custom Reason -->
        <div v-if="selectedReason === 'other'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Lý do khác:</label>
          <textarea 
            v-model="customReason"
            placeholder="Vui lòng mô tả lý do hủy đơn hàng..."
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
        <button 
          @click="$emit('close')"
          class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          Giữ đơn hàng
        </button>
        <button 
          @click="confirmCancel"
          :disabled="!selectedReason || (selectedReason === 'other' && !customReason.trim()) || loading"
          :class="[
            'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2',
            selectedReason && (selectedReason !== 'other' || customReason.trim()) && !loading
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <i v-if="loading" class="fas fa-spinner animate-spin"></i>
          <i v-else class="fas fa-times"></i>
          <span>{{ loading ? 'Đang hủy...' : 'Xác nhận hủy' }}</span>
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
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

// Reactive state
const selectedReason = ref('')
const customReason = ref('')
const loading = ref(false)

// Cancellation reasons
const cancellationReasons = [
  { value: 'changed_mind', text: 'Tôi đã thay đổi ý định' },
  { value: 'wrong_order', text: 'Đặt nhầm sản phẩm' },
  { value: 'found_better_price', text: 'Tìm được giá tốt hơn ở nơi khác' },
  { value: 'delivery_too_long', text: 'Thời gian giao hàng quá lâu' },
  { value: 'payment_issue', text: 'Vấn đề về thanh toán' },
  { value: 'no_longer_needed', text: 'Không còn cần thiết' },
  { value: 'other', text: 'Lý do khác' }
]

// Computed properties
const finalReason = computed(() => {
  if (selectedReason.value === 'other') {
    return customReason.value.trim()
  }
  const reason = cancellationReasons.find(r => r.value === selectedReason.value)
  return reason ? reason.text : ''
})

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function confirmCancel() {
  if (!selectedReason.value) return
  if (selectedReason.value === 'other' && !customReason.value.trim()) return
  
  loading.value = true
  emit('confirm', finalReason.value)
}

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    selectedReason.value = ''
    customReason.value = ''
    loading.value = false
  }
})

watch(() => selectedReason.value, (newValue) => {
  if (newValue !== 'other') {
    customReason.value = ''
  }
})
</script>

<style scoped>
/* Modal animation */
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
</style>