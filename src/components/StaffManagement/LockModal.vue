<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md" @click.stop>
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" :class="isLocking ? 'bg-orange-100' : 'bg-green-100'">
              <i :class="isLocking ? 'fas fa-lock text-orange-600' : 'fas fa-unlock text-green-600'" class="text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ isLocking ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản' }}
            </h3>
            <p class="text-gray-600 mb-6">
              Bạn có chắc chắn muốn 
              <strong :class="isLocking ? 'text-orange-600' : 'text-green-600'">
                {{ isLocking ? 'khóa' : 'mở khóa' }}
              </strong> 
              tài khoản của nhân viên 
              <strong class="text-gray-900">{{ staff?.fullName }}</strong>?
              <br>
              <span class="text-sm mt-2 block" :class="isLocking ? 'text-orange-600' : 'text-green-600'">
                {{ isLocking ? 'Nhân viên sẽ không thể đăng nhập vào hệ thống' : 'Nhân viên sẽ có thể đăng nhập lại vào hệ thống' }}
              </span>
            </p>
            <div class="flex space-x-3">
              <button 
                @click="$emit('close')"
                class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200"
              >
                <i class="fas fa-times mr-2"></i>
                Hủy bỏ
              </button>
              <button 
                @click="$emit('confirm')"
                class="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                :class="isLocking 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'"
              >
                <i :class="isLocking ? 'fas fa-lock' : 'fas fa-unlock'" class="mr-2"></i>
                {{ isLocking ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}
              </button>
            </div>
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
  staff: {
    type: Object,
    default: null
  },
  isLocking: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'confirm'])
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
</style> 