/**
 * Main JavaScript for Teacher Dashboard
 * Handles common functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the header if date display exists
    const currentDateDisplay = document.getElementById('current-date');
    if (currentDateDisplay) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Set default semester to 2nd semester (since it's May 2025)
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.value = '2nd';
        // Trigger change event to update any dependent components
        const event = new Event('change');
        semesterSelect.dispatchEvent(event);
    }
    
    // Initialize sidebar navigation
    initializeSidebar();
    
    // Initialize modals
    initializeModals();
    
    // Initialize any view toggles
    initializeViewToggles();
    
    // Handle logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Set teacher name if element exists
    const teacherNameElement = document.getElementById('teacher-name');
    if (teacherNameElement) {
        const teacherName = sessionStorage.getItem('teacherName') || 'Dr. Robert Johnson';
        teacherNameElement.textContent = teacherName;
    }
});

/**
 * Initialize sidebar navigation
 */
function initializeSidebar() {
    // Handle mobile sidebar toggle if it exists
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize all modals on the page
 */
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize view toggle buttons
 */
function initializeViewToggles() {
    const viewToggleBtns = document.querySelectorAll('.view-btn, .view-toggle button');
    
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            const toggleGroup = this.closest('.view-toggle') || this.parentElement;
            
            // Update active button
            const buttons = toggleGroup.querySelectorAll('button');
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected view if view elements exist
            const viewContainer = document.querySelector('.schedule-view, .tab-content');
            if (viewContainer && view) {
                const views = document.querySelectorAll('.schedule-view, .tab-pane');
                views.forEach(v => v.classList.remove('active'));
                const targetView = document.getElementById(`${view}-view`) || document.getElementById(`${view}-tab`);
                if (targetView) {
                    targetView.classList.add('active');
                }
            }
        });
    });
}

/**
 * Get current teacher data
 * @returns {Object} Teacher data
 */
function getCurrentTeacher() {
    // In a real app, this would come from an API or session storage
    return {
        id: 'T001',
        name: 'Dr. Robert Johnson',
        department: 'Computer Science',
        position: 'Professor'
    };
}

/**
 * Logout function
 */
function logout() {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '../index.html';
}
