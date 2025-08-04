<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
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
            />

            <!-- Order Progress -->
            <OrderProgress 
              :current-status="orderData.status"
              :status-history="orderData.statusHistory"
            />

            <!-- Delivery Info -->
            <DeliverySection 
              :delivery-info="orderData.deliveryInfo"
              :customer-info="orderData.customerInfo"
            />

            <!-- Order Items -->
            <OrderItemsList 
              :items="orderData.items"
            />

            <!-- Prescription Section -->
            <PrescriptionSection 
              v-if="orderData.prescriptionData"
              :prescription-data="orderData.prescriptionData"
              :prescription-products="prescriptionProducts"
            />

            <!-- Order Notes -->
            <OrderNotes 
              v-if="orderData.notes"
              :notes="orderData.notes"
            />
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <OrderSidebar 
              :order="orderData"
              @contact-support="handleContactSupport"
            />
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import OrderHeader from '../components/OrderDetails/OrderHeader.vue'
import OrderProgress from '../components/OrderDetails/OrderProgress.vue'
import DeliverySection from '../components/OrderDetails/DeliverySection.vue'
import OrderItemsList from '../components/OrderDetails/OrderItemsList.vue'
import OrderNotes from '../components/OrderDetails/OrderNotes.vue'
import OrderSidebar from '../components/OrderDetails/OrderSidebar.vue'
import PrescriptionSection from '../components/OrderDetails/PrescriptionSection.vue'


const router = useRouter()
const route = useRoute()

// Reactive state
const loading = ref(false)

// Computed
const prescriptionProducts = computed(() => {
  // Filter items that require prescription
  return orderData.value.items.filter(item => item.requiresPrescription === true)
})

// Sample order data - in real app, this would come from API
const orderData = ref({
  id: 'DH5276043',
  orderNumber: '5276043',
  date: '04/08/2025',
  status: 'processing', // pending, confirmed, processing, shipping, delivered, cancelled
  deliveryType: 'grab',
  estimatedDelivery: {
    timeRange: 'Từ 18:00 - 19:00 ngày',
    date: '04/08/2025'
  },
  customerInfo: {
    name: 'Hoang The Hieu',
    phone: '08xx xxx 667',
    address: 'xxx, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ'
  },
  deliveryInfo: {
    method: 'Giao hàng tận nơi',
    carrier: 'GRAB',
    trackingNumber: null,
    estimatedTime: '30-45 phút'
  },
  items: [
    {
      id: 1,
      name: 'Listerine Tartar Control',
      quantity: 2,
      price: 187000,
      image: '/img/product.avif',
      category: 'Chăm sóc răng miệng',
      requiresPrescription: false
    },
    {
      id: 2,
      name: 'Probiotics bổ sung men tiêu hóa',
      quantity: 1,
      price: 163850,
      image: '/img/product.avif',
      category: 'Thực phẩm chức năng',
      requiresPrescription: false
    },
    {
      id: 3,
      name: 'Thuốc kháng sinh Amoxicillin 500mg',
      quantity: 1,
      price: 85000,
      image: '/img/product.avif',
      category: 'Thuốc kê đơn',
      requiresPrescription: true
    },
    {
      id: 4,
      name: 'Thuốc giảm đau Tramadol 50mg',
      quantity: 2,
      price: 120000,
      image: '/img/product.avif',
      category: 'Thuốc kê đơn',
      requiresPrescription: true
    }
  ],
  pricing: {
    subtotal: 777850, // Updated to include new prescription items
    discount: 0,
    voucherDiscount: 0,
    shippingFee: 0,
    total: 777850
  },
  statusHistory: [
    {
      status: 'pending',
      timestamp: '2025-08-04T16:30:00Z',
      title: 'Đơn hàng được tạo',
      description: 'Đơn hàng đã được đặt thành công'
    },
    {
      status: 'confirmed',
      timestamp: '2025-08-04T16:35:00Z',
      title: 'Xác nhận đơn hàng',
      description: 'Nhà thuốc đã xác nhận đơn hàng'
    },
    {
      status: 'processing',
      timestamp: '2025-08-04T16:45:00Z',
      title: 'Đang chuẩn bị',
      description: 'Đang chuẩn bị thuốc theo đơn hàng',
      current: true
    }
  ],
  notes: 'Ghi chú: Hủy đơn này của a, e chỉ đang muốn xem giao diện để làm đồ án thôi a',
  prescriptionData: {
    files: [
      {
        name: 'don-thuoc-1.jpg',
        type: 'image/jpeg',
        size: 2048576,
        url: '/img/prescription-sample-1.jpg'
      },
      {
        name: 'don-thuoc-2.pdf',
        type: 'application/pdf',
        size: 1536000,
        url: '/img/prescription-sample-2.pdf'
      }
    ],
    uploadedAt: '2025-08-04T16:30:00Z',
    expiryDate: '2025-09-04T00:00:00Z',
    validationStatus: 'approved', // pending, approved, rejected
    validationInfo: {
      pharmacistName: 'Dược sĩ Nguyễn Văn A',
      validatedAt: '2025-08-04T16:40:00Z',
      notes: 'Đơn thuốc hợp lệ, đã kiểm tra thông tin bệnh nhân và liều lượng.'
    }
  }
})



// Methods
function goBack() {
  router.go(-1)
}

function handleContactSupport() {
  // Open support chat or phone call
  window.open('tel:19001234')
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

// Lifecycle
onMounted(() => {
  // Get order ID from route params
  const orderId = route.params.orderId
  if (orderId) {
    orderData.value.orderNumber = orderId
    orderData.value.id = `DH${orderId}`
  }
  
  // In real app, fetch order details from API
  // fetchOrderDetails(orderId)
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