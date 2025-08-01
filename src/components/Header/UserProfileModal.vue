<template>
  <div class="bg-white rounded-xl shadow-xl p-6 relative min-w-80">
    <!-- ❌ Close Button -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
      aria-label="Close"
    >
      &times;
    </button>

    <!-- User Info Header -->
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ user.name }}</h2>
          <p class="text-sm text-gray-500">{{ roleDetails[user.role].label }}</p>
        </div>
      </div>
      
      <!-- User Details -->
      <div class="space-y-2 text-sm bg-gray-50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="text-gray-600">{{ user.email }}</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span class="text-gray-600">{{ user.phone }}</span>
        </div>
        <div v-if="user.gender" class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-gray-600">{{ getGenderText(user.gender) }}</span>
        </div>
        <div v-if="user.dateOfBirth" class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-gray-600">{{ formatDate(user.dateOfBirth) }}</span>
        </div>
      </div>
    </div>

    <!-- Menu Options -->
    <div class="space-y-2 mb-6">
      <!-- My Orders -->
      <button
        @click="handleViewOrders"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-all text-left"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <div>
          <div class="font-medium text-gray-800">Đơn hàng của tôi</div>
          <div class="text-xs text-gray-500">Xem lịch sử mua hàng</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Edit Profile -->
      <button
        @click="handleEditProfile"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-all text-left"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <div>
          <div class="font-medium text-gray-800">Chỉnh sửa thông tin</div>
          <div class="text-xs text-gray-500">Cập nhật thông tin cá nhân</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Address Book -->
      <button
        @click="handleAddressBook"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-all text-left"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <div class="font-medium text-gray-800">Sổ địa chỉ</div>
          <div class="text-xs text-gray-500">Quản lý địa chỉ giao hàng</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Favorites -->
      <button
        @click="handleFavorites"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-all text-left"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <div>
          <div class="font-medium text-gray-800">Sản phẩm yêu thích</div>
          <div class="text-xs text-gray-500">Danh sách sản phẩm đã lưu</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- User Management (Only for superuser) - Now as Router Link -->
      <router-link
        v-if="user.role === 'superuser'"
        to="/staff"
        @click="$emit('close')"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-all text-left"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <!-- <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg> -->
        <div>
          <div class="font-medium text-gray-800">Quản lý tài khoản</div>
          <div class="text-xs text-gray-500">Quản lý người dùng hệ thống</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>

      <!-- Product Management (Only for superuser) -->
      <router-link
        v-if="user.role === 'superuser'"
        to="/admin/products"
        @click="$emit('close')"
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-all text-left"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <div>
          <div class="font-medium text-gray-800">Quản lý sản phẩm</div>
          <div class="text-xs text-gray-500">Tạo, chỉnh sửa và quản lý sản phẩm</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>

    <hr class="border-gray-200 mb-4">

    <!-- Logout Button -->
    <button
      @click="handleLogout"
      class="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Đăng xuất</span>
    </button>
  </div>
</template>

<script setup>
// import { ref } from 'vue'

const roleDetails = {
  client: {
    label: 'Khách hàng',
    color: 'text-blue-600'
  },
  pharmacist: {
    label: 'Dược sĩ',
    color: 'text-green-600'
  },
  superuser: {
    label: 'Quản lý',
    color: 'text-red-600'
  }
}

// Define props to receive user data
const props = defineProps({
  user: {
    type: Object
  }
})

// Define emits (removed 'user-management' since we're using router-link now)
const emit = defineEmits(['close', 'logout', 'view-orders', 'edit-profile', 'address-book', 'favorites']);

// Event handlers
const handleLogout = () => {
  // Emit logout event to parent component
  
  emit('logout')
}

const handleViewOrders = () => {
  // Emit view orders event and close modal
  emit('view-orders')
  emit('close')
}

const handleEditProfile = () => {
  // Emit edit profile event and close modal
  emit('edit-profile')
  emit('close')
}

const handleAddressBook = () => {
  // Emit address book event and close modal
  emit('address-book')
  emit('close')
}

const handleFavorites = () => {
  // Emit favorites event and close modal
  emit('favorites')
  emit('close')
}

// Helper functions
const getGenderText = (gender) => {
  const genders = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác'
  }
  return genders[gender] || gender
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.warn('Invalid date format:', dateString)
    return 'N/A'
  }
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>