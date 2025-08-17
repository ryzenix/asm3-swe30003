// composables/useAuth.js
import {
    ref,
    onMounted,
    onUnmounted,
    nextTick
} from 'vue'
import { useErrorHandler } from './useErrorHandler'

export function useAuth() {
    const { makeApiRequest } = useErrorHandler()
    
    // Reactive state
    const isLoggedIn = ref(false)
    const isLoading = ref(false) // Add loading state for session check
    const user = ref({
        id: '',
        email: '',
        name: '',
        phone: '',
        role: 'client',
        gender: '',
        dateOfBirth: ''
    })

    // Check authentication status by querying the server
const checkSession = async () => {
        isLoading.value = true // Set loading to true when starting session check
        try {
            const data = await makeApiRequest('http://localhost:3000/auth/session', {
                method: 'GET'
            })

            if (data.authenticated) {
                isLoggedIn.value = true
                user.value = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.fullName || "Default User", // Handle optional fullName field
                    phone: data.user.phone || "123456789", // Handle optional phone field,
                    role: data.user.role || "user", // Handle optional role field
                    gender: data.user.gender || "", // Handle optional gender field
                    dateOfBirth: data.user.dateOfBirth || "" // Handle optional dateOfBirth field
                }
            } else {
                isLoggedIn.value = false
                user.value = {
                    id: '',
                    email: '',
                    name: '',
                    phone: '',
                    role: 'client',
                    gender: '',
                    dateOfBirth: ''
                }
            }

            console.log('Session check result:', user.value)

            await nextTick()
            return data.authenticated;
        } catch (error) {
            console.error('Session check error:', error)
            isLoggedIn.value = false
            user.value = {
                id: '',
                email: '',
                name: '',
                phone: '',
                role: 'client',
                gender: '',
                dateOfBirth: ''
            }
            await nextTick()
            return false
        } finally {
            isLoading.value = false // Set loading to false when session check completes
        }
    }

    // Logout by calling server-side logout endpoint
    const logout = async () => {
        try {
            
            isLoggedIn.value = false
            user.value = {
                id: '',
                email: '',
                name: '',
                phone: '',
                role: 'client',
                gender: '',
                dateOfBirth: ''
            }
            console.log('Auth: Starting logout process, updating local state. isLoggedIn:', isLoggedIn.value, 'user:', user.value)
            const data = await makeApiRequest('http://localhost:3000/auth/logout', {
                method: 'POST'
            })

            if (data.success) {

                console.log("Auth: Server logout successful")
            } else {
                console.warn('Auth: Server logout failed:', data)
            }
            await nextTick()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Force login state update - useful after successful authentication
    const forceLoginStateUpdate = async () => {
        console.log('useAuth: forceLoginStateUpdate called')
        const result = await checkSession()
        await nextTick()
        
        // Force reactivity update
        isLoggedIn.value = isLoggedIn.value
        user.value = { ...user.value }
        
        console.log('useAuth: forceLoginStateUpdate completed', {
            result,
            isLoggedIn: isLoggedIn.value,
            user: user.value
        })
        
        return result
    }

    // Initialize session check on mount
    onMounted(() => {
        checkSession()
    })

    // Cleanup on unmount
    onUnmounted(() => {
        // No timer to clean up, but keep for future extensibility
    })

    return {
        isLoggedIn,
        isLoading, // Export loading state
        user,
        checkSession,
        forceLoginStateUpdate,
        logout
    }
}