<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <!-- Page Info -->
    <div class="flex items-center text-sm text-gray-600">
      <i class="fas fa-info-circle text-blue-500 mr-2"></i>
      <span>
        Trang <span class="font-semibold text-blue-600">{{ currentPage }}</span> 
        của <span class="font-semibold text-gray-800">{{ totalPages }}</span>
      </span>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-2">
      <!-- First Page -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        :class="[
          'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
        ]"
        title="Trang đầu"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>

      <!-- Previous Page -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[
          'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
        ]"
        title="Trang trước"
      >
        <i class="fas fa-angle-left"></i>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <template v-for="(page, index) in visiblePages" :key="index">
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="[
              'min-w-10 h-10 px-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
              page === currentPage
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
            ]"
          >
            {{ page }}
          </button>
          <span 
            v-else 
            class="min-w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
          >
            <i class="fas fa-ellipsis-h"></i>
          </span>
        </template>
      </div>

      <!-- Next Page -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        :class="[
          'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
        ]"
        title="Trang sau"
      >
        <i class="fas fa-angle-right"></i>
      </button>

      <!-- Last Page -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        :class="[
          'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95',
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
        ]"
        title="Trang cuối"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>

    <!-- Quick Jump -->
    <div class="flex items-center gap-2 text-sm">
      <span class="text-gray-600">Đến trang:</span>
      <input 
        v-model="jumpToPage"
        @keyup.enter="handleJumpToPage"
        @blur="handleJumpToPage"
        type="number" 
        :min="1" 
        :max="totalPages"
        class="w-16 h-8 text-center border border-gray-300 rounded-lg text-sm transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        :placeholder="currentPage.toString()"
      />
      <button 
        @click="handleJumpToPage"
        class="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="mt-4 bg-gray-200 rounded-full h-1 overflow-hidden">
    <div 
      class="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-500 ease-out"
      :style="{ width: progressPercentage + '%' }"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const jumpToPage = ref('')

const progressPercentage = computed(() => {
  return (props.currentPage / props.totalPages) * 100
})

const visiblePages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    // Always show last page
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const handleJumpToPage = () => {
  const page = parseInt(jumpToPage.value)
  if (page && page >= 1 && page <= props.totalPages) {
    goToPage(page)
    jumpToPage.value = ''
  }
}

// Clear jump input when page changes
watch(() => props.currentPage, () => {
  jumpToPage.value = ''
})
</script>

<style scoped>
/* Hide arrows on number inputs */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Smooth hover animations */
button:hover:not(:disabled) {
  animation: gentle-pulse 0.6s ease-in-out;
}

@keyframes gentle-pulse {
  0%, 100% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>