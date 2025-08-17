// Frontend: composables/useErrorDisplay.js - Centralized error display utilities
import { useErrorHandler } from './useErrorHandler.js';
import { useToast } from './useToast.js';

/**
 * Centralized error display utilities for consistent error handling across the app
 * Handles toast notifications, error badges, and inline error displays
 */
export function useErrorDisplay() {
  const { handleApiError, handleApiResponseError, parseApiErrorResponse } = useErrorHandler();
  const { showError, showWarning, showInfo } = useToast();

  /**
   * Display error via toast notification with standardized parsing
   * @param {Error|Object} error - The error object or API response
   * @param {string} defaultMessage - Default message if error parsing fails
   * @param {Object} options - Display options
   * @returns {Object} Processed error information
   */
  const showErrorToast = (error, defaultMessage = 'Có lỗi xảy ra. Vui lòng thử lại.', options = {}) => {
    console.log('showErrorToast called with:', { error, defaultMessage, options });
    
    let errorInfo;
    
    // Handle different error formats
    if (error && error.errorInfo) {
      // Error already processed by useErrorHandler
      errorInfo = error.errorInfo;
    } else if (error && error.response) {
      // Handle API response error
      errorInfo = handleApiResponseError(error.response);
    } else if (error && (error.success === false || error.error)) {
      // Handle direct API error response
      errorInfo = handleApiResponseError(error);
    } else {
      // Handle general error
      errorInfo = handleApiError(error);
    }
    
    // Determine message to display
    let displayMessage = errorInfo.message || error?.message || defaultMessage;
    
    // Handle specific error types with custom messages
    switch (errorInfo.code) {
      case 'AUTHENTICATION_FAILED':
        displayMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        break;
      case 'AUTHORIZATION_FAILED':
        displayMessage = 'Bạn không có quyền thực hiện thao tác này.';
        break;
      case 'VALIDATION_ERROR':
        // For validation errors, show the specific message from server
        displayMessage = errorInfo.message || 'Dữ liệu nhập vào không hợp lệ.';
        break;
      case 'NOT_FOUND':
        displayMessage = 'Không tìm thấy dữ liệu yêu cầu.';
        break;
      case 'CONFLICT_ERROR':
        displayMessage = errorInfo.message || 'Dữ liệu đã tồn tại hoặc xung đột.';
        break;
      case 'RATE_LIMITED':
        const retryAfter = errorInfo.details?.retryAfter || errorInfo.retryAfter;
        displayMessage = retryAfter 
          ? `Quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfter} giây.`
          : 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
        break;
      case 'BUSINESS_LOGIC_ERROR':
        displayMessage = errorInfo.message || 'Vi phạm quy tắc nghiệp vụ.';
        break;
      case 'EXTERNAL_SERVICE_ERROR':
        displayMessage = 'Lỗi dịch vụ bên ngoài. Vui lòng thử lại sau.';
        break;
      case 'INTERNAL_SERVER_ERROR':
        displayMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        break;
    }
    
    // Show appropriate toast based on error severity
    if (errorInfo.code === 'VALIDATION_ERROR' || errorInfo.code === 'BUSINESS_LOGIC_ERROR') {
      showWarning(displayMessage);
    } else if (errorInfo.code === 'RATE_LIMITED') {
      showInfo(displayMessage);
    } else {
      showError(displayMessage);
    }
    
    return errorInfo;
  };

  /**
   * Handle API fetch errors with standardized error display
   * Use this as a catch handler for all API calls
   * @param {Error} error - The error from fetch/API call
   * @param {string} context - Context description for logging
   * @param {string} defaultMessage - Default user message
   * @returns {Object} Processed error information
   */
  const handleApiErrorWithToast = (error, context = 'API call', defaultMessage = 'Có lỗi xảy ra. Vui lòng thử lại.') => {
    console.error(`${context} error:`, error);
    return showErrorToast(error, defaultMessage);
  };

  /**
   * Create error badge/alert content for inline display
   * @param {Error|Object} error - The error object or API response
   * @param {string} defaultMessage - Default message if error parsing fails
   * @returns {Object} Error display data for UI components
   */
  const createErrorBadge = (error, defaultMessage = 'Có lỗi xảy ra') => {
    let errorInfo;
    
    if (error && error.errorInfo) {
      errorInfo = error.errorInfo;
    } else if (error && error.response) {
      errorInfo = handleApiResponseError(error.response);
    } else if (error && (error.success === false || error.error)) {
      errorInfo = handleApiResponseError(error);
    } else {
      errorInfo = handleApiError(error);
    }
    
    const displayMessage = errorInfo.message || error?.message || defaultMessage;
    
    return {
      show: true,
      type: getErrorBadgeType(errorInfo.code),
      title: getErrorTitle(errorInfo.code),
      message: displayMessage,
      details: errorInfo.details,
      code: errorInfo.code,
      canDismiss: true,
      actions: getErrorActions(errorInfo.code, errorInfo.details)
    };
  };

  /**
   * Get error badge type for styling
   * @param {string} errorCode - The error code
   * @returns {string} Badge type (error, warning, info)
   */
  const getErrorBadgeType = (errorCode) => {
    switch (errorCode) {
      case 'VALIDATION_ERROR':
      case 'BUSINESS_LOGIC_ERROR':
        return 'warning';
      case 'RATE_LIMITED':
        return 'info';
      case 'AUTHENTICATION_FAILED':
      case 'AUTHORIZATION_FAILED':
      case 'NOT_FOUND':
      case 'CONFLICT_ERROR':
      case 'INTERNAL_SERVER_ERROR':
      case 'EXTERNAL_SERVICE_ERROR':
      default:
        return 'error';
    }
  };

  /**
   * Get error title for display
   * @param {string} errorCode - The error code
   * @returns {string} Error title
   */
  const getErrorTitle = (errorCode) => {
    switch (errorCode) {
      case 'VALIDATION_ERROR':
        return 'Dữ liệu không hợp lệ';
      case 'AUTHENTICATION_FAILED':
        return 'Lỗi xác thực';
      case 'AUTHORIZATION_FAILED':
        return 'Không có quyền';
      case 'NOT_FOUND':
        return 'Không tìm thấy';
      case 'CONFLICT_ERROR':
        return 'Dữ liệu xung đột';
      case 'BUSINESS_LOGIC_ERROR':
        return 'Vi phạm quy tắc';
      case 'RATE_LIMITED':
        return 'Quá nhiều yêu cầu';
      case 'EXTERNAL_SERVICE_ERROR':
        return 'Lỗi dịch vụ';
      case 'INTERNAL_SERVER_ERROR':
        return 'Lỗi máy chủ';
      default:
        return 'Có lỗi xảy ra';
    }
  };

  /**
   * Get suggested actions for error types
   * @param {string} errorCode - The error code
   * @param {Object} details - Error details
   * @returns {Array} Array of action objects
   */
  const getErrorActions = (errorCode, details) => {
    const actions = [];
    
    switch (errorCode) {
      case 'AUTHENTICATION_FAILED':
        actions.push({
          label: 'Đăng nhập lại',
          action: 'login',
          primary: true
        });
        break;
      case 'RATE_LIMITED':
        const retryAfter = details?.retryAfter;
        if (retryAfter) {
          actions.push({
            label: `Thử lại sau ${retryAfter}s`,
            action: 'retry',
            disabled: true,
            countdown: retryAfter
          });
        }
        break;
      case 'VALIDATION_ERROR':
        if (details?.validationDetails?.missingFields) {
          actions.push({
            label: 'Kiểm tra form',
            action: 'focus-form',
            primary: true
          });
        }
        break;
    }
    
    // Always add a dismiss action
    actions.push({
      label: 'Đóng',
      action: 'dismiss',
      secondary: true
    });
    
    return actions;
  };

  /**
   * Parse and extract field errors for form validation display
   * @param {Error|Object} error - The error object or API response
   * @returns {Object} Field errors object { fieldName: errorMessage }
   */
  const extractFieldErrors = (error) => {
    let errorInfo;
    
    if (error && error.errorInfo) {
      errorInfo = error.errorInfo;
    } else if (error && error.response) {
      errorInfo = handleApiResponseError(error.response);
    } else if (error && (error.success === false || error.error)) {
      errorInfo = handleApiResponseError(error);
    } else {
      return {};
    }
    
    const fieldErrors = {};
    
    if (errorInfo.details?.validationDetails?.missingFields) {
      errorInfo.details.validationDetails.missingFields.forEach(field => {
        fieldErrors[field] = 'Trường này là bắt buộc';
      });
    }
    
    if (errorInfo.details?.field) {
      const fieldMessage = getFieldSpecificMessage(errorInfo.details.field, errorInfo.details);
      fieldErrors[errorInfo.details.field] = fieldMessage;
    }
    
    return fieldErrors;
  };

  /**
   * Get field-specific error message
   * @param {string} field - Field name
   * @param {Object} details - Error details
   * @returns {string} Field-specific error message
   */
  const getFieldSpecificMessage = (field, details) => {
    if (details.validationDetails) {
      const validation = details.validationDetails;
      
      switch (field) {
        case 'email':
          if (validation.expectedFormat) {
            return 'Email không đúng định dạng';
          }
          break;
        case 'phone':
          if (validation.expectedFormat) {
            return 'Số điện thoại không đúng định dạng Việt Nam';
          }
          break;
        case 'password':
          if (validation.requirements) {
            return `Mật khẩu phải: ${validation.requirements.join(', ')}`;
          }
          break;
        case 'priceValue':
        case 'stockQuantity':
          if (validation.min !== undefined) {
            return `Giá trị phải lớn hơn hoặc bằng ${validation.min}`;
          }
          break;
      }
    }
    
    return 'Dữ liệu không hợp lệ';
  };

  return {
    showErrorToast,
    handleApiErrorWithToast,
    createErrorBadge,
    extractFieldErrors,
    getErrorBadgeType,
    getErrorTitle,
    getErrorActions
  };
}