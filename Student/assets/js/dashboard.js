document.addEventListener('DOMContentLoaded', function() {
    // Initialize semester selector
    const semesterSelect = document.getElementById('semester-select');
    semesterSelect.addEventListener('change', function() {
        updateSemesterData(this.value);
    });

    // Navigation menu functionality
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle click if it's not the active link
            if (!this.classList.contains('active')) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
            }
        });
    });

    // View All Upcoming Classes
    const viewAllButton = document.querySelector('.view-all');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function() {
            window.location.href = 'schedule.html';
        });
    }

    // Notification click handler
    const notificationCards = document.querySelectorAll('.notification-card');
    notificationCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const message = this.querySelector('p').textContent;
            showNotificationDetails(title, message);
        });
    });

    // Class card click handler
    const classCards = document.querySelectorAll('.class-card');
    classCards.forEach(card => {
        card.addEventListener('click', function() {
            const className = this.querySelector('h3').textContent;
            const classDetails = Array.from(this.querySelectorAll('p')).map(p => p.textContent);
            showClassDetails(className, classDetails);
        });
    });

    // Function to update data based on selected semester
    function updateSemesterData(semester) {
        console.log(`Updating data for semester: ${semester}`);
        // This would typically involve an API call to fetch data for the selected semester
        
        // For demonstration, we'll just log the change
        if (semester === '1st') {
            console.log('Loading 1st Semester data (August to December)');
            // Update notification and class cards with 1st semester data
        } else {
            console.log('Loading 2nd Semester data (January to May)');
            // Update notification and class cards with 2nd semester data
        }
    }

    // Function to show notification details (could be a modal)
    function showNotificationDetails(title, message) {
        console.log(`Notification: ${title}`);
        console.log(`Message: ${message}`);
        // In a real implementation, this would show a modal with the notification details
        alert(`${title}\n\n${message}`);
    }

    // Function to show class details (could be a modal)
    function showClassDetails(className, details) {
        console.log(`Class: ${className}`);
        console.log(`Details: ${details.join(', ')}`);
        // In a real implementation, this would show a modal with the class details
        alert(`${className}\n\n${details.join('\n')}`);
    }

    // Function to add a new notification dynamically
    function addNotification(type, title, message, time) {
        const notificationCards = document.querySelector('.notification-cards');
        
        const card = document.createElement('div');
        card.className = `notification-card ${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'alert') iconClass = 'fa-exclamation-circle';
        if (type === 'reminder') iconClass = 'fa-clock';
        
        card.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="notification-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <span class="notification-time">${time}</span>
            </div>
        `;
        
        card.addEventListener('click', function() {
            showNotificationDetails(title, message);
        });
        
        notificationCards.prepend(card);
        
        // Update notification badge
        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent = parseInt(badge.textContent) + 1;
        }
    }

    // Function to add a new class dynamically
    function addClass(code, title, room, time, icon = 'fa-laptop-code') {
        const classCards = document.querySelector('.class-cards');
        
        const card = document.createElement('div');
        card.className = 'class-card';
        
        card.innerHTML = `
            <div class="class-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="class-info">
                <h3>${code}</h3>
                <p>${title}</p>
                <p>ROOM: ${room}</p>
                <p>TIME: ${time}</p>
            </div>
        `;
        
        card.addEventListener('click', function() {
            const className = card.querySelector('h3').textContent;
            const classDetails = Array.from(card.querySelectorAll('p')).map(p => p.textContent);
            showClassDetails(className, classDetails);
        });
        
        classCards.appendChild(card);
    }

    // Example of adding a notification (this would typically be triggered by an API response)
    // Uncomment to test
    /*
    setTimeout(() => {
        addNotification(
            'reminder', 
            'Assignment Due', 
            'CC 101 Programming Assignment is due tomorrow', 
            'Just now'
        );
    }, 5000);
    */
});
