// composables/useAuth.js
import {
    ref,
    onMounted,
    onUnmounted,
    nextTick
} from 'vue'

export function useAuth() {
    // Reactive state
    const isLoggedIn = ref(false)
    const user = ref({
        id: '',
        email: '',
        name: '',
        phone: '',
        role: 'client'
    })

    // Check authentication status by querying the server
    const checkSession = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/session', {
                method: 'GET',
                credentials: 'include' // Include session cookies
            })
            const data = await response.json()

            if (response.ok && data.authenticated) {
                isLoggedIn.value = true
                user.value = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.fullName || "Default User", // Handle optional fullName field
                    phone: data.user.phone || "123456789", // Handle optional phone field,
                    role: data.user.role || "user" // Handle optional role field
                }
            } else {
                isLoggedIn.value = false
                user.value = {
                    id: '',
                    email: '',
                    name: '',
                    phone: ''
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
                role: 'client'
            }
            await nextTick()
            return false
        }
    }

    // Logout by calling server-side logout endpoint
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                credentials: 'include' // Include session cookies
            })
            const data = await response.json()

            if (response.ok && data.success) {
                isLoggedIn.value = false
                user.value = {
                    id: '',
                    email: '',
                    name: '',
                    phone: '',
                    role: 'client'
                }
            }
            await nextTick()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Force login state update - useful after successful authentication
    const forceLoginStateUpdate = async () => {
        const result = await checkSession()
        await nextTick()
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
        user,
        checkSession,
        forceLoginStateUpdate,
        logout
    }
}