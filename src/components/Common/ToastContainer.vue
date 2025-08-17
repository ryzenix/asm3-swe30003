<template>
  <teleport to="body">
    <div class="toast-container fixed top-4 right-4 z-[9999] space-y-2">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast-item px-6 py-4 rounded-xl shadow-lg border max-w-sm',
            'transform transition-all duration-300 ease-out',
            toastClasses[toast.type]
          ]"
        >
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
              iconContainerClasses[toast.type]
            ]">
              <i :class="[
                'text-sm',
                iconClasses[toast.type]
              ]"></i>
            </div>
            <span class="font-medium text-sm leading-tight">{{ toast.message }}</span>
            <button 
              @click="removeToast(toast.id)"
              class="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()

const toastClasses = {
  success: 'bg-green-500 text-white border-green-400',
  error: 'bg-red-500 text-white border-red-400',
  warning: 'bg-yellow-500 text-white border-yellow-400',
  info: 'bg-blue-500 text-white border-blue-400'
}

const iconContainerClasses = {
  success: 'bg-green-400',
  error: 'bg-red-400',
  warning: 'bg-yellow-400',
  info: 'bg-blue-400'
}

const iconClasses = {
  success: 'fas fa-check text-green-800',
  error: 'fas fa-exclamation-triangle text-red-800',
  warning: 'fas fa-exclamation-triangle text-yellow-800',
  info: 'fas fa-info text-blue-800'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease-out;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease-out;
}
</style>