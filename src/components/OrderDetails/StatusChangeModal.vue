<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-white flex items-center">
            <i class="fas fa-edit mr-3"></i>
            Cập nhật trạng thái đơn hàng
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
        <!-- Current Status -->
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2">Trạng thái hiện tại</div>
          <div :class="currentStatusConfig.class" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
            <div :class="currentStatusConfig.dotClass" class="w-2 h-2 rounded-full mr-2"></div>
            {{ currentStatusConfig.text }}
          </div>
        </div>

        <!-- Status Options -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-gray-700">Chọn trạng thái mới:</label>
          <div class="space-y-2">
            <div 
              v-for="status in availableStatuses" 
              :key="status.value"
              class="relative"
            >
              <input 
                v-model="selectedStatus"
                :value="status.value"
                type="radio"
                :id="status.value"
                class="sr-only"
              >
              <label 
                :for="status.value"
                :class="[
                  'flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                  selectedStatus === status.value 
                    ? 'border-blue-500 bg-blue-50' 
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
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Ghi chú (tùy chọn):</label>
          <textarea 
            v-model="note"
            placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
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
          Hủy
        </button>
        <button 
          @click="confirmChange"
          :disabled="!selectedStatus || loading"
          :class="[
            'px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2',
            selectedStatus && !loading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <i v-if="loading" class="fas fa-spinner animate-spin"></i>
          <i v-else class="fas fa-check"></i>
          <span>{{ loading ? 'Đang cập nhật...' : 'Xác nhận' }}</span>
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
  currentStatus: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

// Reactive state
const selectedStatus = ref('')
const note = ref('')
const loading = ref(false)

// Status configurations
const statusConfigs = {
  pending: {
    text: 'Chờ xác nhận',
    class: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    dotClass: 'bg-yellow-500'
  },
  confirmed: {
    text: 'Đã xác nhận',
    class: 'bg-blue-100 text-blue-800 border border-blue-200',
    dotClass: 'bg-blue-500'
  },
  processing: {
    text: 'Đang xử lý',
    class: 'bg-orange-100 text-orange-800 border border-orange-200',
    dotClass: 'bg-orange-500'
  },
  shipping: {
    text: 'Đang giao hàng',
    class: 'bg-purple-100 text-purple-800 border border-purple-200',
    dotClass: 'bg-purple-500'
  },
  delivered: {
    text: 'Đã giao hàng',
    class: 'bg-green-100 text-green-800 border border-green-200',
    dotClass: 'bg-green-500'
  },
  cancelled: {
    text: 'Đã hủy',
    class: 'bg-red-100 text-red-800 border border-red-200',
    dotClass: 'bg-red-500'
  }
}

// Computed properties
const currentStatusConfig = computed(() => {
  return statusConfigs[props.currentStatus] || statusConfigs.pending
})

const availableStatuses = computed(() => {
  const statusFlow = {
    pending: [
      {
        value: 'confirmed',
        text: 'Xác nhận đơn hàng',
        description: 'Xác nhận đơn hàng và bắt đầu xử lý',
        icon: 'fas fa-check',
        iconClass: 'bg-blue-100 text-blue-600'
      },
      {
        value: 'cancelled',
        text: 'Hủy đơn hàng',
        description: 'Hủy đơn hàng này',
        icon: 'fas fa-times',
        iconClass: 'bg-red-100 text-red-600'
      }
    ],
    confirmed: [
      {
        value: 'processing',
        text: 'Bắt đầu xử lý',
        description: 'Chuẩn bị thuốc theo đơn hàng',
        icon: 'fas fa-cogs',
        iconClass: 'bg-orange-100 text-orange-600'
      },
      {
        value: 'cancelled',
        text: 'Hủy đơn hàng',
        description: 'Hủy đơn hàng này',
        icon: 'fas fa-times',
        iconClass: 'bg-red-100 text-red-600'
      }
    ],
    processing: [
      {
        value: 'shipping',
        text: 'Bắt đầu giao hàng',
        description: 'Đơn hàng đã sẵn sàng và bắt đầu giao',
        icon: 'fas fa-truck',
        iconClass: 'bg-purple-100 text-purple-600'
      },
      {
        value: 'cancelled',
        text: 'Hủy đơn hàng',
        description: 'Hủy đơn hàng này',
        icon: 'fas fa-times',
        iconClass: 'bg-red-100 text-red-600'
      }
    ],
    shipping: [
      {
        value: 'delivered',
        text: 'Đã giao hàng',
        description: 'Khách hàng đã nhận được đơn hàng',
        icon: 'fas fa-box-open',
        iconClass: 'bg-green-100 text-green-600'
      }
    ]
  }

  return statusFlow[props.currentStatus] || []
})

// Methods
function confirmChange() {
  if (!selectedStatus.value) return
  
  loading.value = true
  emit('confirm', selectedStatus.value, note.value)
}

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    selectedStatus.value = ''
    note.value = ''
    loading.value = false
  }
})

watch(() => loading.value, (newValue) => {
  if (!newValue) {
    // Reset loading state when operation completes
    setTimeout(() => {
      loading.value = false
    }, 100)
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