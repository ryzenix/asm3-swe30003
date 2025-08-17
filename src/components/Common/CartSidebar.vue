<template>
  <!-- Cart Overlay with backdrop blur -->
  <transition name="fade">
    <div
      v-if="isCartOpen"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      @click.self="closeCart"
    >
    </div>
  </transition>

  <!-- Sidebar with slide animation -->
  <transition name="sidebar">
    <div 
      v-if="isCartOpen"
      class="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl flex flex-col sidebar-panel z-[60]"
    >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <i class="fas fa-shopping-cart text-blue-600 text-xl"></i>
          <div 
            v-if="totalItems > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
          >
            {{ totalItems > 99 ? '99+' : totalItems }}
          </div>
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">Giỏ hàng</h2>
          <p class="text-sm text-gray-500">{{ totalItems }} sản phẩm</p>
        </div>
      </div>
      <button 
        @click="closeCart"
        class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
      >
        <i class="fas fa-times text-gray-600"></i>
      </button>
    </div>

    <!-- Cart Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Empty Cart -->
      <div 
        v-if="cartItems.length === 0" 
        class="flex-1 flex flex-col items-center justify-center p-8 text-center"
      >
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
        <p class="text-gray-500 mb-6">Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
        <button 
          @click="closeCart"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tiếp tục mua sắm
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="flex-1 overflow-y-auto">
        <div class="divide-y divide-gray-100">
          <CartItem 
            v-for="item in cartItems" 
            :key="item.id"
            :item="item"
            @quantity-changed="handleQuantityChanged"
            @item-removed="handleItemRemoved"
          />
        </div>
      </div>

      <!-- Cart Summary -->
      <div v-if="cartItems.length > 0" class="border-t border-gray-200 bg-gray-50">
        <!-- Price Summary -->
        <div class="p-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tạm tính ({{ totalItems }} sản phẩm)</span>
            <span class="font-medium">{{ formattedTotalPrice }}</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Phí vận chuyển</span>
            <span class="text-green-600">Miễn phí</span>
          </div>
          
          <div class="border-t border-gray-200 pt-3">
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">Tổng cộng</span>
              <span class="text-xl font-bold text-blue-600">
                {{ formattedTotalPrice }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-4 space-y-3">
          <button 
            @click="goToCheckout"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <i class="fas fa-credit-card mr-2"></i>
            Thanh toán
          </button>
          
          <div class="flex space-x-2">
            <button 
              @click="goToCart"
              class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Xem giỏ hàng
            </button>
            <button 
              @click="clearCart"
              class="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </transition>




</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart'
import CartItem from './CartItem.vue'

const router = useRouter()

const {
  cartItems,
  isCartOpen,
  totalItems,
  totalPrice,
  formattedTotalPrice,
  closeCart,
  clearCart: clearCartAction
} = useCart()

// Local state - removed discount related variables

// Methods
const handleQuantityChanged = (data) => {
  console.log('Quantity changed:', data)
}

const handleItemRemoved = (item) => {
  console.log('Item removed:', item)
}

const goToCheckout = () => {
  closeCart()
  router.push('/cart')
}

const goToCart = () => {
  closeCart()
  router.push('/cart')
}

const clearCart = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
    clearCartAction()
  }
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}
</script>

<style scoped>
/* Custom scrollbar for cart items */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Cart sidebar item styling */
.cart-sidebar-item {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cart-sidebar-item:hover {
  transform: translateX(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animation for success messages */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .fixed.w-96 {
    width: 100vw;
  }
}

/* Loading states */
.loading-overlay {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}

/* Discount code input focus */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Price animation */
@keyframes priceUpdate {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); color: #10b981; }
  100% { transform: scale(1); }
}

.animate-price-update {
  animation: priceUpdate 0.6s ease-in-out;
}

/* Overlay fade animation - synchronized with sidebar */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Enhanced sidebar slide transition - focus on transform only */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(100%);
}

.sidebar-enter-to,
.sidebar-leave-from {
  transform: translateX(0);
}

/* Sidebar panel styling with performance optimization */
.sidebar-panel {
  will-change: transform;
  backface-visibility: hidden;
}

/* Responsive design */
@media (max-width: 640px) {
  .sidebar-enter-from,
  .sidebar-leave-to {
    transform: translateX(100%);
  }
  
  .sidebar-panel {
    width: 100vw !important;
  }
}

@media (max-width: 768px) {
  .sidebar-panel {
    width: 100vw !important;
  }
}


</style>