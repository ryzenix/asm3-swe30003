<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div class="container mx-auto px-4 py-8">
            <!-- Header breadcrumb -->
            <div class="mb-6">
                <nav class="text-sm text-gray-600 flex items-center gap-2">
                    <i class="fas fa-home"></i>
                    <span>Trang chủ</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                    <span>{{ product.category }}</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                    <span class="text-blue-600 font-medium">{{ product.name.substring(0, 30) }}...</span>
                </nav>
            </div>

            <!-- Main Product Card -->
            <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                <!-- Top Section - Image and Main Info -->
                <div class="lg:flex">
                    <!-- Left - Enhanced Image Section -->
                    <div class="lg:w-2/5 p-8 bg-gradient-to-br from-white to-gray-50">
                        <div class="sticky top-8">
                            <!-- Main Product Image -->
                            <div class="relative group mb-6">
                                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <img 
                                    :src="product.mainImage" 
                                    alt="" 
                                    class="relative w-full rounded-2xl border border-gray-200 object-contain max-h-80 bg-white shadow-lg transition-transform duration-300 group-hover:scale-105" 
                                />
                                <!-- Floating action buttons -->
                                <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                                        <i class="fas fa-expand text-sm"></i>
                                    </button>
                                    <button class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                        <i class="fas fa-heart text-sm"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Thumbnail Gallery -->
                            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                <img 
                                    v-for="(thumb, i) in product.thumbnails" 
                                    :key="i" 
                                    :src="thumb" 
                                    class="flex-shrink-0 w-16 h-16 rounded-xl border-2 object-cover cursor-pointer transition-all duration-300" 
                                    :class="{ 
                                        'ring-4 ring-blue-500 border-blue-300 shadow-lg scale-110': thumb === product.mainImage, 
                                        'border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105': thumb !== product.mainImage 
                                    }" 
                                    @click="changeMainImage(thumb)"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Right - Product Information -->
                    <div class="lg:w-3/5 p-8">
                        <!-- Brand Badge -->
                        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                            <i class="fas fa-award"></i>
                            <span>{{ product.brand }}</span>
                        </div>

                        <!-- Product Title -->
                        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                            {{ product.name }}
                        </h1>

                        <!-- SKU and Rating Row -->
                        <div class="flex flex-wrap items-center gap-4 mb-6">
                            <span class="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                                <i class="fas fa-barcode mr-1"></i>
                                {{ product.sku }}
                            </span>
                            <div class="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                                <div class="flex text-yellow-500 text-sm">
                                    <i v-for="n in 5" :key="n" class="fas fa-star"></i>
                                </div>
                                <span class="font-bold text-yellow-600">{{ product.rating }}</span>
                                <span class="text-gray-500 text-sm">({{ product.reviews }})</span>
                            </div>
                        </div>

                        <!-- Price Section -->
                        <div class="mb-8">
                            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-xl">
                                <div class="flex items-baseline justify-between">
                                    <div>
                                        <p class="text-3xl font-black mb-1">{{ product.price }}</p>
                                        <p class="text-emerald-100 text-sm">{{ product.unit }}</p>
                                    </div>
                                    <div v-if="product.originalPrice" class="text-right">
                                        <p class="text-emerald-200 line-through text-lg">{{ product.originalPrice }}</p>
                                        <span class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">SALE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Purchase Section -->
                        <div class="bg-gray-50 rounded-2xl p-6 mb-6">
                            <!-- Quantity Selector -->
                            <div class="mb-4">
                                <label class="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                                    <i class="fas fa-calculator text-blue-500"></i>
                                    Số lượng
                                </label>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                        <button @click="decreaseQty" class="px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-bold text-xl">−</button>
                                        <input 
                                            type="number" 
                                            v-model="quantity" 
                                            min="1" 
                                            class="w-20 text-center focus:outline-none bg-white py-3 font-bold text-lg border-x-2 border-gray-300" 
                                        />
                                        <button @click="increaseQty" class="px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-bold text-xl">+</button>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm text-gray-600">Tổng cộng</p>
                                        <p class="text-2xl font-bold text-green-600">{{ calculateTotal() }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3">
                                    <i class="fas fa-shopping-cart text-xl"></i>
                                    <span>Mua ngay</span>
                                </button>
                                <button class="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3">
                                    <i class="fas fa-store text-xl"></i>
                                    <span>Tìm cửa hàng</span>
                                </button>
                            </div>
                        </div>

                        <!-- Social Proof Alert -->
                        <div class="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full blur-2xl opacity-30"></div>
                            <div class="relative flex items-center gap-3">
                                <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                    <i class="fas fa-fire text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-red-800 mb-1">🔥 Sản phẩm hot!</p>
                                    <p class="text-red-700 text-sm">
                                        <span class="bg-red-100 px-2 py-1 rounded font-semibold">1 người</span> vừa thêm vào giỏ • 
                                        <span class="bg-red-100 px-2 py-1 rounded font-semibold">36 người</span> đang xem
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Section - Detailed Info -->
                <div class="border-t border-gray-200">
                    <!-- Product Details Grid -->
                    <div class="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <i class="fas fa-info-circle text-blue-500"></i>
                            Thông tin chi tiết
                        </h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-tags text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-500 text-sm">Danh mục</p>
                                        <p class="font-semibold text-gray-900">{{ product.category }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-box text-purple-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-500 text-sm">Quy cách</p>
                                        <p class="font-semibold text-gray-900">{{ product.packaging }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-globe text-green-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-500 text-sm">Xuất xứ</p>
                                        <p class="font-semibold text-gray-900">{{ product.origin }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-industry text-orange-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-500 text-sm">Nhà sản xuất</p>
                                        <p class="font-semibold text-gray-900 text-sm">{{ product.manufacturer }}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-flag text-red-600"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-500 text-sm">Nước sản xuất</p>
                                        <p class="font-semibold text-gray-900">{{ product.country }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Promotions -->
                        <div v-if="product.promotion" class="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl p-6 shadow-xl mb-8">
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-gift text-3xl"></i>
                                </div>
                                <div>
                                    <h4 class="text-xl font-bold mb-1">🎁 Ưu đãi đặc biệt</h4>
                                    <p class="text-orange-100">{{ product.promotion }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Benefits -->
                        <div class="bg-white rounded-2xl p-6 shadow-lg">
                            <h4 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <i class="fas fa-shield-alt text-green-500"></i>
                                Quyền lợi khách hàng
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-undo text-white"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">30 ngày</p>
                                        <p class="text-gray-600 text-sm">Đổi trả miễn phí</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-pills text-white"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">100% đổi thuốc</p>
                                        <p class="text-gray-600 text-sm">Bảo đảm chất lượng</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                    <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-shipping-fast text-white"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">Miễn phí ship</p>
                                        <p class="text-gray-600 text-sm">Giao hàng tận nơi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Important Notice -->
                        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p class="text-blue-700 text-sm flex items-center gap-2">
                                <i class="fas fa-info-circle"></i>
                                <span>Mẫu mã sản phẩm có thể thay đổi theo lô hàng, không ảnh hưởng đến chất lượng sản phẩm.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    
    const product = ref({
        brand: 'LÁBEBÉ',
        name: 'Siro Bổ Phế Lábebé 120ml hỗ trợ bổ phế, giảm ho, giảm đờm, giảm đau họng',
        sku: '00046430',
        rating: '5.0',
        reviews: 116,
        comments: 259,
        price: '75.000đ',
        originalPrice: null,
        unit: 'Hộp',
        category: 'Tăng sức đề kháng, miễn dịch',
        registrationNumber: '2719/2024/ĐKSP',
        publicationLink: 'https://example.com/cong-bo-san-pham',
        dosageForm: 'Siro',
        packaging: 'Hộp',
        origin: 'Việt Nam',
        manufacturer: 'CÔNG TY CỔ PHẦN DƯỢC PHẨM PHARVINA',
        country: 'Việt Nam',
        ingredients: [
            'Mạch môn',
            'Cát cánh',
            'Cam thảo',
            'Xuyên tâm liên',
            'Dịch chiết lá Thường xuân',
            'Keo Ong'
        ],
        promotion: null,
        mainImage: '/img/products/details/image1.webp',
        thumbnails: [
            '/img/products/details/image1.webp',
            '/img/products/details/image2.webp',
            '/img/products/details/image3.webp',
            '/img/products/details/image4.jpg'
        ]
    })
    
    const quantity = ref(1)
    
    const increaseQty = () => {
        quantity.value++
    }
    
    const decreaseQty = () => {
        if (quantity.value > 1) quantity.value--
    }
    
    const changeMainImage = (newImage) => {
        product.value.mainImage = newImage
    }
    
    const calculateTotal = () => {
        const price = parseInt(product.value.price.replace(/[^\d]/g, ''))
        const total = price * quantity.value
        return total.toLocaleString('vi-VN') + 'đ'
    }
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Custom animations */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Backdrop blur fallback */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Smooth transitions */
* {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>