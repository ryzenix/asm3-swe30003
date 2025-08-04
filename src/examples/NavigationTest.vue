<template>
  <div class="navigation-test p-4">
    <h2>Test Navigation với Categories System Mới</h2>
    
    <!-- Navigation Component Test -->
    <div class="border rounded p-4 mb-4">
      <h3>Navigation Items từ Categories System:</h3>
      
      <div v-if="navigationItems.length > 0">
        <div v-for="item in navigationItems" :key="item.id || item.name" class="mb-4">
          <div class="d-flex align-items-center mb-2">
            <i :class="item.icon" class="me-2"></i>
            <strong>{{ item.name }}</strong>
            <span v-if="item.id" class="badge bg-secondary ms-2">ID: {{ item.id }}</span>
          </div>
          
          <div v-if="item.dropdown && item.dropdown.length > 0" class="ms-4">
            <div v-for="subItem in item.dropdown" :key="subItem.id || subItem.name" class="mb-1">
              <div class="d-flex align-items-center">
                <i class="fas fa-arrow-right me-2 text-muted"></i>
                <span>{{ subItem.name }}</span>
                <span v-if="subItem.id" class="badge bg-light text-dark ms-2">ID: {{ subItem.id }}</span>
              </div>
              <small class="text-muted ms-4">{{ subItem.description }}</small>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-muted">
        Đang tải navigation items...
      </div>
    </div>

    <!-- Navigation Selection Test -->
    <div class="border rounded p-4 mb-4">
      <h3>Test Navigation Selection:</h3>
      
      <div class="row">
        <div class="col-md-6">
          <h5>Chọn Category:</h5>
          <select v-model="selectedCategory" class="form-select mb-3" @change="onCategoryChange">
            <option value="">Chọn category</option>
            <option v-for="item in categoryItems" :key="item.id" :value="item">
              {{ item.name }}
            </option>
          </select>
          
          <div v-if="selectedCategory && selectedCategory.dropdown">
            <h5>Chọn Subcategory:</h5>
            <select v-model="selectedSubcategory" class="form-select" @change="onSubcategoryChange">
              <option value="">Chọn subcategory</option>
              <option v-for="sub in selectedCategory.dropdown" :key="sub.id" :value="sub">
                {{ sub.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="col-md-6">
          <h5>Selection Result:</h5>
          <div v-if="selectionResult" class="p-3 bg-light rounded">
            <pre>{{ JSON.stringify(selectionResult, null, 2) }}</pre>
          </div>
          <div v-else class="text-muted">
            Chưa có selection
          </div>
        </div>
      </div>
    </div>

    <!-- URL Generation Test -->
    <div class="border rounded p-4">
      <h3>Test URL Generation:</h3>
      
      <div v-if="urlExamples.length > 0">
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Generated URL</th>
                <th>IDs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="example in urlExamples" :key="example.id">
                <td>{{ example.categoryName }}</td>
                <td>{{ example.subcategoryName || '-' }}</td>
                <td>
                  <code>/products/{{ example.url }}</code>
                </td>
                <td>
                  <small>
                    Cat: {{ example.categoryId }}<br>
                    Sub: {{ example.subcategoryId || '-' }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCategories } from '../composables/useCategories.js'

// Composables
const { mainCategories, getSubcategories } = useCategories()

// State
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const selectionResult = ref(null)

// Helper function to create slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Icon mapping
const categoryIcons = {
  'medicine': 'fas fa-pills',
  'supplement': 'fas fa-leaf', 
  'cosmeceutical': 'fas fa-spa',
  'personal_care': 'fas fa-user-check',
  'mother_baby': 'fas fa-baby',
  'medical_device': 'fas fa-stethoscope'
}

// Computed properties
const navigationItems = computed(() => {
  const items = mainCategories.value.map(category => {
    const subcategories = getSubcategories(category.id)
    
    return {
      id: category.id,
      name: category.name,
      icon: categoryIcons[category.key] || category.icon,
      slug: createSlug(category.name),
      dropdown: subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description || `Sản phẩm ${sub.name.toLowerCase()}`,
        slug: createSlug(sub.name),
        categoryId: category.id,
        subcategoryId: sub.id
      }))
    }
  })

  // Add static items
  items.push(
    { name: 'Bệnh lý', icon: 'fas fa-heartbeat', slug: 'benh-ly' },
    { name: 'Góc sức khỏe', icon: 'fas fa-heart', slug: 'goc-suc-khoe' },
    { name: 'Tin tức', icon: 'fas fa-newspaper', slug: 'tin-tuc' }
  )

  return items
})

const categoryItems = computed(() => {
  return navigationItems.value.filter(item => item.dropdown && item.dropdown.length > 0)
})

const urlExamples = computed(() => {
  const examples = []
  
  categoryItems.value.forEach(category => {
    // Main category URL
    examples.push({
      id: `cat-${category.id}`,
      categoryName: category.name,
      subcategoryName: null,
      categoryId: category.id,
      subcategoryId: null,
      url: category.slug
    })
    
    // Subcategory URLs
    category.dropdown.forEach(sub => {
      examples.push({
        id: `sub-${sub.id}`,
        categoryName: category.name,
        subcategoryName: sub.name,
        categoryId: category.id,
        subcategoryId: sub.id,
        url: `${category.slug}/${sub.slug}`
      })
    })
  })
  
  return examples.slice(0, 10) // Limit to first 10 for display
})

// Methods
const onCategoryChange = () => {
  selectedSubcategory.value = ''
  updateSelectionResult()
}

const onSubcategoryChange = () => {
  updateSelectionResult()
}

const updateSelectionResult = () => {
  if (!selectedCategory.value) {
    selectionResult.value = null
    return
  }
  
  const result = {
    category: {
      id: selectedCategory.value.id,
      name: selectedCategory.value.name,
      slug: selectedCategory.value.slug
    }
  }
  
  if (selectedSubcategory.value) {
    result.subcategory = {
      id: selectedSubcategory.value.id,
      name: selectedSubcategory.value.name,
      slug: selectedSubcategory.value.slug,
      description: selectedSubcategory.value.description
    }
    
    result.url = `/products/${selectedCategory.value.slug}/${selectedSubcategory.value.slug}`
    result.categoryId = selectedCategory.value.id
    result.subcategoryId = selectedSubcategory.value.id
  } else {
    result.url = `/products/${selectedCategory.value.slug}`
    result.categoryId = selectedCategory.value.id
    result.subcategoryId = null
  }
  
  selectionResult.value = result
}
</script>

<style scoped>
.navigation-test {
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
}

.badge {
  font-size: 0.75em;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>