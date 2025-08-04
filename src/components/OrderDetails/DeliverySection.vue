<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
      <i class="fas fa-map-marker-alt text-blue-600 mr-3"></i>
      Thông tin giao hàng
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Customer Info -->
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-blue-600 text-sm"></i>
          </div>
          <span class="font-semibold text-gray-800">Thông tin người nhận</span>
        </div>
        <div class="ml-10 space-y-2">
          <div class="font-medium text-gray-800">{{ customerInfo.name }}</div>
          <div class="text-gray-600">{{ customerInfo.phone }}</div>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-map-pin text-green-600 text-sm"></i>
          </div>
          <span class="font-semibold text-gray-800">Nhận hàng tại</span>
        </div>
        <div class="ml-10">
          <div class="text-gray-600 text-sm leading-relaxed">{{ customerInfo.address }}</div>
        </div>
      </div>
    </div>

    <!-- Delivery Method -->
    <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-motorcycle text-green-600"></i>
          </div>
          <div>
            <div class="font-semibold text-gray-800">{{ deliveryInfo.method }}</div>
            <div class="text-sm text-gray-600">Thời gian dự kiến: {{ deliveryInfo.estimatedTime }}</div>
          </div>
        </div>
        
        <div v-if="deliveryInfo.carrier" class="text-right">
          <div class="text-sm text-gray-600">Vận chuyển bởi</div>
          <div class="font-bold text-green-600">{{ deliveryInfo.carrier }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  deliveryInfo: {
    type: Object,
    required: true
  },
  customerInfo: {
    type: Object,
    required: true
  }
})
</script>