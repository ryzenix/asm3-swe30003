<template>
  <div class="space-y-4 mb-6">
    <!-- Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-blue-800 text-sm flex items-start gap-2">
        <i class="fas fa-info-circle text-blue-600 mt-0.5 flex-shrink-0"></i>
        <span>Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ</span>
      </p>
    </div>
    
    <!-- Sort Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <span class="text-gray-700 font-medium text-sm">Sắp xếp theo:</span>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="option in sortOptions"
          :key="option.value"
          @click="$emit('sort-change', option.value)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            currentSort === option.value 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentSort: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['sort-change'])

const sortOptions = [
  { value: 'bestseller', label: 'Bán chạy' },
  { value: 'price_asc', label: 'Giá thấp' },
  { value: 'price_desc', label: 'Giá cao' }
]
</script>