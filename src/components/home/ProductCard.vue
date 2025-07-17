<template>
  <div class="min-w-[200px] max-w-[200px] bg-white rounded-lg shadow-md p-3 flex flex-col justify-between">
    <img :src="product.image" alt="product" class="w-full h-32 object-contain mb-2" />
    <div class="text-sm font-medium line-clamp-2 mb-1">{{ product.name }}</div>
    <div class="text-blue-700 font-bold text-sm mb-2">{{ product.price }} đ</div>
    <button class="bg-blue-700 text-white text-sm py-1.5 rounded hover:bg-blue-800">
      Chọn sản phẩm
    </button>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>