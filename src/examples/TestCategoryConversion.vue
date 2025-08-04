<template>
  <div class="test-conversion p-4">
    <h2>Test Category Conversion</h2>
    
    <!-- Test Form -->
    <div class="border rounded p-4 mb-4">
      <h3>Simulate CreateEditModal Form</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Category:</label>
            <select v-model="form.category" class="form-select" @change="onCategoryChange">
              <option value="">Chọn danh mục</option>
              <option v-for="category in mainCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div v-if="form.category && hasSubcategories(form.category)" class="mb-3">
            <label class="form-label">Subcategory:</label>
            <select v-model="form.subcategory" class="form-select" @change="onSubcategoryChange">
              <option value="">Chọn danh mục phụ</option>
              <option v-for="subcategory in availableSubcategories" :key="subcategory" :value="subcategory">
                {{ subcategory }}
              </option>
            </select>
          </div>
          
          <button class="btn btn-primary" @click="testConversion">
            Test Conversion
          </button>
        </div>
        
        <div class="col-md-6">
          <h5>Current Form Values:</h5>
          <pre class="bg-light p-3 rounded">{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Conversion Result -->
    <div v-if="conversionResult" class="border rounded p-4 mb-4">
      <h3>Conversion Result</h3>
      <div class="row">
        <div class="col-md-6">
          <h5>✅ What will be sent to backend:</h5>
          <div class="p-3 bg-success bg-opacity-10 rounded">
            <strong>category:</strong> {{ conversionResult.categoryId }} <small class="text-muted">(ID instead of "{{ form.category }}")</small><br>
            <strong>subcategory:</strong> {{ conversionResult.subcategoryId }} <small class="text-muted">(ID instead of "{{ form.subcategory }}")</small>
          </div>
        </div>
        
        <div class="col-md-6">
          <h5>📊 Category Information:</h5>
          <div v-if="categoryInfo" class="p-3 bg-info bg-opacity-10 rounded">
            <div class="d-flex align-items-center mb-2">
              <span class="fs-4 me-2">{{ categoryInfo.icon }}</span>
              <div>
                <strong>{{ categoryInfo.name }}</strong><br>
                <small>ID: {{ categoryInfo.id }} | Key: {{ categoryInfo.key }}</small>
              </div>
            </div>
            
            <div v-if="subcategoryInfo" class="mt-2 p-2 bg-white rounded">
              <div class="d-flex align-items-center">
                <span class="fs-5 me-2">{{ subcategoryInfo.icon }}</span>
                <div>
                  <strong>{{ subcategoryInfo.name }}</strong><br>
                  <small>ID: {{ subcategoryInfo.id }} | Key: {{ subcategoryInfo.key }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Database Query Preview -->
    <div v-if="conversionResult" class="border rounded p-4">
      <h3>Database Query Preview</h3>
      <div class="row">
        <div class="col-md-6">
          <h5>❌ Old Query (Slow):</h5>
          <code class="d-block p-3 bg-danger bg-opacity-10 rounded">
            SELECT * FROM products<br>
            WHERE category = '{{ form.category }}'<br>
            <span v-if="form.subcategory">AND subcategory = '{{ form.subcategory }}'</span>
          </code>
          <small class="text-muted">String comparison, full table scan</small>
        </div>
        
        <div class="col-md-6">
          <h5>✅ New Query (Fast):</h5>
          <code class="d-block p-3 bg-success bg-opacity-10 rounded">
            SELECT * FROM products<br>
            WHERE category = {{ conversionResult.categoryId }}<br>
            <span v-if="conversionResult.subcategoryId">AND subcategory = {{ conversionResult.subcategoryId }}</span>
          </code>
          <small class="text-muted">Integer comparison with B-tree indexes (same field names, but IDs instead of strings)</small>
        </div>
      </div>
      
      <div class="mt-3 p-3 bg-warning bg-opacity-10 rounded">
        <h6>Performance Improvement:</h6>
        <ul class="mb-0">
          <li><strong>Query Speed:</strong> 10-100x faster with integer indexes</li>
          <li><strong>Storage:</strong> 4 bytes vs 20-50 bytes per field</li>
          <li><strong>Indexing:</strong> B-tree indexes work efficiently with integers</li>
          <li><strong>Joins:</strong> Much faster foreign key relationships</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLegacyCategories, useCategories } from '../composables/useCategories.js'

// Composables
const { mainCategories, getSubcategories, hasSubcategories } = useLegacyCategories()
const { convertLegacyCategory, getCategoryInfo } = useCategories()

// Form state
const form = ref({
  category: '',
  subcategory: ''
})

// Conversion result
const conversionResult = ref(null)

// Computed
const availableSubcategories = computed(() => {
  if (!form.value.category) return []
  return getSubcategories(form.value.category)
})

const categoryInfo = computed(() => {
  if (!conversionResult.value?.categoryId) return null
  return getCategoryInfo(conversionResult.value.categoryId)
})

const subcategoryInfo = computed(() => {
  if (!conversionResult.value?.subcategoryId) return null
  return getCategoryInfo(conversionResult.value.subcategoryId)
})

// Methods
const onCategoryChange = () => {
  form.value.subcategory = '' // Reset subcategory when category changes
  conversionResult.value = null
}

const onSubcategoryChange = () => {
  conversionResult.value = null
}

const testConversion = () => {
  if (!form.value.category) {
    alert('Vui lòng chọn category trước!')
    return
  }
  
  // This is exactly what CreateEditModal does
  const result = convertLegacyCategory(form.value.category, form.value.subcategory)
  
  if (result) {
    conversionResult.value = result
    console.log('Conversion successful:', result)
    console.log('Payload that will be sent to backend:', {
      category: result.categoryId,      // ✅ ID in category field
      subcategory: result.subcategoryId, // ✅ ID in subcategory field
      originalNames: {
        category: form.value.category,
        subcategory: form.value.subcategory
      }
    })
  } else {
    alert('Không thể convert category này!')
    console.error('Conversion failed for:', form.value.category, form.value.subcategory)
  }
}
</script>

<style scoped>
.test-conversion {
  max-width: 1200px;
  margin: 0 auto;
}

.border {
  border: 1px solid #dee2e6 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

pre {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

code {
  font-size: 0.875em;
  line-height: 1.4;
}

.bg-success {
  --bs-bg-opacity: 0.1;
}

.bg-info {
  --bs-bg-opacity: 0.1;
}

.bg-danger {
  --bs-bg-opacity: 0.1;
}

.bg-warning {
  --bs-bg-opacity: 0.1;
}
</style>