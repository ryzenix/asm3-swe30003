<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <!-- Results Info -->
    <div class="text-sm text-gray-600">
      <span class="font-medium">
        Hiển thị {{ startIndex + 1 }}-{{ Math.min(endIndex, totalResults) }} 
        của {{ totalResults }} sản phẩm
      </span>
    </div>
    
    <!-- Items Per Page Selector -->
    <div class="flex items-center gap-3 text-sm">
      <span class="text-gray-700">Hiển thị:</span>
      <select 
        :value="itemsPerPage" 
        @change="$emit('items-per-page-change', parseInt($event.target.value))"
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="24">24</option>
        <option value="32">32</option>
      </select>
      <span class="text-gray-700">sản phẩm</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  startIndex: {
    type: Number,
    required: true
  },
  endIndex: {
    type: Number,
    required: true
  },
  totalResults: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['items-per-page-change'])
</script>