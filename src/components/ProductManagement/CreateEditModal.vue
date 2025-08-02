<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ isEditing ? 'Cập nhật thông tin sản phẩm' : 'Nhập thông tin sản phẩm mới' }}
          </p>
        </div>
        <button 
          @click="$emit('close')"
          :disabled="isSubmitting"
          :class="[
            'transition-colors duration-200',
            isSubmitting ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Loading overlay -->
      <div v-if="isSubmitting" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-sm text-gray-600 mt-2">Đang lưu sản phẩm...</span>
          <p class="text-xs text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
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
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mã sản phẩm
              </label>
              <input 
                v-model="form.sku"
                type="text" 
w                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
                placeholder="Nhập mã sản phẩm (SKU) - Để trống để tự động tạo"
              />
              <p class="text-xs text-gray-500 mt-1">Để trống để hệ thống tự động tạo mã sản phẩm</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.category"
                @change="handleCategoryChange"
                required
                :disabled="isSubmitting"
                :class="[
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
              >
                <option value="">Chọn danh mục</option>
                <option v-for="category in mainCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div v-if="form.category && hasSubcategories(form.category)">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục con
              </label>
              <select 
                v-model="form.subcategory"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Chọn danh mục con (tùy chọn)</option>
                <option v-for="subcategory in availableSubcategories" :key="subcategory" :value="subcategory">
                  {{ subcategory }}
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
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
                placeholder="Nhập tên nhà sản xuất"
              />
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
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                ]"
                placeholder="Ví dụ: Hộp 20 viên, Chai 100ml"
              />
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
                    'w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                    isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                  ]"
                  placeholder="0"
                />
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
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
                    @click="setMainImage(index)"
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
                      @click="setMainImage(index)"
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

          <!-- URL Input (Alternative) -->
          <div class="border-t border-gray-200 pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hoặc nhập URL hình ảnh
            </label>
            <div class="flex gap-2">
              <input 
                v-model="imageUrl"
                type="url" 
                placeholder="https://example.com/image.jpg"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                @keyup.enter="addImageFromUrl"
              />
              <button 
                @click="addImageFromUrl"
                type="button"
                class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                :disabled="!imageUrl"
              >
                <i class="fas fa-plus"></i>
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mô tả sản phẩm
              </label>
              <textarea 
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Mô tả chi tiết về sản phẩm"
              ></textarea>
            </div>
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

        <!-- Error Display -->
        <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm text-red-600 font-medium">{{ submitError }}</p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button 
            type="button"
            @click="$emit('close')"
            :disabled="isSubmitting"
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-all duration-200',
              isSubmitting 
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            ]"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo sản phẩm') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { mainCategories, getSubcategories, hasSubcategories } from '../../constants/categories.js'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isSubmitting = ref(false)
const submitError = ref('')

// Image upload related reactive variables
const dropZone = ref(null)
const fileInput = ref(null)
const isDragOver = ref(false)
const uploadedImages = ref([])
const imageUrl = ref('')

const form = ref({
  title: '',
  sku: '',
  category: '',
  subcategory: '',
  manufacturer: '',
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
  return getSubcategories(form.value.category)
})

const isEditing = computed(() => !!props.product)

// Computed property for main image
const mainImage = computed(() => {
  return uploadedImages.value.find(img => img.isMain) || null
})

// Initialize form when editing
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = {
      title: newProduct.title || '',
      sku: newProduct.sku || '',
      category: newProduct.category || '',
      subcategory: newProduct.subcategory || '',
      manufacturer: newProduct.manufacturer || '',
      unit: newProduct.unit || '',
      priceValue: newProduct.priceValue || '',
      discount: newProduct.discount || 0,
      image: newProduct.image || '',
      description: newProduct.description || '',
      uses: newProduct.uses || '',
      ingredients: newProduct.ingredients && newProduct.ingredients.length > 0 ? [...newProduct.ingredients] : [''],
      usageInstructions: newProduct.usageInstructions && newProduct.usageInstructions.length > 0 ? [...newProduct.usageInstructions] : [''],
      stockQuantity: newProduct.stockQuantity || 0,
      expiryDate: newProduct.expiryDate || '',
      requiresPrescription: newProduct.requiresPrescription || false,
      status: newProduct.status || 'active'
    }
    
    // Initialize uploaded images if editing
    if (newProduct.images && newProduct.images.length > 0) {
      uploadedImages.value = newProduct.images.map((url, index) => ({
        name: `Product Image ${index + 1}`,
        size: 0,
        type: 'image/url',
        url: url,
        isMain: index === (newProduct.mainImageIndex || 0)
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
  } else {
    // Reset form for new product
    form.value = {
      title: '',
      sku: '',
      category: '',
      subcategory: '',
      manufacturer: '',
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
  }
  imageUrl.value = ''
}, { immediate: true })

// Clear submit error when user starts typing
watch(() => [form.value.title, form.value.category, form.value.manufacturer, form.value.unit, form.value.priceValue], () => {
  if (submitError.value) {
    submitError.value = ''
  }
})

// Method để xử lý khi category thay đổi
const handleCategoryChange = () => {
  // Reset subcategory khi category thay đổi
  form.value.subcategory = ''
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

const processFiles = (files) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`)
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target.result,
          isMain: uploadedImages.value.length === 0 // First image becomes main
        }
        uploadedImages.value.push(imageData)
        
        // Update form.image with the main image URL
        if (imageData.isMain) {
          form.value.image = imageData.url
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert(`File ${file.name} không phải là hình ảnh.`)
    }
  })
}

const setMainImage = (index) => {
  // Remove main status from all images
  uploadedImages.value.forEach(img => img.isMain = false)
  
  // Set the selected image as main
  uploadedImages.value[index].isMain = true
  
  // Update form.image with the main image URL
  form.value.image = uploadedImages.value[index].url
}

const removeImage = (index) => {
  const removedImage = uploadedImages.value[index]
  uploadedImages.value.splice(index, 1)
  
  // If the removed image was main, set the first remaining image as main
  if (removedImage.isMain && uploadedImages.value.length > 0) {
    uploadedImages.value[0].isMain = true
    form.value.image = uploadedImages.value[0].url
  } else if (uploadedImages.value.length === 0) {
    form.value.image = ''
  }
}

const clearAllImages = () => {
  uploadedImages.value = []
  form.value.image = ''
}

const addImageFromUrl = () => {
  if (!imageUrl.value.trim()) return
  
  const imageData = {
    name: 'External Image',
    size: 0,
    type: 'image/url',
    url: imageUrl.value.trim(),
    isMain: uploadedImages.value.length === 0
  }
  
  uploadedImages.value.push(imageData)
  
  if (imageData.isMain) {
    form.value.image = imageData.url
  }
  
  imageUrl.value = ''
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

const handleSubmit = async () => {
  // Prevent multiple submissions
  if (isSubmitting.value) return

  // Clear any previous errors
  submitError.value = ''

  // Validate required fields
  if (!form.value.title || !form.value.category || !form.value.manufacturer || 
      !form.value.unit || !form.value.priceValue) {
    submitError.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  // Validate price value
  if (isNaN(form.value.priceValue) || parseInt(form.value.priceValue) <= 0) {
    submitError.value = 'Giá sản phẩm phải là số dương'
    return
  }

  isSubmitting.value = true

  try {
    // Prepare product data matching backend expectations
    const productData = {
      title: form.value.title,
      sku: form.value.sku,
      category: form.value.category,
      subcategory: form.value.subcategory,
      manufacturer: form.value.manufacturer,
      unit: form.value.unit,
      priceValue: parseInt(form.value.priceValue),
      // Remove price field as backend calculates it from priceValue
      discount: parseInt(form.value.discount) || 0,
      // Handle images properly - convert single image to array if needed
      images: uploadedImages.value.length > 0 
        ? uploadedImages.value.map(img => img.url)
        : form.value.image ? [form.value.image] : [],
      mainImageIndex: uploadedImages.value.findIndex(img => img.isMain) >= 0 
        ? uploadedImages.value.findIndex(img => img.isMain) 
        : 0,
      description: form.value.description,
      uses: form.value.uses,
      ingredients: form.value.ingredients.filter(item => item.trim() !== ''),
      usageInstructions: form.value.usageInstructions.filter(item => item.trim() !== ''),
      stockQuantity: parseInt(form.value.stockQuantity) || 0,
      expiryDate: form.value.expiryDate || null,
      requiresPrescription: form.value.requiresPrescription,
      status: form.value.status
    }

    // Emit the save event and wait for the parent to handle it
    await emit('save', productData)
    
    // If we reach here, the save was successful (no error thrown)
    // The parent will close the modal on success
    
  } catch (error) {
    console.error('Error saving product:', error)
    
    // Check if it's a validation error or API error
    if (error.message) {
      submitError.value = error.message
    } else {
      submitError.value = 'Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Custom styles for the modal */
.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 