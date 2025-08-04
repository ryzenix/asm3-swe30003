/**
 * Composable để sử dụng categories trong Vue components
 * Cung cấp reactive interface cho CategoryService
 */

import { ref, computed, watch } from 'vue'
import categoryService from '../services/categoryService.js'

export function useCategories(initialLanguage = 'vi') {
  // Reactive state
  const currentLanguage = ref(initialLanguage)
  const isLoading = ref(false)
  const error = ref(null)

  // Set language và update service
  const setLanguage = (language) => {
    currentLanguage.value = language
    categoryService.setLanguage(language)
  }

  // Watch language changes
  watch(currentLanguage, (newLanguage) => {
    categoryService.setLanguage(newLanguage)
  }, { immediate: true })

  // Computed properties
  const mainCategories = computed(() => {
    try {
      return categoryService.getMainCategories(currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return []
    }
  })

  const mainCategoryOptions = computed(() => {
    try {
      return categoryService.getMainCategoryOptions(currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return []
    }
  })

  // Methods
  const getSubcategories = (parentId) => {
    try {
      error.value = null
      return categoryService.getSubcategories(parentId, currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return []
    }
  }

  const getSubcategoryOptions = (parentId) => {
    try {
      error.value = null
      return categoryService.getSubcategoryOptions(parentId, currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return []
    }
  }

  const getCategoryInfo = (id) => {
    try {
      error.value = null
      return categoryService.getCategoryInfo(id, currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const getCategoryByKey = (key) => {
    try {
      error.value = null
      return categoryService.getCategoryByKeyName(key, currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const searchCategories = (searchTerm) => {
    try {
      error.value = null
      isLoading.value = true
      const results = categoryService.searchCategoriesByTerm(searchTerm, currentLanguage.value)
      return results
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getCategoryHierarchy = (categoryId, subcategoryId = null) => {
    try {
      error.value = null
      return categoryService.getCategoryHierarchy(categoryId, subcategoryId, currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const validateCategoryPair = (categoryId, subcategoryId = null) => {
    try {
      error.value = null
      return categoryService.validateCategoryPair(categoryId, subcategoryId)
    } catch (err) {
      error.value = err.message
      return { valid: false, error: err.message }
    }
  }

  const getCategoryBreadcrumb = (categoryId, subcategoryId = null) => {
    try {
      error.value = null
      return categoryService.getCategoryBreadcrumb(categoryId, subcategoryId, currentLanguage.value)
    } catch (err) {
      error.value = err.message
      return []
    }
  }

  const convertLegacyCategory = (categoryName, subcategoryName = null) => {
    try {
      error.value = null
      return categoryService.convertLegacyCategoryToId(categoryName, subcategoryName)
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const getCategoryStats = () => {
    try {
      error.value = null
      return categoryService.getCategoryStats()
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Clear cache
  const clearCache = () => {
    categoryService.clearCache()
  }

  return {
    // State
    currentLanguage,
    isLoading,
    error,

    // Computed
    mainCategories,
    mainCategoryOptions,

    // Methods
    setLanguage,
    getSubcategories,
    getSubcategoryOptions,
    getCategoryInfo,
    getCategoryByKey,
    searchCategories,
    getCategoryHierarchy,
    validateCategoryPair,
    getCategoryBreadcrumb,
    convertLegacyCategory,
    getCategoryStats,
    clearError,
    clearCache
  }
}

// Backward compatibility - tạo interface tương thích với code cũ
export function useLegacyCategories() {
  const { 
    mainCategories, 
    getSubcategories, 
    getCategoryInfo,
    convertLegacyCategory 
  } = useCategories()

  // Tạo interface giống với constants/categories.js cũ
  const productCategories = computed(() => {
    const result = {}
    mainCategories.value.forEach(category => {
      const subcategories = getSubcategories(category.id)
      result[category.name] = subcategories.map(sub => sub.name)
    })
    return result
  })

  const mainCategoryNames = computed(() => {
    return mainCategories.value.map(category => category.name)
  })

  const getSubcategoriesByName = (categoryName) => {
    // Convert legacy name to ID first
    const converted = convertLegacyCategory(categoryName)
    if (!converted) return []
    
    return getSubcategories(converted.categoryId).map(sub => sub.name)
  }

  const hasSubcategories = (categoryName) => {
    const subcategories = getSubcategoriesByName(categoryName)
    return subcategories.length > 0
  }

  return {
    productCategories,
    mainCategories: mainCategoryNames,
    getSubcategories: getSubcategoriesByName,
    hasSubcategories
  }
}