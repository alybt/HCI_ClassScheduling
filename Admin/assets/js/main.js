/**
 * Admin Dashboard JavaScript
 * Handles common functionality across all admin pages
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
    
    // Initialize view toggles
    initializeViewToggles();
    
    // Notification bell handler
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // Search functionality
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const searchInput = searchContainer.querySelector('input');
        const searchButton = searchContainer.querySelector('button');
        
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Handle logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Set admin name if element exists
    const adminNameElement = document.getElementById('admin-name');
    if (adminNameElement) {
        const adminName = sessionStorage.getItem('adminName') || 'Admin User';
        adminNameElement.textContent = adminName;
    }
    
    // Initialize page-specific elements
    if (typeof initializePage === 'function') {
        initializePage();
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
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
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
    const viewToggleBtns = document.querySelectorAll('.toggle-btn, .view-btn, .view-toggle button');
    
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view') || this.textContent.toLowerCase();
            const toggleGroup = this.closest('.view-toggle') || this.parentElement;
            
            // Update active button
            const buttons = toggleGroup.querySelectorAll('button');
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected view if view elements exist
            updateView(view);
        });
    });
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

/**
 * Update view based on selected view type
 * @param {string} viewType - The type of view to show
 */
function updateView(viewType) {
    console.log(`View changed to: ${viewType}`);
    // Implementation would update the UI based on the selected view
    
    // Example: Update content based on view type
    const contentSections = document.querySelectorAll('.view-content');
    if (contentSections.length > 0) {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        
        const activeContent = document.getElementById(`${viewType}-view`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    }
}

/**
 * Update data based on selected semester
 * @param {string} semester - The selected semester
 */
function updateSemesterData(semester) {
    console.log(`Semester changed to: ${semester}`);
    // Implementation would fetch and display data for the selected semester
    
    // Example: Fetch data from server for the selected semester
    fetch(`/api/data?semester=${semester}`)
        .then(response => {
            // This is just a mock, it won't actually run
            console.log('Data fetched for semester:', semester);
        })
        .catch(error => {
            console.error('Error fetching semester data:', error);
        });
}

/**
 * Show notifications dropdown or navigate to notifications page
 */
function showNotifications() {
    console.log('Showing notifications');
    // Implementation would show a notifications dropdown or navigate to notifications page
    
    // Example: Toggle a notifications dropdown
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    if (notificationsDropdown) {
        notificationsDropdown.style.display = notificationsDropdown.style.display === 'block' ? 'none' : 'block';
    } else {
        // If no dropdown exists, navigate to notifications page
        window.location.href = 'monitoring.html';
    }
}

/**
 * Perform search with the given query
 * @param {string} query - The search query
 */
function performSearch(query) {
    if (!query.trim()) return;
    
    console.log(`Searching for: ${query}`);
    // Implementation would perform search and display results
    
    // Example: Show search results
    alert(`Search results for: ${query}\nThis is a placeholder for the actual search functionality.`);
}

/**
 * Add a new class card dynamically
 * @param {string} id - The class ID
 * @param {string} title - The class title
 * @param {string} teacher - The teacher name
 * @param {string} time - The class time
 * @param {string} room - The class room
 * @param {string} status - The class status
 * @returns {HTMLElement} - The created class card
 */
function addClassCard(id, title, teacher, time, room, status = 'scheduled') {
    const classCards = document.querySelector('.class-cards');
    if (!classCards) return;
    
    const classCard = document.createElement('div');
    classCard.className = 'class-card';
    
    const statusClass = status.toLowerCase().replace(' ', '-');
    
    classCard.innerHTML = `
        <div class="class-icon">
            <i class="fas fa-book"></i>
        </div>
        <div class="class-info">
            <h3>${title}</h3>
            <p><i class="fas fa-user"></i> ${teacher}</p>
            <p><i class="fas fa-clock"></i> ${time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${room}</p>
            <span class="status-badge ${statusClass}">${status}</span>
        </div>
    `;
    
    classCards.appendChild(classCard);
    return classCard;
}

/**
 * Add a notification card dynamically
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type
 * @param {string} time - The notification time
 * @returns {HTMLElement} - The created notification card
 */
function addNotificationCard(title, message, type = 'info', time = 'Just now') {
    const notificationSection = document.querySelector('.notification-section .notification-cards');
    if (!notificationSection) return;
    
    const notificationCard = document.createElement('div');
    notificationCard.className = `notification-card ${type}`;
    
    let iconClass = 'info-circle';
    if (type === 'alert') iconClass = 'exclamation-circle';
    if (type === 'reminder') iconClass = 'bell';
    
    notificationCard.innerHTML = `
        <div class="notification-icon ${type}">
            <i class="fas fa-${iconClass}"></i>
        </div>
        <div class="notification-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <span class="notification-time">${time}</span>
        </div>
    `;
    
    notificationSection.appendChild(notificationCard);
    return notificationCard;
}

/**
 * Add an event card dynamically
 * @param {string} title - The event title
 * @param {string} date - The event date
 * @param {string} time - The event time
 * @param {string} location - The event location
 * @param {string} details - The event details
 * @returns {HTMLElement} - The created event card
 */
function addEventCard(title, date, time, location, details = '') {
    const eventSection = document.querySelector('.events-section .event-cards');
    if (!eventSection) return;
    
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    
    eventCard.innerHTML = `
        <div class="event-date">
            <span class="month">${date.split(' ')[0]}</span>
            <span class="day">${date.split(' ')[1]}</span>
        </div>
        <div class="event-details">
            <h3>${title}</h3>
            <p><i class="fas fa-clock"></i> ${time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${location}</p>
            ${details ? `<p class="details">${details}</p>` : ''}
        </div>
    `;
    
    eventSection.appendChild(eventCard);
    return eventCard;
}

/**
 * Initialize page-specific elements
 */
function initializePage() {
    console.log('Initializing page-specific elements');
    // This function would be overridden by page-specific scripts
    
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
        
    // Dashboard page initialization
    if (currentPage === 'index') {
        // Example data for dashboard
        addNotificationCard('Class Rescheduled', 'CS 201 has been moved to Room LR 2', 'info', '10 minutes ago');
        addNotificationCard('Conflict Detected', 'CC 100 and CS 201 scheduled in LR 2 at the same time', 'alert', '30 minutes ago');
        addClassCard('cs201', 'CS 201 Data Structures', 'Prof. Jane Smith', 'MWF 10:00 AM - 1:00 PM', 'LR 1', 'Scheduled');
        addClassCard('cc100', 'CC 100 Introduction to Computing', 'Prof. John Doe', 'TTh 3:00 PM - 5:00 PM', 'LR 2', 'Conflict');
        addEventCard('Programming Competition', 'May 15, 2025', '9:00 AM - 5:00 PM', 'Auditorium', 'Annual programming competition for CS students');
    }
}
