<template>
  <div>
    <!-- Product Grid -->
    <div 
      v-if="products.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 auto-rows-fr"
    >
      <ProductCard
        v-for="(product, index) in products"
        :key="`${product.id}-${index}`"
        :product="product"
        @add-to-cart="$emit('add-to-cart', $event)"
        @add-to-wishlist="$emit('add-to-wishlist', $event)"
        @quick-view="$emit('quick-view', $event)"
        @add-to-compare="$emit('add-to-compare', $event)"
        @share="$emit('share', $event)"
      />
    </div>

    <!-- No Results Message -->
    <div v-else class="text-center py-16">
      <div class="mb-6">
        <i class="fas fa-search text-4xl text-gray-300"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Không tìm thấy sản phẩm nào
      </h3>
      <p class="text-gray-500 mb-6">
        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm sản phẩm phù hợp
      </p>
      <button 
        @click="$emit('clear-filters')"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'add-to-cart', 
  'add-to-wishlist', 
  'quick-view', 
  'add-to-compare', 
  'share',
  'clear-filters'
])
</script>

<style scoped>
.grid {
  grid-template-rows: masonry;
}

/* Fallback for browsers that don't support masonry */
@supports not (grid-template-rows: masonry) {
  .auto-rows-fr {
    display: grid;
    align-items: stretch;
  }
}
</style>