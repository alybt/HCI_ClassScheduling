/**
 * Navigation Manager Module
 * Handles navigation state and menu functionality across the application
 */
const NavigationManager = (() => {
    let currentPage = '';
    const navLinks = {};
    const navigationListeners = [];

    /**
     * Initialize the navigation manager
     */
    function initialize() {
        // Set up navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            navLinks[page] = link;

            link.addEventListener('click', (e) => {
                handleNavigation(page, e);
            });
        });

        // Set initial active state
        updateActiveState();

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            updateActiveState();
        });
    }

    /**
     * Handle navigation to a new page
     * @param {string} page - Page identifier
     * @param {Event} event - Click event
     */
    function handleNavigation(page, event) {
        if (event) {
            event.preventDefault();
        }

        // Only navigate if it's a different page
        if (page !== currentPage) {
            const url = navLinks[page].href;
            window.history.pushState({ page }, '', url);
            updateActiveState();

            // Notify listeners
            navigationListeners.forEach(listener => {
                listener(page, currentPage);
            });

            currentPage = page;
        }
    }

    /**
     * Update the active state of navigation links
     */
    function updateActiveState() {
        const path = window.location.pathname;
        const page = Object.keys(navLinks).find(key => 
            navLinks[key].getAttribute('href').endsWith(path)
        );

        // Remove active class from all links
        Object.values(navLinks).forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        if (navLinks[page]) {
            navLinks[page].classList.add('active');
            currentPage = page;
        }
    }

    /**
     * Add a navigation change listener
     * @param {Function} listener - Callback function
     */
    function onNavigationChange(listener) {
        navigationListeners.push(listener);
    }

    /**
     * Remove a navigation change listener
     * @param {Function} listener - Callback function to remove
     */
    function removeNavigationListener(listener) {
        const index = navigationListeners.indexOf(listener);
        if (index > -1) {
            navigationListeners.splice(index, 1);
        }
    }

    /**
     * Get the current page identifier
     * @returns {string} Current page
     */
    function getCurrentPage() {
        return currentPage;
    }

    /**
     * Navigate to a specific page
     * @param {string} page - Page identifier
     */
    function navigateTo(page) {
        if (navLinks[page]) {
            handleNavigation(page);
        }
    }

    // Public API
    return {
        initialize,
        onNavigationChange,
        removeNavigationListener,
        getCurrentPage,
        navigateTo
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.initialize();
});
