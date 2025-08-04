<template>
  <!-- Desktop Table Row -->
  <div 
    v-if="!isMobile"
    class="hover:bg-gray-50 transition-colors duration-200 group"
  >
    <!-- Main Row -->
    <div class="px-6 py-4 cursor-pointer" @click="$emit('toggleExpand', staff.id)">
      <div class="grid grid-cols-12 gap-4 items-center">
        <!-- Staff Info -->
        <div class="col-span-4 flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-blue-700 font-semibold text-lg">{{ getInitials(staffName) }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-medium text-gray-800 truncate">{{ staffName }}</h3>
            <p class="text-sm text-gray-500 truncate">{{ staff.email }}</p>
          </div>
        </div>
        
        <!-- Role -->
        <div class="col-span-2">
          <span :class="[
            'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block',
            getRoleColor(staff.role)
          ]">
            {{ getRoleText(staff.role) }}
          </span>
        </div>
      
      <!-- Join Date -->
      <div class="col-span-2 text-sm text-gray-600">
        {{ formatDate(staffJoinDate) }}
      </div>
      
      <!-- Last Login -->
      <div class="col-span-2 text-sm text-gray-600">
        <div class="flex items-center space-x-1">
          <i class="fas fa-clock text-gray-400 text-xs flex-shrink-0"></i>
          <span class="truncate">{{ formatLastLogin(staff.lastLogin) }}</span>
        </div>
      </div>
      
      <!-- Status -->
      <div class="col-span-1">
        <span :class="[
          'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block',
          staffStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        ]">
          {{ staffStatus === 'active' ? 'Hoạt động' : 'Tạm khóa' }}
        </span>
      </div>
      
        <!-- Actions -->
        <div class="col-span-1">
          <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <!-- Expand/Collapse Button -->
            <button 
              @click.stop="$emit('toggleExpand', staff.id)"
              class="w-7 h-7 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              :title="isExpanded ? 'Thu gọn' : 'Xem thêm'"
            >
              <i :class="isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-xs"></i>
            </button>
            <button 
              v-if="staff.role === 'pharmacist'"
              @click.stop="$emit('edit', staff)"
              class="w-7 h-7 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              title="Chỉnh sửa"
            >
              <i class="fas fa-edit text-xs"></i>
            </button>
            <button 
              @click.stop="$emit('toggleStatus', staff)"
              class="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              :title="staffStatus === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'"
            >
              <i :class="staffStatus === 'active' ? 'fas fa-lock' : 'fas fa-unlock'" class="text-xs"></i>
            </button>
            <button 
              @click.stop="$emit('delete', staff)"
              class="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              title="Xóa nhân viên"
            >
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Expanded Content -->
    <div 
      v-if="isExpanded"
      class="px-6 pb-4 bg-gray-50 border-t border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <!-- Staff ID -->
        <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <span class="text-sm font-medium text-gray-600">Mã nhân viên:</span>
          <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
            #{{ String(staff.id).padStart(4, '0') }}
          </span>
        </div>

        <!-- Phone -->
        <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <span class="text-sm font-medium text-gray-600">Số điện thoại:</span>
          <span class="text-sm text-gray-800">{{ staff.phone }}</span>
        </div>

        <!-- Join Date -->
        <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <span class="text-sm font-medium text-gray-600">Ngày tham gia:</span>
          <span class="text-sm text-gray-800">{{ formatDate(staffJoinDate) }}</span>
        </div>

        <!-- Last Login -->
        <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <span class="text-sm font-medium text-gray-600">Lần đăng nhập cuối:</span>
          <span class="text-sm text-gray-800">{{ formatLastLogin(staff.lastLogin) }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Card View -->
  <div 
    v-else
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
  >
    <!-- Staff Header -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-blue-700 font-semibold text-lg">{{ getInitials(staffName) }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-medium text-gray-800">{{ staffName }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ staff.email }}</p>
      </div>
      <div class="flex space-x-2">
        <button 
          v-if="staff.role === 'pharmacist'"
          @click="$emit('edit', staff)"
          class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
          title="Chỉnh sửa"
        >
          <i class="fas fa-edit text-xs"></i>
        </button>
        <button 
          @click="$emit('toggleStatus', staff)"
          class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
          :title="staffStatus === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'"
        >
          <i :class="staffStatus === 'active' ? 'fas fa-lock' : 'fas fa-unlock'" class="text-xs"></i>
        </button>
        <button 
          @click="$emit('delete', staff)"
          class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
          title="Xóa nhân viên"
        >
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Staff Details -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Chức vụ:</span>
        <span :class="[
          'px-3 py-1 rounded-full text-xs font-semibold',
          getRoleColor(staff.role)
        ]">
          {{ getRoleText(staff.role) }}
        </span>
      </div>
      
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Trạng thái:</span>
        <span :class="[
          'px-3 py-1 rounded-full text-xs font-semibold',
          staffStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        ]">
          {{ staffStatus === 'active' ? 'Hoạt động' : 'Tạm khóa' }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Số điện thoại:</span>
        <span class="text-sm font-medium">{{ staff.phone }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Ngày tham gia:</span>
        <span class="text-sm font-medium">{{ formatDate(staffJoinDate) }}</span>
      </div>

      <!-- Last Login (API data) -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Đăng nhập cuối:</span>
        <span class="text-sm font-medium">{{ formatLastLogin(staff.lastLogin) }}</span>
      </div>

      <!-- Additional custom fields slot -->
      <slot name="additional-fields" :staff="staff"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

// Props
const props = defineProps({
  staff: {
    type: Object,
    required: true,
    validator: (staff) => {
      return staff && 
             typeof staff.id !== 'undefined' &&
             (typeof staff.name === 'string' || typeof staff.fullName === 'string') &&
             typeof staff.email === 'string' &&
             typeof staff.phone === 'string' &&
             typeof staff.role === 'string' &&
             (typeof staff.status === 'string' || typeof staff.isActive === 'boolean')
    }
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['edit', 'toggleStatus', 'delete', 'toggleExpand'])

// Computed properties for backward compatibility
const staffName = computed(() => {
  return props.staff.fullName || props.staff.name || 'Unknown'
})

const staffStatus = computed(() => {
  // Handle both string status and boolean isActive
  if (typeof props.staff.status === 'string') {
    return props.staff.status
  }
  if (typeof props.staff.isActive === 'boolean') {
    return props.staff.isActive ? 'active' : 'inactive'
  }
  return 'inactive'
})

const staffJoinDate = computed(() => {
  return props.staff.joinDate || props.staff.createdAt || new Date().toISOString()
})

// Methods
function getInitials(name) {
  if (!name) return '??'
  return name.split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getRoleColor(role) {
  const colors = {
    superuser: 'bg-purple-100 text-purple-700',
    pharmacist: 'bg-blue-100 text-blue-700',
    client: 'bg-green-100 text-green-700'
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}

function getRoleText(role) {
  const roles = {
    superuser: 'Quản trị viên',
    pharmacist: 'Dược sĩ',
    client: 'Khách hàng'
  }
  return roles[role] || role
}

function formatDate(dateString) {
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

function formatLastLogin(lastLogin) {
  if (!lastLogin) return 'Chưa đăng nhập'
  
  try {
    const date = new Date(lastLogin)
    if (isNaN(date.getTime())) return 'Chưa đăng nhập'
    
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInHours < 1) {
      return 'Vừa xong'
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`
    } else {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  } catch (error) {
    console.warn('Invalid last login format:', lastLogin)
    return 'Chưa đăng nhập'
  }
}
</script>