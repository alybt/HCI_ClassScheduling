/**
 * Global Constants and Configuration
 * Centralized configuration for the Class Scheduling System
 */

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: '/api',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3
    },

    // Authentication
    AUTH: {
        TOKEN_KEY: 'auth_token',
        REFRESH_TOKEN_KEY: 'refresh_token',
        SESSION_TIMEOUT: 3600000 // 1 hour
    },

    // Date and Time
    DATETIME: {
        DEFAULT_DATE_FORMAT: 'MMM D, YYYY',
        DEFAULT_TIME_FORMAT: 'h:mm A',
        FIRST_DAY_OF_WEEK: 1, // Monday
        WORKING_HOURS: {
            START: 7, // 7 AM
            END: 21  // 9 PM
        }
    },

    // Scheduling
    SCHEDULE: {
        TIME_SLOT_DURATION: 30, // minutes
        MIN_CLASS_DURATION: 60,  // minutes
        MAX_CLASS_DURATION: 180, // minutes
        BREAK_DURATION: 15      // minutes
    },

    // UI Configuration
    UI: {
        THEME: {
            LIGHT: 'light',
            DARK: 'dark',
            SYSTEM: 'system'
        },
        ANIMATION_DURATION: 300,
        NOTIFICATION_DURATION: 5000,
        MAX_MOBILE_WIDTH: 768
    },

    // Academic Settings
    ACADEMIC: {
        SEMESTERS: [
            { id: 1, name: 'First Semester' },
            { id: 2, name: 'Second Semester' },
            { id: 3, name: 'Summer' }
        ],
        DAYS: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        COURSE_TYPES: [
            { id: 'lecture', name: 'Lecture' },
            { id: 'laboratory', name: 'Laboratory' },
            { id: 'both', name: 'Lecture and Laboratory' }
        ]
    },

    // Room Types
    ROOM_TYPES: {
        LECTURE: 'lecture',
        LABORATORY: 'laboratory',
        AUDITORIUM: 'auditorium',
        CONFERENCE: 'conference'
    },

    // Status Codes
    STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        CANCELLED: 'cancelled',
        COMPLETED: 'completed'
    },

    // Error Messages
    ERRORS: {
        NETWORK: 'Network error. Please check your connection.',
        AUTH: {
            INVALID_CREDENTIALS: 'Invalid username or password.',
            SESSION_EXPIRED: 'Your session has expired. Please log in again.',
            UNAUTHORIZED: 'You are not authorized to perform this action.'
        },
        SCHEDULING: {
            CONFLICT: 'There is a scheduling conflict.',
            ROOM_UNAVAILABLE: 'The selected room is not available.',
            TEACHER_UNAVAILABLE: 'The selected teacher is not available.',
            INVALID_TIME: 'The selected time is invalid.'
        }
    },

    // Storage Keys
    STORAGE: {
        THEME: 'app_theme',
        USER_PREFERENCES: 'user_preferences',
        LAST_VIEWED_PAGE: 'last_viewed_page'
    }
};
