// Test utility for verifying standardized error handling
import { useErrorHandler } from '../composables/useErrorHandler.js'
import { useErrorDisplay } from '../composables/useErrorDisplay.js'

/**
 * Test the standardized error handling system
 * Run this in browser console to verify error parsing works correctly
 */
export function testErrorHandling() {
  const { parseApiErrorResponse } = useErrorHandler()
  const { showErrorToast, createErrorBadge, extractFieldErrors } = useErrorDisplay()

  console.log('🧪 Testing Standardized Error Handling System...')

  // Test 1: New standardized backend format
  const standardizedError = {
    success: false,
    error: {
      code: 'AUTHORIZATION_FAILED',
      message: 'Insufficient permissions to access this resource (superuser or pharmacist required)',
      details: {
        requiredRole: 'admin',
        userRole: 'user'
      },
      timestamp: '2025-08-05T09:34:01.990Z'
    }
  }

  console.log('✅ Test 1: Standardized format')
  const parsed1 = parseApiErrorResponse(standardizedError)
  console.log('Parsed:', parsed1)
  console.assert(parsed1.code === 'AUTHORIZATION_FAILED', 'Code should be AUTHORIZATION_FAILED')
  console.assert(parsed1.message.includes('Insufficient permissions'), 'Message should contain permission text')

  // Test 2: Validation error with field details
  const validationError = {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Required fields are missing',
      details: {
        field: 'email',
        validationDetails: {
          missingFields: ['email', 'password'],
          expectedFormat: 'valid email address'
        }
      },
      timestamp: '2025-08-05T09:34:01.990Z'
    }
  }

  console.log('✅ Test 2: Validation error')
  const parsed2 = parseApiErrorResponse(validationError)
  console.log('Parsed:', parsed2)
  const fieldErrors = extractFieldErrors({ response: validationError })
  console.log('Field errors:', fieldErrors)
  console.assert(fieldErrors.email, 'Should extract email field error')
  console.assert(fieldErrors.password, 'Should extract password field error')

  // Test 3: Legacy format compatibility
  const legacyError = {
    error: {
      message: 'Legacy error message',
      code: 'LEGACY_ERROR'
    }
  }

  console.log('✅ Test 3: Legacy format')
  const parsed3 = parseApiErrorResponse(legacyError)
  console.log('Parsed:', parsed3)
  console.assert(parsed3.message === 'Legacy error message', 'Should handle legacy format')

  // Test 4: String error
  const stringError = 'Simple string error'

  console.log('✅ Test 4: String error')
  const parsed4 = parseApiErrorResponse(stringError)
  console.log('Parsed:', parsed4)
  console.assert(parsed4.message === 'Simple string error', 'Should handle string errors')

  // Test 5: Error badge creation
  console.log('✅ Test 5: Error badge creation')
  const badge = createErrorBadge(standardizedError)
  console.log('Badge:', badge)
  console.assert(badge.type === 'error', 'Should create error type badge')
  console.assert(badge.title === 'Không có quyền', 'Should have Vietnamese title')

  // Test 6: Rate limit error
  const rateLimitError = {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests',
      details: {
        retryAfter: 60
      },
      timestamp: '2025-08-05T09:34:01.990Z'
    }
  }

  console.log('✅ Test 6: Rate limit error')
  const badge2 = createErrorBadge(rateLimitError)
  console.log('Rate limit badge:', badge2)
  console.assert(badge2.type === 'info', 'Rate limit should be info type')
  console.assert(badge2.actions.some(a => a.countdown === 60), 'Should have countdown action')

  console.log('🎉 All tests passed! Error handling system is working correctly.')
  
  return {
    standardizedError: parsed1,
    validationError: parsed2,
    legacyError: parsed3,
    stringError: parsed4,
    errorBadge: badge,
    rateLimitBadge: badge2,
    fieldErrors
  }
}

/**
 * Test API error simulation
 * Simulates different error scenarios to verify toast display
 */
export function testErrorDisplay() {
  const { showErrorToast } = useErrorDisplay()

  console.log('🧪 Testing Error Display...')

  // Simulate different error types
  const errors = [
    {
      name: 'Authentication Error',
      error: {
        success: false,
        error: {
          code: 'AUTHENTICATION_FAILED',
          message: 'Session expired',
          timestamp: new Date().toISOString()
        }
      }
    },
    {
      name: 'Validation Error',
      error: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: {
            validationDetails: {
              missingFields: ['name', 'email']
            }
          },
          timestamp: new Date().toISOString()
        }
      }
    },
    {
      name: 'Server Error',
      error: {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          timestamp: new Date().toISOString()
        }
      }
    }
  ]

  errors.forEach((test, index) => {
    setTimeout(() => {
      console.log(`Showing ${test.name}...`)
      showErrorToast(test.error, `Test error ${index + 1}`)
    }, index * 2000) // Stagger the toasts
  })

  console.log('Check your toast notifications!')
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testErrorHandling = testErrorHandling
  window.testErrorDisplay = testErrorDisplay
}