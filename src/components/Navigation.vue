<template>
  <header class="bg-green-700 text-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <!-- Top Row: Logo, Search, and Actions -->
      <div class="flex items-center justify-between gap-3">
        <!-- Logo and Slogan -->
        <div class="flex-shrink-0">
          <img src="/logo.webp" alt="Long Chau Logo" class="w-50 h-12" />
          <p class="text-xs text-center mt-1">Serving health across Vietnam</p>
        </div>

        <!-- Search bar - Hidden on mobile, shown on tablet+ -->
        <div class="flex-1 mx-4 hidden md:block">
          <div class="flex">
            <input
              type="text"
              placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..."
              class="w-full px-4 py-2 rounded-l-md text-black text-sm bg-white"
            />
            <button class="bg-green-500 px-4 rounded-r-md hover:bg-green-600 flex-shrink-0">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <div class="text-xs text-white mt-1 space-x-2 hidden lg:block">
            <span class="hover:underline cursor-pointer">canxi</span>
            <span class="hover:underline cursor-pointer">bổ não</span>
            <span class="hover:underline cursor-pointer">Vitamin</span>
            <span class="hover:underline cursor-pointer">sữa rửa mặt</span>
            <span class="hover:underline cursor-pointer">chăm sóc mẹ bé</span>
            <span class="hover:underline cursor-pointer">omega 3</span>
          </div>
        </div>

        <!-- Mobile Actions -->
        <div class="flex items-center gap-2">
          <!-- Mobile Search Button -->
          <button 
            @click="toggleMobileSearch"
            class="md:hidden bg-green-900 p-2 rounded-md hover:bg-green-800"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Cart -->
          <RouterLink
            to="/customer/cart"
            class="flex items-center gap-1 bg-green-900 px-2 py-2 sm:px-4 rounded-md hover:bg-green-800"
          >
            <i class="fas fa-shopping-cart"></i> 
            <span class="hidden sm:inline">Giỏ hàng</span>
          </RouterLink>

          <!-- Login -->
          <RouterLink
            to="/login"
            class="flex items-center gap-1 bg-white text-green-800 px-2 py-2 sm:px-4 rounded-full hover:bg-gray-100"
          >
            <i class="fas fa-user"></i> 
            <span class="hidden sm:inline">Đăng nhập</span>
          </RouterLink>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden bg-green-900 p-2 rounded-md hover:bg-green-800"
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div v-if="showMobileSearch" class="mt-3 md:hidden">
        <div class="flex">
          <input
            type="text"
            placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..."
            class="w-full px-4 py-2 rounded-l-md text-black text-sm bg-white"
          />
          <button class="bg-green-500 px-4 rounded-r-md hover:bg-green-600 flex-shrink-0">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="text-xs text-white mt-2 flex flex-wrap gap-2">
          <span class="hover:underline cursor-pointer">canxi</span>
          <span class="hover:underline cursor-pointer">bổ não</span>
          <span class="hover:underline cursor-pointer">Vitamin</span>
          <span class="hover:underline cursor-pointer">sữa rửa mặt</span>
          <span class="hover:underline cursor-pointer">chăm sóc mẹ bé</span>
          <span class="hover:underline cursor-pointer">omega 3</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <!-- Desktop Navigation -->
    <nav class="bg-green-800 text-sm hidden md:block">
      <div class="container mx-auto px-4 py-2 flex flex-wrap gap-4">
        <div class="cursor-pointer hover:underline">Thuốc</div>
        <div class="cursor-pointer hover:underline">Thực phẩm chức năng</div>
        <div class="cursor-pointer hover:underline">Dược mỹ phẩm</div>
        <div class="cursor-pointer hover:underline">Chăm sóc cá nhân</div>
        <div class="cursor-pointer hover:underline">Mẹ & bé</div>
        <div class="cursor-pointer hover:underline">Dụng cụ y tế</div>
        <div class="cursor-pointer hover:underline">Bệnh lý</div>
        <div class="cursor-pointer hover:underline">Góc sức khỏe</div>
        <div class="cursor-pointer hover:underline">Tin tức</div>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <nav v-if="showMobileMenu" class="bg-green-800 text-sm md:hidden">
      <div class="container mx-auto px-4 py-2 space-y-2">
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Thuốc</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Thực phẩm chức năng</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Dược mỹ phẩm</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Chăm sóc cá nhân</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Mẹ & bé</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Dụng cụ y tế</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Bệnh lý</div>
        <div class="cursor-pointer hover:underline py-2 border-b border-green-700">Góc sức khỏe</div>
        <div class="cursor-pointer hover:underline py-2">Tin tức</div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Mobile menu state
const showMobileMenu = ref(false)
const showMobileSearch = ref(false)

// Toggle functions
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  // Close search if menu is opened
  if (showMobileMenu.value) {
    showMobileSearch.value = false
  }
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  // Close menu if search is opened
  if (showMobileSearch.value) {
    showMobileMenu.value = false
  }
}
</script>

<style scoped>
/* Optional: Load Font Awesome if you're using those icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Ensure proper touch targets on mobile */
@media (max-width: 768px) {
  button, .cursor-pointer {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Animation for mobile menu */
nav {
  transition: all 0.3s ease-in-out;
}
</style>