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

        <!-- Order Content -->
        <div v-else-if="orderData">
          <!-- Back Button -->
          <div class="mb-6">
            <button 
              @click="goBack"
              class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <i class="fas fa-arrow-left"></i>
              <span>Quay lại</span>
            </button>
          </div>
    
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Main Order Content -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Order Header -->
                <OrderHeader 
                  :order="orderData"
                  @status-change="handleStatusChange"
                />
    
                <!-- Order Progress -->
                <OrderProgress 
                  :current-status="orderData.status"
                  :status-history="orderData.statusHistory"
                />

                <!-- Cancellation Information -->
                <div v-if="orderData.status === 'cancelled' && orderData.cancellationInfo" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-times text-red-600 text-xl"></i>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-800 mb-2">Thông tin hủy đơn hàng</h3>
                      <div class="space-y-3">
                        <div class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-gray-600 w-24">Lý do hủy:</span>
                          <span class="text-gray-800 font-medium">{{ orderData.cancellationInfo.reasonText }}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-gray-600 w-24">Thời gian:</span>
                          <span class="text-gray-800">{{ formatDate(orderData.cancellationInfo.cancelledAt) }}</span>
                        </div>
                        <div v-if="orderData.cancellationInfo.reasonCode && orderData.cancellationInfo.reasonCode !== 'other'" class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-gray-600 w-24">Mã lý do:</span>
                          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">{{ orderData.cancellationInfo.reasonCode }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Delivery Info -->
                <DeliverySection 
                  :delivery-info="orderData.deliveryInfo"
                  :customer-info="orderData.customerInfo"
                  :pharmacy-info="orderData.pharmacyInfo"
                />

                <!-- Order Items -->
                <OrderItemsList 
                  :items="orderData.items"
                />
    
                <!-- Order Notes -->
                <OrderNotes 
                  v-if="orderData.notes"
                  :notes="orderData.notes"
                />

              </div>
    
              <!-- Sidebar -->
              <div class="lg:col-span-1 space-y-6">
                <!-- Prescription Section -->
                <PrescriptionSection 
                  v-if="orderData.prescriptionData"
                  :prescription-data="orderData.prescriptionData"
                />
                
                <OrderSidebar 
                  :order="orderData"
                  @status-change="handleStatusChange"
                  @cancel-order="handleCancelOrder"
                  @contact-support="handleContactSupport"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Status Change Modal -->
      <StatusChangeModal
        v-if="orderData"
        :show="showStatusModal"
        :current-status="orderData.status"
        :order-id="orderData.id"
        @close="showStatusModal = false"
        @confirm="confirmStatusChange"
      />
  
      <!-- Cancel Order Modal -->
      <CancelOrderModal
        v-if="orderData"
        :show="showCancelModal"
        :order="orderData"
        @close="showCancelModal = false"
        @success="handleCancelSuccess"
      />
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrderApi } from '../services/orderApi.js'
import { useToast } from '../composables/useToast'
import OrderHeader from '../components/OrderDetails/OrderHeader.vue'
import OrderProgress from '../components/OrderDetails/OrderProgress.vue'
import DeliverySection from '../components/OrderDetails/DeliverySection.vue'
import OrderItemsList from '../components/OrderDetails/OrderItemsList.vue'
import OrderNotes from '../components/OrderDetails/OrderNotes.vue'
import OrderSidebar from '../components/OrderDetails/OrderSidebar.vue'
import StatusChangeModal from '../components/OrderDetails/StatusChangeModal.vue'
import CancelOrderModal from '../components/OrderDetails/CancelOrderModal.vue'
import PrescriptionSection from '../components/OrderDetails/PrescriptionSection.vue'

const router = useRouter()
const route = useRoute()
const { getOrderDetails } = useOrderApi()
const { showSuccess, showError } = useToast()

// Reactive state
const showStatusModal = ref(false)
const showCancelModal = ref(false)
const loading = ref(false)
const error = ref('')

// Order data from API
const orderData = ref(null)
  
  // Computed properties
const canChangeStatus = computed(() => {
      return orderData.value && ['pending', 'confirmed', 'processing', 'shipped'].includes(orderData.value.status)
})

const canCancelOrder = computed(() => {
  return orderData.value && ['pending', 'confirmed', 'processing'].includes(orderData.value.status)
})

// Methods
function goBack() {
  router.push('/order-management')
}

// Fetch order details from API
const fetchOrderDetails = async () => {
  const orderId = route.params.orderId
  if (!orderId) {
    error.value = 'Không tìm thấy mã đơn hàng'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await getOrderDetails(orderId)
    
    if (response.success) {
      // Transform API data to match component structure
      const apiOrder = response.data
      
      // Debug: Log API data structure
      console.log('API Order Data:', apiOrder)
      console.log('API Items:', apiOrder.items)
      
      orderData.value = {
        id: apiOrder.orderNumber || apiOrder.id,
        orderNumber: apiOrder.orderNumber || apiOrder.id,
        date: apiOrder.createdAt,
        status: apiOrder.status,
        deliveryType: apiOrder.shippingMethod || 'standard',
        estimatedDelivery: {
          timeRange: 'Dự kiến giao hàng',
          date: formatDate(apiOrder.estimatedDeliveryDate)
        },
        customerInfo: {
          name: apiOrder.shippingAddress?.name || apiOrder.customerInfo?.name || 'Chưa cập nhật',
          phone: apiOrder.shippingAddress?.phone || apiOrder.customerInfo?.phone || 'Chưa cập nhật',
          address: apiOrder.shippingAddress?.address || apiOrder.customerInfo?.address || 'Chưa cập nhật'
        },
        pharmacyInfo: {
          name: 'Nhà thuốc Long Châu',
          address: 'Hệ thống nhà thuốc toàn quốc',
          phone: '1800 6821'
        },
        deliveryInfo: {
          method: getDeliveryMethodName(apiOrder.shippingMethod),
          carrier: apiOrder.shippingMethod?.toUpperCase() || 'STANDARD',
          trackingNumber: apiOrder.trackingNumber || null,
          estimatedTime: '30-60 phút'
        },
        items: apiOrder.items || [],
        pricing: {
          subtotal: apiOrder.totalAmount - (apiOrder.shippingCost || 0),
          discount: 0,
          voucherDiscount: 0,
          shippingFee: apiOrder.shippingCost || 0,
          total: apiOrder.totalAmount
        },
        paymentMethod: {
          type: apiOrder.paymentMethod,
          name: getPaymentMethodName(apiOrder.paymentMethod)
        },
        statusHistory: generateStatusHistory(apiOrder),
        notes: apiOrder.notes,
        prescriptionData: null, // Will be loaded separately if needed
        // Add cancellation information
        cancellationInfo: apiOrder.status === 'cancelled' ? {
          reasonCode: apiOrder.cancellationReasonCode,
          reasonText: getCancellationReasonText(apiOrder.cancellationReasonCode),
          cancelledAt: apiOrder.updatedAt || apiOrder.createdAt
        } : null
      }
      
      // Load prescription data if order has prescription requirement
      if (apiOrder.prescriptionRequired && apiOrder.prescriptionId) {
        await loadPrescriptionData(apiOrder.prescriptionId)
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

// Load prescription data
const loadPrescriptionData = async (prescriptionId) => {
  try {
    const { usePrescriptionApi } = await import('../services/prescriptionApi.js')
    const { getPrescriptionDetails } = usePrescriptionApi()
    
    const response = await getPrescriptionDetails(prescriptionId)
    
    if (response.success) {
      orderData.value.prescriptionData = {
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
        images: response.data.images || [],
        validationStatus: response.data.status,
        validationInfo: response.data.reviewedBy ? {
          pharmacistName: response.data.reviewedBy,
          validatedAt: response.data.reviewedAt,
          notes: response.data.reviewNotes
        } : null,
        uploadedAt: response.data.createdAt
      }
    }
  } catch (err) {
    console.warn('Error loading prescription data:', err)
  }
}

// Helper functions
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

// Cancellation reason code mappings
const getCancellationReasonText = (reasonCode) => {
  // Customer cancellation reasons
  const customerReasons = {
    'changed_mind': 'Tôi đã thay đổi ý định',
    'wrong_order': 'Đặt nhầm sản phẩm hoặc thông tin',
    'found_better_price': 'Tìm được giá tốt hơn ở nơi khác',
    'delivery_too_long': 'Thời gian giao hàng quá lâu',
    'payment_issue': 'Vấn đề về thanh toán',
    'no_longer_needed': 'Không còn cần thiết',
    'duplicate_order': 'Đặt trùng đơn hàng',
    'other': 'Lý do khác'
  }
  
  // Admin/Pharmacist cancellation reasons
  const adminReasons = {
    'out_of_stock': 'Hết hàng',
    'prescription_invalid': 'Đơn thuốc không hợp lệ',
    'customer_request': 'Khách hàng yêu cầu hủy',
    'payment_failed': 'Thanh toán thất bại',
    'address_unreachable': 'Không thể giao đến địa chỉ',
    'quality_issue': 'Vấn đề chất lượng sản phẩm',
    'pharmacy_closure': 'Nhà thuốc tạm đóng cửa',
    'system_error': 'Lỗi hệ thống',
    'regulatory_issue': 'Vấn đề quy định pháp lý'
  }
  
  // Check both customer and admin reasons
  return customerReasons[reasonCode] || adminReasons[reasonCode] || reasonCode || 'Không xác định'
}

const getDeliveryMethodName = (method) => {
  const methods = {
    'grab': 'Giao hàng nhanh (Grab)',
    'standard': 'Giao hàng tiêu chuẩn',
    'express': 'Giao hàng nhanh',
    'store': 'Nhận tại cửa hàng'
  }
  return methods[method] || method || 'Giao hàng tiêu chuẩn'
}

const getPaymentMethodName = (method) => {
  const methods = {
    'cash_on_delivery': 'Thanh toán khi nhận hàng',
    'credit_card': 'Thẻ tín dụng',
    'bank_transfer': 'Chuyển khoản ngân hàng',
    'e_wallet': 'Ví điện tử'
  }
  return methods[method] || method || 'Thanh toán khi nhận hàng'
}

const generateStatusHistory = (order) => {
  const history = [
    {
      status: 'pending',
      timestamp: order.createdAt,
      title: 'Đơn hàng được tạo',
      description: 'Đơn hàng đã được đặt thành công'
    }
  ]

  // Add status progression based on current status
  const statusProgression = ['confirmed', 'processing', 'shipped', 'delivered']
  const currentIndex = statusProgression.indexOf(order.status)
  
  if (currentIndex >= 0) {
    const statusTitles = {
      confirmed: 'Xác nhận đơn hàng',
      processing: 'Đang chuẩn bị',
      shipped: 'Đã gửi hàng',
      delivered: 'Đã giao hàng'
    }
    
    const statusDescriptions = {
      confirmed: 'Nhà thuốc đã xác nhận đơn hàng',
      processing: 'Đang chuẩn bị thuốc theo đơn hàng',
      shipped: 'Đơn hàng đã được gửi đi và đang vận chuyển',
      delivered: 'Đơn hàng đã được giao thành công'
    }

    for (let i = 0; i <= currentIndex; i++) {
      const status = statusProgression[i]
      history.push({
        status: status,
        timestamp: order.updatedAt || order.createdAt,
        title: statusTitles[status],
        description: statusDescriptions[status],
        current: i === currentIndex
      })
    }
  }

  if (order.status === 'cancelled') {
    const cancellationReason = order.cancellationReasonCode ? 
      getCancellationReasonText(order.cancellationReasonCode) : 
      'Đơn hàng đã được hủy'
    
    history.push({
      status: 'cancelled',
      timestamp: order.updatedAt || order.createdAt,
      title: 'Đơn hàng đã hủy',
      description: cancellationReason,
      current: true
    })
  }

  return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}
  
  function handleStatusChange(newStatus) {
    if (newStatus === 'cancelled') {
      showCancelModal.value = true
    } else {
      showStatusModal.value = true
    }
  }
  
  function handleCancelOrder() {
    showCancelModal.value = true
  }
  
  function handleContactSupport() {
    // Open support chat or phone call
    window.open('tel:19001234')
  }
  
  async function confirmStatusChange(newStatus, note = '') {
    loading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update order status
      const now = new Date().toISOString()
      const statusTitles = {
        confirmed: 'Xác nhận đơn hàng',
        processing: 'Đang chuẩn bị',
        shipped: 'Đã gửi hàng',
        delivered: 'Đã giao hàng',
        cancelled: 'Đã hủy đơn hàng'
      }
      
      const statusDescriptions = {
        confirmed: 'Nhà thuốc đã xác nhận đơn hàng',
        processing: 'Đang chuẩn bị thuốc theo đơn hàng',
        shipped: 'Đơn hàng đã được gửi đi và đang vận chuyển',
        delivered: 'Đơn hàng đã được giao thành công',
        cancelled: 'Đơn hàng đã bị hủy'
      }
      
      // Remove current status from history
      orderData.value.statusHistory = orderData.value.statusHistory.map(item => ({
        ...item,
        current: false
      }))
      
      // Add new status to history
      orderData.value.statusHistory.push({
        status: newStatus,
        timestamp: now,
        title: statusTitles[newStatus],
        description: note || statusDescriptions[newStatus],
        current: true
      })
      
      // Update current status
      orderData.value.status = newStatus
      
      showSuccess(`Đã cập nhật trạng thái đơn hàng thành "${statusTitles[newStatus]}"`)
      showStatusModal.value = false
      
    } catch (error) {
      console.error('Error updating status:', error)
      showError('Có lỗi xảy ra khi cập nhật trạng thái')
    } finally {
      loading.value = false
    }
  }
  
  function handleCancelSuccess(updatedOrder) {
    // Update the order data with the cancelled status
    if (updatedOrder) {
      orderData.value = { ...orderData.value, ...updatedOrder }
    } else {
      // If no updated order data, just update the status
      orderData.value.status = 'cancelled'
    }
    
    showCancelModal.value = false
    
    // Optionally refresh the order data to get the latest state
    fetchOrderDetails()
  }
  

  
  // Lifecycle
onMounted(() => {
  fetchOrderDetails()
})
  </script>
  
  <style scoped>
  /* Custom animations for status updates */
  @keyframes statusUpdate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .status-update {
    animation: statusUpdate 0.3s ease-in-out;
  }
  </style>