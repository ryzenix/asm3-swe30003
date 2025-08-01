<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md" @click.stop>
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Xác nhận xóa nhân viên</h3>
            <p class="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa nhân viên 
              <strong class="text-gray-900">{{ staffToDelete?.fullName }}</strong>?
              <br>
              <span class="text-sm text-red-600 mt-2 block">Hành động này không thể hoàn tác!</span>
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
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <i class="fas fa-trash mr-2"></i>
                Xóa nhân viên
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
  staffToDelete: {
    type: Object,
    default: null
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