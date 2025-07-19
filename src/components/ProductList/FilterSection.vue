<template>
  <div class="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
    <h3 class="font-semibold text-gray-800 mb-3 flex items-center justify-between cursor-pointer" @click="toggleExpanded">
      <span class="flex items-center">
        <i :class="[
          'fas mr-2 transition-all duration-200',
          getIconForSection(section.label),
          'text-blue-600'
        ]"></i>
        {{ section.label }}
      </span>
      <div class="flex items-center">
        <span 
          v-if="modelValue.length > 0" 
          class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2 animate-pulse"
        >
          {{ modelValue.length }}
        </span>
        <i :class="[
          'fas fa-chevron-down transition-transform duration-200 text-gray-400',
          expanded ? 'rotate-180' : ''
        ]"></i>
      </div>
    </h3>
    
    <transition name="expand" @enter="onEnter" @leave="onLeave">
      <div v-show="expanded" class="space-y-3">
        <div 
          v-for="(option, index) in section.options" 
          :key="option" 
          class="flex items-center transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 -m-2"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="relative flex items-center">
            <input 
              type="checkbox" 
              :id="`${section.label}-${option}`"
              class="sr-only" 
              :value="option"
              :checked="modelValue.includes(option)"
              @change="handleChange"
            />
            <label 
              :for="`${section.label}-${option}`"
              class="flex items-center cursor-pointer group"
            >
              <div :class="[
                'w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200 transform group-hover:scale-110',
                modelValue.includes(option) 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 group-hover:border-blue-400 bg-white'
              ]">
                <i v-if="modelValue.includes(option)" class="fas fa-check text-white text-xs"></i>
              </div>
              <span :class="[
                'text-sm transition-colors duration-200',
                modelValue.includes(option) 
                  ? 'text-gray-800 font-medium' 
                  : 'text-gray-600 group-hover:text-gray-800'
              ]">
                {{ option }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])
const expanded = ref(true)

const getIconForSection = (label) => {
  switch (label) {
    case "Đối tượng sử dụng":
      return "fa-users"
    case "Giá bán":
      return "fa-tags"
    case "Mùi vị / Mùi hương":
      return "fa-leaf"
    case "Nhà sản xuất":
      return "fa-industry"
    default:
      return "fa-filter"
  }
}

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const handleChange = (event) => {
  const value = event.target.value
  const checked = event.target.checked
  const currentValue = [...props.modelValue]
  
  if (checked) {
    if (!currentValue.includes(value)) {
      currentValue.push(value)
    }
  } else {
    const index = currentValue.indexOf(value)
    if (index > -1) {
      currentValue.splice(index, 1)
    }
  }
  
  emit('update:modelValue', currentValue)
}

const onEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
  
  requestAnimationFrame(() => {
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
  })
}

const onLeave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  
  requestAnimationFrame(() => {
    el.style.height = '0'
    el.style.opacity = '0'
  })
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>