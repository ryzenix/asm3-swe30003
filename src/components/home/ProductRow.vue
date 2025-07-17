<template>
    <div class="relative my-6">
        <!-- Section Header -->
        <div class="container mx-auto px-4 flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <button class="text-blue-600 hover:underline text-sm">Xem thêm</button>
        </div>
        <!-- Scrollable container with background and rounded border -->
        <div class="container mx-auto px-4">
            <!-- Outer wrapper must allow overflow -->
            <div class="relative overflow-visible">
                <!-- Background + rounded content box -->
                <div class="bg-gray-50 rounded-xl p-4 shadow-sm">
                    <!-- Scrollable content -->
                    <div ref="scrollContainer" class="flex gap-4 overflow-x-auto scroll-smooth pb-2">
                        <div v-for="(product, index) in products" :key="index" class="flex-shrink-0">
                            <ProductCard :product="product" />
                        </div>
                    </div>
                </div>
                <!-- Left Arrow -->
                <button @click="scrollLeft" class="absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center z-10">
              <i class="fas fa-chevron-left"></i>
            </button>
                <!-- Right Arrow -->
                <button @click="scrollRight" class="absolute top-1/2 -right-5 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center z-10">
              <i class="fas fa-chevron-right"></i>
            </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {
        ref
    } from 'vue'
    import ProductCard from './ProductCard.vue'
    defineProps({
        title: String,
        products: Array
    })
    const scrollContainer = ref(null)
    const scrollLeft = () => {
        scrollContainer.value.scrollBy({
            left: -300,
            behavior: 'smooth'
        })
    }
    const scrollRight = () => {
        scrollContainer.value.scrollBy({
            left: 300,
            behavior: 'smooth'
        })
    }
</script>

<style scoped>
    /* Optional scrollbar hiding (can be removed if you want visible scrollbar) */
     ::-webkit-scrollbar {
        display: none;
    }
</style>