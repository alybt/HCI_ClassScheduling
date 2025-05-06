document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Log filtering functionality
    const logTypeFilter = document.getElementById('log-type-filter');
    const logDateFilter = document.getElementById('log-date-filter');
    
    if (logTypeFilter && logDateFilter) {
        logTypeFilter.addEventListener('change', filterLogs);
        logDateFilter.addEventListener('change', filterLogs);
    }

    function filterLogs() {
        const typeFilter = logTypeFilter.value;
        const dateFilter = logDateFilter.value;
        const logItems = document.querySelectorAll('.log-item');

        logItems.forEach(item => {
            let showByType = typeFilter === 'all' || item.classList.contains(typeFilter);
            // Date filtering logic would be implemented here with actual date comparison
            // For demo purposes, we're just showing all items
            let showByDate = true;

            if (showByType && showByDate) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Status filtering functionality
    const statusFilter = document.getElementById('status-filter');
    const courseFilter = document.getElementById('course-filter');
    
    if (statusFilter && courseFilter) {
        statusFilter.addEventListener('change', filterStatus);
        courseFilter.addEventListener('change', filterStatus);
    }

    function filterStatus() {
        const statusValue = statusFilter.value;
        const courseValue = courseFilter.value;
        const statusItems = document.querySelectorAll('.status-item');

        statusItems.forEach(item => {
            const statusBadge = item.querySelector('.status-badge');
            const courseCell = item.querySelector('td:first-child');

            let showByStatus = statusValue === 'all' || (statusBadge && statusBadge.classList.contains(statusValue));
            let showByCourse = courseValue === 'all' || (courseCell && courseCell.textContent.toLowerCase().includes(courseValue.toLowerCase()));

            if (showByStatus && showByCourse) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Create Notification Modal
    const createNotificationBtn = document.getElementById('create-notification-btn');
    const createNotificationModal = document.getElementById('create-notification-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelNotificationBtn = document.getElementById('cancel-notification');
    const sendNotificationBtn = document.getElementById('send-notification');
    const notificationSchedule = document.getElementById('notification-schedule');
    const scheduleDatetimeGroup = document.getElementById('schedule-datetime-group');

    if (createNotificationBtn && createNotificationModal) {
        createNotificationBtn.addEventListener('click', function() {
            createNotificationModal.style.display = 'flex';
        });
    }

    if (closeModalButtons) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    if (cancelNotificationBtn) {
        cancelNotificationBtn.addEventListener('click', function() {
            createNotificationModal.style.display = 'none';
        });
    }

    if (sendNotificationBtn) {
        sendNotificationBtn.addEventListener('click', function() {
            // Get form values
            const title = document.getElementById('notification-title').value;
            const message = document.getElementById('notification-message').value;
            const type = document.getElementById('notification-type').value;
            
            // Validate form
            if (!title || !message) {
                alert('Please fill in all required fields');
                return;
            }

            // Here you would typically send the data to the server
            console.log('Sending notification:', { title, message, type });
            
            // For demo purposes, add the notification to the list
            addNotificationToList(title, message, type);
            
            // Close the modal
            createNotificationModal.style.display = 'none';
            
            // Reset the form
            document.getElementById('notification-form').reset();
        });
    }

    if (notificationSchedule) {
        notificationSchedule.addEventListener('change', function() {
            if (this.value === 'later' && scheduleDatetimeGroup) {
                scheduleDatetimeGroup.style.display = 'block';
            } else if (scheduleDatetimeGroup) {
                scheduleDatetimeGroup.style.display = 'none';
            }
        });
    }

    // Function to add a new notification to the list
    function addNotificationToList(title, message, type) {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        const now = new Date();
        const formattedDate = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        notificationItem.innerHTML = `
            <div class="notification-header">
                <h3>${title}</h3>
                <div class="notification-badges">
                    <span class="badge ${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span class="badge">All Users</span>
                </div>
            </div>
            <p>${message}</p>
            <div class="notification-footer">
                <span class="notification-time">Sent: ${formattedDate}</span>
                <div class="notification-actions">
                    <button class="btn-edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        // Add event listeners to the new buttons
        const editBtn = notificationItem.querySelector('.btn-edit');
        const deleteBtn = notificationItem.querySelector('.btn-delete');

        if (editBtn) {
            editBtn.addEventListener('click', function() {
                // Edit functionality would be implemented here
                console.log('Edit notification:', title);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                // Delete the notification item
                notificationItem.remove();
            });
        }

        // Add the new notification to the top of the list
        notificationList.insertBefore(notificationItem, notificationList.firstChild);
    }

    // Log Details Modal
    const logDetailsButtons = document.querySelectorAll('.btn-details');
    const logDetailsModal = document.getElementById('log-details-modal');
    const closeLogDetailsBtn = document.getElementById('close-log-details');

    if (logDetailsButtons && logDetailsModal) {
        logDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get log data from the row
                const row = this.closest('tr');
                const time = row.querySelector('td:nth-child(1)').textContent;
                const type = row.querySelector('td:nth-child(2)').innerHTML;
                const user = row.querySelector('td:nth-child(3)').textContent;
                const message = row.querySelector('td:nth-child(4)').textContent;

                // Update the modal with the log data
                document.getElementById('log-time').textContent = time;
                document.getElementById('log-type').innerHTML = type;
                document.getElementById('log-user').textContent = user;
                document.getElementById('log-message').textContent = message;

                // Show the modal
                logDetailsModal.style.display = 'flex';
            });
        });
    }

    if (closeLogDetailsBtn) {
        closeLogDetailsBtn.addEventListener('click', function() {
            logDetailsModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Export buttons functionality
    const exportButtons = document.querySelectorAll('.btn-export');
    
    if (exportButtons) {
        exportButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabPane = this.closest('.tab-pane');
                const tabId = tabPane.id;
                
                // For demo purposes, just log the export action
                console.log(`Exporting data from ${tabId} tab`);
                alert(`Data from ${tabId} has been exported successfully.`);
            });
        });
    }

    // Pagination functionality
    const prevButtons = document.querySelectorAll('.btn-prev');
    const nextButtons = document.querySelectorAll('.btn-next');
    
    if (prevButtons && nextButtons) {
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                // For demo purposes, just log the action
                console.log('Previous page');
            });
        });
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                // For demo purposes, just log the action
                console.log('Next page');
            });
        });
    }

    // Action buttons in the scheduling status tab
    const actionButtons = document.querySelectorAll('.btn-resolve, .btn-reschedule, .btn-view, .btn-approve, .btn-edit, .btn-assign, .btn-assign-teacher');
    
    if (actionButtons) {
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.className.split(' ')[0].replace('btn-', '');
                const row = this.closest('tr');
                const course = row.querySelector('td:first-child').textContent;
                
                // For demo purposes, just log the action
                console.log(`${action} action for ${course}`);
                
                if (action === 'approve' || action === 'resolve') {
                    // Update the status badge to "Scheduled"
                    const statusBadge = row.querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.className = 'status-badge scheduled';
                        statusBadge.textContent = 'Scheduled';
                    }
                }
            });
        });
    }
});
