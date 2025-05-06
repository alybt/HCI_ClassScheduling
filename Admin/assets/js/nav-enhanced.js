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
    
    // Mobile sidebar toggle
    const toggleSidebar = document.createElement('button');
    toggleSidebar.classList.add('sidebar-toggle');
    toggleSidebar.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header').prepend(toggleSidebar);
    
    toggleSidebar.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('expanded');
        
        // Update toggle icon
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('expanded')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Add breadcrumbs based on current page
    createBreadcrumbs();
    
    // Track user navigation patterns for analytics
    trackNavigation();
});

/**
 * Creates breadcrumb navigation based on current page
 */
function createBreadcrumbs() {
    const currentPage = window.location.pathname.split('/').pop();
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    // Create breadcrumbs container
    const breadcrumbs = document.createElement('div');
    breadcrumbs.classList.add('breadcrumbs');
    
    // Add home/dashboard link
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.textContent = 'Dashboard';
    breadcrumbs.appendChild(homeLink);
    
    // Add separator
    const separator = document.createElement('span');
    separator.classList.add('breadcrumb-separator');
    separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
    breadcrumbs.appendChild(separator);
    
    // Add current page
    const currentPageName = getCurrentPageName(currentPage);
    const currentPageSpan = document.createElement('span');
    currentPageSpan.classList.add('current-page');
    currentPageSpan.textContent = currentPageName;
    breadcrumbs.appendChild(currentPageSpan);
    
    // Insert breadcrumbs after header title
    const headerTitle = header.querySelector('h1');
    if (headerTitle) {
        headerTitle.after(breadcrumbs);
    }
}

/**
 * Gets a user-friendly name for the current page
 */
function getCurrentPageName(page) {
    const pageMap = {
        'index.html': 'Dashboard',
        'students.html': 'Student Database',
        'teachers.html': 'Teacher Database',
        'courses.html': 'Course Management',
        'rooms.html': 'Room Management',
        'reservations.html': 'Reservations',
        'monitoring.html': 'Monitoring',
        'reports.html': 'Reports',
        'settings.html': 'Settings'
    };
    
    return pageMap[page] || 'Current Page';
}

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

/**
 * Adds a visual tooltip guide for new users
 * This would be shown only for first-time users in a real app
 */
function showNavigationGuide() {
    // Check if user has seen the guide before
    const hasSeenGuide = localStorage.getItem('hasSeenNavGuide');
    
    if (!hasSeenGuide) {
        // Create guide overlay
        const guide = document.createElement('div');
        guide.classList.add('nav-guide-overlay');
        guide.innerHTML = `
            <div class="guide-content">
                <h3>Welcome to the Admin Panel</h3>
                <p>Here's a quick guide to help you navigate:</p>
                <ul>
                    <li>Use the sidebar to access different sections</li>
                    <li>The notification bell shows important alerts</li>
                    <li>Your profile and logout button are at the bottom</li>
                </ul>
                <button class="btn-primary guide-close">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(guide);
        
        // Close guide and save preference
        guide.querySelector('.guide-close').addEventListener('click', function() {
            guide.style.opacity = '0';
            setTimeout(() => {
                guide.remove();
            }, 300);
            
            // Save that user has seen the guide
            localStorage.setItem('hasSeenNavGuide', 'true');
        });
    }
}

// Call the guide function with a slight delay
setTimeout(showNavigationGuide, 1000);
