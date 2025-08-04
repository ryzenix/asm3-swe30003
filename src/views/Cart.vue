<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Enhanced Header -->
      <header class="mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Title and Navigation -->
          <div class="lg:col-span-2 space-y-3">
            <div class="flex items-center space-x-4">
              <router-link 
                to="/products" 
                class="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <i class="fas fa-chevron-left mr-2"></i>
                <span>Tiếp tục mua sắm</span>
              </router-link>
            </div>
            
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center">
                <div class="w-1.5 h-10 lg:h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full mr-4"></div>
                Giỏ hàng của bạn
              </h1>
              <p class="text-gray-600 ml-6 text-lg mt-2">
                {{ totalItems }} sản phẩm • {{ formattedTotalPrice }}
              </p>
            </div>
          </div>
          
          <!-- Right: Stats matching sidebar width -->
          <div class="lg:col-span-1 space-y-3">
            <div class="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl text-sm font-medium border border-blue-200 shadow-sm">
              <i class="fas fa-shipping-fast mr-2"></i>
              Miễn phí vận chuyển đối với đơn hàng trên 300.000đ
            </div>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div class="text-lg font-bold text-green-600">{{ totalItems }}</div>
                <div class="text-xs text-gray-600">Sản phẩm</div>
              </div>
              <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div class="text-lg font-bold text-blue-600">{{ Math.round(totalPrice / totalItems) }}đ</div>
                <div class="text-xs text-gray-600">Trung bình</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Empty Cart -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-shopping-cart text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Giỏ hàng trống</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
          </p>
          <router-link 
            to="/products" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            <i class="fas fa-shopping-bag mr-2"></i>
            Bắt đầu mua sắm
          </router-link>
        </div>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <!-- Cart Header -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-300">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-lg font-semibold text-gray-900">Sản phẩm trong giỏ hàng ({{ totalItems }})</span>
                </div>
                <div class="hidden lg:flex items-center space-x-4 text-sm font-medium text-gray-700 flex-1 ml-8">
                  <!-- Product Info Space (matches flex-1 in items) -->
                  <div class="flex-1"></div>
                  
                  <!-- Unit Price -->
                  <div class="w-28 text-right flex items-center justify-end">
                    <i class="fas fa-tag mr-2 text-blue-500"></i>
                    Giá đơn vị
                  </div>
                  
                  <!-- Quantity -->
                  <div class="w-32 text-center flex items-center justify-center">
                    <i class="fas fa-sort-numeric-up mr-2 text-green-500"></i>
                    Số lượng
                  </div>
                  
                  <!-- Unit -->
                  <div class="w-20 text-center flex items-center justify-center">
                    <i class="fas fa-cube mr-2 text-purple-500"></i>
                    Đơn vị
                  </div>
                  
                  <!-- Total Price -->
                  <div class="w-28 text-right flex items-center justify-end">
                    <i class="fas fa-calculator mr-2 text-orange-500"></i>
                    Tổng tiền
                  </div>
                  
                  <!-- Actions -->
                  <div class="w-20 text-center flex items-center justify-center">
                    <i class="fas fa-cogs mr-2 text-gray-500"></i>
                    Thao tác
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart Items List -->
            <div class="divide-y divide-gray-200">
              <div 
                v-for="item in cartItems" 
                :key="item.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <!-- Desktop Layout -->
                <div class="hidden lg:flex items-center space-x-4">
                  <!-- Checkbox -->
                  <input 
                    v-model="selectedItems"
                    :value="item.id"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <!-- Product Image & Info -->
                  <div class="flex items-center space-x-4 flex-1">
                    <div class="relative">
                      <img 
                        :src="item.image" 
                        :alt="item.title"
                        class="w-20 h-20 object-contain rounded-xl border-2 border-gray-200 shadow-sm bg-white"
                        @error="handleImageError"
                      />
                      <div v-if="item.discount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        -{{ item.discount }}%
                      </div>
                    </div>
                    
                    <div class="flex-1 space-y-2">
                      <h3 class="font-semibold text-gray-900 text-lg leading-tight">
                        {{ item.title }}
                      </h3>
                      
                      <div class="flex items-center space-x-4 text-sm">
                        <span class="flex items-center text-gray-600">
                          <i class="fas fa-industry mr-1 text-blue-500"></i>
                          {{ item.manufacturer }}
                        </span>
                        <span class="flex items-center text-gray-600">
                          <i class="fas fa-tag mr-1 text-green-500"></i>
                          {{ item.category }}
                        </span>
                        <span v-if="item.stockQuantity <= 10" class="flex items-center text-orange-600">
                          <i class="fas fa-exclamation-triangle mr-1"></i>
                          Còn {{ item.stockQuantity }} sản phẩm
                        </span>
                      </div>
                      
                      <div v-if="item.discount" class="flex items-center space-x-2">
                        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          <i class="fas fa-percentage mr-1"></i>
                          Giảm ngay {{ item.discount }}% áp dụng đến 20/07
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Unit Price -->
                  <div class="w-28 text-right">
                    <div class="font-bold text-lg text-gray-900">
                      {{ formatPrice(item.priceValue) }}
                    </div>
                    <div v-if="item.discount" class="text-sm text-gray-500 line-through">
                      {{ formatPrice(calculateOriginalPrice(item)) }}
                    </div>
                  </div>

                  <!-- Quantity -->
                  <div class="w-32 flex items-center justify-center">
                    <div class="flex items-center bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        @click="decreaseQuantity(item.id)"
                        :disabled="isUpdating"
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 disabled:opacity-50 transition-colors"
                      >
                        <i class="fas fa-minus text-xs"></i>
                      </button>
                      
                      <div class="w-12 h-8 flex items-center justify-center bg-white border-x border-gray-300">
                        <span class="font-bold text-gray-900">{{ item.quantity }}</span>
                      </div>
                      
                      <button 
                        @click="increaseQuantity(item.id)"
                        :disabled="isUpdating || item.quantity >= item.stockQuantity"
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 disabled:opacity-50 transition-colors"
                      >
                        <i class="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Unit -->
                  <div class="w-20 text-center">
                    <div class="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium">
                      {{ item.unit || 'Cây' }}
                    </div>
                  </div>

                  <!-- Total Price -->
                  <div class="w-28 text-right">
                    <div class="font-bold text-xl text-blue-600">
                      {{ formatPrice(item.priceValue * item.quantity) }}
                    </div>
                    <div v-if="item.discount" class="text-sm text-gray-500">
                      Tiết kiệm: {{ formatPrice(calculateSavings(item) * item.quantity) }}
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="w-20 flex items-center justify-center">
                    <button 
                      @click="removeFromCart(item.id)"
                      class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile Layout -->
                <div class="lg:hidden space-y-4">
                  <div class="flex items-start space-x-4">
                    <input 
                      v-model="selectedItems"
                      :value="item.id"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-2"
                    />
                    
                    <div class="relative">
                      <img 
                        :src="item.image" 
                        :alt="item.title"
                        class="w-20 h-20 object-contain rounded-xl border-2 border-gray-200 shadow-sm bg-white"
                        @error="handleImageError"
                      />
                      <div v-if="item.discount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        -{{ item.discount }}%
                      </div>
                    </div>
                    
                    <div class="flex-1 space-y-2">
                      <h3 class="font-semibold text-gray-900 leading-tight">
                        {{ item.title }}
                      </h3>
                      
                      <div class="space-y-1 text-sm text-gray-600">
                        <div class="flex items-center">
                          <i class="fas fa-industry mr-2 text-blue-500"></i>
                          {{ item.manufacturer }}
                        </div>
                        <div class="flex items-center">
                          <i class="fas fa-tag mr-2 text-green-500"></i>
                          {{ item.category }}
                        </div>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-bold text-lg text-gray-900">
                            {{ formatPrice(item.priceValue) }}
                          </div>
                          <div v-if="item.discount" class="text-sm text-gray-500 line-through">
                            {{ formatPrice(calculateOriginalPrice(item)) }}
                          </div>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                          <div class="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
                            <button 
                              @click="decreaseQuantity(item.id)"
                              :disabled="isUpdating"
                              class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-red-100 disabled:opacity-50"
                            >
                              <i class="fas fa-minus text-xs"></i>
                            </button>
                            <span class="w-12 h-8 flex items-center justify-center font-bold">{{ item.quantity }}</span>
                            <button 
                              @click="increaseQuantity(item.id)"
                              :disabled="isUpdating || item.quantity >= item.stockQuantity"
                              class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-green-100 disabled:opacity-50"
                            >
                              <i class="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                          
                          <div class="flex">
                            <button 
                              @click="removeFromCart(item.id)"
                              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600"
                            >
                              <i class="fas fa-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedItems.length > 0" class="p-6 border-t border-gray-300 bg-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 font-medium">
                  Đã chọn {{ selectedItems.length }} sản phẩm
                </span>
                <div class="flex">
                  <button 
                    @click="removeSelectedItems"
                    class="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors border border-red-200"
                  >
                    <i class="fas fa-trash mr-1"></i>
                    Xóa đã chọn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Customer Information Form -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-user mr-2 text-blue-600"></i>
                  Thông tin giao hàng
                  <span v-if="isCustomerFormValid" class="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  <span v-else class="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </h3>
                <div class="flex items-center space-x-2">
                  <span v-if="isCustomerFormValid" class="text-sm text-green-600 font-medium">
                    <i class="fas fa-check mr-1"></i>
                    Đã điền
                  </span>
                  <span v-else class="text-sm text-red-600 font-medium">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    Chưa điền
                  </span>
                  <button 
                    @click="showCustomerForm = !showCustomerForm"
                    class="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <i :class="showCustomerForm ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
              </div>
            </div>

            <Transition name="form-slide">
              <div v-show="showCustomerForm" class="p-6 space-y-4">
                <!-- Customer Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-user mr-1 text-blue-500"></i>
                    Họ và tên <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.name"
                    @blur="validateField('name')"
                    @input="clearFieldError('name')"
                    type="text"
                    placeholder="Nhập họ và tên đầy đủ"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      formValidation.name.isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    ]"
                  />
                  <p v-if="!formValidation.name.isValid" class="text-red-600 text-sm mt-1">
                    {{ formValidation.name.error }}
                  </p>
                </div>

                <!-- Phone Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-phone mr-1 text-green-500"></i>
                    Số điện thoại <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.phone"
                    @blur="validateField('phone')"
                    @input="clearFieldError('phone')"
                    type="tel"
                    placeholder="Nhập số điện thoại (ví dụ: 0901234567)"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      formValidation.phone.isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    ]"
                  />
                  <p v-if="!formValidation.phone.isValid" class="text-red-600 text-sm mt-1">
                    {{ formValidation.phone.error }}
                  </p>
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-map-marker-alt mr-1 text-red-500"></i>
                    Địa chỉ giao hàng <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="customerForm.address"
                    @blur="validateField('address')"
                    @input="clearFieldError('address')"
                    rows="3"
                    placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none',
                      formValidation.address.isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
                    ]"
                  ></textarea>
                  <p v-if="!formValidation.address.isValid" class="text-red-600 text-sm mt-1">
                    {{ formValidation.address.error }}
                  </p>
                </div>

                <!-- Delivery Method -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-shipping-fast mr-1 text-purple-500"></i>
                    Phương thức giao hàng
                  </label>
                  <div class="grid grid-cols-1 gap-3">
                    <label class="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        v-model="customerForm.deliveryMethod"
                        type="radio"
                        value="grab"
                        class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div class="ml-3 flex-1">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <i class="fas fa-motorcycle text-green-600 mr-2"></i>
                            <span class="font-medium text-gray-900">Giao hàng nhanh (Grab)</span>
                          </div>
                          <span class="text-sm text-green-600 font-medium">30-45 phút</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">Giao hàng trong ngày, phí ship miễn phí</p>
                      </div>
                    </label>
                    
                    <label class="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        v-model="customerForm.deliveryMethod"
                        type="radio"
                        value="standard"
                        class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div class="ml-3 flex-1">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <i class="fas fa-truck text-blue-600 mr-2"></i>
                            <span class="font-medium text-gray-900">Giao hàng tiêu chuẩn</span>
                          </div>
                          <span class="text-sm text-blue-600 font-medium">1-2 ngày</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">Giao hàng trong 1-2 ngày làm việc</p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Delivery Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-clock mr-1 text-orange-500"></i>
                    Thời gian giao hàng
                  </label>
                  <select
                    v-model="customerForm.deliveryTime"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="standard">Giờ hành chính (8:00 - 17:00)</option>
                    <option value="morning">Buổi sáng (8:00 - 12:00)</option>
                    <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
                    <option value="evening">Buổi tối (17:00 - 20:00)</option>
                  </select>
                </div>

                <!-- Order Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-sticky-note mr-1 text-yellow-500"></i>
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    v-model="customerForm.notes"
                    rows="2"
                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <!-- Form Actions -->
                <div class="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    @click="clearCustomerForm"
                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <i class="fas fa-undo mr-2"></i>
                    Xóa form
                  </button>
                  <button
                    @click="saveCustomerInfo"
                    :disabled="!isCustomerFormValid"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    <i class="fas fa-save mr-2"></i>
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Order Summary -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-4 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-300">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <i class="fas fa-receipt mr-2 text-blue-600"></i>
                Tóm tắt đơn hàng
              </h3>
            </div>

            <div class="p-6 space-y-4">
              <!-- Order Details -->
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 flex items-center">
                    <i class="fas fa-shopping-bag mr-2 text-blue-500"></i>
                    Tổng tiền ({{ totalItems }} sản phẩm)
                  </span>
                  <span class="font-medium">{{ formattedTotalPrice }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 flex items-center">
                    <i class="fas fa-shipping-fast mr-2 text-blue-500"></i>
                    Phí vận chuyển
                  </span>
                  <span class="text-green-600 font-medium">Miễn phí</span>
                </div>
                
                <div class="border-t border-gray-300 pt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gray-900">Tổng cộng</span>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-blue-600">{{ formattedTotalPrice }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Checkout Button -->
              <button 
                @click="proceedToCheckout"
                :disabled="cartItems.length === 0 || isProcessing"
                :class="[
                  'w-full py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all',
                  isCustomerFormValid 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                ]"
              >
                <i v-if="isProcessing" class="fas fa-spinner fa-spin"></i>
                <i v-else-if="isCustomerFormValid" class="fas fa-credit-card"></i>
                <i v-else class="fas fa-edit"></i>
                <span>
                  {{ 
                    isProcessing 
                      ? 'Đang xử lý...' 
                      : isCustomerFormValid 
                        ? 'Tiến hành thanh toán' 
                        : 'Điền thông tin giao hàng'
                  }}
                </span>
              </button>
              
              <!-- Security Info -->
              <div class="grid grid-cols-3 gap-2 mt-4">
                <div class="text-center">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <i class="fas fa-shield-alt text-green-600 text-xs"></i>
                  </div>
                  <div class="text-xs text-gray-600">Bảo mật</div>
                </div>
                <div class="text-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <i class="fas fa-truck text-blue-600 text-xs"></i>
                  </div>
                  <div class="text-xs text-gray-600">Giao nhanh</div>
                </div>
                <div class="text-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <i class="fas fa-undo text-purple-600 text-xs"></i>
                  </div>
                  <div class="text-xs text-gray-600">Đổi trả</div>
                </div>
              </div>
              
              <!-- Terms -->
              <div class="text-xs text-gray-500 text-center leading-relaxed bg-gray-50 p-3 rounded-lg">
                Bằng việc tiến hành đặt mua hàng, bạn đồng ý với
                <a href="#" class="text-blue-600 underline">Điều khoản dịch vụ</a> và 
                <a href="#" class="text-blue-600 underline">Chính sách xử lý dữ liệu cá nhân</a>
                của Nhà thuốc FPT Long Châu
              </div>
            </div>
          </div>

          <!-- App Download -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
              <h4 class="font-semibold text-gray-900 flex items-center">
                <i class="fas fa-mobile-alt mr-2 text-blue-600"></i>
                Tải ứng dụng
              </h4>
            </div>
            
            <div class="p-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <i class="fas fa-mobile-alt text-blue-600 text-xl"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">Tải ứng dụng</div>
                  <div class="text-sm font-bold text-blue-600">Miễn phí vận chuyển</div>
                  <div class="text-xs text-gray-600">với mọi đơn hàng</div>
                </div>
                <div class="flex-shrink-0">
                  <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Tải ngay
                  </button>
                </div>
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-qrcode text-gray-600"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Messages -->
    <div 
      v-for="message in feedbackMessages" 
      :key="message.id"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-slide-in border border-green-400"
    >
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
          <i class="fas fa-check text-green-800 text-sm"></i>
        </div>
        <span class="font-medium">{{ message.text }}</span>
      </div>
    </div>

    <!-- Prescription Upload Modal -->
    <PrescriptionUploadModal
      :show="showPrescriptionModal"
      :prescription-products="checkPrescriptionRequirements(cartItems)"
      @close="closePrescriptionModal"
      @submit="onPrescriptionSubmit"
    />

    <!-- Cart Issues Modal -->
    <CartIssuesModal
      :show="showCartIssuesModal"
      :cart-issues="cartIssues"
      @close="closeCartIssuesModal"
      @proceed="onCartIssuesResolution"
      @remove-item="onRemoveCartItem"
      @add-alternative="onAddAlternative"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useCheckout } from '../composables/useCheckout'
import PrescriptionUploadModal from '../components/Checkout/PrescriptionUploadModal.vue'
import CartIssuesModal from '../components/Checkout/CartIssuesModal.vue'

const router = useRouter()

const {
  cartItems,
  totalItems,
  totalPrice,
  formattedTotalPrice,
  feedbackMessages,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart
} = useCart()

const {
  isProcessing: checkoutProcessing,
  showPrescriptionModal,
  showCartIssuesModal,
  cartIssues,
  initiateCheckout,
  handlePrescriptionSubmit,
  handleCartIssuesResolution,
  navigateToOrder,
  closePrescriptionModal,
  closeCartIssuesModal,
  checkPrescriptionRequirements
} = useCheckout()

// Local state
const selectedItems = ref([])
const isUpdating = ref(false)

// Customer information form
const customerForm = ref({
  name: '',
  phone: '',
  address: '',
  deliveryMethod: 'grab',
  deliveryTime: 'standard',
  notes: ''
})

const formValidation = ref({
  name: { isValid: true, error: '' },
  phone: { isValid: true, error: '' },
  address: { isValid: true, error: '' }
})

const showCustomerForm = ref(false)

// Use checkout processing state instead of local isProcessing
const isProcessing = computed(() => checkoutProcessing.value)

// Computed
const allSelected = computed(() => {
  return cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length
})

const selectAll = computed({
  get: () => allSelected.value,
  set: (value) => {
    if (value) {
      selectedItems.value = cartItems.value.map(item => item.id)
    } else {
      selectedItems.value = []
    }
  }
})

// Customer form validation computed
const isCustomerFormValid = computed(() => {
  return formValidation.value.name.isValid &&
         formValidation.value.phone.isValid &&
         formValidation.value.address.isValid &&
         customerForm.value.name.trim() !== '' &&
         customerForm.value.phone.trim() !== '' &&
         customerForm.value.address.trim() !== ''
})

// Methods
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = cartItems.value.map(item => item.id)
  }
}



const removeSelectedItems = () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${selectedItems.value.length} sản phẩm đã chọn?`)) {
    selectedItems.value.forEach(itemId => {
      removeFromCart(itemId)
    })
    selectedItems.value = []
  }
}



const proceedToCheckout = async () => {
  if (cartItems.value.length === 0) return
  
  // Check if customer info is required and valid
  if (!isCustomerFormValid.value) {
    showCustomerForm.value = true
    showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error')
    return
  }
  
  try {
    // Prepare order data with customer information
    const orderData = {
      items: cartItems.value,
      customerInfo: {
        name: customerForm.value.name.trim(),
        phone: customerForm.value.phone.trim(),
        address: customerForm.value.address.trim()
      },
      deliveryInfo: {
        method: customerForm.value.deliveryMethod === 'grab' ? 'Giao hàng nhanh (Grab)' : 'Giao hàng tiêu chuẩn',
        carrier: customerForm.value.deliveryMethod === 'grab' ? 'GRAB' : 'STANDARD',
        estimatedTime: customerForm.value.deliveryMethod === 'grab' ? '30-45 phút' : '1-2 ngày',
        timeSlot: getDeliveryTimeSlot(customerForm.value.deliveryTime)
      },
      notes: customerForm.value.notes.trim()
    }
    
    const result = await initiateCheckout(orderData)
    
    if (result.step === 'success') {
      // Clear cart and form after successful order
      cartItems.value = []
      selectedItems.value = []
      clearCustomerForm()
      
      // Show success message
      showToast('Đặt hàng thành công!', 'success')
      
      // Navigate to order details
      navigateToOrder(result.data.orderId)
    }
    // Other steps (prescription, issues) are handled by modals
    
  } catch (error) {
    console.error('Checkout error:', error)
    showToast(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error')
  }
}

// Handle prescription modal events
const onPrescriptionSubmit = async (prescriptionData) => {
  try {
    // Include customer info with prescription data
    const orderData = {
      items: cartItems.value,
      customerInfo: {
        name: customerForm.value.name.trim(),
        phone: customerForm.value.phone.trim(),
        address: customerForm.value.address.trim()
      },
      deliveryInfo: {
        method: customerForm.value.deliveryMethod === 'grab' ? 'Giao hàng nhanh (Grab)' : 'Giao hàng tiêu chuẩn',
        carrier: customerForm.value.deliveryMethod === 'grab' ? 'GRAB' : 'STANDARD',
        estimatedTime: customerForm.value.deliveryMethod === 'grab' ? '30-45 phút' : '1-2 ngày',
        timeSlot: getDeliveryTimeSlot(customerForm.value.deliveryTime)
      },
      notes: customerForm.value.notes.trim(),
      prescriptionData
    }
    
    const result = await handlePrescriptionSubmit(prescriptionData, orderData)
    
    if (result.step === 'success') {
      // Clear cart and form after successful order
      cartItems.value = []
      selectedItems.value = []
      clearCustomerForm()
      
      // Show success message
      showToast('Đặt hàng thành công!', 'success')
      
      // Navigate to order details
      navigateToOrder(result.data.orderId)
    }
  } catch (error) {
    console.error('Prescription submission error:', error)
    showToast(error.message || 'Có lỗi xảy ra khi xử lý đơn thuốc.', 'error')
  }
}

// Handle cart issues modal events
const onCartIssuesResolution = async (resolution) => {
  try {
    // Include customer info with resolution
    const orderData = {
      items: cartItems.value,
      customerInfo: {
        name: customerForm.value.name.trim(),
        phone: customerForm.value.phone.trim(),
        address: customerForm.value.address.trim()
      },
      deliveryInfo: {
        method: customerForm.value.deliveryMethod === 'grab' ? 'Giao hàng nhanh (Grab)' : 'Giao hàng tiêu chuẩn',
        carrier: customerForm.value.deliveryMethod === 'grab' ? 'GRAB' : 'STANDARD',
        estimatedTime: customerForm.value.deliveryMethod === 'grab' ? '30-45 phút' : '1-2 ngày',
        timeSlot: getDeliveryTimeSlot(customerForm.value.deliveryTime)
      },
      notes: customerForm.value.notes.trim(),
      resolution
    }
    
    const result = await handleCartIssuesResolution(orderData)
    
    if (result.step === 'success') {
      // Clear cart and form after successful order
      cartItems.value = []
      selectedItems.value = []
      clearCustomerForm()
      
      // Show success message
      showToast('Đặt hàng thành công!', 'success')
      
      // Navigate to order details
      navigateToOrder(result.data.orderId)
    }
  } catch (error) {
    console.error('Cart issues resolution error:', error)
    showToast(error.message || 'Có lỗi xảy ra khi xử lý giỏ hàng.', 'error')
  }
}

const onRemoveCartItem = (itemId) => {
  removeFromCart(itemId)
}

const onAddAlternative = (alternative) => {
  // Add alternative product to cart
  // This would typically use the addToCart function from useCart
  console.log('Adding alternative product:', alternative)
  showToast(`Đã thêm sản phẩm thay thế: ${alternative.title}`, 'success')
}

// Toast notification function
const showToast = (message, type = 'success') => {
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

const calculateOriginalPrice = (item) => {
  if (item.discount) {
    return item.priceValue / (1 - item.discount / 100)
  }
  return item.priceValue
}

const calculateSavings = (item) => {
  if (item.discount) {
    const originalPrice = calculateOriginalPrice(item)
    return originalPrice - item.priceValue
  }
  return 0
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

// Customer form validation methods
const validateField = (fieldName) => {
  switch (fieldName) {
    case 'name':
      const name = customerForm.value.name.trim()
      if (!name) {
        formValidation.value.name = { isValid: false, error: 'Họ và tên không được để trống' }
      } else if (name.length < 2) {
        formValidation.value.name = { isValid: false, error: 'Họ và tên phải có ít nhất 2 ký tự' }
      } else if (name.length > 100) {
        formValidation.value.name = { isValid: false, error: 'Họ và tên không được vượt quá 100 ký tự' }
      } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) {
        formValidation.value.name = { isValid: false, error: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng' }
      } else {
        formValidation.value.name = { isValid: true, error: '' }
      }
      break

    case 'phone':
      const phone = customerForm.value.phone.trim()
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]\d{8}$/
      if (!phone) {
        formValidation.value.phone = { isValid: false, error: 'Số điện thoại không được để trống' }
      } else if (!phoneRegex.test(phone)) {
        formValidation.value.phone = { isValid: false, error: 'Định dạng số điện thoại không hợp lệ (ví dụ: 0901234567)' }
      } else {
        formValidation.value.phone = { isValid: true, error: '' }
      }
      break

    case 'address':
      const address = customerForm.value.address.trim()
      if (!address) {
        formValidation.value.address = { isValid: false, error: 'Địa chỉ giao hàng không được để trống' }
      } else if (address.length < 10) {
        formValidation.value.address = { isValid: false, error: 'Địa chỉ phải có ít nhất 10 ký tự' }
      } else if (address.length > 500) {
        formValidation.value.address = { isValid: false, error: 'Địa chỉ không được vượt quá 500 ký tự' }
      } else {
        formValidation.value.address = { isValid: true, error: '' }
      }
      break
  }
}

const clearFieldError = (fieldName) => {
  if (!formValidation.value[fieldName].isValid) {
    formValidation.value[fieldName] = { isValid: true, error: '' }
  }
}

const clearCustomerForm = () => {
  customerForm.value = {
    name: '',
    phone: '',
    address: '',
    deliveryMethod: 'grab',
    deliveryTime: 'standard',
    notes: ''
  }
  
  formValidation.value = {
    name: { isValid: true, error: '' },
    phone: { isValid: true, error: '' },
    address: { isValid: true, error: '' }
  }
  
  showToast('Đã xóa thông tin form', 'success')
}

const saveCustomerInfo = () => {
  // Validate all fields
  validateField('name')
  validateField('phone')
  validateField('address')
  
  if (isCustomerFormValid.value) {
    showToast('Đã lưu thông tin giao hàng', 'success')
    showCustomerForm.value = false
  } else {
    showToast('Vui lòng kiểm tra lại thông tin đã nhập', 'error')
  }
}

const getDeliveryTimeSlot = (timeSlot) => {
  const timeSlots = {
    'standard': 'Giờ hành chính (8:00 - 17:00)',
    'morning': 'Buổi sáng (8:00 - 12:00)',
    'afternoon': 'Buổi chiều (13:00 - 17:00)',
    'evening': 'Buổi tối (17:00 - 20:00)'
  }
  return timeSlots[timeSlot] || timeSlots.standard
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Animation for success messages */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Form slide transition */
.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.form-slide-enter-from,
.form-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.form-slide-enter-to,
.form-slide-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}
</style>