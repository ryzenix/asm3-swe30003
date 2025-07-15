<template>
  <footer class="bg-blue-800 text-white py-6 mt-10">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
      <div class="mb-4 md:mb-0 text-center md:text-left">
        <strong>Long Chau Pharmacy</strong><br />
        Serving health across Vietnam
      </div>
      <div class="flex flex-col md:flex-row md:space-x-6 text-center">
        <span class="hover:underline">Help & Support</span>
        <span class="hover:underline">Settings</span>
        <span class="hover:underline">My Profile</span>
      </div>
      <div class="mt-4 md:mt-0 text-center md:text-right">
        &copy; {{ new Date().getFullYear() }} Long Chau. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
</style>