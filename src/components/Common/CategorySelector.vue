<template>
  <div class="category-selector">
    <!-- Main Category Selection -->
    <div class="form-group">
      <label :for="mainCategoryId" class="form-label">
        {{ $t('category.mainCategory', 'Danh mục chính') }}
        <span v-if="required" class="text-danger">*</span>
      </label>
      <select 
        :id="mainCategoryId"
        v-model="selectedMainCategory"
        class="form-select"
        :class="{ 'is-invalid': hasMainCategoryError }"
        :disabled="disabled"
        @change="onMainCategoryChange"
      >
        <option value="">{{ $t('category.selectMainCategory', 'Chọn danh mục chính') }}</option>
        <option 
          v-for="category in mainCategoryOptions" 
          :key="category.value" 
          :value="category.value"
        >
          {{ category.icon }} {{ category.label }}
        </option>
      </select>
      <div v-if="hasMainCategoryError" class="invalid-feedback">
        {{ mainCategoryError }}
      </div>
    </div>

    <!-- Subcategory Selection -->
    <div v-if="selectedMainCategory && availableSubcategories.length > 0" class="form-group">
      <label :for="subcategoryId" class="form-label">
        {{ $t('category.subcategory', 'Danh mục phụ') }}
        <span v-if="subcategoryRequired" class="text-danger">*</span>
      </label>
      <select 
        :id="subcategoryId"
        v-model="selectedSubcategory"
        class="form-select"
        :class="{ 'is-invalid': hasSubcategoryError }"
        :disabled="disabled"
        @change="onSubcategoryChange"
      >
        <option value="">{{ $t('category.selectSubcategory', 'Chọn danh mục phụ') }}</option>
        <option 
          v-for="subcategory in availableSubcategories" 
          :key="subcategory.value" 
          :value="subcategory.value"
        >
          {{ subcategory.icon }} {{ subcategory.label }}
        </option>
      </select>
      <div v-if="hasSubcategoryError" class="invalid-feedback">
        {{ subcategoryError }}
      </div>
    </div>

    <!-- Category Breadcrumb Display -->
    <div v-if="showBreadcrumb && breadcrumb.length > 0" class="category-breadcrumb mt-2">
      <small class="text-muted">
        <span v-for="(item, index) in breadcrumb" :key="item.id">
          {{ item.icon }} {{ item.name }}
          <i v-if="index < breadcrumb.length - 1" class="fas fa-chevron-right mx-1"></i>
        </span>
      </small>
    </div>

    <!-- Category Search (Optional) -->
    <div v-if="enableSearch" class="category-search mt-2">
      <div class="input-group">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control form-control-sm"
          :placeholder="$t('category.searchPlaceholder', 'Tìm kiếm danh mục...')"
          @input="onSearch"
        >
        <button 
          class="btn btn-outline-secondary btn-sm" 
          type="button"
          @click="clearSearch"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="search-results mt-2">
        <div class="list-group">
          <button
            v-for="result in searchResults"
            :key="`${result.id}-${result.type}`"
            type="button"
            class="list-group-item list-group-item-action d-flex align-items-center"
            @click="selectFromSearch(result)"
          >
            <span class="me-2">{{ result.icon }}</span>
            <div>
              <div class="fw-bold">{{ result.name }}</div>
              <small class="text-muted">{{ result.description }}</small>
              <span class="badge bg-secondary ms-2">
                {{ result.type === 'main' ? $t('category.mainCategory', 'Chính') : $t('category.subcategory', 'Phụ') }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCategories } from '../../composables/useCategories.js'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ categoryId: null, subcategoryId: null })
  },
  required: {
    type: Boolean,
    default: false
  },
  subcategoryRequired: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showBreadcrumb: {
    type: Boolean,
    default: true
  },
  enableSearch: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'vi'
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change', 'mainCategoryChange', 'subcategoryChange'])

// Composables
const {
  mainCategoryOptions,
  getSubcategoryOptions,
  getCategoryBreadcrumb,
  searchCategories,
  validateCategoryPair,
  setLanguage
} = useCategories(props.language)

// Reactive data
const selectedMainCategory = ref(props.modelValue?.categoryId || null)
const selectedSubcategory = ref(props.modelValue?.subcategoryId || null)
const searchTerm = ref('')
const searchResults = ref([])

// Computed
const mainCategoryId = computed(() => `main-category-${Math.random().toString(36).substr(2, 9)}`)
const subcategoryId = computed(() => `subcategory-${Math.random().toString(36).substr(2, 9)}`)

const availableSubcategories = computed(() => {
  if (!selectedMainCategory.value) return []
  return getSubcategoryOptions(selectedMainCategory.value)
})

const breadcrumb = computed(() => {
  if (!selectedMainCategory.value) return []
  return getCategoryBreadcrumb(selectedMainCategory.value, selectedSubcategory.value)
})

const hasMainCategoryError = computed(() => {
  return props.errors.category || props.errors.categoryId
})

const mainCategoryError = computed(() => {
  return props.errors.category || props.errors.categoryId || ''
})

const hasSubcategoryError = computed(() => {
  return props.errors.subcategory || props.errors.subcategoryId
})

const subcategoryError = computed(() => {
  return props.errors.subcategory || props.errors.subcategoryId || ''
})

// Methods
const onMainCategoryChange = () => {
  // Reset subcategory when main category changes
  selectedSubcategory.value = null
  
  const value = {
    categoryId: selectedMainCategory.value,
    subcategoryId: null
  }
  
  emit('update:modelValue', value)
  emit('mainCategoryChange', selectedMainCategory.value)
  emit('change', value)
}

const onSubcategoryChange = () => {
  const value = {
    categoryId: selectedMainCategory.value,
    subcategoryId: selectedSubcategory.value
  }
  
  emit('update:modelValue', value)
  emit('subcategoryChange', selectedSubcategory.value)
  emit('change', value)
}

const onSearch = () => {
  if (searchTerm.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  
  searchResults.value = searchCategories(searchTerm.value.trim())
}

const clearSearch = () => {
  searchTerm.value = ''
  searchResults.value = []
}

const selectFromSearch = (result) => {
  if (result.type === 'main') {
    selectedMainCategory.value = result.id
    selectedSubcategory.value = null
  } else {
    selectedMainCategory.value = result.parentId
    selectedSubcategory.value = result.id
  }
  
  clearSearch()
  
  const value = {
    categoryId: selectedMainCategory.value,
    subcategoryId: selectedSubcategory.value
  }
  
  emit('update:modelValue', value)
  emit('change', value)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedMainCategory.value = newValue.categoryId
    selectedSubcategory.value = newValue.subcategoryId
  }
}, { deep: true })

watch(() => props.language, (newLanguage) => {
  setLanguage(newLanguage)
})

// Lifecycle
onMounted(() => {
  setLanguage(props.language)
})
</script>

<style scoped>
.category-selector {
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.category-breadcrumb {
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #dee2e6;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.text-danger {
  color: #dc3545 !important;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>