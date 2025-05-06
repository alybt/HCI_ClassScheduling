/**
 * Teacher Reservations JavaScript
 * Handles the functionality for the teacher reservations page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const semesterSelect = document.getElementById('semester-select');
    
    // Set default semester to 2nd semester (since it's May 2025)
    if (semesterSelect) {
        semesterSelect.value = '2nd';
        // Trigger any change event listeners if needed
        const event = new Event('change');
        semesterSelect.dispatchEvent(event);
    }
    
    // Get current teacher data
    const currentTeacher = getCurrentTeacher();
    
    // Initialize tabs
    initializeTabs();
    
    // Populate course filters
    populateCourseFilters(currentTeacher);
    
    // Load reservations
    loadReservations('pending');
    loadReservations('approved');
    loadReservations('rejected');
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize modals
    initializeModals();
    
    // Load available courses for reservations
    loadAvailableCourses();
});

/**
 * Initialize tab switching functionality
 */
function initializeTabs() {
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
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

/**
 * Populate course filters with the teacher's courses
 * @param {Object} teacher - The current teacher
 */
function populateCourseFilters(teacher) {
    const teacherCourses = [...getTeacherCourses(teacher.id, '1st'), ...getTeacherCourses(teacher.id, '2nd')];
    
    // Get filter elements
    const courseFilter = document.getElementById('course-filter');
    const approvedCourseFilter = document.getElementById('approved-course-filter');
    const rejectedCourseFilter = document.getElementById('rejected-course-filter');
    
    // Add course options to filters
    const filters = [courseFilter, approvedCourseFilter, rejectedCourseFilter];
    
    filters.forEach(filter => {
        if (filter) {
            // Clear existing options except the first one
            while (filter.options.length > 1) {
                filter.remove(1);
            }
            
            // Add course options
            teacherCourses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.code;
                option.textContent = `${course.code}: ${course.title}`;
                filter.appendChild(option);
            });
            
            // Add event listener
            filter.addEventListener('change', function() {
                filterReservations(this);
            });
        }
    });
}

/**
 * Load reservations based on status
 * @param {string} status - The status of the reservations to load
 */
function loadReservations(status) {
    const reservationsContainer = document.getElementById(`${status}-reservations`);
    
    if (!reservationsContainer) return;
    
    // Clear existing reservations
    reservationsContainer.innerHTML = '';
    
    // Get current semester
    const currentSemester = document.getElementById('semester-select').value;
    
    // Get reservations with the specified status
    const reservations = getReservationsByStatus(status);
    
    // Filter reservations for current semester only
    const currentSemesterReservations = reservations.filter(reservation => {
        // For 2nd semester, only show 2nd semester courses
        if (currentSemester === '2nd') {
            return ['CC 102', 'WD 111', 'HCI 116', 'DS 118', 'OOP 112'].some(code => 
                reservation.course.startsWith(code));
        } else {
            // For 1st semester, only show 1st semester courses
            return ['CC 100', 'DS 111', 'CC 101'].some(code => 
                reservation.course.startsWith(code));
        }
    });
    
    if (currentSemesterReservations.length === 0) {
        // No reservations with the specified status
        reservationsContainer.innerHTML = '<div class="empty-list">No reservations found</div>';
        return;
    }
    
    // Add reservations to container
    currentSemesterReservations.forEach(reservation => {
        const reservationItem = createReservationItem(reservation);
        reservationsContainer.appendChild(reservationItem);
    });
}

/**
 * Get reservations by status
 * @param {string} status - The status of the reservations to get
 * @returns {Array} - The reservations with the specified status
 */
function getReservationsByStatus(status) {
    // Demo data for reservations
    const currentSemester = document.getElementById('semester-select').value;
    
    // 2nd semester reservations (current semester)
    const secondSemesterReservations = [
        {
            id: 'res001',
            course: 'CC 102: COMPUTER PROGRAMMING 2',
            student: 'John Smith',
            studentId: '2023-0001',
            date: 'May 7, 2025',
            days: 'Monday, Wednesday, Friday',
            time: '9:00 AM - 10:30 AM',
            room: 'LR 3',
            status: 'pending'
        },
        {
            id: 'res002',
            course: 'WD 111: WEB DEVELOPMENT 1',
            student: 'Emily Johnson',
            studentId: '2023-0002',
            date: 'May 6, 2025',
            days: 'Tuesday, Thursday',
            time: '1:00 PM - 2:30 PM',
            room: 'LR 4',
            status: 'pending'
        },
        {
            id: 'res003',
            course: 'DS 118: DISCRETE STRUCTURES 2',
            student: 'Michael Brown',
            studentId: '2023-0003',
            date: 'May 5, 2025',
            days: 'Monday, Wednesday, Friday',
            time: '10:30 AM - 12:00 PM',
            room: 'LR 5',
            status: 'approved'
        },
        {
            id: 'res004',
            course: 'OOP 112: OBJECT ORIENTED PROGRAMMING',
            student: 'Sarah Davis',
            studentId: '2023-0004',
            date: 'May 4, 2025',
            days: 'Tuesday, Thursday',
            time: '3:30 PM - 5:00 PM',
            room: 'LR 2',
            status: 'rejected'
        }
    ];
    
    // 1st semester reservations (past semester)
    const firstSemesterReservations = [
        {
            id: 'res005',
            course: 'CC 100: INTRODUCING TO COMPUTING',
            student: 'John Smith',
            studentId: '2023-0001',
            date: 'May 4, 2025',
            days: 'Monday, Wednesday, Friday',
            time: '9:00 AM - 10:30 AM',
            room: 'LR 2',
            status: 'pending'
        },
        {
            id: 'res006',
            course: 'CC 101: COMPUTER PROGRAMMING',
            student: 'Emily Johnson',
            studentId: '2023-0002',
            date: 'May 5, 2025',
            days: 'Tuesday, Thursday',
            time: '1:00 PM - 2:30 PM',
            room: 'LR 3',
            status: 'pending'
        },
        {
            id: 'res007',
            course: 'DS 111: DISCRETE STRUCTURES 1',
            student: 'Michael Brown',
            studentId: '2023-0003',
            date: 'May 3, 2025',
            days: 'Monday, Wednesday, Friday',
            time: '10:30 AM - 12:00 PM',
            room: 'LR 5',
            status: 'pending'
        }
    ];
    
    // Return reservations based on current semester
    const allReservations = currentSemester === '2nd' ? 
        secondSemesterReservations : firstSemesterReservations;
    
    // Filter by status
    return allReservations.filter(reservation => reservation.status === status);
}

/**
 * Create a reservation item
 * @param {Object} reservation - The reservation data
 * @returns {HTMLElement} - The reservation item element
 */
function createReservationItem(reservation) {
    const reservationItem = document.createElement('div');
    reservationItem.className = 'reservation-item';
    reservationItem.setAttribute('data-id', reservation.id);
    
    // Set border color based on status
    if (reservation.status === 'pending') {
        reservationItem.classList.add('pending');
    } else if (reservation.status === 'approved') {
        reservationItem.classList.add('approved');
    } else if (reservation.status === 'rejected') {
        reservationItem.classList.add('rejected');
    }
    
    // Set content
    reservationItem.innerHTML = `
        <div class="reservation-header">
            <h3>${reservation.course}</h3>
            <div class="reservation-actions">
                ${reservation.status === 'pending' ? `
                    <button class="approve-btn" data-id="${reservation.id}">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="reject-btn" data-id="${reservation.id}">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : ''}
                <button class="view-btn" data-id="${reservation.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
        <div class="reservation-details">
            <p><i class="fas fa-user"></i> ${reservation.student} <span class="student-id">${reservation.studentId}</span></p>
            <p><i class="fas fa-calendar-alt"></i> ${reservation.date}</p>
            <p><i class="fas fa-calendar-week"></i> ${reservation.days}</p>
            <p><i class="fas fa-clock"></i> ${reservation.time}</p>
            <p><i class="fas fa-door-open"></i> ${reservation.room}</p>
        </div>
    `;
    
    return reservationItem;
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInputs = [
        { input: document.getElementById('search-input'), button: document.getElementById('search-btn'), list: 'pending-reservations' },
        { input: document.getElementById('approved-search-input'), button: document.getElementById('approved-search-btn'), list: 'approved-reservations' },
        { input: document.getElementById('rejected-search-input'), button: document.getElementById('rejected-search-btn'), list: 'rejected-reservations' }
    ];
    
    searchInputs.forEach(search => {
        if (search.input && search.button) {
            // Search on button click
            search.button.addEventListener('click', function() {
                const query = search.input.value.toLowerCase();
                searchReservations(query, search.list);
            });
            
            // Search on enter key
            search.input.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    const query = this.value.toLowerCase();
                    searchReservations(query, search.list);
                }
            });
        }
    });
}

/**
 * Search reservations by student name
 * @param {string} query - The search query
 * @param {string} listId - The ID of the list to search in
 */
function searchReservations(query, listId) {
    const reservationItems = document.querySelectorAll(`#${listId} .reservation-item`);
    
    reservationItems.forEach(item => {
        const studentName = item.querySelector('.reservation-details p:first-child').textContent.toLowerCase();
        
        if (studentName.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Filter reservations by course
 * @param {HTMLElement} filterElement - The filter select element
 */
function filterReservations(filterElement) {
    const courseCode = filterElement.value;
    const listId = filterElement.id.replace('-course-filter', '-reservations');
    const reservationItems = document.querySelectorAll(`#${listId} .reservation-item`);
    
    reservationItems.forEach(item => {
        if (courseCode === 'all' || item.querySelector('.reservation-header h3').textContent.startsWith(courseCode)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
    // Details modal
    const detailsModal = document.getElementById('reservation-details-modal');
    const closeDetailsBtn = detailsModal?.querySelector('.close-modal');
    
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', function() {
            detailsModal.style.display = 'none';
        });
    }
    
    // Rejection modal
    const rejectionModal = document.getElementById('rejection-modal');
    const closeRejectionBtn = rejectionModal?.querySelector('.close-modal');
    const cancelRejectionBtn = document.getElementById('cancel-rejection');
    const confirmRejectionBtn = document.getElementById('confirm-rejection');
    
    if (closeRejectionBtn) {
        closeRejectionBtn.addEventListener('click', function() {
            rejectionModal.style.display = 'none';
        });
    }
    
    if (cancelRejectionBtn) {
        cancelRejectionBtn.addEventListener('click', function() {
            rejectionModal.style.display = 'none';
        });
    }
    
    if (confirmRejectionBtn) {
        confirmRejectionBtn.addEventListener('click', function() {
            const reservationId = this.getAttribute('data-id');
            const reason = document.getElementById('rejection-reason').value;
            
            if (reason.trim() === '') {
                alert('Please provide a reason for rejection.');
                return;
            }
            
            rejectReservation(reservationId, reason);
            rejectionModal.style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
        
        if (event.target === rejectionModal) {
            rejectionModal.style.display = 'none';
        }
    });
}

/**
 * Load available courses for reservations
 */
function loadAvailableCourses() {
    const semesterSelect = document.getElementById('semester-select');
    const semester = semesterSelect.value;
    const courseSelect = document.getElementById('course-select');
    
    // Clear existing options
    courseSelect.innerHTML = '<option value="">Select a course</option>';
    
    // Get courses for the selected semester
    let courses = [];
    
    if (semester === '1st') {
        courses = [
            { code: 'CC 100', name: 'INTRODUCING TO COMPUTING' },
            { code: 'CC 100', name: 'INTRODUCING TO COMPUTING (LAB)' },
            { code: 'DS 111', name: 'DISCRETE STRUCTURES 1' },
            { code: 'CC 101', name: 'COMPUTER PROGRAMMING' },
            { code: 'CC 101', name: 'COMPUTER PROGRAMMING (LAB)' }
        ];
    } else {
        courses = [
            { code: 'CC 102', name: 'COMPUTER PROGRAMMING 2' },
            { code: 'CC 102', name: 'COMPUTER PROGRAMMING 2 (LAB)' },
            { code: 'WD 111', name: 'WEB DEVELOPMENT 1' },
            { code: 'WD 111', name: 'WEB DEVELOPMENT 1 (LAB)' },
            { code: 'HCI 116', name: 'HUMAN COMPUTER INTERACTION' },
            { code: 'DS 118', name: 'DISCRETE STRUCTURES 2' },
            { code: 'OOP 112', name: 'OBJECT ORIENTED PROGRAMMING' },
            { code: 'OOP 112', name: 'OBJECT ORIENTED PROGRAMMING (LAB)' }
        ];
    }
    
    // Add options to select
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code}: ${course.name}`;
        courseSelect.appendChild(option);
    });
}

/**
 * Open the reservation details modal
 * @param {string} reservationId - The ID of the reservation to view
 */
function openDetailsModal(reservationId) {
    // Find the reservation
    const reservation = getReservationsByStatus('all').find(res => res.id === reservationId);
    
    if (!reservation) {
        alert('Reservation not found.');
        return;
    }
    
    const modal = document.getElementById('reservation-details-modal');
    
    if (modal) {
        // Populate modal with reservation details
        document.getElementById('modal-course').textContent = reservation.course;
        document.getElementById('modal-student').textContent = reservation.student;
        document.getElementById('modal-student-id').textContent = reservation.studentId;
        document.getElementById('modal-days').textContent = reservation.days;
        document.getElementById('modal-time').textContent = reservation.time;
        document.getElementById('modal-room').textContent = reservation.room;
        document.getElementById('modal-date').textContent = reservation.date;
        document.getElementById('modal-reason').textContent = reservation.reason;
        
        // Set up action buttons based on status
        const actionsContainer = document.getElementById('modal-actions');
        actionsContainer.innerHTML = '';
        
        if (reservation.status === 'pending') {
            actionsContainer.innerHTML = `
                <button class="btn-secondary" id="modal-close">Close</button>
                <button class="btn-danger" id="modal-reject" data-id="${reservation.id}">Reject</button>
                <button class="btn-primary" id="modal-approve" data-id="${reservation.id}">Approve</button>
            `;
            
            // Add event listeners
            document.getElementById('modal-close').addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            document.getElementById('modal-reject').addEventListener('click', function() {
                modal.style.display = 'none';
                openRejectionModal(reservation.id);
            });
            
            document.getElementById('modal-approve').addEventListener('click', function() {
                approveReservation(reservation.id);
                modal.style.display = 'none';
            });
        } else if (reservation.status === 'approved') {
            actionsContainer.innerHTML = `
                <button class="btn-secondary" id="modal-close">Close</button>
                <button class="btn-primary" id="modal-reschedule" data-id="${reservation.id}">Reschedule</button>
            `;
            
            // Add event listeners
            document.getElementById('modal-close').addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            document.getElementById('modal-reschedule').addEventListener('click', function() {
                rescheduleReservation(reservation.id);
                modal.style.display = 'none';
            });
        } else {
            actionsContainer.innerHTML = `
                <button class="btn-secondary" id="modal-close">Close</button>
            `;
            
            // Add event listener
            document.getElementById('modal-close').addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        // Show modal
        modal.style.display = 'block';
    }
}

/**
 * Open the rejection modal
 * @param {string} reservationId - The ID of the reservation to reject
 */
function openRejectionModal(reservationId) {
    const modal = document.getElementById('rejection-modal');
    
    if (modal) {
        // Clear previous reason
        document.getElementById('rejection-reason').value = '';
        
        // Set reservation ID on confirm button
        document.getElementById('confirm-rejection').setAttribute('data-id', reservationId);
        
        // Show modal
        modal.style.display = 'block';
    }
}

/**
 * Approve a reservation
 * @param {string} reservationId - The ID of the reservation to approve
 */
function approveReservation(reservationId) {
    // In a real application, this would send a request to the server
    // For demo purposes, we'll just show an alert and update the UI
    alert(`Reservation ${reservationId} has been approved.`);
    
    // Find the reservation item and remove it from the pending list
    const reservationItem = document.querySelector(`#pending-reservations .approve-btn[data-id="${reservationId}"]`)?.closest('.reservation-item');
    if (reservationItem) {
        reservationItem.remove();
    }
    
    // Check if pending list is empty
    const pendingList = document.getElementById('pending-reservations');
    if (pendingList && pendingList.children.length === 0) {
        pendingList.innerHTML = '<div class="empty-list">No pending reservations</div>';
    }
}

/**
 * Reject a reservation
 * @param {string} reservationId - The ID of the reservation to reject
 * @param {string} reason - The reason for rejection
 */
function rejectReservation(reservationId, reason) {
    // In a real application, this would send a request to the server
    // For demo purposes, we'll just show an alert and update the UI
    alert(`Reservation ${reservationId} has been rejected. Reason: ${reason}`);
    
    // Find the reservation item and remove it from the pending list
    const reservationItem = document.querySelector(`#pending-reservations .reject-btn[data-id="${reservationId}"]`)?.closest('.reservation-item');
    if (reservationItem) {
        reservationItem.remove();
    }
    
    // Check if pending list is empty
    const pendingList = document.getElementById('pending-reservations');
    if (pendingList && pendingList.children.length === 0) {
        pendingList.innerHTML = '<div class="empty-list">No pending reservations</div>';
    }
}

/**
 * Reschedule a reservation
 * @param {string} reservationId - The ID of the reservation to reschedule
 */
function rescheduleReservation(reservationId) {
    // In a real application, this would open a modal to enter new schedule
    // For demo purposes, we'll just show an alert
    alert(`Rescheduling reservation ${reservationId}. This feature is not implemented in the demo.`);
}
