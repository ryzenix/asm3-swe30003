<template>
  <div class="bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div class="space-y-1">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span class="w-1 h-8 md:h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded mr-4"></span>
              Quản lý nhân viên
            </h1>
            <p class="text-gray-600 ml-6">Tạo và quản lý tài khoản nhân viên</p>
          </div>
          <button 
            @click="showCreateForm = true"
            class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <i class="fas fa-plus group-hover:rotate-180 transition-transform duration-300"></i>
            <span>Thêm nhân viên mới</span>
          </button>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          
          <!-- Role Filter -->
          <div class="min-w-[200px]">
            <select 
              v-model="selectedRole"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Tất cả chức vụ</option>
              <option value="admin">Quản trị viên</option>
              <option value="pharmacist">Dược sĩ</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
          
          <!-- Status Filter -->
          <div class="min-w-[200px]">
            <select 
              v-model="selectedStatus"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm">
            <div class="col-span-3">Thông tin nhân viên</div>
            <div class="col-span-2">Chức vụ</div>
            <div class="col-span-2">Số điện thoại</div>
            <div class="col-span-2">Ngày tham gia</div>
            <div class="col-span-2">Trạng thái</div>
            <div class="col-span-1">Hành động</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-gray-100">
          <div 
            v-for="staff in filteredStaff" 
            :key="staff.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group"
          >
            <div class="grid grid-cols-12 gap-4 items-center">
              <!-- Staff Info -->
              <div class="col-span-3 flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-blue-700 font-semibold text-lg">{{ getInitials(staff.name) }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-medium text-gray-800 truncate">{{ staff.name }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ staff.email }}</p>
                </div>
              </div>
              
              <!-- Role -->
              <div class="col-span-2">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                  getRoleColor(staff.role)
                ]">
                  {{ getRoleText(staff.role) }}
                </span>
              </div>
              
              <!-- Phone -->
              <div class="col-span-2 text-sm text-gray-600">
                {{ staff.phone }}
              </div>
              
              <!-- Join Date -->
              <div class="col-span-2 text-sm text-gray-600">
                {{ formatDate(staff.joinDate) }}
              </div>
              
              <!-- Status -->
              <div class="col-span-2">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                  staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ staff.status === 'active' ? 'Hoạt động' : 'Tạm khóa' }}
                </span>
              </div>
              
              <!-- Actions -->
              <div class="col-span-1">
                <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    @click="editStaff(staff)"
                    class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <i class="fas fa-edit text-xs"></i>
                  </button>
                  <button 
                    @click="toggleStatus(staff)"
                    class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <i :class="staff.status === 'active' ? 'fas fa-lock' : 'fas fa-unlock'" class="text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Desktop -->
        <div v-if="filteredStaff.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-users text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Không tìm thấy nhân viên</h3>
          <p class="text-gray-500">Thử thay đổi bộ lọc hoặc thêm nhân viên mới</p>
        </div>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-4">
        <div 
          v-for="staff in filteredStaff" 
          :key="staff.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <!-- Staff Header -->
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-blue-700 font-semibold text-lg">{{ getInitials(staff.name) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-800">{{ staff.name }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ staff.email }}</p>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editStaff(staff)"
                class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <i class="fas fa-edit text-xs"></i>
              </button>
              <button 
                @click="toggleStatus(staff)"
                class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <i :class="staff.status === 'active' ? 'fas fa-lock' : 'fas fa-unlock'" class="text-xs"></i>
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
                staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]">
                {{ staff.status === 'active' ? 'Hoạt động' : 'Tạm khóa' }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Số điện thoại:</span>
              <span class="text-sm font-medium">{{ staff.phone }}</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Ngày tham gia:</span>
              <span class="text-sm font-medium">{{ formatDate(staff.joinDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State for Mobile -->
        <div v-if="filteredStaff.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-users text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Không tìm thấy nhân viên</h3>
          <p class="text-gray-500">Thử thay đổi bộ lọc hoặc thêm nhân viên mới</p>
        </div>
      </div>

      <!-- Create/Edit Staff Modal -->
      <Transition name="modal">
        <div v-if="showCreateForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 my-8" @click.stop>
            <!-- Modal Header -->
            <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
              <div class="flex items-center">
                <button
                  @click="closeModal"
                  class="mr-3 p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Đóng"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <div>
                  <h2 class="text-xl font-semibold flex items-center">
                    <i class="fas fa-user-plus mr-3"></i>
                    {{ editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới' }}
                  </h2>
                  <p class="text-sm text-white/80 mt-1">
                    {{ editingStaff ? 'Cập nhật thông tin nhân viên' : 'Tạo tài khoản cho nhân viên mới' }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Modal Body -->
            <form @submit.prevent="saveStaff" class="p-6 space-y-4">
              <!-- Name Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  required
                  placeholder="Nhập họ và tên đầy đủ"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <!-- Email Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  required
                  placeholder="example@pharmacy.com"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <!-- Phone Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="formData.phone"
                  type="tel" 
                  required
                  placeholder="0xxx xxx xxx"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <!-- Role Select -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ <span class="text-red-500">*</span>
                </label>
                <select 
                  v-model="formData.role"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="pharmacist">Dược sĩ</option>
                  <option value="staff">Nhân viên</option>
                </select>
              </div>
              
              <!-- Form Actions -->
              <div class="flex space-x-3 pt-4">
                <button 
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {{ editingStaff ? 'Cập nhật' : 'Tạo tài khoản' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Reactive data
const showCreateForm = ref(false)
const editingStaff = ref(null)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

// Sample staff data
const staffList = ref([
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@pharmacy.com',
    phone: '0123456789',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'binh.tran@pharmacy.com',
    phone: '0987654321',
    role: 'pharmacist',
    status: 'active',
    joinDate: '2024-02-20'
  },
  {
    id: 3,
    name: 'Lê Hoàng Cường',
    email: 'cuong.le@pharmacy.com',
    phone: '0369852147',
    role: 'staff',
    status: 'inactive',
    joinDate: '2024-03-10'
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    email: 'dung.pham@pharmacy.com',
    phone: '0741258963',
    role: 'pharmacist',
    status: 'active',
    joinDate: '2024-01-25'
  }
])

// Watch for modal state changes to control body scrolling
watch(showCreateForm, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Computed properties
const filteredStaff = computed(() => {
  let filtered = staffList.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(staff => 
      staff.name.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.phone.includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(staff => staff.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(staff => staff.status === selectedStatus.value)
  }

  return filtered
})

// Methods
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getRoleColor(role) {
  const colors = {
    admin: 'bg-purple-100 text-purple-700',
    pharmacist: 'bg-blue-100 text-blue-700',
    staff: 'bg-green-100 text-green-700'
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}

function getRoleText(role) {
  const roles = {
    admin: 'Quản trị viên',
    pharmacist: 'Dược sĩ',
    staff: 'Nhân viên'
  }
  return roles[role] || role
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

function editStaff(staff) {
  editingStaff.value = staff
  formData.value = { ...staff }
  showCreateForm.value = true
}

function toggleStatus(staff) {
  staff.status = staff.status === 'active' ? 'inactive' : 'active'
}

function saveStaff() {
  if (editingStaff.value) {
    // Update existing staff
    const index = staffList.value.findIndex(s => s.id === editingStaff.value.id)
    if (index !== -1) {
      staffList.value[index] = { ...formData.value, id: editingStaff.value.id }
    }
  } else {
    // Create new staff
    const newStaff = {
      ...formData.value,
      id: Date.now(),
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    }
    staffList.value.unshift(newStaff)
  }
  
  closeModal()
}

function closeModal() {
  showCreateForm.value = false
  editingStaff.value = null
  formData.value = {
    name: '',
    email: '',
    phone: '',
    role: ''
  }
  // Restore body scrolling
  document.body.style.overflow = ''
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>