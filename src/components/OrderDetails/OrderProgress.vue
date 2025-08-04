<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
      <i class="fas fa-route text-blue-600 mr-3"></i>
      Tiến trình đơn hàng
    </h3>

    <!-- Progress Bar -->
    <div class="relative mb-8">
      <!-- Progress Line -->
      <div class="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <!-- Progress Steps -->
      <div class="relative flex justify-between">
        <div 
          v-for="(step, index) in progressSteps" 
          :key="step.status"
          class="flex flex-col items-center"
        >
          <!-- Step Circle -->
          <div 
            :class="[
              'w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10',
              getStepClasses(step, index)
            ]"
          >
            <i 
              :class="[
                'text-lg transition-all duration-300',
                step.completed ? 'fas fa-check' : step.icon,
                step.completed ? 'text-white' : step.current ? 'text-blue-600' : 'text-gray-400'
              ]"
            ></i>
          </div>

          <!-- Step Label -->
          <div class="mt-3 text-center">
            <div 
              :class="[
                'text-sm font-medium transition-colors duration-300',
                step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
              ]"
            >
              {{ step.title }}
            </div>
            <div 
              v-if="step.time"
              :class="[
                'text-xs mt-1 transition-colors duration-300',
                step.current ? 'text-blue-500' : step.completed ? 'text-green-500' : 'text-gray-400'
              ]"
            >
              {{ formatTime(step.time) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status History -->
    <div class="space-y-4">
      <h4 class="font-semibold text-gray-800 flex items-center">
        <i class="fas fa-history text-gray-600 mr-2"></i>
        Lịch sử trạng thái
      </h4>
      
      <div class="space-y-3">
        <div 
          v-for="(history, index) in statusHistory" 
          :key="index"
          :class="[
            'flex items-start space-x-4 p-4 rounded-xl transition-all duration-300',
            history.current ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
          ]"
        >
          <!-- Status Icon -->
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              history.current ? 'bg-blue-100' : 'bg-gray-200'
            ]"
          >
            <i 
              :class="[
                'text-sm',
                getStatusIcon(history.status),
                history.current ? 'text-blue-600' : 'text-gray-500'
              ]"
            ></i>
          </div>

          <!-- Status Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h5 
                :class="[
                  'font-medium',
                  history.current ? 'text-blue-800' : 'text-gray-800'
                ]"
              >
                {{ history.title }}
              </h5>
              <span 
                :class="[
                  'text-sm',
                  history.current ? 'text-blue-600' : 'text-gray-500'
                ]"
              >
                {{ formatTime(history.timestamp) }}
              </span>
            </div>
            <p 
              :class="[
                'text-sm mt-1',
                history.current ? 'text-blue-700' : 'text-gray-600'
              ]"
            >
              {{ history.description }}
            </p>
          </div>

          <!-- Current Status Indicator -->
          <div 
            v-if="history.current"
            class="flex-shrink-0"
          >
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStatus: {
    type: String,
    required: true
  },
  statusHistory: {
    type: Array,
    default: () => []
  }
})

// Progress steps configuration
const progressSteps = computed(() => {
  const steps = [
    {
      status: 'pending',
      title: 'Đặt hàng',
      icon: 'fas fa-shopping-cart',
      completed: false,
      current: false,
      time: null
    },
    {
      status: 'confirmed',
      title: 'Xác nhận',
      icon: 'fas fa-check-circle',
      completed: false,
      current: false,
      time: null
    },
    {
      status: 'processing',
      title: 'Xử lý đơn',
      icon: 'fas fa-cogs',
      completed: false,
      current: false,
      time: null
    },
    {
      status: 'shipping',
      title: 'Đang giao',
      icon: 'fas fa-truck',
      completed: false,
      current: false,
      time: null
    },
    {
      status: 'delivered',
      title: 'Nhận hàng',
      icon: 'fas fa-box-open',
      completed: false,
      current: false,
      time: null
    }
  ]

  // Update steps based on current status and history
  const statusOrder = ['pending', 'confirmed', 'processing', 'shipping', 'delivered']
  const currentIndex = statusOrder.indexOf(props.currentStatus)

  steps.forEach((step, index) => {
    if (index < currentIndex) {
      step.completed = true
    } else if (index === currentIndex) {
      step.current = true
    }

    // Add time from history
    const historyItem = props.statusHistory.find(h => h.status === step.status)
    if (historyItem) {
      step.time = historyItem.timestamp
    }
  })

  return steps
})

// Progress percentage
const progressPercentage = computed(() => {
  const statusOrder = ['pending', 'confirmed', 'processing', 'shipping', 'delivered']
  const currentIndex = statusOrder.indexOf(props.currentStatus)
  return (currentIndex / (statusOrder.length - 1)) * 100
})

// Methods
function getStepClasses(step, index) {
  if (step.completed) {
    return 'bg-green-500 border-green-500 shadow-lg'
  } else if (step.current) {
    return 'bg-white border-blue-500 shadow-lg animate-pulse'
  } else {
    return 'bg-gray-100 border-gray-300'
  }
}

function getStatusIcon(status) {
  const icons = {
    pending: 'fas fa-clock',
    confirmed: 'fas fa-check',
    processing: 'fas fa-cogs',
    shipping: 'fas fa-truck',
    delivered: 'fas fa-box-open',
    cancelled: 'fas fa-times'
  }
  return icons[status] || 'fas fa-circle'
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.abs(now - date) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60)
    return `${diffInMinutes} phút trước`
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} giờ trước`
  } else {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes pulse-blue {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.animate-pulse-blue {
  animation: pulse-blue 2s infinite;
}
</style>