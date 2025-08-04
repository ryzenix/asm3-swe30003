/**
 * Translations cho categories - hỗ trợ đa ngôn ngữ
 */

export const categoryTranslations = {
  vi: {
    // Main categories
    medicine: 'Thuốc',
    supplement: 'Thực phẩm chức năng',
    cosmeceutical: 'Dược mỹ phẩm',
    personal_care: 'Chăm sóc cá nhân',
    mother_baby: 'Mẹ & bé',
    medical_device: 'Dụng cụ y tế',

    // Medicine subcategories
    prescription: 'Thuốc kê đơn',
    otc: 'Thuốc không kê đơn',
    traditional: 'Thuốc truyền thống',
    cold_flu: 'Thuốc cảm cúm',
    headache: 'Thuốc đau đầu',

    // Supplement subcategories
    vitamin_mineral: 'Vitamin & Khoáng chất',
    immune_support: 'Tăng cường miễn dịch',
    digestive: 'Hỗ trợ tiêu hóa',
    brain_memory: 'Bổ não, cải thiện trí nhớ',
    bone_joint: 'Hỗ trợ xương khớp',

    // Cosmeceutical subcategories
    sunscreen: 'Chống nắng',
    acne_treatment: 'Trị mụn',
    anti_aging: 'Chống lão hóa',
    moisturizer: 'Dưỡng ẩm',
    cleanser: 'Làm sạch da',

    // Personal care subcategories
    oral_care: 'Vệ sinh răng miệng',
    hair_care: 'Chăm sóc tóc',
    deodorant: 'Khử mùi cơ thể',
    body_wash: 'Tắm gội',

    // Mother & baby subcategories
    baby_formula: 'Sữa bột',
    diapers: 'Bỉm tã',
    baby_supplies: 'Đồ dùng cho bé',
    maternity: 'Chăm sóc mẹ bầu',
    baby_food: 'Thực phẩm ăn dặm',

    // Medical device subcategories
    blood_pressure: 'Máy đo huyết áp',
    glucose_meter: 'Máy đo đường huyết',
    thermometer: 'Nhiệt kế',
    medical_mask: 'Khẩu trang y tế',
    bandage: 'Băng gạc',

    // Descriptions
    descriptions: {
      medicine: 'Các loại thuốc điều trị và phòng ngừa bệnh',
      supplement: 'Thực phẩm bổ sung dinh dưỡng và tăng cường sức khỏe',
      cosmeceutical: 'Sản phẩm chăm sóc da có tính chất dược phẩm',
      personal_care: 'Sản phẩm vệ sinh và chăm sóc cá nhân hàng ngày',
      mother_baby: 'Sản phẩm dành cho mẹ bầu, mẹ sau sinh và trẻ em',
      medical_device: 'Thiết bị y tế và dụng cụ chăm sóc sức khỏe'
    }
  },

  en: {
    // Main categories
    medicine: 'Medicine',
    supplement: 'Supplements',
    cosmeceutical: 'Cosmeceuticals',
    personal_care: 'Personal Care',
    mother_baby: 'Mother & Baby',
    medical_device: 'Medical Devices',

    // Medicine subcategories
    prescription: 'Prescription Drugs',
    otc: 'Over-the-Counter',
    traditional: 'Traditional Medicine',
    cold_flu: 'Cold & Flu',
    headache: 'Headache Relief',

    // Supplement subcategories
    vitamin_mineral: 'Vitamins & Minerals',
    immune_support: 'Immune Support',
    digestive: 'Digestive Health',
    brain_memory: 'Brain & Memory',
    bone_joint: 'Bone & Joint',

    // Cosmeceutical subcategories
    sunscreen: 'Sunscreen',
    acne_treatment: 'Acne Treatment',
    anti_aging: 'Anti-Aging',
    moisturizer: 'Moisturizer',
    cleanser: 'Cleanser',

    // Personal care subcategories
    oral_care: 'Oral Care',
    hair_care: 'Hair Care',
    deodorant: 'Deodorant',
    body_wash: 'Body Wash',

    // Mother & baby subcategories
    baby_formula: 'Baby Formula',
    diapers: 'Diapers',
    baby_supplies: 'Baby Supplies',
    maternity: 'Maternity Care',
    baby_food: 'Baby Food',

    // Medical device subcategories
    blood_pressure: 'Blood Pressure Monitor',
    glucose_meter: 'Glucose Meter',
    thermometer: 'Thermometer',
    medical_mask: 'Medical Mask',
    bandage: 'Bandage',

    // Descriptions
    descriptions: {
      medicine: 'Pharmaceutical products for treatment and prevention',
      supplement: 'Nutritional supplements and health enhancers',
      cosmeceutical: 'Skincare products with pharmaceutical properties',
      personal_care: 'Daily hygiene and personal care products',
      mother_baby: 'Products for pregnant women, new mothers and children',
      medical_device: 'Medical equipment and healthcare devices'
    }
  }
}

// Helper function để lấy translation
export const getCategoryTranslation = (key, language = 'vi') => {
  return categoryTranslations[language]?.[key] || key
}

// Helper function để lấy description
export const getCategoryDescription = (key, language = 'vi') => {
  return categoryTranslations[language]?.descriptions?.[key] || ''
}

// Helper function để lấy tất cả translations của một category
export const getCategoryWithTranslations = (categoryKey) => {
  return {
    key: categoryKey,
    translations: {
      vi: getCategoryTranslation(categoryKey, 'vi'),
      en: getCategoryTranslation(categoryKey, 'en')
    },
    descriptions: {
      vi: getCategoryDescription(categoryKey, 'vi'),
      en: getCategoryDescription(categoryKey, 'en')
    }
  }
}