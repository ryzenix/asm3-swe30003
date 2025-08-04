# Hướng dẫn Migration Categories System

## Tổng quan

Hệ thống categories mới được thiết kế để:
- Tối ưu hóa việc tìm kiếm và lưu trữ database
- Hỗ trợ đa ngôn ngữ (i18n)
- Cung cấp metadata phong phú (icon, description, search keywords)
- Dễ dàng mở rộng và bảo trì

## Cấu trúc mới

### 1. Category Structure
```javascript
// Thay vì lưu string như cũ:
category: "Thuốc"
subcategory: "Thuốc kê đơn"

// Bây giờ lưu ID:
category_id: 1
subcategory_id: 101
```

### 2. Database Schema Changes

#### Tạo bảng categories (tùy chọn - để quản lý động)
```sql
-- Tạo bảng categories chính
CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    parent_id INTEGER NULL,
    icon VARCHAR(10),
    search_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Tạo bảng translations
CREATE TABLE category_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    language VARCHAR(5) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(category_id, language)
);
```

#### Cập nhật bảng products
```sql
-- Thêm cột mới
ALTER TABLE products ADD COLUMN category_id INTEGER;
ALTER TABLE products ADD COLUMN subcategory_id INTEGER;

-- Tạo index để tối ưu tìm kiếm
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_category_subcategory ON products(category_id, subcategory_id);
```

## Migration Steps

### Bước 1: Seed Categories Data (Nếu sử dụng database)

```sql
-- Insert main categories
INSERT INTO categories (id, key, parent_id, icon, search_keywords) VALUES
(1, 'medicine', NULL, '💊', 'thuoc,medicine,drug,pharmaceutical'),
(2, 'supplement', NULL, '💪', 'thuc pham chuc nang,supplement,functional food'),
(3, 'cosmeceutical', NULL, '✨', 'duoc my pham,cosmeceutical,skincare'),
(4, 'personal_care', NULL, '🧴', 'cham soc ca nhan,personal care,hygiene'),
(5, 'mother_baby', NULL, '👶', 'me be,mother baby,infant'),
(6, 'medical_device', NULL, '🩺', 'dung cu y te,medical device,healthcare');

-- Insert subcategories
INSERT INTO categories (id, key, parent_id, icon, search_keywords) VALUES
-- Medicine subcategories
(101, 'prescription', 1, '📋', 'ke don,prescription,rx'),
(102, 'otc', 1, '🏪', 'khong ke don,otc,over the counter'),
(103, 'traditional', 1, '🌿', 'truyen thong,traditional,herbal'),
(104, 'cold_flu', 1, '🤧', 'cam cum,cold,flu,fever'),
(105, 'headache', 1, '🤕', 'dau dau,headache,pain relief'),

-- Supplement subcategories
(201, 'vitamin_mineral', 2, '🍊', 'vitamin,khoang chat,mineral'),
(202, 'immune_support', 2, '🛡️', 'tang cuong mien dich,immune,immunity'),
(203, 'digestive', 2, '🫃', 'ho tro tieu hoa,digestive,probiotics'),
(204, 'brain_memory', 2, '🧠', 'bo nao,tri nho,brain,memory'),
(205, 'bone_joint', 2, '🦴', 'xuong khop,bone,joint,calcium'),

-- Cosmeceutical subcategories
(301, 'sunscreen', 3, '☀️', 'chong nang,sunscreen,spf'),
(302, 'acne_treatment', 3, '🎯', 'tri mun,acne,pimple'),
(303, 'anti_aging', 3, '⏰', 'chong lao hoa,anti aging,wrinkle'),
(304, 'moisturizer', 3, '💧', 'duong am,moisturizer,hydrating'),
(305, 'cleanser', 3, '🧼', 'lam sach da,cleanser,face wash'),

-- Personal care subcategories
(401, 'oral_care', 4, '🦷', 've sinh rang mieng,oral care,dental'),
(402, 'hair_care', 4, '💇', 'cham soc toc,hair care,shampoo'),
(403, 'deodorant', 4, '🌸', 'khu mui co the,deodorant,antiperspirant'),
(404, 'body_wash', 4, '🛁', 'tam goi,body wash,shower gel'),

-- Mother & baby subcategories
(501, 'baby_formula', 5, '🍼', 'sua bot,baby formula,milk powder'),
(502, 'diapers', 5, '👶', 'bim ta,diapers,nappies'),
(503, 'baby_supplies', 5, '🧸', 'do dung cho be,baby supplies,baby items'),
(504, 'maternity', 5, '🤱', 'cham soc me bau,maternity,pregnancy'),
(505, 'baby_food', 5, '🥄', 'thuc pham an dam,baby food,weaning'),

-- Medical device subcategories
(601, 'blood_pressure', 6, '🩸', 'may do huyet ap,blood pressure,sphygmomanometer'),
(602, 'glucose_meter', 6, '🩸', 'may do duong huyet,glucose meter,blood sugar'),
(603, 'thermometer', 6, '🌡️', 'nhiet ke,thermometer,temperature'),
(604, 'medical_mask', 6, '😷', 'khau trang y te,medical mask,surgical mask'),
(605, 'bandage', 6, '🩹', 'bang gac,bandage,gauze');

-- Insert translations
INSERT INTO category_translations (category_id, language, name, description) VALUES
-- Vietnamese translations
(1, 'vi', 'Thuốc', 'Các loại thuốc điều trị và phòng ngừa bệnh'),
(2, 'vi', 'Thực phẩm chức năng', 'Thực phẩm bổ sung dinh dưỡng và tăng cường sức khỏe'),
(3, 'vi', 'Dược mỹ phẩm', 'Sản phẩm chăm sóc da có tính chất dược phẩm'),
(4, 'vi', 'Chăm sóc cá nhân', 'Sản phẩm vệ sinh và chăm sóc cá nhân hàng ngày'),
(5, 'vi', 'Mẹ & bé', 'Sản phẩm dành cho mẹ bầu, mẹ sau sinh và trẻ em'),
(6, 'vi', 'Dụng cụ y tế', 'Thiết bị y tế và dụng cụ chăm sóc sức khỏe'),

-- English translations
(1, 'en', 'Medicine', 'Pharmaceutical products for treatment and prevention'),
(2, 'en', 'Supplements', 'Nutritional supplements and health enhancers'),
(3, 'en', 'Cosmeceuticals', 'Skincare products with pharmaceutical properties'),
(4, 'en', 'Personal Care', 'Daily hygiene and personal care products'),
(5, 'en', 'Mother & Baby', 'Products for pregnant women, new mothers and children'),
(6, 'en', 'Medical Devices', 'Medical equipment and healthcare devices');

-- Thêm translations cho subcategories...
-- (Có thể tạo script riêng để insert tất cả subcategory translations)
```

### Bước 2: Migration Script cho Products

```javascript
// migration-script.js
import categoryService from '../src/services/categoryService.js'

const migrateProductCategories = async () => {
  try {
    // Lấy tất cả products từ database
    const products = await db.query('SELECT id, category, subcategory FROM products')
    
    let successCount = 0
    let errorCount = 0
    const errors = []

    for (const product of products.rows) {
      try {
        // Convert legacy category names to IDs
        const converted = categoryService.convertLegacyCategoryToId(
          product.category, 
          product.subcategory
        )

        if (converted) {
          // Update product với category IDs mới
          await db.query(
            'UPDATE products SET category_id = $1, subcategory_id = $2 WHERE id = $3',
            [converted.categoryId, converted.subcategoryId, product.id]
          )
          successCount++
        } else {
          errors.push({
            productId: product.id,
            category: product.category,
            subcategory: product.subcategory,
            error: 'Could not convert category'
          })
          errorCount++
        }
      } catch (error) {
        errors.push({
          productId: product.id,
          category: product.category,
          subcategory: product.subcategory,
          error: error.message
        })
        errorCount++
      }
    }

    console.log(`Migration completed:`)
    console.log(`- Success: ${successCount}`)
    console.log(`- Errors: ${errorCount}`)
    
    if (errors.length > 0) {
      console.log('Errors:', errors)
    }

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Chạy migration
migrateProductCategories()
```

### Bước 3: Cập nhật API Endpoints

```javascript
// Trong Product model/controller
class Product {
  async create(productData) {
    // Validate category IDs thay vì category names
    const validation = categoryService.validateCategoryPair(
      productData.categoryId, 
      productData.subcategoryId
    )
    
    if (!validation.valid) {
      throw new ValidationError(validation.error)
    }

    // Insert với category_id và subcategory_id
    const result = await this.db.query(
      `INSERT INTO products (
        title, sku, price, price_value, unit, 
        category_id, subcategory_id, manufacturer, ...
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ...)`,
      [
        productData.title, productData.sku, formattedPrice, 
        productData.priceValue, productData.unit,
        productData.categoryId, productData.subcategoryId,
        productData.manufacturer, ...
      ]
    )

    return result
  }

  async getProducts(filters = {}) {
    let query = `
      SELECT p.*, 
             c.name as category_name, c.icon as category_icon,
             sc.name as subcategory_name, sc.icon as subcategory_icon
      FROM products p
      LEFT JOIN category_translations c ON p.category_id = c.category_id AND c.language = $1
      LEFT JOIN category_translations sc ON p.subcategory_id = sc.category_id AND sc.language = $1
      WHERE 1=1
    `
    
    const params = [filters.language || 'vi']
    let paramIndex = 2

    // Filter by category
    if (filters.categoryId) {
      query += ` AND p.category_id = $${paramIndex}`
      params.push(filters.categoryId)
      paramIndex++
    }

    // Filter by subcategory
    if (filters.subcategoryId) {
      query += ` AND p.subcategory_id = $${paramIndex}`
      params.push(filters.subcategoryId)
      paramIndex++
    }

    const result = await this.db.query(query, params)
    return result.rows
  }
}
```

### Bước 4: Cập nhật Frontend Components

#### Sử dụng CategorySelector mới:

```vue
<template>
  <div>
    <!-- Thay thế dropdown cũ -->
    <CategorySelector
      v-model="form.categories"
      :required="true"
      :subcategory-required="true"
      :enable-search="true"
      :show-breadcrumb="true"
      :language="currentLanguage"
      :errors="validationErrors"
      @change="onCategoryChange"
    />
  </div>
</template>

<script setup>
import CategorySelector from '@/components/Common/CategorySelector.vue'
import { ref } from 'vue'

const form = ref({
  categories: {
    categoryId: null,
    subcategoryId: null
  }
})

const onCategoryChange = (categories) => {
  console.log('Selected categories:', categories)
  // Handle category change
}
</script>
```

#### Hoặc sử dụng composable:

```vue
<script setup>
import { useCategories } from '@/composables/useCategories.js'

const {
  mainCategories,
  getSubcategories,
  getCategoryInfo,
  searchCategories
} = useCategories('vi')

// Sử dụng các methods...
</script>
```

## Testing Migration

### 1. Test Category Service
```javascript
// test-category-service.js
import categoryService from '../src/services/categoryService.js'

// Test basic functionality
console.log('Main categories:', categoryService.getMainCategories())
console.log('Subcategories of Medicine:', categoryService.getSubcategories(1))
console.log('Search "thuoc":', categoryService.searchCategoriesByTerm('thuoc'))

// Test legacy conversion
const converted = categoryService.convertLegacyCategoryToId('Thuốc', 'Thuốc kê đơn')
console.log('Converted:', converted) // Should return { categoryId: 1, subcategoryId: 101 }
```

### 2. Test Database Queries
```sql
-- Test category joins
SELECT p.title, ct.name as category, sct.name as subcategory
FROM products p
LEFT JOIN category_translations ct ON p.category_id = ct.category_id AND ct.language = 'vi'
LEFT JOIN category_translations sct ON p.subcategory_id = sct.category_id AND sct.language = 'vi'
LIMIT 10;

-- Test search performance
EXPLAIN QUERY PLAN 
SELECT * FROM products WHERE category_id = 1 AND subcategory_id = 101;
```

## Rollback Plan

Nếu cần rollback:

1. **Giữ lại cột cũ** trong quá trình migration:
```sql
-- Không xóa cột category, subcategory cũ ngay
-- ALTER TABLE products DROP COLUMN category;  -- Chưa chạy
-- ALTER TABLE products DROP COLUMN subcategory;  -- Chưa chạy
```

2. **Script rollback**:
```javascript
const rollbackCategories = async () => {
  // Convert từ ID về string names
  const products = await db.query('SELECT id, category_id, subcategory_id FROM products')
  
  for (const product of products.rows) {
    const categoryInfo = categoryService.getCategoryInfo(product.category_id)
    const subcategoryInfo = product.subcategory_id ? 
      categoryService.getCategoryInfo(product.subcategory_id) : null

    await db.query(
      'UPDATE products SET category = $1, subcategory = $2 WHERE id = $3',
      [categoryInfo?.name, subcategoryInfo?.name, product.id]
    )
  }
}
```

## Performance Benefits

### Trước (String-based):
```sql
-- Tìm kiếm chậm với LIKE
SELECT * FROM products WHERE category LIKE '%Thuốc%';

-- Không có index hiệu quả
-- Khó join với bảng khác
-- Không hỗ trợ đa ngôn ngữ
```

### Sau (ID-based):
```sql
-- Tìm kiếm nhanh với index
SELECT * FROM products WHERE category_id = 1;

-- Join hiệu quả
SELECT p.*, ct.name 
FROM products p 
JOIN category_translations ct ON p.category_id = ct.category_id 
WHERE ct.language = 'vi';

-- Hỗ trợ đa ngôn ngữ
SELECT p.*, ct.name 
FROM products p 
JOIN category_translations ct ON p.category_id = ct.category_id 
WHERE ct.language = 'en';
```

## Kết luận

Hệ thống categories mới cung cấp:
- ✅ Performance tốt hơn với ID-based lookups
- ✅ Hỗ trợ đa ngôn ngữ hoàn chỉnh
- ✅ Metadata phong phú (icon, description, search keywords)
- ✅ Tìm kiếm thông minh
- ✅ Dễ dàng mở rộng và bảo trì
- ✅ Backward compatibility trong quá trình migration

Migration nên được thực hiện từng bước với testing kỹ lưỡng và có kế hoạch rollback sẵn sàng.