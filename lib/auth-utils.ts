/**
 * Authentication utilities for student and teacher dashboards
 * This file provides helper functions to get authenticated user information
 */

interface User {
    id: number
    email: string
    role: 'student' | 'teacher' | 'admin'
    firstName: string
    lastName: string
}

interface AuthResponse {
    user: User
    token: string
}

/**
 * Get the current authenticated user from localStorage
 * @returns User object or null if not authenticated
 */
export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null

    const userStr = localStorage.getItem('user')
    if (!userStr) return null

    try {
        return JSON.parse(userStr)
    } catch (error) {
        console.error('Error parsing user data:', error)
        return null
    }
}

/**
 * Get the JWT token from localStorage
 * @returns Token string or null
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
}

/**
 * Check if user is authenticated
 * @returns boolean
 */
export function isAuthenticated(): boolean {
    return !!getAuthToken() && !!getCurrentUser()
}

/**
 * Get the user's role
 * @returns Role string or null
 */
export function getUserRole(): 'student' | 'teacher' | 'admin' | null {
    const user = getCurrentUser()
    return user?.role || null
}

/**
 * Get the user's ID
 * @returns User ID or null
 */
export function getUserId(): number | null {
    const user = getCurrentUser()
    return user?.id || null
}

/**
 * Get student ID from user ID
 * This requires an API call to map user_id to student.id
 * @param userId - The user ID
 * @returns Promise with student ID
 */
export async function getStudentIdFromUserId(userId: number): Promise<number | null> {
    try {
        const token = getAuthToken()
        const response = await fetch(`http://localhost:3001/students/by-user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            const data = await response.json()
            return data.id
        }
        return null
    } catch (error) {
        console.error('Error fetching student ID:', error)
        return null
    }
}

/**
 * Get teacher ID from user ID
 * This requires an API call to map user_id to teacher.id
 * @param userId - The user ID
 * @returns Promise with teacher ID
 */
export async function getTeacherIdFromUserId(userId: number): Promise<number | null> {
    try {
        const token = getAuthToken()
        const response = await fetch(`http://localhost:3001/teachers/by-user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            const data = await response.json()
            return data.id
        }
        return null
    } catch (error) {
        console.error('Error fetching teacher ID:', error)
        return null
    }
}

/**
 * Logout user by clearing localStorage
 */
export function logout(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
}

/**
 * Save authentication data to localStorage
 * @param authData - Authentication response data
 */
export function saveAuthData(authData: AuthResponse): void {
    if (typeof window === 'undefined') return

    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData.user))
}

/**
 * Create authorization headers for API requests
 * @returns Headers object with Authorization
 */
export function getAuthHeaders(): HeadersInit {
    const token = getAuthToken()
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    }
}

/**
 * Make an authenticated API request
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise with response
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const headers = {
        ...getAuthHeaders(),
        ...options.headers
    }

    return fetch(url, {
        ...options,
        headers
    })
}

/**
 * Check if user has required role
 * @param requiredRole - Required role
 * @returns boolean
 */
export function hasRole(requiredRole: 'student' | 'teacher' | 'admin'): boolean {
    const userRole = getUserRole()
    return userRole === requiredRole
}

/**
 * Redirect to appropriate dashboard based on user role
 */
export function redirectToDashboard(): void {
    if (typeof window === 'undefined') return

    const role = getUserRole()

    switch (role) {
        case 'student':
            window.location.href = '/student/dashboard'
            break
        case 'teacher':
            window.location.href = '/teacher/dashboard'
            break
        case 'admin':
            window.location.href = '/admin/dashboard'
            break
        default:
            window.location.href = '/login'
    }
}
