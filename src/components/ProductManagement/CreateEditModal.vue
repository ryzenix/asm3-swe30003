<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nhập mã sản phẩm (SKU)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="form.category"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Chọn danh mục</option>
                <option value="Người trưởng thành">Người trưởng thành</option>
                <option value="Trẻ em">Trẻ em</option>
                <option value="Người cao tuổi">Người cao tuổi</option>
                <option value="Khẩu trang y tế">Khẩu trang y tế</option>
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                URL hình ảnh chính
              </label>
              <input 
                v-model="form.image"
                type="url" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tải lên hình ảnh
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-600 mt-2">Kéo thả hoặc click để chọn file</p>
                <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
              </div>
            </div>
          </div>

          <!-- Image Preview -->
          <div v-if="form.image" class="flex items-center gap-4">
            <img 
              :src="form.image" 
              alt="Product preview" 
              class="w-20 h-20 object-cover rounded-lg border border-gray-200"
              @error="handleImageError"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Xem trước hình ảnh</p>
              <p class="text-xs text-gray-500">Hình ảnh sẽ được hiển thị trên trang sản phẩm</p>
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

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button 
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
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

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isSubmitting = ref(false)

const form = ref({
  title: '',
  sku: '',
  category: '',
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

const isEditing = computed(() => !!props.product)

// Initialize form when editing
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = {
      title: newProduct.title || '',
      sku: newProduct.sku || '',
      category: newProduct.category || '',
      manufacturer: newProduct.manufacturer || '',
      unit: newProduct.unit || '',
      priceValue: newProduct.priceValue || '',
      discount: newProduct.discount || 0,
      image: newProduct.image || '',
      description: newProduct.description || '',
      uses: newProduct.uses || '',
      ingredients: newProduct.ingredients || [''],
      usageInstructions: newProduct.usageInstructions || [''],
      stockQuantity: newProduct.stockQuantity || 0,
      expiryDate: newProduct.expiryDate || '',
      requiresPrescription: newProduct.requiresPrescription || false,
      status: newProduct.status || 'active'
    }
  } else {
    // Reset form for new product
    form.value = {
      title: '',
      sku: '',
      category: '',
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
  }
}, { immediate: true })

const calculateDiscountedPrice = () => {
  if (!form.value.priceValue || !form.value.discount) return ''
  const discountedPrice = form.value.priceValue * (1 - form.value.discount / 100)
  return discountedPrice.toLocaleString('vi-VN') + 'đ'
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // In a real app, you would upload to a server and get the URL
    // For now, we'll create a local URL
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
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
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    // Validate required fields
    if (!form.value.title || !form.value.category || !form.value.manufacturer || 
        !form.value.unit || !form.value.priceValue) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    // Format price for display
    const formattedPrice = parseInt(form.value.priceValue).toLocaleString('vi-VN') + 'đ'

    const productData = {
      title: form.value.title,
      sku: form.value.sku,
      category: form.value.category,
      manufacturer: form.value.manufacturer,
      unit: form.value.unit,
      priceValue: parseInt(form.value.priceValue),
      price: formattedPrice,
      discount: parseInt(form.value.discount) || 0,
      image: form.value.image || '/img/products/placeholder-product.jpg',
      description: form.value.description,
      uses: form.value.uses,
      ingredients: form.value.ingredients.filter(item => item.trim() !== ''),
      usageInstructions: form.value.usageInstructions.filter(item => item.trim() !== ''),
      stockQuantity: parseInt(form.value.stockQuantity) || 0,
      expiryDate: form.value.expiryDate,
      requiresPrescription: form.value.requiresPrescription,
      status: form.value.status
    }

    emit('save', productData)
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Có lỗi xảy ra khi lưu sản phẩm')
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