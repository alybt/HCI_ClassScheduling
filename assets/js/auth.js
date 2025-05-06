/**
 * Authentication Script
 * Handles session verification and logout functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const userRole = sessionStorage.getItem('userRole');
    const username = sessionStorage.getItem('username');
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Determine which section we're in (Admin, Teacher, or Student)
    let currentSection = '';
    if (currentPath.includes('/Admin/')) {
        currentSection = 'admin';
    } else if (currentPath.includes('/Teacher/')) {
        currentSection = 'teacher';
    } else if (currentPath.includes('/Student/')) {
        currentSection = 'student';
    }
    
    // If not logged in, redirect to login page
    if (!isLoggedIn && currentPath !== '/' && !currentPath.includes('index.html')) {
        window.location.href = getBasePath() + 'index.html';
        return;
    }
    
    // If logged in but accessing wrong section, redirect to correct dashboard
    if (isLoggedIn && userRole && currentSection && userRole !== currentSection) {
        redirectToDashboard(userRole);
        return;
    }
    
    // Set up logout functionality
    setupLogout();
    
    // Update user info in the sidebar if available
    updateUserInfo();
    
    /**
     * Set up logout button functionality
     */
    function setupLogout() {
        const logoutBtn = document.querySelector('.logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear session storage
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('userRole');
                sessionStorage.removeItem('username');
                
                // Redirect to login page
                window.location.href = getBasePath() + 'index.html';
            });
        }
    }
    
    /**
     * Update user info in the sidebar
     */
    function updateUserInfo() {
        const userNameElement = document.getElementById('user-name') || document.getElementById('teacher-name');
        
        if (userNameElement && username) {
            // For demo purposes, we'll use predefined names
            // In a real app, this would be fetched from the server
            const names = {
                'admin': 'Admin User',
                'T001': 'Dr. Robert Johnson',
                '2023-0001': 'John Smith'
            };
            
            if (names[username]) {
                userNameElement.textContent = names[username];
            }
        }
    }
    
    /**
     * Redirect to the appropriate dashboard based on role
     */
    function redirectToDashboard(role) {
        const basePath = getBasePath();
        
        switch (role) {
            case 'admin':
                window.location.href = basePath + 'Admin/index.html';
                break;
            case 'teacher':
                window.location.href = basePath + 'Teacher/index.html';
                break;
            case 'student':
                window.location.href = basePath + 'Student/index.html';
                break;
            default:
                window.location.href = basePath + 'index.html';
        }
    }
    
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
