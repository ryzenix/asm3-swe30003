/**
 * CategoryService - Service để quản lý categories với các tính năng:
 * - Tìm kiếm categories
 * - Lấy thông tin categories với translations
 * - Utilities cho database operations
 * - Cache management
 */

import { 
  CATEGORY_STRUCTURE,
  getCategoryById,
  getCategoryByKey,
  getSubcategoriesByParentId,
  getAllMainCategories,
  searchCategories
} from '../constants/categoryStructure.js'

import { 
  getCategoryTranslation,
  getCategoryDescription,
  getCategoryWithTranslations
} from '../i18n/categories.js'

class CategoryService {
  constructor() {
    this.cache = new Map()
    this.currentLanguage = 'vi'
  }

  /**
   * Set ngôn ngữ hiện tại
   */
  setLanguage(language) {
    this.currentLanguage = language
    this.clearCache() // Clear cache khi đổi ngôn ngữ
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Lấy tất cả main categories với translations
   */
  getMainCategories(language = this.currentLanguage) {
    const cacheKey = `main_categories_${language}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const categories = getAllMainCategories().map(category => ({
      ...category,
      name: getCategoryTranslation(category.key.toLowerCase(), language),
      description: getCategoryDescription(category.key.toLowerCase(), language)
    }))

    this.cache.set(cacheKey, categories)
    return categories
  }

  /**
   * Lấy subcategories của một main category
   */
  getSubcategories(parentId, language = this.currentLanguage) {
    const cacheKey = `subcategories_${parentId}_${language}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const subcategories = getSubcategoriesByParentId(parentId).map(subcategory => ({
      ...subcategory,
      name: getCategoryTranslation(subcategory.key.toLowerCase(), language),
      description: getCategoryDescription(subcategory.key.toLowerCase(), language)
    }))

    this.cache.set(cacheKey, subcategories)
    return subcategories
  }

  /**
   * Lấy thông tin category theo ID
   */
  getCategoryInfo(id, language = this.currentLanguage) {
    const cacheKey = `category_${id}_${language}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const category = getCategoryById(id)
    if (!category) return null

    const categoryInfo = {
      ...category,
      name: getCategoryTranslation(category.key.toLowerCase(), language),
      description: getCategoryDescription(category.key.toLowerCase(), language)
    }

    this.cache.set(cacheKey, categoryInfo)
    return categoryInfo
  }

  /**
   * Lấy thông tin category theo key
   */
  getCategoryByKeyName(key, language = this.currentLanguage) {
    const cacheKey = `category_key_${key}_${language}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const category = getCategoryByKey(key)
    if (!category) return null

    const categoryInfo = {
      ...category,
      name: getCategoryTranslation(category.key.toLowerCase(), language),
      description: getCategoryDescription(category.key.toLowerCase(), language)
    }

    this.cache.set(cacheKey, categoryInfo)
    return categoryInfo
  }

  /**
   * Tìm kiếm categories
   */
  searchCategoriesByTerm(searchTerm, language = this.currentLanguage) {
    const results = searchCategories(searchTerm)
    
    return results.map(category => ({
      ...category,
      name: getCategoryTranslation(category.key.toLowerCase(), language),
      description: getCategoryDescription(category.key.toLowerCase(), language)
    }))
  }

  /**
   * Lấy category hierarchy (main category + subcategory)
   */
  getCategoryHierarchy(categoryId, subcategoryId = null, language = this.currentLanguage) {
    const mainCategory = this.getCategoryInfo(categoryId, language)
    if (!mainCategory) return null

    const result = {
      main: mainCategory,
      sub: null
    }

    if (subcategoryId) {
      result.sub = this.getCategoryInfo(subcategoryId, language)
    }

    return result
  }

  /**
   * Validate category và subcategory
   */
  validateCategoryPair(categoryId, subcategoryId = null) {
    const mainCategory = getCategoryById(categoryId)
    if (!mainCategory) {
      return { valid: false, error: 'Invalid main category ID' }
    }

    if (subcategoryId) {
      const subcategory = getCategoryById(subcategoryId)
      if (!subcategory) {
        return { valid: false, error: 'Invalid subcategory ID' }
      }

      if (subcategory.parentId !== categoryId) {
        return { valid: false, error: 'Subcategory does not belong to the specified main category' }
      }
    }

    return { valid: true }
  }

  /**
   * Lấy breadcrumb cho category
   */
  getCategoryBreadcrumb(categoryId, subcategoryId = null, language = this.currentLanguage) {
    const breadcrumb = []
    
    const mainCategory = this.getCategoryInfo(categoryId, language)
    if (mainCategory) {
      breadcrumb.push({
        id: mainCategory.id,
        key: mainCategory.key,
        name: mainCategory.name,
        type: 'main'
      })

      if (subcategoryId) {
        const subcategory = this.getCategoryInfo(subcategoryId, language)
        if (subcategory) {
          breadcrumb.push({
            id: subcategory.id,
            key: subcategory.key,
            name: subcategory.name,
            type: 'sub'
          })
        }
      }
    }

    return breadcrumb
  }

  /**
   * Lấy options cho dropdown/select
   */
  getMainCategoryOptions(language = this.currentLanguage) {
    return this.getMainCategories(language).map(category => ({
      value: category.id,
      label: category.name,
      key: category.key,
      icon: category.icon
    }))
  }

  /**
   * Lấy subcategory options cho dropdown/select
   */
  getSubcategoryOptions(parentId, language = this.currentLanguage) {
    return this.getSubcategories(parentId, language).map(subcategory => ({
      value: subcategory.id,
      label: subcategory.name,
      key: subcategory.key,
      icon: subcategory.icon
    }))
  }

  /**
   * Convert từ old format (string) sang new format (ID)
   * Dùng cho migration
   */
  convertLegacyCategoryToId(categoryName, subcategoryName = null) {
    // Mapping từ tên cũ sang key mới
    const legacyMapping = {
      'Thuốc': 'medicine',
      'Thực phẩm chức năng': 'supplement',
      'Dược mỹ phẩm': 'cosmeceutical',
      'Chăm sóc cá nhân': 'personal_care',
      'Mẹ & bé': 'mother_baby',
      'Dụng cụ y tế': 'medical_device',
      
      // Subcategories
      'Thuốc kê đơn': 'prescription',
      'Thuốc không kê đơn': 'otc',
      'Thuốc truyền thống': 'traditional',
      'Thuốc cảm cúm': 'cold_flu',
      'Thuốc đau đầu': 'headache',
      'Vitamin & Khoáng chất': 'vitamin_mineral',
      'Tăng cường miễn dịch': 'immune_support',
      'Hỗ trợ tiêu hóa': 'digestive',
      'Bổ não, cải thiện trí nhớ': 'brain_memory',
      'Hỗ trợ xương khớp': 'bone_joint',
      'Chống nắng': 'sunscreen',
      'Trị mụn': 'acne_treatment',
      'Chống lão hóa': 'anti_aging',
      'Dưỡng ẩm': 'moisturizer',
      'Làm sạch da': 'cleanser',
      'Vệ sinh răng miệng': 'oral_care',
      'Chăm sóc tóc': 'hair_care',
      'Khử mùi cơ thể': 'deodorant',
      'Tắm gội': 'body_wash',
      'Sữa bột': 'baby_formula',
      'Bỉm tã': 'diapers',
      'Đồ dùng cho bé': 'baby_supplies',
      'Chăm sóc mẹ bầu': 'maternity',
      'Thực phẩm ăn dặm': 'baby_food',
      'Máy đo huyết áp': 'blood_pressure',
      'Máy đo đường huyết': 'glucose_meter',
      'Nhiệt kế': 'thermometer',
      'Khẩu trang y tế': 'medical_mask',
      'Băng gạc': 'bandage'
    }

    const categoryKey = legacyMapping[categoryName]
    if (!categoryKey) return null

    const category = getCategoryByKey(categoryKey)
    if (!category) return null

    const result = { categoryId: category.id, subcategoryId: null }

    if (subcategoryName) {
      const subcategoryKey = legacyMapping[subcategoryName]
      if (subcategoryKey) {
        const subcategory = getCategoryByKey(subcategoryKey)
        if (subcategory && subcategory.parentId === category.id) {
          result.subcategoryId = subcategory.id
        }
      }
    }

    return result
  }

  /**
   * Lấy statistics về categories
   */
  getCategoryStats() {
    const mainCategories = getAllMainCategories()
    let totalSubcategories = 0

    mainCategories.forEach(category => {
      if (category.subcategories) {
        totalSubcategories += Object.keys(category.subcategories).length
      }
    })

    return {
      totalMainCategories: mainCategories.length,
      totalSubcategories,
      totalCategories: mainCategories.length + totalSubcategories
    }
  }
}

// Export singleton instance
export const categoryService = new CategoryService()
export default categoryService

// Export class for testing
export { CategoryService }