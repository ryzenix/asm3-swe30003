<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <header class="mb-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
              <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
              Quản lý sản phẩm
            </h1>
            <p class="text-gray-600 ml-6 text-lg">Tạo, chỉnh sửa và quản lý sản phẩm theo đối tượng sử dụng</p>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="showCreateModal = true"
              class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <i class="fas fa-plus group-hover:rotate-12 transition-transform duration-300"></i>
              <span>Thêm sản phẩm mới</span>
            </button>
            <button 
              @click="exportProducts"
              class="group bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <i class="fas fa-download group-hover:rotate-12 transition-transform duration-300"></i>
              <span>Xuất dữ liệu</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Search and Filters -->
      <section class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search Bar -->
          <div class="lg:col-span-2 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input 
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500"
            />
          </div>
          
          <!-- Category Filter -->
          <div class="relative">
            <select 
              v-model="categoryFilter"
              @change="fetchProducts"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              <option v-for="category in mainCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
          
          <!-- Status Filter -->
          <div class="relative">
            <select 
              v-model="statusFilter"
              @change="fetchProducts"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ apiData.pagination?.totalRecords || 0 }}</div>
            <div class="text-sm text-gray-600">Tổng sản phẩm</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ activeProducts }}</div>
            <div class="text-sm text-gray-600">Đang bán</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ inactiveProducts }}</div>
            <div class="text-sm text-gray-600">Tạm ngưng</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ outOfStockProducts }}</div>
            <div class="text-sm text-gray-600">Hết hàng</div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center">
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
      </div>

      <!-- Products Table -->
      <section v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Desktop Table Header -->
        <div class="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
            <div class="col-span-1">
              <input 
                type="checkbox" 
                v-model="selectAll"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div class="col-span-3">Sản phẩm</div>
            <div class="col-span-1">Mã SP</div>
            <div class="col-span-2">Danh mục</div>
            <div class="col-span-2">Giá</div>
            <div class="col-span-1">Tồn kho</div>
            <div class="col-span-1">Trạng thái</div>
            <div class="col-span-1 text-center">Thao tác</div>
          </div>
        </div>

        <!-- Products List Content -->
        <div v-if="filteredProducts.length > 0">
          <!-- Desktop Table Rows -->
          <div class="hidden lg:block divide-y divide-gray-100">
            <div 
              v-for="product in filteredProducts" 
              :key="`desktop-${product.id}`"
              class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1">
                  <input 
                    type="checkbox" 
                    v-model="selectedProducts"
                    :value="product.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div class="col-span-3">
                  <div class="flex items-center">
                    <img 
                      :src="getProductImage(product)" 
                      :alt="product.title"
                      class="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      @error="handleImageError"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                      <div class="text-sm text-gray-500">{{ product.manufacturer }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="text-sm font-medium text-gray-900">{{ product.sku || 'N/A' }}</div>
                </div>
                <div class="col-span-2">
                  <div class="space-y-1">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ product.category }}
                    </span>
                    <div v-if="product.subcategory" class="text-xs text-gray-600">
                      {{ product.subcategory }}
                    </div>
                  </div>
                </div>
                <div class="col-span-2">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatPrice(product.priceValue || product.price) }}
                  </div>
                  <div v-if="product.discount" class="text-xs text-red-600">
                    Giảm {{ product.discount }}%
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="text-sm font-medium text-gray-900">
                    <span :class="[
                      product.stockQuantity > 50 ? 'text-green-600' : 
                      product.stockQuantity > 10 ? 'text-yellow-600' : 'text-red-600'
                    ]">
                      {{ product.stockQuantity || 0 }}
                    </span>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="space-y-1">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      product.status === 'active' ? 'bg-green-100 text-green-800' : '',
                      product.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : ''
                    ]">
                      {{ getStatusText(product.status) }}
                    </span>
                    <div v-if="product.stockQuantity === 0" class="text-xs text-red-600 font-medium">
                      ⚠️ Hết hàng
                    </div>
                  </div>
                </div>
                <div class="col-span-1 text-center">
                  <div class="flex gap-2 justify-center">
                    <button 
                      @click="editProduct(product)"
                      class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                      title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="openDeleteModal(product)"
                      class="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                    <button 
                      @click="toggleProductStatus(product)"
                      :class="[
                        'transition-colors duration-200',
                        product.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                      ]"
                      :title="product.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'"
                    >
                      <i :class="product.status === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden space-y-4 p-4">
            <div 
              v-for="product in filteredProducts" 
              :key="`mobile-${product.id}`"
              class="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    v-model="selectedProducts"
                    :value="product.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <img 
                    :src="getProductImage(product)" 
                    :alt="product.title"
                    class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    @error="handleImageError"
                  />
                </div>
                <div class="flex gap-2">
                  <button 
                    @click="editProduct(product)"
                    class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="openDeleteModal(product)"
                    class="text-red-600 hover:text-red-900 transition-colors duration-200"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button 
                    @click="toggleProductStatus(product)"
                    :class="[
                      'transition-colors duration-200',
                      product.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                    ]"
                    :title="product.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'"
                  >
                    <i :class="product.status === 'active' ? 'fas fa-pause' : 'fas fa-play'"></i>
                  </button>
                </div>
              </div>
              
              <div class="space-y-2">
                <div>
                  <h3 class="font-medium text-gray-900">{{ product.title }}</h3>
                  <p class="text-sm text-gray-500">{{ product.manufacturer }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Mã SP:</span>
                    <span class="font-mono bg-gray-100 px-2 py-1 rounded ml-1">{{ product.sku || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Danh mục:</span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-1">
                      {{ product.category }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-600">Giá:</span>
                    <span class="font-medium text-gray-900 ml-1">{{ formatPrice(product.priceValue || product.price) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Tồn kho:</span>
                    <span :class="[
                      'font-medium ml-1',
                      product.stockQuantity > 50 ? 'text-green-600' : 
                      product.stockQuantity > 10 ? 'text-yellow-600' : 'text-red-600'
                    ]">
                      {{ product.stockQuantity || 0 }}
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ getStatusText(product.status) }}
                  </span>
                  <div v-if="product.stockQuantity === 0" class="text-xs text-red-600 font-medium">
                    ⚠️ Hết hàng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-box text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Không tìm thấy sản phẩm</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            {{ hasActiveFilters ? 'Thử điều chỉnh bộ lọc để hiển thị kết quả phù hợp hơn' : 'Hãy thêm sản phẩm đầu tiên vào hệ thống' }}
          </p>
          <button 
            v-if="!hasActiveFilters"
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-plus mr-2"></i>
            Thêm sản phẩm đầu tiên
          </button>
          <button 
            v-else
            @click="clearFilters"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-filter mr-2"></i>
            Xóa bộ lọc
          </button>
        </div>

        <!-- Pagination Section -->
        <div v-if="apiData.pagination && apiData.pagination.totalRecords > 0" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <!-- Items per page selector -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600">Hiển thị:</span>
              <select 
                v-model="itemsPerPage"
                @change="changePage(1)"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span class="text-sm text-gray-600">sản phẩm/trang</span>
            </div>

            <!-- Pagination info and controls -->
            <div class="flex items-center space-x-4">
              <!-- Page info -->
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ startIndex + 1 }}</span>
                -
                <span class="font-medium">{{ Math.min(endIndex, apiData.pagination.totalRecords) }}</span>
                trong
                <span class="font-medium">{{ apiData.pagination.totalRecords }}</span>
                kết quả
              </div>

              <!-- Pagination controls -->
              <div class="flex items-center space-x-1">
                <!-- First page -->
                <button 
                  @click="changePage(1)"
                  :disabled="currentPage === 1"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang đầu"
                >
                  <i class="fas fa-angle-double-left"></i>
                </button>

                <!-- Previous page -->
                <button 
                  @click="changePage(currentPage - 1)"
                  :disabled="!apiData.pagination.hasPrevPage"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang trước"
                >
                  <i class="fas fa-angle-left"></i>
                </button>

                <!-- Page numbers -->
                <template v-for="page in visiblePages" :key="page">
                  <button 
                    v-if="page !== '...'"
                    @click="changePage(page)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200',
                      page === currentPage
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'border border-gray-200 hover:bg-gray-100'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                </template>

                <!-- Next page -->
                <button 
                  @click="changePage(currentPage + 1)"
                  :disabled="!apiData.pagination.hasNextPage"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang sau"
                >
                  <i class="fas fa-angle-right"></i>
                </button>

                <!-- Last page -->
                <button 
                  @click="changePage(apiData.pagination.totalPages)"
                  :disabled="currentPage === apiData.pagination.totalPages"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang cuối"
                >
                  <i class="fas fa-angle-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Create/Edit Product Modal -->
    <CreateEditModal 
      v-if="showCreateModal"
      :product="editingProduct"
      @close="closeModal"
      @save="saveProduct"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteModal 
      v-if="showDeleteModal"
      :product="productToDelete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <!-- Success Modal -->
    <SuccessModal 
      v-if="showSuccessModal"
      :message="successMessage"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import CreateEditModal from '../components/ProductManagement/CreateEditModal.vue'
import DeleteModal from '../components/ProductManagement/DeleteModal.vue'
import SuccessModal from '../components/ProductManagement/SuccessModal.vue'
import { mainCategories, getSubcategories } from '../constants/categories.js'
import { useProductApi } from '../services/productApi.js'

// Reactive state
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectAll = ref(false)
const selectedProducts = ref([])

// Modal states
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const editingProduct = ref(null)
const productToDelete = ref(null)
const successMessage = ref('')

// API service
const { getProducts, createProduct, updateProduct, deleteProduct: deleteProductApi } = useProductApi()

// Products data from API
const products = ref([])
const loading = ref(false)
const error = ref('')

// API data for pagination and filters
const apiData = ref({
  pagination: null,
  filters: {}
})

// Debounce timer for search
let searchTimeout = null

// Computed properties
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }

  return filtered
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || categoryFilter.value || statusFilter.value
})

// Pagination computed properties
const startIndex = computed(() => {
  if (!apiData.value.pagination) return 0
  return (apiData.value.pagination.currentPage - 1) * apiData.value.pagination.limit
})

const endIndex = computed(() => {
  if (!apiData.value.pagination) return 0
  return startIndex.value + apiData.value.pagination.limit
})

const visiblePages = computed(() => {
  if (!apiData.value.pagination) return []
  
  const current = apiData.value.pagination.currentPage
  const total = apiData.value.pagination.totalPages
  const delta = 2
  
  let range = []
  let rangeWithDots = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }
  
  rangeWithDots.push(...range)
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }
  
  return [...new Set(rangeWithDots)].filter((page, index, arr) => {
    if (page === 1 && arr.indexOf(1) !== index) return false
    if (page === total && arr.indexOf(total) !== index) return false
    return true
  })
})

// Statistics - computed from current products list
const activeProducts = computed(() => products.value.filter(p => p.status === 'active').length)
const inactiveProducts = computed(() => products.value.filter(p => p.status === 'inactive').length)
const outOfStockProducts = computed(() => products.value.filter(p => p.stockQuantity === 0).length)

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
    
    const response = await getProducts(params)
    
    if (response.success) {
      products.value = response.data.products
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
    products.value = []
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
    case 'active': return 'Đang bán'
    case 'inactive': return 'Tạm ngưng'
    case 'out_of_stock': return 'Hết hàng'
    default: return 'Không xác định'
  }
}

const getProductImage = (product) => {
  // Handle backend response structure
  if (product.images && product.images.length > 0) {
    const mainIndex = product.mainImageIndex || 0
    return product.images[mainIndex] || product.images[0]
  }
  // Fallback to single image field
  return product.image || '/img/products/placeholder-product.jpg'
}

const formatPrice = (price) => {
  if (!price) return 'N/A'
  // If price is already formatted (string), return as is
  if (typeof price === 'string' && price.includes('đ')) {
    return price
  }
  // If price is a number, format it
  const numPrice = parseInt(price)
  return numPrice.toLocaleString('vi-VN') + 'đ'
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}

const editProduct = (product) => {
  editingProduct.value = { ...product }
  showCreateModal.value = true
}

const openDeleteModal = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const toggleProductStatus = async (product) => {
  try {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    const response = await updateProduct(product.id, { status: newStatus })
    
    if (response.success) {
      product.status = newStatus
      showSuccessMessage(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm ngưng'} sản phẩm "${product.title}"`)
    } else {
      throw new Error(response.error || 'Failed to update product status')
    }
  } catch (err) {
    console.error('Toggle product status error:', err)
    showSuccessMessage(`Lỗi: ${err.message}`)
  }
}

const saveProduct = async (productData) => {
  try {
    if (editingProduct.value) {
      // Update existing product
      const response = await updateProduct(editingProduct.value.id, productData)
      if (response.success) {
        showSuccessMessage('Đã cập nhật sản phẩm thành công')
        await fetchProducts() // Refresh the list
        closeModal() // Only close on success
      } else {
        throw new Error(response.error || 'Failed to update product')
      }
    } else {
      // Create new product
      const response = await createProduct(productData)
      if (response.success) {
        showSuccessMessage('Đã tạo sản phẩm mới thành công')
        await fetchProducts() // Refresh the list
        closeModal() // Only close on success
      } else {
        throw new Error(response.error || 'Failed to create product')
      }
    }
  } catch (err) {
    console.error('Save product error:', err)
    // Don't close modal on error - let the modal handle the error display
    showSuccessMessage(`Lỗi: ${err.message}`)
    throw err // Re-throw to let the modal handle it
  }
}

const confirmDelete = async () => {
  try {
    const response = await deleteProductApi(productToDelete.value.id)
    if (response.success) {
      showSuccessMessage('Đã xóa sản phẩm thành công')
      await fetchProducts() // Refresh the list
    } else {
      throw new Error(response.error || 'Failed to delete product')
    }
  } catch (err) {
    console.error('Delete product error:', err)
    showSuccessMessage(`Lỗi: ${err.message}`)
  }
  showDeleteModal.value = false
  productToDelete.value = null
}

const closeModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
}

const showSuccessMessage = (message) => {
  successMessage.value = message
  showSuccessModal.value = true
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = filteredProducts.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= (apiData.value.pagination?.totalPages || 1)) {
    currentPage.value = page
    fetchProducts()
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  fetchProducts()
}

const exportProducts = () => {
  // Implementation for exporting products
  console.log('Exporting products...')
  showSuccessMessage('Đã xuất dữ liệu sản phẩm thành công')
}

// Watchers
watch([searchQuery, categoryFilter, statusFilter], () => {
  debouncedSearch()
})

// Watch pagination limit changes
watch(() => itemsPerPage.value, () => {
  currentPage.value = 1
  fetchProducts()
})

// Initialize on mount
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Transition styles for create/edit modal fade-in and fade-out */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}

/* Custom scrollbar for modal body */
.max-h-\[70vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[70vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 