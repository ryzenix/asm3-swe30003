<!-- components/AuthOverlay.vue -->
<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click.self="emit('close')"
    >
      <!-- Modal container -->
      <div class="relative w-full max-w-md px-4 mx-auto">
        <transition name="modal-fade" mode="out-in">
          <LoginModal
            v-if="current === 'login'"
            key="login"
            @switch="switchToRegister"
            @close="emit('close')"
          />
          <RegisterModal
            v-else
            key="register"
            @back="switchToLogin"
            @close="emit('close')"
          />
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import LoginModal from './LoginModal.vue'
import RegisterModal from './RegisterModal.vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const current = ref('login')

// Disable/enable body scroll
const disableScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = getScrollbarWidth() + 'px'
}

const enableScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth
}

// Watch for modal visibility changes
watch(
  () => props.visible,
  (val) => {
    if (val) {
      current.value = 'login'
      disableScroll()
    } else {
      enableScroll()
    }
  }
)

// Cleanup on unmount
onUnmounted(() => {
  enableScroll()
})

// Smooth transitions between modals
const switchToRegister = () => {
  current.value = 'register'
}

const switchToLogin = () => {
  current.value = 'login'
}
</script>

<style scoped>
/* Overlay fade animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Modal fade transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>