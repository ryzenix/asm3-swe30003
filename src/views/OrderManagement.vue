<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <header class="mb-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
              <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
              Quản lý đơn hàng
            </h1>
            <p class="text-gray-600 ml-6 text-lg">Theo dõi và quản lý trạng thái đơn hàng của khách hàng</p>
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <!-- Search Bar -->
          <div class="lg:col-span-2 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input 
              v-model="filters.search"
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
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
              <option value="shipped">Đã gửi hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>

          <!-- Prescription Filter -->
          <div class="relative">
            <select 
              v-model="filters.prescriptionStatus"
              @change="fetchOrders"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả đơn thuốc</option>
              <option value="has_prescription">Có đơn thuốc</option>
              <option value="no_prescription">Không có đơn thuốc</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
          
          <!-- Delivery Type Filter -->
          <div class="relative">
            <select 
              v-model="filters.deliveryType"
              @change="fetchOrders"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả loại giao hàng</option>
              <option value="grab">Grab</option>
              <option value="store">Tại cửa hàng</option>
              <option value="standard">Giao hàng tiêu chuẩn</option>
              <option value="express">Giao hàng nhanh</option>
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
        <div class="grid grid-cols-2 lg:grid-cols-8 gap-4 mt-6 pt-6 border-t border-gray-100">
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
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ cancelledOrders }}</div>
            <div class="text-sm text-gray-600">Đã hủy</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ prescriptionOrders }}</div>
            <div class="text-sm text-gray-600">Có đơn thuốc</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-pink-600">{{ pendingPrescriptions }}</div>
            <div class="text-sm text-gray-600">Đơn thuốc chờ xử lý</div>
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
      <section v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Desktop Table Header -->
        <div class="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
            <div class="col-span-3">Thông tin đơn hàng</div>
            <div class="col-span-2">Trạng thái</div>
            <div class="col-span-1">Đơn thuốc</div>
            <div class="col-span-2">Loại giao hàng</div>
            <div class="col-span-2">Tổng tiền</div>
            <div class="col-span-1">SĐT</div>
            <div class="col-span-1 text-center">Thao tác</div>
          </div>
        </div>

        <!-- Orders List Content -->
        <div v-if="ordersList.length > 0">
          <!-- Desktop Table Rows -->
          <div class="hidden lg:block divide-y divide-gray-100">
            <OrderCard 
              v-for="order in ordersList" 
              :key="`desktop-${order.id}-${pagination.page}`"
              :order="order"
              :is-mobile="false"
              @view-details="viewOrderDetails"
              @change-status="openStatusChangeModal"
              @cancel-order="openCancelOrderModal"
              @validate-prescription="openPrescriptionModal"
            />
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden space-y-4 p-4">
            <OrderCard 
              v-for="order in ordersList" 
              :key="`mobile-${order.id}-${pagination.page}`"
              :order="order"
              :is-mobile="true"
              @view-details="viewOrderDetails"
              @change-status="openStatusChangeModal"
              @cancel-order="openCancelOrderModal"
              @validate-prescription="openPrescriptionModal"
            >
              <template #additional-fields="{ order }">
                <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span class="text-sm text-gray-600">Mã đơn hàng:</span>
                  <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">#{{ order.orderNumber }}</span>
                </div>
              </template>
            </OrderCard>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Không tìm thấy đơn hàng</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            {{ hasActiveFilters ? 'Thử điều chỉnh bộ lọc để hiển thị kết quả phù hợp hơn' : 'Chưa có đơn hàng nào trong hệ thống' }}
          </p>
          <button 
            v-if="hasActiveFilters"
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
                v-model="pagination.limit"
                @change="changePage(1)"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
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
                <!-- First page -->
                <button 
                  @click="changePage(1)"
                  :disabled="pagination.page === 1"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang đầu"
                >
                  <i class="fas fa-angle-double-left"></i>
                </button>

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

                <!-- Last page -->
                <button 
                  @click="changePage(apiData.pagination.totalPages)"
                  :disabled="pagination.page === apiData.pagination.totalPages"
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

    <!-- Status Change Modal -->
    <StatusChangeModal
      :show="showStatusModal"
      :order="selectedOrder"
      :current-status="selectedOrder?.status"
      :saving="saving"
      :error="modalError"
      @close="closeStatusModal"
      @confirm="confirmStatusChange"
    />

    <!-- Cancel Order Modal -->
    <CancelOrderModal
      :show="showCancelModal"
      :order="selectedOrder"
      :saving="saving"
      :error="modalError"
      @close="closeCancelModal"
      @confirm="confirmCancelOrder"
    />

    <!-- Prescription Validation Modal -->
    <PrescriptionValidationModal
      :show="showPrescriptionModal"
      :order="selectedOrder"
      :saving="saving || prescriptionLoading"
      :error="modalError"
      @close="closePrescriptionModal"
      @validate="confirmPrescriptionValidation"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import OrderCard from '../components/OrderManagement/OrderCard.vue'
import StatusChangeModal from '../components/OrderManagement/StatusChangeModal.vue'
import CancelOrderModal from '../components/OrderManagement/CancelOrderModal.vue'
import PrescriptionValidationModal from '../components/OrderManagement/PrescriptionValidationModal.vue'
import { useOrderApi } from '../services/orderApi.js'
import { usePrescriptionApi } from '../services/prescriptionApi.js'
import { useErrorDisplay } from '../composables/useErrorDisplay.js'
import { useToast } from '../composables/useToast'

const router = useRouter()

// ===== REACTIVE STATE =====
const showStatusModal = ref(false)
const showCancelModal = ref(false)
const showPrescriptionModal = ref(false)
const selectedOrder = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const modalError = ref('')
const prescriptionLoading = ref(false)

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
  prescriptionStatus: '',
  deliveryType: '',
  date: ''
})

// Pagination
const pagination = ref({
  page: 1,
  limit: 10
})

// Debounce timer for search
let searchTimeout = null

// ===== API SERVICE =====
const { getOrdersList, updateOrderStatus, cancelOrder } = useOrderApi()
const { getPrescriptionDetails, getUserPrescriptions, updatePrescriptionStatus } = usePrescriptionApi()
const { showErrorToast, handleApiErrorWithToast } = useErrorDisplay()
const { showSuccess } = useToast()

// ===== COMPUTED PROPERTIES =====
const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.status || filters.value.prescriptionStatus || filters.value.deliveryType || filters.value.date
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
const cancelledOrders = computed(() => ordersList.value.filter(o => o.status === 'cancelled').length)
const prescriptionOrders = computed(() => ordersList.value.filter(o => o.prescriptionId).length)
const pendingPrescriptions = computed(() => ordersList.value.filter(o => o.prescriptionId && o.prescriptionData?.validationStatus === 'pending').length)

// ===== DATA TRANSFORMATION =====
function transformOrderData(apiOrder) {
  // Transform API response to match OrderCard component expectations
  return {
    id: apiOrder.id,
    orderNumber: apiOrder.orderNumber || apiOrder.id?.toString() || 'N/A',
    date: apiOrder.createdAt || apiOrder.date || new Date().toISOString(),
    status: apiOrder.status || 'pending',
    deliveryType: apiOrder.shippingMethod || apiOrder.deliveryType || 'standard',
    customerInfo: {
      name: apiOrder.customerName || apiOrder.user?.name || apiOrder.user?.fullName || 'Unknown Customer',
      phone: apiOrder.customerPhone || apiOrder.user?.phone || 'N/A',
      address: apiOrder.shippingAddress || apiOrder.address || 'N/A'
    },
    items: apiOrder.items || apiOrder.orderItems || [{
      id: 1,
      name: 'Product',
      quantity: apiOrder.itemCount || 1,
      price: parseFloat(apiOrder.totalAmount || 0),
      requiresPrescription: apiOrder.prescriptionRequired || false
    }],
    pricing: {
      subtotal: parseFloat(apiOrder.totalAmount || 0),
      total: parseFloat(apiOrder.totalAmount || 0)
    },
    // Add prescriptionId directly to order object for easy access
    prescriptionId: apiOrder.prescriptionId || null,
    prescriptionData: apiOrder.prescriptionRequired ? {
      id: apiOrder.prescriptionId || null,
      files: [],
      uploadedAt: apiOrder.createdAt,
      expiryDate: null,
      validationStatus: apiOrder.prescription?.status || 'pending',
      validationInfo: null
    } : null
  }
}

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
    
    if (filters.value.deliveryType) {
      params.deliveryType = filters.value.deliveryType
    }

    if (filters.value.prescriptionStatus) {
      params.prescriptionStatus = filters.value.prescriptionStatus
    }
    
    if (filters.value.date) {
      params.dateFrom = filters.value.date
      params.dateTo = filters.value.date
    }

    // Use real API
    const data = await getOrdersList(params)
    if (data.success) {
      // Transform API data to match OrderCard expectations
      const rawOrders = data.data.orders || data.data || []
      ordersList.value = rawOrders.map(transformOrderData)
      
      apiData.value = {
        pagination: data.data.pagination || data.pagination || { 
          totalRecords: rawOrders.length, 
          currentPage: params.page || 1, 
          totalPages: Math.ceil(rawOrders.length / (params.limit || 10)), 
          limit: params.limit || 10, 
          hasPrevPage: (params.page || 1) > 1, 
          hasNextPage: (params.page || 1) < Math.ceil(rawOrders.length / (params.limit || 10))
        },
        filters: data.data.filters || {}
      }
    } else {
      throw new Error(data.error || 'Failed to fetch orders')
    }
    
    // Fallback to mock data if API fails
    // const mockData = generateMockOrders(params)
    // ordersList.value = mockData.data.orders
    // apiData.value = {
    //   pagination: mockData.data.pagination,
    //   filters: mockData.data.filters
    // }
  } catch (err) {
    console.error('Fetch orders error:', err)
    const errorInfo = handleApiErrorWithToast(err, 'Fetch orders', 'Không thể tải danh sách đơn hàng')
    error.value = errorInfo.message
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
watch([showStatusModal, showCancelModal, showPrescriptionModal], ([statusModal, cancelModal, prescriptionModal]) => {
  if (statusModal || cancelModal || prescriptionModal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

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
    prescriptionStatus: '',
    deliveryType: '',
    date: ''
  }
  pagination.value.page = 1
  fetchOrders()
}

function viewOrderDetails(order) {
  router.push(`/orders/${order.id}`)
}

function openStatusChangeModal(order) {
  selectedOrder.value = order
  modalError.value = ''
  showStatusModal.value = true
}

function closeStatusModal() {
  showStatusModal.value = false
  selectedOrder.value = null
  modalError.value = ''
}

function openCancelOrderModal(order) {
  selectedOrder.value = order
  modalError.value = ''
  showCancelModal.value = true
}

function closeCancelModal() {
  showCancelModal.value = false
  selectedOrder.value = null
  modalError.value = ''
}

async function openPrescriptionModal(order) {
  selectedOrder.value = order
  modalError.value = ''
  showPrescriptionModal.value = true
  
  // Fetch prescription details if order has prescription
  if (order.prescriptionId) {
    try {
      prescriptionLoading.value = true
      
      // Get prescription ID directly from order object
      const prescriptionId = order.prescriptionId
      
      if (prescriptionId) {
        const response = await getPrescriptionDetails(prescriptionId)
        
        if (response.success && response.data) {
          // Update the selected order with real prescription data
          selectedOrder.value = {
            ...selectedOrder.value,
            prescriptionData: {
              ...selectedOrder.value.prescriptionData,
              id: prescriptionId,
              images: response.data.images || [],
              createdAt: response.data.createdAt,
              expiryDate: response.data.expiryDate,
              validationStatus: response.data.status || 'pending',
              validationInfo: response.data.reviewedBy ? {
                pharmacistName: response.data.reviewedBy,
                validatedAt: response.data.reviewedAt,
                notes: response.data.reviewNotes
              } : null,
              patientName: response.data.patientName,
              doctorName: response.data.doctorName,
              doctorLicense: response.data.doctorLicense,
              clinicName: response.data.clinicName,
              issueDate: response.data.issueDate,
              notes: response.data.notes,
              diagnosis: response.data.diagnosis,
              items: response.data.items || []
            }
          }
        } else {
          modalError.value = 'Không tìm thấy thông tin đơn thuốc.'
        }
      } else {
        modalError.value = 'Không tìm thấy ID đơn thuốc.'
      }
    } catch (error) {
      console.error('Failed to fetch prescription details:', error)
      modalError.value = 'Không thể tải thông tin đơn thuốc. Vui lòng thử lại.'
    } finally {
      prescriptionLoading.value = false
    }
  }
}

function closePrescriptionModal() {
  showPrescriptionModal.value = false
  selectedOrder.value = null
  modalError.value = ''
}

async function confirmStatusChange(statusData) {
  if (!selectedOrder.value) return
  
  saving.value = true
  modalError.value = ''
  
  try {
    // Use real API
    const data = await updateOrderStatus(selectedOrder.value.id, statusData)
    if (data.success) {
      showSuccess(`Đã cập nhật trạng thái đơn hàng #${selectedOrder.value.orderNumber} thành công!`)
      await fetchOrders()
      closeStatusModal()
    } else {
      throw new Error(data.error || 'Failed to update order status')
    }
    
    // Fallback for demo purposes
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // const orderIndex = ordersList.value.findIndex(o => o.id === selectedOrder.value.id)
    // if (orderIndex !== -1) {
    //   ordersList.value[orderIndex].status = statusData.status
    // }
    // showToast(`Đã cập nhật trạng thái đơn hàng #${selectedOrder.value.orderNumber} thành công!`, 'success')
    // closeStatusModal()
  } catch (err) {
    console.error('Update status error:', err)
    const errorInfo = handleApiErrorWithToast(err, 'Update order status', 'Không thể cập nhật trạng thái đơn hàng')
    modalError.value = errorInfo.message
  } finally {
    saving.value = false
  }
}

async function confirmCancelOrder(cancelData) {
  if (!selectedOrder.value) return
  
  saving.value = true
  modalError.value = ''
  
  try {
    // Use real API
    const data = await cancelOrder(selectedOrder.value.id, cancelData)
    if (data.success) {
      showSuccess(`Đã hủy đơn hàng #${selectedOrder.value.orderNumber} thành công!`)
      await fetchOrders()
      closeCancelModal()
    } else {
      throw new Error(data.error || 'Failed to cancel order')
    }
    
    // Fallback for demo purposes
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // const orderIndex = ordersList.value.findIndex(o => o.id === selectedOrder.value.id)
    // if (orderIndex !== -1) {
    //   ordersList.value[orderIndex].status = 'cancelled'
    // }
    // showToast(`Đã hủy đơn hàng #${selectedOrder.value.orderNumber} thành công!`, 'success')
    // closeCancelModal()
  } catch (err) {
    console.error('Cancel order error:', err)
    const errorInfo = handleApiErrorWithToast(err, 'Cancel order', 'Không thể hủy đơn hàng')
    modalError.value = errorInfo.message
  } finally {
    saving.value = false
  }
}

async function confirmPrescriptionValidation(validationData) {
  if (!selectedOrder.value) return
  
  // Handle error from the modal
  if (validationData.error) {
    modalError.value = validationData.error
    return
  }
  
  saving.value = true
  modalError.value = ''
  
  try {
    // Get prescription ID from order data
    const prescriptionId = selectedOrder.value.prescriptionId || selectedOrder.value.prescriptionData?.id
    
    if (!prescriptionId) {
      throw new Error('Không tìm thấy ID đơn thuốc')
    }
    
    // Use the correct prescription API for validation
    const data = await updatePrescriptionStatus(prescriptionId, {
      status: validationData.status,
      reviewNotes: validationData.notes,
      reviewedBy: validationData.pharmacistName
    })
    
    if (data.success) {
      showSuccess(`Đã xác thực đơn thuốc cho đơn hàng #${selectedOrder.value.orderNumber} thành công!`)
      await fetchOrders()
      closePrescriptionModal()
    } else {
      throw new Error(data.error || 'Failed to validate prescription')
    }
    
  } catch (error) {
    console.error('Validate prescription error:', error)
    
    // Use standardized error handling to get the proper message
    const errorInfo = handleApiErrorWithToast(error, 'Prescription validation', 'Không thể xác thực đơn thuốc')
    modalError.value = errorInfo.message
  } finally {
    saving.value = false
  }
}





// ===== LIFECYCLE =====
onMounted(() => {
  fetchOrders()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  showStatusModal.value = false
  showCancelModal.value = false
  showPrescriptionModal.value = false
})
</script>

<style scoped>
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