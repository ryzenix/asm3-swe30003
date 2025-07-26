<template>
    <div class="relative my-8">
        <!-- Section Header -->
        <div class="container mx-auto px-4 mb-4">
            <div class="flex justify-between items-end">
                <div class="space-y-1">
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                        <span class="w-1 h-8 rounded mr-3" :class="getThemeColor(theme, 'accent')"></span>
                        {{ title }}
                    </h2>
                    <p v-if="subtitle" class="text-gray-600 text-sm ml-4">{{ subtitle }}</p>
                </div>
                <button class="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200">
                    <span>Xem tất cả</span>
                    <i class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-200"></i>
                </button>
            </div>
        </div>
        
        <!-- Scrollable container -->
        <div class="container mx-auto px-4">
            <div class="relative overflow-visible">
                <!-- Background container -->
                <div :class="[
                    'rounded-2xl p-6 shadow-sm border',
                    getThemeColor(theme, 'background')
                ]">
                    <!-- Scrollable content -->
                    <div 
                        ref="scrollContainer" 
                        class="flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
                        @scroll="updateScrollButtons"
                    >
                        <div v-for="(product, index) in products" :key="product.id || index" class="flex-shrink-0">
                            <ProductCard :product="product" />
                        </div>
                        
                        <!-- "Show more" card at the end -->
                        <div class="flex-shrink-0 min-w-[220px] max-w-[220px]">
                            <div class="h-full bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group">
                                <div class="w-12 h-12 bg-gray-200 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-colors duration-300">
                                    <i class="fas fa-plus text-gray-500 group-hover:text-blue-600 transition-colors duration-300"></i>
                                </div>
                                <h3 class="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300 text-sm">
                                    Xem thêm sản phẩm
                                </h3>
                                <p class="text-xs text-gray-500 mt-1">{{ products.length }}+ sản phẩm</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Left Arrow -->
                <Transition name="fade">
                    <button 
                        v-show="showLeftArrow"
                        @click="scrollLeft" 
                        class="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center z-10 text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                        <i class="fas fa-chevron-left"></i>
                    </button>
                </Transition>
                
                <!-- Right Arrow -->
                <Transition name="fade">
                    <button 
                        v-show="showRightArrow"
                        @click="scrollRight" 
                        class="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center z-10 text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </Transition>
            </div>
            
            <!-- Progress indicator -->
            <div class="flex justify-center mt-4">
                <div class="bg-gray-200 rounded-full h-1 w-32">
                    <div 
                        class="h-full rounded-full transition-all duration-300"
                        :class="getThemeColor(theme, 'accent')"
                        :style="{ width: scrollProgress + '%' }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
    title: String,
    subtitle: String,
    products: Array,
    theme: {
        type: String,
        default: 'default'
    }
})

const scrollContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(true)
const scrollProgress = ref(0)

const scrollLeft = () => {
    scrollContainer.value.scrollBy({
        left: -350,
        behavior: 'smooth'
    })
}

const scrollRight = () => {
    scrollContainer.value.scrollBy({
        left: 350,
        behavior: 'smooth'
    })
}

const updateScrollButtons = () => {
    const container = scrollContainer.value
    if (!container) return
    
    const { scrollLeft, scrollWidth, clientWidth } = container
    
    showLeftArrow.value = scrollLeft > 10
    showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10
    
    // Update progress
    const maxScroll = scrollWidth - clientWidth
    scrollProgress.value = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
}

const getThemeColor = (theme, type) => {
    const themes = {
        'hot-deals': {
            background: 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200',
            accent: 'bg-gradient-to-r from-orange-500 to-red-500'
        },
        'urgent': {
            background: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
            accent: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        },
        'default': {
            background: 'bg-gray-50 border-gray-200',
            accent: 'bg-blue-600'
        }
    }
    
    return themes[theme]?.[type] || themes['default'][type]
}

onMounted(() => {
    updateScrollButtons()
})
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>