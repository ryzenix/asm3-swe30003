// Frontend: constants/errorCodes.js - Updated to match API reference
export const ERROR_CODES = {
  // 400 - Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  REFERENCE_ERROR: 'REFERENCE_ERROR',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_INPUT_FORMAT: 'INVALID_INPUT_FORMAT',
  
  // 401 - Authentication Errors
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // 403 - Authorization Errors
  AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',
  
  // 404 - Not Found Errors
  NOT_FOUND: 'NOT_FOUND',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  
  // 409 - Conflict Errors
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  
  // 422 - Business Logic Errors
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
  
  // 429 - Rate Limiting
  RATE_LIMITED: 'RATE_LIMITED',
  
  // 500 - Server Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // 502 - External Service Errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // Special Cases
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_JSON: 'INVALID_JSON',

  // Network/Client Errors
  SERVER_NETWORK_ERROR: 'SERVER_NETWORK_ERROR',
  SERVER_TIMEOUT: 'SERVER_TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error messages in Vietnamese (fallback if not provided by server)
export const ERROR_MESSAGES = {
  // 400 - Validation Errors
  [ERROR_CODES.VALIDATION_ERROR]: 'Dữ liệu nhập vào không hợp lệ',
  [ERROR_CODES.DUPLICATE_ENTRY]: 'Thông tin này đã tồn tại trong hệ thống',
  [ERROR_CODES.REFERENCE_ERROR]: 'Tham chiếu không hợp lệ',
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
  [ERROR_CODES.INVALID_INPUT_FORMAT]: 'Định dạng dữ liệu không hợp lệ',
  
  // 401 - Authentication Errors
  [ERROR_CODES.AUTHENTICATION_FAILED]: 'Xác thực thất bại',
  [ERROR_CODES.INVALID_TOKEN]: 'Phiên đăng nhập không hợp lệ',
  
  // 403 - Authorization Errors
  [ERROR_CODES.AUTHORIZATION_FAILED]: 'Bạn không có quyền thực hiện hành động này',
  
  // 404 - Not Found Errors
  [ERROR_CODES.NOT_FOUND]: 'Không tìm thấy tài nguyên yêu cầu',
  [ERROR_CODES.ROUTE_NOT_FOUND]: 'Đường dẫn không tồn tại',
  
  // 409 - Conflict Errors
  [ERROR_CODES.CONFLICT_ERROR]: 'Xung đột dữ liệu',
  
  // 422 - Business Logic Errors
  [ERROR_CODES.BUSINESS_LOGIC_ERROR]: 'Vi phạm quy tắc kinh doanh',
  
  // 429 - Rate Limiting
  [ERROR_CODES.RATE_LIMITED]: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau',
  
  // 500 - Server Errors
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau',
  [ERROR_CODES.DATABASE_ERROR]: 'Lỗi cơ sở dữ liệu. Vui lòng thử lại sau',
  
  // 502 - External Service Errors
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'Lỗi dịch vụ bên ngoài. Vui lòng thử lại sau',
  
  // Special Cases
  [ERROR_CODES.FILE_TOO_LARGE]: 'Tệp tin quá lớn',
  [ERROR_CODES.INVALID_JSON]: 'Dữ liệu JSON không hợp lệ',

  // Network/Client Errors
  [ERROR_CODES.SERVER_NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại',
  [ERROR_CODES.SERVER_TIMEOUT]: 'Yêu cầu quá thời gian. Vui lòng thử lại',
  [ERROR_CODES.UNKNOWN_ERROR]: 'Có lỗi không xác định xảy ra. Vui lòng thử lại'
};

// Field mappings for error targeting
export const FIELD_MAPPINGS = {
  email: 'email',
  password: 'password',
  currentPassword: 'currentPassword',
  newPassword: 'password',
  fullName: 'fullName',
  phone: 'phone',
  dateOfBirth: 'dateOfBirth',
  confirmPassword: 'confirmPassword',
  agreeTerms: 'agreeTerms'
};