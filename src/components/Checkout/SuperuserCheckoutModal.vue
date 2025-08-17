<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click.self="$emit('close')"
    >
      <!-- Modal container -->
      <div class="relative w-full max-w-md px-4 mx-auto">
        <div class="bg-white rounded-xl shadow-xl p-6 relative">
          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-3 right-3 text-gray-400 hover:text-black hover:bg-gray-100 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Đóng"
          >
            &times;
          </button>

          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-user-shield text-orange-600 text-2xl"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Tài khoản quản trị viên</h2>
            <p class="text-sm text-gray-600">Bạn đang đăng nhập với quyền quản trị viên</p>
          </div>

          <!-- Warning Message -->
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-orange-600 text-lg"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-orange-800 mb-2">Không thể mua hàng với tài khoản quản trị</h3>
                <p class="text-sm text-orange-700 leading-relaxed">
                  Tài khoản quản trị viên không được phép thực hiện mua hàng. Để tiếp tục mua sắm, bạn cần đăng xuất và đăng nhập bằng tài khoản khách hàng.
                </p>
              </div>
            </div>
          </div>

          <!-- User Info -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-purple-600"></i>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ user?.name || 'Quản trị viên' }}</div>
                <div class="text-sm text-gray-600">{{ user?.email }}</div>
                <div class="text-xs text-purple-600 font-medium">Quyền: Quản trị viên</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Logout and Login Button -->
            <button
              @click="handleLogoutAndLogin"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-sign-out-alt"></i>
              <span>{{ isLoading ? 'Đang xử lý...' : 'Đăng xuất và đăng nhập lại' }}</span>
            </button>

            <!-- Cancel Button -->
            <button
              @click="$emit('close')"
              :disabled="isLoading"
              class="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Hủy bỏ
            </button>
          </div>

          <!-- Help Text -->
          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500 leading-relaxed">
              Nếu bạn cần hỗ trợ hoặc có thắc mắc, vui lòng liên hệ bộ phận kỹ thuật.
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'logout-and-login'])

const { logout } = useAuth()
const isLoading = ref(false)

const handleLogoutAndLogin = async () => {
  try {
    isLoading.value = true
    
    // Perform logout
    await logout()
    
    // Emit event to parent to show login modal
    emit('logout-and-login')
    
    // Close this modal
    emit('close')
    
  } catch (error) {
    console.error('Logout error:', error)
    // Still close the modal and show login even if logout fails
    emit('logout-and-login')
    emit('close')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>