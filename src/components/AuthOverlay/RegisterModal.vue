<template>
  <div class="bg-white rounded-xl shadow-xl p-6 text-gray-800 max-h-[90vh] overflow-y-auto relative">
    <!-- Loading overlay -->
    <div v-if="isLoading"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="text-sm text-gray-600 mt-2">Đang tạo tài khoản...</p>
      </div>
    </div>

    <!-- Registration Form -->
    <div v-if="!showSuccess">
      <!-- Back + Title -->
      <div class="flex items-center mb-4">
        <button @click="$emit('back')"
          class="mr-3 p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          title="Quay lại đăng nhập">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 class="text-xl font-semibold">Tạo tài khoản mới</h2>
          <p class="text-sm text-gray-500">Tham gia cộng đồng nhà thuốc Long Châu ngay hôm nay</p>
        </div>
      </div>

      <!-- Benefits section -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-sm font-medium text-green-800 mb-2 flex items-center">
          <span class="mr-2">🎉</span>
          Ưu đãi dành cho thành viên mới:
        </h3>
        <ul class="text-sm text-green-700 space-y-1">
          <li class="flex items-center"><span class="mr-2 text-green-600">•</span>Giảm 10% cho đơn hàng đầu tiên</li>
          <li class="flex items-center"><span class="mr-2 text-green-600">•</span>Tích điểm với mỗi giao dịch</li>
          <li class="flex items-center"><span class="mr-2 text-green-600">•</span>Nhận thông báo khuyến mãi độc quyền
          </li>
          <li class="flex items-center"><span class="mr-2 text-green-600">•</span>Theo dõi đơn hàng dễ dàng</li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <!-- Full Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên <span class="text-red-500">*</span>
          </label>
          <input v-model="form.fullName" type="text" placeholder="Nhập họ và tên đầy đủ" :class="[
              'w-full border rounded-lg px-4 py-3 focus:outline-none transition-all',
              errors.fullName 
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            ]" @blur="validateField('fullName')" @input="clearFieldError('fullName')" autocomplete="name" />
          <p v-if="errors.fullName" class="text-xs text-red-500 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.fullName }}
          </p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input v-model="form.email" type="email" placeholder="example@email.com" :class="[
              'w-full border rounded-lg px-4 py-3 focus:outline-none transition-all',
              errors.email 
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            ]" @blur="validateField('email')" @input="clearFieldError('email')" autocomplete="email" />
          <p v-if="errors.email" class="text-xs text-red-500 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.email }}
          </p>
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span class="text-red-500">*</span>
          </label>
          <input v-model="form.phone" type="tel" placeholder="0xxx xxx xxx" :class="[
              'w-full border rounded-lg px-4 py-3 focus:outline-none transition-all',
              errors.phone 
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            ]" @blur="validateField('phone')" @input="clearFieldError('phone')" maxlength="15" autocomplete="tel" />
          <p v-if="errors.phone" class="text-xs text-red-500 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.phone }}
          </p>
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Tối thiểu 8 ký tự"
              :class="[
                'w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none transition-all',
                errors.password 
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                  : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
              ]" @blur="validateField('password')" @input="clearFieldError('password')" autocomplete="new-password" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              tabindex="-1">
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>

          <!-- Password strength indicator -->
          <div v-if="form.password" class="mt-2">
            <div class="flex gap-1 mb-1">
              <div v-for="i in 4" :key="i" :class="[
                  'h-1 rounded-full flex-1 transition-colors',
                  passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                ]"></div>
            </div>
            <p :class="['text-xs', getStrengthTextColor(passwordStrength)]">
              {{ getStrengthText(passwordStrength) }}
            </p>
          </div>

          <p v-if="errors.password" class="text-xs text-red-500 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.password }}
          </p>
          <p v-else class="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu <span class="text-red-500">*</span>
          </label>
          <input v-model="form.confirmPassword" type="password" placeholder="Nhập lại mật khẩu" :class="[
              'w-full border rounded-lg px-4 py-3 focus:outline-none transition-all',
              errors.confirmPassword 
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            ]" @blur="validateField('confirmPassword')" @input="clearFieldError('confirmPassword')" autocomplete="new-password" />
          <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.confirmPassword }}
          </p>
          <p v-else-if="form.password && form.confirmPassword && form.password === form.confirmPassword"
            class="text-xs text-green-600 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
            Mật khẩu khớp
          </p>
        </div>

        <!-- Date of Birth -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh
          </label>
          <input v-model="form.dateOfBirth" type="date" :max="maxDate" :class="[
              'w-full border rounded-lg px-4 py-3 focus:outline-none transition-all',
              errors.dateOfBirth 
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            ]" @blur="validateField('dateOfBirth')" @input="clearFieldError('dateOfBirth')" />
          <p v-if="errors.dateOfBirth" class="text-xs text-red-500 mt-1 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.dateOfBirth }}
          </p>
        </div>

        <!-- Gender -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input v-model="form.gender" type="radio" value="male" class="mr-2 text-green-600 focus:ring-green-500">
              <span class="text-sm">Nam</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input v-model="form.gender" type="radio" value="female" class="mr-2 text-green-600 focus:ring-green-500">
              <span class="text-sm">Nữ</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input v-model="form.gender" type="radio" value="other" class="mr-2 text-green-600 focus:ring-green-500">
              <span class="text-sm">Khác</span>
            </label>
          </div>
        </div>

        <!-- Terms and Privacy -->
        <div class="mb-4">
          <label class="flex items-start cursor-pointer group">
            <input v-model="form.agreeTerms" type="checkbox" :class="[
                'mr-3 mt-0.5 text-green-600 focus:ring-green-500',
                errors.agreeTerms ? 'border-red-300' : ''
              ]" @change="clearFieldError('agreeTerms')">
            <span class="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
              Tôi đồng ý với
              <a href="#" class="text-green-600 hover:text-green-700 hover:underline font-medium">Điều khoản sử dụng</a>
              và
              <a href="#" class="text-green-600 hover:text-green-700 hover:underline font-medium">Chính sách bảo mật</a>
              của Nhà thuốc Long Châu
              <span class="text-red-500">*</span>
            </span>
          </label>
          <p v-if="errors.agreeTerms" class="text-xs text-red-500 mt-1 ml-8 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            {{ errors.agreeTerms }}
          </p>
        </div>

        <!-- Marketing consent -->
        <div class="mb-6">
          <label class="flex items-start cursor-pointer group">
            <input v-model="form.agreeMarketing" type="checkbox"
              class="mr-3 mt-0.5 text-green-600 focus:ring-green-500">
            <span class="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              Tôi muốn nhận thông báo về khuyến mãi và sản phẩm mới từ Nhà thuốc Long Châu
            </span>
          </label>
        </div>

        <!-- API Error Display -->
        <div v-if="apiError.message" class="mb-4 p-3 rounded-lg" :class="getErrorDisplayClass(apiError.code)">
          <div class="flex items-start">
            <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium">{{ apiError.message }}</p>
              <!-- Show additional error details if available -->
              <div v-if="apiError.details" class="mt-1">
                <p class="text-xs">{{ apiError.details }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Register button -->
        <button type="submit" :class="[
            'w-full font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform',
            isFormValid && !isLoading
              ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]" :disabled="!isFormValid || isLoading">
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Đang tạo tài khoản...
          </span>
          <span v-else>Tạo tài khoản miễn phí</span>
        </button>

        <!-- Login redirect -->
        <p class="text-sm text-center text-gray-600 mt-4">
          Đã có tài khoản?
          <button type="button"
            class="text-green-600 hover:text-green-700 hover:underline font-medium ml-1 transition-colors"
            @click="$emit('back')">
            Đăng nhập ngay
          </button>
        </p>
      </form>
    </div>

    <!-- Success Screen -->
    <div v-else class="text-center py-8">
      <!-- Success Animation -->
      <div class="mb-6">
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Chào mừng bạn đến với Long Châu!</h2>
        <p class="text-gray-600 mb-1">Tài khoản của bạn đã được tạo thành công</p>
        <p class="text-sm text-green-600 font-medium">{{ successMessage }}</p>
      </div>

      <!-- User Info -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <h3 class="font-medium text-gray-800 mb-3">Thông tin tài khoản:</h3>
        <div class="space-y-2 text-sm">
          <div class="flex">
            <span class="text-gray-600 w-20">Tên:</span>
            <span class="text-gray-800 font-medium">{{ registeredUser?.fullName }}</span>
          </div>
          <div class="flex">
            <span class="text-gray-600 w-20">Email:</span>
            <span class="text-gray-800 font-medium">{{ registeredUser?.email }}</span>
          </div>
          <div class="flex">
            <span class="text-gray-600 w-20">Điện thoại:</span>
            <span class="text-gray-800 font-medium">{{ registeredUser?.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Benefits Reminder -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-sm font-medium text-green-800 mb-2 flex items-center justify-center">
          <span class="mr-2">🎉</span>
          Những ưu đãi đã sẵn sàng cho bạn:
        </h3>
        <ul class="text-sm text-green-700 space-y-1">
          <li class="flex items-center justify-center"><span class="mr-2 text-green-600">•</span>Mã giảm giá 10% cho đơn
            hàng đầu tiên</li>
          <li class="flex items-center justify-center"><span class="mr-2 text-green-600">•</span>Tích điểm ngay từ lần
            mua đầu tiên</li>
        </ul>
      </div>

      <!-- Action Button -->
      <button @click="closeModal"
        class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
        Bắt đầu mua sắm ngay
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['back', 'close', 'auth-success'])

// Error code to Vietnamese message mapping (matching backend ERROR_CODES)
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Thông tin không hợp lệ',
  AUTHENTICATION_FAILED: 'Email hoặc mật khẩu không chính xác',
  AUTHORIZATION_FAILED: 'Không có quyền truy cập',
  USER_NOT_FOUND: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa',
  USER_EXISTS: 'Email này đã được sử dụng',
  RATE_LIMITED: 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau',
  MISSING_FIELDS: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
  INVALID_FORMAT: 'Định dạng không hợp lệ',  
  PASSWORD_WEAK: 'Mật khẩu không đủ mạnh',
  ACCOUNT_BLOCKED: 'Tài khoản đã bị khóa tạm thời'
}

// Form state
const showPassword = ref(false)
const isLoading = ref(false)
const apiError = ref({})
const showSuccess = ref(false)
const registeredUser = ref(null)
const successMessage = ref('')

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  gender: '',
  agreeTerms: false,
  agreeMarketing: false
})

const errors = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  agreeTerms: ''
})

// Maximum date (18 years ago from today)
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date.toISOString().split('T')[0]
})

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  return Math.min(strength, 4)
})

const getStrengthColor = (strength) => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  return colors[strength - 1] || 'bg-gray-200'
}

const getStrengthTextColor = (strength) => {
  const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600']
  return colors[strength - 1] || 'text-gray-500'
}

const getStrengthText = (strength) => {
  const texts = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh']
  return texts[strength - 1] || ''
}

// Validation rules
const validationRules = {
  fullName: (value) => {
    if (!value.trim()) return 'Họ và tên là bắt buộc'
    if (value.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự'
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) return 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
    return ''
  },

  email: (value) => {
    if (!value.trim()) return 'Email là bắt buộc'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Email không hợp lệ'
    return ''
  },

  phone: (value) => {
    if (!value.trim()) return 'Số điện thoại là bắt buộc'
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]\d{8}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Số điện thoại không hợp lệ'
    return ''
  },

  password: (value) => {
    if (!value) return 'Mật khẩu là bắt buộc'
    if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự'
    return ''
  },

  confirmPassword: (value) => {
    if (!value) return 'Xác nhận mật khẩu là bắt buộc'
    if (value !== form.value.password) return 'Mật khẩu không khớp'
    return ''
  },

  dateOfBirth: (value) => {
    if (!value) return ''
    const birthDate = new Date(value)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 18) return 'Bạn phải từ 18 tuổi trở lên'
    if (age > 120) return 'Ngày sinh không hợp lệ'
    return ''
  },

  agreeTerms: (value) => {
    if (!value) return 'Bạn phải đồng ý với điều khoản sử dụng'
    return ''
  }
}

// Error handling utilities (matching LoginModal pattern)
const getErrorMessage = (errorCode, fallbackMessage = '') => {
  return ERROR_MESSAGES[errorCode] || fallbackMessage || 'Có lỗi xảy ra. Vui lòng thử lại'
}

const getErrorDisplayClass = (errorCode) => {
  const baseClasses = 'border'
  
  switch (errorCode) {
    case 'USER_EXISTS':
      return `${baseClasses} bg-orange-50 border-orange-200 text-orange-600`
    case 'MISSING_FIELDS':
    case 'INVALID_FORMAT':
    case 'VALIDATION_ERROR':
      return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-600`
    case 'PASSWORD_WEAK':
      return `${baseClasses} bg-red-50 border-red-200 text-red-600`
    case 'SERVER_ERROR':
      return `${baseClasses} bg-gray-50 border-gray-200 text-gray-600`
    default:
      return `${baseClasses} bg-red-50 border-red-200 text-red-600`
  }
}

// Validate individual field
const validateField = (fieldName) => {
  const rule = validationRules[fieldName]
  if (rule) {
    errors.value[fieldName] = rule(form.value[fieldName])
  }
}

// Clear field error
const clearFieldError = (fieldName) => {
  errors.value[fieldName] = ''
  apiError.value = {}
}

// Validate all fields
const validateForm = () => {
  let isValid = true

  Object.keys(validationRules).forEach(fieldName => {
    validateField(fieldName)
    if (errors.value[fieldName]) {
      isValid = false
    }
  })

  return isValid
}

// Form validity check
const isFormValid = computed(() => {
  return form.value.fullName &&
    form.value.email &&
    form.value.phone &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.password === form.value.confirmPassword &&
    form.value.password.length >= 8 &&
    form.value.agreeTerms &&
    !Object.values(errors.value).some(error => error)
})

// Watch for password changes to revalidate confirm password
watch(() => form.value.password, () => {
  if (form.value.confirmPassword && errors.value.confirmPassword) {
    validateField('confirmPassword')
  }
})

// API Service Functions
const checkEmailExists = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/auth/user/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to check email')
    }

    return data.data?.exists || false
  } catch (error) {
    console.error('Email check error:', error)
    return false
  }
}

const registerUser = async (userData) => {
  const response = await fetch('http://localhost:3000/auth/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData)
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.error?.message || 'Registration failed')
    error.errorData = data.error || {}
    error.status = response.status
    throw error
  }

  return data
}

// Prepare data for API call
const prepareApiData = () => {
  return {
    fullName: form.value.fullName.trim(),
    email: form.value.email.trim().toLowerCase(),
    phone: form.value.phone.replace(/\s/g, ''),
    password: form.value.password,
    dateOfBirth: form.value.dateOfBirth || null,
    gender: form.value.gender || null,
    role: 'client' // Default role for pharmacy customers
  }
}

// Handle standardized API errors (matching LoginModal pattern)
const handleApiError = (error) => {
  console.error('API Error:', error)
  
  const errorData = error.errorData || {}
  const errorCode = errorData.code
  const errorMessage = getErrorMessage(errorCode, errorData.message)
  
  // Update API error display
  apiError.value = {
    ...errorData,
    code: errorCode,
    message: errorMessage
  }

  // Handle specific error types
  switch (errorCode) {
    case 'USER_EXISTS':
      errors.value.email = errorMessage
      break
      
    case 'MISSING_FIELDS':
      // Highlight missing fields
      if (errorData.fields && Array.isArray(errorData.fields)) {
        errorData.fields.forEach(field => {
          if (validationRules[field]) {
            const fieldName = {
              email: 'Email',
              password: 'Mật khẩu',
              fullName: 'Họ và tên',
              phone: 'Số điện thoại'
            }[field] || field
            errors.value[field] = `${fieldName} là bắt buộc`
          }
        })
      }
      break
      
    case 'INVALID_FORMAT':
      if (errorData.field) {
        errors.value[errorData.field] = errorMessage
      }
      break
      
    case 'PASSWORD_WEAK':
      errors.value.password = errorMessage
      break
      
    case 'VALIDATION_ERROR':
      if (errorData.field) {
        errors.value[errorData.field] = errorMessage
      }
      break
  }
}

// Handle form submission
const handleSubmit = async () => {
  // Clear previous errors
  apiError.value = {}

  // Validate form
  if (!validateForm()) {
    const firstErrorField = Object.keys(errors.value).find(key => errors.value[key])
    if (firstErrorField) {
      document.querySelector(`input[v-model*="${firstErrorField}"]`)?.focus()
    }
    return
  }

  if (!isFormValid.value) return

  isLoading.value = true

  try {
    // Check email availability before registration
    const emailExists = await checkEmailExists(form.value.email)
    if (emailExists) {
      errors.value.email = 'Email này đã được sử dụng'
      isLoading.value = false
      return
    }

    const apiData = prepareApiData()
    console.log('Attempting registration with:', { email: apiData.email })

    const response = await registerUser(apiData)
    console.log('Registration successful:', response)

    // Store the registered user data and success message
    registeredUser.value = response.user
    successMessage.value = response.message || 'Đăng ký thành công!'

    // Show success screen  
    showSuccess.value = true

    // Auto-close after 3 seconds and emit auth success
    setTimeout(() => {
      emit('auth-success')
    }, 3000)

  } catch (error) {
    console.error('Registration error:', error)
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

// Close modal and emit auth success
const closeModal = () => {
  emit('auth-success')
  emit('close')
}

// Reset form
const resetForm = () => {
  form.value = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    agreeTerms: false,
    agreeMarketing: false
  }

  errors.value = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeTerms: ''
  }

  apiError.value = {}
  showSuccess.value = false
  registeredUser.value = null
  successMessage.value = ''
}

// Reset form on component mount
resetForm()
</script>