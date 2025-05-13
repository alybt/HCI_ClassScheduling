/**
 * Event Manager Module
 * Handles application-wide events and communication between components
 */
const EventManager = (() => {
    // Private event storage
    const events = new Map();
    const onceEvents = new Set();

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Event handler function
     * @returns {Function} Unsubscribe function
     */
    function on(eventName, handler) {
        if (!events.has(eventName)) {
            events.set(eventName, new Set());
        }
        events.get(eventName).add(handler);

        // Return unsubscribe function
        return () => off(eventName, handler);
    }

    /**
     * Subscribe to an event for one-time execution
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Event handler function
     * @returns {Function} Unsubscribe function
     */
    function once(eventName, handler) {
        const wrappedHandler = (...args) => {
            off(eventName, wrappedHandler);
            handler(...args);
        };
        onceEvents.add(wrappedHandler);
        return on(eventName, wrappedHandler);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function} handler - Event handler function
     */
    function off(eventName, handler) {
        if (events.has(eventName)) {
            const handlers = events.get(eventName);
            handlers.delete(handler);
            if (handlers.size === 0) {
                events.delete(eventName);
            }
        }
        onceEvents.delete(handler);
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {...any} args - Arguments to pass to handlers
     */
    function emit(eventName, ...args) {
        if (events.has(eventName)) {
            events.get(eventName).forEach(handler => {
                try {
                    handler(...args);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
    }

    /**
     * Get all registered event names
     * @returns {Array} Array of event names
     */
    function getEventNames() {
        return Array.from(events.keys());
    }

    /**
     * Get number of handlers for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of handlers
     */
    function getHandlerCount(eventName) {
        return events.has(eventName) ? events.get(eventName).size : 0;
    }

    /**
     * Clear all event handlers
     */
    function clearAll() {
        events.clear();
        onceEvents.clear();
    }

    // Common application events
    const APP_EVENTS = {
        NAVIGATION: {
            PAGE_CHANGE: 'navigation:pageChange',
            BEFORE_NAVIGATE: 'navigation:beforeNavigate',
            AFTER_NAVIGATE: 'navigation:afterNavigate'
        },
        AUTH: {
            LOGIN: 'auth:login',
            LOGOUT: 'auth:logout',
            SESSION_EXPIRED: 'auth:sessionExpired',
            UNAUTHORIZED: 'auth:unauthorized'
        },
        DATA: {
            UPDATED: 'data:updated',
            LOADED: 'data:loaded',
            ERROR: 'data:error'
        },
        UI: {
            THEME_CHANGED: 'ui:themeChanged',
            MODAL_OPEN: 'ui:modalOpen',
            MODAL_CLOSE: 'ui:modalClose',
            NOTIFICATION_SHOW: 'ui:notificationShow'
        },
        SCHEDULE: {
            CONFLICT: 'schedule:conflict',
            UPDATE: 'schedule:update',
            DELETE: 'schedule:delete'
        },
        ROOM: {
            STATUS_CHANGE: 'room:statusChange',
            AVAILABILITY_UPDATE: 'room:availabilityUpdate'
        }
    };

    // Public API
    return {
        on,
        once,
        off,
        emit,
        getEventNames,
        getHandlerCount,
        clearAll,
        EVENTS: APP_EVENTS
    };
})();
