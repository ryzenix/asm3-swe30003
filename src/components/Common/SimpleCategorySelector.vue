<template>
  <div class="simple-category-selector">
    <!-- Main Category Selection -->
    <div class="form-group mb-3">
      <label class="form-label">
        Danh mục chính
        <span v-if="required" class="text-danger">*</span>
      </label>
      <select 
        v-model="selectedMainCategory"
        class="form-select"
        :class="{ 'is-invalid': hasMainCategoryError }"
        :disabled="disabled"
        @change="onMainCategoryChange"
      >
        <option value="">Chọn danh mục chính</option>
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
    <div v-if="selectedMainCategory && availableSubcategories.length > 0" class="form-group mb-3">
      <label class="form-label">
        Danh mục phụ
        <span v-if="subcategoryRequired" class="text-danger">*</span>
      </label>
      <select 
        v-model="selectedSubcategory"
        class="form-select"
        :class="{ 'is-invalid': hasSubcategoryError }"
        :disabled="disabled"
        @change="onSubcategoryChange"
      >
        <option value="">Chọn danh mục phụ</option>
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
  setLanguage
} = useCategories(props.language)

// Reactive data
const selectedMainCategory = ref(props.modelValue?.categoryId || null)
const selectedSubcategory = ref(props.modelValue?.subcategoryId || null)

// Computed
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
.simple-category-selector {
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.category-breadcrumb {
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
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

.form-select {
  display: block;
  width: 100%;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  appearance: none;
}

.form-select:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-select:disabled {
  background-color: #e9ecef;
  opacity: 1;
}
</style>