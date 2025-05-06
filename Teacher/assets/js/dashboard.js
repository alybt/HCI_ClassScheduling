/**
 * Teacher Dashboard JavaScript
 * Handles the teacher dashboard functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    const currentDate = document.getElementById('current-date');
    const today = new Date();
    currentDate.textContent = formatDate(today);
    
    // Set default semester to 2nd semester (since it's May 2025)
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.value = '2nd';
    }
    
    // Format date as Month D, YYYY
    function formatDate(date) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Initialize the dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
    // Load teacher data
    const teacherData = getTeacherData();
    
    // Update dashboard stats
    updateDashboardStats(teacherData);
    
    // Load pending reservations
    loadPendingReservations();
    
    // Load recent activities
    loadRecentActivities();
}

/**
 * Get teacher data
 * @returns {Object} - The teacher data
 */
function getTeacherData() {
    // In a real app, this would come from an API call
    // For this demo, we'll use hardcoded data
    return {
        id: 'T001',
        name: 'Dr. Robert Johnson',
        department: 'Computer Science',
        courses: 8,
        students: 280,
        pendingReservations: 3,
        approvedReservations: 0
    };
}

/**
 * Update dashboard stats
 * @param {Object} teacherData - The teacher data
 */
function updateDashboardStats(teacherData) {
    // Update courses count
    const coursesCount = document.getElementById('courses-count');
    if (coursesCount) {
        coursesCount.textContent = teacherData.courses;
    }
    
    // Update students count
    const studentsCount = document.getElementById('students-count');
    if (studentsCount) {
        studentsCount.textContent = teacherData.students;
    }
    
    // Update pending reservations count
    const pendingReservationsCount = document.getElementById('pending-count');
    if (pendingReservationsCount) {
        pendingReservationsCount.textContent = teacherData.pendingReservations;
    }
    
    // Update approved reservations count
    const approvedReservationsCount = document.getElementById('approved-count');
    if (approvedReservationsCount) {
        approvedReservationsCount.textContent = teacherData.approvedReservations;
    }
}

/**
 * Load pending reservations
 */
function loadPendingReservations() {
    const pendingReservationsContainer = document.getElementById('pending-reservations');
    
    if (!pendingReservationsContainer) return;
    
    // Clear existing reservations
    pendingReservationsContainer.innerHTML = '';
    
    // Demo data for pending reservations (2nd semester courses)
    const pendingReservations = [
        {
            id: 'res001',
            course: 'CC 102: COMPUTER PROGRAMMING 2',
            student: 'John Smith',
            studentId: '2023-0001',
            date: 'May 7, 2025',
            days: 'Monday, Wednesday, Friday',
            time: '9:00 AM - 10:30 AM',
            room: 'LR 3'
        },
        {
            id: 'res002',
            course: 'WD 111: WEB DEVELOPMENT 1',
            student: 'Emily Johnson',
            studentId: '2023-0002',
            date: 'May 6, 2025',
            days: 'Tuesday, Thursday',
            time: '1:00 PM - 2:30 PM',
            room: 'LR 4'
        },
        {
            id: 'res003',
            course: 'DS 118: DISCRETE STRUCTURES 2',
            student: 'Michael Brown',
            studentId: '2023-0003',
            date: 'May 5, 2025',
            days: 'Monday, Wednesday, Friday',
            time: '10:30 AM - 12:00 PM',
            room: 'LR 5'
        }
    ];
    
    // Add reservations to container
    pendingReservations.forEach(reservation => {
        const reservationItem = createReservationItem(reservation);
        pendingReservationsContainer.appendChild(reservationItem);
    });
}

/**
 * Create a reservation item
 * @param {Object} reservation - The reservation data
 * @returns {HTMLElement} - The reservation item element
 */
function createReservationItem(reservation) {
    const reservationItem = document.createElement('div');
    reservationItem.className = 'reservation-item';
    
    // Extract course code from the full course string
    const courseCode = reservation.course.split(':')[0].trim();
    
    // Set content
    reservationItem.innerHTML = `
        <div class="reservation-header">
            <h3>${courseCode}</h3>
            <p>${reservation.course.split(':')[1].trim()}</p>
        </div>
        <div class="reservation-details">
            <p><i class="fas fa-user"></i> ${reservation.student} (${reservation.studentId})</p>
            <p><i class="fas fa-calendar-week"></i> ${reservation.days}</p>
            <p><i class="fas fa-clock"></i> ${reservation.time}</p>
            <p><i class="fas fa-door-open"></i> ${reservation.room}</p>
        </div>
        <div class="reservation-actions">
            <button class="btn-approve" data-id="${reservation.id}"><i class="fas fa-check"></i> Approve</button>
            <button class="btn-reject" data-id="${reservation.id}"><i class="fas fa-times"></i> Reject</button>
            <button class="btn-view" data-id="${reservation.id}"><i class="fas fa-eye"></i> View</button>
        </div>
    `;
    
    // Add event listeners to buttons
    const approveBtn = reservationItem.querySelector('.btn-approve');
    approveBtn.addEventListener('click', function() {
        approveReservation(reservation.id);
    });
    
    const rejectBtn = reservationItem.querySelector('.btn-reject');
    rejectBtn.addEventListener('click', function() {
        rejectReservation(reservation.id);
    });
    
    const viewBtn = reservationItem.querySelector('.btn-view');
    viewBtn.addEventListener('click', function() {
        viewReservation(reservation.id);
    });
    
    return reservationItem;
}

/**
 * Approve a reservation
 * @param {string} reservationId - The ID of the reservation to approve
 */
function approveReservation(reservationId) {
    // In a real app, this would send an API request
    // For this demo, we'll just remove the item from the UI
    const reservationItem = document.querySelector(`.btn-approve[data-id="${reservationId}"]`).closest('.reservation-item');
    
    if (reservationItem) {
        // Show success message
        alert(`Reservation ${reservationId} has been approved.`);
        
        // Remove item from UI
        reservationItem.remove();
        
        // Update pending reservations count
        const pendingReservationsCount = document.getElementById('pending-count');
        if (pendingReservationsCount) {
            const currentCount = parseInt(pendingReservationsCount.textContent);
            pendingReservationsCount.textContent = currentCount - 1;
        }
        
        // Update approved reservations count
        const approvedReservationsCount = document.getElementById('approved-count');
        if (approvedReservationsCount) {
            const currentCount = parseInt(approvedReservationsCount.textContent);
            approvedReservationsCount.textContent = currentCount + 1;
        }
        
        // Show notification
        showNotification('Reservation approved successfully!', 'success');
    }
}

/**
 * Reject a reservation
 * @param {string} reservationId - The ID of the reservation to reject
 */
function rejectReservation(reservationId) {
    // In a real app, this would open a modal to enter rejection reason
    // For this demo, we'll just prompt for a reason
    const reason = prompt('Please enter a reason for rejecting this reservation:');
    
    if (reason) {
        // In a real app, this would send an API request
        // For this demo, we'll just remove the item from the UI
        const reservationItem = document.querySelector(`.btn-reject[data-id="${reservationId}"]`).closest('.reservation-item');
        
        if (reservationItem) {
            // Show success message
            alert(`Reservation ${reservationId} has been rejected. Reason: ${reason}`);
            
            // Remove item from UI
            reservationItem.remove();
            
            // Update pending reservations count
            const pendingReservationsCount = document.getElementById('pending-count');
            if (pendingReservationsCount) {
                const currentCount = parseInt(pendingReservationsCount.textContent);
                pendingReservationsCount.textContent = currentCount - 1;
            }
            
            // Show notification
            showNotification('Reservation rejected successfully!', 'error');
        }
    }
}

/**
 * View a reservation
 * @param {string} reservationId - The ID of the reservation to view
 */
function viewReservation(reservationId) {
    // In a real app, this would open a modal with reservation details
    // For this demo, we'll just show an alert
    alert(`Viewing reservation ${reservationId}. In a real app, this would open a modal with full details.`);
}

/**
 * Load recent activities
 */
function loadRecentActivities() {
    const recentActivitiesContainer = document.getElementById('recent-activities');
    
    if (!recentActivitiesContainer) return;
    
    // Clear existing activities
    recentActivitiesContainer.innerHTML = '';
    
    // Demo data for recent activities
    const recentActivities = [
        {
            type: 'reservation',
            message: 'John Smith requested to enroll in CC 102: COMPUTER PROGRAMMING 2',
            time: '10 minutes ago'
        },
        {
            type: 'schedule',
            message: 'Your WD 111: WEB DEVELOPMENT 1 class has been moved to Room LR 5',
            time: '2 hours ago'
        },
        {
            type: 'grade',
            message: 'You submitted grades for OOP 112: OBJECT ORIENTED PROGRAMMING',
            time: '1 day ago'
        },
        {
            type: 'announcement',
            message: 'New department meeting scheduled for May 10, 2025',
            time: '2 days ago'
        }
    ];
    
    // Add activities to container
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Set icon based on activity type
        let icon = '';
        switch (activity.type) {
            case 'reservation':
                icon = '<i class="fas fa-calendar-plus"></i>';
                break;
            case 'schedule':
                icon = '<i class="fas fa-calendar-alt"></i>';
                break;
            case 'grade':
                icon = '<i class="fas fa-graduation-cap"></i>';
                break;
            case 'announcement':
                icon = '<i class="fas fa-bullhorn"></i>';
                break;
            default:
                icon = '<i class="fas fa-bell"></i>';
        }
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                ${icon}
            </div>
            <div class="activity-details">
                <p>${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        
        recentActivitiesContainer.appendChild(activityItem);
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // View all pending reservations button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            window.location.href = 'reservations.html';
        });
    }
}

/**
 * Show a notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to the document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
