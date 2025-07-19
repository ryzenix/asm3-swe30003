<!-- Dropdown Component -->
<template>
  <div 
    class="relative group"
    @mouseenter="showDropdown = true"
    @mouseleave="showDropdown = false"
  >
    <!-- Trigger -->
    <div 
      class="cursor-pointer hover:bg-green-700 px-4 py-3 transition-colors flex items-center gap-1"
      @click="isMobile ? toggleDropdown() : null"
    >
      <i :class="item.icon" class="text-xs"></i>
      {{ item.name }}
      <i 
        v-if="item.dropdown" 
        :class="[
          'fas fa-chevron-down text-xs transition-transform',
          (showDropdown || (isMobile && mobileOpen)) ? 'rotate-180' : ''
        ]"
      ></i>
    </div>
    
    <!-- Desktop Dropdown Menu -->
    <div 
      v-if="item.dropdown && showDropdown && !isMobile"
      class="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-b-lg min-w-64 z-50 border border-gray-200 animate-slideDown"
    >
      <div class="grid grid-cols-1 gap-1 p-2">
        <div 
          v-for="subItem in item.dropdown" 
          :key="subItem.name"
          class="px-3 py-2 hover:bg-green-50 cursor-pointer rounded transition-colors text-sm"
          @click="$emit('item-selected', subItem)"
        >
          <div class="font-medium text-green-800">{{ subItem.name }}</div>
          <div v-if="subItem.description" class="text-xs text-gray-600 mt-1">{{ subItem.description }}</div>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div 
      v-if="item.dropdown && mobileOpen && isMobile"
      class="bg-green-900 ml-4 rounded-lg mt-2 mb-3 animate-slideDown"
    >
      <div 
        v-for="subItem in item.dropdown" 
        :key="subItem.name"
        class="px-4 py-3 border-b border-green-800 last:border-b-0 cursor-pointer hover:bg-green-700 transition-colors"
        @click="$emit('item-selected', subItem)"
      >
        <div class="font-medium">{{ subItem.name }}</div>
        <div v-if="subItem.description" class="text-xs opacity-75 mt-1">{{ subItem.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['item-selected'])

// State
const showDropdown = ref(false)
const mobileOpen = ref(false)

// Methods
const toggleDropdown = () => {
  mobileOpen.value = !mobileOpen.value
}

// Expose method for parent to control mobile dropdown
defineExpose({
  toggleDropdown,
  closeMobileDropdown: () => { mobileOpen.value = false }
})
</script>