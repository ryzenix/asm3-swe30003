<template>
  <span 
    :class="[
      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200',
      statusClasses
    ]"
  >
    <i :class="['mr-1.5', statusIcon]"></i>
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => {
      return ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'].includes(value)
    }
  }
})

// Computed properties
const statusConfig = computed(() => {
  const configs = {
    pending: {
      label: 'Chờ xác nhận',
      icon: 'fas fa-clock',
      classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    },
    confirmed: {
      label: 'Đã xác nhận',
      icon: 'fas fa-check-circle',
      classes: 'bg-blue-100 text-blue-800 border border-blue-200'
    },
    processing: {
      label: 'Đang chuẩn bị',
      icon: 'fas fa-cog fa-spin',
      classes: 'bg-purple-100 text-purple-800 border border-purple-200'
    },
    shipping: {
      label: 'Đang giao hàng',
      icon: 'fas fa-truck',
      classes: 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    },
    delivered: {
      label: 'Đã giao hàng',
      icon: 'fas fa-check-double',
      classes: 'bg-green-100 text-green-800 border border-green-200'
    },
    cancelled: {
      label: 'Đã hủy',
      icon: 'fas fa-times-circle',
      classes: 'bg-red-100 text-red-800 border border-red-200'
    }
  }
  
  return configs[props.status] || configs.pending
})

const statusLabel = computed(() => statusConfig.value.label)
const statusIcon = computed(() => statusConfig.value.icon)
const statusClasses = computed(() => statusConfig.value.classes)
</script>

<style scoped>
/* Custom animation for processing status */
.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Hover effects */
span:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Pulse animation for pending status */
.bg-yellow-100 {
  animation: pulse-yellow 2s infinite;
}

@keyframes pulse-yellow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Subtle glow for delivered status */
.bg-green-100 {
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.2);
}

/* Subtle shadow for shipping status */
.bg-indigo-100 {
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
}
</style>