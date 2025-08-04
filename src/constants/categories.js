// Cấu trúc danh mục sản phẩm
export const productCategories = {
  'Thuốc': [
    'Thuốc kê đơn',
    'Thuốc không kê đơn', 
    'Thuốc truyền thống',
    'Thuốc cảm cúm',
    'Thuốc đau đầu'
  ],
  'Thực phẩm chức năng': [
    'Vitamin & Khoáng chất',
    'Tăng cường miễn dịch',
    'Hỗ trợ tiêu hóa',
    'Bổ não, cải thiện trí nhớ',
    'Hỗ trợ xương khớp'
  ],
  'Dược mỹ phẩm': [
    'Chống nắng',
    'Trị mụn',
    'Chống lão hóa',
    'Dưỡng ẩm',
    'Làm sạch da'
  ],
  'Chăm sóc cá nhân': [
    'Vệ sinh răng miệng',
    'Chăm sóc tóc',
    'Khử mùi cơ thể',
    'Tắm gội'
  ],
  'Mẹ & bé': [
    'Sữa bột',
    'Bỉm tã',
    'Đồ dùng cho bé',
    'Chăm sóc mẹ bầu',
    'Thực phẩm ăn dặm'
  ],
  'Dụng cụ y tế': [
    'Máy đo huyết áp',
    'Máy đo đường huyết',
    'Nhiệt kế',
    'Khẩu trang y tế',
    'Băng gạc'
  ]
}

// Lấy danh sách các category chính
export const mainCategories = Object.keys(productCategories)

// Lấy subcategories của một category
export const getSubcategories = (category) => {
  return productCategories[category] || []
}

// Kiểm tra xem category có subcategories hay không
export const hasSubcategories = (category) => {
  return productCategories[category] && productCategories[category].length > 0
} 