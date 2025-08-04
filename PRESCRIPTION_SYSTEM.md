# Hệ thống Prescription Upload

## Tổng quan

Hệ thống prescription upload cho phép khách hàng tải lên đơn thuốc khi đặt hàng các sản phẩm yêu cầu đơn thuốc, và cho phép dược sĩ xác thực đơn thuốc trong quá trình quản lý đơn hàng.

## Luồng hoạt động

### 1. Checkout Flow

```
Khách hàng bấm "Tiến hành thanh toán"
    ↓
Kiểm tra sản phẩm có vấn đề (hết hàng/ngừng kinh doanh)
    ↓ (nếu có vấn đề)
Hiển thị CartIssuesModal → Khách hàng xử lý → Tiếp tục
    ↓
Kiểm tra sản phẩm yêu cầu đơn thuốc
    ↓ (nếu có)
Hiển thị PrescriptionUploadModal → Khách hàng upload → Tiếp tục
    ↓
Xử lý đơn hàng → Thành công
```

### 2. Order Management Flow

```
Đơn hàng có prescription → Hiển thị PrescriptionSection
    ↓
Dược sĩ xem đơn thuốc → Xác thực → Cập nhật trạng thái
    ↓
Khách hàng có thể xem trạng thái xác thực trong OrderDetails
```

## Components

### 1. PrescriptionUploadModal.vue
- **Vị trí**: `src/components/Checkout/PrescriptionUploadModal.vue`
- **Chức năng**: 
  - Hiển thị danh sách sản phẩm yêu cầu đơn thuốc
  - Drag & drop upload file (JPG, PNG, PDF)
  - Preview hình ảnh
  - Validation file size và format
  - Upload progress tracking

### 2. CartIssuesModal.vue
- **Vị trí**: `src/components/Checkout/CartIssuesModal.vue`
- **Chức năng**:
  - Hiển thị sản phẩm hết hàng/ngừng kinh doanh
  - Gợi ý sản phẩm thay thế
  - Cho phép xóa sản phẩm có vấn đề
  - Tiếp tục với sản phẩm có sẵn

### 3. PrescriptionSection.vue
- **Vị trí**: `src/components/OrderDetails/PrescriptionSection.vue`
- **Chức năng**:
  - Hiển thị thông tin đơn thuốc đã upload
  - Trạng thái xác thực (pending/approved/rejected)
  - Thông tin dược sĩ xác thực
  - Preview và download file đơn thuốc
  - Danh sách sản phẩm yêu cầu đơn thuốc

### 4. PrescriptionValidationModal.vue
- **Vị trí**: `src/components/OrderManagement/PrescriptionValidationModal.vue`
- **Chức năng**:
  - Modal cho dược sĩ xác thực đơn thuốc
  - Preview prescription files
  - Form validation với approve/reject options
  - Ghi chú và lý do validation
  - Hiển thị prescription products

## Composables

### useCheckout.js
- **Vị trí**: `src/composables/useCheckout.js`
- **Chức năng**:
  - Quản lý luồng checkout
  - Kiểm tra prescription requirements
  - Kiểm tra cart issues
  - Xử lý prescription upload
  - Xử lý cart issues resolution

## Cập nhật Files

### Cart.vue
- Tích hợp useCheckout composable
- Thêm PrescriptionUploadModal và CartIssuesModal
- Cập nhật proceedToCheckout function

### OrderDetails.vue
- Thêm PrescriptionSection component
- Cập nhật sample data với prescription products
- Thêm computed property cho prescriptionProducts

### OrderManagement.vue
- Thêm prescription status filter
- Thêm prescription column trong table
- Thêm PrescriptionValidationModal
- Cập nhật mock data với prescription examples
- Thêm prescription statistics
- Prescription validation workflow cho dược sĩ

### OrderCard.vue
- Hiển thị prescription status badge
- Thêm prescription validation button
- Responsive prescription info cho mobile

## Data Structure

### Prescription Data
```javascript
{
  files: [
    {
      name: 'don-thuoc-1.jpg',
      type: 'image/jpeg',
      size: 2048576,
      url: '/img/prescription-sample-1.jpg'
    }
  ],
  uploadedAt: '2025-08-04T16:30:00Z',
  expiryDate: '2025-09-04T00:00:00Z',
  validationStatus: 'approved', // pending, approved, rejected
  validationInfo: {
    pharmacistName: 'Dược sĩ Nguyễn Văn A',
    validatedAt: '2025-08-04T16:40:00Z',
    notes: 'Đơn thuốc hợp lệ...'
  }
}
```

### Product with Prescription
```javascript
{
  id: 3,
  name: 'Thuốc kháng sinh Amoxicillin 500mg',
  quantity: 1,
  price: 85000,
  image: '/img/product.avif',
  category: 'Thuốc kê đơn',
  requiresPrescription: true
}
```

## Features

### ✅ Đã hoàn thành
- [x] PrescriptionUploadModal với drag & drop upload
- [x] CartIssuesModal để xử lý sản phẩm có vấn đề
- [x] useCheckout composable cho logic checkout
- [x] Tích hợp prescription flow vào Cart.vue
- [x] PrescriptionSection trong OrderDetails
- [x] File preview và download
- [x] Validation status tracking
- [x] Responsive design với animations
- [x] OrderManagement prescription support
- [x] PrescriptionValidationModal cho dược sĩ
- [x] Prescription filters trong OrderManagement
- [x] Prescription status display trong OrderCard

### 🔄 Backend Support Cần thiết
- [ ] API endpoint để upload prescription files
- [ ] API endpoint để validate prescription
- [ ] API endpoint để check product availability
- [ ] Database schema cho prescription data
- [ ] File storage service (AWS S3, etc.)

## Styling

Tất cả components sử dụng:
- **Tailwind CSS** cho styling
- **Font Awesome** cho icons
- **Modal animations** với gaussian blur backdrop
- **Responsive design** cho mobile/desktop
- **Consistent color scheme** với design system hiện tại

## Browser Support

- Modern browsers với ES6+ support
- File API support cho drag & drop
- Fetch API cho uploads
- CSS Grid và Flexbox support