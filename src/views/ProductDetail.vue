<template>
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-6xl mx-auto px-4 py-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button 
                @click="fetchProduct($route.params.id)"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Thử lại
            </button>
        </div>

        <!-- Product Content -->
        <div v-else class="flex flex-col lg:flex-row gap-6">
            <!-- Left: Images -->
            <div class="lg:w-1/2">
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <img :src="product.mainImage" alt="Main product" class="relative w-full aspect-square object-cover rounded-xl border border-gray-200 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]" />
                    
                    <!-- Image overlay with wishlist and share buttons -->
                    <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button @click="toggleWishlist" :class="[
                            'p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-md hover:shadow-lg',
                            isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                        ]">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button class="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-md hover:shadow-lg">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Authenticity Badge -->
                    <div class="absolute top-3 left-3">
                        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium border border-yellow-400 flex items-center gap-1 shadow-md">
                            <i class="fas fa-star text-yellow-400 text-xs"></i>
                            <span>SẢN PHẨM CHÍNH HÃNG</span>
                        </div>
                    </div>

                    <!-- Gift Badge -->
                    <div class="absolute bottom-3 left-3">
                        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                            <i class="fas fa-gift text-xs"></i>
                            <span>QUÀ TẶNG</span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mt-5 overflow-x-auto pb-4 px-1">
                    <img 
                        v-for="(thumb, index) in product.thumbnails" 
                        :key="index" 
                        :src="thumb" 
                        alt="Thumbnail" 
                        :class="[
                            'w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md',
                            'm-1',
                            product.mainImage === thumb 
                                ? 'border-blue-500 ring-2 ring-blue-200 shadow-md scale-105' 
                                : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                        ]" 
                        @click="product.mainImage = thumb" 
                    />
                </div>

                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p class="text-xs text-blue-700 flex items-center gap-2">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        Mẫu mã sản phẩm có thể thay đổi theo lô hàng
                    </p>
                </div>
            </div>

            <!-- Right: Info -->
            <div class="lg:w-1/2">
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>Thương hiệu:</span>
                    <span class="text-blue-600 font-medium">{{ product.brand }}</span>
                    <span class="text-gray-300">•</span>
                    <span>SKU: {{ product.sku }}</span>
                </div>

                <h1 class="text-2xl font-bold text-gray-900 leading-tight mb-4">
                    {{ product.name }}
                </h1>

                <!-- Rating & Stock Status -->
                <div class="flex items-center gap-4 mb-4">
                    <div class="flex items-center gap-2">
                        <div class="flex">
                            <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <span class="text-sm font-bold text-yellow-600">4.8</span>
                        <span class="text-xs text-gray-500">(1,247 đánh giá)</span>
                    </div>
                    <div v-if="product.stockQuantity > 0" class="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-medium shadow-sm">
                        ✅ Còn hàng
                    </div>
                    <div v-else class="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-medium shadow-sm">
                        ⚠️ Hết hàng
                    </div>
                </div>

                <!-- Price -->
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-3xl font-black text-blue-600">{{ product.price }}</span>
                    <span v-if="product.originalPrice" class="text-gray-400 line-through text-lg">
                        {{ product.originalPrice }}
                    </span>
                </div>

                <!-- Promotion -->
                <div v-if="product.promotion" class="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg px-4 py-3 mb-4 flex items-center gap-2 shadow-md">
                    <span class="text-lg">🎁</span>
                    <span class="font-medium text-sm">{{ product.promotion }}</span>
                </div>

                <!-- Attributes -->
                <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
                    <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Thông tin sản phẩm
                    </h3>
                    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div class="space-y-1">
                            <dt class="font-medium text-gray-600">Danh mục:</dt>
                            <dd class="text-gray-900 font-semibold">
                              {{ product.category }}
                              <span v-if="product.subcategory" class="text-gray-600 text-sm block">
                                {{ product.subcategory }}
                              </span>
                            </dd>
                        </div>
                        <div class="space-y-1">
                            <dt class="font-medium text-gray-600">Quy cách:</dt>
                            <dd class="text-gray-900 font-semibold">{{ product.packaging }}</dd>
                        </div>
                        <div class="space-y-1">
                            <dt class="font-medium text-gray-600">Nhà sản xuất:</dt>
                            <dd class="text-gray-900 font-semibold">{{ product.manufacturer }}</dd>
                        </div>
                        <div class="space-y-1">
                            <dt class="font-medium text-gray-600">Xuất xứ:</dt>
                            <dd class="text-gray-900 font-semibold">{{ product.origin }}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Quantity Selector -->
                <div class="flex items-center gap-4 mb-6">
                    <label class="font-semibold text-gray-900 text-base">Số lượng:</label>
                    <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button class="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" @click="decrease" :disabled="quantity <= 1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <span class="px-6 py-2 font-semibold text-lg min-w-[60px] text-center">{{ quantity }}</span>
                        <button class="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200" @click="increase">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 mb-6">
                    <button 
                      :disabled="product.stockQuantity === 0"
                      :class="[
                        'flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
                        product.stockQuantity === 0 
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'
                      ]"
                    >
                        <svg v-if="product.stockQuantity === 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                        {{ product.stockQuantity === 0 ? 'Hết hàng' : 'Chọn mua' }}
                    </button>
                    <button class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Tìm nhà thuốc
                    </button>
                </div>

                <!-- Policies -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div class="flex items-center gap-2 text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span class="font-medium">Đổi trả trong 30 ngày</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-medium">Miễn phí 100% đổi thuốc</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <span class="font-medium">Miễn phí vận chuyển</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="border-b bg-gradient-to-r from-gray-50 to-blue-50 px-6">
                <nav class="flex gap-6">
                    <button v-for="tab in tabs" :key="tab" class="py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 relative" :class="{ 
                        'text-blue-600 border-blue-500': activeTab === tab,
                        'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300': activeTab !== tab
                    }" @click="activeTab = tab">
                        {{ tab }}
                    </button>
                </nav>
            </div>

            <div class="p-6 text-gray-800 leading-relaxed min-h-[250px]">
                <div v-if="activeTab === 'Mô tả'" class="prose prose-sm max-w-none">
                    <h4 class="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm:</h4>
                    <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
                </div>
                <div v-else-if="activeTab === 'Thành phần'">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Thành phần chính:</h4>
                    <ul class="space-y-3">
                        <li v-for="item in product.ingredients" :key="item" class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <span class="font-medium text-gray-800">{{ item }}</span>
                        </li>
                    </ul>
                </div>
                <div v-else-if="activeTab === 'Công dụng'" class="prose prose-sm max-w-none">
                    <h4 class="text-lg font-semibold text-gray-900 mb-3">Công dụng chính:</h4>
                    <p class="text-gray-700 leading-relaxed">{{ product.uses }}</p>
                </div>
                <div v-else-if="activeTab === 'Hướng dẫn sử dụng'">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Cách sử dụng:</h4>
                    <ol class="space-y-3">
                        <li v-for="(step, index) in product.usageInstructions" :key="step" class="flex gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <span class="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                {{ index + 1 }}
                            </span>
                            <span class="pt-0.5 font-medium text-gray-800">{{ step }}</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    ref,
    onMounted
} from 'vue'
import { useProductApi } from '../services/productApi.js'

export default {
    name: 'ProductDetail',
    setup() {
        const quantity = ref(1)
        const activeTab = ref('Mô tả')
        const isWishlisted = ref(false)
        const loading = ref(false)
        const error = ref('')

        const tabs = ['Mô tả', 'Thành phần', 'Công dụng', 'Hướng dẫn sử dụng']

        // API service
        const { getProduct } = useProductApi()

        const product = ref({
            brand: 'Pharmacy',
            name: 'Khẩu trang y tế màu đen Pharmacy (Hộp 50 cái) - New 2025',
            sku: 'P28887',
            price: '59.000đ',
            originalPrice: null,
            unit: 'Hộp',
            category: 'Dụng cụ y tế',
            subcategory: 'Khẩu trang y tế',
            packaging: 'Hộp 50 Cái',
            origin: 'Việt Nam',
            manufacturer: 'CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI THIẾT BỊ NAM ANH',
            promotion: 'Mua 1 Tặng 1 (01–31/8)',
            stockQuantity: 150,
            mainImage: '/img/products/details/image1.webp',
            thumbnails: [
                '/img/products/details/image1.webp',
                '/img/products/details/image2.webp',
                '/img/products/details/image3.webp',
                '/img/products/details/image4.jpg'
            ],
            description: 'Khẩu trang y tế Pharmacy - 3 lớp có hiệu quả lọc khuẩn trên 99%, bảo vệ tối ưu cho người dùng. Chất liệu mềm mại, an toàn cho da. Thiết kế vừa vặn phù hợp cho việc sử dụng hàng ngày.',
            ingredients: ['Dây thun đeo tai', 'Thanh nẹp mũi', 'Lớp ngoài vải không dệt', 'Lớp giữa lọc', 'Lớp trong mềm mại'],
            uses: 'Ngăn ngừa bụi bẩn, giọt bắn, vi khuẩn gây bệnh qua đường hô hấp và hỗ trợ giảm tác động từ tia UV.',
            usageInstructions: [
                'Cầm khẩu trang, mặt có in logo hướng ra ngoài.',
                'Đặt lên mặt và đeo hai bên tai.',
                'Cố định thanh nẹp mũi.',
                'Điều chỉnh khẩu trang che kín mũi và miệng.'
            ]
        })

        // Fetch product data from API
        const fetchProduct = async (productId) => {
            loading.value = true
            error.value = ''
            
            try {
                const response = await getProduct(productId)
                
                if (response.success) {
                    const apiProduct = response.data
                    
                    // Transform API data to match component structure
                    product.value = {
                        brand: apiProduct.manufacturer,
                        name: apiProduct.title,
                        sku: apiProduct.sku,
                        price: apiProduct.price,
                        originalPrice: null, // API doesn't provide this
                        unit: apiProduct.unit,
                        category: apiProduct.category,
                        subcategory: apiProduct.subcategory,
                        packaging: apiProduct.unit,
                        origin: 'Việt Nam', // Default value
                        manufacturer: apiProduct.manufacturer,
                        promotion: null, // API doesn't provide this
                        stockQuantity: apiProduct.stockQuantity,
                        mainImage: apiProduct.image || '/img/products/placeholder-product.jpg',
                        thumbnails: [
                            apiProduct.image || '/img/products/placeholder-product.jpg'
                        ],
                        description: apiProduct.description || '',
                        ingredients: apiProduct.ingredients || [],
                        uses: apiProduct.uses || '',
                        usageInstructions: apiProduct.usageInstructions || []
                    }
                } else {
                    throw new Error(response.error || 'Failed to fetch product')
                }
            } catch (err) {
                console.error('Fetch product error:', err)
                error.value = err.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm'
            } finally {
                loading.value = false
            }
        }

        const increase = () => {
            quantity.value++
        }

        const decrease = () => {
            if (quantity.value > 1) quantity.value--
        }

        const toggleWishlist = () => {
            isWishlisted.value = !isWishlisted.value
        }

        return {
            quantity,
            activeTab,
            isWishlisted,
            tabs,
            product,
            loading,
            error,
            fetchProduct,
            increase,
            decrease,
            toggleWishlist
        }
    },

    async mounted() {
        // Get product ID from route params
        const productId = this.$route.params.id
        if (productId) {
            await this.fetchProduct(productId)
        }
    }
}
</script>

<style scoped>
/* Custom animations and transitions */
.group:hover .group-hover\:opacity-100 {
    opacity: 1;
}

/* Smooth transitions for all interactive elements */
* {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}

/* Enhanced focus states for accessibility */
button:focus-visible,
img:focus-visible {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
}

/* Custom scrollbar for thumbnail container */
.overflow-x-auto::-webkit-scrollbar {
    height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #F3F4F6;
    border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
}

/* Gradient text effects */
.text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Hover animations */
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Pulse animation for badges */
@keyframes pulse-glow {
    0%, 100% { 
        box-shadow: 0 0 3px rgba(59, 130, 246, 0.3);
    }
    50% { 
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
}

.animate-pulse-glow {
    animation: pulse-glow 2s infinite;
}
</style>
