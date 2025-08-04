<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải thông tin đơn hàng...</span>
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
          <div class="flex justify-center space-x-4">
            <button 
              @click="fetchOrderDetails"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              <i class="fas fa-redo mr-2"></i>
              Thử lại
            </button>
            <router-link 
              to="/order-management"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Quay lại
            </router-link>
          </div>
        </div>
      </div>

      <!-- Order Details Content -->
      <div v-else-if="order" class="space-y-6">
        <!-- Header -->
        <header class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <router-link 
                  to="/order-management"
                  class="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <i class="fas fa-chevron-left mr-2"></i>
                  <span>Quay lại danh sách</span>
                </router-link>
              </div>
              
              <div>
                <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                  <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
                  Chi tiết đơn hàng #{{ order.orderNumber || order.id }}
                </h1>
                <p class="text-gray-600 ml-6 text-lg mt-2">
                  Đặt ngày {{ formatDate(order.createdAt) }}
                </p>
              </div>
            </div>
            
            <!-- Order Status Badge -->
            <div class="flex items-center space-x-4">
              <OrderStatusBadge :status="order.status" :size="'large'" />
              <div class="text-right">
                <div class="text-sm text-gray-600">Tổng tiền</div>
                <div class="text-2xl font-bold text-blue-600">{{ formatPrice(order.totalAmount) }}</div>
              </div>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Order Items -->
            <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-shopping-bag mr-2 text-blue-600"></i>
                  Sản phẩm đã đặt ({{ order.items?.length || 0 }} sản phẩm)
                </h3>
              </div>

              <div class="divide-y divide-gray-100">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-4">
                    <!-- Product Image -->
                    <div class="relative flex-shrink-0">
                      <img 
                        :src="item.image || '/img/products/placeholder-product.jpg'" 
                        :alt="item.title || item.productName"
                        class="w-20 h-20 object-contain rounded-xl border-2 border-gray-200 shadow-sm bg-white"
                        @error="handleImageError"
                      />
                      <div v-if="item.requiresPrescription" class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Rx
                      </div>
                    </div>
                    
                    <!-- Product Info -->
                    <div class="flex-1 space-y-2">
                      <h4 class="font-semibold text-gray-900 text-lg leading-tight">
                        {{ item.title || item.productName }}
                      </h4>
                      
                      <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span v-if="item.manufacturer" class="flex items-center">
                          <i class="fas fa-industry mr-1 text-blue-500"></i>
                          {{ item.manufacturer }}
                        </span>
                        <span v-if="item.category" class="flex items-center">
                          <i class="fas fa-tag mr-1 text-green-500"></i>
                          {{ item.category }}
                        </span>
                        <span v-if="item.productSku" class="flex items-center">
                          <i class="fas fa-barcode mr-1 text-purple-500"></i>
                          {{ item.productSku }}
                        </span>
                      </div>
                    </div>

                    <!-- Quantity and Price -->
                    <div class="text-right space-y-2">
                      <div class="flex items-center space-x-4">
                        <div class="text-center">
                          <div class="text-sm text-gray-600">Số lượng</div>
                          <div class="font-bold text-lg">{{ item.quantity }}</div>
                        </div>
                        <div class="text-center">
                          <div class="text-sm text-gray-600">Đơn giá</div>
                          <div class="font-bold text-lg">{{ formatPrice(item.unitPrice || item.priceValue) }}</div>
                        </div>
                        <div class="text-center">
                          <div class="text-sm text-gray-600">Thành tiền</div>
                          <div class="font-bold text-xl text-blue-600">
                            {{ formatPrice((item.unitPrice || item.priceValue) * item.quantity) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Prescription Section -->
            <section v-if="order.prescriptionData" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-prescription-bottle-alt mr-2 text-orange-600"></i>
                  Thông tin đơn thuốc
                  <span 
                    :class="[
                      'ml-3 px-3 py-1 rounded-full text-xs font-medium',
                      order.prescriptionData.validationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      order.prescriptionData.validationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    ]"
                  >
                    {{ 
                      order.prescriptionData.validationStatus === 'approved' ? 'Đã xác thực' :
                      order.prescriptionData.validationStatus === 'rejected' ? 'Bị từ chối' :
                      'Chờ xác thực'
                    }}
                  </span>
                </h3>
              </div>

              <div class="p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên bệnh nhân</label>
                    <div class="text-gray-900">{{ order.prescriptionData.patientName || 'Chưa cập nhật' }}</div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bác sĩ kê đơn</label>
                    <div class="text-gray-900">{{ order.prescriptionData.doctorName || 'Chưa cập nhật' }}</div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày kê đơn</label>
                    <div class="text-gray-900">{{ formatDate(order.prescriptionData.issueDate) }}</div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                    <div class="text-gray-900">{{ formatDate(order.prescriptionData.expiryDate) }}</div>
                  </div>
                </div>

                <!-- Prescription Files -->
                <div v-if="order.prescriptionData.files && order.prescriptionData.files.length > 0">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hình ảnh đơn thuốc</label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div 
                      v-for="(file, index) in order.prescriptionData.files" 
                      :key="index"
                      class="relative group cursor-pointer"
                      @click="openImageModal(file)"
                    >
                      <img 
                        :src="file.url || file.preview" 
                        :alt="`Đơn thuốc ${index + 1}`"
                        class="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow"
                      />
                      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                        <i class="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Validation Info -->
                <div v-if="order.prescriptionData.validationInfo" class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-2">Thông tin xác thực</h4>
                  <div class="space-y-2 text-sm">
                    <div><strong>Dược sĩ:</strong> {{ order.prescriptionData.validationInfo.pharmacistName }}</div>
                    <div><strong>Thời gian:</strong> {{ formatDate(order.prescriptionData.validationInfo.validatedAt) }}</div>
                    <div v-if="order.prescriptionData.validationInfo.notes">
                      <strong>Ghi chú:</strong> {{ order.prescriptionData.validationInfo.notes }}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Order Timeline -->
            <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-history mr-2 text-blue-600"></i>
                  Lịch sử đơn hàng
                </h3>
              </div>

              <div class="p-6">
                <div class="space-y-4">
                  <div 
                    v-for="(event, index) in orderTimeline" 
                    :key="index"
                    class="flex items-start space-x-4"
                  >
                    <div class="flex-shrink-0">
                      <div 
                        :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          event.type === 'success' ? 'bg-green-100 text-green-600' :
                          event.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          event.type === 'error' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        ]"
                      >
                        <i :class="event.icon"></i>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <h4 class="font-medium text-gray-900">{{ event.title }}</h4>
                        <span class="text-sm text-gray-500">{{ formatDate(event.timestamp) }}</span>
                      </div>
                      <p class="text-gray-600 text-sm mt-1">{{ event.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Customer Information -->
            <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-user mr-2 text-blue-600"></i>
                  Thông tin khách hàng
                </h3>
              </div>

              <div class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <div class="text-gray-900 font-medium">{{ order.shippingAddress?.name || order.customerInfo?.name || 'Chưa cập nhật' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <div class="text-gray-900">{{ order.shippingAddress?.phone || order.customerInfo?.phone || 'Chưa cập nhật' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                  <div class="text-gray-900">{{ order.shippingAddress?.address || order.customerInfo?.address || 'Chưa cập nhật' }}</div>
                </div>
              </div>
            </section>

            <!-- Delivery Information -->
            <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-truck mr-2 text-green-600"></i>
                  Thông tin giao hàng
                </h3>
              </div>

              <div class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phương thức giao hàng</label>
                  <div class="text-gray-900 font-medium">{{ getDeliveryMethodName(order.shippingMethod) }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phí vận chuyển</label>
                  <div class="text-gray-900">{{ formatPrice(order.shippingCost || 0) }}</div>
                </div>
                <div v-if="order.estimatedDeliveryDate">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dự kiến giao hàng</label>
                  <div class="text-gray-900">{{ formatDate(order.estimatedDeliveryDate) }}</div>
                </div>
                <div v-if="order.trackingNumber">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mã vận đơn</label>
                  <div class="text-gray-900 font-mono">{{ order.trackingNumber }}</div>
                </div>
              </div>
            </section>

            <!-- Payment Information -->
            <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-credit-card mr-2 text-purple-600"></i>
                  Thông tin thanh toán
                </h3>
              </div>

              <div class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                  <div class="text-gray-900 font-medium">{{ getPaymentMethodName(order.paymentMethod) }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
                  <span 
                    :class="[
                      'inline-flex px-3 py-1 rounded-full text-xs font-medium',
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    ]"
                  >
                    {{ getPaymentStatusName(order.paymentStatus) }}
                  </span>
                </div>

                <!-- Order Summary -->
                <div class="border-t border-gray-200 pt-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tạm tính</span>
                    <span class="font-medium">{{ formatPrice(order.totalAmount - (order.shippingCost || 0)) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Phí vận chuyển</span>
                    <span class="font-medium">{{ formatPrice(order.shippingCost || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span class="text-gray-900">Tổng cộng</span>
                    <span class="text-blue-600">{{ formatPrice(order.totalAmount) }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Order Notes -->
            <section v-if="order.notes" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-sticky-note mr-2 text-yellow-600"></i>
                  Ghi chú đơn hàng
                </h3>
              </div>

              <div class="p-6">
                <p class="text-gray-700">{{ order.notes }}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div 
      v-if="showImageModal" 
      class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-full">
        <img 
          :src="selectedImage" 
          alt="Đơn thuốc"
          class="max-w-full max-h-full object-contain rounded-lg"
        />
        <button 
          @click="closeImageModal"
          class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderApi } from '../services/orderApi'
import OrderStatusBadge from '../components/CustomerOrders/OrderStatusBadge.vue'

const route = useRoute()
const router = useRouter()
const { getOrderDetails } = useOrderApi()

// Reactive state
const order = ref(null)
const loading = ref(false)
const error = ref('')
const showImageModal = ref(false)
const selectedImage = ref('')

// Computed properties
const orderTimeline = computed(() => {
  if (!order.value) return []
  
  const timeline = [
    {
      title: 'Đơn hàng được tạo',
      description: 'Khách hàng đã đặt hàng thành công',
      timestamp: order.value.createdAt,
      icon: 'fas fa-plus-circle',
      type: 'info'
    }
  ]

  // Add prescription events
  if (order.value.prescriptionData) {
    timeline.push({
      title: 'Đơn thuốc được tải lên',
      description: 'Khách hàng đã tải lên đơn thuốc',
      timestamp: order.value.prescriptionData.uploadedAt,
      icon: 'fas fa-upload',
      type: 'info'
    })

    if (order.value.prescriptionData.validationInfo) {
      timeline.push({
        title: order.value.prescriptionData.validationStatus === 'approved' ? 'Đơn thuốc được xác thực' : 'Đơn thuốc bị từ chối',
        description: order.value.prescriptionData.validationInfo.notes || 'Dược sĩ đã xác thực đơn thuốc',
        timestamp: order.value.prescriptionData.validationInfo.validatedAt,
        icon: order.value.prescriptionData.validationStatus === 'approved' ? 'fas fa-check-circle' : 'fas fa-times-circle',
        type: order.value.prescriptionData.validationStatus === 'approved' ? 'success' : 'error'
      })
    }
  }

  // Add status change events based on current status
  const statusEvents = {
    'confirmed': {
      title: 'Đơn hàng được xác nhận',
      description: 'Đơn hàng đã được xác nhận và đang chuẩn bị',
      icon: 'fas fa-check',
      type: 'success'
    },
    'processing': {
      title: 'Đang chuẩn bị hàng',
      description: 'Đơn hàng đang được chuẩn bị để giao',
      icon: 'fas fa-box',
      type: 'info'
    },
    'shipping': {
      title: 'Đang giao hàng',
      description: 'Đơn hàng đang được vận chuyển',
      icon: 'fas fa-truck',
      type: 'info'
    },
    'delivered': {
      title: 'Đã giao hàng',
      description: 'Đơn hàng đã được giao thành công',
      icon: 'fas fa-check-circle',
      type: 'success'
    },
    'cancelled': {
      title: 'Đơn hàng đã hủy',
      description: 'Đơn hàng đã được hủy',
      icon: 'fas fa-times-circle',
      type: 'error'
    }
  }

  if (statusEvents[order.value.status]) {
    timeline.push({
      ...statusEvents[order.value.status],
      timestamp: order.value.updatedAt || order.value.createdAt
    })
  }

  return timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
})

// Methods
const fetchOrderDetails = async () => {
  const orderId = route.params.id
  if (!orderId) {
    error.value = 'Không tìm thấy mã đơn hàng'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await getOrderDetails(orderId)
    
    if (response.success) {
      order.value = response.data
      
      // Load prescription data if order has prescription requirement
      if (order.value.prescriptionRequired && order.value.prescriptionId) {
        await loadPrescriptionData(order.value.prescriptionId)
      }
    } else {
      throw new Error(response.error || 'Không thể tải thông tin đơn hàng')
    }
  } catch (err) {
    console.error('Fetch order details error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải thông tin đơn hàng'
  } finally {
    loading.value = false
  }
}

const loadPrescriptionData = async (prescriptionId) => {
  try {
    // Import prescription API
    const { usePrescriptionApi } = await import('../services/prescriptionApi.js')
    const { getPrescriptionDetails } = usePrescriptionApi()
    
    const response = await getPrescriptionDetails(prescriptionId)
    
    if (response.success) {
      // Merge prescription data into order
      order.value.prescriptionData = {
        id: response.data.id,
        patientName: response.data.patientName,
        doctorName: response.data.doctorName,
        doctorLicense: response.data.doctorLicense,
        clinicName: response.data.clinicName,
        issueDate: response.data.issueDate,
        expiryDate: response.data.expiryDate,
        diagnosis: response.data.diagnosis,
        notes: response.data.notes,
        status: response.data.status,
        files: response.data.images?.map(url => ({
          url: url,
          name: `Prescription_${response.data.id}_${Date.now()}.jpg`,
          type: 'image/jpeg'
        })) || [],
        validationStatus: response.data.status,
        validationInfo: response.data.reviewedBy ? {
          pharmacistName: response.data.reviewedBy,
          validatedAt: response.data.reviewedAt,
          notes: response.data.reviewNotes
        } : null,
        uploadedAt: response.data.createdAt
      }
    } else {
      console.warn('Failed to load prescription data:', response.error)
    }
  } catch (err) {
    console.warn('Error loading prescription data:', err)
  }
}

const formatPrice = (price) => {
  return (price || 0).toLocaleString('vi-VN') + 'đ'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDeliveryMethodName = (method) => {
  const methods = {
    'grab': 'Giao hàng nhanh (Grab)',
    'standard': 'Giao hàng tiêu chuẩn',
    'express': 'Giao hàng nhanh',
    'store': 'Nhận tại cửa hàng'
  }
  return methods[method] || method || 'Chưa xác định'
}

const getPaymentMethodName = (method) => {
  const methods = {
    'cash_on_delivery': 'Thanh toán khi nhận hàng',
    'credit_card': 'Thẻ tín dụng',
    'bank_transfer': 'Chuyển khoản ngân hàng',
    'e_wallet': 'Ví điện tử'
  }
  return methods[method] || method || 'Chưa xác định'
}

const getPaymentStatusName = (status) => {
  const statuses = {
    'pending': 'Chờ thanh toán',
    'paid': 'Đã thanh toán',
    'failed': 'Thanh toán thất bại',
    'refunded': 'Đã hoàn tiền'
  }
  return statuses[status] || status || 'Chưa xác định'
}

const openImageModal = (file) => {
  selectedImage.value = file.url || file.preview
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}

// Lifecycle
onMounted(() => {
  fetchOrderDetails()
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>