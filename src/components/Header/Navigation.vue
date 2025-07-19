<!-- Navigation Component -->
<template>
  <header class="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg relative z-50">
    <!-- Top Info Bar -->
    <div class="bg-green-800 text-xs py-1">
      <div class="container mx-auto px-4 flex flex-wrap items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <i class="fas fa-shipping-fast"></i>
            Giao hàng miễn phí đơn từ 299k
          </span>
          <span class="hidden sm:flex items-center gap-1">
            <i class="fas fa-phone"></i>
            Hotline: 1800 6821
          </span>
        </div>
        <div class="flex items-center gap-4">
          <span class="hidden md:flex items-center gap-1">
            <i class="fas fa-clock"></i>
            Mở cửa: 7:00 - 22:00
          </span>
          <span class="flex items-center gap-1 cursor-pointer hover:text-yellow-300">
            <i class="fas fa-map-marker-alt"></i>
            <span class="hidden sm:inline">Tìm nhà thuốc gần bạn</span>
            <span class="sm:hidden">Cửa hàng</span>
          </span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-3">
      <!-- Top Row: Logo, Search, and Actions -->
      <div class="flex items-center justify-between gap-3">
        <!-- Logo and Slogan -->
        <div class="flex-shrink-0">
          <div class="flex items-center gap-2">
            <img src="/logo.webp" alt="Long Chau Logo" class="w-54 h-15 p-1" />
          </div>
        </div>

        <!-- Search bar - Hidden on mobile, shown on tablet+ -->
        <div class="flex-1 mx-4 hidden md:block max-w-2xl">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..." 
              class="w-full px-4 py-3 pr-12 rounded-lg text-black text-sm bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent" 
            />
            <button class="absolute right-1 top-1 bottom-1 bg-green-500 px-4 rounded-md hover:bg-green-600 transition-colors">
              <i class="fas fa-search text-white"></i>
            </button>
          </div>
          <div class="text-xs text-white mt-2 space-x-3 hidden lg:block opacity-90">
            <span 
              v-for="keyword in searchKeywords" 
              :key="keyword"
              class="hover:underline cursor-pointer hover:opacity-100 transition-opacity"
              @click="handleSearchKeyword(keyword)"
            >
              {{ keyword }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Mobile Search Button -->
          <button 
            @click="toggleMobileSearch" 
            class="md:hidden bg-green-800 p-3 rounded-lg hover:bg-green-900 transition-colors"
            :class="{ 'bg-green-900': showMobileSearch }"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Cart -->
          <button 
            class="flex items-center gap-2 bg-orange-500 px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
            @click="$emit('open-cart')"
          >
            <div class="relative">
              <i class="fas fa-shopping-cart"></i>
              <span 
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white"
              >
                {{ cartCount }}
              </span>
            </div>
            <span class="hidden sm:inline font-medium">Giỏ hàng</span>
          </button>

          <!-- Login -->
          <button 
            @click="$emit('open-login')" 
            class="flex items-center gap-2 bg-white text-green-800 px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
          >
            <i class="fas fa-user"></i> 
            <span class="hidden sm:inline">Đăng nhập</span>
          </button>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden bg-green-800 p-3 rounded-lg hover:bg-green-900 transition-colors"
            :class="{ 'bg-green-900': showMobileMenu }"
          >
            <i :class="showMobileMenu ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div v-if="showMobileSearch" class="mt-4 md:hidden animate-slideDown">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..." 
            class="w-full px-4 py-3 pr-12 rounded-lg text-black text-sm bg-white shadow-sm" 
          />
          <button class="absolute right-1 top-1 bottom-1 bg-green-500 px-4 rounded-md hover:bg-green-600">
            <i class="fas fa-search text-white"></i>
          </button>
        </div>
        <div class="text-xs text-white mt-2 flex flex-wrap gap-2 opacity-90">
          <span 
            v-for="keyword in searchKeywords" 
            :key="keyword"
            class="hover:underline cursor-pointer"
            @click="handleSearchKeyword(keyword)"
          >
            {{ keyword }}
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <!-- Desktop Navigation with Dropdowns -->
    <nav class="bg-green-800 text-sm hidden md:block border-t border-green-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center">
          <!-- Navigation Items with Dropdowns -->
          <NavigationDropdown
            v-for="item in navigationItems" 
            :key="item.name"
            :item="item"
            :is-mobile="false"
            @item-selected="handleItemSelected"
          />
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <nav v-if="showMobileMenu" class="bg-green-800 text-sm md:hidden border-t border-green-700 animate-slideDown">
      <div class="container mx-auto px-4 py-2">
        <div class="border-b border-green-700 last:border-b-0">
          <NavigationDropdown
            v-for="item in navigationItems" 
            :key="item.name"
            :item="item"
            :is-mobile="true"
            @item-selected="handleItemSelected"
          />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'

// Import the dropdown component (assuming it's in the same file or imported)
import NavigationDropdown from './NavigationDropdown.vue'

// Props
const props = defineProps({
  cartCount: {
    type: Number,
    default: 2
  }
})

// Define emits
const emit = defineEmits(['open-login', 'open-cart', 'navigation-click', 'search'])

// State
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)

// Search keywords
const searchKeywords = ref([
  'canxi', 'bổ não', 'Vitamin', 'sữa rửa mặt', 'chăm sóc mẹ bé', 'omega 3'
])

// Navigation items with dropdown data
const navigationItems = ref([
  {
    name: 'Thuốc',
    icon: 'fas fa-pills',
    dropdown: [
      { name: 'Thuốc kê đơn', description: 'Thuốc theo toa bác sĩ', slug: 'thuoc-ke-don' },
      { name: 'Thuốc không kê đơn', description: 'Thuốc OTC an toàn', slug: 'thuoc-otc' },
      { name: 'Thuốc truyền thống', description: 'Đông y, thảo dược', slug: 'thuoc-dong-y' },
      { name: 'Thuốc cảm cúm', description: 'Điều trị triệu chứng cảm cúm', slug: 'thuoc-cam-cum' },
      { name: 'Thuốc đau đầu', description: 'Giảm đau, hạ sốt', slug: 'thuoc-dau-dau' }
    ]
  },
  {
    name: 'Thực phẩm chức năng',
    icon: 'fas fa-leaf',
    dropdown: [
      { name: 'Vitamin & Khoáng chất', description: 'Bổ sung dinh dưỡng thiết yếu', slug: 'vitamin-khoang-chat' },
      { name: 'Tăng cường miễn dịch', description: 'Nâng cao sức đề kháng', slug: 'tang-cuong-mien-dich' },
      { name: 'Hỗ trợ tiêu hóa', description: 'Men vi sinh, enzyme', slug: 'ho-tro-tieu-hoa' },
      { name: 'Bổ não, cải thiện trí nhớ', description: 'DHA, Omega-3', slug: 'bo-nao-tri-nho' },
      { name: 'Hỗ trợ xương khớp', description: 'Glucosamine, Calcium', slug: 'ho-tro-xuong-khop' }
    ]
  },
  {
    name: 'Dược mỹ phẩm',
    icon: 'fas fa-spa',
    dropdown: [
      { name: 'Chống nắng', description: 'Kem chống nắng SPF cao', slug: 'chong-nang' },
      { name: 'Trị mụn', description: 'Sản phẩm điều trị mụn hiệu quả', slug: 'tri-mun' },
      { name: 'Chống lão hóa', description: 'Serum, kem chống nhăn', slug: 'chong-lao-hoa' },
      { name: 'Dưỡng ẩm', description: 'Kem dưỡng cho da khô', slug: 'duong-am' },
      { name: 'Làm sạch da', description: 'Sữa rửa mặt, tẩy trang', slug: 'lam-sach-da' }
    ]
  },
  {
    name: 'Chăm sóc cá nhân',
    icon: 'fas fa-user-check',
    dropdown: [
      { name: 'Vệ sinh răng miệng', description: 'Kem đánh răng, nước súc miệng', slug: 've-sinh-rang-mieng' },
      { name: 'Chăm sóc tóc', description: 'Dầu gội, dầu xả chuyên dụng', slug: 'cham-soc-toc' },
      { name: 'Khử mùi cơ thể', description: 'Lăn khử mùi, xịt body', slug: 'khu-mui-co-the' },
      { name: 'Tắm gội', description: 'Sữa tắm, xà phòng', slug: 'tam-goi' }
    ]
  },
  {
    name: 'Mẹ & bé',
    icon: 'fas fa-baby',
    dropdown: [
      { name: 'Sữa bột', description: 'Sữa công thức các độ tuổi', slug: 'sua-bot' },
      { name: 'Bỉm tã', description: 'Tã giấy, tã vải', slug: 'bim-ta' },
      { name: 'Đồ dùng cho bé', description: 'Bình sữa, ty ngậm', slug: 'do-dung-cho-be' },
      { name: 'Chăm sóc mẹ bầu', description: 'Vitamin, sản phẩm cho mẹ', slug: 'cham-soc-me-bau' },
      { name: 'Thực phẩm ăn dặm', description: 'Bột ăn dặm, cháo dinh dưỡng', slug: 'thuc-pham-an-dam' }
    ]
  },
  {
    name: 'Dụng cụ y tế',
    icon: 'fas fa-stethoscope',
    dropdown: [
      { name: 'Máy đo huyết áp', description: 'Omron, Microlife', slug: 'may-do-huyet-ap' },
      { name: 'Máy đo đường huyết', description: 'Que thử, kim chích', slug: 'may-do-duong-huyet' },
      { name: 'Nhiệt kế', description: 'Điện tử, hồng ngoại', slug: 'nhiet-ke' },
      { name: 'Khẩu trang y tế', description: '3 lớp, N95', slug: 'khau-trang-y-te' },
      { name: 'Băng gạc', description: 'Băng y tế, băng dính', slug: 'bang-gac' }
    ]
  },
  { name: 'Bệnh lý', icon: 'fas fa-heartbeat', slug: 'benh-ly' },
  { name: 'Góc sức khỏe', icon: 'fas fa-heart', slug: 'goc-suc-khoe' },
  { name: 'Tin tức', icon: 'fas fa-newspaper', slug: 'tin-tuc' }
])

// Methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    showMobileSearch.value = false
  }
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  if (showMobileSearch.value) {
    showMobileMenu.value = false
  }
}

const handleItemSelected = (selection) => {
  // Close mobile menu after selection
  showMobileMenu.value = false
  
  // Emit navigation event
  emit('navigation-click', selection)
  
  // You can handle navigation logic here
  console.log('Navigation selected:', selection)
}

const handleSearchKeyword = (keyword) => {
  emit('search', keyword)
  console.log('Search keyword:', keyword)
}

// Components
const components = {
  NavigationDropdown
}
</script>

<style scoped>
/* Import Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Animation keyframes */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation classes */
.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

/* Pulse animation for special offers */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Ensure proper touch targets on mobile */
@media (max-width: 768px) {
  button,
  .cursor-pointer {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Focus styles for accessibility */
input:focus {
  outline: 2px solid #86efac;
  outline-offset: 2px;
}

button:focus {
  outline: 2px solid #86efac;
  outline-offset: 2px;
}

/* Hover effects */
.hover\:bg-green-50:hover {
  background-color: #f0fdf4;
}

.hover\:bg-green-700:hover {
  background-color: #15803d;
}

.hover\:bg-green-800:hover {
  background-color: #166534;
}

.hover\:bg-green-900:hover {
  background-color: #14532d;
}

.hover\:text-yellow-200:hover {
  color: #fef08a;
}

.hover\:text-yellow-300:hover {
  color: #fde047;
}
</style>