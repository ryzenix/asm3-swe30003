/**
 * Cấu trúc categories mới với ID, key và metadata
 * Hỗ trợ tìm kiếm, lưu trữ database và đa ngôn ngữ
 */

export const CATEGORY_STRUCTURE = {
  // Thuốc
  MEDICINE: {
    id: 1,
    key: 'medicine',
    icon: '💊',
    searchKeywords: ['thuoc', 'medicine', 'drug', 'pharmaceutical'],
    subcategories: {
      PRESCRIPTION: {
        id: 101,
        key: 'prescription',
        parentId: 1,
        icon: '📋',
        searchKeywords: ['ke don', 'prescription', 'rx']
      },
      OTC: {
        id: 102,
        key: 'otc',
        parentId: 1,
        icon: '🏪',
        searchKeywords: ['khong ke don', 'otc', 'over the counter']
      },
      TRADITIONAL: {
        id: 103,
        key: 'traditional',
        parentId: 1,
        icon: '🌿',
        searchKeywords: ['truyen thong', 'traditional', 'herbal']
      },
      COLD_FLU: {
        id: 104,
        key: 'cold_flu',
        parentId: 1,
        icon: '🤧',
        searchKeywords: ['cam cum', 'cold', 'flu', 'fever']
      },
      HEADACHE: {
        id: 105,
        key: 'headache',
        parentId: 1,
        icon: '🤕',
        searchKeywords: ['dau dau', 'headache', 'pain relief']
      }
    }
  },

  // Thực phẩm chức năng
  SUPPLEMENT: {
    id: 2,
    key: 'supplement',
    icon: '💪',
    searchKeywords: ['thuc pham chuc nang', 'supplement', 'functional food'],
    subcategories: {
      VITAMIN_MINERAL: {
        id: 201,
        key: 'vitamin_mineral',
        parentId: 2,
        icon: '🍊',
        searchKeywords: ['vitamin', 'khoang chat', 'mineral']
      },
      IMMUNE_SUPPORT: {
        id: 202,
        key: 'immune_support',
        parentId: 2,
        icon: '🛡️',
        searchKeywords: ['tang cuong mien dich', 'immune', 'immunity']
      },
      DIGESTIVE: {
        id: 203,
        key: 'digestive',
        parentId: 2,
        icon: '🫃',
        searchKeywords: ['ho tro tieu hoa', 'digestive', 'probiotics']
      },
      BRAIN_MEMORY: {
        id: 204,
        key: 'brain_memory',
        parentId: 2,
        icon: '🧠',
        searchKeywords: ['bo nao', 'tri nho', 'brain', 'memory']
      },
      BONE_JOINT: {
        id: 205,
        key: 'bone_joint',
        parentId: 2,
        icon: '🦴',
        searchKeywords: ['xuong khop', 'bone', 'joint', 'calcium']
      }
    }
  },

  // Dược mỹ phẩm
  COSMECEUTICAL: {
    id: 3,
    key: 'cosmeceutical',
    icon: '✨',
    searchKeywords: ['duoc my pham', 'cosmeceutical', 'skincare'],
    subcategories: {
      SUNSCREEN: {
        id: 301,
        key: 'sunscreen',
        parentId: 3,
        icon: '☀️',
        searchKeywords: ['chong nang', 'sunscreen', 'spf']
      },
      ACNE_TREATMENT: {
        id: 302,
        key: 'acne_treatment',
        parentId: 3,
        icon: '🎯',
        searchKeywords: ['tri mun', 'acne', 'pimple']
      },
      ANTI_AGING: {
        id: 303,
        key: 'anti_aging',
        parentId: 3,
        icon: '⏰',
        searchKeywords: ['chong lao hoa', 'anti aging', 'wrinkle']
      },
      MOISTURIZER: {
        id: 304,
        key: 'moisturizer',
        parentId: 3,
        icon: '💧',
        searchKeywords: ['duong am', 'moisturizer', 'hydrating']
      },
      CLEANSER: {
        id: 305,
        key: 'cleanser',
        parentId: 3,
        icon: '🧼',
        searchKeywords: ['lam sach da', 'cleanser', 'face wash']
      }
    }
  },

  // Chăm sóc cá nhân
  PERSONAL_CARE: {
    id: 4,
    key: 'personal_care',
    icon: '🧴',
    searchKeywords: ['cham soc ca nhan', 'personal care', 'hygiene'],
    subcategories: {
      ORAL_CARE: {
        id: 401,
        key: 'oral_care',
        parentId: 4,
        icon: '🦷',
        searchKeywords: ['ve sinh rang mieng', 'oral care', 'dental']
      },
      HAIR_CARE: {
        id: 402,
        key: 'hair_care',
        parentId: 4,
        icon: '💇',
        searchKeywords: ['cham soc toc', 'hair care', 'shampoo']
      },
      DEODORANT: {
        id: 403,
        key: 'deodorant',
        parentId: 4,
        icon: '🌸',
        searchKeywords: ['khu mui co the', 'deodorant', 'antiperspirant']
      },
      BODY_WASH: {
        id: 404,
        key: 'body_wash',
        parentId: 4,
        icon: '🛁',
        searchKeywords: ['tam goi', 'body wash', 'shower gel']
      }
    }
  },

  // Mẹ & bé
  MOTHER_BABY: {
    id: 5,
    key: 'mother_baby',
    icon: '👶',
    searchKeywords: ['me be', 'mother baby', 'infant'],
    subcategories: {
      BABY_FORMULA: {
        id: 501,
        key: 'baby_formula',
        parentId: 5,
        icon: '🍼',
        searchKeywords: ['sua bot', 'baby formula', 'milk powder']
      },
      DIAPERS: {
        id: 502,
        key: 'diapers',
        parentId: 5,
        icon: '👶',
        searchKeywords: ['bim ta', 'diapers', 'nappies']
      },
      BABY_SUPPLIES: {
        id: 503,
        key: 'baby_supplies',
        parentId: 5,
        icon: '🧸',
        searchKeywords: ['do dung cho be', 'baby supplies', 'baby items']
      },
      MATERNITY: {
        id: 504,
        key: 'maternity',
        parentId: 5,
        icon: '🤱',
        searchKeywords: ['cham soc me bau', 'maternity', 'pregnancy']
      },
      BABY_FOOD: {
        id: 505,
        key: 'baby_food',
        parentId: 5,
        icon: '🥄',
        searchKeywords: ['thuc pham an dam', 'baby food', 'weaning']
      }
    }
  },

  // Dụng cụ y tế
  MEDICAL_DEVICE: {
    id: 6,
    key: 'medical_device',
    icon: '🩺',
    searchKeywords: ['dung cu y te', 'medical device', 'healthcare'],
    subcategories: {
      BLOOD_PRESSURE: {
        id: 601,
        key: 'blood_pressure',
        parentId: 6,
        icon: '🩸',
        searchKeywords: ['may do huyet ap', 'blood pressure', 'sphygmomanometer']
      },
      GLUCOSE_METER: {
        id: 602,
        key: 'glucose_meter',
        parentId: 6,
        icon: '🩸',
        searchKeywords: ['may do duong huyet', 'glucose meter', 'blood sugar']
      },
      THERMOMETER: {
        id: 603,
        key: 'thermometer',
        parentId: 6,
        icon: '🌡️',
        searchKeywords: ['nhiet ke', 'thermometer', 'temperature']
      },
      MEDICAL_MASK: {
        id: 604,
        key: 'medical_mask',
        parentId: 6,
        icon: '😷',
        searchKeywords: ['khau trang y te', 'medical mask', 'surgical mask']
      },
      BANDAGE: {
        id: 605,
        key: 'bandage',
        parentId: 6,
        icon: '🩹',
        searchKeywords: ['bang gac', 'bandage', 'gauze']
      }
    }
  }
}

// Helper functions để làm việc với cấu trúc mới
export const getCategoryById = (id) => {
  for (const [categoryKey, category] of Object.entries(CATEGORY_STRUCTURE)) {
    if (category.id === id) {
      return { key: categoryKey, ...category }
    }
    
    if (category.subcategories) {
      for (const [subKey, subcategory] of Object.entries(category.subcategories)) {
        if (subcategory.id === id) {
          return { key: subKey, ...subcategory }
        }
      }
    }
  }
  return null
}

export const getCategoryByKey = (key) => {
  for (const [categoryKey, category] of Object.entries(CATEGORY_STRUCTURE)) {
    if (categoryKey === key.toUpperCase()) {
      return { key: categoryKey, ...category }
    }
    
    if (category.subcategories) {
      for (const [subKey, subcategory] of Object.entries(category.subcategories)) {
        if (subKey === key.toUpperCase()) {
          return { key: subKey, ...subcategory }
        }
      }
    }
  }
  return null
}

export const getSubcategoriesByParentId = (parentId) => {
  const category = getCategoryById(parentId)
  if (!category || !category.subcategories) return []
  
  return Object.entries(category.subcategories).map(([key, subcategory]) => ({
    key,
    ...subcategory
  }))
}

export const getAllMainCategories = () => {
  return Object.entries(CATEGORY_STRUCTURE).map(([key, category]) => ({
    key,
    ...category
  }))
}

export const searchCategories = (searchTerm) => {
  const results = []
  const term = searchTerm.toLowerCase()
  
  for (const [categoryKey, category] of Object.entries(CATEGORY_STRUCTURE)) {
    // Tìm trong main category
    if (category.searchKeywords.some(keyword => keyword.includes(term))) {
      results.push({ key: categoryKey, ...category, type: 'main' })
    }
    
    // Tìm trong subcategories
    if (category.subcategories) {
      for (const [subKey, subcategory] of Object.entries(category.subcategories)) {
        if (subcategory.searchKeywords.some(keyword => keyword.includes(term))) {
          results.push({ key: subKey, ...subcategory, type: 'sub' })
        }
      }
    }
  }
  
  return results
}