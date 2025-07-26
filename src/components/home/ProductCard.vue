<template>
  <div class="group min-w-[220px] max-w-[220px] h-[380px] bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col">
    <!-- Product Image Container -->
    <div class="relative overflow-hidden flex-shrink-0">
      <img 
        :src="product.image" 
        :alt="product.name" 
        class="w-full h-40 object-contain p-3 group-hover:scale-110 transition-transform duration-300" 
      />
      
      <!-- Badge -->
      <div v-if="product.badge" class="absolute top-2 left-2 z-10">
        <span :class="[
          'px-2 py-1 text-xs font-semibold rounded-full text-white shadow-sm',
          getBadgeColor(product.badge)
        ]">
          {{ product.badge }}
        </span>
      </div>
      
      <!-- Discount Badge -->
      <div v-if="product.discount" class="absolute top-2 right-2 z-10">
        <span class="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-sm">
          -{{ product.discount }}%
        </span>
      </div>
      
      <!-- Quick Actions -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
        <button class="bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 shadow-md">
          <i class="far fa-heart text-sm"></i>
        </button>
        <button class="bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 shadow-md">
          <i class="far fa-eye text-sm"></i>
        </button>
      </div>
    </div>
    
    <!-- Product Info - Flexible container -->
    <div class="p-4 flex flex-col justify-between flex-grow">
      <div class="space-y-3">
        <!-- Product Name - Fixed height -->
        <h3 class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200 h-10 flex items-start">
          {{ product.name }}
        </h3>
        
        <!-- Rating Container - Fixed height -->
        <div class="h-4 flex items-center">
          <div v-if="product.rating" class="flex items-center space-x-1">
            <div class="flex text-yellow-400">
              <i v-for="n in 5" :key="n" :class="[
                'text-xs',
                n <= Math.floor(product.rating) ? 'fas fa-star' : 'far fa-star'
              ]"></i>
            </div>
            <span class="text-xs text-gray-500">{{ product.rating }}</span>
            <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
          </div>
        </div>
        
        <!-- Price Section -->
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <span class="text-blue-700 font-bold text-lg">{{ formatPrice(product.price) }}đ</span>
            <span v-if="product.originalPrice" class="text-gray-400 text-sm line-through">
              {{ formatPrice(product.originalPrice) }}đ
            </span>
          </div>
          <div class="h-4 flex items-center">
            <div v-if="product.deliveryTime" class="flex items-center text-green-600 text-xs">
              <i class="fas fa-shipping-fast mr-1"></i>
              Giao trong {{ product.deliveryTime }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add to Cart Button - Always at bottom -->
      <button class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-4">
        <i class="fas fa-plus mr-2"></i>
        Thêm vào giỏ
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function getBadgeColor(badge) {
  const colors = {
    'Bán chạy': 'bg-orange-500',
    'Giảm giá': 'bg-red-500',
    'Mới': 'bg-green-500',
    'Cấp tốc': 'bg-purple-500',
    'Có sẵn': 'bg-blue-500'
  }
  return colors[badge] || 'bg-gray-500'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>