<template>
  <div class="bg-white rounded-xl shadow-xl p-6 relative text-gray-800">
    <!-- Close Button -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-400 hover:text-black hover:bg-gray-100 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
      aria-label="Đóng"
    >
      &times;
    </button>

    <!-- Title -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Đăng nhập</h2>
      <p class="text-sm text-gray-500">Chào mừng bạn trở lại! Vui lòng nhập thông tin để tiếp tục</p>
    </div>

    <!-- Quick Benefits -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 class="text-sm font-medium text-blue-800 mb-2 flex items-center">
        <span class="mr-2">✨</span>
        Lợi ích khi đăng nhập:
      </h3>
      <ul class="text-sm text-blue-700 space-y-1">
        <li class="flex items-center"><span class="mr-2 text-blue-600">•</span>Theo dõi đơn hàng dễ dàng</li>
        <li class="flex items-center"><span class="mr-2 text-blue-600">•</span>Lưu địa chỉ giao hàng</li>
        <li class="flex items-center"><span class="mr-2 text-blue-600">•</span>Ưu đãi và điểm thưởng</li>
      </ul>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="text-sm text-gray-600 mt-2">Đang đăng nhập...</p>
      </div>
    </div>

    <form @submit.prevent="handleLogin" novalidate>
      <!-- Email -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="loginForm.email"
          type="email"
          placeholder="example@email.com"
          :class="[
            'w-full border rounded-lg px-4 py-3 focus:outline-none transition-all',
            errors.email 
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
              : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
          ]"
          @blur="validateField('email')"
          @input="clearFieldError('email')"
          autocomplete="email"
        />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1 flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Nhập mật khẩu của bạn"
            :class="[
              'w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none transition-all',
              errors.password 
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            ]"
            @blur="validateField('password')"
            @input="clearFieldError('password')"
            autocomplete="current-password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabindex="-1"
          >
            <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
            </svg>
          </button>
        </div>
        <p v-if="errors.password" class="text-xs text-red-500 mt-1 flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ errors.password }}
        </p>
      </div>

      <!-- Remember me & Forgot password -->
      <div class="flex items-center justify-between mb-6">
        <label class="flex items-center cursor-pointer group">
          <input 
            v-model="loginForm.rememberMe"
            type="checkbox" 
            class="mr-2 text-green-600 focus:ring-green-500 rounded"
          >
          <span class="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Ghi nhớ đăng nhập</span>
        </label>
        
        <button
          type="button"
          @click="handleForgotPassword"
          class="text-sm text-green-600 hover:text-green-700 hover:underline font-medium transition-colors"
        >
          Quên mật khẩu?
        </button>
      </div>

      <!-- API Error Display -->
      <div v-if="apiError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          {{ apiError }}
        </p>
      </div>

      <!-- Login attempts warning -->
      <div v-if="showAttemptsWarning" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-yellow-700 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          Bạn còn {{ remainingAttempts }} lần thử. Tài khoản sẽ bị khóa tạm thời nếu nhập sai thêm.
        </p>
      </div>

      <!-- Login button -->
      <button
        type="submit"
        :class="[
          'w-full font-semibold py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform',
          isFormValid && !isLoading && !isBlocked
            ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
        :disabled="!isFormValid || isLoading || isBlocked"
      >
        <span v-if="isLoading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang đăng nhập...
        </span>
        <span v-else-if="isBlocked">
          Tài khoản tạm khóa ({{ formatTime(blockTimeRemaining) }})
        </span>
        <span v-else>Đăng nhập</span>
      </button>
    </form>

    <!-- Social divider -->
    <div class="relative mb-4">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 bg-white text-gray-500">Hoặc</span>
      </div>
    </div>

    <!-- Social login options -->

    <!-- Manager login button -->
    <button
      @click="$emit('manager-login')"
      class="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 mb-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all group"
      :disabled="isLoading"
    >
      <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
      <span class="group-hover:text-gray-800 transition-colors">Đăng nhập với tài khoản quản lý</span>
    </button>

    <!-- Register redirect -->
    <p class="text-sm text-center text-gray-600">
      Chưa có tài khoản?
      <button
        type="button"
        class="text-green-600 hover:text-green-700 hover:underline font-medium ml-1 transition-colors"
        @click="$emit('switch')"
      >
        Đăng ký ngay
      </button>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineEmits(['switch', 'close', 'manager-login', 'auth-success'])

// Form state
const showPassword = ref(false)
const isLoading = ref(false)
const apiError = ref('')
const loginAttempts = ref(0)
const isBlocked = ref(false)
const blockTimeRemaining = ref(0)
let blockTimer = null

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({
  email: '',
  password: ''
})

// Validation rules
const validationRules = {
  email: (value) => {
    if (!value.trim()) return 'Email là bắt buộc'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Email không hợp lệ'
    return ''
  },
  
  password: (value) => {
    if (!value) return 'Mật khẩu là bắt buộc'
    if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
    return ''
  }
}

// Computed properties
const isFormValid = computed(() => {
  return loginForm.value.email && 
         loginForm.value.password && 
         !Object.values(errors.value).some(error => error)
})

const remainingAttempts = computed(() => Math.max(0, 5 - loginAttempts.value))
const showAttemptsWarning = computed(() => loginAttempts.value >= 3 && loginAttempts.value < 5)

// Validation functions
const validateField = (fieldName) => {
  const rule = validationRules[fieldName]
  if (rule) {
    errors.value[fieldName] = rule(loginForm.value[fieldName])
  }
}

const clearFieldError = (fieldName) => {
  errors.value[fieldName] = ''
  apiError.value = ''
}

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

// Utility functions
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startBlockTimer = (duration = 300) => { // 5 minutes default
  isBlocked.value = true
  blockTimeRemaining.value = duration
  
  blockTimer = setInterval(() => {
    blockTimeRemaining.value--
    if (blockTimeRemaining.value <= 0) {
      clearInterval(blockTimer)
      isBlocked.value = false
      loginAttempts.value = 0
    }
  }, 1000)
}

// Prepare data for API call
const prepareApiData = () => {
  return {
    email: loginForm.value.email.trim().toLowerCase(),
    password: loginForm.value.password,
    rememberMe: loginForm.value.rememberMe
  }
}

// Main login handler
const handleLogin = async () => {
  // Clear previous errors
  apiError.value = ''
  
  // Check if blocked
  if (isBlocked.value) return
  
  // Validate form
  if (!validateForm()) {
    const firstErrorField = Object.keys(errors.value).find(key => errors.value[key])
    if (firstErrorField) {
      document.querySelector(`input[name="${firstErrorField}"], input[v-model*="${firstErrorField}"]`)?.focus()
    }
    return
  }

  if (!isFormValid.value) return

  isLoading.value = true

  try {
    // Prepare data for API call
    const apiData = prepareApiData()
    
    // TODO: Replace with actual API call
    console.log('Login data prepared for API:', apiData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate random success/failure for demo
    const success = Math.random() > 0.4
    
    if (success) {
      // Login successful
      console.log('Login successful!')
      
      // Reset attempts on success
      loginAttempts.value = 0
      
      // Reset form
      resetForm()
      
      // Emit success event with user data
      // $emit('auth-success', { user: userData, token: token })
      
      // For now, just show success
      alert('Đăng nhập thành công!')
      
    } else {
      // Simulate login failure
      loginAttempts.value++
      
      if (loginAttempts.value >= 5) {
        startBlockTimer()
        throw new Error('Tài khoản đã bị khóa tạm thời do nhập sai quá nhiều lần. Vui lòng thử lại sau 5 phút.')
      } else {
        throw new Error('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.')
      }
    }
    
  } catch (error) {
    console.error('Login error:', error)
    
    // Handle specific API errors
    if (error.message.includes('email')) {
      errors.value.email = error.message
    } else if (error.message.includes('password') || error.message.includes('mật khẩu')) {
      errors.value.password = error.message
    } else {
      apiError.value = error.message || 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
    }
  } finally {
    isLoading.value = false
  }
}

// Social login handler
const handleSocialLogin = async (provider) => {
  if (isLoading.value) return
  
  isLoading.value = true
  apiError.value = ''
  
  try {
    console.log(`Attempting ${provider} login`)
    
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // TODO: Implement actual social login
    // const result = await socialLoginService(provider)
    
    alert(`Đăng nhập ${provider} thành công!`)
    
  } catch (error) {
    console.error(`${provider} login error:`, error)
    apiError.value = `Không thể đăng nhập bằng ${provider}. Vui lòng thử lại.`
  } finally {
    isLoading.value = false
  }
}

// Forgot password handler
const handleForgotPassword = () => {
  // TODO: Implement forgot password flow
  // This could open a modal or navigate to forgot password page
  alert('Tính năng quên mật khẩu sẽ được triển khai sớm!')
  console.log('Forgot password clicked')
}

// Reset form
const resetForm = () => {
  loginForm.value = {
    email: '',
    password: '',
    rememberMe: false
  }
  
  errors.value = {
    email: '',
    password: ''
  }
  
  apiError.value = ''
}

// Cleanup
onUnmounted(() => {
  if (blockTimer) {
    clearInterval(blockTimer)
  }
})

// Example API service functions (to implement later)
/*
const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Login failed')
  }
  
  return await response.json()
}

const socialLoginService = async (provider) => {
  // Implement social login logic
  // This would typically involve OAuth flows
  const response = await fetch(`/api/auth/${provider}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`${provider} login failed`)
  }
  
  return await response.json()
}
*/
</script>