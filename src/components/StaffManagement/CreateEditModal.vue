<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i :class="isEditing ? 'fas fa-user-edit' : 'fas fa-user-plus'" class="text-xl"></i>
                <div>
                  <h2 class="text-xl font-semibold">
                    {{ isEditing ? 'Chỉnh sửa thông tin' : 'Thêm nhân viên mới' }}
                  </h2>
                  <p class="text-blue-100 text-sm mt-1">
                    {{ isEditing ? 'Cập nhật thông tin nhân viên' : 'Tạo tài khoản cho nhân viên mới' }}
                  </p>
                  <div v-if="isEditing && hasChanges" class="text-blue-200 text-xs mt-1 flex items-center">
                    <i class="fas fa-info-circle mr-1"></i>
                    <span>Có thay đổi chưa lưu</span>
                  </div>
                </div>
              </div>
              <button
                @click="$emit('close')"
                class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <form @submit.prevent="$emit('save')" class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <!-- Error Alert -->
            <div v-if="formError" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-red-800 font-medium mb-1">Có lỗi xảy ra</h4>
                  <p class="text-red-700 text-sm">{{ formError }}</p>
                  <div v-if="fieldErrors.length > 0" class="mt-2">
                    <ul class="text-red-600 text-xs space-y-1">
                      <li v-for="error in fieldErrors" :key="error" class="flex items-center">
                        <i class="fas fa-dot-circle mr-2 text-xs"></i>
                        {{ error }}
                      </li>
                    </ul>
                  </div>
                </div>
                <button 
                  @click="$emit('clearErrors')"
                  class="text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Full Name -->
            <div class="space-y-2">
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <i class="fas fa-user mr-2 text-gray-400"></i>
                Họ và tên
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input 
                v-model="form.fullName"
                type="text" 
                required
                placeholder="Nhập họ và tên đầy đủ"
                :class="[
                  'w-full px-4 py-3.5 border rounded-xl transition-all duration-200',
                  formValidation.fullName.isValid
                    ? 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    : 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                ]"
                @blur="$emit('validateField', 'fullName')"
                @input="$emit('clearFieldError', 'fullName')"
              />
              <div v-if="!formValidation.fullName.isValid && formValidation.fullName.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                {{ formValidation.fullName.error }}
              </div>
            </div>
            
            <!-- Email -->
            <div class="space-y-2">
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <i class="fas fa-envelope mr-2 text-gray-400"></i>
                Địa chỉ email
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input 
                v-model="form.email"
                type="email" 
                required
                placeholder="example@pharmacy.com"
                :class="[
                  'w-full px-4 py-3.5 border rounded-xl transition-all duration-200',
                  formValidation.email.isValid
                    ? 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    : 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                ]"
                @blur="$emit('validateField', 'email')"
                @input="$emit('clearFieldError', 'email')"
              />
              <div v-if="!formValidation.email.isValid && formValidation.email.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                {{ formValidation.email.error }}
              </div>
            </div>
            
            <!-- Phone -->
            <div class="space-y-2">
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <i class="fas fa-phone mr-2 text-gray-400"></i>
                Số điện thoại
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input 
                v-model="form.phone"
                type="tel" 
                required
                placeholder="0xxx xxx xxx"
                :class="[
                  'w-full px-4 py-3.5 border rounded-xl transition-all duration-200',
                  formValidation.phone.isValid
                    ? 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    : 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                ]"
                @blur="$emit('validateField', 'phone')"
                @input="$emit('clearFieldError', 'phone')"
              />
              <div v-if="!formValidation.phone.isValid && formValidation.phone.error" class="text-red-600 text-xs flex items-center mt-1">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                {{ formValidation.phone.error }}
              </div>
              <div class="text-xs text-gray-500 flex items-center mt-1">
                <i class="fas fa-info-circle mr-1"></i>
                Định dạng: 0xxx xxx xxx (số điện thoại Việt Nam)
              </div>
            </div>

            <!-- Status (Only for editing) -->
            <div v-if="isEditing" class="space-y-2">
              <label class="flex items-center text-sm font-semibold text-gray-700">
                <i class="fas fa-toggle-on mr-2 text-gray-400"></i>
                Trạng thái hoạt động
              </label>
              <div class="flex items-center space-x-3">
                <label class="flex items-center cursor-pointer">
                  <input 
                    v-model="form.isActive" 
                    type="radio" 
                    :value="true"
                    class="sr-only"
                  />
                  <div :class="[
                    'w-4 h-4 rounded-full border-2 mr-2 transition-colors duration-200',
                    form.isActive === true ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  ]">
                    <div v-if="form.isActive === true" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  </div>
                  <span class="text-sm text-gray-700">Đang hoạt động</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input 
                    v-model="form.isActive" 
                    type="radio" 
                    :value="false"
                    class="sr-only"
                  />
                  <div :class="[
                    'w-4 h-4 rounded-full border-2 mr-2 transition-colors duration-200',
                    form.isActive === false ? 'bg-red-500 border-red-500' : 'border-gray-300'
                  ]">
                    <div v-if="form.isActive === false" class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  </div>
                  <span class="text-sm text-gray-700">Tạm dừng</span>
                </label>
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
              @click="$emit('save')"
              :disabled="!isFormValid || saving"
              class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else :class="isEditing ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
              {{ saving ? 'Đang xử lý...' : (isEditing ? (hasChanges ? 'Cập nhật' : 'Không có thay đổi') : 'Tạo mới') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  formValidation: {
    type: Object,
    required: true
  },
  formError: {
    type: String,
    default: ''
  },
  fieldErrors: {
    type: Array,
    default: () => []
  },
  saving: {
    type: Boolean,
    default: false
  },
  isFormValid: {
    type: Boolean,
    default: false
  },
  hasChanges: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'close',
  'save',
  'validateField',
  'clearFieldError',
  'clearErrors'
])
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