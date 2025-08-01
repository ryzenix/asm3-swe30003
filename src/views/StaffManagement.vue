<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <header class="mb-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
              <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
              Quản lý nhân viên
            </h1>
            <p class="text-gray-600 ml-6 text-lg">Tạo và quản lý tài khoản nhân viên trong hệ thống</p>
          </div>
          
          <button 
            @click="openCreateModal"
            class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <i class="fas fa-user-plus group-hover:rotate-12 transition-transform duration-300"></i>
            <span>Thêm nhân viên mới</span>
          </button>
        </div>
      </header>

      <!-- Search and Filters -->
      <section class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search Bar -->
          <div class="lg:col-span-2 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input 
              v-model="filters.search"
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm kiếm theo tên, email..."
              class="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500"
            />
          </div>
          
          <!-- Role Filter -->
          <div class="relative">
            <select 
              v-model="filters.role"
              @change="fetchUsers"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả chức vụ</option>
              <option value="client">Khách hàng</option>
              <option value="staff">Dược sĩ/Nhân viên bán hàng</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
          
          <!-- Status Filter -->
          <div class="relative">
            <select 
              v-model="filters.status"
              @change="fetchUsers"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Tạm dừng</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ apiData.pagination?.totalRecords || 0 }}</div>
            <div class="text-sm text-gray-600">Tổng nhân viên</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ activeStaff }}</div>
            <div class="text-sm text-gray-600">Đang hoạt động</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ adminCount }}</div>
            <div class="text-sm text-gray-600">Quản trị viên</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ pharmacistCount }}</div>
            <div class="text-sm text-gray-600">Dược sĩ</div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchUsers"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Staff List -->
      <section v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Desktop Table Header -->
        <div class="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
            <div class="col-span-3">Thông tin cá nhân</div>
            <div class="col-span-1">Chức vụ</div>
            <div class="col-span-2">Liên hệ</div>
            <div class="col-span-2">Ngày tham gia</div>
            <div class="col-span-2">Lần đăng nhập cuối</div>
            <div class="col-span-1">Trạng thái</div>
            <div class="col-span-1 text-center">Thao tác</div>
          </div>
        </div>

        <!-- Staff List Content -->
        <div v-if="staffList.length > 0">
          <!-- Desktop Table Rows -->
          <div class="hidden lg:block divide-y divide-gray-100">
            <StaffCard 
              v-for="staff in staffList" 
              :key="`desktop-${staff.id}`"
              :staff="staff"
              :is-mobile="false"
              @edit="openEditModal"
              @toggle-status="handleToggleStatus"
              @delete="confirmDelete"
            />
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden space-y-4 p-4">
            <StaffCard 
              v-for="staff in staffList" 
              :key="`mobile-${staff.id}`"
              :staff="staff"
              :is-mobile="true"
              @edit="openEditModal"
              @toggle-status="handleToggleStatus"
              @delete="confirmDelete"
            >
              <template #additional-fields="{ staff }">
                <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span class="text-sm text-gray-600">Mã nhân viên:</span>
                  <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">#{{ String(staff.id).padStart(4, '0') }}</span>
                </div>
              </template>
            </StaffCard>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-users text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Không tìm thấy nhân viên</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            {{ hasActiveFilters ? 'Thử điều chỉnh bộ lọc để hiển thị kết quả phù hợp hơn' : 'Hãy thêm nhân viên đầu tiên vào hệ thống' }}
          </p>
          <button 
            v-if="!hasActiveFilters"
            @click="openCreateModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-plus mr-2"></i>
            Thêm nhân viên đầu tiên
          </button>
          <button 
            v-else
            @click="clearFilters"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-filter mr-2"></i>
            Xóa bộ lọc
          </button>
        </div>

        <!-- Pagination Section -->
        <div v-if="apiData.pagination && apiData.pagination.totalRecords > 0" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <!-- Items per page selector -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600">Hiển thị:</span>
              <select 
                v-model="pagination.limit"
                @change="changePage(1)"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span class="text-sm text-gray-600">nhân viên/trang</span>
            </div>

            <!-- Pagination info and controls -->
            <div class="flex items-center space-x-4">
              <!-- Page info -->
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ startIndex + 1 }}</span>
                -
                <span class="font-medium">{{ Math.min(endIndex, apiData.pagination.totalRecords) }}</span>
                trong
                <span class="font-medium">{{ apiData.pagination.totalRecords }}</span>
                kết quả
              </div>

              <!-- Pagination controls -->
              <div class="flex items-center space-x-1">
                <!-- First page -->
                <button 
                  @click="changePage(1)"
                  :disabled="pagination.page === 1"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang đầu"
                >
                  <i class="fas fa-angle-double-left"></i>
                </button>

                <!-- Previous page -->
                <button 
                  @click="changePage(pagination.page - 1)"
                  :disabled="!apiData.pagination.hasPrevPage"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang trước"
                >
                  <i class="fas fa-angle-left"></i>
                </button>

                <!-- Page numbers -->
                <template v-for="page in visiblePages" :key="page">
                  <button 
                    v-if="page !== '...'"
                    @click="changePage(page)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200',
                      page === pagination.page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'border border-gray-200 hover:bg-gray-100'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                </template>

                <!-- Next page -->
                <button 
                  @click="changePage(pagination.page + 1)"
                  :disabled="!apiData.pagination.hasNextPage"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang sau"
                >
                  <i class="fas fa-angle-right"></i>
                </button>

                <!-- Last page -->
                <button 
                  @click="changePage(apiData.pagination.totalPages)"
                  :disabled="pagination.page === apiData.pagination.totalPages"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang cuối"
                >
                  <i class="fas fa-angle-double-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

        <!-- Create/Edit Modal -->
    <CreateEditModal
      :show="showModal"
      :is-editing="isEditing"
      :form="form"
      :form-validation="formValidation"
      :form-error="formError"
      :field-errors="fieldErrors"
      :saving="saving"
      :is-form-valid="isFormValid"
      :has-changes="hasChanges()"
      @close="closeModal"
      @save="saveStaff"
      @validate-field="validateField"
      @clear-field-error="clearFieldError"
      @clear-errors="clearErrors"
    />

    <!-- Success Modal -->
    <SuccessModal
      :show="showSuccessModal"
      :created-staff="createdStaff"
      @close="closeSuccessModal"
      @copy-to-clipboard="copyToClipboard"
    />

    <!-- Delete Modal -->
    <DeleteModal
      :show="showDeleteModal"
      :staff-to-delete="staffToDelete"
      @close="closeDeleteModal"
      @confirm="deleteStaff"
    />

    <!-- Lock Modal -->
    <LockModal
      :show="showLockModal"
      :staff="staffToLock"
      :is-locking="staffToLock?.isActive"
      @close="closeLockModal"
      @confirm="confirmToggleStatus"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import StaffCard from '../components/StaffManagement/StaffCard.vue'
import CreateEditModal from '../components/StaffManagement/CreateEditModal.vue'
import SuccessModal from '../components/StaffManagement/SuccessModal.vue'
import DeleteModal from '../components/StaffManagement/DeleteModal.vue'
import LockModal from '../components/StaffManagement/LockModal.vue'

// ===== REACTIVE STATE =====
const showModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const showLockModal = ref(false)
const editingStaff = ref(null)
const staffToDelete = ref(null)
const staffToLock = ref(null)
const createdStaff = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Form error handling
const formError = ref('')
const fieldErrors = ref([])

// API Data
const staffList = ref([])
const apiData = ref({
  pagination: null,
  filters: {}
})

// Filters
const filters = ref({
  search: '',
  role: '',
  status: ''
})

// Pagination
const pagination = ref({
  page: 1,
  limit: 10
})

// Form data
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  role: '',
  isActive: true
})

// Form validation
const formValidation = ref({
  fullName: { isValid: true, error: '' },
  email: { isValid: true, error: '' },
  phone: { isValid: true, error: '' }
})

// Debounce timer for search
let searchTimeout = null

// ===== VALIDATION FUNCTIONS =====
function validateField(fieldName) {
  switch (fieldName) {
    case 'fullName':
      const fullName = form.value.fullName.trim()
      if (!fullName) {
        formValidation.value.fullName = { isValid: false, error: 'Họ và tên không được để trống' }
      } else if (fullName.length < 2) {
        formValidation.value.fullName = { isValid: false, error: 'Họ và tên phải có ít nhất 2 ký tự' }
      } else if (fullName.length > 100) {
        formValidation.value.fullName = { isValid: false, error: 'Họ và tên không được vượt quá 100 ký tự' }
      } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
        formValidation.value.fullName = { isValid: false, error: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng' }
      } else {
        formValidation.value.fullName = { isValid: true, error: '' }
      }
      break

    case 'email':
      const email = form.value.email.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email) {
        formValidation.value.email = { isValid: false, error: 'Email không được để trống' }
      } else if (!emailRegex.test(email)) {
        formValidation.value.email = { isValid: false, error: 'Định dạng email không hợp lệ' }
      } else if (email.length > 255) {
        formValidation.value.email = { isValid: false, error: 'Email không được vượt quá 255 ký tự' }
      } else {
        formValidation.value.email = { isValid: true, error: '' }
      }
      break

    case 'phone':
      const phone = form.value.phone.trim()
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]\d{8}$/
      if (!phone) {
        formValidation.value.phone = { isValid: false, error: 'Số điện thoại không được để trống' }
      } else if (!phoneRegex.test(phone)) {
        formValidation.value.phone = { isValid: false, error: 'Định dạng số điện thoại không hợp lệ (ví dụ: 0901234567)' }
      } else {
        formValidation.value.phone = { isValid: true, error: '' }
      }
      break
  }
}

function validateAllFields() {
  validateField('fullName')
  validateField('email')
  validateField('phone')
  
  return formValidation.value.fullName.isValid &&
         formValidation.value.email.isValid &&
         formValidation.value.phone.isValid
}

function hasChanges() {
  if (!isEditing.value || !editingStaff.value) return true
  
  return form.value.fullName.trim() !== editingStaff.value.fullName ||
         form.value.email.trim() !== editingStaff.value.email ||
         form.value.phone.trim() !== editingStaff.value.phone ||
         form.value.isActive !== editingStaff.value.isActive
}

function clearFieldError(fieldName) {
  if (!formValidation.value[fieldName].isValid) {
    formValidation.value[fieldName] = { isValid: true, error: '' }
  }
}

function clearErrors() {
  formError.value = ''
  fieldErrors.value = []
  formValidation.value = {
    fullName: { isValid: true, error: '' },
    email: { isValid: true, error: '' },
    phone: { isValid: true, error: '' }
  }
}

// ===== COMPUTED PROPERTIES =====
const isEditing = computed(() => !!editingStaff.value)

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.role || filters.value.status
})

const isFormValid = computed(() => {
  const hasRequiredFields = form.value.fullName.trim() && 
                           form.value.email.trim() && 
                           form.value.phone.trim()
  
  const isValid = formValidation.value.fullName.isValid &&
                  formValidation.value.email.isValid &&
                  formValidation.value.phone.isValid
  
  // For edit mode, also check if there are changes
  if (isEditing.value) {
    return hasRequiredFields && isValid && hasChanges()
  }
  
  return hasRequiredFields && isValid
})

// Pagination computed properties
const startIndex = computed(() => {
  if (!apiData.value.pagination) return 0
  return (apiData.value.pagination.currentPage - 1) * apiData.value.pagination.limit
})

const endIndex = computed(() => {
  if (!apiData.value.pagination) return 0
  return startIndex.value + apiData.value.pagination.limit
})

const visiblePages = computed(() => {
  if (!apiData.value.pagination) return []
  
  const current = apiData.value.pagination.currentPage
  const total = apiData.value.pagination.totalPages
  const delta = 2
  
  let range = []
  let rangeWithDots = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }
  
  rangeWithDots.push(...range)
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }
  
  return [...new Set(rangeWithDots)].filter((page, index, arr) => {
    if (page === 1 && arr.indexOf(1) !== index) return false
    if (page === total && arr.indexOf(total) !== index) return false
    return true
  })
})

// Statistics - computed from current staff list
const activeStaff = computed(() => staffList.value.filter(s => s.isActive).length)
const adminCount = computed(() => staffList.value.filter(s => s.role === 'admin').length)
const pharmacistCount = computed(() => staffList.value.filter(s => s.role === 'pharmacist').length)

// ===== API METHODS =====
async function fetchUsers() {
  loading.value = true
  error.value = ''
  
  try {
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })

    if (filters.value.search.trim()) {
      params.append('search', filters.value.search.trim())
    }
    
    if (filters.value.role) {
      params.append('role', filters.value.role)
    }
    
    if (filters.value.status) {
      params.append('is_active', filters.value.status)
    }

    const response = await fetch(`http://localhost:3000/management/users/list?${params}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.success) {
      // Transform API data to match component format
      staffList.value = data.data.users.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        // For compatibility with existing UI
        status: user.isActive ? 'active' : 'inactive',
        joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : null
      }))
      
      apiData.value = {
        pagination: data.data.pagination,
        filters: data.data.filters
      }
    } else {
      throw new Error(data.error || 'Failed to fetch users')
    }
  } catch (err) {
    console.error('Fetch users error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải danh sách nhân viên'
    staffList.value = []
    apiData.value = { pagination: null, filters: {} }
  } finally {
    loading.value = false
  }
}

// Debounced search function
function debouncedSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1 // Reset to first page when searching
    fetchUsers()
  }, 500) // 500ms delay
}

// ===== WATCHERS =====
watch([showModal, showDeleteModal, showSuccessModal, showLockModal], ([modal, deleteModal, successModal, lockModal]) => {
  if (modal || deleteModal || successModal || lockModal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Watch pagination limit changes
watch(() => pagination.value.limit, () => {
  pagination.value.page = 1
  fetchUsers()
})

// ===== METHODS =====
function changePage(page) {
  if (page >= 1 && page <= (apiData.value.pagination?.totalPages || 1)) {
    pagination.value.page = page
    fetchUsers()
  }
}

function openCreateModal() {
  editingStaff.value = null
  resetForm()
  clearErrors()
  showModal.value = true
}

function openEditModal(staff) {
  editingStaff.value = staff
  form.value = {
    fullName: staff.fullName,
    email: staff.email,
    phone: staff.phone,
    role: staff.role,
    isActive: staff.isActive
  }
  clearErrors()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingStaff.value = null
  resetForm()
  clearErrors()
}

function resetForm() {
  form.value = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    isActive: true
  }
}

async function saveStaff() {
  // Clear previous errors
  clearErrors()
  
  // Check if there are changes in edit mode
  if (isEditing.value && !hasChanges()) {
    formError.value = 'Không có thay đổi nào để cập nhật'
    return
  }
  
  // Validate all fields
  if (!validateAllFields()) {
    formError.value = 'Vui lòng kiểm tra lại thông tin đã nhập'
    const errors = []
    if (!formValidation.value.fullName.isValid) errors.push(formValidation.value.fullName.error)
    if (!formValidation.value.email.isValid) errors.push(formValidation.value.email.error)
    if (!formValidation.value.phone.isValid) errors.push(formValidation.value.phone.error)
    fieldErrors.value = errors
    return
  }
  
  saving.value = true
  try {
    if (isEditing.value) {
      // Update existing staff user
      const response = await fetch(`http://localhost:3000/management/users/modify/${editingStaff.value.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: form.value.email.trim(),
          fullName: form.value.fullName.trim(),
          phone: form.value.phone.trim(),
          isActive: form.value.isActive
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Handle different types of errors from server
        if (data.error) {
          if (data.error.includes('Email is already taken by another user') || data.error.includes('email already exists')) {
            formError.value = 'Email này đã được sử dụng cho tài khoản khác'
            formValidation.value.email = { isValid: false, error: 'Email đã tồn tại trong hệ thống' }
          } else if (data.error.includes('Invalid email address format')) {
            formError.value = 'Định dạng email không hợp lệ'
            formValidation.value.email = { isValid: false, error: 'Định dạng email không hợp lệ' }
          } else if (data.error.includes('Invalid phone number format')) {
            formError.value = 'Định dạng số điện thoại không hợp lệ'
            formValidation.value.phone = { isValid: false, error: 'Định dạng số điện thoại không hợp lệ' }
          } else if (data.error.includes('Staff user not found')) {
            formError.value = 'Không tìm thấy thông tin nhân viên'
          } else if (data.error.includes('At least one field must be provided')) {
            formError.value = 'Vui lòng cập nhật ít nhất một thông tin'
          } else {
            formError.value = data.error
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return
      }
      
      if (data.success) {
        // Show success message for update
        showToast('Cập nhật thông tin nhân viên thành công!', 'success')
        closeModal()
        await fetchUsers()
      } else {
        throw new Error(data.error || 'Failed to update staff')
      }
    } else {
      // Create new staff user
      const response = await fetch('http://localhost:3000/management/users/create-staff', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: form.value.email.trim(),
          fullName: form.value.fullName.trim(),
          phone: form.value.phone.trim(),
          role: 'pharmacist'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Handle different types of errors from server
        if (data.error) {
          if (data.error.includes('email already exists') || data.error.includes('An account with this email already exists')) {
            formError.value = 'Email này đã được sử dụng cho tài khoản khác'
            formValidation.value.email = { isValid: false, error: 'Email đã tồn tại trong hệ thống' }
          } else if (data.error.includes('Invalid email address format')) {
            formError.value = 'Định dạng email không hợp lệ'
            formValidation.value.email = { isValid: false, error: 'Định dạng email không hợp lệ' }
          } else if (data.error.includes('Invalid phone number format')) {
            formError.value = 'Định dạng số điện thoại không hợp lệ'
            formValidation.value.phone = { isValid: false, error: 'Định dạng số điện thoại không hợp lệ' }
          } else if (data.missingFields && data.missingFields.length > 0) {
            formError.value = 'Thiếu thông tin bắt buộc'
            fieldErrors.value = data.missingFields.map(field => {
              switch (field) {
                case 'email': return 'Email là thông tin bắt buộc'
                case 'fullName': return 'Họ và tên là thông tin bắt buộc'
                case 'phone': return 'Số điện thoại là thông tin bắt buộc'
                default: return `Thiếu thông tin: ${field}`
              }
            })
          } else {
            formError.value = data.error
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return
      }
      
      if (data.success) {
        // Store the created staff data for success modal
        createdStaff.value = {
          id: data.data.user.id,
          fullName: data.data.user.fullName,
          email: data.data.user.email,
          phone: data.data.user.phone,
          role: data.data.user.role,
          isActive: data.data.user.isActive,
          temporaryPassword: data.data.temporaryPassword
        }
        
        // Show success modal
        showSuccessModal.value = true
        
        // Refresh the list
        await fetchUsers()
      } else {
        throw new Error(data.error || 'Failed to create staff')
      }
    }
  } catch (err) {
    console.error('Save staff error:', err)
    formError.value = err.message || `Có lỗi xảy ra khi ${isEditing.value ? 'cập nhật' : 'tạo'} tài khoản nhân viên. Vui lòng thử lại.`
  } finally {
    saving.value = false
  }
}

function handleToggleStatus(staff) {
  staffToLock.value = staff
  showLockModal.value = true
}

async function confirmToggleStatus() {
  if (!staffToLock.value) return
  
  try {
    const response = await fetch(`http://localhost:3000/management/users/modify/${staffToLock.value.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isActive: !staffToLock.value.isActive
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      if (data.error) {
        if (data.error.includes('Staff user not found')) {
          showToast('Không tìm thấy thông tin nhân viên', 'error')
        } else if (data.error.includes('At least one field must be provided')) {
          showToast('Không có thay đổi nào để cập nhật', 'error')
        } else {
          showToast(data.error, 'error')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return
    }
    
    if (data.success) {
      // Show success message
      showToast(
        `Đã ${staffToLock.value.isActive ? 'khóa' : 'mở khóa'} tài khoản của ${staffToLock.value.fullName} thành công!`, 
        'success'
      )
      
      // Refresh the list after status change
      await fetchUsers()
    } else {
      throw new Error(data.error || 'Failed to toggle user status')
    }
  } catch (error) {
    console.error('Toggle status error:', error)
    showToast('Có lỗi xảy ra khi thay đổi trạng thái tài khoản', 'error')
  } finally {
    closeLockModal()
  }
}

function confirmDelete(staff) {
  staffToDelete.value = staff
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  staffToDelete.value = null
}

function closeLockModal() {
  showLockModal.value = false
  staffToLock.value = null
}

function closeSuccessModal() {
  showSuccessModal.value = false
  createdStaff.value = null
  closeModal() // Close the create modal as well
}

async function deleteStaff() {
  if (!staffToDelete.value) return
  
  try {
    let response = await fetch(`http://localhost:3000/management/users/delete/${staffToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      if (data.error) {
        if (data.error.includes('User not found')) {
          showToast('Không tìm thấy thông tin nhân viên', 'error')
        } else if (data.error.includes('Missing parameter')) {
          showToast('Không có thay đổi nào để cập nhật', 'error')
        } else if (data.error.includes('Cannot delete')) {
          showToast('Không thể xóa nhân viên này', 'error')
        } else {
          showToast(data.error, 'error')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return
    }
    
    if (data.success) {
      // Show success message
      showToast(
        `Đã xóa nhân viên ${staffToDelete.value.fullName} thành công!`, 
        'success'
      )
      
      // Refresh the list after deletion
      await fetchUsers()
    } else {
      throw new Error(data.error || 'Failed to delete user')
    }
  } catch (error) {
    console.error('Delete user error:', error)
    showToast('Có lỗi xảy ra khi xóa nhân viên', 'error')
  } finally {
    closeDeleteModal()
  }
}

function clearFilters() {
  filters.value = {
    search: '',
    role: '',
    status: ''
  }
  pagination.value.page = 1
  fetchUsers()
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Đã sao chép vào bảng nhớ!', 'success')
  }).catch(err => {
    console.error('Không thể sao chép vào bảng nhớ:', err)
    showToast('Không thể sao chép vào bảng nhớ', 'error')
  })
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  const icon = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle'
  
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 transform transition-all duration-300 flex items-center space-x-3`
  toast.innerHTML = `
    <i class="${icon}"></i>
    <span>${message}</span>
  `
  
  document.body.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 100)
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

// ===== LIFECYCLE =====
onMounted(() => {
  fetchUsers()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  // Reset modal states
  showModal.value = false
  showDeleteModal.value = false
  showSuccessModal.value = false
  showLockModal.value = false
})
</script>

<style scoped>
/* Transition styles for create/edit modal fade-in and fade-out */
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
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}

/* Custom scrollbar for modal body */
.max-h-\[70vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[70vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>