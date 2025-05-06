document.addEventListener('DOMContentLoaded', function() {
    // Toggle view buttons (Daily, Weekly, Monthly)
    const viewButtons = document.querySelectorAll('.view-toggle button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would update the view based on the selected option
            updateView(this.textContent.toLowerCase());
        });
    });
    
    // Semester select change handler
    const semesterSelect = document.getElementById('semester-select');
    semesterSelect.addEventListener('change', function() {
        // Here you would update the data based on the selected semester
        updateSemesterData(this.value);
    });
    
    // Class checkbox handler
    const classCheckboxes = document.querySelectorAll('.class-check input[type="checkbox"]');
    classCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Here you would update the class status (attended/missed)
            updateClassStatus(this.id, this.checked);
        });
    });
    
    // Quick action buttons handler
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Handle different quick actions based on index
            if (index === 0) {
                // First button - clipboard/notes
                showNotes();
            } else if (index === 1) {
                // Second button - add to calendar
                addToCalendar();
            }
        });
    });
    
    // Sidebar navigation handler
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would navigate to different sections/pages
            navigateTo(index);
        });
    });
    
    // Mock functions for demonstration
    function updateView(viewType) {
        console.log(`View changed to: ${viewType}`);
        // Implementation would update the UI based on the selected view
    }
    
    function updateSemesterData(semester) {
        console.log(`Semester changed to: ${semester}`);
        // Implementation would fetch and display data for the selected semester
    }
    
    function updateClassStatus(classId, isAttended) {
        console.log(`Class ${classId} status updated: ${isAttended ? 'Attended' : 'Missed'}`);
        // Implementation would update the class status in the database/storage
    }
    
    function showNotes() {
        console.log('Opening notes/clipboard');
        // Implementation would show a notes modal or navigate to notes page
    }
    
    function addToCalendar() {
        console.log('Opening calendar add event');
        // Implementation would show a calendar event creation modal
    }
    
    function navigateTo(index) {
        const pages = ['Dashboard', 'Calendar', 'Reports', 'Courses', 'Profile', 'Settings'];
        console.log(`Navigating to: ${pages[index]}`);
        // Implementation would navigate to the selected page
    }
    
    // Sample function to add a new class dynamically
    function addNewClass(id, name, time) {
        const classCards = document.querySelector('.class-cards');
        
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        
        classCard.innerHTML = `
            <div class="class-check">
                <input type="checkbox" id="${id}">
                <label for="${id}"></label>
            </div>
            <div class="class-info">
                <h3>${name}</h3>
                <p>TIME: ${time}</p>
            </div>
        `;
        
        classCards.appendChild(classCard);
        
        // Add event listener to the new checkbox
        const newCheckbox = classCard.querySelector(`#${id}`);
        newCheckbox.addEventListener('change', function() {
            updateClassStatus(this.id, this.checked);
        });
    }
    
    // Sample function to add a notification
    function addNotification(message) {
        const notificationCard = document.querySelector('.notification-card');
        
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        notification.innerHTML = `<p>${message}</p>`;
        
        notificationCard.appendChild(notification);
    }
    
    // Sample function to add an event
    function addEvent(title, details) {
        const eventCards = document.querySelector('.event-cards');
        
        // Clear 'NO EVENT' message if it exists
        if (eventCards.querySelector('p strong')?.textContent === 'NOTE:') {
            eventCards.innerHTML = '';
        }
        
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <h3>${title}</h3>
            <p>${details}</p>
        `;
        
        eventCards.appendChild(eventCard);
    }
    
    // You can uncomment these lines to test the dynamic functions
    // addNewClass('class2', 'MATH 101', '1:00 - 3:00');
    // addNotification('Don\'t forget to submit your assignment by Friday!');
    // addEvent('Midterm Exam', 'CS 106 midterm exam on Thursday at 2:00 PM in Room 302');
});
