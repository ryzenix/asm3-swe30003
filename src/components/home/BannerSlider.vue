<template>
  <div class="relative w-full overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-blue-800">
    <!-- Slides -->
    <div
      class="flex transition-all duration-700 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="min-w-full h-[280px] md:h-[400px] relative bg-center bg-cover"
        :style="{ backgroundImage: `url(${banner.image})` }"
      >
        <!-- Overlay gradient for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        <!-- Banner content -->
        <div class="absolute inset-0 flex items-center justify-start">
          <div class="text-white px-8 md:px-12 max-w-md space-y-4 z-10">
            <h1 class="text-2xl md:text-4xl font-bold leading-tight animate-fade-in-up">
              {{ banner.title }}
            </h1>
            <p class="text-lg md:text-xl opacity-90 animate-fade-in-up animation-delay-200">
              {{ banner.subtitle }}
            </p>
            <button class="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up animation-delay-400">
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      @click="prevSlide"
      class="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 hover:bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
    >
      <i class="fas fa-chevron-left text-lg"></i>
    </button>

    <button
      @click="nextSlide"
      class="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 hover:bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
    >
      <i class="fas fa-chevron-right text-lg"></i>
    </button>

    <!-- Progress Dots -->
    <div class="absolute bottom-6 w-full flex justify-center items-center gap-3 z-20">
      <button
        v-for="(banner, index) in banners"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'transition-all duration-300 rounded-full',
          currentIndex === index 
            ? 'w-8 h-3 bg-white' 
            : 'w-3 h-3 bg-white/50 hover:bg-white/75'
        ]"
      ></button>
    </div>

    <!-- Loading Progress Bar -->
    <div class="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
      <div 
        class="h-full bg-white transition-all duration-100 ease-linear"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  banners: {
    type: Array,
    required: true,
    default: () => []
  },
  autoPlayInterval: {
    type: Number,
    default: 5000
  }
})

const currentIndex = ref(0)
const progress = ref(0)
let interval = null
let progressInterval = null

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length
  resetProgress()
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length
  resetProgress()
}

function goToSlide(index) {
  currentIndex.value = index
  resetProgress()
}

function resetProgress() {
  progress.value = 0
  clearInterval(progressInterval)
  startProgress()
}

function startProgress() {
  progressInterval = setInterval(() => {
    progress.value += (100 / (props.autoPlayInterval / 100))
    if (progress.value >= 100) {
      progress.value = 100
    }
  }, 100)
}

onMounted(() => {
  // Start auto-play
  interval = setInterval(() => {
    nextSlide()
  }, props.autoPlayInterval)
  
  // Start progress bar
  startProgress()
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}
</style>