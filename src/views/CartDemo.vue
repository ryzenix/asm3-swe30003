<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <!-- Demo Content -->
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">
        Cart Sidebar Blur Effect Demo
      </h1>
      
      <!-- Demo Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="i in 9" 
          :key="i"
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div class="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4"></div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Demo Product {{ i }}</h3>
          <p class="text-gray-600 mb-4">
            This is a demo product to showcase the background blur effect when the cart sidebar opens.
          </p>
          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-blue-600">{{ (Math.random() * 1000 + 100).toFixed(0) }}.000đ</span>
            <button 
              @click="addToCart"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="text-center space-x-4">
        <button 
          @click="toggleCart"
          class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {{ isCartOpen ? 'Close Cart' : 'Open Cart' }}
        </button>
        
        <button 
          @click="addRandomProduct"
          class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Add Random Product
        </button>
      </div>

      <!-- Instructions -->
      <div class="mt-12 bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Hướng dẫn test hiệu ứng blur:</h2>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-center">
            <i class="fas fa-check-circle text-green-600 mr-3"></i>
            Click "Open Cart" để mở cart sidebar và xem hiệu ứng blur
          </li>
          <li class="flex items-center">
            <i class="fas fa-check-circle text-green-600 mr-3"></i>
            Background sẽ có hiệu ứng gaussian blur từ từ khi sidebar trượt ra
          </li>
          <li class="flex items-center">
            <i class="fas fa-check-circle text-green-600 mr-3"></i>
            Click vào background để đóng cart sidebar
          </li>
          <li class="flex items-center">
            <i class="fas fa-check-circle text-green-600 mr-3"></i>
            Thêm sản phẩm vào cart để test với nội dung thực
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '../composables/useCart'

const { isCartOpen, toggleCart, addToCart: addToCartAction } = useCart()

const addToCart = () => {
  const product = {
    id: Date.now(),
    name: `Demo Product ${Math.floor(Math.random() * 100)}`,
    price: Math.floor(Math.random() * 1000 + 100) * 1000,
    image: 'https://via.placeholder.com/200x200',
    quantity: 1
  }
  
  addToCartAction(product, 1)
}

const addRandomProduct = () => {
  addToCart()
  if (!isCartOpen.value) {
    setTimeout(() => {
      toggleCart()
    }, 500)
  }
}
</script>

<style scoped>
/* Additional demo styles */
.demo-grid {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>