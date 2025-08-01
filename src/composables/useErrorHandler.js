// Frontend: composables/useErrorHandler.js
import { ref } from 'vue';
import { ERROR_CODES, ERROR_MESSAGES, FIELD_MAPPINGS } from '../constants/errCodes';

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

  // Handle API response error
  const handleApiError = (error, response = null) => {
    console.error('API Error:', error);

    // Clear previous errors
    clearAllErrors();

    // Handle network errors
    if (!response) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setApiError(ERROR_MESSAGES[ERROR_CODES.SERVER_NETWORK_ERROR]);
        return { type: 'network', code: ERROR_CODES.SERVER_NETWORK_ERROR };
      }
      
      if (error.name === 'AbortError') {
        setApiError(ERROR_MESSAGES[ERROR_CODES.SERVER_TIMEOUT]);
        return { type: 'timeout', code: ERROR_CODES.SERVER_TIMEOUT };
      }
      
      setApiError(ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]);
      return { type: 'unknown', code: ERROR_CODES.UNKNOWN_ERROR };
    }

    // Parse error response
    let errorData;
    try {
      errorData = typeof response === 'string' ? JSON.parse(response) : response;
    } catch (e) {
      setApiError(ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]);
      return { type: 'parse', code: ERROR_CODES.UNKNOWN_ERROR };
    }

    const {
      error: errorMessage = '',
      code = ERROR_CODES.UNKNOWN_ERROR,
      field = null,
      remainingAttempts,
      blocked,
      secondsRemaining,
      blockedUntil
    } = errorData;

    // Handle field-specific errors
    if (field && FIELD_MAPPINGS[field]) {
      const mappedField = FIELD_MAPPINGS[field];
      setFieldError(mappedField, errorMessage || ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]);
      
      return {
        type: 'field',
        code,
        field: mappedField,
        remainingAttempts,
        blocked,
        secondsRemaining,
        blockedUntil
      };
    }

    // Handle general API errors
    const displayMessage = errorMessage || ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
    setApiError(displayMessage);

    return {
      type: 'general',
      code,
      message: displayMessage,
      remainingAttempts,
      blocked,
      secondsRemaining,
      blockedUntil
    };
  };

  // Handle fetch response
  const handleFetchResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: errorData, status: response.status };
    }
    return response.json();
  };

  // Make API request with error handling
  const makeApiRequest = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
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