<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Order Info -->
      <div class="space-y-2">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
            Đơn hàng {{ order.date }}
          </h1>
          <div class="flex items-center space-x-2">
            <span class="text-blue-600 font-semibold">#{{ order.orderNumber }}</span>
            <button 
              @click="copyOrderNumber"
              class="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center justify-center"
              title="Sao chép mã đơn hàng"
              style="padding: 4px; min-width: 28px; min-height: 28px;"
            >
              <i class="fas fa-copy text-sm" style="display: block; line-height: 1;"></i>
            </button>
          </div>
        </div>
        
        <!-- Status Badge -->
        <div class="flex items-center space-x-3">
          <div :class="statusConfig.class" class="px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
            <div :class="statusConfig.dotClass" class="w-2 h-2 rounded-full"></div>
            <span>{{ statusConfig.text }}</span>
          </div>
          
          <!-- Delivery Method -->
          <div v-if="order.deliveryType === 'grab'" class="flex items-center space-x-2 text-green-600">
            <i class="fas fa-motorcycle"></i>
            <span class="text-sm font-medium">Đơn hàng được vận chuyển bởi GRAB</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3">

        
        <button 
          @click="shareOrder"
          class="group bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 whitespace-nowrap"
          style="white-space: nowrap;"
        >
          <i class="fas fa-share-alt group-hover:rotate-12 transition-transform duration-300"></i>
          <span>Chia sẻ</span>
        </button>
      </div>
    </div>

    <!-- Delivery Time -->
    <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <i class="fas fa-clock text-blue-600"></i>
        </div>
        <div>
          <div class="font-semibold text-gray-800">{{ order.estimatedDelivery.timeRange }}</div>
          <div class="text-lg font-bold text-blue-600">{{ order.estimatedDelivery.date }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

// Toast functionality
const { showSuccess } = useToast()

// No emits needed

// Computed properties
const statusConfig = computed(() => {
  const configs = {
    pending: {
      text: 'Chờ xác nhận',
      class: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      dotClass: 'bg-yellow-500'
    },
    confirmed: {
      text: 'Đã xác nhận',
      class: 'bg-blue-100 text-blue-800 border border-blue-200',
      dotClass: 'bg-blue-500'
    },
    processing: {
      text: 'Đang xử lý',
      class: 'bg-orange-100 text-orange-800 border border-orange-200',
      dotClass: 'bg-orange-500'
    },
    shipped: {
      text: 'Đã gửi hàng',
      class: 'bg-purple-100 text-purple-800 border border-purple-200',
      dotClass: 'bg-purple-500'
    },
    delivered: {
      text: 'Đã giao hàng',
      class: 'bg-green-100 text-green-800 border border-green-200',
      dotClass: 'bg-green-500'
    },
    cancelled: {
      text: 'Đã hủy',
      class: 'bg-red-100 text-red-800 border border-red-200',
      dotClass: 'bg-red-500'
    }
  }
  
  return configs[props.order.status] || configs.pending
})



// Methods
function copyOrderNumber() {
  const orderText = `#${props.order.orderNumber}`
  navigator.clipboard.writeText(orderText).then(() => {
    showSuccess('Đã sao chép mã đơn hàng!')
  }).catch(err => {
    console.error('Không thể sao chép:', err)
  })
}

function shareOrder() {
  if (navigator.share) {
    navigator.share({
      title: `Đơn hàng #${props.order.orderNumber}`,
      text: `Theo dõi đơn hàng #${props.order.orderNumber} của tôi`,
      url: window.location.href
    })
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      showSuccess('Đã sao chép link đơn hàng!')
    })
  }
}


</script>