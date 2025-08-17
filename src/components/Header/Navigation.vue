<!-- Navigation Component -->
<template>
  <header class="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white shadow-xl backdrop-blur-sm relative z-50">
    <!-- Top Info Bar -->
    <div class="bg-green-800/90 backdrop-blur-sm text-xs py-2 border-b border-green-700/50">
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

    <div class="container mx-auto px-4 py-4">
      <!-- Top Row: Logo, Search, and Actions -->
      <div class="flex items-center justify-between gap-3">
        <!-- Logo and Slogan -->
        <router-link to="/" class="flex-shrink-0">
          <div class="flex items-center gap-2">
            <img src="/logo.webp" alt="Long Chau Logo" class="w-54 h-15 p-1" />
          </div>
        </router-link>

        <!-- Search bar - Hidden on mobile, shown on tablet+ -->
        <div class="flex-1 mx-4 hidden md:block max-w-2xl">
        <div class="flex group">
            <input
                type="text"
                placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..."
                class="flex-grow px-5 py-3.5 rounded-l-xl text-gray-800 text-sm bg-white/95 backdrop-blur-sm shadow-lg border border-white/50 focus:outline-none focus:ring-3 focus:ring-green-300/50 focus:border-green-400 focus:shadow-xl transition-all duration-300 placeholder:text-gray-500"
            />
            <button class="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3.5 rounded-r-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-105">
                <i class="fas fa-search text-white text-sm"></i>
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
            class="md:hidden bg-green-800/80 backdrop-blur-sm p-3 rounded-xl hover:bg-green-900/80 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            :class="{ 'bg-green-900/80': showMobileSearch }"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Cart -->
          <button 
            class="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            @click="toggleCart"
          >
            <div class="relative">
              <i class="fas fa-shopping-cart"></i>
              <span 
                v-if="totalItems > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white"
              >
                {{ totalItems > 99 ? '99+' : totalItems }}
              </span>
            </div>
            <span class="hidden sm:inline font-medium">
              Giỏ hàng
              <span v-if="totalItems > 0" class="text-xs opacity-90">({{ totalItems }})</span>
            </span>
          </button>

          <!-- Login/User Profile Section -->
          <div class="relative">
            <!-- Login Button (when not logged in) -->
            <button 
              v-if="!isLoggedIn"
              @click="$emit('open-login')" 
              :disabled="props.isLoading"
              :class="[
                'flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 shadow-lg font-medium hover:scale-105',
                props.isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-green-800 hover:bg-gray-50 hover:shadow-xl'
              ]"
            >
              <span v-if="props.isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="hidden sm:inline">Đang kiểm tra...</span>
              </span>
              <span v-else class="flex items-center gap-2">
                <i class="fas fa-user"></i> 
                <span class="hidden sm:inline">Đăng nhập</span>
              </span>
            </button>
            
            <!-- User Profile Button (when logged in) -->
            <button 
              v-else
              @click.stop="toggleUserProfile" 
              class="flex items-center gap-2 bg-white text-green-800 px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl font-medium hover:scale-105"
            >
              <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-semibold">{{ userInitials }}</span>
              </div>
              <span class="hidden sm:inline">{{ user?.name || 'User' }}</span>
              <i class="fas fa-chevron-down text-xs transition-transform" :class="{ 'rotate-180': showUserProfile }"></i>
            </button>

            <!-- User Profile Dropdown (Desktop) / Modal (Mobile) -->
            <div 
              v-if="showUserProfile && isLoggedIn && !isMobile" 
              v-click-outside="closeUserProfile"
              class="absolute right-0 top-full mt-2 z-50"
            >
              <UserProfileModal
                :user="user"
                @close="closeUserProfile"
                @logout="handleLogout"
                @view-orders="handleViewOrders"
                @edit-profile="handleEditProfile"
                @address-book="handleAddressBook"
                @favorites="handleFavorites"
              />
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden bg-green-800/80 backdrop-blur-sm p-3 rounded-xl hover:bg-green-900/80 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            :class="{ 'bg-green-900/80': showMobileMenu }"
          >
            <i :class="showMobileMenu ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar - Now stays below logo -->
      <div v-if="showMobileSearch" class="mt-4 md:hidden animate-slideDown">
          <div class="flex group">
    <input 
      type="text" 
      placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..." 
      class="flex-grow px-5 py-3.5 rounded-l-xl text-gray-800 text-sm bg-white/95 backdrop-blur-sm shadow-lg border border-white/50 focus:outline-none focus:ring-3 focus:ring-green-300/50 focus:border-green-400 focus:shadow-xl transition-all duration-300 placeholder:text-gray-500"
    />
    <button 
      class="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3.5 rounded-r-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-105"
    >
      <i class="fas fa-search text-white text-sm"></i>
    </button>
  </div>
        <!-- <div class="relative">
          <input 
            type="text" 
            placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..." 
            class="w-full px-4 py-3 pr-12 rounded-lg text-black text-sm bg-white shadow-sm" 
          />
          <button class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-500 px-2 py-1.5 rounded-md hover:bg-green-600 transition-colors">
            <i class="fas fa-search text-white text-sm"></i>
          </button>
        </div> -->
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
    <nav class="bg-green-800/95 backdrop-blur-sm text-sm hidden md:block border-t border-green-700/50 shadow-lg">
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



    <!-- Mobile User Profile Modal -->
    <UserProfileModal
      v-if="showUserProfile && isLoggedIn && isMobile"
      :user="user"
      @close="closeUserProfile"
      @logout="handleLogout"
      @view-orders="handleViewOrders"
      @edit-profile="handleEditProfile"
      @address-book="handleAddressBook"
      @favorites="handleFavorites"
    />
  </header>

  <!-- Mobile Menu Overlay with Gaussian Blur - Outside header for full screen coverage -->
  <div 
    v-if="showMobileMenu" 
    class="mobile-overlay fixed inset-0 bg-white/20 backdrop-blur-md z-[9998] md:hidden"
    @click="toggleMobileMenu"
  ></div>

  <!-- Mobile Navigation Menu - Sliding from left - Outside header for full screen coverage -->
  <nav 
    class="mobile-sidebar fixed top-0 left-0 h-full w-80 bg-green-800/95 backdrop-blur-md text-sm text-white md:hidden border-r border-green-700/50 z-[9999] transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-2xl"
    :class="showMobileMenu ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Mobile Menu Header -->
    <div class="bg-green-700/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-green-600/50">
      <div class="flex items-center gap-2">
        <img src="/logo.webp" alt="Long Chau Logo" class="w-32 h-8" />
      </div>
      <button 
        @click="toggleMobileMenu"
        class="bg-green-600/80 backdrop-blur-sm p-2 rounded-xl hover:bg-green-500/80 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
      >
        <i class="fas fa-times text-white"></i>
      </button>
    </div>

    <!-- Mobile Menu Content -->
    <div class="p-4">
      <NavigationDropdown
        v-for="item in navigationItems" 
        :key="item.name"
        :item="item"
        :is-mobile="true"
        @item-selected="handleItemSelected"
        class="border-b border-green-700 last:border-b-0"
      />
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import NavigationDropdown from './NavigationDropdown.vue'
import UserProfileModal from './UserProfileModal.vue'
import { useCategories } from '../../composables/useCategories.js'
import { useCart } from '../../composables/useCart.js'

// Props
const props = defineProps({
  cartCount: {
    type: Number,
    default: 2
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      phone: '0123 456 789',
      role: 'client'
    })
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

console.log(props.user)

// Mobile detection
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 768) // md breakpoint

// Update window width on resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Define emits
const emit = defineEmits(['open-login', 'open-cart', 'navigation-click', 'search', 'logout'])

// Cart composable
const { totalItems, toggleCart } = useCart()

// State
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)
const showUserProfile = ref(false)

// Search keywords
const searchKeywords = ref([
  'canxi', 'bổ não', 'Vitamin', 'sữa rửa mặt', 'chăm sóc mẹ bé', 'omega 3'
])

// Categories composable
const { mainCategories, getSubcategories } = useCategories()

// Computed property for user initials
const userInitials = computed(() => {
  if (!props.user?.name) return 'U'
  const names = props.user.name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[names.length - 1][0]
  }
  return names[0][0]
})

// Helper function to create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-') // Remove leading/trailing hyphens
}

// Icon mapping for categories
const categoryIcons = {
  'medicine': 'fas fa-pills',
  'supplement': 'fas fa-leaf', 
  'cosmeceutical': 'fas fa-spa',
  'personal_care': 'fas fa-user-check',
  'mother_baby': 'fas fa-baby',
  'medical_device': 'fas fa-stethoscope'
}

// Navigation items generated from categories system
const navigationItems = computed(() => {
  const items = mainCategories.value.map(category => {
    const subcategories = getSubcategories(category.id)
    
    return {
      id: category.id,
      name: category.name,
      icon: categoryIcons[category.key] || category.icon,
      slug: createSlug(category.name),
      dropdown: subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description || `Sản phẩm ${sub.name.toLowerCase()}`,
        slug: createSlug(sub.name),
        categoryId: category.id,
        subcategoryId: sub.id
      }))
    }
  })

  // Add additional static navigation items
  items.push(
    { name: 'Bệnh lý', icon: 'fas fa-heartbeat', slug: 'benh-ly' },
    { name: 'Góc sức khỏe', icon: 'fas fa-heart', slug: 'goc-suc-khoe' },
    { name: 'Tin tức', icon: 'fas fa-newspaper', slug: 'tin-tuc' }
  )

  return items
})

// Methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    showMobileSearch.value = false
    showUserProfile.value = false
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden'
  } else {
    // Restore body scroll when menu is closed
    document.body.style.overflow = ''
  }
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  if (showMobileSearch.value) {
    showMobileMenu.value = false
    showUserProfile.value = false
  }
}

const toggleUserProfile = () => {
  showUserProfile.value = !showUserProfile.value;

  console.log('User profile toggled:', props.user)
  if (showUserProfile.value) {
    showMobileMenu.value = false
    showMobileSearch.value = false
  }
}

const closeUserProfile = () => {
  showUserProfile.value = false
}

const handleItemSelected = (selection) => {
  // Close mobile menu after selection
  showMobileMenu.value = false
  // Restore body scroll
  document.body.style.overflow = ''
  
  // Emit navigation event
  emit('navigation-click', selection)
  
  console.log('Navigation selected:', selection)
}

const handleSearchKeyword = (keyword) => {
  emit('search', keyword)
  console.log('Search keyword:', keyword)
}

// User action handlers
const handleLogout = () => {
  console.log('Navigation: Logout initiated, closing dropdown')
  showUserProfile.value = false
  emit('logout')
}

const handleViewOrders = () => {
  console.log('View orders')
  // You can emit an event to parent or handle routing here
  emit('view-orders')
}

const handleEditProfile = () => {
  console.log('Edit profile')
  // You can emit an event to parent or handle routing here
  emit('edit-profile')
}

const handleAddressBook = () => {
  console.log('Address book')
  // You can emit an event to parent or handle routing here
  emit('address-book')
}

const handleFavorites = () => {
  console.log('View favorites')
  // You can emit an event to parent or handle routing here
  emit('favorites')
}

// Watch for logout to ensure dropdown closes
watch(() => props.isLoggedIn, (newValue, oldValue) => {
  console.log('Navigation: isLoggedIn changed from', oldValue, 'to', newValue)
  if (!newValue) {
    console.log('Navigation: User logged out, forcing dropdown close')
    showUserProfile.value = false
  }
})

// Simplified - no complex cart animations

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
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

/* Mobile menu slide animation */
.transform {
  transform: translateX(var(--tw-translate-x, 0)) translateY(var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1));
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.translate-x-0 {
  --tw-translate-x: 0px;
}

.-translate-x-full {
  --tw-translate-x: -100%;
}

/* Ensure mobile sidebar is always on top and visible */
@media (max-width: 768px) {
  .mobile-sidebar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    height: 100dvh !important; /* Dynamic viewport height for mobile */
    width: 320px !important;
    z-index: 9999 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  .mobile-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 9998 !important;
  }
}
</style>