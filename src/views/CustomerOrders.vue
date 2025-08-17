<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <header class="mb-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
              <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
              Đơn hàng của tôi
            </h1>
            <p class="text-gray-600 ml-6 text-lg">Theo dõi trạng thái và lịch sử đơn hàng của bạn</p>
          </div>
          
          <button 
            @click="refreshOrders"
            :disabled="loading || refreshing"
            class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <i :class="[
              'fas fa-sync-alt transition-transform duration-300',
              refreshing ? 'animate-spin' : 'group-hover:rotate-180'
            ]"></i>
            <span>{{ refreshing ? 'Đang tải...' : 'Làm mới' }}</span>
          </button>
        </div>
      </header>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-600"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <section class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search Bar -->
          <div class="lg:col-span-2 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i v-if="!loading" class="fas fa-search text-gray-400"></i>
              <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
            <input 
              v-model="filters.search"
              @input="debouncedSearch"
              :disabled="loading"
              type="text" 
              placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm..."
              class="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <!-- Status Filter -->
          <div class="relative">
            <select 
              v-model="filters.status"
              @change="fetchOrders"
              :disabled="loading"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang chuẩn bị</option>
                      <option value="shipped">Đã gửi hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
          
          <!-- Date Filter -->
          <div class="relative">
            <input 
              v-model="filters.date"
              @change="fetchOrders"
              :disabled="loading"
              type="date"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ apiData.pagination?.totalRecords || 0 }}</div>
            <div class="text-sm text-gray-600">{{ hasActiveFilters ? 'Kết quả tìm kiếm' : 'Tổng đơn hàng' }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ pendingOrders }}</div>
            <div class="text-sm text-gray-600">Chờ xác nhận</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ processingOrders }}</div>
            <div class="text-sm text-gray-600">Đang xử lý</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ shippingOrders }}</div>
            <div class="text-sm text-gray-600">Đang giao</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ deliveredOrders }}</div>
            <div class="text-sm text-gray-600">Đã giao</div>
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
      <div v-else-if="error || apiError" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p class="text-gray-600 mb-4">{{ error || apiError }}</p>
          <button 
            @click="fetchOrders"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <section v-else class="space-y-6">
        <div v-if="ordersList.length > 0">
          <!-- Desktop and Mobile Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            <CustomerOrderCard 
              v-for="order in ordersList" 
              :key="`order-${order.id}-${pagination.page}`"
              :order="order"
              @view-details="viewOrderDetails"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 p-16">
          <div class="text-center">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">Chưa có đơn hàng nào</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ hasActiveFilters ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc hoặc xóa bộ lọc để xem tất cả đơn hàng.' : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!' }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                <i class="fas fa-filter mr-2"></i>
                Xóa bộ lọc
              </button>
              <button 
                @click="goToProducts"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                <i class="fas fa-shopping-bag mr-2"></i>
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination Section -->
        <div v-if="apiData.pagination && apiData.pagination.totalRecords > 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <!-- Items per page selector -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600">Hiển thị:</span>
              <select 
                v-model="pagination.limit"
                @change="changePage(1)"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option :value="6">6</option>
                <option :value="12">12</option>
                <option :value="24">24</option>
                <option :value="48">48</option>
              </select>
              <span class="text-sm text-gray-600">đơn hàng/trang</span>
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
                <!-- Previous page -->
                <button 
                  @click="changePage(pagination.page - 1)"
                  :disabled="!apiData.pagination?.hasPrevPage"
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
                      page === pagination.page
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
                  @click="changePage(pagination.page + 1)"
                  :disabled="!apiData.pagination?.hasNextPage"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang sau"
                >
                  <i class="fas fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CustomerOrderCard from '../components/CustomerOrders/CustomerOrderCard.vue'
import { useOrderApi } from '../services/orderApi'
import { useErrorHandler } from '../composables/useErrorHandler'

const router = useRouter()
const { getOrdersList } = useOrderApi()
const { apiError, clearAllErrors } = useErrorHandler()

// ===== REACTIVE STATE =====
const loading = ref(false)
const refreshing = ref(false)
const error = ref('')
const successMessage = ref('')

// API Data
const ordersList = ref([])
const apiData = ref({
  pagination: null,
  filters: {}
})

// Filters
const filters = ref({
  search: '',
  status: '',
  date: ''
})

// Pagination
const pagination = ref({
  page: 1,
  limit: 12
})

// Debounce timer for search
let searchTimeout = null

// ===== COMPUTED PROPERTIES =====
const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.status || filters.value.date
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

// Statistics - computed from current orders list
const pendingOrders = computed(() => ordersList.value.filter(o => o.status === 'pending').length)
const processingOrders = computed(() => ordersList.value.filter(o => ['confirmed', 'processing'].includes(o.status)).length)
const shippingOrders = computed(() => ordersList.value.filter(o => o.status === 'shipped').length)
const deliveredOrders = computed(() => ordersList.value.filter(o => o.status === 'delivered').length)

// ===== API METHODS =====
async function fetchOrders() {
  loading.value = true
  error.value = ''
  clearAllErrors()
  
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }

    if (filters.value.search.trim()) {
      params.search = filters.value.search.trim()
    }
    
    if (filters.value.status) {
      params.status = filters.value.status
    }
    
    if (filters.value.date) {
      params.dateFrom = filters.value.date
      params.dateTo = filters.value.date
    }

    const response = await getOrdersList(params)
    
    if (response.success) {
      ordersList.value = response.data.orders || []
      apiData.value = {
        pagination: response.data.pagination || null,
        filters: response.data.filters || {}
      }
    } else {
      throw new Error(response.error || 'Failed to fetch orders')
    }
  } catch (err) {
    console.error('Fetch orders error:', err)
    error.value = err.errorInfo?.message || err.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng'
    ordersList.value = []
    apiData.value = { pagination: null, filters: {} }
  } finally {
    loading.value = false
  }
}



// Debounced search function
function debouncedSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchOrders()
  }, 500)
}

// ===== WATCHERS =====
watch(() => pagination.value.limit, () => {
  pagination.value.page = 1
  fetchOrders()
})

// ===== METHODS =====
function changePage(page) {
  if (page >= 1 && page <= (apiData.value.pagination?.totalPages || 1)) {
    pagination.value.page = page
    fetchOrders()
  }
}

async function refreshOrders() {
  refreshing.value = true
  successMessage.value = ''
  try {
    await fetchOrders()
    successMessage.value = 'Danh sách đơn hàng đã được cập nhật'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } finally {
    refreshing.value = false
  }
}

function clearFilters() {
  filters.value = {
    search: '',
    status: '',
    date: ''
  }
  pagination.value.page = 1
  fetchOrders()
}

function viewOrderDetails(order) {
  // Use order ID for the route, as that's what the backend expects
  router.push(`/orders/${order.id}`)
}



function goToProducts() {
  router.push('/products')
}



// ===== LIFECYCLE =====
onMounted(() => {
  fetchOrders()
})

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
</style>