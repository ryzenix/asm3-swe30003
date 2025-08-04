<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <!-- FILTER SIDEBAR -->
      <div class="lg:w-72 w-full">
        <div v-if="isLoadingFilters" class="bg-white rounded-lg shadow-sm border p-4">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              <div class="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <FilterSidebar
          v-else
          :filters="filters"
          :active-filters="activeFilters"
          @update-filter="updateFilter"
          @clear-filters="clearAllFilters"
        />
      </div>

      <!-- PRODUCT LIST -->
      <div class="flex-1 min-w-0">
        <!-- Header with Notice and Sort -->
        <ProductListHeader
          :current-sort="sortBy"
          @sort-change="setSortBy"
        />

        <!-- Controls -->
        <ProductListControls
          v-if="!loading && !error"
          :start-index="startIndex"
          :end-index="endIndex"
          :total-results="apiData.pagination?.totalRecords || 0"
          :items-per-page="itemsPerPage"
          @items-per-page-change="handleItemsPerPageChange"
        />

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchProducts"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>

        <!-- Product Grid -->
        <ProductGrid
          v-else
          :products="paginatedProducts"
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
          @quick-view="handleQuickView"
          @add-to-compare="handleAddToCompare"
          @share="handleShare"
          @clear-filters="clearAllFilters"
        />

        <!-- Pagination -->
        <PaginationControls
          v-if="!loading && !error && apiData.pagination && apiData.pagination.totalRecords > 0"
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
import FilterSidebar from '../components/ProductList/FilterSidebar.vue'
import ProductListHeader from '../components/ProductList/ProductListHeader.vue'
import ProductListControls from '../components/ProductList/ProductListControls.vue'
import ProductGrid from '../components/ProductList/ProductGrid.vue'
import PaginationControls from '../components/ProductList/PaginationControls.vue'
import { useProductApi } from '../services/productApi.js'
import { useCategories } from '../composables/useCategories.js'

// API composable
const { getProducts, getFilterOptions } = useProductApi()

// Categories composable
const { getCategoryInfo } = useCategories()

// Filter configuration - will be populated from API
const filters = ref([])
const isLoadingFilters = ref(true)

// Products data from API
const apiProducts = ref([])
const loading = ref(false)
const error = ref('')

// API data for pagination
const apiData = ref({
  pagination: null,
  filters: {}
})

// Pagination and filtering state
const currentPage = ref(1)
const itemsPerPage = ref(8)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('bestseller')

// Debounce timer for search
let searchTimeout = null

// Reactive state
const activeFilters = reactive({})

// Computed properties
const filteredProducts = computed(() => {
  // Return products from API, filtering is handled by backend
  return apiProducts.value || []
})

const totalPages = computed(() => {
  return apiData.value.pagination?.totalPages || 1
})

const startIndex = computed(() => {
  if (!apiData.value.pagination) return 0
  return (apiData.value.pagination.currentPage - 1) * apiData.value.pagination.limit
})

const endIndex = computed(() => {
  if (!apiData.value.pagination) return 0
  return startIndex.value + apiData.value.pagination.limit
})

const paginatedProducts = computed(() => {
  // API already returns paginated results
  return filteredProducts.value
})

// API Functions
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value
    }

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    if (categoryFilter.value) {
      params.category = categoryFilter.value
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    
    if (sortBy.value && sortBy.value !== 'bestseller') {
      params.sort = sortBy.value
    }
    
    const response = await getProducts(params)
    
    if (response.success) {
      apiProducts.value = response.data.products || []
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
    apiProducts.value = []
    apiData.value = { pagination: null, filters: {} }
  } finally {
    loading.value = false
  }
}

// Debounced search function
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when searching
    fetchProducts()
  }, 500) // 500ms delay
}

// Methods
const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Có sẵn'
    case 'inactive': return 'Tạm ngưng'
    case 'out_of_stock': return 'Hết hàng'
    default: return 'Không xác định'
  }
}

const getProductImage = (product) => {
  const placeholder = '/img/products/placeholder-product.jpg'
  
  // Handle backend response structure
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const mainIndex = product.mainImageIndex || 0
    const imageUrl = product.images[mainIndex] || product.images[0]
    return imageUrl || placeholder
  }
  
  // Fallback to single image field
  const imageUrl = product.image
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl
  }
  
  return placeholder
}

const formatPrice = (price) => {
  if (!price && price !== 0) return 'N/A'
  // If price is already formatted (string), return as is
  if (typeof price === 'string' && price.includes('đ')) {
    return price
  }
  // If price is a number, format it
  const numPrice = parseInt(price)
  if (isNaN(numPrice)) return 'N/A'
  return numPrice.toLocaleString('vi-VN') + 'đ'
}

// Store price ranges for lookup
const priceRangesMap = ref(new Map())

const checkPriceRange = (price, rangeLabel) => {
  // Handle dynamic price ranges from API using stored map
  if (priceRangesMap.value.has(rangeLabel)) {
    const range = priceRangesMap.value.get(rangeLabel)
    return price >= range.min && price <= range.max
  }
  
  // Fallback for static ranges
  switch (rangeLabel) {
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
  currentPage.value = 1
  fetchProducts()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts()
  }
}

const updateFilter = (filterType, value) => {
  activeFilters[filterType] = value
  
  // Convert filter to API parameters
  if (filterType === "Danh mục" && value.length > 0) {
    // For category filter, we need to convert display names back to IDs
    // For now, we'll use the first selected category
    const selectedCategory = value[0]
    if (selectedCategory !== "Tất cả") {
      // Find category ID by display name
      // This is a simplified approach - in a real app you'd want more robust mapping
      categoryFilter.value = selectedCategory
    } else {
      categoryFilter.value = ''
    }
  } else if (filterType === "Trạng thái" && value.length > 0) {
    const statusMapping = {
      'Có sẵn': 'active',
      'Tạm ngưng': 'inactive', 
      'Hết hàng': 'out_of_stock'
    }
    statusFilter.value = statusMapping[value[0]] || ''
  } else {
    // Clear filters if no value selected
    if (filterType === "Danh mục") categoryFilter.value = ''
    if (filterType === "Trạng thái") statusFilter.value = ''
  }
  
  currentPage.value = 1
  fetchProducts()
}

const clearAllFilters = () => {
  Object.keys(activeFilters).forEach(key => {
    activeFilters[key] = []
  })
  categoryFilter.value = ''
  statusFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
  fetchProducts()
}

const handleItemsPerPageChange = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage
  currentPage.value = 1
  fetchProducts()
}

const handleAddToCart = (product) => {
  console.log('Adding to cart:', product)
  // Implement your add to cart logic here
  // Could emit to parent component, call API, etc.
}

const handleAddToWishlist = (data) => {
  console.log('Wishlist action:', data)
  // Implement wishlist logic
}

const handleQuickView = (product) => {
  console.log('Quick view:', product)
  // Implement quick view modal logic
}

const handleAddToCompare = (product) => {
  console.log('Add to compare:', product)
  // Implement compare logic
}

const handleShare = (product) => {
  console.log('Share product:', product)
  // Implement share logic
}

// Helper function to get category display name using the categories composable
const getCategoryDisplayName = (categoryId) => {
  if (!categoryId) return 'N/A'
  
  // If it's already a name (legacy), return as is
  if (typeof categoryId === 'string' && isNaN(categoryId)) {
    return categoryId
  }
  
  // Convert to number if it's a string number
  const numericId = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
  
  // Get category info by ID using the composable
  const categoryInfo = getCategoryInfo(numericId)
  return categoryInfo ? categoryInfo.name : `Unknown Category (ID: ${categoryId})`
}

// Fetch filter options from API
const fetchFilterOptions = async () => {
  try {
    isLoadingFilters.value = true
    const response = await getFilterOptions()
    
    if (response.success) {
      const filterData = response.data
      const dynamicFilters = []
      
      // Categories filter
      if (filterData.categories && filterData.categories.length > 0) {
        const categoryOptions = ["Tất cả"]
        filterData.categories.forEach(cat => {
          // Convert category ID to display name using composable
          const categoryDisplayName = getCategoryDisplayName(cat.category)
          categoryOptions.push(categoryDisplayName)
          
          if (cat.subcategories && cat.subcategories.length > 0) {
            // Convert subcategory IDs to display names
            const subcategoryDisplayNames = cat.subcategories.map(sub => getCategoryDisplayName(sub))
            categoryOptions.push(...subcategoryDisplayNames)
          }
        })
        
        dynamicFilters.push({
          label: "Danh mục",
          options: [...new Set(categoryOptions)] // Remove duplicates
        })
        
        // Initialize active filters
        activeFilters["Danh mục"] = []
      }
      
      // Price ranges filter
      if (filterData.priceRange && filterData.priceRange.suggestedRanges) {
        // Store price ranges mapping for filtering logic
        priceRangesMap.value.clear()
        filterData.priceRange.suggestedRanges.forEach(range => {
          priceRangesMap.value.set(range.label, {
            min: range.min,
            max: range.max
          })
        })
        
        dynamicFilters.push({
          label: "Giá bán",
          options: filterData.priceRange.suggestedRanges.map(range => range.label)
        })
        
        activeFilters["Giá bán"] = []
      }
      
      // Manufacturers filter
      if (filterData.manufacturers && filterData.manufacturers.length > 0) {
        dynamicFilters.push({
          label: "Nhà sản xuất",
          options: filterData.manufacturers
        })
        
        activeFilters["Nhà sản xuất"] = []
      }
      
      // Status filter
      if (filterData.statuses && filterData.statuses.length > 0) {
        const statusLabels = filterData.statuses.map(status => {
          switch (status) {
            case 'active': return 'Đang bán'
            case 'inactive': return 'Ngừng bán'
            case 'out_of_stock': return 'Hết hàng'
            default: return status
          }
        })
        
        dynamicFilters.push({
          label: "Trạng thái",
          options: statusLabels
        })
        
        activeFilters["Trạng thái"] = []
      }
      
      // Origins filter
      if (filterData.origins && filterData.origins.length > 0) {
        dynamicFilters.push({
          label: "Xuất xứ",
          options: filterData.origins
        })
        
        activeFilters["Xuất xứ"] = []
      }
      
      filters.value = dynamicFilters
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    // Fallback to static filters if API fails
    filters.value = [
      {
        label: "Đối tượng sử dụng",
        options: ["Tất cả", "Trẻ em", "Người trưởng thành", "Người lớn", "Người cao tuổi"],
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
    
    // Initialize active filters for fallback
    activeFilters["Đối tượng sử dụng"] = []
    activeFilters["Giá bán"] = []
    activeFilters["Nhà sản xuất"] = []
  } finally {
    isLoadingFilters.value = false
  }
}

// Watch for search query changes with debouncing
watch(searchQuery, () => {
  debouncedSearch()
})

// Watch for changes that should reset pagination
watch([filteredProducts], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})

// Initialize on component mount
onMounted(() => {
  fetchFilterOptions()
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