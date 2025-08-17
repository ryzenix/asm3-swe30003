<template>
  <span :class="badgeClasses" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
    <i :class="iconClass" class="mr-1.5"></i>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusConfig = {
  pending: {
    text: 'Chờ xác nhận',
    classes: 'bg-yellow-100 text-yellow-800',
    icon: 'fas fa-clock'
  },
  confirmed: {
    text: 'Đã xác nhận',
    classes: 'bg-blue-100 text-blue-800',
    icon: 'fas fa-check-circle'
  },
  processing: {
    text: 'Đang chuẩn bị',
    classes: 'bg-purple-100 text-purple-800',
    icon: 'fas fa-cog'
  },
  shipped: {
    text: 'Đã gửi hàng',
    classes: 'bg-indigo-100 text-indigo-800',
    icon: 'fas fa-truck'
  },
  delivered: {
    text: 'Đã giao hàng',
    classes: 'bg-green-100 text-green-800',
    icon: 'fas fa-check-double'
  },
  cancelled: {
    text: 'Đã hủy',
    classes: 'bg-red-100 text-red-800',
    icon: 'fas fa-times-circle'
  }
}

const statusText = computed(() => {
  return statusConfig[props.status]?.text || props.status
})

const badgeClasses = computed(() => {
  return statusConfig[props.status]?.classes || 'bg-gray-100 text-gray-800'
})

const iconClass = computed(() => {
  return statusConfig[props.status]?.icon || 'fas fa-question-circle'
})
</script>