<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- FILTER SIDEBAR -->
      <aside class="lg:w-64 w-full bg-white rounded-xl shadow-sm p-4 text-sm">
        <h2 class="font-semibold text-gray-800 mb-4 flex items-center justify-between">
          Bộ lọc nâng cao
          <i class="fas fa-sliders-h text-gray-500"></i>
        </h2>

        <!-- Filter Sections -->
        <FilterSection
          v-for="section in filters"
          :key="section.label"
          :section="section"
          v-model="activeFilters[section.label]"
          @update:modelValue="applyFilters"
        />

        <!-- Clear Filters Button -->
        <button 
          @click="clearAllFilters"
          class="w-full mt-4 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Xóa tất cả bộ lọc
        </button>
      </aside>

      <!-- PRODUCT LIST -->
      <div class="flex-1">
        <!-- Top Row -->
        <div class="flex flex-wrap items-center justify-between mb-4 text-sm">
          <p class="text-gray-600">
            Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
          </p>
          <div class="flex gap-2 items-center">
            <span class="text-gray-700 font-medium">Sắp xếp theo:</span>
            <button 
              @click="setSortBy('bestseller')"
              :class="[
                'px-3 py-1 rounded-full transition',
                sortBy === 'bestseller' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 border hover:bg-gray-50'
              ]"
            >
              Bán chạy
            </button>
            <button 
              @click="setSortBy('price_asc')"
              :class="[
                'px-3 py-1 rounded-full transition',
                sortBy === 'price_asc' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 border hover:bg-gray-50'
              ]"
            >
              Giá thấp
            </button>
            <button 
              @click="setSortBy('price_desc')"
              :class="[
                'px-3 py-1 rounded-full transition',
                sortBy === 'price_desc' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 border hover:bg-gray-50'
              ]"
            >
              Giá cao
            </button>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-4 text-sm text-gray-600">
          <span>
            Hiển thị {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredProducts.length) }} 
            của {{ filteredProducts.length }} sản phẩm
          </span>
          <div class="flex items-center gap-2">
            <span>Hiển thị:</span>
            <select 
              v-model="itemsPerPage" 
              @change="goToPage(1)"
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="24">24</option>
              <option value="32">32</option>
            </select>
            <span>sản phẩm</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Đang tải danh sách sản phẩm...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchProducts"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          <ProductCard
            v-for="(product, index) in paginatedProducts"
            :key="`${product.title}-${index}`"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- No Results Message -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg mb-2">
            <i class="fas fa-search text-3xl mb-4"></i>
          </div>
          <p class="text-gray-600 text-lg mb-2">Không tìm thấy sản phẩm nào</p>
          <p class="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>

        <!-- Pagination -->
        <PaginationControls
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import ProductCard from '../components/ProductList/ProductCard.vue'
import FilterSection from '../components/ProductList/FilterSection.vue'
import PaginationControls from '../components/ProductList/PaginationControls.vue'
import { mainCategories, getSubcategories } from '../constants/categories.js'
import { useProductApi } from '../services/productApi.js'

// Filter configuration
const filters = [
  {
    label: "Danh mục",
    options: ["Tất cả", ...mainCategories],
  },
  {
    label: "Giá bán",
    options: ["Dưới 100.000đ", "100.000đ đến 300.000đ", "300.000đ đến 500.000đ", "Trên 500.000đ"],
  },
  {
    label: "Nhà sản xuất",
    options: ["Pharmacity", "Dược Hậu Giang", "Mega We Care", "Traphaco"],
  },
]

// API service
const { getProducts } = useProductApi()

// Products data from API
const allProducts = ref([])
const loading = ref(false)
const error = ref('')

// API data for pagination and filters
const apiData = ref({
  pagination: null,
  filters: {}
})

// Reactive state
const activeFilters = reactive({
  "Danh mục": [],
  "Giá bán": [],
  "Nhà sản xuất": []
})

const sortBy = ref('bestseller')
const currentPage = ref(1)
const itemsPerPage = ref(8)

// API Functions
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      status: 'active' // Only show active products for customers
    }
    
    // Add search if any filter is active
    const searchTerms = []
    Object.keys(activeFilters).forEach(filterType => {
      const selectedOptions = activeFilters[filterType]
      if (selectedOptions.length > 0) {
        selectedOptions.forEach(option => {
          if (option !== "Tất cả") {
            searchTerms.push(option)
          }
        })
      }
    })
    
    if (searchTerms.length > 0) {
      params.search = searchTerms.join(' ')
    }
    
    const response = await getProducts(params)
    
    if (response.success) {
      allProducts.value = response.data.products
      apiData.value = {
        pagination: response.data.pagination,
        filters: response.data.filters
      }
    } else {
      throw new Error(response.error || 'Failed to fetch products')
    }
  } catch (err) {
    console.error('Fetch products error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải danh sách sản phẩm'
    allProducts.value = []
    apiData.value = { pagination: null, filters: {} }
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredProducts = computed(() => {
  let products = [...allProducts.value]

  // Apply client-side filtering for price ranges and additional filters
  Object.keys(activeFilters).forEach(filterType => {
    const selectedOptions = activeFilters[filterType]
    if (selectedOptions.length > 0) {
      products = products.filter(product => {
        return selectedOptions.some(option => {
          switch (filterType) {
            case "Danh mục":
              return option === "Tất cả" || product.category === option
            case "Giá bán":
              return checkPriceRange(product.priceValue, option)
            case "Nhà sản xuất":
              return product.manufacturer === option
            default:
              return true
          }
        })
      })
    }
  })

  // Apply sorting
  switch (sortBy.value) {
    case 'price_asc':
      products.sort((a, b) => a.priceValue - b.priceValue)
      break
    case 'price_desc':
      products.sort((a, b) => b.priceValue - a.priceValue)
      break
    case 'bestseller':
    default:
      // Keep original order for bestseller
      break
  }

  return products
})

const totalPages = computed(() => {
  return apiData.value.pagination?.totalPages || Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value)
})

// Methods
const getStatusText = (status) => {
  switch (status) {
    case 'available': return 'Có sẵn'
    case 'low_stock': return 'Sắp hết hàng'
    default: return 'Không xác định'
  }
}

const checkPriceRange = (price, range) => {
  switch (range) {
    case "Dưới 100.000đ":
      return price < 100000
    case "100.000đ đến 300.000đ":
      return price >= 100000 && price <= 300000
    case "300.000đ đến 500.000đ":
      return price >= 300000 && price <= 500000
    case "Trên 500.000đ":
      return price > 500000
    default:
      return true
  }
}

const setSortBy = (sort) => {
  sortBy.value = sort
  goToPage(1)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts()
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchProducts()
}

const clearAllFilters = () => {
  Object.keys(activeFilters).forEach(key => {
    activeFilters[key] = []
  })
  currentPage.value = 1
  fetchProducts()
}

const handleAddToCart = (product) => {
  console.log('Adding to cart:', product)
  // Implement your add to cart logic here
  // Could emit to parent component, call API, etc.
}

// Watch for changes that should reset pagination
watch([filteredProducts], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})

// Initialize on mount
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Hide arrows on number inputs */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>