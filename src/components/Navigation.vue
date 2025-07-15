<template>
  <header class="bg-green-700 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo and Slogan -->
      <div class="flex items-center gap-3">
        <img src="/logo.webp" alt="Long Chau Logo" class="w-50 h-12" />
        <div class="leading-5">
          <h1 class="text-lg font-bold">LONG CHAU Pharmacy</h1>
          <p class="text-xs">Serving health across Vietnam</p>
        </div>
      </div>

      <!-- Search bar -->
      <div class="flex-1 mx-6">
        <div class="flex">
          <input
            type="text"
            placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..."
            class="w-full px-4 py-2 rounded-l-md text-black"
          />
          <button class="bg-green-500 px-4 rounded-r-md hover:bg-green-600">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="text-sm text-white mt-1 space-x-2 hidden sm:block">
          <span class="hover:underline cursor-pointer">canxi</span>
          <span class="hover:underline cursor-pointer">bổ não</span>
          <span class="hover:underline cursor-pointer">Vitamin</span>
          <span class="hover:underline cursor-pointer">sữa rửa mặt</span>
          <span class="hover:underline cursor-pointer">chăm sóc mẹ bé</span>
          <span class="hover:underline cursor-pointer">omega 3</span>
        </div>
      </div>

      <!-- Cart and Login -->
      <div class="flex items-center gap-4">
        <RouterLink
          to="/customer/cart"
          class="flex items-center gap-2 bg-green-900 px-4 py-2 rounded-md hover:bg-green-800"
        >
          <i class="fas fa-shopping-cart"></i> <span>Giỏ hàng</span>
        </RouterLink>
        <RouterLink
          to="/login"
          class="flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded-full hover:bg-gray-100"
        >
          <i class="fas fa-user"></i> <span>Đăng nhập</span>
        </RouterLink>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="bg-green-800 text-sm">
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
  </header>
</template>

<script setup>
</script>

<style scoped>
/* Optional: Load Font Awesome if you're using those icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>