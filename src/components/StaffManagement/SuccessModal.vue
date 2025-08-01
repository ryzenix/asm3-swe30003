<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300" @click.stop>
          <!-- Modal Header with rounded top -->
          <div class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-5 rounded-t-3xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <i class="fas fa-check-circle text-2xl"></i>
                </div>
                <div>
                  <h2 class="text-xl font-semibold">Tạo tài khoản thành công!</h2>
                  <p class="text-green-100 text-sm mt-1">Thông tin đăng nhập cho nhân viên mới</p>
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
          
          <!-- Modal Body with enhanced design -->
          <div class="p-6 space-y-6">
            <!-- Success Message -->
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <i class="fas fa-user-check text-green-600 text-3xl"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Tài khoản đã được tạo thành công!
              </h3>
              <p class="text-gray-600">
                Nhân viên <strong class="text-gray-900">{{ createdStaff?.fullName }}</strong> đã được thêm vào hệ thống.
              </p>
            </div>

            <!-- Login Credentials with enhanced styling -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 space-y-4 border border-gray-200">
              <h4 class="font-semibold text-gray-900 flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-key text-blue-600"></i>
                </div>
                Thông tin đăng nhập
              </h4>
              
              <div class="space-y-4">
                <!-- Email -->
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 flex items-center">
                      <i class="fas fa-envelope text-gray-400 mr-2"></i>
                      Email đăng nhập:
                    </span>
                    <button 
                      @click="$emit('copyToClipboard', createdStaff?.email)"
                      class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title="Sao chép email"
                    >
                      <i class="fas fa-copy text-sm group-hover:scale-110 transition-transform"></i>
                    </button>
                  </div>
                  <code class="block w-full bg-gray-50 px-3 py-2 rounded-lg border text-sm font-mono text-gray-900 break-all">
                    {{ createdStaff?.email }}
                  </code>
                </div>

                <!-- Password -->
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 flex items-center">
                      <i class="fas fa-lock text-gray-400 mr-2"></i>
                      Mật khẩu tạm thời:
                    </span>
                    <button 
                      @click="$emit('copyToClipboard', createdStaff?.temporaryPassword)"
                      class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title="Sao chép mật khẩu"
                    >
                      <i class="fas fa-copy text-sm group-hover:scale-110 transition-transform"></i>
                    </button>
                  </div>
                  <code class="block w-full bg-gray-50 px-3 py-2 rounded-lg border text-sm font-mono text-gray-900 break-all">
                    {{ createdStaff?.temporaryPassword }}
                  </code>
                </div>
              </div>

              <!-- Enhanced Warning -->
              <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-exclamation-triangle text-amber-600"></i>
                  </div>
                  <div class="text-sm text-amber-800">
                    <p class="font-medium mb-2">Lưu ý quan trọng:</p>
                    <ul class="text-xs space-y-1.5">
                      <li class="flex items-start">
                        <i class="fas fa-dot-circle mr-2 mt-1 text-amber-600"></i>
                        <span>Mật khẩu này chỉ hiển thị một lần duy nhất</span>
                      </li>
                      <li class="flex items-start">
                        <i class="fas fa-dot-circle mr-2 mt-1 text-amber-600"></i>
                        <span>Nhân viên nên đổi mật khẩu ngay sau khi đăng nhập lần đầu</span>
                      </li>
                      <li class="flex items-start">
                        <i class="fas fa-dot-circle mr-2 mt-1 text-amber-600"></i>
                        <span>Hãy chia sẻ thông tin này một cách an toàn và bảo mật</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer with rounded bottom -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-3xl">
            <button 
              @click="$emit('close')"
              class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <i class="fas fa-check mr-2"></i>
              Đã hiểu và lưu thông tin
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
  createdStaff: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'copyToClipboard'])
</script> 