<template>
  <div class="bg-white rounded-xl shadow-xl p-6 relative">
    <!-- ❌ Close Button -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
      aria-label="Close"
    >
      &times;
    </button>

    <!-- Title -->
    <h2 class="text-xl font-semibold mb-2 text-gray-800">Đăng nhập</h2>
    <p class="text-sm text-gray-500 mb-4">Vui lòng nhập thông tin để tiếp tục</p>

    <form @submit.prevent="handleLogin">
      <!-- Email -->
      <div class="mb-3">
        <input
          v-model="loginForm.email"
          type="email"
          placeholder="Email"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <!-- Password -->
      <div class="mb-4">
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="Mật khẩu"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <!-- Forgot password -->
      <div class="text-right mb-4">
        <a href="#" class="text-sm text-green-600 hover:text-green-700 hover:underline">
          Quên mật khẩu?
        </a>
      </div>

      <!-- Login button -->
      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
      >
        Đăng nhập
      </button>
    </form>

    <div class="text-center text-gray-400 text-sm mb-4">Hoặc</div>

    <!-- Manager login button -->
    <button
      class="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 mb-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
      <span>Đăng nhập với tài khoản Manager</span>
    </button>

    <!-- Register redirect -->
    <p class="text-sm text-center text-gray-600">
      Chưa có tài khoản?
      <button
        type="button"
        class="text-green-600 hover:text-green-700 hover:underline font-medium ml-1"
        @click="$emit('switch')"
      >
        Đăng ký ngay
      </button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['switch', 'close'])

const loginForm = ref({
  email: '',
  password: ''
})

const handleLogin = () => {
  console.log('Login attempt:', loginForm.value)
  // Replace with real login logic or API call
}
</script>