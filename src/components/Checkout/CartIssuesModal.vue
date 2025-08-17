<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all duration-300 relative" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-exclamation-triangle text-xl"></i>
                <div>
                  <h2 class="text-xl font-semibold">
                    Cần xem lại giỏ hàng
                  </h2>
                  <p class="text-orange-100 text-sm mt-1">
                    Một số sản phẩm có vấn đề cần được xử lý
                  </p>
                </div>
              </div>
              <button
                @click="$emit('close')"
                :disabled="processing"
                :class="[
                  'p-2 rounded-full transition-colors duration-200',
                  processing 
                    ? 'text-white/40 cursor-not-allowed' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                ]"
              >
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Loading overlay -->
          <div v-if="processing || refreshing" class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span class="text-sm text-gray-600 mt-2">
                {{ processing ? 'Đang xử lý...' : 'Đang cập nhật...' }}
              </span>
              <p class="text-xs text-gray-500 mt-1">
                {{ processing ? 'Vui lòng chờ trong giây lát' : 'Đang kiểm tra giỏ hàng' }}
              </p>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Summary -->
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div class="flex items-start space-x-3">
                <i class="fas fa-info-circle text-orange-500 mt-0.5"></i>
                <div class="flex-1">
                  <h4 class="text-orange-800 font-medium mb-2">Tóm tắt vấn đề</h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div class="bg-white rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-red-600">{{ outOfStockItems.length }}</div>
                      <div class="text-gray-600">Hết hàng</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-gray-600">{{ discontinuedItems.length }}</div>
                      <div class="text-gray-600">Ngừng kinh doanh</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-green-600">{{ availableItems.length }}</div>
                      <div class="text-gray-600">Có thể đặt</div>
                    </div>
                  </div>
                  
                  <!-- Additional Summary Items -->
                  <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <!-- Low Stock Summary -->
                    <div v-if="lowStockItems.length > 0" class="bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-yellow-700">{{ lowStockItems.length }}</div>
                      <div class="text-yellow-700 text-sm">Tồn kho thấp</div>
                    </div>
                    
                    <!-- Filtered Items Summary -->
                    <div v-if="filteredItems.length > 0" class="bg-orange-100 border border-orange-200 rounded-lg p-3 text-center">
                      <div class="text-lg font-bold text-orange-700">{{ filteredItems.length }}</div>
                      <div class="text-orange-700 text-sm">Bị loại bỏ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Out of Stock Items -->
            <div v-if="outOfStockItems.length > 0" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-times-circle text-red-500"></i>
                  Sản phẩm hết hàng ({{ outOfStockItems.length }})
                </h3>
                <button 
                  @click="removeAllOutOfStock"
                  class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <i class="fas fa-trash mr-1"></i>
                  Xóa tất cả
                </button>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="item in outOfStockItems" 
                  :key="item.id"
                  class="bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <div class="flex items-center space-x-4">
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white"
                      @error="handleImageError"
                    />
                    
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">{{ item.title }}</h4>
                      <p class="text-sm text-gray-600">{{ item.manufacturer }}</p>
                      <div class="flex items-center space-x-4 mt-2 text-sm">
                        <span class="text-gray-600">SL: {{ item.quantity }}</span>
                        <span class="text-gray-600">{{ formatPrice(item.priceValue) }}</span>
                        <span class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          Hết hàng
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-col space-y-2">
                      <button 
                        @click="findAlternative(item)"
                        class="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i class="fas fa-search mr-1"></i>
                        Tìm thay thế
                      </button>
                      <button 
                        @click="removeItem(item.id)"
                        class="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i class="fas fa-trash mr-1"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Discontinued Items -->
            <div v-if="discontinuedItems.length > 0" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-ban text-gray-500"></i>
                  Sản phẩm ngừng kinh doanh ({{ discontinuedItems.length }})
                </h3>
                <button 
                  @click="removeAllDiscontinued"
                  class="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <i class="fas fa-trash mr-1"></i>
                  Xóa tất cả
                </button>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="item in discontinuedItems" 
                  :key="item.id"
                  class="bg-gray-50 border border-gray-200 rounded-xl p-4"
                >
                  <div class="flex items-center space-x-4">
                    <div class="relative">
                      <img 
                        :src="item.image" 
                        :alt="item.title"
                        class="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white opacity-60"
                        @error="handleImageError"
                      />
                      <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-ban text-gray-500 text-xl"></i>
                      </div>
                    </div>
                    
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">{{ item.title }}</h4>
                      <p class="text-sm text-gray-600">{{ item.manufacturer }}</p>
                      <div class="flex items-center space-x-4 mt-2 text-sm">
                        <span class="text-gray-600">SL: {{ item.quantity }}</span>
                        <span class="text-gray-600">{{ formatPrice(item.priceValue) }}</span>
                        <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                          Ngừng kinh doanh
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-col space-y-2">
                      <button 
                        @click="findAlternative(item)"
                        class="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i class="fas fa-search mr-1"></i>
                        Tìm thay thế
                      </button>
                      <button 
                        @click="removeItem(item.id)"
                        class="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i class="fas fa-trash mr-1"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtered Items (0 quantity) -->
            <div v-if="filteredItems && filteredItems.length > 0" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-exclamation-circle text-orange-500"></i>
                  Sản phẩm bị loại bỏ ({{ filteredItems.length }})
                </h3>
                <button 
                  @click="removeAllFiltered"
                  class="text-sm text-orange-600 hover:text-orange-800 transition-colors duration-200"
                >
                  <i class="fas fa-trash mr-1"></i>
                  Xóa tất cả
                </button>
              </div>

              <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div class="mb-3 p-3 bg-orange-100 rounded-lg">
                  <div class="flex items-center space-x-2 text-sm text-orange-800">
                    <i class="fas fa-info-circle"></i>
                    <span>
                      <strong>Lưu ý:</strong> Các sản phẩm này có số lượng 0 trong giỏ hàng và đã được loại bỏ khỏi đơn hàng.
                    </span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div 
                    v-for="item in filteredItems" 
                    :key="item.id"
                    class="flex items-center space-x-4 bg-white rounded-lg p-3 border border-orange-200"
                  >
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="w-12 h-12 object-contain rounded-lg border border-gray-200 opacity-60"
                      @error="handleImageError"
                    />
                    
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                      <p class="text-sm text-gray-600">{{ item.manufacturer }}</p>
                      <div class="flex items-center space-x-4 mt-1 text-sm">
                        <span class="text-gray-600">SL yêu cầu: {{ item.quantity }}</span>
                        <span class="text-gray-600">{{ formatPrice(item.priceValue) }}</span>
                        <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                          Số lượng 0
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-col space-y-2">
                      <button 
                        @click="removeItem(item.id)"
                        class="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      >
                        <i class="fas fa-trash mr-1"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Available Items -->
            <div v-if="availableItems.length > 0" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-check-circle text-green-500"></i>
                Sản phẩm có thể đặt hàng ({{ availableItems.length }})
              </h3>

              <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                <div class="space-y-3">
                  <div 
                    v-for="item in availableItems" 
                    :key="item.id"
                    class="flex items-center space-x-4 bg-white rounded-lg p-3"
                  >
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="w-12 h-12 object-contain rounded-lg border border-gray-200"
                      @error="handleImageError"
                    />
                    
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                      <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span>SL: {{ item.quantity }}</span>
                        <span>{{ formatPrice(item.priceValue) }}</span>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-sm font-medium text-green-600">
                        {{ formatPrice(item.priceValue * item.quantity) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-green-200">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-900">Tổng tiền có thể đặt:</span>
                    <span class="text-xl font-bold text-green-600">{{ formatPrice(availableTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Low Stock Warnings -->
            <div v-if="lowStockItems && lowStockItems.length > 0" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-exclamation-triangle text-yellow-500"></i>
                Cảnh báo tồn kho thấp ({{ lowStockItems.length }})
              </h3>

              <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div class="space-y-3">
                  <div 
                    v-for="item in lowStockItems" 
                    :key="item.id"
                    class="flex items-center space-x-4 bg-white rounded-lg p-3 border border-yellow-200"
                  >
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="w-12 h-12 object-contain rounded-lg border border-gray-200"
                      @error="handleImageError"
                    />
                    
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                      <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-600">SL yêu cầu: {{ item.quantity }}</span>
                        <span class="text-gray-600">{{ formatPrice(item.priceValue) }}</span>
                        <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Còn {{ item.currentStock || 'ít' }} sản phẩm
                        </span>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-sm font-medium text-yellow-600">
                        {{ formatPrice(item.priceValue * item.quantity) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-3 p-3 bg-yellow-100 rounded-lg">
                  <div class="flex items-center space-x-2 text-sm text-yellow-800">
                    <i class="fas fa-info-circle"></i>
                    <span>
                      <strong>Lưu ý:</strong> Sản phẩm này có tồn kho thấp. 
                      Vui lòng đặt hàng nhanh để đảm bảo có sẵn hàng.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alternative Products Suggestions -->
            <div v-if="suggestedAlternatives.length > 0" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i class="fas fa-lightbulb text-yellow-500"></i>
                Sản phẩm thay thế gợi ý
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="alternative in suggestedAlternatives" 
                  :key="alternative.id"
                  class="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <div class="flex items-center space-x-3">
                    <img 
                      :src="alternative.image" 
                      :alt="alternative.title"
                      class="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white"
                      @error="handleImageError"
                    />
                    
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ alternative.title }}</h4>
                      <p class="text-sm text-gray-600">{{ alternative.manufacturer }}</p>
                      <div class="text-sm font-medium text-blue-600">{{ formatPrice(alternative.priceValue) }}</div>
                    </div>

                    <button 
                      @click="addAlternative(alternative)"
                      class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                    >
                      <i class="fas fa-plus mr-1"></i>
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <button 
              type="button"
              @click="$emit('close')"
              :disabled="processing"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Quay lại giỏ hàng
            </button>
            
            <button 
              v-if="availableItems.length > 0"
              @click="proceedWithAvailable"
              :disabled="processing"
              class="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <i v-if="processing" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-shopping-cart mr-2"></i>
              {{ processing ? 'Đang xử lý...' : `Đặt hàng (${availableItems.length} sản phẩm)` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  cartIssues: {
    type: Object,
    default: () => ({
      outOfStock: [],
      discontinued: [],
      available: [],
      lowStock: [], // Added lowStock to the default prop
      filtered: [] // Added filtered to the default prop
    })
  },
  refreshing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'proceed', 'remove-item', 'add-alternative'])

// Reactive state
const processing = ref(false)
const refreshing = ref(false) // New state for refreshing
const suggestedAlternatives = ref([])

// Computed properties that directly use the cartIssues prop
const outOfStockItems = computed(() => {
  console.log('Computing outOfStockItems:', props.cartIssues?.outOfStock)
  return props.cartIssues?.outOfStock || []
})

const discontinuedItems = computed(() => {
  console.log('Computing discontinuedItems:', props.cartIssues?.discontinued)
  return props.cartIssues?.discontinued || []
})

const availableItems = computed(() => {
  console.log('Computing availableItems:', props.cartIssues?.available)
  return props.cartIssues?.available || []
})

const lowStockItems = computed(() => {
  console.log('Computing lowStockItems:', props.cartIssues?.lowStock)
  return props.cartIssues?.lowStock || []
})

const filteredItems = computed(() => {
  console.log('Computing filteredItems:', props.cartIssues?.filtered)
  console.log('Full cartIssues prop:', props.cartIssues)
  const result = props.cartIssues?.filtered || []
  console.log('Filtered items computed result:', result)
  return result
})

const availableTotal = computed(() => {
  return availableItems.value.reduce((total, item) => {
    return total + (item.priceValue * item.quantity)
  }, 0)
})

// Watch for changes in cartIssues prop
watch(() => props.cartIssues, (newCartIssues, oldCartIssues) => {
  console.log('CartIssuesModal: cartIssues prop changed:', {
    from: oldCartIssues,
    to: newCartIssues
  })
  console.log('New cartIssues structure:', {
    outOfStock: newCartIssues?.outOfStock?.length || 0,
    discontinued: newCartIssues?.discontinued?.length || 0,
    available: newCartIssues?.available?.length || 0,
    lowStock: newCartIssues?.lowStock?.length || 0,
    filtered: newCartIssues?.filtered?.length || 0
  })
  console.log('Filtered items received:', newCartIssues?.filtered)
}, { deep: true, immediate: true })

// Methods
const removeItem = (itemId) => {
  emit('remove-item', itemId)
}

const removeAllOutOfStock = () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${outOfStockItems.value.length} sản phẩm hết hàng?`)) {
    outOfStockItems.value.forEach(item => {
      emit('remove-item', item.id)
    })
  }
}

const removeAllDiscontinued = () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${discontinuedItems.value.length} sản phẩm ngừng kinh doanh?`)) {
    discontinuedItems.value.forEach(item => {
      emit('remove-item', item.id)
    })
  }
}

const removeAllFiltered = () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${filteredItems.value.length} sản phẩm bị loại bỏ?`)) {
    filteredItems.value.forEach(item => {
      emit('remove-item', item.id)
    })
  }
}

const findAlternative = async (item) => {
  // Simulate finding alternatives
  const mockAlternatives = [
    {
      id: Math.random(),
      title: `${item.title} - Phiên bản thay thế`,
      manufacturer: item.manufacturer,
      priceValue: item.priceValue * 1.1,
      image: item.image,
      category: item.category
    },
    {
      id: Math.random(),
      title: `Sản phẩm tương tự ${item.title}`,
      manufacturer: 'Nhà sản xuất khác',
      priceValue: item.priceValue * 0.9,
      image: item.image,
      category: item.category
    }
  ]
  
  suggestedAlternatives.value = mockAlternatives
}

const addAlternative = (alternative) => {
  emit('add-alternative', alternative)
  // Remove from suggestions after adding
  const index = suggestedAlternatives.value.findIndex(item => item.id === alternative.id)
  if (index > -1) {
    suggestedAlternatives.value.splice(index, 1)
  }
}

const proceedWithAvailable = async () => {
  processing.value = true
  
  try {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('proceed', {
      availableItems: availableItems.value,
      total: availableTotal.value
    })
  } catch (error) {
    console.error('Processing error:', error)
  } finally {
    processing.value = false
  }
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

const handleImageError = (event) => {
  event.target.src = '/img/products/placeholder-product.jpg'
}
</script>

<style scoped>
/* Modal fade-in and fade-out transition styles */
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
