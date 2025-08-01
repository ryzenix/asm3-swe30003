// Frontend: constants/errorCodes.js
export const ERROR_CODES = {
  // Authentication Errors (AUTH_xxx)
  AUTH_MISSING_CREDENTIALS: 'AUTH_MISSING_CREDENTIALS',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_USER_INACTIVE: 'AUTH_USER_INACTIVE',
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  AUTH_TOO_MANY_ATTEMPTS: 'AUTH_TOO_MANY_ATTEMPTS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_NOT_AUTHENTICATED: 'AUTH_NOT_AUTHENTICATED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',

  // Validation Errors (VALIDATION_xxx)
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_EMAIL: 'VALIDATION_INVALID_EMAIL',
  VALIDATION_INVALID_PHONE: 'VALIDATION_INVALID_PHONE',
  VALIDATION_WEAK_PASSWORD: 'VALIDATION_WEAK_PASSWORD',
  VALIDATION_PASSWORD_MISMATCH: 'VALIDATION_PASSWORD_MISMATCH',
  VALIDATION_INVALID_DATE: 'VALIDATION_INVALID_DATE',
  VALIDATION_INVALID_ROLE: 'VALIDATION_INVALID_ROLE',
  VALIDATION_NAME_TOO_SHORT: 'VALIDATION_NAME_TOO_SHORT',
  VALIDATION_NAME_INVALID_CHARS: 'VALIDATION_NAME_INVALID_CHARS',
  VALIDATION_AGE_RESTRICTION: 'VALIDATION_AGE_RESTRICTION',

  // Resource Errors (RESOURCE_xxx)
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_EMAIL_EXISTS: 'RESOURCE_EMAIL_EXISTS',
  RESOURCE_PHONE_EXISTS: 'RESOURCE_PHONE_EXISTS',
  RESOURCE_ACCESS_DENIED: 'RESOURCE_ACCESS_DENIED',

  // Server Errors (SERVER_xxx)
  SERVER_INTERNAL_ERROR: 'SERVER_INTERNAL_ERROR',
  SERVER_DATABASE_ERROR: 'SERVER_DATABASE_ERROR',
  SERVER_NETWORK_ERROR: 'SERVER_NETWORK_ERROR',
  SERVER_TIMEOUT: 'SERVER_TIMEOUT',
  SERVER_SERVICE_UNAVAILABLE: 'SERVER_SERVICE_UNAVAILABLE',

  // Rate Limiting (RATE_xxx)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_IP_BLOCKED: 'RATE_LIMIT_IP_BLOCKED',

  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error messages in Vietnamese (fallback if not provided by server)
export const ERROR_MESSAGES = {
  // Authentication Errors
  [ERROR_CODES.AUTH_MISSING_CREDENTIALS]: 'Vui lòng nhập đầy đủ email và mật khẩu',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không chính xác',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'Tài khoản không tồn tại',
  [ERROR_CODES.AUTH_USER_INACTIVE]: 'Tài khoản đã bị vô hiệu hóa',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Tài khoản đã bị khóa tạm thời do nhập sai quá nhiều lần',
  [ERROR_CODES.AUTH_TOO_MANY_ATTEMPTS]: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Phiên đăng nhập không hợp lệ',
  [ERROR_CODES.AUTH_NOT_AUTHENTICATED]: 'Vui lòng đăng nhập để tiếp tục',
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 'Bạn không có quyền thực hiện hành động này',

  // Validation Errors
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Trường này là bắt buộc',
  [ERROR_CODES.VALIDATION_INVALID_EMAIL]: 'Email không hợp lệ',
  [ERROR_CODES.VALIDATION_INVALID_PHONE]: 'Số điện thoại không hợp lệ',
  [ERROR_CODES.VALIDATION_WEAK_PASSWORD]: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  [ERROR_CODES.VALIDATION_PASSWORD_MISMATCH]: 'Mật khẩu xác nhận không khớp',
  [ERROR_CODES.VALIDATION_INVALID_DATE]: 'Ngày sinh không hợp lệ',
  [ERROR_CODES.VALIDATION_INVALID_ROLE]: 'Vai trò không hợp lệ',
  [ERROR_CODES.VALIDATION_NAME_TOO_SHORT]: 'Họ và tên phải có ít nhất 2 ký tự',
  [ERROR_CODES.VALIDATION_NAME_INVALID_CHARS]: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng',
  [ERROR_CODES.VALIDATION_AGE_RESTRICTION]: 'Bạn phải từ 18 tuổi trở lên',

  // Resource Errors
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Không tìm thấy tài nguyên yêu cầu',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Tài nguyên đã tồn tại',
  [ERROR_CODES.RESOURCE_EMAIL_EXISTS]: 'Email này đã được sử dụng',
  [ERROR_CODES.RESOURCE_PHONE_EXISTS]: 'Số điện thoại này đã được sử dụng',
  [ERROR_CODES.RESOURCE_ACCESS_DENIED]: 'Bạn không có quyền truy cập tài nguyên này',

  // Server Errors
  [ERROR_CODES.SERVER_INTERNAL_ERROR]: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau',
  [ERROR_CODES.SERVER_DATABASE_ERROR]: 'Lỗi cơ sở dữ liệu. Vui lòng thử lại sau',
  [ERROR_CODES.SERVER_NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại',
  [ERROR_CODES.SERVER_TIMEOUT]: 'Yêu cầu quá thời gian. Vui lòng thử lại',
  [ERROR_CODES.SERVER_SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau',

  // Rate Limiting
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Bạn đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau',
  [ERROR_CODES.RATE_LIMIT_IP_BLOCKED]: 'Địa chỉ IP của bạn đã bị chặn tạm thời',

  // Generic
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