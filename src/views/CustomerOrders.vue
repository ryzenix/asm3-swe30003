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
            class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <i class="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-300"></i>
            <span>Làm mới</span>
          </button>
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
              v-model="filters.search"
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm..."
              class="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500"
            />
          </div>
          
          <!-- Status Filter -->
          <div class="relative">
            <select 
              v-model="filters.status"
              @change="fetchOrders"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang chuẩn bị</option>
              <option value="shipping">Đang giao hàng</option>
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
              type="date"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white cursor-pointer"
            />
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ apiData.pagination?.totalRecords || 0 }}</div>
            <div class="text-sm text-gray-600">Tổng đơn hàng</div>
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
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
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
              {{ hasActiveFilters ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại' : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!' }}
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
                  :disabled="!apiData.pagination.hasNextPage"
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

const router = useRouter()

// ===== REACTIVE STATE =====
const loading = ref(false)
const error = ref('')

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
const shippingOrders = computed(() => ordersList.value.filter(o => o.status === 'shipping').length)
const deliveredOrders = computed(() => ordersList.value.filter(o => o.status === 'delivered').length)

// ===== API METHODS =====
async function fetchOrders() {
  loading.value = true
  error.value = ''
  
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

    // For demo purposes, use mock data
    const mockData = generateMockCustomerOrders(params)
    
    ordersList.value = mockData.data.orders
    apiData.value = {
      pagination: mockData.data.pagination,
      filters: mockData.data.filters
    }
    
    // Uncomment when API is ready
    // const data = await getCustomerOrders(params)
    // if (data.success) {
    //   ordersList.value = data.data.orders
    //   apiData.value = {
    //     pagination: data.data.pagination,
    //     filters: data.data.filters
    //   }
    // } else {
    //   throw new Error(data.error || 'Failed to fetch orders')
    // }
  } catch (err) {
    console.error('Fetch orders error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng'
    ordersList.value = []
    apiData.value = { pagination: null, filters: {} }
  } finally {
    loading.value = false
  }
}

// Mock data generator for demo
function generateMockCustomerOrders(params) {
  const mockOrders = [
    {
      id: 1,
      orderNumber: '5276043',
      date: '2025-08-04',
      status: 'processing',
      deliveryType: 'grab',
      estimatedDelivery: {
        timeRange: 'Từ 18:00 - 19:00 ngày',
        date: '04/08/2025'
      },
      items: [
        { 
          id: 1, 
          name: 'Listerine Tartar Control', 
          quantity: 2, 
          price: 187000,
          image: '/img/product.avif'
        },
        { 
          id: 2, 
          name: 'Probiotics bổ sung men tiêu hóa', 
          quantity: 1, 
          price: 163850,
          image: '/img/product.avif'
        }
      ],
      pricing: {
        subtotal: 537850,
        shippingFee: 0,
        total: 537850
      }
    },
    {
      id: 2,
      orderNumber: '5276044',
      date: '2025-08-04',
      status: 'pending',
      deliveryType: 'standard',
      estimatedDelivery: {
        timeRange: 'Từ 14:00 - 16:00 ngày',
        date: '05/08/2025'
      },
      items: [
        { 
          id: 3, 
          name: 'Paracetamol 500mg', 
          quantity: 1, 
          price: 25000,
          image: '/img/product.avif'
        }
      ],
      pricing: {
        subtotal: 25000,
        shippingFee: 15000,
        total: 40000
      }
    },
    {
      id: 3,
      orderNumber: '5276045',
      date: '2025-08-03',
      status: 'delivered',
      deliveryType: 'express',
      estimatedDelivery: {
        timeRange: 'Đã giao lúc 15:30 ngày',
        date: '03/08/2025'
      },
      items: [
        { 
          id: 4, 
          name: 'Vitamin C 1000mg', 
          quantity: 2, 
          price: 150000,
          image: '/img/product.avif'
        },
        { 
          id: 5, 
          name: 'Omega-3 Fish Oil', 
          quantity: 1, 
          price: 280000,
          image: '/img/product.avif'
        }
      ],
      pricing: {
        subtotal: 580000,
        shippingFee: 0,
        total: 580000
      }
    },
    {
      id: 4,
      orderNumber: '5276046',
      date: '2025-08-02',
      status: 'shipping',
      deliveryType: 'grab',
      estimatedDelivery: {
        timeRange: 'Dự kiến giao từ 10:00 - 12:00 ngày',
        date: '05/08/2025'
      },
      items: [
        { 
          id: 6, 
          name: 'Thuốc ho Prospan', 
          quantity: 1, 
          price: 95000,
          image: '/img/product.avif'
        }
      ],
      pricing: {
        subtotal: 95000,
        shippingFee: 0,
        total: 95000
      }
    },
    {
      id: 5,
      orderNumber: '5276047',
      date: '2025-08-01',
      status: 'cancelled',
      deliveryType: 'standard',
      estimatedDelivery: {
        timeRange: 'Đã hủy',
        date: '01/08/2025'
      },
      items: [
        { 
          id: 7, 
          name: 'Kem chống nắng SPF 50', 
          quantity: 1, 
          price: 320000,
          image: '/img/product.avif'
        }
      ],
      pricing: {
        subtotal: 320000,
        shippingFee: 25000,
        total: 345000
      }
    },
    {
      id: 6,
      orderNumber: '5276048',
      date: '2025-07-30',
      status: 'delivered',
      deliveryType: 'express',
      estimatedDelivery: {
        timeRange: 'Đã giao lúc 09:15 ngày',
        date: '30/07/2025'
      },
      items: [
        { 
          id: 8, 
          name: 'Thuốc đau đầu Aspirin', 
          quantity: 2, 
          price: 45000,
          image: '/img/product.avif'
        },
        { 
          id: 9, 
          name: 'Gel bôi trơn Y-Lube', 
          quantity: 1, 
          price: 125000,
          image: '/img/product.avif'
        }
      ],
      pricing: {
        subtotal: 215000,
        shippingFee: 0,
        total: 215000
      }
    }
  ]

  // Apply filters
  let filteredOrders = mockOrders
  
  if (params.search) {
    filteredOrders = filteredOrders.filter(order => 
      order.orderNumber.includes(params.search) ||
      order.items.some(item => item.name.toLowerCase().includes(params.search.toLowerCase()))
    )
  }
  
  if (params.status) {
    filteredOrders = filteredOrders.filter(order => order.status === params.status)
  }
  
  if (params.dateFrom) {
    filteredOrders = filteredOrders.filter(order => order.date === params.dateFrom)
  }

  // Pagination
  const page = params.page || 1
  const limit = params.limit || 12
  const totalRecords = filteredOrders.length
  const totalPages = Math.ceil(totalRecords / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

  return {
    success: true,
    data: {
      orders: paginatedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages
      },
      filters: params
    }
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

function refreshOrders() {
  fetchOrders()
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
  router.push(`/orders/${order.orderNumber}`)
}



function goToProducts() {
  router.push('/products')
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  const icon = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle'
  
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 transform transition-all duration-300 flex items-center space-x-3`
  toast.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `
  
  document.body.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 100)
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
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