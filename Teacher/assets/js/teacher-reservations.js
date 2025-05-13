/**
 * Teacher Reservations JavaScript
 * Handles teacher course reservation management functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ensure required services are available
    if (typeof sharedDataService === 'undefined' || typeof reservationService === 'undefined') {
        console.error('Required services not found. Make sure to include shared-data-service.js and reservation-service.js');
        return;
    }
    
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pendingList = document.getElementById('pending-list');
    const approvedList = document.getElementById('approved-list');
    const rejectedList = document.getElementById('rejected-list');
    const courseFilter = document.getElementById('course-filter');
    const approvedCourseFilter = document.getElementById('approved-course-filter');
    const rejectedCourseFilter = document.getElementById('rejected-course-filter');
    const searchInput = document.getElementById('search-input');
    const approvedSearchInput = document.getElementById('approved-search-input');
    const rejectedSearchInput = document.getElementById('rejected-search-input');
    const searchBtn = document.getElementById('search-btn');
    const approvedSearchBtn = document.getElementById('approved-search-btn');
    const rejectedSearchBtn = document.getElementById('rejected-search-btn');
    
    // Modals
    const detailsModal = document.getElementById('reservation-details-modal');
    const rejectionModal = document.getElementById('rejection-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelRejectionBtn = document.getElementById('cancel-rejection');
    const confirmRejectionBtn = document.getElementById('confirm-rejection');
    const rejectionReason = document.getElementById('rejection-reason');
    
    // Modal elements
    const modalCourse = document.getElementById('modal-course');
    const modalStudent = document.getElementById('modal-student');
    const modalStudentId = document.getElementById('modal-student-id');
    const modalDays = document.getElementById('modal-days');
    const modalTime = document.getElementById('modal-time');
    const modalRoom = document.getElementById('modal-room');
    const modalDate = document.getElementById('modal-date');
    const modalReason = document.getElementById('modal-reason');
    const modalActions = document.getElementById('modal-actions');
    
    // Current reservation being viewed
    let currentReservation = null;
    
    // Initialize
    init();
    
    /**
     * Initialize the reservations page
     */
    function init() {
        // Load teacher reservations
        loadTeacherReservations();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    /**
     * Load teacher reservations
     */
    function loadTeacherReservations() {
        // Clear existing reservations
        pendingList.innerHTML = '';
        approvedList.innerHTML = '';
        rejectedList.innerHTML = '';
        
        // Get teacher reservations
        const reservations = reservationService.getReservations();
        
        // Group reservations by status
        const pendingReservations = reservations.filter(res => res.status === 'pending');
        const approvedReservations = reservations.filter(res => res.status === 'approved');
        const rejectedReservations = reservations.filter(res => res.status === 'rejected');
        
        // Display reservations
        displayReservations(pendingList, pendingReservations, 'pending');
        displayReservations(approvedList, approvedReservations, 'approved');
        displayReservations(rejectedList, rejectedReservations, 'rejected');
        
        // Load course options for filters
        loadCourseOptions(reservations);
    }
    
    /**
     * Display reservations in the specified list
     * @param {HTMLElement} listElement - The list element to display reservations in
     * @param {Array} reservations - The reservations to display
     * @param {string} status - The status of the reservations
     */
    function displayReservations(listElement, reservations, status) {
        // Clear existing items
        listElement.innerHTML = '';
        
        // Display message if no reservations
        if (reservations.length === 0) {
            listElement.innerHTML = `<div class="no-reservations">No ${status} reservations found.</div>`;
            return;
        }
        
        // Add each reservation to the list
        reservations.forEach(reservation => {
            const reservationItem = createReservationItem(reservation, status);
            listElement.appendChild(reservationItem);
        });
    }
    
    /**
     * Create a reservation item element
     * @param {Object} reservation - The reservation data
     * @param {string} status - The status of the reservation
     * @returns {HTMLElement} The reservation item element
     */
    function createReservationItem(reservation, status) {
        const item = document.createElement('div');
        item.className = 'reservation-item';
        item.dataset.id = reservation.id;
        
        const daysString = reservation.days.join(', ');
        
        item.innerHTML = `
            <div class="reservation-info">
                <h3>${reservation.courseCode}: ${reservation.courseTitle}</h3>
                <div class="reservation-details">
                    <p><i class="fas fa-user"></i> ${reservation.studentName} (${reservation.studentId})</p>
                    <p><i class="fas fa-calendar-day"></i> ${daysString}</p>
                    <p><i class="fas fa-clock"></i> ${reservation.startTime} - ${reservation.endTime}</p>
                    <p><i class="fas fa-door-open"></i> Room ${reservation.room}</p>
                    <p><i class="fas fa-calendar-alt"></i> Requested on ${formatDate(reservation.requestDate)}</p>
                    ${reservation.status === 'rejected' ? `<p><i class="fas fa-comment"></i> Reason: ${reservation.rejectionReason}</p>` : ''}
                </div>
            </div>
            <div class="reservation-actions">
                ${status === 'pending' ? `
                    <button class="btn-approve" data-id="${reservation.id}"><i class="fas fa-check"></i> Approve</button>
                    <button class="btn-reject" data-id="${reservation.id}"><i class="fas fa-times"></i> Reject</button>
                ` : ''}
                <button class="btn-view" data-id="${reservation.id}"><i class="fas fa-eye"></i> View</button>
            </div>
        `;
        
        return item;
    }
    
    /**
     * Load course options for filters
     * @param {Array} reservations - All reservations
     */
    function loadCourseOptions(reservations) {
        // Get unique course codes
        const courseCodes = [...new Set(reservations.map(res => res.courseCode))];
        
        // Clear existing options except the first one
        while (courseFilter.options.length > 1) {
            courseFilter.remove(1);
        }
        
        while (approvedCourseFilter.options.length > 1) {
            approvedCourseFilter.remove(1);
        }
        
        while (rejectedCourseFilter.options.length > 1) {
            rejectedCourseFilter.remove(1);
        }
        
        // Add course options
        courseCodes.forEach(code => {
            const option1 = document.createElement('option');
            option1.value = code;
            option1.textContent = code;
            courseFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = code;
            option2.textContent = code;
            approvedCourseFilter.appendChild(option2);
            
            const option3 = document.createElement('option');
            option3.value = code;
            option3.textContent = code;
            rejectedCourseFilter.appendChild(option3);
        });
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all tab panes
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Show selected tab pane
                const tabId = this.dataset.tab + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Course filters
        courseFilter.addEventListener('change', function() {
            filterReservations(pendingList, this.value);
        });
        
        approvedCourseFilter.addEventListener('change', function() {
            filterReservations(approvedList, this.value);
        });
        
        rejectedCourseFilter.addEventListener('change', function() {
            filterReservations(rejectedList, this.value);
        });
        
        // Search buttons
        searchBtn.addEventListener('click', function() {
            searchReservations(pendingList, searchInput.value);
        });
        
        approvedSearchBtn.addEventListener('click', function() {
            searchReservations(approvedList, approvedSearchInput.value);
        });
        
        rejectedSearchBtn.addEventListener('click', function() {
            searchReservations(rejectedList, rejectedSearchInput.value);
        });
        
        // Search inputs (Enter key)
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                searchReservations(pendingList, this.value);
            }
        });
        
        approvedSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                searchReservations(approvedList, this.value);
            }
        });
        
        rejectedSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                searchReservations(rejectedList, this.value);
            }
        });
        
        // Reservation actions
        pendingList.addEventListener('click', function(e) {
            handleReservationAction(e);
        });
        
        approvedList.addEventListener('click', function(e) {
            handleReservationAction(e);
        });
        
        rejectedList.addEventListener('click', function(e) {
            handleReservationAction(e);
        });
        
        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                detailsModal.style.display = 'none';
                rejectionModal.style.display = 'none';
                currentReservation = null;
            });
        });
        
        // Cancel rejection
        cancelRejectionBtn.addEventListener('click', function() {
            rejectionModal.style.display = 'none';
            currentReservation = null;
        });
        
        // Confirm rejection
        confirmRejectionBtn.addEventListener('click', function() {
            if (!currentReservation) return;
            
            const reason = rejectionReason.value.trim();
            
            if (!reason) {
                alert('Please provide a reason for rejection.');
                return;
            }
            
            // Reject reservation
            const success = reservationService.rejectReservation(currentReservation.id, reason);
            
            if (success) {
                // Close modal
                rejectionModal.style.display = 'none';
                currentReservation = null;
                
                // Show success message
                alert('Reservation rejected successfully.');
                
                // Reload reservations
                loadTeacherReservations();
            } else {
                alert('Failed to reject reservation. Please try again.');
            }
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === detailsModal) {
                detailsModal.style.display = 'none';
                currentReservation = null;
            }
            
            if (e.target === rejectionModal) {
                rejectionModal.style.display = 'none';
                currentReservation = null;
            }
        });
    }
    
    /**
     * Handle reservation action (approve, reject, view)
     * @param {Event} e - The click event
     */
    function handleReservationAction(e) {
        // Approve button
        if (e.target.classList.contains('btn-approve') || e.target.parentElement.classList.contains('btn-approve')) {
            const button = e.target.classList.contains('btn-approve') ? e.target : e.target.parentElement;
            const reservationId = button.dataset.id;
            
            if (confirm('Are you sure you want to approve this reservation?')) {
                approveReservation(reservationId);
            }
        }
        
        // Reject button
        else if (e.target.classList.contains('btn-reject') || e.target.parentElement.classList.contains('btn-reject')) {
            const button = e.target.classList.contains('btn-reject') ? e.target : e.target.parentElement;
            const reservationId = button.dataset.id;
            
            openRejectionModal(reservationId);
        }
        
        // View button
        else if (e.target.classList.contains('btn-view') || e.target.parentElement.classList.contains('btn-view')) {
            const button = e.target.classList.contains('btn-view') ? e.target : e.target.parentElement;
            const reservationId = button.dataset.id;
            
            openDetailsModal(reservationId);
        }
    }
    
    /**
     * Filter reservations by course
     * @param {HTMLElement} listElement - The list element to filter
     * @param {string} courseCode - The course code to filter by
     */
    function filterReservations(listElement, courseCode) {
        const items = listElement.querySelectorAll('.reservation-item');
        
        items.forEach(item => {
            if (courseCode === 'all' || item.querySelector('h3').textContent.includes(courseCode)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Search reservations by student name
     * @param {HTMLElement} listElement - The list element to search
     * @param {string} query - The search query
     */
    function searchReservations(listElement, query) {
        const items = listElement.querySelectorAll('.reservation-item');
        
        if (!query.trim()) {
            items.forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const studentInfo = item.querySelector('.reservation-details p:first-child').textContent.toLowerCase();
            
            if (studentInfo.includes(lowerQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Open reservation details modal
     * @param {string} reservationId - The reservation ID
     */
    function openDetailsModal(reservationId) {
        const reservation = reservationService.getReservationById(reservationId);
        
        if (!reservation) {
            alert('Reservation not found.');
            return;
        }
        
        // Store current reservation
        currentReservation = reservation;
        
        // Populate modal
        modalCourse.textContent = `${reservation.courseCode}: ${reservation.courseTitle}`;
        modalStudent.textContent = reservation.studentName;
        modalStudentId.textContent = reservation.studentId;
        modalDays.textContent = reservation.days.join(', ');
        modalTime.textContent = `${reservation.startTime} - ${reservation.endTime}`;
        modalRoom.textContent = reservation.room;
        modalDate.textContent = formatDate(reservation.requestDate);
        modalReason.textContent = reservation.reason;
        
        // Set action buttons based on status
        if (reservation.status === 'pending') {
            modalActions.innerHTML = `
                <button class="btn-approve" data-id="${reservation.id}"><i class="fas fa-check"></i> Approve</button>
                <button class="btn-reject" data-id="${reservation.id}"><i class="fas fa-times"></i> Reject</button>
            `;
            
            // Add event listeners to buttons
            modalActions.querySelector('.btn-approve').addEventListener('click', function() {
                if (confirm('Are you sure you want to approve this reservation?')) {
                    approveReservation(reservation.id);
                }
            });
            
            modalActions.querySelector('.btn-reject').addEventListener('click', function() {
                openRejectionModal(reservation.id);
            });
        } else {
            modalActions.innerHTML = `
                <button class="btn-close"><i class="fas fa-times"></i> Close</button>
            `;
            
            modalActions.querySelector('.btn-close').addEventListener('click', function() {
                detailsModal.style.display = 'none';
                currentReservation = null;
            });
        }
        
        // Show modal
        detailsModal.style.display = 'flex';
    }
    
    /**
     * Open rejection modal
     * @param {string} reservationId - The reservation ID
     */
    function openRejectionModal(reservationId) {
        const reservation = reservationService.getReservationById(reservationId);
        
        if (!reservation) {
            alert('Reservation not found.');
            return;
        }
        
        // Store current reservation
        currentReservation = reservation;
        
        // Clear reason
        rejectionReason.value = '';
        
        // Show modal
        rejectionModal.style.display = 'flex';
    }
    
    /**
     * Approve a reservation
     * @param {string} reservationId - The reservation ID
     */
    function approveReservation(reservationId) {
        const success = reservationService.approveReservation(reservationId);
        
        if (success) {
            // Close modal if open
            detailsModal.style.display = 'none';
            currentReservation = null;
            
            // Show success message
            alert('Reservation approved successfully.');
            
            // Reload reservations
            loadTeacherReservations();
        } else {
            alert('Failed to approve reservation. Please try again.');
        }
    }
    
    /**
     * Format date string (YYYY-MM-DD) to more readable format
     * @param {string} dateStr - The date string
     * @returns {string} Formatted date string
     */
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
});
