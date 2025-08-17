<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="handleCancel">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 relative" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-prescription-bottle-alt text-xl"></i>
                <div>
                  <h2 class="text-xl font-semibold">
                    Tải lên đơn thuốc
                  </h2>
                  <p class="text-red-100 text-sm mt-1">
                    Một số sản phẩm trong giỏ hàng yêu cầu đơn thuốc
                  </p>
                </div>
              </div>
              <button
                @click="handleCancel"
                :disabled="uploading"
                :class="[
                  'p-2 rounded-full transition-colors duration-200',
                  uploading 
                    ? 'text-white/40 cursor-not-allowed' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                ]"
              >
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Loading overlay -->
          <div v-if="uploading" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span class="text-sm text-gray-600 mt-2">Đang tải lên đơn thuốc...</span>
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

            <!-- Prescription Required Products -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-info-circle text-amber-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-amber-800 font-medium mb-2">Sản phẩm yêu cầu đơn thuốc</h4>
                  <div class="space-y-2">
                    <div 
                      v-for="product in prescriptionProducts" 
                      :key="product.id"
                      class="flex items-center space-x-3 bg-white rounded-lg p-3"
                    >
                      <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center border border-red-200">
                        <i class="fas fa-prescription-bottle-alt text-red-500"></i>
                      </div>
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-900">{{ product.title }}</h5>
                        <p class="text-sm text-gray-600">{{ product.manufacturer }}</p>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900">SL: {{ product.quantity }}</div>
                        <div class="text-xs text-gray-500">{{ product.unit }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Prescription Information Form -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 class="text-gray-800 font-medium mb-4 flex items-center gap-2">
                <i class="fas fa-info-circle text-gray-500"></i>
                Thông tin đơn thuốc
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tên bệnh nhân <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.patientName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập tên bệnh nhân"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tên bác sĩ <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.doctorName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập tên bác sĩ"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Số chứng chỉ hành nghề
                  </label>
                  <input
                    v-model="formData.doctorLicense"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập số chứng chỉ"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng khám/bệnh viện
                  </label>
                  <input
                    v-model="formData.clinicName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập tên cơ sở y tế"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kê đơn <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.issueDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    v-model="formData.expiryDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Chẩn đoán
                </label>
                <textarea
                  v-model="formData.diagnosis"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nhập chẩn đoán bệnh"
                ></textarea>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  v-model="formData.notes"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ghi chú thêm (nếu có)"
                ></textarea>
              </div>
            </div>

            <!-- Upload Instructions -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-lightbulb text-blue-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-blue-800 font-medium mb-2">Hướng dẫn tải lên đơn thuốc</h4>
                  <ul class="text-blue-700 text-sm space-y-1">
                    <li>• Đơn thuốc phải rõ ràng, không bị mờ hoặc che khuất</li>
                    <li>• Chấp nhận định dạng: JPG, PNG (tối đa 10MB)</li>
                    <li>• Đơn thuốc phải còn hiệu lực (chưa quá 30 ngày)</li>
                    <li>• Có thể tải lên nhiều trang đơn thuốc nếu cần</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Drag & Drop Upload Area -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-cloud-upload-alt text-red-500"></i>
                Tải lên đơn thuốc
              </h3>

              <div 
                ref="dropZone"
                @drop.prevent="handleDrop"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @click="triggerFileInput"
                :class="[
                  'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
                  isDragOver 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
                ]"
              >
                <div class="space-y-4">
                  <div class="flex justify-center">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-prescription-bottle-alt text-2xl text-gray-400"></i>
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <h4 class="text-lg font-semibold text-gray-900">
                      {{ isDragOver ? 'Thả file để tải lên' : 'Tải lên đơn thuốc' }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      Kéo thả file vào đây hoặc click để chọn file
                    </p>
                    <p class="text-xs text-gray-500">
                      Hỗ trợ: JPG, PNG (Tối đa 10MB mỗi file)
                    </p>
                  </div>

                  <button 
                    type="button"
                    class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <i class="fas fa-folder-open mr-2"></i>
                    Chọn file
                  </button>
                </div>

                <!-- Hidden file input -->
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="image/jpeg,image/png" 
                  multiple
                  @change="handleFileSelect"
                  class="hidden"
                />
              </div>
            </div>

            <!-- Uploaded Files -->
            <div v-if="uploadedFiles.length > 0" class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-900">Đơn thuốc đã tải lên</h4>
                <button 
                  @click="clearAllFiles"
                  type="button"
                  class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <i class="fas fa-trash mr-1"></i>
                  Xóa tất cả
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(file, index) in uploadedFiles" 
                  :key="index"
                  class="relative group border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <!-- File Preview -->
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div v-if="file.type.startsWith('image/') && file.preview" class="relative">
                        <img 
                          :src="file.preview" 
                          :alt="file.name"
                          class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          @error="() => handleThumbnailError(file)"
                        />
                      </div>
                      <div v-else-if="file.type.startsWith('image/')" class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                        <i class="fas fa-image text-blue-500 text-xl"></i>
                      </div>
                      <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <i class="fas fa-file text-gray-500 text-xl"></i>
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <h5 class="font-medium text-gray-900 truncate">{{ file.name }}</h5>
                      <p class="text-sm text-gray-600">{{ formatFileSize(file.size) }}</p>
                      <p class="text-xs text-gray-500">{{ file.type }}</p>
                    </div>

                    <!-- Remove Button -->
                    <button 
                      @click="removeFile(index)"
                      class="opacity-0 group-hover:opacity-100 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200"
                      title="Xóa file"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <!-- File Actions -->
                  <div class="mt-3 flex space-x-2">
                    <button 
                      v-if="file.type.startsWith('image/') && file.preview"
                      @click="previewFile(file)"
                      class="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      <i class="fas fa-eye mr-1"></i>
                      Xem trước
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-center space-x-3">
                <i class="fas fa-cloud-upload-alt text-blue-500"></i>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-800">Đang tải lên...</span>
                    <span class="text-sm text-blue-600">{{ Math.round(uploadProgress) }}%</span>
                  </div>
                  <div class="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${uploadProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <button 
              type="button"
              @click="handleCancel"
              :disabled="uploading"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i class="fas fa-times mr-2"></i>
              Hủy bỏ
            </button>
            <button 
              @click="handleSubmit"
              :disabled="!canSubmit || uploading"
              class="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <i v-if="uploading" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-check mr-2"></i>
              {{ uploading ? 'Đang xử lý...' : 'Xác nhận đơn thuốc' }}
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
            <div v-if="previewFileData?.type.startsWith('image/') && previewFileData.preview" class="flex justify-center">
              <img 
                :src="previewFileData.preview" 
                :alt="previewFileData.name"
                class="max-w-full max-h-[70vh] object-contain"
                @error="handlePreviewError"
              />
            </div>
            <div v-else-if="previewFileData?.type.startsWith('image/')" class="text-center py-8">
              <i class="fas fa-image text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-600">Không thể hiển thị hình ảnh</p>
            </div>
            <div v-else class="text-center py-8">
              <i class="fas fa-file text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-600">Không thể xem trước file này</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  prescriptionProducts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'submit'])

// Toast functionality
const { showError, showSuccess } = useToast()

// Reactive state
const dropZone = ref(null)
const fileInput = ref(null)
const isDragOver = ref(false)
const uploadedFiles = ref([])
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const previewFileData = ref(null)

// Form data for prescription metadata
const formData = ref({
  patientName: '',
  doctorName: '',
  doctorLicense: '',
  clinicName: '',
  issueDate: '',
  expiryDate: '',
  diagnosis: '',
  notes: ''
})

// Computed
const canSubmit = computed(() => {
  const hasRequiredFields = formData.value.patientName.trim() && 
                           formData.value.doctorName.trim() && 
                           formData.value.issueDate
  return hasRequiredFields && uploadedFiles.value.length > 0 && !uploading.value
})

// Methods
const handleDragOver = (event) => {
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  isDragOver.value = false
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
  // Reset input value to allow selecting the same file again
  event.target.value = ''
}

const processFiles = async (files) => {
  for (const file of files) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = `File ${file.name} không được hỗ trợ. Chỉ chấp nhận hình ảnh.`
      continue
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      error.value = `File ${file.name} quá lớn. Kích thước tối đa là 10MB.`
      continue
    }
    
    // Generate preview for images using the same pattern as CreateEditModal
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          preview: e.target.result,
          previewError: false
        }
        uploadedFiles.value.push(fileData)
      }
      reader.onerror = () => {
        console.error('FileReader error for:', file.name)
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          preview: null,
          previewError: true
        }
        uploadedFiles.value.push(fileData)
      }
      reader.readAsDataURL(file)
    } else {
      // For non-image files, add without preview
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        preview: null,
        previewError: false
      }
      uploadedFiles.value.push(fileData)
    }
  }
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const clearAllFiles = () => {
  uploadedFiles.value = []
}

const previewFile = (file) => {
  previewFileData.value = file
}

const closePreview = () => {
  previewFileData.value = null
}

const clearError = () => {
  error.value = ''
}

// Reset form to initial state
const resetForm = () => {
  uploadedFiles.value = []
  uploading.value = false
  uploadProgress.value = 0
  error.value = ''
  previewFileData.value = null
  isDragOver.value = false
  
  // Reset form data
  formData.value = {
    patientName: '',
    doctorName: '',
    doctorLicense: '',
    clinicName: '',
    issueDate: '',
    expiryDate: '',
    diagnosis: '',
    notes: ''
  }
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleThumbnailError = (file) => {
  file.previewError = true
}

const handlePreviewError = () => {
  // Preview error is handled by the template logic
  console.warn('Preview image failed to load')
}

const handleCancel = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  uploading.value = true
  uploadProgress.value = 0
  error.value = ''
  
  try {
    // Import prescription API service
    const { usePrescriptionApi } = await import('../../services/prescriptionApi.js')
    const { createPrescription, uploadPrescriptionImage } = usePrescriptionApi()
    
    // Convert uploaded files to base64 for backend processing
    const base64Images = []
    if (uploadedFiles.value.length > 0) {
      for (const fileData of uploadedFiles.value) {
        if (fileData.preview && fileData.type.startsWith('image/')) {
          base64Images.push(fileData.preview)
        } else if (fileData.file) {
          // Convert file to base64 if not already done
          const base64 = await fileToBase64(fileData.file)
          base64Images.push(base64)
        }
      }
    }
    
    // Map prescription products to medication items that backend expects
    const medicationItems = props.prescriptionProducts.map(product => ({
      medicationName: product.title || product.name,
      dosage: product.dosage || 'Theo chỉ định bác sĩ', // Default dosage
      frequency: product.frequency || 'Theo chỉ định bác sĩ', // Default frequency
      duration: product.duration || null,
      quantity: product.quantity || 1,
      instructions: product.instructions || null,
      productId: product.id || null
    }))
    
    // Create prescription data matching backend expectations
    const prescriptionData = {
      patientName: formData.value.patientName,
      doctorName: formData.value.doctorName,
      doctorLicense: formData.value.doctorLicense || null,
      clinicName: formData.value.clinicName || null,
      issueDate: formData.value.issueDate,
      expiryDate: formData.value.expiryDate || null,
      diagnosis: formData.value.diagnosis || null,
      notes: formData.value.notes || null,
      status: 'pending',
      images: base64Images, // Send images as base64 array
      items: medicationItems // Send as 'items' not 'prescriptionProducts'
    }
    
    uploadProgress.value = 30
    
    // Create prescription record with images
    const prescriptionResponse = await createPrescription(prescriptionData)
    
    if (!prescriptionResponse.success) {
      throw new Error(prescriptionResponse.error || 'Failed to create prescription')
    }
    
    uploadProgress.value = 90
    
    const prescriptionId = prescriptionResponse.data.id
    
    // Prepare uploaded files info for frontend state
    const uploadedImageUrls = prescriptionResponse.data.images || []
    const fileInfos = uploadedFiles.value.map((fileData, index) => ({
      name: fileData.name,
      url: uploadedImageUrls[index] || null,
      type: fileData.type,
      size: fileData.size
    }))
    
    uploadProgress.value = 100
    
    // Show success message
    showSuccess('Đơn thuốc đã được tải lên thành công!')
    
    // Emit success with prescription data
    emit('submit', {
      prescriptionId: prescriptionId,
      prescriptionData: {
        ...prescriptionResponse.data,
        files: fileInfos,
        uploadedAt: prescriptionResponse.data.createdAt,
        validationStatus: 'pending'
      },
      prescriptionProducts: props.prescriptionProducts
    })
    
  } catch (err) {
    console.error('Upload error:', err)
    const errorMessage = err.message || 'Có lỗi xảy ra khi tải lên đơn thuốc. Vui lòng thử lại.'
    error.value = errorMessage
    showError(errorMessage)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Watch for modal show/hide to reset form
watch(() => props.show, (newShow, oldShow) => {
  // Reset form when modal is closed
  if (oldShow && !newShow) {
    resetForm()
  }
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