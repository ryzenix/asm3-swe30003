<template>
  <div class="relative w-full overflow-hidden rounded-xl shadow-md bg-gray-200">
    <!-- Slides -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="min-w-full h-[250px] md:h-[360px] bg-center bg-cover"
        :style="{ backgroundImage: `url(${banner.image})` }"
      ></div>
    </div>

    <!-- Left Arrow -->
    <button
      @click="prevSlide"
      class="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full w-9 h-9 flex items-center justify-center shadow"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <!-- Right Arrow -->
    <button
      @click="nextSlide"
      class="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full w-9 h-9 flex items-center justify-center shadow"
    >
      <i class="fas fa-chevron-right"></i>
    </button>

    <!-- Dots -->
    <div class="absolute bottom-2 w-full flex justify-center items-center gap-2">
      <span
        v-for="(banner, index) in banners"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-3 h-3 rounded-full cursor-pointer transition',
          currentIndex === index ? 'bg-white' : 'bg-white/50'
        ]"
      ></span>
    </div>
  </div>
</template>

<script setup>
let interval = null;
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  banners: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length
}

function prevSlide() {
  currentIndex.value =
    (currentIndex.value - 1 + props.banners.length) % props.banners.length
}

function goToSlide(index) {
  currentIndex.value = index
}

onMounted(() => {
  interval = setInterval(() => {
    nextSlide()
  }, 5000) // change every 5 seconds
})

onBeforeUnmount(() => {
  clearInterval(interval)
})

</script>

<style scoped>
/* Optional: smoother dot hover effect */
span:hover {
  opacity: 1;
}
</style>