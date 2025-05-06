/**
 * Logout Script
 * Handles logout functionality for all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    
    // Add click event to all logout buttons
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to log out?')) {
                // Clear session storage
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('username');
                
                // Redirect to login page
                window.location.href = getBasePath() + 'index.html';
            }
        });
    });
    
    /**
     * Get the base path of the application
     */
    function getBasePath() {
        const pathParts = window.location.pathname.split('/');
        let basePath = '/';
        
        // Find the index of the project folder
        const projectIndex = pathParts.findIndex(part => part === 'Class Scheduling');
        
        if (projectIndex !== -1) {
            basePath = pathParts.slice(0, projectIndex + 1).join('/') + '/';
        }
        
        return basePath;
    }
});
