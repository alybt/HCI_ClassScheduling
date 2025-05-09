/**
 * Enhanced Navigation Script for Admin Panel
 * Adds interactive features and improved user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL to highlight active nav item
    const currentPage = window.location.pathname.split('/').pop();
    
    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add indicators to each nav link
    navLinks.forEach(link => {
        // Create indicator element
        const indicator = document.createElement('span');
        indicator.classList.add('nav-indicator');
        link.appendChild(indicator);
        
        // Check if this link corresponds to current page
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
        
        // Add hover animation effect
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
    
    // Add notification badge update functionality
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Show notifications dropdown (would be implemented in a real system)
            console.log('Notification bell clicked');
            
            // Reset badge count after viewing
            const badge = this.querySelector('.badge');
            if (badge) {
                // Store original count for animation
                const originalCount = parseInt(badge.textContent);
                
                // Animate the badge
                badge.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    badge.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        badge.style.transform = 'scale(1)';
                        badge.textContent = '0';
                    }, 150);
                }, 150);
            }
        });
    }
    
    // Add logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // In a real app, this would call a logout API
                console.log('Logging out...');
                
                // Redirect to login page
                window.location.href = '../index.html';
            }
        });
    }
    
    // Track user navigation patterns for analytics
    trackNavigation();
});



/**
 * Tracks user navigation patterns for analytics
 * In a real app, this would send data to a backend
 */
function trackNavigation() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // In a real app, this would be sent to a backend analytics service
    console.log('Page visited:', currentPage);
    
    // Track time spent on page
    const visitStartTime = new Date();
    
    // When user leaves page, calculate time spent
    window.addEventListener('beforeunload', function() {
        const timeSpent = (new Date() - visitStartTime) / 1000; // in seconds
        console.log('Time spent on page:', timeSpent.toFixed(2), 'seconds');
    });
}
