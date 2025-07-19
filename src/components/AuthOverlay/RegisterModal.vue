<template>
  <div class="bg-white rounded-xl shadow-xl p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
      <!-- Back + Title -->
      <div class="flex items-center mb-4">
        <button
          @click="$emit('back')"
          class="mr-3 p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          title="Quay lại đăng nhập"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h2 class="text-xl font-semibold">Tạo tài khoản mới</h2>
          <p class="text-sm text-gray-500">Tham gia cộng đồng Pharmacy ngay hôm nay</p>
        </div>
      </div>

      <!-- Benefits section -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-sm font-medium text-green-800 mb-2">🎉 Ưu đãi dành cho thành viên mới:</h3>
        <ul class="text-sm text-green-700 space-y-1">
          <li>• Giảm 10% cho đơn hàng đầu tiên</li>
          <li>• Tích điểm với mỗi giao dịch</li>
          <li>• Nhận thông báo khuyến mãi độc quyền</li>
          <li>• Theo dõi đơn hàng dễ dàng</li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Full Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Nhập họ và tên đầy đủ"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="0xxx xxx xxx"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Tối thiểu 8 ký tự"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
              minlength="8"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
          <p class="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
          <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" 
             class="text-xs text-red-500 mt-1">
            Mật khẩu không khớp
          </p>
        </div>

        <!-- Date of Birth -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh
          </label>
          <input
            v-model="form.dateOfBirth"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Gender -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input v-model="form.gender" type="radio" value="male" class="mr-2 text-green-600">
              <span class="text-sm">Nam</span>
            </label>
            <label class="flex items-center">
              <input v-model="form.gender" type="radio" value="female" class="mr-2 text-green-600">
              <span class="text-sm">Nữ</span>
            </label>
            <label class="flex items-center">
              <input v-model="form.gender" type="radio" value="other" class="mr-2 text-green-600">
              <span class="text-sm">Khác</span>
            </label>
          </div>
        </div>

        <!-- Terms and Privacy -->
        <div class="mb-6">
          <label class="flex items-start">
            <input 
              v-model="form.agreeTerms"
              type="checkbox" 
              class="mr-3 mt-0.5 text-green-600 focus:ring-green-500"
              required
            >
            <span class="text-sm text-gray-600 leading-relaxed">
              Tôi đồng ý với 
              <a href="#" class="text-green-600 hover:underline">Điều khoản sử dụng</a>
              và 
              <a href="#" class="text-green-600 hover:underline">Chính sách bảo mật</a>
              của Pharmacy
              <span class="text-red-500">*</span>
            </span>
          </label>
        </div>

        <!-- Marketing consent -->
        <div class="mb-6">
          <label class="flex items-start">
            <input 
              v-model="form.agreeMarketing"
              type="checkbox" 
              class="mr-3 mt-0.5 text-green-600 focus:ring-green-500"
            >
            <span class="text-sm text-gray-600">
              Tôi muốn nhận thông báo về khuyến mãi và sản phẩm mới từ Pharmacy
            </span>
          </label>
        </div>

        <!-- Register button -->
        <button
          type="submit"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!isFormValid"
        >
          Tạo tài khoản miễn phí
        </button>

        <!-- Login redirect -->
        <p class="text-sm text-center text-gray-600 mt-4">
          Đã có tài khoản?
          <button 
            type="button"
            class="text-green-600 hover:text-green-700 hover:underline font-medium ml-1" 
            @click="$emit('back')"
          >
            Đăng nhập ngay
          </button>
        </p>
      </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['back', 'close'])

const showPassword = ref(false)

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

const isFormValid = computed(() => {
  return form.value.fullName && 
         form.value.email && 
         form.value.phone && 
         form.value.password && 
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword &&
         form.value.password.length >= 8 &&
         form.value.agreeTerms
})

const handleSubmit = () => {
  if (isFormValid.value) {
    // Handle registration logic here
    console.log('Form submitted:', form.value)
    // You can emit a register event or call an API
    // $emit('register', form.value)
  }
}
</script>