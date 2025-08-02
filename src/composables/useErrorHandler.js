// Frontend: composables/useErrorHandler.js - Updated to match new API error format
import { ref } from 'vue';
import { ERROR_CODES, ERROR_MESSAGES, FIELD_MAPPINGS } from '../constants/errCodes';

/**
 * @typedef {Object} ApiErrorResponse
 * @property {false} success
 * @property {Object} error
 * @property {string} error.code - Error code from ERROR_CODES
 * @property {string} error.message - Human readable error message
 * @property {Object|null} error.details - Additional error details
 * @property {string} error.timestamp - ISO timestamp
 */

/**
 * @typedef {Object} ErrorDetails
 * @property {string} [field] - Field name for validation errors
 * @property {Object} [validationDetails] - Validation specific details
 * @property {string[]} [validationDetails.missingFields] - Missing required fields
 * @property {string} [validationDetails.expectedFormat] - Expected format description
 * @property {*} [validationDetails.providedValue] - The invalid value provided
 * @property {string[]} [validationDetails.validOptions] - Valid enum options
 * @property {number} [validationDetails.min] - Minimum value for numbers
 * @property {number} [validationDetails.max] - Maximum value for numbers
 * @property {string} [resource] - Resource type for not found errors
 * @property {string} [identifier] - Resource identifier for not found errors
 * @property {string} [conflictType] - Type of conflict (DUPLICATE_EMAIL, DUPLICATE_SKU, etc.)
 * @property {Object} [conflictDetails] - Conflict specific details
 * @property {number} [remainingAttempts] - Remaining login attempts
 * @property {boolean} [blocked] - Whether user is temporarily blocked
 * @property {number} [retryAfter] - Seconds to wait before retry
 * @property {string} [businessRule] - Business rule that was violated
 * @property {Object} [ruleDetails] - Rule specific details
 * @property {string} [service] - External service name for service errors
 * @property {Object} [serviceDetails] - Service error details
 */

/**
 * @typedef {Object} ErrorInfo
 * @property {string} type - Error type (network, authentication, validation, etc.)
 * @property {string} code - Error code
 * @property {string} message - User-friendly error message
 * @property {ErrorDetails} [details] - Additional error details
 * @property {number} [remainingAttempts] - For authentication errors
 * @property {boolean} [blocked] - For rate limiting
 * @property {number} [retryAfter] - For rate limiting
 */

export function useErrorHandler() {
  const errors = ref({});
  const apiError = ref('');

  // Clear all errors
  const clearAllErrors = () => {
    errors.value = {};
    apiError.value = '';
  };

  // Clear specific field error
  const clearFieldError = (fieldName) => {
    delete errors.value[fieldName];
    if (apiError.value) {
      apiError.value = '';
    }
  };

  // Set field error
  const setFieldError = (fieldName, message) => {
    errors.value[fieldName] = message;
  };

  // Set API error (general error not tied to specific field)
  const setApiError = (message) => {
    apiError.value = message;
  };

  /**
   * Parse API error response according to new format
   * @param {ApiErrorResponse|Object} errorResponse - The error response from API
   * @returns {Object} Parsed error object with code, message, details
   */
  const parseApiErrorResponse = (errorResponse) => {
    // New API format: { success: false, error: { code, message, details, timestamp } }
    if (errorResponse && errorResponse.error) {
      return {
        code: errorResponse.error.code || ERROR_CODES.UNKNOWN_ERROR,
        message: errorResponse.error.message || '',
        details: errorResponse.error.details || null,
        timestamp: errorResponse.error.timestamp || null
      };
    }
    
    // Fallback for legacy or malformed responses
    return {
      code: errorResponse?.code || ERROR_CODES.UNKNOWN_ERROR,
      message: errorResponse?.message || errorResponse?.error || '',
      details: errorResponse?.details || null,
      timestamp: null
    };
  };

  // Get user-friendly error message
  const getUserFriendlyMessage = (errorCode, serverMessage, details) => {
    // If server provides a message, use it; otherwise use fallback
    if (serverMessage && serverMessage.trim()) {
      return serverMessage;
    }
    
    // Use predefined message or fallback
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
  };

  // Handle field-specific validation errors
  const handleFieldErrors = (details) => {
    if (!details) return;
    
    // Handle missing fields
    if (details.validationDetails?.missingFields) {
      details.validationDetails.missingFields.forEach(field => {
        const mappedField = FIELD_MAPPINGS[field] || field;
        setFieldError(mappedField, 'Trường này là bắt buộc');
      });
    }
    
    // Handle specific field error
    if (details.field) {
      const mappedField = FIELD_MAPPINGS[details.field] || details.field;
      const fieldMessage = getFieldSpecificMessage(details.field, details);
      setFieldError(mappedField, fieldMessage);
    }
  };

  // Get field-specific error messages
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
        case 'dateOfBirth':
          if (validation.expectedFormat) {
            return 'Ngày sinh phải có định dạng YYYY-MM-DD';
          }
          break;
        case 'priceValue':
        case 'stockQuantity':
          if (validation.min !== undefined) {
            return `Giá trị phải lớn hơn hoặc bằng ${validation.min}`;
          }
          break;
        case 'role':
          if (validation.validOptions) {
            return `Vai trò phải là một trong: ${validation.validOptions.join(', ')}`;
          }
          break;
      }
    }
    
    return ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR];
  };

  /**
   * Handle API response error with centralized error processing
   * @param {Error} error - The error object
   * @param {ApiErrorResponse|Object|null} response - The API response
   * @returns {ErrorInfo} Processed error information
   */
  const handleApiError = (error, response = null) => {
    console.error('API Error:', error);

    // Clear previous errors
    clearAllErrors();

    // Handle network errors (no response)
    if (!response) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setApiError(ERROR_MESSAGES[ERROR_CODES.SERVER_NETWORK_ERROR]);
        return { 
          type: 'network', 
          code: ERROR_CODES.SERVER_NETWORK_ERROR,
          message: ERROR_MESSAGES[ERROR_CODES.SERVER_NETWORK_ERROR]
        };
      }
      
      if (error.name === 'AbortError') {
        setApiError(ERROR_MESSAGES[ERROR_CODES.SERVER_TIMEOUT]);
        return { 
          type: 'timeout', 
          code: ERROR_CODES.SERVER_TIMEOUT,
          message: ERROR_MESSAGES[ERROR_CODES.SERVER_TIMEOUT]
        };
      }
      
      setApiError(ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]);
      return { 
        type: 'unknown', 
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
      };
    }

    // Parse error response
    let errorData;
    try {
      errorData = typeof response === 'string' ? JSON.parse(response) : response;
    } catch (e) {
      setApiError(ERROR_MESSAGES[ERROR_CODES.INVALID_JSON]);
      return { 
        type: 'parse', 
        code: ERROR_CODES.INVALID_JSON,
        message: ERROR_MESSAGES[ERROR_CODES.INVALID_JSON]
      };
    }

    const parsedError = parseApiErrorResponse(errorData);
    const { code, message, details } = parsedError;

    // Handle specific error types
    switch (code) {
      case ERROR_CODES.VALIDATION_ERROR:
        handleFieldErrors(details);
        break;
        
      case ERROR_CODES.AUTHENTICATION_FAILED:
        const authMessage = getUserFriendlyMessage(code, message, details);
        setApiError(authMessage);
        
        // Return additional auth-specific data
        return {
          type: 'authentication',
          code,
          message: authMessage,
          remainingAttempts: details?.remainingAttempts,
          blocked: details?.blocked,
          secondsRemaining: details?.secondsRemaining,
          retryAfter: details?.retryAfter
        };
        
      case ERROR_CODES.CONFLICT_ERROR:
        // Handle conflict errors with specific messages
        let conflictMessage = message;
        if (details?.conflictType === 'DUPLICATE_EMAIL') {
          conflictMessage = 'Email này đã được sử dụng';
          setFieldError('email', conflictMessage);
        } else if (details?.conflictType === 'DUPLICATE_SKU') {
          conflictMessage = 'Mã SKU này đã tồn tại';
          setFieldError('sku', conflictMessage);
        }
        setApiError(conflictMessage || getUserFriendlyMessage(code, message, details));
        break;
        
      case ERROR_CODES.BUSINESS_LOGIC_ERROR:
        // Handle business logic errors
        let businessMessage = message;
        if (details?.businessRule === 'PASSWORD_POLICY') {
          businessMessage = 'Mật khẩu không đáp ứng yêu cầu bảo mật';
          if (details.ruleDetails?.requirements) {
            businessMessage += ': ' + details.ruleDetails.requirements.join(', ');
          }
        } else if (details?.businessRule === 'AGE_RESTRICTION') {
          businessMessage = `Tuổi phải từ ${details.ruleDetails?.minAge || 18} trở lên`;
        }
        setApiError(businessMessage || getUserFriendlyMessage(code, message, details));
        break;
        
      case ERROR_CODES.RATE_LIMITED:
        const rateLimitMessage = getUserFriendlyMessage(code, message, details);
        setApiError(rateLimitMessage);
        
        return {
          type: 'rate_limit',
          code,
          message: rateLimitMessage,
          retryAfter: details?.retryAfter
        };
        
      default:
        // Handle general errors
        const displayMessage = getUserFriendlyMessage(code, message, details);
        setApiError(displayMessage);
    }

    return {
      type: 'general',
      code,
      message: getUserFriendlyMessage(code, message, details),
      details
    };
  };

  // Handle fetch response
  const handleFetchResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw { 
        response: errorData, 
        status: response.status,
        statusText: response.statusText 
      };
    }
    return response.json();
  };

  /**
   * Make API request with centralized error handling
   * @param {string} url - The API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} The API response data
   * @throws {Error} Enhanced error with errorInfo property
   */
  const makeApiRequest = async (url, options = {}) => {
    try {
      const headers = { ...options.headers };
      
      // Don't set Content-Type for FormData, let browser set it automatically
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        credentials: 'include',
        headers,
        ...options
      });

      return await handleFetchResponse(response);
    } catch (error) {
      if (error.response) {
        // Handle API error response
        const errorInfo = handleApiError(error, error.response);
        throw { ...error, errorInfo };
      } else {
        // Handle network/other errors
        const errorInfo = handleApiError(error);
        throw { ...error, errorInfo };
      }
    }
  };

  // Enhanced error handler specifically for API responses
  const handleApiResponseError = (errorResponse) => {
    return handleApiError(null, errorResponse);
  };

  // Validation helpers (client-side validation that matches backend)
  const validateEmail = (email) => {
    if (!email || !email.trim()) {
      return 'Email là bắt buộc';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email không hợp lệ';
    }
    
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Mật khẩu là bắt buộc';
    }
    
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ thường';
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 số';
    }
    
    return '';
  };

  const validateFullName = (fullName) => {
    if (!fullName || !fullName.trim()) {
      return 'Họ và tên là bắt buộc';
    }
    
    if (fullName.trim().length < 2) {
      return 'Họ và tên phải có ít nhất 2 ký tự';
    }
    
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
      return 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
    }
    
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || !phone.trim()) {
      return 'Số điện thoại là bắt buộc';
    }
    
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Số điện thoại không hợp lệ';
    }
    
    return '';
  };

  const validateDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18) {
      return 'Bạn phải từ 18 tuổi trở lên';
    }
    
    if (age > 120) {
      return 'Ngày sinh không hợp lệ';
    }
    
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Xác nhận mật khẩu là bắt buộc';
    }
    
    if (confirmPassword !== password) {
      return 'Mật khẩu không khớp';
    }
    
    return '';
  };

  const validateAgreeTerms = (agreeTerms) => {
    if (!agreeTerms) {
      return 'Bạn phải đồng ý với điều khoản sử dụng';
    }
    
    return '';
  };

  // Validate field and set error if invalid
  const validateField = (fieldName, value, extraParam = null) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'fullName':
        errorMessage = validateFullName(value);
        break;
      case 'phone':
        errorMessage = validatePhone(value);
        break;
      case 'dateOfBirth':
        errorMessage = validateDateOfBirth(value);
        break;
      case 'confirmPassword':
        errorMessage = validateConfirmPassword(extraParam, value);
        break;
      case 'agreeTerms':
        errorMessage = validateAgreeTerms(value);
        break;
      default:
        return true;
    }
    
    if (errorMessage) {
      setFieldError(fieldName, errorMessage);
      return false;
    } else {
      clearFieldError(fieldName);
      return true;
    }
  };

  // Validate entire form
  const validateForm = (formData, rules = []) => {
    let isValid = true;
    
    rules.forEach(rule => {
      const { field, value, extraParam } = rule;
      if (!validateField(field, value, extraParam)) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  return {
    errors,
    apiError,
    clearAllErrors,
    clearFieldError,
    setFieldError,
    setApiError,
    handleApiError,
    handleApiResponseError,
    makeApiRequest,
    validateField,
    validateForm,
    // Individual validators
    validateEmail,
    validatePassword,
    validateFullName,
    validatePhone,
    validateDateOfBirth,
    validateConfirmPassword,
    validateAgreeTerms
  };
}