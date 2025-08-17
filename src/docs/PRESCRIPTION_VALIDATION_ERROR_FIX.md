# Prescription Validation Error Handling Fix

## Problem
The `PrescriptionValidationModal.vue` component was showing generic error messages like "Có lỗi xảy ra khi xác thực đơn thuốc" instead of the actual server error message, even when the server returned a proper standardized error response:

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_FAILED",
    "message": "Insufficient permissions to access this resource (superuser or pharmacist required)",
    "details": {
      "requiredRole": null,
      "userRole": null
    },
    "timestamp": "2025-08-05T10:10:33.275Z"
  }
}
```

## Root Cause
The component was using old manual error handling instead of the new standardized error handling system we implemented.

## Solution

### 1. Updated `PrescriptionValidationModal.vue`
**Before:**
```javascript
} catch (error) {
  console.error('Prescription validation error:', error)
  emit('validate', {
    error: error.message || 'Có lỗi xảy ra khi xác thực đơn thuốc'
  })
}
```

**After:**
```javascript
} catch (error) {
  console.error('Prescription validation error:', error)
  
  // Use standardized error handling to get the proper message
  const { useErrorDisplay } = await import('../../composables/useErrorDisplay.js')
  const { showErrorToast } = useErrorDisplay()
  
  // Show error toast with proper message from server
  const errorInfo = showErrorToast(error, 'Không thể xác thực đơn thuốc')
  
  // Emit error with the parsed message
  emit('validate', {
    error: errorInfo.message || error.message || 'Có lỗi xảy ra khi xác thực đơn thuốc'
  })
}
```

### 2. Updated `OrderManagement.vue`
**Added imports:**
```javascript
import { useErrorDisplay } from '../composables/useErrorDisplay.js'
const { showErrorToast, handleApiErrorWithToast } = useErrorDisplay()
```

**Updated error handling methods:**
- `confirmPrescriptionValidation()` - Now handles errors from modal properly
- `fetchOrders()` - Uses standardized error handling
- `confirmStatusUpdate()` - Uses standardized error handling  
- `confirmCancelOrder()` - Uses standardized error handling

**Before:**
```javascript
} catch (err) {
  console.error('Update status error:', err)
  modalError.value = err.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng'
}
```

**After:**
```javascript
} catch (err) {
  console.error('Update status error:', err)
  const errorInfo = handleApiErrorWithToast(err, 'Update order status', 'Không thể cập nhật trạng thái đơn hàng')
  modalError.value = errorInfo.message
}
```

## How It Works Now

### 1. Error Flow
1. **API Call** → Server returns standardized error format
2. **`makeStandardizedApiRequest()`** → Automatically parses error and throws structured error
3. **Component catch block** → Uses `showErrorToast()` to extract proper message
4. **UI Display** → Shows actual server message instead of generic message

### 2. Error Message Extraction
The `showErrorToast()` function now properly extracts messages based on error codes:

- **`AUTHORIZATION_FAILED`** → "Bạn không có quyền thực hiện thao tác này."
- **`AUTHENTICATION_FAILED`** → "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
- **`VALIDATION_ERROR`** → Uses server message directly
- **Other errors** → Uses server message or appropriate fallback

### 3. Toast + Modal Error Display
- **Toast notification** → Shows immediately for user feedback
- **Modal error** → Shows in the modal for context-specific display
- **Both use the same parsed message** → Consistent error display

## Expected Behavior Now

### Authorization Error:
- **Server response:** `"Insufficient permissions to access this resource (superuser or pharmacist required)"`
- **User sees:** "Bạn không có quyền thực hiện thao tác này." (toast) + modal error
- **Console:** Full error details for debugging

### Authentication Error:
- **Server response:** `"Session expired"`
- **User sees:** "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." (toast) + modal error

### Validation Error:
- **Server response:** `"Required fields are missing"`
- **User sees:** Server message directly (toast) + field-specific errors

## Testing

To test the fix:

1. **Trigger authorization error:**
   - Try to validate prescription without proper permissions
   - Should show proper permission message instead of generic error

2. **Trigger authentication error:**
   - Try to validate with expired session
   - Should show login prompt message

3. **Trigger validation error:**
   - Submit form with missing required fields
   - Should show specific field errors

4. **Check console:**
   - Should see detailed error information for debugging
   - Should see parsed error structure

## Benefits

1. **User-friendly messages** - Users see meaningful error messages
2. **Consistent error handling** - All components use the same error parsing logic
3. **Better debugging** - Developers get full error context in console
4. **Proper error categorization** - Different error types get appropriate UI treatment
5. **Maintainable code** - Single source of truth for error handling logic

The prescription validation modal will now properly display server error messages instead of generic fallback messages.