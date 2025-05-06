document.addEventListener('DOMContentLoaded', function() {
    // Toggle view buttons (Daily, Weekly, Monthly)
    const viewButtons = document.querySelectorAll('.toggle-btn');
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Here you would update the view based on the selected option
                updateView(this.getAttribute('data-view') || this.textContent.toLowerCase());
            });
        });
    }
    
    // Semester select change handler
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function() {
            // Here you would update the data based on the selected semester
            updateSemesterData(this.value);
        });
    }
    
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
    // Sidebar navigation handler
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // We don't prevent default here because we want the link to navigate
            // But we can add additional functionality if needed
            const page = this.getAttribute('data-page');
            console.log(`Navigating to: ${page}`);
        });
    });
    
    // Set active page in sidebar based on current URL
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    const currentNavLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);
    if (currentNavLink) {
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to current page link
        currentNavLink.classList.add('active');
    }
    
    // Logout button handler
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                console.log('Logging out...');
                // Here you would implement the actual logout functionality
                // window.location.href = 'login.html';
            }
        });
    }
    
    // Utility functions
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
    
    function performSearch(query) {
        if (!query.trim()) return;
        
        console.log(`Searching for: ${query}`);
        // Implementation would perform search and display results
        
        // Example: Show search results
        alert(`Search results for: ${query}\nThis is a placeholder for the actual search functionality.`);
    }
    
    // Function to add a new class card dynamically
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
    
    // Function to add a notification card dynamically
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
    
    // Function to add an event card dynamically
    function addEventCard(title, date, time, location, details = '') {
        const eventSection = document.querySelector('.events-section .event-cards');
        if (!eventSection) return;
        
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        eventCard.innerHTML = `
            <h3>${title}</h3>
            <p><i class="fas fa-calendar-alt"></i> ${date}</p>
            <p><i class="fas fa-clock"></i> ${time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${location}</p>
            ${details ? `<p>${details}</p>` : ''}
        `;
        
        eventSection.appendChild(eventCard);
        return eventCard;
    }
    
    // Initialize page-specific elements
    initializePage();
    
    // Function to initialize page-specific elements
    function initializePage() {
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
});
