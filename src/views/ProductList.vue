<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- FILTER SIDEBAR -->
      <aside class="lg:w-64 w-full bg-white rounded-xl shadow-sm p-4 text-sm">
        <h2 class="font-semibold text-gray-800 mb-4 flex items-center justify-between">
          Bộ lọc nâng cao
          <i class="fas fa-sliders-h text-gray-500"></i>
        </h2>

        <!-- Filter Sections -->
        <FilterSection
          v-for="section in filters"
          :key="section.label"
          :section="section"
          v-model="activeFilters[section.label]"
          @update:modelValue="applyFilters"
        />

        <!-- Clear Filters Button -->
        <button 
          @click="clearAllFilters"
          class="w-full mt-4 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Xóa tất cả bộ lọc
        </button>
      </aside>

      <!-- PRODUCT LIST -->
      <div class="flex-1">
        <!-- Top Row -->
        <div class="flex flex-wrap items-center justify-between mb-4 text-sm">
          <p class="text-gray-600">
            Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
          </p>
          <div class="flex gap-2 items-center">
            <span class="text-gray-700 font-medium">Sắp xếp theo:</span>
            <button 
              @click="setSortBy('bestseller')"
              :class="[
                'px-3 py-1 rounded-full transition',
                sortBy === 'bestseller' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 border hover:bg-gray-50'
              ]"
            >
              Bán chạy
            </button>
            <button 
              @click="setSortBy('price_asc')"
              :class="[
                'px-3 py-1 rounded-full transition',
                sortBy === 'price_asc' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 border hover:bg-gray-50'
              ]"
            >
              Giá thấp
            </button>
            <button 
              @click="setSortBy('price_desc')"
              :class="[
                'px-3 py-1 rounded-full transition',
                sortBy === 'price_desc' 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-600 border hover:bg-gray-50'
              ]"
            >
              Giá cao
            </button>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-4 text-sm text-gray-600">
          <span>
            Hiển thị {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredProducts.length) }} 
            của {{ filteredProducts.length }} sản phẩm
          </span>
          <div class="flex items-center gap-2">
            <span>Hiển thị:</span>
            <select 
              v-model="itemsPerPage" 
              @change="goToPage(1)"
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="24">24</option>
              <option value="32">32</option>
            </select>
            <span>sản phẩm</span>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          <ProductCard
            v-for="(product, index) in paginatedProducts"
            :key="`${product.title}-${index}`"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- No Results Message -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg mb-2">
            <i class="fas fa-search text-3xl mb-4"></i>
          </div>
          <p class="text-gray-600 text-lg mb-2">Không tìm thấy sản phẩm nào</p>
          <p class="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>

        <!-- Pagination -->
        <PaginationControls
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import ProductCard from '../components/ProductList/ProductCard.vue'
import FilterSection from '../components/ProductList/FilterSection.vue'
import PaginationControls from '../components/ProductList/PaginationControls.vue'

// Filter configuration
const filters = [
  {
    label: "Đối tượng sử dụng",
    options: ["Tất cả", "Trẻ em", "Người trưởng thành", "Người lớn", "Người cao tuổi"],
  },
  {
    label: "Giá bán",
    options: ["Dưới 100.000đ", "100.000đ đến 300.000đ", "300.000đ đến 500.000đ", "Trên 500.000đ"],
  },
  {
    label: "Mùi vị / Mùi hương",
    options: ["Tất cả", "Vani", "Vị Cam", "Vị Dâu", "Hương cam"],
  },
  {
    label: "Nhà sản xuất",
    options: ["Pharmacity", "Dược Hậu Giang", "Mega We Care", "Traphaco"],
  },
]

// Sample products data
const allProducts = [
  {
    id: 1,
    title: "Siro Bổ Phế Labebe 120ml hỗ trợ bổ phế, giảm ho, giảm đờm",
    price: "75.000đ",
    priceValue: 75000,
    unit: "Hộp",
    image: "/products/siro-labebe.webp",
    category: "Trẻ em",
    manufacturer: "Pharmacity",
    flavor: "Vị Cam"
  },
  {
    id: 2,
    title: "Viên uống Immuvita Easylife bổ sung vitamin và khoáng chất",
    price: "390.000đ",
    priceValue: 390000,
    unit: "Hộp 100 Viên",
    image: "/products/immuvita.webp",
    category: "Người trưởng thành",
    manufacturer: "Mega We Care",
    flavor: "Tất cả"
  },
  {
    id: 3,
    title: "Siro Canxi-D3-K2 5ml Kingphar bổ sung canxi",
    price: "105.000đ",
    priceValue: 105000,
    unit: "Hộp 6 ống",
    image: "/products/canxi-d3.webp",
    category: "Trẻ em",
    manufacturer: "Dược Hậu Giang",
    flavor: "Vani"
  },
  {
    id: 4,
    title: "Viên uống Cordyceps 1500mg hỗ trợ tăng sức đề kháng",
    price: "595.000đ",
    priceValue: 595000,
    unit: "Hộp 60 viên",
    image: "/products/cordyceps.webp",
    category: "Người lớn",
    manufacturer: "Traphaco",
    flavor: "Tất cả"
  },
  {
    id: 5,
    title: "Thực phẩm chức năng Omega 3 Plus",
    price: "920.000đ",
    priceValue: 920000,
    unit: "Hộp 120 Viên",
    image: "/products/omega3.webp",
    discount: 10,
    category: "Người cao tuổi",
    manufacturer: "Mega We Care",
    flavor: "Tất cả"
  },
  {
    id: 6,
    title: "Vitamin C 1000mg tăng cường miễn dịch",
    price: "250.000đ",
    priceValue: 250000,
    unit: "Hộp 60 viên",
    image: "/products/vitamin-c.webp",
    category: "Người trưởng thành",
    manufacturer: "Pharmacity",
    flavor: "Vị Cam"
  },
  {
    id: 7,
    title: "Probiotics hỗ trợ tiêu hóa cho trẻ em",
    price: "180.000đ",
    priceValue: 180000,
    unit: "Hộp 30 gói",
    image: "/products/probiotics.webp",
    category: "Trẻ em",
    manufacturer: "Dược Hậu Giang",
    flavor: "Vị Dâu",
    discount: 15
  },
  {
    id: 8,
    title: "Glucosamine 1500mg bảo vệ khớp",
    price: "450.000đ",
    priceValue: 450000,
    unit: "Hộp 90 viên",
    image: "/products/glucosamine.webp",
    category: "Người cao tuổi",
    manufacturer: "Traphaco",
    flavor: "Tất cả"
  },
  {
    id: 9,
    title: "Siro ho cho trẻ em Natural Honey",
    price: "85.000đ",
    priceValue: 85000,
    unit: "Chai 100ml",
    image: "/products/siro-ho.webp",
    category: "Trẻ em",
    manufacturer: "Pharmacity",
    flavor: "Hương cam"
  }
]

// Reactive state
const activeFilters = reactive({
  "Đối tượng sử dụng": [],
  "Giá bán": [],
  "Mùi vị / Mùi hương": [],
  "Nhà sản xuất": []
})

const sortBy = ref('bestseller')
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Computed properties
const filteredProducts = computed(() => {
  let products = [...allProducts]

  // Apply filters
  Object.keys(activeFilters).forEach(filterType => {
    const selectedOptions = activeFilters[filterType]
    if (selectedOptions.length > 0) {
      products = products.filter(product => {
        return selectedOptions.some(option => {
          switch (filterType) {
            case "Đối tượng sử dụng":
              return option === "Tất cả" || product.category === option
            case "Giá bán":
              return checkPriceRange(product.priceValue, option)
            case "Mùi vị / Mùi hương":
              return option === "Tất cả" || product.flavor === option
            case "Nhà sản xuất":
              return product.manufacturer === option
            default:
              return true
          }
        })
      })
    }
  })

  // Apply sorting
  switch (sortBy.value) {
    case 'price_asc':
      products.sort((a, b) => a.priceValue - b.priceValue)
      break
    case 'price_desc':
      products.sort((a, b) => b.priceValue - a.priceValue)
      break
    case 'bestseller':
    default:
      // Keep original order for bestseller
      break
  }

  return products
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage.value
})

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value)
})

// Methods
const checkPriceRange = (price, range) => {
  switch (range) {
    case "Dưới 100.000đ":
      return price < 100000
    case "100.000đ đến 300.000đ":
      return price >= 100000 && price <= 300000
    case "300.000đ đến 500.000đ":
      return price >= 300000 && price <= 500000
    case "Trên 500.000đ":
      return price > 500000
    default:
      return true
  }
}

const setSortBy = (sort) => {
  sortBy.value = sort
  goToPage(1)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const applyFilters = () => {
  goToPage(1)
}

const clearAllFilters = () => {
  Object.keys(activeFilters).forEach(key => {
    activeFilters[key] = []
  })
  goToPage(1)
}

const handleAddToCart = (product) => {
  console.log('Adding to cart:', product)
  // Implement your add to cart logic here
  // Could emit to parent component, call API, etc.
}

// Watch for changes that should reset pagination
watch([filteredProducts], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})
</script>

<style scoped>
/* Hide arrows on number inputs */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>