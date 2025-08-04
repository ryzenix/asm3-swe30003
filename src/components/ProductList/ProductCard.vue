<template>
    <div class="bg-white rounded-xl shadow-sm p-4 pt-6 h-full flex flex-col border border-gray-200 hover:shadow-md transition-shadow relative group">
        <!-- Discount Badge -->
        <div v-if="product.discount" class="absolute -top-2 -left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full z-20 shadow-sm">
            <i class="fas fa-tag mr-1"></i> -{{ product.discount }}%
        </div>
        <!-- Out of Stock Badge -->
        <div v-if="product.stockQuantity === 0" class="absolute -top-2 -left-2 bg-gray-600 text-white text-xs px-3 py-1 rounded-full z-20 shadow-sm">
            <i class="fas fa-exclamation-triangle mr-1"></i> Hết hàng
        </div>
        <!-- Wishlist Button -->
        <button class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center z-10 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors" @click.stop="toggleWishlist">
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
        <div class="flex-1 flex flex-col relative z-10">
            <!-- Title -->
            <h3 class="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
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
            <div class="flex items-center mb-4 text-xs">
                <div class="flex text-yellow-400 mr-2">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
                <span class="text-gray-500">(4.5)</span>
            </div>
            
            <!-- Spacer to push buttons to bottom -->
            <div class="flex-1"></div>
            
            <!-- Action Buttons -->
            <div class="space-y-2 relative z-10 mt-auto">
                <!-- Cart Button with Animation -->
                <CartButton 
                  :product="product"
                  @added-to-cart="handleAddedToCart"
                  @quantity-changed="handleQuantityChanged"
                />
                <!-- Secondary Actions -->
                <div class="flex gap-2">
                    <button @click="addToCompare" class="flex-1 bg-gray-100 text-gray-700 text-xs py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <i class="fas fa-balance-scale mr-1"></i>
                    So sánh
                  </button>
                    <button @click="shareProduct" class="flex-1 bg-gray-100 text-gray-700 text-xs py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <i class="fas fa-share-alt mr-1"></i>
                    Chia sẻ
                  </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import {
        ref,
        computed
    } from 'vue'
    import CartButton from '../Common/CartButton.vue'
    const props = defineProps({
        product: {
            type: Object,
            required: true
        }
    })
    const emit = defineEmits(['add-to-cart', 'add-to-wishlist', 'quick-view', 'add-to-compare', 'share'])
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
    const handleAddedToCart = (product) => {
        emit('add-to-cart', product)
        showSuccessMessage()
    }
    
    const handleQuantityChanged = (data) => {
        console.log('Quantity changed in product card:', data)
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
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

</style>