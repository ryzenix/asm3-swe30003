<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <header class="mb-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
              <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
              Quản lý sản phẩm
            </h1>
            <p class="text-gray-600 ml-6 text-lg">Tạo, chỉnh sửa và quản lý sản phẩm theo đối tượng sử dụng</p>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="showCreateModal = true"
              class="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <i class="fas fa-plus group-hover:rotate-12 transition-transform duration-300"></i>
              <span>Thêm sản phẩm mới</span>
            </button>
            <button 
              @click="exportProducts"
              class="group bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <i class="fas fa-download group-hover:rotate-12 transition-transform duration-300"></i>
              <span>Xuất dữ liệu</span>
            </button>
          </div>
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
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500"
            />
          </div>
          
          <!-- Category Filter -->
          <div class="relative">
            <select 
              v-model="categoryFilter"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              <option v-for="category in mainCategoryOptions" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
            </div>
          </div>
          
          <!-- Status Filter -->
          <div class="relative">
            <select 
              v-model="statusFilter"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Tạm ngưng</option>
              <option value="out_of_stock">Hết hàng</option>
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
            <div class="text-sm text-gray-600">Tổng sản phẩm</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ activeProducts }}</div>
            <div class="text-sm text-gray-600">Đang bán</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ inactiveProducts }}</div>
            <div class="text-sm text-gray-600">Tạm ngưng</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ outOfStockProducts }}</div>
            <div class="text-sm text-gray-600">Hết hàng</div>
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
            @click="fetchProducts"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-redo mr-2"></i>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <section v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Desktop Table Header -->
        <div class="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
            <div class="col-span-1">
              <input 
                type="checkbox" 
                v-model="selectAll"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div class="col-span-4">Sản phẩm</div>
            <div class="col-span-2">Danh mục</div>
            <div class="col-span-2">Giá</div>
            <div class="col-span-1">Tồn kho</div>
            <div class="col-span-1">Trạng thái</div>
            <div class="col-span-1 text-center">Thao tác</div>
          </div>
        </div>

        <!-- Products List Content -->
        <div v-if="filteredProducts.length > 0">
          <!-- Desktop Table Rows -->
          <div class="hidden lg:block divide-y divide-gray-50">
            <div 
              v-for="product in filteredProducts" 
              :key="`desktop-${product.id}`"
              class="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm hover:border-l-4 hover:border-blue-400 transition-all duration-300"
            >
              <!-- Main Row -->
              <div class="px-6 py-5 cursor-pointer" @click="toggleRowExpansion(product.id)">
                <div class="grid grid-cols-12 gap-6 items-center">
                  <!-- Checkbox -->
                  <div class="col-span-1">
                    <div class="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        v-model="selectedProducts"
                        :value="product.id"
                        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                        @click.stop
                      />
                      <button 
                        @click.stop="toggleRowExpansion(product.id)"
                        class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        :title="expandedRows.has(product.id) ? 'Thu gọn' : 'Mở rộng'"
                      >
                        <i :class="[
                          'fas text-xs transition-transform duration-200',
                          expandedRows.has(product.id) ? 'fa-chevron-down rotate-180' : 'fa-chevron-down'
                        ]"></i>
                      </button>
                    </div>
                  </div>
                  <!-- Product Info -->
                  <div class="col-span-4">
                    <div class="flex items-center space-x-4">
                      <div class="relative flex-shrink-0">
                        <img 
                          :src="getProductImage(product)" 
                          :alt="product.title"
                          class="w-14 h-14 rounded-xl object-cover border-2 border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 bg-gray-100"
                          @error="handleImageError"
                          loading="lazy"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2">
                          <h3 class="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-900 transition-colors duration-200">
                            {{ product.title }}
                          </h3>
                          <div v-if="product.stockQuantity === 0" class="flex-shrink-0">
                            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <i class="fas fa-exclamation-triangle mr-1"></i>
                              Hết hàng
                            </span>
                          </div>
                        </div>
                        <p class="text-sm text-gray-600 truncate">
                          <i class="fas fa-industry mr-1 text-gray-400"></i>
                          {{ product.manufacturer }}
                        </p>
                        <p v-if="product.origin" class="text-xs text-gray-500 truncate">
                          <i class="fas fa-globe mr-1 text-gray-400"></i>
                          {{ product.origin }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- Category -->
                  <div class="col-span-2">
                    <div class="space-y-1">
                      <span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                        <i class="fas fa-tag mr-1"></i>
                        {{ getCategoryDisplayName(product.category) }}
                      </span>
                      <div v-if="product.subcategory" class="text-xs text-gray-600 ml-1">
                        <i class="fas fa-arrow-right mr-1 text-gray-400"></i>
                        {{ getSubcategoryDisplayName(product.subcategory) }}
                      </div>
                    </div>
                  </div>
                  <!-- Price -->
                  <div class="col-span-2">
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-bold text-gray-900">
                          {{ formatPrice(product.priceValue || product.price) }}
                        </span>
                        <i class="fas fa-coins text-yellow-500"></i>
                      </div>
                      <div v-if="product.discount" class="flex items-center space-x-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <i class="fas fa-percentage mr-1"></i>
                          -{{ product.discount }}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Stock -->
                  <div class="col-span-1">
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center space-x-1">
                        <i class="fas fa-boxes text-gray-400"></i>
                        <span :class="[
                          'text-sm font-semibold',
                          product.stockQuantity > 50 ? 'text-green-600' : 
                          product.stockQuantity > 10 ? 'text-yellow-600' : 'text-red-600'
                        ]">
                          {{ product.stockQuantity || 0 }}
                        </span>
                      </div>
                      <div :class="[
                        'w-2 h-2 rounded-full',
                        product.stockQuantity > 50 ? 'bg-green-400' : 
                        product.stockQuantity > 10 ? 'bg-yellow-400' : 'bg-red-400'
                      ]"></div>
                    </div>
                  </div>
                  <!-- Status -->
                  <div class="col-span-1">
                    <div class="flex flex-col items-start space-y-1">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border',
                        product.status === 'active' ? 'bg-green-50 text-green-800 border-green-200' : '',
                        product.status === 'inactive' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : '',
                        product.status === 'out_of_stock' ? 'bg-red-50 text-red-800 border-red-200' : ''
                      ]">
                        <div :class="[
                          'w-1.5 h-1.5 rounded-full mr-1.5',
                          product.status === 'active' ? 'bg-green-400' : '',
                          product.status === 'inactive' ? 'bg-yellow-400' : '',
                          product.status === 'out_of_stock' ? 'bg-red-400' : ''
                        ]"></div>
                        {{ getStatusText(product.status) }}
                      </span>
                    </div>
                  </div>
                  <!-- Actions -->
                  <div class="col-span-1">
                    <div class="flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div class="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <button 
                          @click.stop="editProduct(product)"
                          class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 border-r border-gray-200"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <i class="fas fa-edit text-sm"></i>
                        </button>
                        <button 
                          @click.stop="toggleProductStatus(product)"
                          :class="[
                            'p-2 transition-all duration-200 border-r border-gray-200',
                            product.status === 'active' 
                              ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          ]"
                          :title="product.status === 'active' ? 'Tạm ngưng sản phẩm' : 'Kích hoạt sản phẩm'"
                        >
                          <i :class="[
                            'text-sm',
                            product.status === 'active' ? 'fas fa-pause' : 'fas fa-play'
                          ]"></i>
                        </button>
                        <button 
                          @click.stop="openDeleteModal(product)"
                          class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                          title="Xóa sản phẩm"
                        >
                          <i class="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Expanded Row Content -->
              <div v-if="expandedRows.has(product.id)" class="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  <!-- Product ID -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">ID sản phẩm:</span>
                    <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">#{{ String(product.id).padStart(4, '0') }}</span>
                  </div>
                  <!-- SKU -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Mã SKU:</span>
                    <span class="text-sm font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">{{ product.sku || 'N/A' }}</span>
                  </div>
                  <!-- Created Date -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Ngày tạo:</span>
                    <span class="text-sm text-gray-800">{{ formatDate(product.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden space-y-4 p-4">
            <div 
              v-for="product in filteredProducts" 
              :key="`mobile-${product.id}`"
              class="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300"
            >
              <!-- Header with image, checkbox and actions -->
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-4">
                  <input 
                    type="checkbox" 
                    v-model="selectedProducts"
                    :value="product.id"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                  <div class="relative">
                    <img 
                      :src="getProductImage(product)" 
                      :alt="product.title"
                      class="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm bg-gray-100"
                      @error="handleImageError"
                      loading="lazy"
                    />
                    <div v-if="product.stockQuantity === 0" class="absolute -top-2 -right-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        Hết hàng
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center bg-gray-50 rounded-lg p-1 space-x-1">
                  <button 
                    @click="editProduct(product)"
                    class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-all duration-200"
                    title="Chỉnh sửa sản phẩm"
                  >
                    <i class="fas fa-edit text-sm"></i>
                  </button>
                  <button 
                    @click="toggleProductStatus(product)"
                    :class="[
                      'p-2 rounded-md transition-all duration-200',
                      product.status === 'active' 
                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                    ]"
                    :title="product.status === 'active' ? 'Tạm ngưng sản phẩm' : 'Kích hoạt sản phẩm'"
                  >
                    <i :class="[
                      'text-sm',
                      product.status === 'active' ? 'fas fa-pause' : 'fas fa-play'
                    ]"></i>
                  </button>
                  <button 
                    @click="openDeleteModal(product)"
                    class="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-all duration-200"
                    title="Xóa sản phẩm"
                  >
                    <i class="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="space-y-3">
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 leading-tight">{{ product.title }}</h3>
                  <div class="flex items-center space-x-2 text-sm text-gray-600">
                    <i class="fas fa-industry text-gray-400"></i>
                    <span>{{ product.manufacturer }}</span>
                  </div>
                  <div v-if="product.origin" class="flex items-center space-x-2 text-xs text-gray-500">
                    <i class="fas fa-globe text-gray-400"></i>
                    <span>{{ product.origin }}</span>
                  </div>
                </div>
                
                <!-- Product Details Grid -->
                <div class="grid grid-cols-1 gap-3">
                  <!-- SKU and Category Row -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="text-gray-600 text-sm">Mã SP:</span>
                      <span class="text-xs font-mono text-gray-800">
                        {{ product.sku || 'N/A' }}
                      </span>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                      <i class="fas fa-tag mr-1"></i>
                      {{ getCategoryDisplayName(product.category) }}
                    </span>
                  </div>
                  
                  <!-- Price and Stock Row -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <i class="fas fa-coins text-yellow-500"></i>
                      <span class="text-gray-600 text-sm">Giá:</span>
                      <span class="font-bold text-gray-900">{{ formatPrice(product.priceValue || product.price) }}</span>
                      <div v-if="product.discount" class="ml-2">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <i class="fas fa-percentage mr-1"></i>
                          -{{ product.discount }}%
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <i class="fas fa-boxes text-gray-400"></i>
                      <span class="text-gray-600 text-sm">Tồn kho:</span>
                      <span :class="[
                        'font-semibold',
                        product.stockQuantity > 50 ? 'text-green-600' : 
                        product.stockQuantity > 10 ? 'text-yellow-600' : 'text-red-600'
                      ]">
                        {{ product.stockQuantity || 0 }}
                      </span>
                      <div :class="[
                        'w-2 h-2 rounded-full',
                        product.stockQuantity > 50 ? 'bg-green-400' : 
                        product.stockQuantity > 10 ? 'bg-yellow-400' : 'bg-red-400'
                      ]"></div>
                    </div>
                  </div>
                </div>
                
                <!-- Status and Subcategory -->
                <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div class="flex items-center space-x-3">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border',
                      product.status === 'active' ? 'bg-green-50 text-green-800 border-green-200' : '',
                      product.status === 'inactive' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : '',
                      product.status === 'out_of_stock' ? 'bg-red-50 text-red-800 border-red-200' : ''
                    ]">
                      <div :class="[
                        'w-1.5 h-1.5 rounded-full mr-1.5',
                        product.status === 'active' ? 'bg-green-400' : '',
                        product.status === 'inactive' ? 'bg-yellow-400' : '',
                        product.status === 'out_of_stock' ? 'bg-red-400' : ''
                      ]"></div>
                      {{ getStatusText(product.status) }}
                    </span>
                    <div v-if="product.subcategory" class="text-xs text-gray-600">
                      <i class="fas fa-arrow-right mr-1 text-gray-400"></i>
                      {{ getSubcategoryDisplayName(product.subcategory) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-box text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Không tìm thấy sản phẩm</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            {{ hasActiveFilters ? 'Thử điều chỉnh bộ lọc để hiển thị kết quả phù hợp hơn' : 'Hãy thêm sản phẩm đầu tiên vào hệ thống' }}
          </p>
          <button 
            v-if="!hasActiveFilters"
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-plus mr-2"></i>
            Thêm sản phẩm đầu tiên
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
                v-model="itemsPerPage"
                @change="changePage(1)"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span class="text-sm text-gray-600">sản phẩm/trang</span>
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
                  :disabled="currentPage === 1"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang đầu"
                >
                  <i class="fas fa-angle-double-left"></i>
                </button>

                <!-- Previous page -->
                <button 
                  @click="changePage(currentPage - 1)"
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
                      page === currentPage
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
                  @click="changePage(currentPage + 1)"
                  :disabled="!apiData.pagination.hasNextPage"
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Trang sau"
                >
                  <i class="fas fa-angle-right"></i>
                </button>

                <!-- Last page -->
                <button 
                  @click="changePage(apiData.pagination.totalPages)"
                  :disabled="currentPage === apiData.pagination.totalPages"
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

    <!-- Create/Edit Product Modal -->
    <CreateEditModal 
      ref="createEditModalRef"
      :show="showCreateModal"
      :is-editing="isEditing"
      :product="editingProduct"
      :saving="saving"

      :form-error="apiError"
      :field-errors="Object.values(errors)"
      @close="closeModal"
      @save="saveProduct"
      @clear-errors="clearAllErrors"
      @edit-product-with-errors="handleEditProductWithErrors"
    />

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showSuccessModal" class="fixed top-4 right-4 z-50">
        <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
          <i class="fas fa-check-circle text-xl"></i>
          <span class="font-medium">{{ showSuccessMessage }}</span>
          <button @click="showSuccessModal = false" class="text-green-200 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <DeleteModal 
      :show="showDeleteModal"
      :product="productToDelete"
      :form-error="apiError"
      :field-errors="Object.values(errors)"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
      @clear-errors="clearAllErrors"
    />


  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue'
import CreateEditModal from '../components/ProductManagement/CreateEditModal.vue'
import DeleteModal from '../components/ProductManagement/DeleteModal.vue'
import { useCategories, useLegacyCategories } from '../composables/useCategories.js'
import { useProductApi } from '../services/productApi.js'
import { useErrorHandler } from '../composables/useErrorHandler.js'
import { useErrorDisplay } from '../composables/useErrorDisplay.js'
import { ERROR_CODES } from '../constants/errCodes.js'

// Reactive state
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectAll = ref(false)
const selectedProducts = ref([])

// Expandable rows state
const expandedRows = ref(new Set())

// Modal states
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref(null)
const productToDelete = ref(null)
const saving = ref(false)
const createEditModalRef = ref(null)

// Success message handling
const showSuccessMessage = ref('')
const showSuccessModal = ref(false)

// API service and error handling
const { getProducts, createProduct, updateProduct, deleteProduct: deleteProductApi } = useProductApi()
const { errors, apiError, clearAllErrors, clearFieldError, setFieldError, setApiError, handleApiError, handleApiResponseError } = useErrorHandler()
const { showErrorToast, handleApiErrorWithToast } = useErrorDisplay()

// Categories composable - use new system
const { 
  mainCategories: mainCategoriesNew,
  mainCategoryOptions, 
  getSubcategoryOptions, 
  getCategoryInfo, 
  getCategoryHierarchy,
  convertLegacyCategory 
} = useCategories()

// Legacy support for backward compatibility
const { mainCategories, getSubcategories, hasSubcategories } = useLegacyCategories()

// Products data from API
const products = ref([])
const loading = ref(false)
const error = ref('')

// API data for pagination and filters
const apiData = ref({
  pagination: null,
  filters: {}
})

// Debounce timer for search
let searchTimeout = null

// Computed properties
const isEditing = computed(() => !!editingProduct.value)

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (product.origin && product.origin.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(product => {
      // Convert both to numbers for comparison
      const productCategoryId = typeof product.category === 'string' ? parseInt(product.category) : product.category
      const filterCategoryId = typeof categoryFilter.value === 'string' ? parseInt(categoryFilter.value) : categoryFilter.value
      return productCategoryId === filterCategoryId
    })
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }

  return filtered
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || categoryFilter.value || statusFilter.value
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

// Statistics - computed from current products list
const activeProducts = computed(() => products.value.filter(p => p.status === 'active').length)
const inactiveProducts = computed(() => products.value.filter(p => p.status === 'inactive').length)
const outOfStockProducts = computed(() => products.value.filter(p => p.stockQuantity === 0).length)

// API Functions
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value
    }

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    if (categoryFilter.value) {
      // Send category ID directly to backend
      console.log('Sending category ID to backend:', categoryFilter.value)
      params.category = categoryFilter.value
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    
    const response = await getProducts(params)
    
    console.log('API Response:', response)
    
    if (response.success) {
      console.log('Products received:', response.data.products)
      console.log('Products count:', response.data.products?.length)
      
      products.value = response.data.products
      
      // Reset expanded rows when data changes to prevent ID conflicts
      const currentProductIds = new Set(response.data.products.map(product => product.id))
      const validExpandedRows = new Set()
      
      // Only keep expanded rows that still exist in current data
      expandedRows.value.forEach(id => {
        if (currentProductIds.has(id)) {
          validExpandedRows.add(id)
        }
      })
      
      expandedRows.value = validExpandedRows
      
      apiData.value = {
        pagination: response.data.pagination,
        filters: response.data.filters
      }
      
      console.log('Products stored:', products.value)
      console.log('Filtered products:', filteredProducts.value)
    } else {
      throw new Error(response.error || 'Failed to fetch products')
    }
  } catch (err) {
    console.error('Fetch products error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải danh sách sản phẩm'
    products.value = []
    apiData.value = { pagination: null, filters: {} }
  } finally {
    loading.value = false
  }
}

// Debounced search function
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when searching
    // Clear expanded rows when searching
    expandedRows.value.clear()
    fetchProducts()
  }, 500) // 500ms delay
}

// Methods
const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Đang bán'
    case 'inactive': return 'Tạm ngưng'
    case 'out_of_stock': return 'Hết hàng'
    default: return 'Không xác định'
  }
}

const getProductImage = (product) => {
  const placeholder = '/img/products/placeholder-product.jpg'
  
  // Handle backend response structure
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const mainIndex = product.mainImageIndex || 0
    const imageUrl = product.images[mainIndex] || product.images[0]
    return imageUrl || placeholder
  }
  
  // Fallback to single image field
  const imageUrl = product.image
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl
  }
  
  return placeholder
}

const formatPrice = (price) => {
  if (!price && price !== 0) return 'N/A'
  // If price is already formatted (string), return as is
  if (typeof price === 'string' && price.includes('đ')) {
    return price
  }
  // If price is a number, format it
  const numPrice = parseInt(price)
  if (isNaN(numPrice)) return 'N/A'
  return numPrice.toLocaleString('vi-VN') + 'đ'
}

const handleImageError = (event) => {
  console.log('Image error, loading placeholder:', event.target.src)
  event.target.src = '/img/products/placeholder-product.jpg'
  // Prevent infinite loop if placeholder also fails
  event.target.onerror = null
}

// Helper methods for category display
const getCategoryDisplayName = (categoryId) => {
  if (!categoryId) return 'N/A'
  
  // If it's already a name (legacy), return as is
  if (typeof categoryId === 'string' && isNaN(categoryId)) {
    return categoryId
  }
  
  // Convert to number if it's a string number
  const numericId = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
  
  // Get category info by ID
  const categoryInfo = getCategoryInfo(numericId)
  return categoryInfo ? categoryInfo.name : `Unknown Category (ID: ${categoryId})`
}

const getSubcategoryDisplayName = (subcategoryId) => {
  if (!subcategoryId) return 'N/A'
  
  // If it's already a name (legacy), return as is
  if (typeof subcategoryId === 'string' && isNaN(subcategoryId)) {
    return subcategoryId
  }
  
  // Convert to number if it's a string number
  const numericId = typeof subcategoryId === 'string' ? parseInt(subcategoryId) : subcategoryId
  
  // Get subcategory info by ID
  const subcategoryInfo = getCategoryInfo(numericId)
  return subcategoryInfo ? subcategoryInfo.name : `Unknown Subcategory (ID: ${subcategoryId})`
}

const editProduct = (product) => {
  editingProduct.value = { ...product }
  showCreateModal.value = true
}



const openDeleteModal = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const toggleProductStatus = async (product) => {
  try {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    const response = await updateProduct(product.id, { status: newStatus })
    
          if (response.success) {
        product.status = newStatus
        displaySuccessMessage(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm ngưng'} sản phẩm "${product.title}"`)
      } else {
        throw new Error(response.error?.message || response.error || 'Failed to update product status')
      }
  } catch (err) {
    console.error('Toggle product status error:', err)
    handleProductApiError(err)
  }
}

const saveProduct = async (productData) => {
  // Prevent multiple submissions
  if (saving.value) return
  
  saving.value = true
  try {
    let response
    if (editingProduct.value) {
      // Update existing product
      response = await updateProduct(editingProduct.value.id, productData)
    } else {
      // Create new product
      response = await createProduct(productData)
    }
    
    if (response && response.success) {
      const action = editingProduct.value ? 'cập nhật' : 'tạo'
      
      // Handle image uploads for both create and edit modes
      if (createEditModalRef.value) {
        const productId = editingProduct.value ? editingProduct.value.id : response.data?.id
        
        if (productId) {
          try {
            const uploadResult = await createEditModalRef.value.uploadProductImages(productId)
            
            // Check upload result and decide whether to keep modal open
            const shouldKeepModalOpen = createEditModalRef.value.handleUploadCompletion(productId, uploadResult)
            
            if (shouldKeepModalOpen) {
              // Modal will show error dialog, don't close
              await fetchProducts() // Refresh the list
              return
            }
            // If no errors, continue to close modal normally
          } catch (uploadError) {
            console.error('Image upload failed:', uploadError)
            // Create upload result for error handling
            const uploadResult = { success: false, hasErrors: true }
            const shouldKeepModalOpen = createEditModalRef.value.handleUploadCompletion(productId, uploadResult)
            
            if (shouldKeepModalOpen) {
              // Modal will show error dialog, don't close
              await fetchProducts() // Refresh the list
              return
            }
            // If no dialog shown, close with error message
            displaySuccessMessage(`Đã ${action} sản phẩm thành công, nhưng có lỗi khi tải lên hình ảnh`)
            await fetchProducts()
            closeModal()
            return
          }
        }
      }
      
      displaySuccessMessage(`Đã ${action} sản phẩm thành công`)
      await fetchProducts() // Refresh the list
      closeModal() // Only close on success
    } else {
      // This should not happen with standardized API responses
      // The makeStandardizedApiRequest will handle error responses automatically
      throw new Error('Unexpected response format')
    }
  } catch (err) {
    console.error('Save product error:', err)
    // Handle error in the modal - don't close it
    handleProductApiError(err)
    throw err // Re-throw to let the modal handle it
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  try {
    const response = await deleteProductApi(productToDelete.value.id)
    if (response && response.success) {
      displaySuccessMessage('Đã xóa sản phẩm thành công')
      await fetchProducts() // Refresh the list
    } else {
      // This should not happen with standardized API responses
      throw new Error('Unexpected response format')
    }
  } catch (err) {
    console.error('Delete product error:', err)
    handleProductApiError(err)
  }
  showDeleteModal.value = false
  productToDelete.value = null
}

const closeModal = () => {
  // Reset form if we were creating a new product (not editing)
  if (!editingProduct.value && createEditModalRef.value) {
    createEditModalRef.value.resetForm()
  }
  
  showCreateModal.value = false
  editingProduct.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const handleEditProductWithErrors = async (productId) => {
  console.log('handleEditProductWithErrors called with productId:', productId)
  try {
    // Use the productApi to get the specific product by ID
    const { getProduct } = useProductApi()
    console.log('Fetching product data...')
    const response = await getProduct(productId)
    
    if (response.success && response.data) {
      // Switch to edit mode with the created product
      console.log('Setting editingProduct to:', response.data)
      editingProduct.value = { ...response.data }
      console.log('editingProduct set, isEditing computed:', isEditing.value)
      console.log('showCreateModal state:', showCreateModal.value)
      // Modal is already open, just switch to edit mode
      console.log('Switched to edit mode for product:', productId)
      
      // Refresh the product list in background
      await fetchProducts()
    } else {
      console.error('Failed to fetch product by ID:', response.error)
      // If we can't fetch the specific product, try to find it in current list
      const existingProduct = products.value.find(p => p.id === productId)
      if (existingProduct) {
        editingProduct.value = { ...existingProduct }
        console.log('Found product in existing list, switched to edit mode')
      } else {
        console.error('Product not found in current list either')
        // As last resort, close the modal
        closeModal()
      }
    }
  } catch (error) {
    console.error('Failed to fetch product for editing:', error)
    // Try to find in existing products list as fallback
    const existingProduct = products.value.find(p => p.id === productId)
    if (existingProduct) {
      editingProduct.value = { ...existingProduct }
      console.log('Used existing product data as fallback')
    } else {
      // If we can't fetch the product at all, close the modal
      closeModal()
    }
  }
}

const displaySuccessMessage = (message) => {
  showSuccessMessage.value = message
  showSuccessModal.value = true
  // Auto hide after 3 seconds
  setTimeout(() => {
    showSuccessModal.value = false
    showSuccessMessage.value = ''
  }, 3000)
}

const handleProductApiError = (error) => {
  console.error('Product API Error:', error)
  
  // Use the new standardized error display
  return handleApiErrorWithToast(error, 'Product API call', 'Có lỗi xảy ra khi xử lý sản phẩm')
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = filteredProducts.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= (apiData.value.pagination?.totalPages || 1)) {
    currentPage.value = page
    // Clear expanded rows when changing pages to prevent ID conflicts
    expandedRows.value.clear()
    fetchProducts()
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  // Clear expanded rows when filters change
  expandedRows.value.clear()
  fetchProducts()
}

const exportProducts = () => {
  // Implementation for exporting products
  console.log('Exporting products...')
  showSuccessMessage('Đã xuất dữ liệu sản phẩm thành công')
}

// Expandable rows functions
const toggleRowExpansion = (productId) => {
  if (expandedRows.value.has(productId)) {
    expandedRows.value.delete(productId)
  } else {
    expandedRows.value.add(productId)
  }
}

// Date formatting function for expanded row
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return 'N/A'
  }
}

// Watchers
watch([showCreateModal, showDeleteModal, showSuccessModal], ([createModal, deleteModal, successModal]) => {
  if (createModal || deleteModal || successModal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Watch search query with debouncing
watch(searchQuery, () => {
  debouncedSearch()
})

// Watch filters without debouncing (immediate response for dropdowns)
watch([categoryFilter, statusFilter], () => {
  currentPage.value = 1 // Reset to first page when filtering
  // Clear expanded rows when filters change
  expandedRows.value.clear()
  fetchProducts()
})

// Watch pagination limit changes
watch(() => itemsPerPage.value, () => {
  currentPage.value = 1
  fetchProducts()
})

// Initialize on mount
onMounted(() => {
  fetchProducts()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  // Reset modal states
  showCreateModal.value = false
  showDeleteModal.value = false
  showSuccessModal.value = false
})
</script>

<style scoped>
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

/* Toast transition styles */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 