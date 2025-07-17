<template>
  <footer class="bg-green-800 text-white py-6 mt-10 shadow-inner">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
      <!-- Branding -->
      <div class="mb-4 md:mb-0 text-center md:text-left">
        <strong class="text-lg tracking-wide">LONG CHAU Pharmacy</strong><br />
        <span class="text-xs text-green-200">Chất lượng cao - Niềm tin lớn</span>
      </div>

      <!-- Links -->
      <div class="flex flex-col md:flex-row md:space-x-6 text-center text-green-100">
        <span class="hover:underline cursor-pointer">Help & Support</span>
        <span class="hover:underline cursor-pointer">Settings</span>
        <span class="hover:underline cursor-pointer">My Profile</span>
      </div>

      <!-- Copyright -->
      <div class="mt-4 md:mt-0 text-center md:text-right text-green-300">
        &copy; {{ new Date().getFullYear() }} Long Chau. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
footer {
  font-family: 'Inter', sans-serif;
}
</style>