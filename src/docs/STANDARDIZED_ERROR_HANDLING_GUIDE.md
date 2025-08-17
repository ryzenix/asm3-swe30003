# Standardized Error Handling Guide

## Overview

This guide explains how to use the new standardized error handling system that ensures consistent error parsing and display across all API fetch operations in the frontend.

## Key Components

### 1. Enhanced `useErrorHandler.js`
- **`makeStandardizedApiRequest()`** - Use this for all API calls
- **`handleStandardizedApiResponse()`** - Automatically handles the new backend format
- **`parseApiErrorResponse()`** - Parses the standardized error format

### 2. New `useErrorDisplay.js`
- **`showErrorToast()`** - Display errors via toast notifications
- **`handleApiErrorWithToast()`** - Catch handler for API calls
- **`createErrorBadge()`** - Create inline error displays
- **`extractFieldErrors()`** - Extract field-specific validation errors

## Backend Error Format

The backend now returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_FAILED",
    "message": "Insufficient permissions to access this resource",
    "details": {
      "requiredRole": "admin",
      "userRole": "user"
    },
    "timestamp": "2025-08-05T09:34:01.990Z"
  }
}
```

## How to Use

### 1. In API Service Files

**✅ NEW WAY (Recommended):**
```javascript
// services/productApi.js
import { useErrorHandler } from '../composables/useErrorHandler.js'

export function useProductApi() {
  const { makeStandardizedApiRequest } = useErrorHandler()

  const getProducts = async (params = {}) => {
    const queryParams = new URLSearchParams()
    // ... build query params
    
    const url = `${API_BASE_URL}/products/list?${queryParams.toString()}`
    return await makeStandardizedApiRequest(url) // Handles errors automatically
  }

  const createProduct = async (productData) => {
    return await makeStandardizedApiRequest(`${API_BASE_URL}/products/create`, {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  }
}
```

**❌ OLD WAY (Don't use):**
```javascript
const getProducts = async (params = {}) => {
  try {
    const response = await makeApiRequest(url)
    return response
  } catch (error) {
    console.error('Get products error:', error)
    throw error
  }
}
```

### 2. In Vue Components

**✅ NEW WAY (Recommended):**
```javascript
// In your Vue component
import { useErrorDisplay } from '../composables/useErrorDisplay.js'

export default {
  setup() {
    const { showErrorToast, handleApiErrorWithToast } = useErrorDisplay()
    const { getProducts } = useProductApi()

    // Method 1: Use handleApiErrorWithToast as catch handler
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        // Handle success
        products.value = response.data
      } catch (error) {
        handleApiErrorWithToast(error, 'Fetch products', 'Không thể tải danh sách sản phẩm')
      }
    }

    // Method 2: Use showErrorToast directly
    const deleteProduct = async (id) => {
      try {
        await deleteProductApi(id)
        showSuccess('Đã xóa sản phẩm thành công')
      } catch (error) {
        showErrorToast(error, 'Không thể xóa sản phẩm')
      }
    }
  }
}
```

**❌ OLD WAY (Don't use):**
```javascript
const fetchProducts = async () => {
  try {
    const response = await getProducts()
    if (response && response.success) {
      products.value = response.data
    } else {
      const errorMessage = response?.error?.message || 'Có lỗi xảy ra'
      showError(errorMessage)
    }
  } catch (error) {
    console.error('Error:', error)
    showError('Có lỗi xảy ra')
  }
}
```

### 3. Form Validation Errors

**✅ NEW WAY:**
```javascript
import { useErrorDisplay } from '../composables/useErrorDisplay.js'

const { extractFieldErrors, showErrorToast } = useErrorDisplay()

const submitForm = async (formData) => {
  try {
    const response = await createProduct(formData)
    showSuccess('Tạo sản phẩm thành công!')
  } catch (error) {
    // Show general error toast
    showErrorToast(error, 'Không thể tạo sản phẩm')
    
    // Extract and display field-specific errors
    const fieldErrors = extractFieldErrors(error)
    Object.entries(fieldErrors).forEach(([field, message]) => {
      setFieldError(field, message)
    })
  }
}
```

### 4. Error Badges/Alerts

**✅ NEW WAY:**
```javascript
import { useErrorDisplay } from '../composables/useErrorDisplay.js'

const { createErrorBadge } = useErrorDisplay()

const handleError = (error) => {
  const errorBadge = createErrorBadge(error, 'Có lỗi xảy ra')
  
  // errorBadge contains:
  // {
  //   show: true,
  //   type: 'error', // 'error', 'warning', 'info'
  //   title: 'Lỗi xác thực',
  //   message: 'Phiên đăng nhập đã hết hạn',
  //   details: { ... },
  //   code: 'AUTHENTICATION_FAILED',
  //   canDismiss: true,
  //   actions: [{ label: 'Đăng nhập lại', action: 'login' }]
  // }
  
  errorDisplay.value = errorBadge
}
```

## Error Types and Handling

### Authentication Errors
```javascript
// Code: AUTHENTICATION_FAILED
// Auto-handled: Shows login prompt, redirects to login
```

### Authorization Errors
```javascript
// Code: AUTHORIZATION_FAILED  
// Auto-handled: Shows permission denied message
```

### Validation Errors
```javascript
// Code: VALIDATION_ERROR
// Auto-handled: Extracts field errors, shows warning toast
```

### Rate Limiting
```javascript
// Code: RATE_LIMITED
// Auto-handled: Shows retry countdown, info toast
```

### Server Errors
```javascript
// Code: INTERNAL_SERVER_ERROR
// Auto-handled: Shows generic server error message
```

## Migration Checklist

### For API Services:
- [ ] Replace `makeApiRequest` with `makeStandardizedApiRequest`
- [ ] Remove try-catch blocks (errors handled automatically)
- [ ] Remove manual error parsing logic

### For Vue Components:
- [ ] Import `useErrorDisplay`
- [ ] Replace custom error handling with `showErrorToast` or `handleApiErrorWithToast`
- [ ] Remove manual error message parsing
- [ ] Use `extractFieldErrors` for form validation
- [ ] Update error display UI to use `createErrorBadge`

### Testing:
- [ ] Test authentication errors (401)
- [ ] Test authorization errors (403)
- [ ] Test validation errors (400)
- [ ] Test server errors (500)
- [ ] Test network errors
- [ ] Verify error messages display correctly
- [ ] Verify field errors highlight correctly

## Benefits

1. **Consistency** - All errors parsed and displayed the same way
2. **Maintainability** - Single source of truth for error handling
3. **User Experience** - Better error messages with context
4. **Developer Experience** - Less boilerplate code
5. **Type Safety** - Structured error objects with TypeScript support
6. **Debugging** - Better error logging and context

## Common Patterns

### Simple API Call
```javascript
const fetchData = async () => {
  try {
    const data = await apiCall()
    // Handle success
  } catch (error) {
    handleApiErrorWithToast(error, 'API context', 'Default message')
  }
}
```

### Form Submission
```javascript
const submitForm = async () => {
  try {
    await submitApi(formData)
    showSuccess('Success!')
  } catch (error) {
    showErrorToast(error, 'Form submission failed')
    const fieldErrors = extractFieldErrors(error)
    // Apply field errors to form
  }
}
```

### Background Operations
```javascript
const backgroundTask = async () => {
  try {
    await backgroundApi()
  } catch (error) {
    // Silent error handling - just log
    console.error('Background task failed:', error)
    // Or show minimal notification
    showErrorToast(error, 'Background operation failed')
  }
}
```

## Error Message Customization

You can customize error messages by error code:

```javascript
const customErrorMessages = {
  'AUTHENTICATION_FAILED': 'Vui lòng đăng nhập lại',
  'AUTHORIZATION_FAILED': 'Bạn không có quyền thực hiện thao tác này',
  'VALIDATION_ERROR': 'Dữ liệu nhập vào không hợp lệ'
}

const showCustomError = (error) => {
  const errorInfo = parseApiErrorResponse(error)
  const customMessage = customErrorMessages[errorInfo.code] || errorInfo.message
  showError(customMessage)
}
```

## Debugging

Enable detailed error logging:

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Error details:', {
    code: errorInfo.code,
    message: errorInfo.message,
    details: errorInfo.details,
    timestamp: errorInfo.timestamp
  })
}
```

## Best Practices

1. **Always use `makeStandardizedApiRequest`** for API calls
2. **Use `handleApiErrorWithToast`** as your default catch handler
3. **Extract field errors** for form validation
4. **Provide context** in error messages
5. **Test all error scenarios** during development
6. **Log errors** for debugging but don't expose sensitive data
7. **Provide user-friendly messages** while keeping technical details in console