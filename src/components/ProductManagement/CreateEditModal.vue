<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 relative" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus'" class="text-xl"></i>
                <div>
                  <h2 class="text-xl font-semibold">
                    {{ isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
                  </h2>
                  <p class="text-blue-100 text-sm mt-1">
                    {{ isEditing ? 'Cập nhật thông tin sản phẩm' : 'Nhập thông tin sản phẩm mới' }}
                  </p>
                  <div v-if="isEditing && hasFormChanges" class="text-blue-200 text-xs mt-1 flex items-center">
                    <i class="fas fa-info-circle mr-1"></i>
                    <span>Có thay đổi chưa lưu</span>
                  </div>
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

          <!-- Loading overlay for product creation/update -->
          <div v-if="saving && !isUploadingImages" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="text-sm text-gray-600 mt-2">{{ isEditing ? 'Đang cập nhật...' : 'Đang tạo sản phẩm...' }}</span>
              <p class="text-xs text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
            </div>
          </div>

          <!-- Image upload overlay -->
          <div v-if="isUploadingImages" class="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div class="flex flex-col items-center max-w-md mx-auto p-6">
              <!-- Circular Progress Bar -->
              <div class="relative w-24 h-24 mb-4">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <!-- Background circle -->
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    stroke-width="8"
                    fill="none"
                  />
                  <!-- Progress circle -->
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#3b82f6"
                    stroke-width="8"
                    fill="none"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (uploadProgress / 100) * circumference"
                    class="transition-all duration-300 ease-out"
                  />
                </svg>
                <!-- Progress percentage -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg font-semibold text-blue-600">{{ Math.round(uploadProgress) }}%</span>
                </div>
              </div>
              
              <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Đang tải lên hình ảnh</h3>
                <p class="text-sm text-gray-600 mb-1">{{ currentUploadStatus }}</p>
                <p class="text-xs text-gray-500">
                  {{ uploadedImageCount }}/{{ totalImagesToUpload }} hình ảnh đã tải lên
                </p>
              </div>
              
              <!-- Upload details -->
              <div class="mt-4 w-full">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span>Tiến độ tổng thể</span>
                    <span>{{ uploadedImageCount }}/{{ totalImagesToUpload }}</span>
                  </div>
                  <div class="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(uploadedImageCount / totalImagesToUpload) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <!-- Error Alert -->
            <div v-if="props.formError || imageUploadError" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-red-800 font-medium mb-1">Có lỗi xảy ra</h4>
                  <p v-if="props.formError" class="text-red-700 text-sm">{{ props.formError }}</p>
                  <p v-if="imageUploadError" class="text-red-700 text-sm">{{ imageUploadError }}</p>
                  
                  <!-- Show detailed API error information -->
                  <div v-if="imageUploadError && imageUploadError.includes('API Error')" class="mt-2 p-2 bg-red-100 rounded text-xs">
                    <details>
                      <summary class="cursor-pointer text-red-800 font-medium">Chi tiết lỗi API</summary>
                      <pre class="mt-2 text-red-700 whitespace-pre-wrap">{{ imageUploadError }}</pre>
                    </details>
                  </div>
                  <div v-if="props.fieldErrors.length > 0 || imageUploadErrors.length > 0" class="mt-2">
                    <ul class="text-red-600 text-xs space-y-1">
                      <li v-for="error in props.fieldErrors" :key="error" class="flex items-center">
                        <i class="fas fa-dot-circle mr-2 text-xs"></i>
                        {{ error }}
                      </li>
                      <li v-for="error in imageUploadErrors" :key="error" class="flex items-center">
                        <i class="fas fa-dot-circle mr-2 text-xs"></i>
                        {{ error }}
                      </li>
                    </ul>
                    
                    <!-- Action buttons for image errors -->
                    <div v-if="imageUploadErrors.length > 0" class="mt-3 flex gap-2">
                      <button 
                        @click="removeFailedImages"
                        type="button"
                        class="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        <i class="fas fa-trash mr-1"></i>
                        Xóa ảnh lỗi
                      </button>
                      <button 
                        @click="clearAllErrors"
                        type="button"
                        class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        <i class="fas fa-times mr-1"></i>
                        Bỏ qua lỗi
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  @click="clearAllErrors"
                  type="button"
                  class="text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>
        <!-- Basic Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Thông tin cơ bản
            </h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.title"
                type="text" 
                required
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                  !fieldValidation.title.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Nhập tên sản phẩm"
                @blur="validateFieldAndUpdate('title', form.title)"
                @input="clearFieldValidation('title')"
              />
              <div v-if="!fieldValidation.title.isValid && fieldValidation.title.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.title.error }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mã sản phẩm
              </label>
              <input 
                v-model="form.sku"
                type="text" 
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                  !fieldValidation.sku.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Nhập mã sản phẩm (SKU) - Để trống để tự động tạo"
                @blur="validateFieldAndUpdate('sku', form.sku)"
                @input="clearFieldValidation('sku')"
              />
              <div v-if="!fieldValidation.sku.isValid && fieldValidation.sku.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.sku.error }}
              </div>
              <p class="text-xs text-gray-500 mt-1">Để trống để hệ thống tự động tạo mã sản phẩm</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.category"
                @change="onCategoryChange"
                required
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                  !fieldValidation.category.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              >
                <option value="">Chọn danh mục</option>
                <option v-for="category in mainCategoryOptions" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
              <div v-if="!fieldValidation.category.isValid && fieldValidation.category.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.category.error }}
              </div>
            </div>

            <div v-if="form.category && availableSubcategories.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục con
              </label>
              <select 
                v-model="form.subcategory"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Chọn danh mục con (tùy chọn)</option>
                <option v-for="subcategory in availableSubcategories" :key="subcategory.value" :value="subcategory.value">
                  {{ subcategory.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nhà sản xuất <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.manufacturer"
                type="text" 
                required
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                  !fieldValidation.manufacturer.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Nhập tên nhà sản xuất"
                @blur="validateFieldAndUpdate('manufacturer', form.manufacturer)"
                @input="clearFieldValidation('manufacturer')"
              />
              <div v-if="!fieldValidation.manufacturer.isValid && fieldValidation.manufacturer.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.manufacturer.error }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xuất xứ
              </label>
              <input 
                v-model="form.origin"
                type="text" 
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                  !fieldValidation.origin.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Ví dụ: Việt Nam, Hoa Kỳ, Nhật Bản"
                @blur="validateFieldAndUpdate('origin', form.origin)"
                @input="clearFieldValidation('origin')"
              />
              <div v-if="!fieldValidation.origin.isValid && fieldValidation.origin.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.origin.error }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.unit"
                type="text" 
                required
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                  !fieldValidation.unit.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Ví dụ: Hộp 20 viên, Chai 100ml"
                @blur="validateFieldAndUpdate('unit', form.unit)"
                @input="clearFieldValidation('unit')"
              />
              <div v-if="!fieldValidation.unit.isValid && fieldValidation.unit.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.unit.error }}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Thông tin giá
            </h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Giá bán <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  v-model="form.priceValue"
                  type="number" 
                  required
                  min="0"
                  :disabled="isSubmitting"
                  :class="[
                    'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                    isSubmitting ? 'bg-gray-100 cursor-not-allowed' : '',
                    !fieldValidation.priceValue.isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="0"
                  @blur="validateFieldAndUpdate('priceValue', form.priceValue)"
                  @input="clearFieldValidation('priceValue')"
                />
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
              </div>
              <div v-if="!fieldValidation.priceValue.isValid && fieldValidation.priceValue.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-circle mr-1"></i>
                {{ fieldValidation.priceValue.error }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Giảm giá (%)
              </label>
              <input 
                v-model="form.discount"
                type="number" 
                min="0"
                max="100"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
            </div>

            <div v-if="form.discount > 0" class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-sm text-green-800">
                Giá sau giảm: <span class="font-semibold">{{ calculateDiscountedPrice() }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Image Upload -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Hình ảnh sản phẩm
          </h3>

          <!-- Drag & Drop Upload Area -->
          <div 
            ref="dropZone"
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @click="triggerFileInput"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            ]"
          >
            <div class="space-y-4">
              <div class="flex justify-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
                </div>
              </div>
              
              <div class="space-y-2">
                <h4 class="text-lg font-semibold text-gray-900">
                  {{ isDragOver ? 'Thả file để tải lên' : 'Tải lên hình ảnh sản phẩm' }}
                </h4>
                <p class="text-sm text-gray-600">
                  Kéo thả file hình ảnh vào đây hoặc click để chọn file
                </p>
                <p class="text-xs text-gray-500">
                  Hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)
                </p>
              </div>

              <button 
                type="button"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <i class="fas fa-folder-open mr-2"></i>
                Chọn file
              </button>
            </div>

            <!-- Hidden file input -->
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              multiple
              @change="handleFileSelect"
              class="hidden"
            />
          </div>

          <!-- Uploaded Images Gallery -->
          <div v-if="uploadedImages.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-900">Hình ảnh đã tải lên</h4>
              <button 
                @click="clearAllImages"
                type="button"
                class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <i class="fas fa-trash mr-1"></i>
                Xóa tất cả
              </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div 
                v-for="(image, index) in uploadedImages" 
                :key="index"
                class="relative group"
              >
                <div class="relative">
                  <img 
                    :src="image.url" 
                    :alt="`Product image ${index + 1}`"
                    class="w-full h-24 object-cover rounded-lg border-2 transition-all duration-200"
                    :class="[
                      image.isMain 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                    @click="setMainImageLocal(index)"
                  />
                  
                  <!-- Main Image Badge -->
                  <div v-if="image.isMain" class="absolute top-1 left-1">
                    <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      <i class="fas fa-star mr-1"></i>
                      Chính
                    </span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      @click="setMainImageLocal(index)"
                      type="button"
                      class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors duration-200"
                      :title="image.isMain ? 'Đã là ảnh chính' : 'Đặt làm ảnh chính'"
                      :disabled="image.isMain"
                    >
                      <i class="fas fa-star"></i>
                    </button>
                  </div>

                  <!-- Delete Button -->
                  <div class="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      @click="removeImage(index)"
                      type="button"
                      class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      title="Xóa ảnh"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <!-- Image Info -->
                <div class="mt-2 text-center">
                  <p class="text-xs text-gray-600 truncate">{{ image.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(image.size) }}</p>
                </div>
              </div>
            </div>

            <!-- Main Image Preview -->
            <div v-if="mainImage" class="bg-gray-50 rounded-lg p-4">
              <h5 class="text-sm font-semibold text-gray-900 mb-3">Ảnh chính sẽ hiển thị</h5>
              <div class="flex items-center space-x-4">
                <img 
                  :src="mainImage.url" 
                  :alt="mainImage.name"
                  class="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ mainImage.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(mainImage.size) }}</p>
                  <p class="text-xs text-blue-600 mt-1">
                    <i class="fas fa-check-circle mr-1"></i>
                    Ảnh này sẽ được hiển thị làm ảnh chính của sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Individual Image Upload Status -->
          <div v-if="individualImageUploads.size > 0" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-start space-x-3">
              <i class="fas fa-cloud-upload-alt text-blue-500 mt-0.5"></i>
              <div class="flex-1">
                <h4 class="text-blue-800 font-medium mb-2">Trạng thái upload hình ảnh</h4>
                <div class="space-y-2">
                  <div v-for="[fileName, uploadInfo] in individualImageUploads" :key="fileName" class="flex items-center justify-between bg-white rounded-lg p-3">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <i v-if="uploadInfo.status === 'uploading'" class="fas fa-spinner fa-spin text-blue-500"></i>
                        <i v-else-if="uploadInfo.status === 'success'" class="fas fa-check-circle text-green-500"></i>
                        <i v-else-if="uploadInfo.status === 'error'" class="fas fa-exclamation-circle text-red-500"></i>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ fileName }}</p>
                        <p class="text-xs text-gray-600">
                          <span v-if="uploadInfo.status === 'uploading'">Đang tải lên...</span>
                          <span v-else-if="uploadInfo.status === 'success'">Tải lên thành công</span>
                          <span v-else-if="uploadInfo.status === 'error'" class="text-red-600">{{ uploadInfo.error }}</span>
                        </p>
                      </div>
                    </div>
                    <div v-if="uploadInfo.status === 'uploading'" class="flex-shrink-0">
                      <div class="w-16 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" :style="{ width: `${uploadInfo.progress || 0}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                @click="clearUploadStatus"
                type="button"
                class="text-blue-400 hover:text-blue-600 transition-colors duration-200"
              >
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- Additional Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Thông tin bổ sung
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea 
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Mô tả ngắn gọn về sản phẩm"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số lượng tồn kho
              </label>
              <input 
                v-model="form.stockQuantity"
                type="number" 
                min="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn
              </label>
              <input 
                v-model="form.expiryDate"
                type="date" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select 
                v-model="form.status"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu đơn thuốc
              </label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.requiresPrescription" 
                    :value="true"
                    class="mr-2"
                  />
                  <span class="text-sm">Có</span>
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.requiresPrescription" 
                    :value="false"
                    class="mr-2"
                  />
                  <span class="text-sm">Không</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Chi tiết sản phẩm
          </h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Công dụng chính
            </label>
            <textarea 
              v-model="form.uses"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Mô tả công dụng và tác dụng của sản phẩm"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thành phần chính
            </label>
            <div class="space-y-2">
              <div v-for="(ingredient, index) in form.ingredients" :key="index" class="flex gap-2">
                <input 
                  v-model="form.ingredients[index]"
                  type="text" 
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập thành phần"
                />
                <button 
                  @click="removeIngredient(index)"
                  type="button"
                  class="px-3 py-3 text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <button 
                @click="addIngredient"
                type="button"
                class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm thành phần
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hướng dẫn sử dụng
            </label>
            <div class="space-y-2">
              <div v-for="(instruction, index) in form.usageInstructions" :key="index" class="flex gap-2">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mt-3">
                  {{ index + 1 }}
                </span>
                <div class="flex-1 flex gap-2">
                  <input 
                    v-model="form.usageInstructions[index]"
                    type="text" 
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập hướng dẫn sử dụng"
                  />
                  <button 
                    @click="removeInstruction(index)"
                    type="button"
                    class="px-3 py-3 text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <button 
                @click="addInstruction"
                type="button"
                class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm hướng dẫn
              </button>
            </div>
          </div>
        </div>



          </form>

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
              :disabled="isSubmitDisabled"
              class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else-if="imageUploadErrors.length > 0" class="fas fa-exclamation-triangle mr-2"></i>
              <i v-else-if="isEditing && hasPendingImageUploads" class="fas fa-clock mr-2"></i>
              <i v-else :class="isEditing ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
              {{ 
                saving ? 'Đang xử lý...' : 
                imageUploadErrors.length > 0 ? 'Sửa lỗi ảnh trước' :
                (isEditing && hasPendingImageUploads) ? 'Chờ upload ảnh...' :
                (isEditing ? (hasFormChanges ? 'Cập nhật' : 'Không có thay đổi') : 'Tạo mới') 
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Upload Completion Dialog for New Products -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showUploadCompletionDialog" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300" @click.stop>
          <!-- Dialog Header -->
          <div class="px-6 py-5 border-b border-gray-200 rounded-t-2xl">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <i v-if="uploadCompletionResult?.success" class="fas fa-check-circle text-green-500 text-2xl"></i>
                <i v-else class="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ uploadCompletionResult?.success ? 'Tạo sản phẩm thành công!' : 'Sản phẩm đã tạo với lỗi' }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ uploadCompletionResult?.success 
                    ? 'Sản phẩm và hình ảnh đã được tải lên thành công' 
                    : 'Sản phẩm đã được tạo nhưng có lỗi khi tải lên hình ảnh' 
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Dialog Body -->
          <div class="px-6 py-4">
            <div v-if="uploadCompletionResult?.hasErrors" class="space-y-3">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 class="text-yellow-800 font-medium text-sm mb-2">Lỗi upload hình ảnh:</h4>
                <ul class="text-yellow-700 text-xs space-y-1">
                  <li v-for="error in imageUploadErrors" :key="error" class="flex items-start">
                    <i class="fas fa-dot-circle mr-2 mt-0.5 text-xs"></i>
                    <span>{{ error }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 class="text-blue-800 font-medium text-sm mb-1">Bạn có thể:</h4>
                <ul class="text-blue-700 text-xs space-y-1">
                  <li>• Đóng dialog này và tiếp tục sử dụng</li>
                  <li>• Chỉnh sửa sản phẩm để thêm lại hình ảnh</li>
                  <li>• Hình ảnh có thể được thêm sau</li>
                </ul>
              </div>
            </div>
            
            <div v-else class="text-center py-2">
              <p class="text-green-700 text-sm">Tất cả hình ảnh đã được tải lên thành công!</p>
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3 rounded-b-2xl">
            <button 
              v-if="uploadCompletionResult?.hasErrors"
              @click.stop="editProductWithErrors"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <i class="fas fa-edit mr-2"></i>
              Chỉnh sửa sản phẩm
            </button>
            <button 
              @click.stop="closeUploadDialog"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              <i class="fas fa-times mr-2"></i>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useToast } from '../../composables/useToast'
import { useCategories, useLegacyCategories } from '../../composables/useCategories.js'

const { showSuccess, showError } = useToast()
import { useErrorHandler } from '../../composables/useErrorHandler.js'
import { useProductApi } from '../../services/productApi.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  },
  saving: {
    type: Boolean,
    default: false
  },

  formError: {
    type: String,
    default: ''
  },
  fieldErrors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save', 'clear-errors', 'edit-product-with-errors'])

// Use error handler for validation
const { validateField, errors, setFieldError, clearFieldError } = useErrorHandler()

// Use product API for image operations
const { uploadImage, deleteImage, setMainImage } = useProductApi()

// Categories composable - use new system
const { 
  mainCategoryOptions, 
  getSubcategoryOptions, 
  getCategoryInfo, 
  getCategoryHierarchy,
  convertLegacyCategory 
} = useCategories()

// Legacy support for backward compatibility
const { mainCategories, getSubcategories, hasSubcategories } = useLegacyCategories()

const isSubmitting = ref(false)

// Validation state for real-time feedback
const fieldValidation = ref({
  title: { isValid: true, error: '' },
  sku: { isValid: true, error: '' },
  category: { isValid: true, error: '' },
  manufacturer: { isValid: true, error: '' },
  origin: { isValid: true, error: '' },
  unit: { isValid: true, error: '' },
  priceValue: { isValid: true, error: '' },
  stockQuantity: { isValid: true, error: '' },
  expiryDate: { isValid: true, error: '' }
})

// Image upload related reactive variables
const dropZone = ref(null)
const fileInput = ref(null)
const isDragOver = ref(false)
const uploadedImages = ref([])

// Image upload progress tracking
const isUploadingImages = ref(false)
const uploadProgress = ref(0)
const uploadedImageCount = ref(0)
const totalImagesToUpload = ref(0)
const currentUploadStatus = ref('')
const circumference = 2 * Math.PI * 45 // For circular progress bar (radius = 45)

// Image upload error handling
const imageUploadError = ref('')
const imageUploadErrors = ref([])

// Individual image upload status tracking
const individualImageUploads = ref(new Map()) // Map<fileName, {status, progress, error}>

// Upload completion dialog for new products
const showUploadCompletionDialog = ref(false)
const uploadCompletionResult = ref(null) // {success, hasErrors, productId}

const form = ref({
  title: '',
  sku: '',
  category: '',
  subcategory: '',
  manufacturer: '',
  origin: '',
  unit: '',
  priceValue: '',
  discount: 0,
  image: '',
  description: '',
  uses: '',
  ingredients: [''],
  usageInstructions: [''],
  stockQuantity: 0,
  expiryDate: '',
  requiresPrescription: false,
  status: 'active'
})

// Computed property để lấy subcategories dựa trên category đã chọn
const availableSubcategories = computed(() => {
  if (!form.value.category) return []
  return getSubcategoryOptions(form.value.category)
})

// Remove this computed since isEditing is now a prop

// Computed property for main image
const mainImage = computed(() => {
  return uploadedImages.value.find(img => img.isMain) || null
})

// Computed property to check if there are images pending upload
const hasPendingImageUploads = computed(() => {
  return uploadedImages.value.some(img => img.file)
})

// Computed property to check if submit should be disabled
const isSubmitDisabled = computed(() => {
  // Disable if saving
  if (props.saving) return true
  
  // Disable if there are upload errors
  if (imageUploadErrors.value.length > 0) return true
  
  // For editing mode: disable if no changes have been made
  if (props.isEditing && !hasFormChanges.value) return true
  
  // For editing mode: disable if there are pending image uploads
  if (props.isEditing && hasPendingImageUploads.value) return true
  
  return false
})

// Track if user has manually made changes (not just initialization)
const userHasInteracted = ref(false)
const formInitialized = ref(false)

// Track if there are changes in the form or images
const hasFormChanges = computed(() => {
  if (!props.isEditing || !props.product) return false
  
  // Don't show changes until form is properly initialized and user has interacted
  if (!formInitialized.value || !userHasInteracted.value) return false
  
  // Helper function to normalize values for comparison
  const normalize = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue
    return String(value).trim()
  }
  
  const normalizeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') return defaultValue
    return parseInt(value) || defaultValue
  }
  
  const normalizeBoolean = (value, defaultValue = false) => {
    if (value === null || value === undefined) return defaultValue
    return Boolean(value)
  }
  
  // Check form field changes with proper normalization
  const formChanged = 
    normalize(form.value.title) !== normalize(props.product.title) ||
    normalize(form.value.sku) !== normalize(props.product.sku) ||
    normalizeNumber(form.value.category) !== normalizeNumber(props.product.category) ||
    normalizeNumber(form.value.subcategory) !== normalizeNumber(props.product.subcategory) ||
    normalize(form.value.manufacturer) !== normalize(props.product.manufacturer) ||
    normalize(form.value.origin) !== normalize(props.product.origin) ||
    normalize(form.value.unit) !== normalize(props.product.unit) ||
    normalizeNumber(form.value.priceValue) !== normalizeNumber(props.product.priceValue || props.product.price_value) ||
    normalizeNumber(form.value.discount) !== normalizeNumber(props.product.discount) ||
    normalize(form.value.description) !== normalize(props.product.description) ||
    normalize(form.value.uses) !== normalize(props.product.uses) ||
    normalizeNumber(form.value.stockQuantity) !== normalizeNumber(props.product.stockQuantity || props.product.stock_quantity) ||
    normalize(form.value.expiryDate) !== normalize(props.product.expiryDate || props.product.expiry_date) ||
    normalizeBoolean(form.value.requiresPrescription) !== normalizeBoolean(props.product.requiresPrescription || props.product.requires_prescription) ||
    normalize(form.value.status, 'active') !== normalize(props.product.status, 'active')
  
  // Check array changes (ingredients and usage instructions)
  const originalIngredients = Array.isArray(props.product.ingredients) && props.product.ingredients.length > 0 
    ? props.product.ingredients 
    : ['']
  const originalInstructions = Array.isArray(props.product.usageInstructions) && props.product.usageInstructions.length > 0
    ? props.product.usageInstructions
    : Array.isArray(props.product.usage_instructions) && props.product.usage_instructions.length > 0
      ? props.product.usage_instructions
      : ['']
  
  const ingredientsChanged = 
    form.value.ingredients.length !== originalIngredients.length ||
    form.value.ingredients.some((ingredient, index) => normalize(ingredient) !== normalize(originalIngredients[index]))
  
  const instructionsChanged = 
    form.value.usageInstructions.length !== originalInstructions.length ||
    form.value.usageInstructions.some((instruction, index) => normalize(instruction) !== normalize(originalInstructions[index]))
  
  // Check image changes
  const originalImages = Array.isArray(props.product.images) ? props.product.images : []
  const currentImageUrls = uploadedImages.value.filter(img => !img.file).map(img => img.url)
  const hasNewImages = uploadedImages.value.some(img => img.file)
  const hasDeletedImages = originalImages.length !== currentImageUrls.length
  const imageOrderChanged = originalImages.length > 0 && originalImages.some((url, index) => url !== currentImageUrls[index])
  
  const originalMainIndex = normalizeNumber(props.product.mainImageIndex || props.product.main_image_index, 0)
  const currentMainIndex = uploadedImages.value.findIndex(img => img.isMain)
  const mainImageChanged = originalMainIndex !== currentMainIndex && uploadedImages.value.length > 0
  
  const imagesChanged = hasNewImages || hasDeletedImages || imageOrderChanged || mainImageChanged
  
  return formChanged || ingredientsChanged || instructionsChanged || imagesChanged
})

// Helper function to clear field error and validation state
const clearFieldValidation = (fieldName) => {
  clearFieldError(fieldName)
  fieldValidation.value[fieldName].isValid = true
  fieldValidation.value[fieldName].error = ''
}

// Helper function to clear all errors including image upload errors
const clearAllErrors = () => {
  emit('clear-errors')
  imageUploadError.value = ''
  imageUploadErrors.value = []
}

// Clear upload status tracking
const clearUploadStatus = () => {
  individualImageUploads.value.clear()
}

// Handle upload completion dialog
const closeUploadDialog = () => {
  showUploadCompletionDialog.value = false
  uploadCompletionResult.value = null
  emit('close')
}

const editProductWithErrors = () => {
  console.log('editProductWithErrors called')
  // Keep the modal open and show the created product for editing
  // The parent component should handle switching to edit mode
  const productId = uploadCompletionResult.value?.productId
  console.log('Product ID for editing:', productId)
  
  showUploadCompletionDialog.value = false
  uploadCompletionResult.value = null
  
  console.log('Emitting edit-product-with-errors event')
  emit('edit-product-with-errors', productId)
  // Don't emit 'close' event - keep the main modal open
}

// Method for parent component to call after successful product creation
const handleUploadCompletion = (productId, uploadResult) => {
  if (!props.isEditing && uploadResult.hasErrors) {
    uploadCompletionResult.value = { ...uploadResult, productId }
    showUploadCompletionDialog.value = true
    return true // Indicates that modal should stay open
  }
  return false // Indicates that modal can be closed normally
}

// Reset form to initial state
const resetForm = () => {
  form.value = {
    title: '',
    sku: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    origin: '',
    unit: '',
    priceValue: '',
    discount: 0,
    image: '',
    description: '',
    uses: '',
    ingredients: [''],
    usageInstructions: [''],
    stockQuantity: 0,
    expiryDate: '',
    requiresPrescription: false,
    status: 'active'
  }
  
  // Reset uploaded images
  uploadedImages.value = []
  
  // Reset validation state
  Object.keys(fieldValidation.value).forEach(key => {
    fieldValidation.value[key].isValid = true
    fieldValidation.value[key].error = ''
  })
  
  // Clear all errors from error handler
  Object.keys(errors.value).forEach(key => {
    clearFieldError(key)
  })
  
  // Clear image upload errors
  imageUploadError.value = ''
  imageUploadErrors.value = []
  
  // Reset user interaction flag
  userHasInteracted.value = false
  formInitialized.value = false
  
  // Clear upload status tracking
  individualImageUploads.value.clear()
  
  // Reset upload completion dialog
  showUploadCompletionDialog.value = false
  uploadCompletionResult.value = null
}

// Validate individual field
const validateFieldAndUpdate = (fieldName, value) => {
  // Clear previous error for this field
  clearFieldError(fieldName)
  
  // Use the centralized validation which will set errors automatically
  const isValid = validateField(fieldName, value)
  
  // Update local validation state for UI feedback
  fieldValidation.value[fieldName].isValid = isValid
  fieldValidation.value[fieldName].error = errors.value[fieldName] || ''
  
  return isValid
}



// Validate entire form
const validateProductForm = () => {
  const validationRules = [
    { field: 'title', value: form.value.title },
    { field: 'sku', value: form.value.sku },
    { field: 'category', value: form.value.category },
    { field: 'manufacturer', value: form.value.manufacturer },
    { field: 'unit', value: form.value.unit },
    { field: 'priceValue', value: form.value.priceValue },
    { field: 'stockQuantity', value: form.value.stockQuantity },
    { field: 'expiryDate', value: form.value.expiryDate }
  ]
  
  let isFormValid = true
  
  validationRules.forEach(rule => {
    const isValid = validateFieldAndUpdate(rule.field, rule.value)
    if (!isValid) {
      isFormValid = false
    }
  })
  
  return isFormValid
}

// Initialize form when editing
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    // Handle category conversion for editing
    let categoryId = newProduct.category
    let subcategoryId = newProduct.subcategory
    
    // If category is a string (legacy), convert to ID
    if (typeof newProduct.category === 'string' && isNaN(newProduct.category)) {
      const converted = convertLegacyCategory(newProduct.category, newProduct.subcategory)
      if (converted) {
        categoryId = converted.categoryId
        subcategoryId = converted.subcategoryId
      }
    }
    
    form.value = {
      title: newProduct.title || '',
      sku: newProduct.sku || '',
      category: categoryId || '',
      subcategory: subcategoryId || '',
      manufacturer: newProduct.manufacturer || '',
      origin: newProduct.origin || '',
      unit: newProduct.unit || '',
      priceValue: newProduct.priceValue || newProduct.price_value || '',
      discount: newProduct.discount || 0,
      image: newProduct.image || '',
      description: newProduct.description || '',
      uses: newProduct.uses || '',
      ingredients: newProduct.ingredients && newProduct.ingredients.length > 0 ? [...newProduct.ingredients] : [''],
      usageInstructions: newProduct.usageInstructions && newProduct.usageInstructions.length > 0 ? [...newProduct.usageInstructions] : [''],
      stockQuantity: newProduct.stockQuantity || newProduct.stock_quantity || 0,
      expiryDate: newProduct.expiryDate || newProduct.expiry_date || '',
      requiresPrescription: newProduct.requiresPrescription || newProduct.requires_prescription || false,
      status: newProduct.status || 'active'
    }
    
    // Initialize uploaded images if editing
    if (newProduct.images && Array.isArray(newProduct.images) && newProduct.images.length > 0) {
      uploadedImages.value = newProduct.images.map((url, index) => ({
        name: `Product Image ${index + 1}`,
        size: 0,
        type: 'image/url',
        url: url,
        isMain: index === (newProduct.mainImageIndex || newProduct.main_image_index || 0)
      }))
    } else if (newProduct.image) {
      uploadedImages.value = [{
        name: 'Product Image',
        size: 0,
        type: 'image/url',
        url: newProduct.image,
        isMain: true
      }]
    } else {
      uploadedImages.value = []
    }
    
    // Mark form as initialized after a short delay to ensure all reactive updates are complete
    nextTick(() => {
      setTimeout(() => {
        formInitialized.value = true
      }, 100)
    })
  } else {
    // Reset form for new product
    form.value = {
      title: '',
      sku: '',
      category: '',
      subcategory: '',
      manufacturer: '',
      origin: '',
      unit: '',
      priceValue: '',
      discount: 0,
      image: '',
      description: '',
      uses: '',
      ingredients: [''],
      usageInstructions: [''],
      stockQuantity: 0,
      expiryDate: '',
      requiresPrescription: false,
      status: 'active'
    }
    uploadedImages.value = []
    formInitialized.value = false
  }
}, { immediate: true })

// Clear errors when user starts typing and mark as interacted
watch(() => [form.value.title, form.value.category, form.value.manufacturer, form.value.origin, form.value.unit, form.value.priceValue], () => {
  if (props.formError) {
    emit('clear-errors')
  }
  // Mark that user has interacted with the form
  userHasInteracted.value = true
})

// Watch for any form changes to mark user interaction
watch(() => [
  form.value.title, form.value.sku, form.value.category, form.value.subcategory,
  form.value.manufacturer, form.value.origin, form.value.unit, form.value.priceValue,
  form.value.discount, form.value.description, form.value.uses, form.value.stockQuantity,
  form.value.expiryDate, form.value.requiresPrescription, form.value.status,
  form.value.ingredients, form.value.usageInstructions
], () => {
  // Only mark as interacted if we're in editing mode and have a product
  if (props.isEditing && props.product) {
    userHasInteracted.value = true
  }
}, { deep: true })

// Reset form when modal is closed for new product creation
watch(() => props.show, (newShow, oldShow) => {
  // If modal was just closed (from true to false) and we're not editing, reset the form
  if (oldShow && !newShow && !props.isEditing) {
    resetForm()
  }
  
  // Reset user interaction flag when modal opens
  if (newShow && !oldShow) {
    userHasInteracted.value = false
    formInitialized.value = false
  }
})

// Method để xử lý khi category thay đổi
const handleCategoryChange = () => {
  // Reset subcategory khi category thay đổi
  form.value.subcategory = ''
}

// Combined handler for category change
const onCategoryChange = () => {
  handleCategoryChange()
  validateFieldAndUpdate('category', form.value.category)
}

const calculateDiscountedPrice = () => {
  if (!form.value.priceValue || !form.value.discount) return ''
  const discountedPrice = form.value.priceValue * (1 - form.value.discount / 100)
  return discountedPrice.toLocaleString('vi-VN') + 'đ'
}

// Drag and drop methods
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
    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`)
        continue
      }
      
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target.result, // Preview URL for display
          file: file, // Store actual file for upload
          isMain: uploadedImages.value.length === 0 // First image becomes main
        }
        uploadedImages.value.push(imageData)
        
        // Update form.image with the main image URL for preview
        if (imageData.isMain) {
          form.value.image = imageData.url
        }
        
        // If in edit mode and have product ID, upload immediately
        if (props.isEditing && props.product?.id) {
          // Track upload status
          individualImageUploads.value.set(file.name, {
            status: 'uploading',
            progress: 0,
            error: null
          })
          
          try {
            const result = await uploadImage(props.product.id, file)
            
            // Replace the file-based image with server URL
            const imageIndex = uploadedImages.value.findIndex(img => img.file === file)
            if (imageIndex >= 0) {
              uploadedImages.value[imageIndex] = {
                name: file.name,
                size: file.size,
                type: 'image/url',
                url: result.data.imageUrl,
                isMain: imageData.isMain
              }
              
              // Update form.image if this was the main image
              if (imageData.isMain) {
                form.value.image = result.data.imageUrl
              }
              
              // Clear any previous errors for this image since upload was successful
              imageUploadErrors.value = imageUploadErrors.value.filter(error => !error.includes(file.name))
              
              // Clear general upload error if no more specific errors exist
              if (imageUploadErrors.value.length === 0) {
                imageUploadError.value = ''
              }
              
              // Update upload status to success
              individualImageUploads.value.set(file.name, {
                status: 'success',
                progress: 100,
                error: null
              })
            }
          } catch (error) {
            console.error(`Failed to upload image ${file.name}:`, error)
            
            // Extract detailed error information
            let detailedError = 'Không thể tải lên ảnh'
            if (error.errorInfo?.message) {
              detailedError = error.errorInfo.message
            } else if (error.response?.data?.error?.message) {
              detailedError = error.response.data.error.message
            } else if (error.message) {
              detailedError = error.message
            }
            
            // Show error in UI
            imageUploadError.value = `Lỗi tải lên ảnh: ${detailedError}`
            imageUploadErrors.value.push(`Không thể tải lên ảnh "${file.name}": ${detailedError}`)
            
            // Update upload status to error
            individualImageUploads.value.set(file.name, {
              status: 'error',
              progress: 0,
              error: detailedError
            })
          }
        }
      }
      reader.readAsDataURL(file)
    } else {
      showError(`File ${file.name} không phải là hình ảnh.`)
    }
  }
}

const setMainImageLocal = async (index) => {
  // Remove main status from all images
  uploadedImages.value.forEach(img => img.isMain = false)
  
  // Set the selected image as main
  uploadedImages.value[index].isMain = true
  
  // Update form.image with the main image URL
  form.value.image = uploadedImages.value[index].url
  
  // If editing, update main image on server
  if (props.isEditing && props.product?.id) {
    try {
      await setMainImage(props.product.id, index)
    } catch (error) {
      console.error('Failed to set main image on server:', error)
      // Show error in UI
      const errorMessage = error.errorInfo?.message || error.message || 'Không thể đặt ảnh chính'
      imageUploadError.value = `Lỗi đặt ảnh chính: ${errorMessage}`
      imageUploadErrors.value.push(`Không thể đặt ảnh "${uploadedImages.value[index].name}" làm ảnh chính`)
    }
  }
}

const removeImage = async (index) => {
  const removedImage = uploadedImages.value[index]
  
  // Clear any previous upload errors related to this image
  const imageName = removedImage.name
  imageUploadErrors.value = imageUploadErrors.value.filter(error => !error.includes(imageName))
  
  // Clear upload status for this image
  individualImageUploads.value.delete(imageName)
  
  // If we're editing and the image is already uploaded (has no file property), delete from server
  if (props.isEditing && props.product?.id && !removedImage.file) {
    try {
      await deleteImage(props.product.id, index)
    } catch (error) {
      console.error('Failed to delete image from server:', error)
      // Show error in UI but continue with local removal
      const errorMessage = error.errorInfo?.message || error.message || 'Không thể xóa ảnh'
      imageUploadError.value = `Lỗi xóa ảnh: ${errorMessage}`
      imageUploadErrors.value.push(`Không thể xóa ảnh "${removedImage.name}" từ server`)
    }
  }
  
  uploadedImages.value.splice(index, 1)
  
  // Clear general upload error if no more specific errors exist
  if (imageUploadErrors.value.length === 0) {
    imageUploadError.value = ''
  }
  
  // If the removed image was main, set the first remaining image as main
  if (removedImage.isMain && uploadedImages.value.length > 0) {
    uploadedImages.value[0].isMain = true
    form.value.image = uploadedImages.value[0].url
    
    // If editing, update main image on server
    if (props.isEditing && props.product?.id) {
      try {
        await setMainImage(props.product.id, 0)
      } catch (error) {
        console.error('Failed to set main image on server:', error)
        const errorMessage = error.errorInfo?.message || error.message || 'Không thể đặt ảnh chính'
        imageUploadError.value = `Lỗi đặt ảnh chính: ${errorMessage}`
        imageUploadErrors.value.push(`Không thể đặt ảnh "${uploadedImages.value[0].name}" làm ảnh chính`)
      }
    }
  } else if (uploadedImages.value.length === 0) {
    form.value.image = ''
    // Clear all image-related errors when no images left
    imageUploadError.value = ''
    imageUploadErrors.value = []
  }
}

const clearAllImages = () => {
  uploadedImages.value = []
  form.value.image = ''
  // Clear image upload errors when clearing all images
  imageUploadError.value = ''
  imageUploadErrors.value = []
}

// Remove failed images (images that have file property but failed to upload)
const removeFailedImages = () => {
  const successfulImages = uploadedImages.value.filter(img => !img.file)
  uploadedImages.value = successfulImages
  
  // Clear errors after removing failed images
  imageUploadError.value = ''
  imageUploadErrors.value = []
  
  // Update main image if needed
  if (uploadedImages.value.length > 0 && !uploadedImages.value.some(img => img.isMain)) {
    uploadedImages.value[0].isMain = true
    form.value.image = uploadedImages.value[0].url
  } else if (uploadedImages.value.length === 0) {
    form.value.image = ''
  }
}



const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}

const addIngredient = () => {
  form.value.ingredients.push('')
}

const removeIngredient = (index) => {
  if (form.value.ingredients.length > 1) {
    form.value.ingredients.splice(index, 1)
  }
}

const addInstruction = () => {
  form.value.usageInstructions.push('')
}

const removeInstruction = (index) => {
  if (form.value.usageInstructions.length > 1) {
    form.value.usageInstructions.splice(index, 1)
  }
}

// Upload images to product (works for both create and edit)
const uploadProductImages = async (productId, options = {}) => {
  // Check if there are any new images to upload (images with file property)
  const newImagesToUpload = uploadedImages.value.filter(img => img.file)
  
  if (newImagesToUpload.length === 0) {
    console.log('No new images to upload')
    return { success: true, hasErrors: false }
  }

  isUploadingImages.value = true
  uploadProgress.value = 0
  uploadedImageCount.value = 0
  totalImagesToUpload.value = newImagesToUpload.length
  
  // Clear previous errors
  imageUploadError.value = ''
  imageUploadErrors.value = []
  
  let hasUploadErrors = false
  
  try {
    const mainImageIndex = uploadedImages.value.findIndex(img => img.isMain)
    
    // Upload each new image that has a file
    for (let i = 0; i < uploadedImages.value.length; i++) {
      const image = uploadedImages.value[i]
      
      if (image.file) {
        currentUploadStatus.value = `Đang tải lên ${image.name}...`
        
        try {
          const result = await uploadImage(productId, image.file)
          
          // Replace the local file-based image with server URL
          uploadedImages.value[i] = {
            name: image.name,
            size: image.size,
            type: 'image/url',
            url: result.data.imageUrl,
            isMain: image.isMain
          }
          
          uploadedImageCount.value++
          uploadProgress.value = (uploadedImageCount.value / totalImagesToUpload.value) * 100
        } catch (error) {
          console.error(`Failed to upload image ${image.name}:`, error)
          hasUploadErrors = true
          // Show error in UI and continue with other images
          const errorMessage = error.errorInfo?.message || error.message || 'Không thể tải lên ảnh'
          imageUploadError.value = `Lỗi tải lên ảnh: ${errorMessage}`
          imageUploadErrors.value.push(`Không thể tải lên ảnh "${image.name}"`)
        }
      }
    }
    
    // Set main image if specified and it's a newly uploaded image
    const newMainImageIndex = uploadedImages.value.findIndex(img => img.isMain)
    if (newMainImageIndex >= 0) {
      currentUploadStatus.value = 'Đang thiết lập ảnh chính...'
      try {
        await setMainImage(productId, newMainImageIndex)
      } catch (error) {
        console.error('Failed to set main image:', error)
        hasUploadErrors = true
        const errorMessage = error.errorInfo?.message || error.message || 'Không thể đặt ảnh chính'
        imageUploadError.value = `Lỗi đặt ảnh chính: ${errorMessage}`
        imageUploadErrors.value.push('Không thể đặt ảnh chính sau khi tải lên')
      }
    }
    
    if (hasUploadErrors) {
      currentUploadStatus.value = 'Hoàn thành với lỗi'
    } else {
      currentUploadStatus.value = 'Hoàn thành!'
    }
    
    const result = { success: !hasUploadErrors, hasErrors: hasUploadErrors }
    
    // For new products, show completion dialog only if explicitly requested
    if (!props.isEditing && options.showCompletionDialog === true) {
      uploadCompletionResult.value = { ...result, productId }
      showUploadCompletionDialog.value = true
    }
    
    return result
    
  } catch (error) {
    console.error('Error uploading images:', error)
    hasUploadErrors = true
    // Show general upload error
    const errorMessage = error.errorInfo?.message || error.message || 'Có lỗi xảy ra khi tải lên ảnh'
    imageUploadError.value = `Lỗi tải lên ảnh: ${errorMessage}`
    const result = { success: false, hasErrors: true }
    
    // For new products, show completion dialog even on general error, only if explicitly requested
    if (!props.isEditing && options.showCompletionDialog === true) {
      uploadCompletionResult.value = { ...result, productId }
      showUploadCompletionDialog.value = true
    }
    
    return result
  } finally {
    // Reset upload state after a short delay
    setTimeout(() => {
      isUploadingImages.value = false
      uploadProgress.value = 0
      uploadedImageCount.value = 0
      totalImagesToUpload.value = 0
      currentUploadStatus.value = ''
    }, 1000)
  }
}

const handleSubmit = async () => {
  // Prevent multiple submissions
  if (props.saving || isUploadingImages.value) return

  // Clear any previous errors
  emit('clear-errors')
  imageUploadError.value = ''
  imageUploadErrors.value = []

  const validationResult = validateProductForm()

  console.log("validationResult", validationResult)

  // Validate form before submission
  if (!validationResult) {
    console.log('Form validation failed')
    return // Don't submit if validation fails
  }

  // Check if there are specific upload errors that should block submission
  if (imageUploadErrors.value.length > 0) {
    imageUploadError.value = 'Vui lòng sửa lỗi upload hình ảnh trước khi lưu sản phẩm'
    return
  }

  // If there are pending image uploads in edit mode, block submission
  if (hasPendingImageUploads.value && props.isEditing) {
    imageUploadError.value = 'Vui lòng chờ upload hình ảnh hoàn tất trước khi cập nhật sản phẩm'
    return
  }
  
  // For new products with pending uploads, we need to handle upload in this component
  const shouldHandleUploadsHere = hasPendingImageUploads.value && !props.isEditing

  try {
    // Categories are already IDs in the new system
    // No conversion needed unless they're legacy string values
    let categoryId = form.value.category
    let subcategoryId = form.value.subcategory
    
    // If category is a string (legacy), convert to ID
    if (typeof form.value.category === 'string' && isNaN(form.value.category)) {
      const converted = convertLegacyCategory(form.value.category, form.value.subcategory)
      if (converted) {
        categoryId = converted.categoryId
        subcategoryId = converted.subcategoryId
      }
    }
    
    // Prepare product data WITHOUT images for initial creation
    const productData = {
      title: form.value.title,
      sku: form.value.sku || '', // Allow empty SKU for auto-generation
      // ✅ Send IDs directly in category/subcategory fields
      category: categoryId || null,
      subcategory: subcategoryId || null,
      manufacturer: form.value.manufacturer,
      unit: form.value.unit,
      priceValue: parseInt(form.value.priceValue),
      description: form.value.description || null,
      uses: form.value.uses || null,
      ingredients: form.value.ingredients.filter(item => item && item.trim() !== ''),
      usageInstructions: form.value.usageInstructions.filter(item => item && item.trim() !== ''),
      stockQuantity: parseInt(form.value.stockQuantity) || 0,
      expiryDate: form.value.expiryDate || null,
      requiresPrescription: Boolean(form.value.requiresPrescription),
      status: form.value.status || 'active'
    }

    // Debug: Log the payload being sent
    console.log('🚀 Payload being sent to backend:', {
      category: productData.category,        // ✅ Now contains ID
      subcategory: productData.subcategory,  // ✅ Now contains ID
      title: productData.title,
      originalCategoryId: form.value.category,
      originalSubcategoryId: form.value.subcategory
    })
    
    // Step 1: Create/Update product with metadata
    emit('save', productData)
    
    // Step 2: Handle image uploads for both create and edit modes
    // This will be handled by the parent component after successful save
    
  } catch (error) {
    console.error('Error saving product:', error)
    // Error handling is now done in the parent component
    // The error will be displayed in the error alert section
  }
}

// Expose methods for parent component
defineExpose({
  resetForm,
  uploadProductImages,
  handleUploadCompletion
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