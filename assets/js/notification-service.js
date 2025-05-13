/**
 * Notification Service
 * Handles notifications between Admin, Teacher, and Student interfaces
 */

class NotificationService {
    constructor() {
        // Ensure SharedDataService is available
        if (typeof sharedDataService === 'undefined') {
            console.error('SharedDataService not found. Make sure to include shared-data-service.js first.');
            return;
        }
        
        this.dataService = sharedDataService;
        this.currentUserId = sessionStorage.getItem('userId') || sessionStorage.getItem('username');
        this.currentUserRole = sessionStorage.getItem('userRole');
        
        // Initialize notification UI if available
        this.initNotificationUI();
    }
    
    /**
     * Initialize notification UI elements
     */
    initNotificationUI() {
        // Find notification bell and badge
        this.notificationBell = document.querySelector('.notification-bell');
        this.notificationBadge = this.notificationBell ? this.notificationBell.querySelector('.badge') : null;
        
        // Create notification panel if not exists
        if (this.notificationBell && !document.getElementById('notification-panel')) {
            this.createNotificationPanel();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update notification count
        this.updateNotificationCount();
    }
    
    /**
     * Create notification panel
     */
    createNotificationPanel() {
        const panel = document.createElement('div');
        panel.id = 'notification-panel';
        panel.className = 'notification-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="close-panel"><i class="fas fa-times"></i></button>
            </div>
            <div class="notification-list">
                <!-- Notifications will be dynamically added here -->
            </div>
            <div class="notification-footer">
                <button class="mark-all-read">Mark All as Read</button>
            </div>
        `;
        
        // Append panel to body
        document.body.appendChild(panel);
        
        // Store reference
        this.notificationPanel = panel;
        this.notificationList = panel.querySelector('.notification-list');
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (this.notificationBell) {
            this.notificationBell.addEventListener('click', () => {
                this.toggleNotificationPanel();
            });
        }
        
        if (this.notificationPanel) {
            // Close panel button
            const closeBtn = this.notificationPanel.querySelector('.close-panel');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideNotificationPanel();
                });
            }
            
            // Mark all as read button
            const markAllBtn = this.notificationPanel.querySelector('.mark-all-read');
            if (markAllBtn) {
                markAllBtn.addEventListener('click', () => {
                    this.markAllAsRead();
                });
            }
            
            // Click on notification
            this.notificationList.addEventListener('click', (e) => {
                const notificationItem = e.target.closest('.notification-item');
                if (notificationItem) {
                    const notificationId = notificationItem.dataset.id;
                    this.markAsRead(notificationId);
                }
            });
        }
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.notificationPanel && 
                this.notificationPanel.style.display === 'block' && 
                !this.notificationPanel.contains(e.target) && 
                !this.notificationBell.contains(e.target)) {
                this.hideNotificationPanel();
            }
        });
    }
    
    /**
     * Toggle notification panel visibility
     */
    toggleNotificationPanel() {
        if (!this.notificationPanel) return;
        
        if (this.notificationPanel.style.display === 'block') {
            this.hideNotificationPanel();
        } else {
            this.showNotificationPanel();
        }
    }
    
    /**
     * Show notification panel
     */
    showNotificationPanel() {
        if (!this.notificationPanel) return;
        
        // Update notifications
        this.loadNotifications();
        
        // Show panel
        this.notificationPanel.style.display = 'block';
    }
    
    /**
     * Hide notification panel
     */
    hideNotificationPanel() {
        if (!this.notificationPanel) return;
        
        this.notificationPanel.style.display = 'none';
    }
    
    /**
     * Load notifications for current user
     */
    loadNotifications() {
        if (!this.notificationList || !this.currentUserId) return;
        
        // Clear existing notifications
        this.notificationList.innerHTML = '';
        
        // Get user notifications
        const notifications = this.dataService.getUserNotifications(this.currentUserId);
        
        // Display notifications
        if (notifications.length === 0) {
            this.notificationList.innerHTML = '<div class="no-notifications">No notifications found.</div>';
            return;
        }
        
        // Sort notifications by timestamp (newest first)
        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Add each notification to the list
        notifications.forEach(notification => {
            const notificationItem = this.createNotificationItem(notification);
            this.notificationList.appendChild(notificationItem);
        });
    }
    
    /**
     * Create a notification item element
     * @param {Object} notification - The notification data
     * @returns {HTMLElement} The notification item element
     */
    createNotificationItem(notification) {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`;
        item.dataset.id = notification.id;
        
        // Get icon based on notification type
        let icon = 'fas fa-bell';
        switch (notification.type) {
            case 'alert':
                icon = 'fas fa-exclamation-circle';
                break;
            case 'info':
                icon = 'fas fa-info-circle';
                break;
            case 'reminder':
                icon = 'fas fa-clock';
                break;
            case 'reservation':
                icon = 'fas fa-calendar-check';
                break;
            case 'conflict':
                icon = 'fas fa-exclamation-triangle';
                break;
        }
        
        item.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${this.formatTimeAgo(notification.timestamp)}</span>
            </div>
            ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
        `;
        
        return item;
    }
    
    /**
     * Update notification count badge
     */
    updateNotificationCount() {
        if (!this.notificationBadge || !this.currentUserId) return;
        
        // Get unread notifications count
        const notifications = this.dataService.getUserNotifications(this.currentUserId);
        const unreadCount = notifications.filter(notif => !notif.read).length;
        
        // Update badge
        this.notificationBadge.textContent = unreadCount;
        this.notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    /**
     * Mark a notification as read
     * @param {string} notificationId - The notification ID
     */
    markAsRead(notificationId) {
        const success = this.dataService.markNotificationAsRead(notificationId);
        
        if (success) {
            // Update UI
            const notificationItem = this.notificationList.querySelector(`[data-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.classList.remove('unread');
                notificationItem.classList.add('read');
                
                const unreadIndicator = notificationItem.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.remove();
                }
            }
            
            // Update notification count
            this.updateNotificationCount();
        }
    }
    
    /**
     * Mark all notifications as read
     */
    markAllAsRead() {
        if (!this.currentUserId) return;
        
        // Get user notifications
        const notifications = this.dataService.getUserNotifications(this.currentUserId);
        
        // Mark each as read
        notifications.forEach(notification => {
            if (!notification.read) {
                this.dataService.markNotificationAsRead(notification.id);
            }
        });
        
        // Update UI
        const unreadItems = this.notificationList.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
            item.classList.add('read');
            
            const unreadIndicator = item.querySelector('.unread-indicator');
            if (unreadIndicator) {
                unreadIndicator.remove();
            }
        });
        
        // Update notification count
        this.updateNotificationCount();
    }
    
    /**
     * Send a notification to specific users
     * @param {Object} notification - The notification data
     * @param {Array} recipients - Array of user IDs to receive the notification
     * @returns {string} The new notification ID
     */
    sendNotification(notification, recipients) {
        // Create notification object
        const notificationData = {
            ...notification,
            recipients: recipients
        };
        
        // Add notification
        return this.dataService.addNotification(notificationData);
    }
    
    /**
     * Send a notification to all users of a specific role
     * @param {Object} notification - The notification data
     * @param {string} role - The role to send to (admin, teacher, student)
     * @returns {string} The new notification ID
     */
    sendNotificationToRole(notification, role) {
        // In a real app, we would get all users with the specified role
        // For demo purposes, we'll use predefined IDs
        let recipients = [];
        
        switch (role) {
            case 'admin':
                recipients = ['admin'];
                break;
            case 'teacher':
                recipients = ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'];
                break;
            case 'student':
                recipients = ['2023-0001', '2023-0002', '2023-0003'];
                break;
            case 'all':
                recipients = ['admin', 'T001', 'T002', 'T003', 'T004', 'T005', 'T006', '2023-0001', '2023-0002', '2023-0003'];
                break;
        }
        
        // Create notification object
        const notificationData = {
            ...notification,
            recipients: recipients
        };
        
        // Add notification
        return this.dataService.addNotification(notificationData);
    }
    
    /**
     * Format timestamp to time ago string
     * @param {string} timestamp - ISO timestamp
     * @returns {string} Time ago string
     */
    formatTimeAgo(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
            return 'just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffDay < 7) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else {
            // Format date
            const options = { month: 'short', day: 'numeric' };
            if (date.getFullYear() !== now.getFullYear()) {
                options.year = 'numeric';
            }
            return date.toLocaleDateString('en-US', options);
        }
    }
}

// Create a singleton instance
const notificationService = new NotificationService();
