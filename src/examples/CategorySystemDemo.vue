<template>
  <div class="category-demo p-4">
    <h2>Demo Hệ thống Categories Mới</h2>
    
    <!-- Language Selector -->
    <div class="mb-4">
      <label class="form-label">Ngôn ngữ:</label>
      <select v-model="currentLanguage" class="form-select w-auto" @change="onLanguageChange">
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>

    <!-- Category Selector Demo -->
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5>Category Selector Component</h5>
          </div>
          <div class="card-body">
            <CategorySelector
              v-model="selectedCategories"
              :required="true"
              :subcategory-required="false"
              :enable-search="true"
              :show-breadcrumb="true"
              :language="currentLanguage"
              @change="onCategoryChange"
            />
            
            <div v-if="selectedCategories.categoryId" class="mt-3">
              <h6>Kết quả:</h6>
              <pre>{{ JSON.stringify(selectedCategories, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5>Category Information</h5>
          </div>
          <div class="card-body">
            <div v-if="categoryInfo">
              <div class="d-flex align-items-center mb-2">
                <span class="fs-4 me-2">{{ categoryInfo.icon }}</span>
                <div>
                  <h6 class="mb-0">{{ categoryInfo.name }}</h6>
                  <small class="text-muted">ID: {{ categoryInfo.id }} | Key: {{ categoryInfo.key }}</small>
                </div>
              </div>
              <p class="text-muted">{{ categoryInfo.description }}</p>
              
              <div v-if="subcategoryInfo" class="mt-3 p-2 bg-light rounded">
                <div class="d-flex align-items-center">
                  <span class="fs-5 me-2">{{ subcategoryInfo.icon }}</span>
                  <div>
                    <strong>{{ subcategoryInfo.name }}</strong>
                    <br>
                    <small class="text-muted">ID: {{ subcategoryInfo.id }} | Key: {{ subcategoryInfo.key }}</small>
                  </div>
                </div>
                <p class="text-muted mb-0 mt-1">{{ subcategoryInfo.description }}</p>
              </div>
            </div>
            <div v-else class="text-muted">
              Chọn category để xem thông tin
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Demo -->
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5>Tìm kiếm Categories</h5>
          </div>
          <div class="card-body">
            <div class="input-group mb-3">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Nhập từ khóa tìm kiếm..."
                @input="onSearch"
              >
              <button class="btn btn-outline-secondary" @click="clearSearch">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div v-if="searchResults.length > 0">
              <h6>Kết quả tìm kiếm ({{ searchResults.length }}):</h6>
              <div class="list-group">
                <div
                  v-for="result in searchResults"
                  :key="`${result.id}-${result.type}`"
                  class="list-group-item d-flex align-items-center"
                >
                  <span class="me-2">{{ result.icon }}</span>
                  <div class="flex-grow-1">
                    <div class="fw-bold">{{ result.name }}</div>
                    <small class="text-muted">{{ result.description }}</small>
                  </div>
                  <span class="badge bg-secondary">
                    {{ result.type === 'main' ? 'Chính' : 'Phụ' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else-if="searchTerm" class="text-muted">
              Không tìm thấy kết quả
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5>Thống kê Categories</h5>
          </div>
          <div class="card-body">
            <div v-if="categoryStats">
              <div class="row text-center">
                <div class="col-4">
                  <div class="border rounded p-3">
                    <h4 class="text-primary">{{ categoryStats.totalMainCategories }}</h4>
                    <small>Danh mục chính</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border rounded p-3">
                    <h4 class="text-success">{{ categoryStats.totalSubcategories }}</h4>
                    <small>Danh mục phụ</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border rounded p-3">
                    <h4 class="text-info">{{ categoryStats.totalCategories }}</h4>
                    <small>Tổng cộng</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Categories Display -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Tất cả Categories</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div
                v-for="category in mainCategories"
                :key="category.id"
                class="col-md-4 mb-3"
              >
                <div class="border rounded p-3">
                  <div class="d-flex align-items-center mb-2">
                    <span class="fs-4 me-2">{{ category.icon }}</span>
                    <div>
                      <h6 class="mb-0">{{ category.name }}</h6>
                      <small class="text-muted">ID: {{ category.id }}</small>
                    </div>
                  </div>
                  <p class="text-muted small">{{ category.description }}</p>
                  
                  <!-- Subcategories -->
                  <div class="mt-2">
                    <small class="fw-bold">Danh mục phụ:</small>
                    <div class="mt-1">
                      <span
                        v-for="subcategory in getSubcategories(category.id)"
                        :key="subcategory.id"
                        class="badge bg-light text-dark me-1 mb-1"
                        :title="subcategory.description"
                      >
                        {{ subcategory.icon }} {{ subcategory.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legacy Conversion Demo -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Demo Legacy Conversion</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Nhập tên category cũ:</h6>
                <input
                  v-model="legacyCategory"
                  type="text"
                  class="form-control mb-2"
                  placeholder="VD: Thuốc"
                >
                <input
                  v-model="legacySubcategory"
                  type="text"
                  class="form-control mb-2"
                  placeholder="VD: Thuốc kê đơn (tùy chọn)"
                >
                <button class="btn btn-primary" @click="convertLegacy">
                  Convert
                </button>
              </div>
              <div class="col-md-6">
                <h6>Kết quả conversion:</h6>
                <div v-if="conversionResult" class="p-3 bg-light rounded">
                  <pre>{{ JSON.stringify(conversionResult, null, 2) }}</pre>
                </div>
                <div v-else-if="conversionError" class="alert alert-warning">
                  {{ conversionError }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import CategorySelector from '../components/Common/CategorySelector.vue'
import { useCategories } from '../composables/useCategories.js'

// Composables
const {
  mainCategories,
  getSubcategories,
  getCategoryInfo,
  searchCategories,
  convertLegacyCategory,
  getCategoryStats,
  setLanguage
} = useCategories()

// Reactive data
const currentLanguage = ref('vi')
const selectedCategories = ref({
  categoryId: null,
  subcategoryId: null
})
const searchTerm = ref('')
const searchResults = ref([])
const legacyCategory = ref('')
const legacySubcategory = ref('')
const conversionResult = ref(null)
const conversionError = ref('')

// Computed
const categoryInfo = computed(() => {
  if (!selectedCategories.value.categoryId) return null
  return getCategoryInfo(selectedCategories.value.categoryId)
})

const subcategoryInfo = computed(() => {
  if (!selectedCategories.value.subcategoryId) return null
  return getCategoryInfo(selectedCategories.value.subcategoryId)
})

const categoryStats = computed(() => {
  return getCategoryStats()
})

// Methods
const onLanguageChange = () => {
  setLanguage(currentLanguage.value)
}

const onCategoryChange = (categories) => {
  console.log('Category changed:', categories)
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

const convertLegacy = () => {
  conversionResult.value = null
  conversionError.value = ''
  
  if (!legacyCategory.value.trim()) {
    conversionError.value = 'Vui lòng nhập tên category'
    return
  }
  
  const result = convertLegacyCategory(
    legacyCategory.value.trim(),
    legacySubcategory.value.trim() || null
  )
  
  if (result) {
    conversionResult.value = result
  } else {
    conversionError.value = 'Không thể convert category này'
  }
}

// Lifecycle
onMounted(() => {
  setLanguage(currentLanguage.value)
})
</script>

<style scoped>
.category-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.list-group-item {
  border: 1px solid rgba(0, 0, 0, 0.125);
}

pre {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75em;
}

.border {
  border: 1px solid #dee2e6 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>