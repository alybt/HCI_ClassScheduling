/**
 * Data Manager Module
 * Handles local storage and application state management
 */
const DataManager = (() => {
    // Private state
    const state = {
        data: {},
        listeners: new Map()
    };

    /**
     * Save data to local storage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    function saveToStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }

    /**
     * Load data from local storage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored data or default value
     */
    function loadFromStorage(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            return serialized ? JSON.parse(serialized) : defaultValue;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return defaultValue;
        }
    }

    /**
     * Update application state
     * @param {string} key - State key
     * @param {any} value - New value
     * @param {boolean} persist - Whether to save to local storage
     */
    function setState(key, value, persist = false) {
        state.data[key] = value;
        
        // Notify listeners
        if (state.listeners.has(key)) {
            state.listeners.get(key).forEach(listener => {
                listener(value);
            });
        }

        // Persist to storage if required
        if (persist) {
            saveToStorage(key, value);
        }
    }

    /**
     * Get value from application state
     * @param {string} key - State key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} State value or default
     */
    function getState(key, defaultValue = null) {
        return state.data.hasOwnProperty(key) ? state.data[key] : defaultValue;
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    function subscribe(key, callback) {
        if (!state.listeners.has(key)) {
            state.listeners.set(key, new Set());
        }
        state.listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            const listeners = state.listeners.get(key);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    state.listeners.delete(key);
                }
            }
        };
    }

    /**
     * Clear all data from storage and state
     */
    function clearAll() {
        state.data = {};
        localStorage.clear();
    }

    /**
     * Initialize data manager with stored data
     */
    function initialize() {
        // Load persisted data into state
        const storedKeys = Object.values(CONFIG.STORAGE);
        storedKeys.forEach(key => {
            const value = loadFromStorage(key);
            if (value !== null) {
                state.data[key] = value;
            }
        });
    }

    /**
     * Get size of stored data
     * @returns {number} Size in bytes
     */
    function getStorageSize() {
        let size = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                size += localStorage[key].length * 2; // UTF-16 uses 2 bytes per char
            }
        }
        return size;
    }

    // Public API
    return {
        initialize,
        setState,
        getState,
        subscribe,
        saveToStorage,
        loadFromStorage,
        clearAll,
        getStorageSize
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DataManager.initialize();
});
