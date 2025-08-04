<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
      <i class="fas fa-shopping-bag text-blue-600 mr-3"></i>
      Sản phẩm đã đặt ({{ items.length }} sản phẩm)
    </h3>

    <div class="space-y-4">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        <!-- Product Image -->
        <div class="relative flex-shrink-0">
          <img 
            :src="item.image" 
            :alt="item.name" 
            class="w-16 h-16 object-cover rounded-lg shadow-sm"
          >
          <!-- Quantity Badge -->
          <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {{ item.quantity }}
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-gray-800 truncate">{{ item.name }}</h4>
          <div class="flex items-center space-x-4 mt-1">
            <span class="text-sm text-gray-600">{{ item.category }}</span>
            <span class="text-sm text-blue-600 font-medium">{{ formatPrice(item.price) }}đ</span>
          </div>
        </div>

        <!-- Total Price -->
        <div class="text-right flex-shrink-0">
          <div class="font-semibold text-gray-800">{{ formatPrice(item.price * item.quantity) }}đ</div>
          <div class="text-sm text-gray-600">{{ item.quantity }} × {{ formatPrice(item.price) }}đ</div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col space-y-2 flex-shrink-0">
          <button 
            @click="viewProduct(item)"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            title="Xem chi tiết sản phẩm"
          >
            <i class="fas fa-eye"></i>
          </button>
          <button 
            @click="addToCart(item)"
            class="text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-200"
            title="Thêm vào giỏ hàng"
          >
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-800">Tổng giá trị sản phẩm:</span>
        <span class="text-xl font-bold text-blue-600">{{ formatPrice(totalAmount) }}đ</span>
      </div>
    </div>


  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

// Computed properties
const totalAmount = computed(() => {
  return props.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function viewProduct(item) {
  // Navigate to product detail page
  console.log('Viewing product:', item)
  // In real app: router.push(`/products/${item.id}`)
}

function addToCart(item) {
  // Add single item to cart
  console.log('Adding to cart:', item)
  showToast(`Đã thêm ${item.name} vào giỏ hàng!`, 'success')
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
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 100)
  
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
</script>