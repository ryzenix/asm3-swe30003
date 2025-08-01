<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
            <p class="text-gray-600">Tạo, chỉnh sửa và quản lý danh mục sản phẩm</p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="showCreateModal = true"
              class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm sản phẩm mới
            </button>
            <button 
              @click="exportProducts"
              class="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Xuất dữ liệu
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <select 
            v-model="categoryFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Tất cả danh mục</option>
            <option value="Người trưởng thành">Người trưởng thành</option>
            <option value="Trẻ em">Trẻ em</option>
            <option value="Người cao tuổi">Người cao tuổi</option>
            <option value="Khẩu trang y tế">Khẩu trang y tế</option>
          </select>
          <select 
            v-model="statusFilter"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Tạm ngưng</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>

        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SP</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="product in filteredProducts" 
                :key="product.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    v-model="selectedProducts"
                    :value="product.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      :src="product.image" 
                      :alt="product.title"
                      class="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      @error="handleImageError"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                      <div class="text-sm text-gray-500">{{ product.manufacturer }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.sku || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.price }}</div>
                  <div v-if="product.discount" class="text-xs text-red-600">
                    Giảm {{ product.discount }}%
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    <span :class="[
                      product.stockQuantity > 50 ? 'text-green-600' : 
                      product.stockQuantity > 10 ? 'text-yellow-600' : 'text-red-600'
                    ]">
                      {{ product.stockQuantity || 0 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    product.status === 'active' ? 'bg-green-100 text-green-800' : '',
                    product.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : '',
                    product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : ''
                  ]">
                    {{ getStatusText(product.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    <button 
                      @click="editProduct(product)"
                      class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteProduct(product)"
                      class="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button 
                      @click="toggleProductStatus(product)"
                      :class="[
                        'transition-colors duration-200',
                        product.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                      ]"
                    >
                      <svg v-if="product.status === 'active'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không có sản phẩm nào</h3>
          <p class="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo sản phẩm đầu tiên.</p>
          <div class="mt-6">
            <button 
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredProducts.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Hiển thị {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredProducts.length) }} 
            của {{ filteredProducts.length }} sản phẩm
          </div>
          <div class="flex gap-2">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span class="px-3 py-2 text-sm text-gray-700">
              Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Product Modal -->
    <CreateEditModal 
      v-if="showCreateModal"
      :product="editingProduct"
      @close="closeModal"
      @save="saveProduct"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteModal 
      v-if="showDeleteModal"
      :product="productToDelete"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <!-- Success Modal -->
    <SuccessModal 
      v-if="showSuccessModal"
      :message="successMessage"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import CreateEditModal from '../components/ProductManagement/CreateEditModal.vue'
import DeleteModal from '../components/ProductManagement/DeleteModal.vue'
import SuccessModal from '../components/ProductManagement/SuccessModal.vue'

// Reactive state
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectAll = ref(false)
const selectedProducts = ref([])

// Modal states
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)
const editingProduct = ref(null)
const productToDelete = ref(null)
const successMessage = ref('')

// Sample products data (in real app, this would come from API)
const products = ref([
  {
    id: 1,
    title: "Paracetamol 500mg giảm đau hạ sốt",
    sku: "PARA001",
    price: "45.000đ",
    priceValue: 45000,
    unit: "Hộp 20 viên",
    image: "/img/products/placeholder-product.jpg",
    category: "Người trưởng thành",
    manufacturer: "Traphaco",
    status: "active",
    discount: 10,
    stockQuantity: 150,
    expiryDate: "2024-12-31",
    requiresPrescription: false,
    description: "Thuốc giảm đau, hạ sốt hiệu quả cho người lớn",
    uses: "Giảm đau, hạ sốt, điều trị các triệu chứng cảm cúm",
    ingredients: ["Paracetamol 500mg", "Tá dược vừa đủ"],
    usageInstructions: ["Uống 1-2 viên mỗi lần", "Không quá 8 viên/ngày", "Uống sau khi ăn"]
  },
  {
    id: 2,
    title: "Vitamin D3 1000IU tăng cường miễn dịch",
    sku: "VITD002",
    price: "120.000đ",
    priceValue: 120000,
    unit: "Hộp 60 viên",
    image: "/img/products/placeholder-product.jpg",
    category: "Người trưởng thành",
    manufacturer: "Mega We Care",
    status: "active",
    stockQuantity: 200,
    expiryDate: "2025-06-30",
    requiresPrescription: false,
    description: "Vitamin D3 bổ sung canxi, tăng cường miễn dịch",
    uses: "Bổ sung vitamin D3, hỗ trợ hấp thu canxi, tăng cường miễn dịch",
    ingredients: ["Vitamin D3 1000IU", "Dầu đậu nành", "Gelatin"],
    usageInstructions: ["Uống 1 viên/ngày", "Uống trong bữa ăn", "Không dùng quá liều"]
  },
  {
    id: 3,
    title: "Siro ho cho trẻ em Natural Honey",
    sku: "SIRO003",
    price: "85.000đ",
    priceValue: 85000,
    unit: "Chai 100ml",
    image: "/img/products/placeholder-product.jpg",
    category: "Trẻ em",
    manufacturer: "Pharmacity",
    status: "inactive",
    stockQuantity: 75,
    expiryDate: "2024-10-15",
    requiresPrescription: false,
    description: "Siro ho tự nhiên cho trẻ em, an toàn và hiệu quả",
    uses: "Giảm ho, long đờm, làm dịu cổ họng cho trẻ em",
    ingredients: ["Mật ong tự nhiên", "Chiết xuất thảo dược", "Vitamin C"],
    usageInstructions: ["Uống 5-10ml/lần", "3-4 lần/ngày", "Lắc đều trước khi dùng"]
  },
  {
    id: 4,
    title: "Glucosamine 1500mg bảo vệ khớp",
    sku: "GLUC004",
    price: "450.000đ",
    priceValue: 450000,
    unit: "Hộp 90 viên",
    image: "/img/products/placeholder-product.jpg",
    category: "Người cao tuổi",
    manufacturer: "Traphaco",
    status: "out_of_stock",
    stockQuantity: 0,
    expiryDate: "2024-08-20",
    requiresPrescription: false,
    description: "Glucosamine hỗ trợ bảo vệ và tái tạo sụn khớp",
    uses: "Hỗ trợ điều trị viêm khớp, bảo vệ sụn khớp, giảm đau khớp",
    ingredients: ["Glucosamine 1500mg", "Chondroitin", "MSM"],
    usageInstructions: ["Uống 1 viên/lần", "2 lần/ngày", "Uống trong bữa ăn", "Kiên trì sử dụng"]
  },
  {
    id: 5,
    title: "Khẩu trang y tế màu đen Pharmacy",
    sku: "MASK005",
    price: "59.000đ",
    priceValue: 59000,
    unit: "Hộp 50 Cái",
    image: "/img/products/placeholder-product.jpg",
    category: "Khẩu trang y tế",
    manufacturer: "Pharmacy",
    status: "active",
    stockQuantity: 300,
    expiryDate: "2025-03-15",
    requiresPrescription: false,
    description: "Khẩu trang y tế 3 lớp, bảo vệ tối ưu",
    uses: "Bảo vệ đường hô hấp, ngăn ngừa bụi bẩn và vi khuẩn",
    ingredients: ["Vải không dệt", "Lớp lọc", "Dây thun"],
    usageInstructions: ["Đeo che kín mũi và miệng", "Thay mới sau 4-6 giờ", "Vứt bỏ đúng cách"]
  }
])

// Computed properties
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

// Methods
const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Đang bán'
    case 'inactive': return 'Tạm ngưng'
    case 'out_of_stock': return 'Hết hàng'
    default: return 'Không xác định'
  }
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}

const editProduct = (product) => {
  editingProduct.value = { ...product }
  showCreateModal.value = true
}

const deleteProduct = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const toggleProductStatus = (product) => {
  if (product.status === 'active') {
    product.status = 'inactive'
  } else {
    product.status = 'active'
  }
  showSuccessMessage(`Đã ${product.status === 'active' ? 'kích hoạt' : 'tạm ngưng'} sản phẩm "${product.title}"`)
}

const saveProduct = (productData) => {
  if (editingProduct.value) {
    // Update existing product
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...productData }
    }
    showSuccessMessage('Đã cập nhật sản phẩm thành công')
  } else {
    // Create new product
    const newProduct = {
      ...productData,
      id: Date.now(), // Simple ID generation
      status: 'active'
    }
    products.value.push(newProduct)
    showSuccessMessage('Đã tạo sản phẩm mới thành công')
  }
  closeModal()
}

const confirmDelete = () => {
  const index = products.value.findIndex(p => p.id === productToDelete.value.id)
  if (index !== -1) {
    products.value.splice(index, 1)
    showSuccessMessage('Đã xóa sản phẩm thành công')
  }
  showDeleteModal.value = false
  productToDelete.value = null
}

const closeModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
}

const showSuccessMessage = (message) => {
  successMessage.value = message
  showSuccessModal.value = true
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = filteredProducts.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportProducts = () => {
  // Implementation for exporting products
  console.log('Exporting products...')
  showSuccessMessage('Đã xuất dữ liệu sản phẩm thành công')
}
</script>

<style scoped>
/* Custom styles for the product management interface */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 