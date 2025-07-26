<script setup>
    import ProductRow from '../components/home/ProductRow.vue'
    import BannerSlider from '../components/home/BannerSlider.vue'
    
    const featuredBanners = [{
            image: '/img/banners/banner-1.png',
            title: 'Khuyến mãi đặc biệt',
            subtitle: 'Giảm giá lên đến 50% cho các sản phẩm chăm sóc sức khỏe'
        },
        {
            image: '/img/banners/banner-2.jpg',
            title: 'Giao hàng nhanh 24/7',
            subtitle: 'Thuốc cấp cứu có sẵn, giao hàng trong 30 phút'
        }
    ]
    
    const hotDeals = [{
            id: 1,
            name: 'Listerine Tartar Control',
            price: '187.000',
            originalPrice: '250.000',
            discount: 25,
            image: '/img/product.avif',
            badge: 'Bán chạy',
            rating: 4.8,
            reviewCount: 245
        },
        {
            id: 2,
            name: 'Probiotics bổ sung men tiêu hóa',
            price: '323.850',
            originalPrice: '420.000',
            discount: 23,
            image: '/img/product.avif',
            badge: 'Giảm giá',
            rating: 4.6,
            reviewCount: 128
        },
        {
            id: 3,
            name: 'Tinh chất L\'Oreal Paris Revitalift',
            price: '324.000',
            originalPrice: '450.000',
            discount: 28,
            image: '/img/product.avif',
            badge: 'Mới',
            rating: 4.9,
            reviewCount: 89
        },
        {
            id: 4,
            name: 'Probiotics bổ sung',
            price: '323.850',
            originalPrice: '420.000',
            discount: 23,
            image: '/img/product.avif',
            rating: 4.6,
            reviewCount: 128
        },
        {
            id: 5,
            name: 'Tinh chất L\'Oreal',
            price: '324.000',
            originalPrice: '450.000',
            discount: 28,
            image: '/img/product.avif',
            rating: 4.9,
            reviewCount: 89
        }
    ]
    
    const urgentMeds = [{
            id: 6,
            name: 'Que thử thai nhanh Clearblue',
            price: '12.000',
            originalPrice: '15.000',
            discount: 20,
            image: '/img/product.avif',
            badge: 'Cấp tốc',
            rating: 4.9,
            reviewCount: 456,
            deliveryTime: '15 phút'
        },
        {
            id: 7,
            name: 'Viên Azoltel 400mg (Hộp 10 viên)',
            price: '4.500',
            image: '/img/product.avif',
            badge: 'Có sẵn',
            rating: 4.7,
            reviewCount: 234,
            deliveryTime: '30 phút'
        }
    ]
    
    const categories = [
        { name: 'Thuốc kê đơn', icon: '💊', color: 'bg-blue-100 text-blue-700' },
        { name: 'Thuốc không kê đơn', icon: '🏥', color: 'bg-green-100 text-green-700' },
        { name: 'Chăm sóc sức khỏe', icon: '❤️', color: 'bg-red-100 text-red-700' },
        { name: 'Làm đẹp', icon: '✨', color: 'bg-purple-100 text-purple-700' },
        { name: 'Mẹ và bé', icon: '👶', color: 'bg-pink-100 text-pink-700' },
        { name: 'Thiết bị y tế', icon: '🩺', color: 'bg-indigo-100 text-indigo-700' }
    ]
</script>

<template>
    <main class="flex-grow bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <!-- Hero Banner Section -->
        <div class="container mx-auto px-4 pt-6">
            <BannerSlider :banners="featuredBanners" />
        </div>
        
        <!-- Quick Categories Section -->
        <div class="container mx-auto px-4 my-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="w-1 h-6 bg-blue-600 rounded mr-3"></span>
                Danh mục phổ biến
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div v-for="category in categories" :key="category.name" 
                     class="group cursor-pointer">
                    <div :class="[category.color, 'p-4 rounded-xl text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md border border-opacity-20']">
                        <div class="text-2xl mb-2">{{ category.icon }}</div>
                        <div class="text-sm font-medium">{{ category.name }}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Products Section -->
        <div class="space-y-2">
            <ProductRow 
                title="⚡ Siêu deal ngập trời" 
                subtitle="Giảm giá cực sốc - Chỉ hôm nay!"
                :products="hotDeals" 
                theme="hot-deals"
            />
            <ProductRow 
                title="🚀 Cần thuốc gấp, Pharmacy có ngay" 
                subtitle="Giao hàng siêu tốc trong 30 phút"
                :products="urgentMeds" 
                theme="urgent"
            />
        </div>
        
        <!-- Trust Badges Section -->
        <div class="container mx-auto px-4 my-12">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div class="flex flex-col items-center space-y-2">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-shipping-fast text-blue-600 text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-800">Giao hàng nhanh</h3>
                        <p class="text-sm text-gray-600">Giao trong 30 phút với thuốc cấp cứu</p>
                    </div>
                    <div class="flex flex-col items-center space-y-2">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-shield-alt text-green-600 text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-800">Chất lượng đảm bảo</h3>
                        <p class="text-sm text-gray-600">100% thuốc chính hãng, có nguồn gốc</p>
                    </div>
                    <div class="flex flex-col items-center space-y-2">
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user-md text-purple-600 text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-800">Tư vấn miễn phí</h3>
                        <p class="text-sm text-gray-600">Dược sĩ tư vấn 24/7</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>