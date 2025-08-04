<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 relative" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-user-md text-xl"></i>
                <div>
                  <h2 class="text-xl font-semibold">
                    Xác thực đơn thuốc
                  </h2>
                  <p class="text-red-100 text-sm mt-1">
                    Đơn hàng #{{ order?.orderNumber }} - {{ order?.customerInfo?.name }}
                  </p>
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

          <!-- Loading overlay -->
          <div v-if="saving" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span class="text-sm text-gray-600 mt-2">Đang xử lý...</span>
              <p class="text-xs text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Error Alert -->
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

            <!-- Current Status -->
            <div v-if="order?.prescriptionData" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-blue-800 font-medium mb-2">Trạng thái hiện tại</h4>
                  <div class="flex items-center space-x-2 mb-2">
                    <div v-if="order.prescriptionData.validationStatus === 'pending'" class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span class="text-sm font-medium text-yellow-700">Chờ xác thực</span>
                    </div>
                    <div v-else-if="order.prescriptionData.validationStatus === 'approved'" class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span class="text-sm font-medium text-green-700">Đã phê duyệt</span>
                    </div>
                    <div v-else-if="order.prescriptionData.validationStatus === 'rejected'" class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span class="text-sm font-medium text-red-700">Đã từ chối</span>
                    </div>
                  </div>
                  
                  <div v-if="order.prescriptionData.validationInfo" class="bg-white rounded-lg p-3 text-sm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span class="text-gray-600">Dược sĩ xác thực:</span>
                        <span class="font-medium ml-2">{{ order.prescriptionData.validationInfo.pharmacistName }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Thời gian:</span>
                        <span class="font-medium ml-2">{{ formatDate(order.prescriptionData.validationInfo.validatedAt) }}</span>
                      </div>
                    </div>
                    <div v-if="order.prescriptionData.validationInfo.notes" class="mt-3 pt-3 border-t border-gray-200">
                      <span class="text-gray-600 text-sm">Ghi chú:</span>
                      <p class="text-gray-900 mt-1">{{ order.prescriptionData.validationInfo.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prescription Products -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-pills text-red-500"></i>
                Sản phẩm yêu cầu đơn thuốc
              </h3>
              <div class="space-y-3">
                <div 
                  v-for="product in prescriptionProducts" 
                  :key="product.id"
                  class="flex items-center space-x-3 bg-red-50 rounded-lg p-3 border border-red-200"
                >
                  <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-prescription-bottle-alt text-red-500"></i>
                  </div>
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">{{ product.name }}</h5>
                    <p class="text-sm text-gray-600">Số lượng: {{ product.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ formatPrice(product.price) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prescription Files -->
            <div v-if="order?.prescriptionData?.files" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-file-medical text-blue-500"></i>
                Đơn thuốc đã tải lên
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="(file, index) in order.prescriptionData.files" 
                  :key="index"
                  class="relative group border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
                  @click="previewFile(file)"
                >
                  <!-- File Preview -->
                  <div class="aspect-square">
                    <img 
                      v-if="file.type.startsWith('image/')"
                      :src="file.url" 
                      :alt="file.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full bg-red-100 flex items-center justify-center">
                      <i class="fas fa-file-pdf text-red-500 text-3xl"></i>
                    </div>
                  </div>

                  <!-- File Info Overlay -->
                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h5 class="text-white text-sm font-medium truncate">{{ file.name }}</h5>
                    <p class="text-white/80 text-xs">{{ formatFileSize(file.size) }}</p>
                  </div>

                  <!-- Actions Overlay -->
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button 
                      @click.stop="previewFile(file)"
                      class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      title="Xem trước"
                    >
                      <i class="fas fa-eye text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Upload Info -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Thời gian tải lên:</span>
                    <div class="font-medium">{{ formatDate(order.prescriptionData.uploadedAt) }}</div>
                  </div>
                  <div>
                    <span class="text-gray-600">Số lượng file:</span>
                    <div class="font-medium">{{ order.prescriptionData.files.length }} file</div>
                  </div>
                  <div v-if="order.prescriptionData.expiryDate">
                    <span class="text-gray-600">Hạn sử dụng:</span>
                    <div class="font-medium">{{ formatDate(order.prescriptionData.expiryDate) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Validation Form -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-clipboard-check text-green-500"></i>
                Xác thực đơn thuốc
              </h3>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Pharmacist Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tên dược sĩ <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="validationForm.pharmacistName"
                    type="text" 
                    required
                    :disabled="saving"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập tên dược sĩ"
                  />
                </div>

                <!-- Validation Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kết quả xác thực <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input 
                        v-model="validationForm.status" 
                        type="radio" 
                        value="approved"
                        class="mr-3"
                        :disabled="saving"
                      />
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span class="font-medium text-green-700">Phê duyệt</span>
                      </div>
                    </label>
                    <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input 
                        v-model="validationForm.status" 
                        type="radio" 
                        value="rejected"
                        class="mr-3"
                        :disabled="saving"
                      />
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span class="font-medium text-red-700">Từ chối</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú <span class="text-red-500">*</span>
                  </label>
                  <textarea 
                    v-model="validationForm.notes"
                    rows="4"
                    required
                    :disabled="saving"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    :placeholder="validationForm.status === 'approved' ? 'Nhập lý do phê duyệt và các lưu ý...' : 'Nhập lý do từ chối và hướng dẫn khắc phục...'"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <button 
              type="button"
              @click="$emit('close')"
              :disabled="saving"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i class="fas fa-times mr-2"></i>
              Hủy bỏ
            </button>
            <button 
              @click="handleSubmit"
              :disabled="!canSubmit || saving"
              :class="[
                'flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none',
                validationForm.status === 'approved'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white'
              ]"
            >
              <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else-if="validationForm.status === 'approved'" class="fas fa-check mr-2"></i>
              <i v-else class="fas fa-times mr-2"></i>
              {{ 
                saving ? 'Đang xử lý...' : 
                validationForm.status === 'approved' ? 'Phê duyệt đơn thuốc' : 'Từ chối đơn thuốc'
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- File Preview Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="previewFileData" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" @click="closePreview">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-medium text-gray-900">{{ previewFileData?.name }}</h3>
            <button @click="closePreview" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-4">
            <img 
              v-if="previewFileData?.type.startsWith('image/')"
              :src="previewFileData.url" 
              :alt="previewFileData.name"
              class="max-w-full max-h-[70vh] object-contain mx-auto"
            />
            <div v-else class="text-center py-8">
              <i class="fas fa-file-pdf text-red-500 text-4xl mb-4"></i>
              <p class="text-gray-600">Không thể xem trước file PDF</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

const emit = defineEmits(['close', 'validate'])

// Reactive state
const previewFileData = ref(null)
const validationForm = ref({
  pharmacistName: 'Dược sĩ Nguyễn Văn A', // Default pharmacist name
  status: '',
  notes: ''
})

// Computed
const prescriptionProducts = computed(() => {
  if (!props.order?.items) return []
  return props.order.items.filter(item => item.requiresPrescription === true)
})

const canSubmit = computed(() => {
  return validationForm.value.pharmacistName.trim() && 
         validationForm.value.status && 
         validationForm.value.notes.trim() &&
         !props.saving
})

// Watch for order changes to reset form
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    validationForm.value = {
      pharmacistName: 'Dược sĩ Nguyễn Văn A',
      status: '',
      notes: ''
    }
  }
})

// Methods
const previewFile = (file) => {
  previewFileData.value = file
}

const closePreview = () => {
  previewFileData.value = null
}

const clearError = () => {
  // Error clearing is handled by parent component
}

const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  try {
    // Import prescription API
    const { usePrescriptionApi } = await import('../../services/prescriptionApi.js')
    const { updatePrescriptionStatus } = usePrescriptionApi()
    
    const validationData = {
      status: validationForm.value.status,
      reviewNotes: validationForm.value.notes.trim()
    }
    
    // Get prescription ID from order data
    const prescriptionId = props.order?.prescriptionData?.id
    
    if (!prescriptionId) {
      throw new Error('Không tìm thấy ID đơn thuốc')
    }
    
    const response = await updatePrescriptionStatus(prescriptionId, validationData)
    
    if (response.success) {
      emit('validate', {
        prescriptionId,
        pharmacistName: validationForm.value.pharmacistName.trim(),
        status: validationForm.value.status,
        notes: validationForm.value.notes.trim(),
        validatedAt: new Date().toISOString(),
        response: response.data
      })
    } else {
      throw new Error(response.error || 'Cập nhật trạng thái đơn thuốc thất bại')
    }
  } catch (error) {
    console.error('Prescription validation error:', error)
    emit('validate', {
      error: error.message || 'Có lỗi xảy ra khi xác thực đơn thuốc'
    })
  }
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>

<style scoped>
/* Modal fade-in and fade-out transition styles */
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

/* Custom scrollbar for modal body */
.max-h-\[70vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[70vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>