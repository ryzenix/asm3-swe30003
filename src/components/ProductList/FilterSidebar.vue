<template>
  <aside class="bg-white rounded-xl shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="p-4 lg:p-6 border-b border-gray-200">
      <button 
        @click="toggleMobileFilters"
        class="w-full flex items-center justify-between lg:cursor-default"
      >
        <h2 class="font-semibold text-gray-800 flex items-center gap-2">
          <i class="fas fa-sliders-h text-gray-500"></i>
          <span>Bộ lọc nâng cao</span>
        </h2>
        <i 
          class="fas fa-chevron-down text-gray-500 transition-transform lg:hidden"
          :class="{ 'rotate-180': isExpanded }"
        ></i>
      </button>
    </div>

    <!-- Filter Content -->
    <div 
      class="overflow-hidden transition-all duration-300 lg:!block"
      :class="isExpanded ? 'max-h-screen' : 'max-h-0 lg:max-h-none'"
    >
      <div class="p-4 lg:p-6 space-y-6">
        <!-- Filter Sections -->
        <FilterSection
          v-for="section in filters"
          :key="section.label"
          :section="section"
          :model-value="activeFilters[section.label]"
          @update:model-value="updateFilter(section.label, $event)"
        />

        <!-- Clear Filters Button -->
        <button 
          @click="$emit('clear-filters')"
          :disabled="!hasActiveFilters"
          :class="[
            'w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors',
            hasActiveFilters
              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
              : 'text-gray-400 bg-gray-50 cursor-not-allowed border border-gray-200'
          ]"
        >
          <i class="fas fa-times mr-2"></i>
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import FilterSection from './FilterSection.vue'

const props = defineProps({
  filters: {
    type: Array,
    required: true
  },
  activeFilters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-filter', 'clear-filters'])

const isExpanded = ref(false)

const hasActiveFilters = computed(() => {
  return Object.values(props.activeFilters).some(filters => filters.length > 0)
})

const updateFilter = (filterType, value) => {
  emit('update-filter', filterType, value)
}

const toggleMobileFilters = () => {
  isExpanded.value = !isExpanded.value
}
</script>