/**
 * Profile Settings JavaScript
 * Handles tab switching, form submissions, and profile image uploads
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Profile image upload functionality
    const profileAvatar = document.querySelector('.profile-avatar');
    const avatarUpload = document.getElementById('avatar-upload');
    const profileAvatarImg = document.getElementById('profile-avatar-img');
    
    if (profileAvatar && avatarUpload) {
        profileAvatar.addEventListener('click', function() {
            avatarUpload.click();
        });
        
        avatarUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    profileAvatarImg.src = e.target.result;
                    
                    // In a real application, you would upload the file to the server here
                    console.log('Profile image changed. Would upload to server in a real app.');
                    
                    // Show success message
                    showNotification('Profile image updated successfully!', 'success');
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form submission handlers
    const personalForm = document.getElementById('personal-form');
    const securityForm = document.getElementById('security-form');
    const preferencesForm = document.getElementById('preferences-form');
    const notificationsForm = document.getElementById('notifications-form');
    
    if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would send the form data to the server
            console.log('Personal information form submitted');
            
            // Get form data
            const formData = {
                fullName: document.getElementById('full-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                position: document.getElementById('position').value,
                department: document.getElementById('department').value,
                bio: document.getElementById('bio').value
            };
            
            console.log('Form data:', formData);
            
            // Show success message
            showNotification('Personal information updated successfully!', 'success');
        });
    }
    
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get password values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate passwords
            if (!currentPassword) {
                showNotification('Please enter your current password', 'error');
                return;
            }
            
            if (!newPassword) {
                showNotification('Please enter a new password', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }
            
            // Check password strength
            if (!isPasswordStrong(newPassword)) {
                showNotification('Password does not meet the requirements', 'error');
                return;
            }
            
            // In a real app, you would send the password data to the server
            console.log('Security form submitted');
            
            // Show success message
            showNotification('Password updated successfully!', 'success');
            
            // Clear form
            securityForm.reset();
        });
    }
    
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get preferences data
            const theme = document.querySelector('input[name="theme"]:checked').id.replace('theme-', '');
            const language = document.getElementById('language-preference').value;
            const timeFormat = document.querySelector('input[name="time-format"]:checked').id.replace('time-', '');
            const dateFormat = document.getElementById('date-format').value;
            const defaultView = document.getElementById('default-view').value;
            
            const preferencesData = {
                theme,
                language,
                timeFormat,
                dateFormat,
                defaultView
            };
            
            console.log('Preferences data:', preferencesData);
            
            // In a real app, you would send the preferences data to the server
            // and update the UI accordingly
            
            // Show success message
            showNotification('Preferences updated successfully!', 'success');
        });
    }
    
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get notification settings
            const notificationSettings = {
                emailReservations: document.getElementById('email-reservations').checked,
                emailAlerts: document.getElementById('email-alerts').checked,
                emailAccounts: document.getElementById('email-accounts').checked,
                appReservations: document.getElementById('app-reservations').checked,
                appMessages: document.getElementById('app-messages').checked,
                appSystem: document.getElementById('app-system').checked
            };
            
            console.log('Notification settings:', notificationSettings);
            
            // In a real app, you would send the notification settings to the server
            
            // Show success message
            showNotification('Notification settings updated successfully!', 'success');
        });
    }
    
    // Session management
    const logoutButtons = document.querySelectorAll('.session-item .btn-text');
    const logoutAllButton = document.querySelector('.btn-full');
    
    if (logoutButtons) {
        logoutButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sessionItem = this.closest('.session-item');
                
                // In a real app, you would send a request to the server to logout this session
                console.log('Logging out session');
                
                // Remove the session item from the UI
                sessionItem.style.opacity = '0';
                setTimeout(() => {
                    sessionItem.remove();
                }, 300);
                
                // Show success message
                showNotification('Device logged out successfully!', 'success');
            });
        });
    }
    
    if (logoutAllButton) {
        logoutAllButton.addEventListener('click', function() {
            // In a real app, you would send a request to the server to logout all sessions
            console.log('Logging out all sessions');
            
            // Remove all session items except the current one
            const sessionItems = document.querySelectorAll('.session-item:not(:first-child)');
            sessionItems.forEach(item => {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.remove();
                }, 300);
            });
            
            // Show success message
            showNotification('All other devices logged out successfully!', 'success');
        });
    }
});

/**
 * Checks if a password meets the strength requirements
 * @param {string} password - The password to check
 * @returns {boolean} - Whether the password is strong enough
 */
function isPasswordStrong(password) {
    // At least 8 characters
    if (password.length < 8) return false;
    
    // Contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // Contains at least one number
    if (!/[0-9]/.test(password)) return false;
    
    // Contains at least one special character
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    
    return true;
}

/**
 * Shows a notification message
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        notificationContainer.style.display = 'flex';
        notificationContainer.style.flexDirection = 'column';
        notificationContainer.style.gap = '10px';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set styles based on type
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
    notification.style.marginBottom = '10px';
    notification.style.animation = 'slideIn 0.3s ease forwards';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.minWidth = '300px';
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4caf50';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            notification.style.color = 'white';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#2196f3';
            notification.style.color = 'white';
            break;
    }
    
    // Add icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-times-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        case 'info':
        default:
            icon = 'fa-info-circle';
            break;
    }
    
    // Create notification content
    notification.innerHTML = `
        <i class="fas ${icon}" style="margin-right: 10px; font-size: 18px;"></i>
        <span>${message}</span>
        <i class="fas fa-times" style="margin-left: auto; cursor: pointer;"></i>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add click handler to close button
    const closeButton = notification.querySelector('.fa-times');
    closeButton.addEventListener('click', function() {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}
