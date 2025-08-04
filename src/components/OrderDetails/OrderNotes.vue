<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-sticky-note text-yellow-600 mr-3"></i>
      Ghi chú đơn hàng
    </h3>

    <div class="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <i class="fas fa-comment-alt text-yellow-600 text-sm"></i>
        </div>
        <div class="flex-1">
          <p class="text-yellow-800 leading-relaxed">{{ notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  notes: {
    type: String,
    required: true
  }
})
</script>