<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <i class="fas fa-prescription-bottle-alt text-white"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Đơn thuốc</h3>
            <p class="text-sm text-gray-600">
              {{ prescriptionData.images?.length || 0 }} hình ảnh
              <span v-if="prescriptionData.patientName"> • {{ prescriptionData.patientName }}</span>
            </p>
          </div>
        </div>
        
        <!-- Validation Status -->
        <div class="flex items-center space-x-2">
          <div v-if="prescriptionData.validationStatus === 'pending'" class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-yellow-700">Đang xác thực</span>
          </div>
          <div v-else-if="prescriptionData.validationStatus === 'approved'" class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-sm font-medium text-green-700">Đã xác thực</span>
          </div>
          <div v-else-if="prescriptionData.validationStatus === 'rejected'" class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-sm font-medium text-red-700">Bị từ chối</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-6">
      <!-- Patient Information -->
      <div v-if="prescriptionData.patientName" class="space-y-4">
        <div class="flex items-start space-x-3">
          <i class="fas fa-user text-green-500 mt-1"></i>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-2">Thông tin bệnh nhân</h4>
            <div class="bg-green-50 rounded-lg p-4 border border-green-200">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tên bệnh nhân:</span>
                <span class="font-medium text-gray-900">{{ prescriptionData.patientName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Doctor and Clinic Information -->
      <div v-if="prescriptionData.doctorName || prescriptionData.clinicName" class="space-y-4">
        <div class="flex items-start space-x-3">
          <i class="fas fa-user-md text-blue-500 mt-1"></i>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-2">Thông tin bác sĩ & phòng khám</h4>
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
              <div v-if="prescriptionData.doctorName" class="flex justify-between text-sm">
                <span class="text-gray-600">Bác sĩ kê đơn:</span>
                <span class="font-medium text-gray-900">{{ prescriptionData.doctorName }}</span>
              </div>
              <div v-if="prescriptionData.doctorLicense" class="flex justify-between text-sm">
                <span class="text-gray-600">Số chứng chỉ hành nghề:</span>
                <span class="font-medium text-gray-900">{{ prescriptionData.doctorLicense }}</span>
              </div>
              <div v-if="prescriptionData.clinicName" class="flex justify-between text-sm">
                <span class="text-gray-600">Phòng khám/Bệnh viện:</span>
                <span class="font-medium text-gray-900">{{ prescriptionData.clinicName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prescription Dates -->
      <div v-if="prescriptionData.issueDate || prescriptionData.expiryDate" class="space-y-4">
        <div class="flex items-start space-x-3">
          <i class="fas fa-calendar-alt text-purple-500 mt-1"></i>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-2">Thông tin thời gian</h4>
            <div class="bg-purple-50 rounded-lg p-4 border border-purple-200 space-y-2">
              <div v-if="prescriptionData.issueDate" class="flex justify-between text-sm">
                <span class="text-gray-600">Ngày kê đơn:</span>
                <span class="font-medium text-gray-900">{{ formatDate(prescriptionData.issueDate) }}</span>
              </div>
              <div v-if="prescriptionData.expiryDate" class="flex justify-between text-sm">
                <span class="text-gray-600">Hạn sử dụng đơn thuốc:</span>
                <span class="font-medium text-gray-900">{{ formatDate(prescriptionData.expiryDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Diagnosis and Notes -->
      <div v-if="prescriptionData.diagnosis || prescriptionData.notes" class="space-y-4">
        <div class="flex items-start space-x-3">
          <i class="fas fa-stethoscope text-orange-500 mt-1"></i>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-2">Chẩn đoán & Ghi chú</h4>
            <div class="bg-orange-50 rounded-lg p-4 border border-orange-200 space-y-3">
              <div v-if="prescriptionData.diagnosis">
                <span class="text-gray-600 text-sm font-medium">Chẩn đoán:</span>
                <p class="text-gray-900 mt-1">{{ prescriptionData.diagnosis }}</p>
              </div>
              <div v-if="prescriptionData.notes" class="pt-2 border-t border-orange-200">
                <span class="text-gray-600 text-sm font-medium">Ghi chú của bác sĩ:</span>
                <p class="text-gray-900 mt-1">{{ prescriptionData.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Info -->
      <div v-if="prescriptionData.validationInfo" class="space-y-4">
        <div class="flex items-start space-x-3">
          <i class="fas fa-check-circle text-teal-500 mt-1"></i>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-2">Thông tin xác thực</h4>
            <div class="bg-teal-50 rounded-lg p-4 border border-teal-200 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Dược sĩ xác thực:</span>
                <span class="font-medium text-gray-900">{{ prescriptionData.validationInfo.pharmacistName }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Thời gian xác thực:</span>
                <span class="font-medium text-gray-900">{{ formatDate(prescriptionData.validationInfo.validatedAt) }}</span>
              </div>
              <div v-if="prescriptionData.validationInfo.notes" class="pt-2 border-t border-teal-200">
                <span class="text-gray-600 text-sm font-medium">Ghi chú xác thực:</span>
                <p class="text-sm text-gray-900 mt-1">{{ prescriptionData.validationInfo.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prescription Products -->
      <div v-if="prescriptionProducts.length > 0" class="space-y-4">
        <h4 class="font-medium text-gray-900 flex items-center gap-2">
          <i class="fas fa-pills text-red-500"></i>
          Sản phẩm yêu cầu đơn thuốc
        </h4>
        <div class="space-y-3">
          <div 
            v-for="product in prescriptionProducts" 
            :key="product.id"
            class="flex items-center space-x-3 bg-red-50 rounded-lg p-3 border border-red-200"
          >
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white"
              @error="handleImageError"
            />
            <div class="flex-1">
              <h5 class="font-medium text-gray-900">{{ product.name }}</h5>
              <p class="text-sm text-gray-600">{{ product.category }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">SL: {{ product.quantity }}</div>
              <div class="text-xs text-gray-500">{{ formatPrice(product.price) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prescription Files -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="font-medium text-gray-900 flex items-center gap-2">
            <i class="fas fa-file-medical text-blue-500"></i>
            File đơn thuốc
          </h4>
          <button 
            @click="downloadAllFiles"
            class="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <i class="fas fa-download mr-1"></i>
            Tải tất cả
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(imageUrl, index) in prescriptionData.images" 
            :key="index"
            class="relative group border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
            @click="previewImage(imageUrl, index)"
          >
            <!-- Image Preview -->
            <div class="aspect-square">
              <img 
                :src="imageUrl" 
                :alt="`Đơn thuốc ${index + 1}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <!-- Image Info Overlay -->
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <h5 class="text-white text-sm font-medium">Đơn thuốc {{ index + 1 }}</h5>
              <p class="text-white/80 text-xs">Hình ảnh</p>
            </div>

            <!-- Actions Overlay -->
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button 
                @click.stop="previewImage(imageUrl, index)"
                class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                title="Xem trước"
              >
                <i class="fas fa-eye text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Info -->
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <i class="fas fa-upload text-indigo-500 mt-1"></i>
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-2">Thông tin tải lên</h4>
            <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-200 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Thời gian tải lên:</span>
                <span class="font-medium text-gray-900">{{ formatDate(prescriptionData.uploadedAt) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tổng số file hình ảnh:</span>
                <span class="font-medium text-gray-900">{{ prescriptionData.images?.length || 0 }} file</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- File Preview Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="previewFileData" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" @click="closePreview">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-medium text-gray-900">{{ previewFileData?.name }}</h3>
            <div class="flex items-center space-x-2">
              <button 
                @click="downloadFile(previewFileData)"
                class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Tải xuống"
              >
                <i class="fas fa-download"></i>
              </button>
              <button 
                @click="closePreview" 
                class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="p-4">
            <img 
              v-if="previewFileData"
              :src="previewFileData.url" 
              :alt="previewFileData.name"
              class="max-w-full max-h-[70vh] object-contain mx-auto"
              @error="handlePreviewError"
            />
            <div v-else class="text-center py-8">
              <i class="fas fa-image text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-600">Không thể xem trước hình ảnh này</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  prescriptionData: {
    type: Object,
    required: true
  },
  prescriptionProducts: {
    type: Array,
    default: () => []
  }
});

// Reactive state
const previewFileData = ref(null)

// Methods
const previewImage = (imageUrl, index) => {
  previewFileData.value = {
    url: imageUrl,
    name: `Đơn thuốc ${index + 1}`,
    index: index
  }
}

const closePreview = () => {
  previewFileData.value = null
}

const downloadImage = (imageUrl, index) => {
  // Create download link
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `don-thuoc-${index + 1}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadAllFiles = () => {
  if (props.prescriptionData.images) {
    props.prescriptionData.images.forEach((imageUrl, index) => {
      setTimeout(() => downloadImage(imageUrl, index), 100 * index) // Small delay between downloads
    })
  }
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
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

const handleImageError = (event) => {
  console.warn('Failed to load prescription image:', event.target.src)
  event.target.style.display = 'none'
}

const handlePreviewError = (event) => {
  console.warn('Failed to load preview image:', event.target.src)
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
</style>