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
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-edit text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Thay đổi trạng thái đơn hàng</h3>
                  <p class="text-blue-100 text-sm mt-1">Cập nhật trạng thái đơn hàng #{{ order?.orderNumber }}</p>
                </div>
              </div>
              <button 
                @click="$emit('close')"
                :disabled="saving"
                :class="[
                  'p-2 rounded-full transition-colors duration-200',
                  saving 
                    ? 'text-white/40 cursor-not-allowed' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                ]"
              >
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <!-- Order Info -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
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
            <div class="space-y-4">
              <label class="text-sm font-semibold text-gray-800 flex items-center">
                <i class="fas fa-arrow-right text-blue-600 mr-2"></i>
                Chọn trạng thái mới
              </label>
              <div class="space-y-3">
                <div 
                  v-for="status in availableStatuses" 
                  :key="status.value"
                  class="relative"
                >
                  <input 
                    :id="`status-${status.value}`"
                    v-model="selectedStatus"
                    :value="status.value"
                    type="radio"
                    class="sr-only"
                  />
                  <label 
                    :for="`status-${status.value}`"
                    :class="[
                      'flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      selectedStatus === status.value 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    <div 
                      :class="[
                        'w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center',
                        selectedStatus === status.value 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      ]"
                    >
                      <div 
                        v-if="selectedStatus === status.value"
                        class="w-2 h-2 bg-white rounded-full"
                      ></div>
                    </div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-800">{{ status.text }}</div>
                      <div class="text-sm text-gray-600">{{ status.description }}</div>
                    </div>
                    <div :class="status.iconClass" class="w-8 h-8 rounded-full flex items-center justify-center">
                      <i :class="status.icon + ' text-sm'"></i>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Note Input -->
            <div class="space-y-3">
              <label class="text-sm font-semibold text-gray-800 flex items-center">
                <i class="fas fa-sticky-note text-blue-600 mr-2"></i>
                Ghi chú (tùy chọn)
              </label>
              <textarea 
                v-model="note"
                placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                rows="3"
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-red-800 font-medium mb-1">Có lỗi xảy ra</h4>
                  <p class="text-red-700 text-sm">{{ error }}</p>
                </div>
                <button 
                  @click="clearError"
                  class="text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              @click="$emit('close')"
              :disabled="saving"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button 
              @click="handleConfirm"
              :disabled="!selectedStatus || saving"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2',
                selectedStatus && !saving
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <i v-if="saving" class="fas fa-spinner animate-spin"></i>
              <i v-else class="fas fa-check"></i>
              <span>{{ saving ? 'Đang cập nhật...' : 'Xác nhận' }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
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
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
}

const statusDescriptions = {
  confirmed: 'Xác nhận đơn hàng và bắt đầu xử lý',
  processing: 'Đang chuẩn bị thuốc theo đơn hàng',
  shipped: 'Đơn hàng đã được gửi đi và đang vận chuyển',
  delivered: 'Đơn hàng đã được giao thành công',
  cancelled: 'Hủy đơn hàng này'
}

// Computed properties
const availableStatuses = computed(() => {
  const nextStatuses = statusFlow[props.currentStatus] || []
  return nextStatuses.map(status => ({
    value: status,
    text: getStatusText(status),
    description: statusDescriptions[status] || '',
    icon: getStatusIcon(status),
    iconClass: getStatusIconClass(status)
  }))
})

// Helper functions
function getStatusText(status) {
  const statusTexts = {
    confirmed: 'Xác nhận đơn hàng',
    processing: 'Bắt đầu xử lý',
    shipped: 'Bắt đầu giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Hủy đơn hàng'
  }
  return statusTexts[status] || status
}

function getStatusIcon(status) {
  const statusIcons = {
    confirmed: 'fas fa-check',
    processing: 'fas fa-cogs',
    shipped: 'fas fa-truck',
    delivered: 'fas fa-box-open',
    cancelled: 'fas fa-times'
  }
  return statusIcons[status] || 'fas fa-circle'
}

function getStatusIconClass(status) {
  const statusIconClasses = {
    confirmed: 'bg-blue-100 text-blue-600',
    processing: 'bg-orange-100 text-orange-600',
    shipped: 'bg-purple-100 text-purple-600',
    delivered: 'bg-green-100 text-green-600',
    cancelled: 'bg-red-100 text-red-600'
  }
  return statusIconClasses[status] || 'bg-gray-100 text-gray-600'
}

// Methods
function handleConfirm() {
  if (!selectedStatus.value) return
  
  const statusData = {
    status: selectedStatus.value,
    note: note.value.trim()
  }
  
  emit('confirm', statusData)
}

function clearError() {
  emit('close')
}

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    selectedStatus.value = ''
    note.value = ''
  }
})
</script>

<style scoped>
/* Modal animations */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Custom scrollbar for modal body */
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
</style>