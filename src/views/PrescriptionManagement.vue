<template>
  <div class="min-h-screen bg-gradient-to-b from-red-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
              <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-red-600 to-red-800 rounded-full mr-4"></div>
              Quản lý đơn thuốc
            </h1>
            <p class="text-gray-600 ml-6 text-lg mt-2">
              Theo dõi và quản lý các đơn thuốc của bạn
            </p>
          </div>
          
          <!-- Summary Cards -->
          <div v-if="prescriptionSummary" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ prescriptionSummary.totalPrescriptions }}</div>
              <div class="text-sm text-blue-700">Tổng số</div>
            </div>
            <div class="bg-yellow-50 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-yellow-600">{{ prescriptionSummary.pendingPrescriptions }}</div>
              <div class="text-sm text-yellow-700">Chờ duyệt</div>
            </div>
            <div class="bg-green-50 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-green-600">{{ prescriptionSummary.approvedPrescriptions }}</div>
              <div class="text-sm text-green-700">Đã duyệt</div>
            </div>
            <div class="bg-red-50 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-red-600">{{ prescriptionSummary.rejectedPrescriptions }}</div>
              <div class="text-sm text-red-700">Bị từ chối</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              v-model="filters.status" 
              @change="loadPrescriptions"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Bị từ chối</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên bệnh nhân</label>
            <input 
              v-model="filters.patientName" 
              @input="debouncedSearch"
              type="text" 
              placeholder="Nhập tên bệnh nhân"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên bác sĩ</label>
            <input 
              v-model="filters.doctorName" 
              @input="debouncedSearch"
              type="text" 
              placeholder="Nhập tên bác sĩ"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div class="flex items-end">
            <button 
              @click="resetFilters"
              class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <i class="fas fa-undo mr-2"></i>
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span class="ml-3 text-gray-600">Đang tải danh sách đơn thuốc...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="loadPrescriptions"
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Prescriptions List -->
      <div v-else-if="prescriptions.length > 0" class="space-y-4">
        <div 
          v-for="prescription in prescriptions" 
          :key="prescription.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <!-- Prescription Info -->
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-prescription-bottle-alt text-red-600"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Đơn thuốc #{{ prescription.id }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      Tạo ngày {{ formatDate(prescription.createdAt) }}
                    </p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Bệnh nhân:</span>
                    <span class="font-medium ml-2">{{ prescription.patientName }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Bác sĩ:</span>
                    <span class="font-medium ml-2">{{ prescription.doctorName }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Ngày kê đơn:</span>
                    <span class="font-medium ml-2">{{ formatDate(prescription.issueDate) }}</span>
                  </div>
                  <div v-if="prescription.expiryDate">
                    <span class="text-gray-600">Ngày hết hạn:</span>
                    <span class="font-medium ml-2">{{ formatDate(prescription.expiryDate) }}</span>
                  </div>
                </div>
                
                <div v-if="prescription.diagnosis" class="mt-3">
                  <span class="text-gray-600 text-sm">Chẩn đoán:</span>
                  <p class="text-gray-900 mt-1">{{ prescription.diagnosis }}</p>
                </div>
              </div>
              
              <!-- Status and Actions -->
              <div class="flex flex-col items-end space-y-3">
                <!-- Status Badge -->
                <div class="flex items-center space-x-2">
                  <div v-if="prescription.status === 'pending'" class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">Chờ duyệt</span>
                  </div>
                  <div v-else-if="prescription.status === 'approved'" class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">Đã duyệt</span>
                  </div>
                  <div v-else-if="prescription.status === 'rejected'" class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span class="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">Bị từ chối</span>
                  </div>
                  <div v-else-if="prescription.status === 'expired'" class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span class="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">Hết hạn</span>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-2">
                  <button 
                    @click="viewPrescription(prescription)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <i class="fas fa-eye mr-1"></i>
                    Xem chi tiết
                  </button>
                  
                  <button 
                    v-if="prescription.status === 'pending'"
                    @click="deletePrescription(prescription.id)"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <i class="fas fa-trash mr-1"></i>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Images Preview -->
            <div v-if="prescription.images && prescription.images.length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-2 mb-2">
                <i class="fas fa-images text-gray-500"></i>
                <span class="text-sm text-gray-600">{{ prescription.images.length }} hình ảnh đơn thuốc</span>
              </div>
              <div class="flex space-x-2 overflow-x-auto">
                <img 
                  v-for="(image, index) in prescription.images.slice(0, 4)" 
                  :key="index"
                  :src="image" 
                  :alt="`Prescription image ${index + 1}`"
                  class="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  @click="openImageModal(image)"
                />
                <div 
                  v-if="prescription.images.length > 4"
                  class="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-xs"
                >
                  +{{ prescription.images.length - 4 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-prescription-bottle-alt text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Chưa có đơn thuốc nào</h3>
          <p class="text-gray-600 mb-4">Bạn chưa có đơn thuốc nào trong hệ thống.</p>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showImageModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeImageModal">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 class="font-medium text-gray-900">Xem hình ảnh đơn thuốc</h3>
              <button @click="closeImageModal" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="p-4">
              <img 
                :src="selectedImage" 
                alt="Prescription image"
                class="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePrescription } from '../composables/usePrescription.js'

// Composables
const { 
  prescriptions, 
  prescriptionSummary, 
  isLoading, 
  error, 
  loadPrescriptions: loadPrescriptionsFromApi, 
  loadPrescriptionSummary,
  removePrescription
} = usePrescription()

// Reactive state
const filters = ref({
  status: '',
  patientName: '',
  doctorName: '',
  page: 1,
  limit: 10
})

const showImageModal = ref(false)
const selectedImage = ref('')
const searchTimeout = ref(null)

// Computed
const filteredPrescriptions = computed(() => {
  return prescriptions.value || []
})

// Methods
const loadPrescriptions = async () => {
  const params = {
    ...filters.value,
    page: filters.value.page,
    limit: filters.value.limit
  }
  
  // Remove empty filters
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key]
    }
  })
  
  await loadPrescriptionsFromApi(params)
}

const loadSummary = async () => {
  await loadPrescriptionSummary()
}

const resetFilters = () => {
  filters.value = {
    status: '',
    patientName: '',
    doctorName: '',
    page: 1,
    limit: 10
  }
  loadPrescriptions()
}

const debouncedSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    filters.value.page = 1 // Reset to first page when searching
    loadPrescriptions()
  }, 500)
}

const viewPrescription = (prescription) => {
  // Navigate to prescription details or open modal
  console.log('View prescription:', prescription)
  // You can implement a detailed view modal here
}

const deletePrescription = async (prescriptionId) => {
  if (confirm('Bạn có chắc chắn muốn xóa đơn thuốc này?')) {
    const response = await removePrescription(prescriptionId)
    if (response.success) {
      // Reload prescriptions and summary
      await loadPrescriptions()
      await loadSummary()
    } else {
      alert('Có lỗi xảy ra khi xóa đơn thuốc: ' + response.error)
    }
  }
}

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
}

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadPrescriptions(),
    loadSummary()
  ])
})
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

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>