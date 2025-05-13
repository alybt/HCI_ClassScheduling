/**
 * Authentication Service
 * Handles user authentication and session management
 */
const AuthService = (() => {
    // Private state
    let currentUser = null;
    let authToken = null;
    let refreshToken = null;
    let refreshTimeout = null;

    /**
     * Initialize the auth service
     */
    function initialize() {
        // Load tokens from storage
        authToken = DataManager.loadFromStorage(CONFIG.AUTH.TOKEN_KEY);
        refreshToken = DataManager.loadFromStorage(CONFIG.AUTH.REFRESH_TOKEN_KEY);
        
        // Load user data if tokens exist
        if (authToken) {
            loadUserData();
            setupTokenRefresh();
        }
    }

    /**
     * Load user data from token
     */
    async function loadUserData() {
        try {
            const response = await Utils.fetchAPI('/api/user/profile', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            if (response.success) {
                currentUser = response.data;
                EventManager.emit(EventManager.EVENTS.AUTH.LOGIN, currentUser);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            logout();
        }
    }

    /**
     * Set up automatic token refresh
     */
    function setupTokenRefresh() {
        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
        }

        // Refresh 5 minutes before expiry
        const expiresIn = getTokenExpiry(authToken);
        if (expiresIn > 0) {
            refreshTimeout = setTimeout(
                refreshAuthToken,
                (expiresIn - 300) * 1000 // 5 minutes before expiry
            );
        }
    }

    /**
     * Get token expiry time
     * @param {string} token - JWT token
     * @returns {number} Seconds until expiry
     */
    function getTokenExpiry(token) {
        try {
            const [, payload] = token.split('.');
            const { exp } = JSON.parse(atob(payload));
            return exp - Math.floor(Date.now() / 1000);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Refresh the auth token
     */
    async function refreshAuthToken() {
        try {
            const response = await Utils.fetchAPI('/api/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken })
            });

            if (response.success) {
                authToken = response.data.token;
                refreshToken = response.data.refreshToken;

                // Save new tokens
                DataManager.saveToStorage(CONFIG.AUTH.TOKEN_KEY, authToken);
                DataManager.saveToStorage(CONFIG.AUTH.REFRESH_TOKEN_KEY, refreshToken);

                setupTokenRefresh();
            } else {
                handleAuthError('Token refresh failed');
            }
        } catch (error) {
            handleAuthError('Token refresh failed');
        }
    }

    /**
     * Handle authentication errors
     * @param {string} message - Error message
     */
    function handleAuthError(message) {
        console.error('Auth error:', message);
        EventManager.emit(EventManager.EVENTS.AUTH.SESSION_EXPIRED);
        logout();
    }

    /**
     * Log in user
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise} Login result
     */
    async function login(username, password) {
        try {
            const response = await Utils.fetchAPI('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (response.success) {
                authToken = response.data.token;
                refreshToken = response.data.refreshToken;
                currentUser = response.data.user;

                // Save tokens
                DataManager.saveToStorage(CONFIG.AUTH.TOKEN_KEY, authToken);
                DataManager.saveToStorage(CONFIG.AUTH.REFRESH_TOKEN_KEY, refreshToken);

                setupTokenRefresh();
                EventManager.emit(EventManager.EVENTS.AUTH.LOGIN, currentUser);

                return { success: true, user: currentUser };
            } else {
                return {
                    success: false,
                    error: response.error || CONFIG.ERRORS.AUTH.INVALID_CREDENTIALS
                };
            }
        } catch (error) {
            return {
                success: false,
                error: CONFIG.ERRORS.NETWORK
            };
        }
    }

    /**
     * Log out user
     */
    function logout() {
        // Clear tokens and user data
        authToken = null;
        refreshToken = null;
        currentUser = null;

        // Clear storage
        DataManager.saveToStorage(CONFIG.AUTH.TOKEN_KEY, null);
        DataManager.saveToStorage(CONFIG.AUTH.REFRESH_TOKEN_KEY, null);

        // Clear refresh timeout
        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
        }

        // Notify listeners
        EventManager.emit(EventManager.EVENTS.AUTH.LOGOUT);
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    function isAuthenticated() {
        return !!authToken && !!currentUser;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user data
     */
    function getCurrentUser() {
        return currentUser;
    }

    /**
     * Get auth token
     * @returns {string|null} Current auth token
     */
    function getToken() {
        return authToken;
    }

    /**
     * Check if user has required role
     * @param {string|Array} requiredRoles - Required role(s)
     * @returns {boolean} Whether user has required role
     */
    function hasRole(requiredRoles) {
        if (!currentUser || !currentUser.roles) return false;

        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        return roles.some(role => currentUser.roles.includes(role));
    }

    // Public API
    return {
        initialize,
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        getToken,
        hasRole
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AuthService.initialize();
});
