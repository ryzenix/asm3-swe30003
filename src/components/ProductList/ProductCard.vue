<template>
    <div class="bg-white rounded-xl shadow-sm p-4 pt-6 flex flex-col justify-between border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-200 relative group overflow-visible">
        <!-- Animated Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
        <!-- Discount Badge -->
        <div v-if="product.discount" class="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full z-20 shadow-md animate-bounce-slow">
            <i class="fas fa-bolt mr-1"></i> -{{ product.discount }}%
        </div>
        <!-- Wishlist Button -->
        <button class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500 transform hover:scale-110" @click.stop="toggleWishlist">
              <i :class="[
                'fas text-sm transition-colors duration-200',
                isInWishlist ? 'fa-heart text-red-500' : 'fa-heart text-gray-400'
              ]"></i>
            </button>
        <!-- Image Container with Blur Effect -->
        <!-- Image Container with Blur Effect and Quick View -->
        <div class="relative mb-4 overflow-hidden rounded-lg group">
            <!-- Blurred Image -->
            <img :src="product.image" :alt="product.title" class="w-full h-40 object-contain transition-all duration-300 group-hover:blur-sm" @error="handleImageError" />
            <!-- Transparent overlay for button, no background color to avoid "white fade" -->
            <button class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" @click.stop="quickView">
        <span class="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-50">
          <i class="fas fa-eye mr-2"></i>
          Xem nhanh
        </span>
      </button>
        </div>
        <!-- Content -->
        <div class="flex-1 relative z-10">
            <!-- Title -->
            <h3 class="text-sm text-gray-800 font-medium mb-2 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200">
                {{ product.title }}
            </h3>
            <!-- Price Container -->
            <div class="mb-3">
                <p class="text-blue-600 font-bold text-base flex items-center">
                    <i class="fas fa-tag mr-1 text-xs"></i> {{ product.price }}
                    <span class="text-gray-500 text-sm font-normal ml-1">/ {{ product.unit }}</span>
                </p>
                <div v-if="product.discount" class="flex items-center text-xs text-gray-500 mt-1">
                    <span class="line-through mr-2">{{ calculateOriginalPrice() }}</span>
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Tiết kiệm {{ calculateSavings() }}
                    </span>
                </div>
            </div>
            <!-- Product Info Tags -->
            <div class="flex flex-wrap gap-1 mb-3">
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {{ product.category }}
                  </span>
                <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {{ product.manufacturer }}
                  </span>
            </div>
            <!-- Rating (mock) -->
            <div class="flex items-center mb-3 text-xs">
                <div class="flex text-yellow-400 mr-2">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
                <span class="text-gray-500">(4.5)</span>
            </div>
            <!-- Action Buttons -->
            <div class="space-y-2 relative z-10">
                <!-- Add to Cart Button -->
                <button @click="handleAddToCart" :disabled="isAddingToCart" class="w-full bg-blue-600 text-white text-sm py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  <i v-if="isAddingToCart" class="fas fa-spinner fa-spin mr-2"></i>
                  <i v-else class="fas fa-cart-plus mr-2"></i>
                  {{ isAddingToCart ? 'Đang thêm...' : 'Chọn mua' }}
                </button>
                <!-- Secondary Actions -->
                <div class="flex gap-2">
                    <button @click="addToCompare" class="flex-1 bg-gray-100 text-gray-700 text-xs py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95">
                    <i class="fas fa-balance-scale mr-1"></i>
                    So sánh
                  </button>
                    <button @click="shareProduct" class="flex-1 bg-gray-100 text-gray-700 text-xs py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95">
                    <i class="fas fa-share-alt mr-1"></i>
                    Chia sẻ
                  </button>
                </div>
            </div>
        </div>
        <!-- Loading Overlay -->
        <div v-if="isAddingToCart" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-40">
            <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="text-sm text-gray-600 mt-2">Đang xử lý...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {
        ref,
        computed
    } from 'vue'
    const props = defineProps({
        product: {
            type: Object,
            required: true
        }
    })
    const emit = defineEmits(['add-to-cart', 'add-to-wishlist', 'quick-view', 'add-to-compare', 'share'])
    const isAddingToCart = ref(false)
    const isInWishlist = ref(false)
    const calculateOriginalPrice = () => {
        if (props.product.discount) {
            const originalPrice = props.product.priceValue / (1 - props.product.discount / 100)
            return originalPrice.toLocaleString('vi-VN') + 'đ'
        }
        return props.product.price
    }
    const calculateSavings = () => {
        if (props.product.discount) {
            const originalPrice = props.product.priceValue / (1 - props.product.discount / 100)
            const savings = originalPrice - props.product.priceValue
            return savings.toLocaleString('vi-VN') + 'đ'
        }
        return '0đ'
    }
    const handleAddToCart = async() => {
        if (isAddingToCart.value) return
        isAddingToCart.value = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        isAddingToCart.value = false
        emit('add-to-cart', props.product)
        // Show success feedback
        showSuccessMessage()
    }
    const toggleWishlist = () => {
        isInWishlist.value = !isInWishlist.value
        emit('add-to-wishlist', {
            product: props.product,
            isAdded: isInWishlist.value
        })
    }
    const quickView = () => {
        emit('quick-view', props.product)
    }
    const addToCompare = () => {
        emit('add-to-compare', props.product)
    }
    const shareProduct = () => {
        emit('share', props.product)
    }
    const handleImageError = (event) => {
        // Fallback image
        event.target.src = '/img/products/placeholder-product.jpg'
    }
    const showSuccessMessage = () => {
        // You could implement a toast notification here
        console.log('Product added to cart successfully!')
    }
</script>

<style scoped>
    .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    @keyframes bounce-slow {
        0%,
        20%,
        53%,
        80%,
        100% {
            transform: translate3d(0, 0, 0);
        }
        40%,
        43% {
            transform: translate3d(0, -2px, 0);
        }
        70% {
            transform: translate3d(0, -1px, 0);
        }
    }
    .animate-bounce-slow {
        animation: bounce-slow 2s infinite;
    }
</style>