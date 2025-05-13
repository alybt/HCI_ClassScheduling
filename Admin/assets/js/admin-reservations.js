/**
 * Admin Reservations JavaScript
 * Handles admin reservation management functionality
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
    const pendingList = document.querySelector('#pending .reservation-list');
    const approvedList = document.querySelector('#approved .reservation-list');
    const rescheduledList = document.querySelector('#rescheduled .reservation-list');
    const eventsList = document.querySelector('#events .events-list');
    
    // Initialize
    init();
    
    /**
     * Initialize the reservations page
     */
    function init() {
        // Load all reservations
        loadAllReservations();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set up schedule grid
        setupScheduleGrid();
    }
    
    /**
     * Load all reservations
     */
    function loadAllReservations() {
        // Get all reservations
        const allReservations = sharedDataService.getAllReservations();
        
        // Group reservations by status
        const pendingReservations = allReservations.filter(res => res.status === 'pending');
        const approvedReservations = allReservations.filter(res => res.status === 'approved');
        
        // Display reservations
        displayPendingReservations(pendingReservations);
        displayApprovedReservations(approvedReservations);
        
        // Load conflicts
        loadConflicts();
    }
    
    /**
     * Display pending reservations
     * @param {Array} reservations - The pending reservations to display
     */
    function displayPendingReservations(reservations) {
        // Clear existing items
        pendingList.innerHTML = '';
        
        // Display message if no reservations
        if (reservations.length === 0) {
            pendingList.innerHTML = '<div class="no-reservations">No pending reservations found.</div>';
            return;
        }
        
        // Add each reservation to the list
        reservations.forEach(reservation => {
            const reservationItem = createPendingReservationItem(reservation);
            pendingList.appendChild(reservationItem);
        });
    }
    
    /**
     * Display approved reservations
     * @param {Array} reservations - The approved reservations to display
     */
    function displayApprovedReservations(reservations) {
        // Clear existing items
        approvedList.innerHTML = '';
        
        // Display message if no reservations
        if (reservations.length === 0) {
            approvedList.innerHTML = '<div class="no-reservations">No approved reservations found.</div>';
            return;
        }
        
        // Group reservations by date
        const reservationsByDate = groupReservationsByDate(reservations);
        
        // Add each date group to the list
        for (const date in reservationsByDate) {
            const dateGroup = document.createElement('div');
            dateGroup.className = 'date-group';
            
            const dateHeader = document.createElement('h3');
            dateHeader.textContent = formatDate(date);
            dateGroup.appendChild(dateHeader);
            
            const reservationList = document.createElement('div');
            reservationList.className = 'reservation-group';
            
            reservationsByDate[date].forEach(reservation => {
                const reservationItem = createApprovedReservationItem(reservation);
                reservationList.appendChild(reservationItem);
            });
            
            dateGroup.appendChild(reservationList);
            approvedList.appendChild(dateGroup);
        }
    }
    
    /**
     * Create a pending reservation item element
     * @param {Object} reservation - The reservation data
     * @returns {HTMLElement} The reservation item element
     */
    function createPendingReservationItem(reservation) {
        const item = document.createElement('div');
        item.className = 'reservation-item';
        item.dataset.id = reservation.id;
        
        const daysString = reservation.days.join(', ');
        
        item.innerHTML = `
            <div class="reservation-info">
                <div class="reservation-header">
                    <h3>${reservation.courseCode}: ${reservation.courseTitle}</h3>
                    <span class="reservation-date">Requested: ${formatDate(reservation.requestDate)}</span>
                </div>
                <div class="reservation-details">
                    <p><strong>Teacher:</strong> ${reservation.teacherName}</p>
                    <p><strong>Student:</strong> ${reservation.studentName} (${reservation.studentId})</p>
                    <p><strong>Room:</strong> ${reservation.room}</p>
                    <p><strong>Days:</strong> ${daysString}</p>
                    <p><strong>Time:</strong> ${reservation.startTime} - ${reservation.endTime}</p>
                    <p><strong>Reason:</strong> ${reservation.reason}</p>
                </div>
            </div>
            <div class="reservation-actions">
                <button class="btn-approve" data-id="${reservation.id}"><i class="fas fa-check"></i> Approve</button>
                <button class="btn-reject" data-id="${reservation.id}"><i class="fas fa-times"></i> Reject</button>
                <button class="btn-reschedule" data-id="${reservation.id}"><i class="fas fa-calendar-alt"></i> Reschedule</button>
            </div>
        `;
        
        return item;
    }
    
    /**
     * Create an approved reservation item element
     * @param {Object} reservation - The reservation data
     * @returns {HTMLElement} The reservation item element
     */
    function createApprovedReservationItem(reservation) {
        const item = document.createElement('div');
        item.className = 'approved-item';
        item.dataset.id = reservation.id;
        
        const daysString = reservation.days.join(', ');
        
        item.innerHTML = `
            <div class="approved-info">
                <h4>${reservation.courseCode}: ${reservation.courseTitle}</h4>
                <div class="approved-details">
                    <p><i class="fas fa-user"></i> ${reservation.teacherName}</p>
                    <p><i class="fas fa-clock"></i> ${reservation.startTime} - ${reservation.endTime}</p>
                    <p><i class="fas fa-calendar-day"></i> ${daysString}</p>
                    <p><i class="fas fa-door-open"></i> ${reservation.room}</p>
                </div>
            </div>
            <div class="approved-actions">
                <button class="btn-edit" data-id="${reservation.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-cancel" data-id="${reservation.id}"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        return item;
    }
    
    /**
     * Load scheduling conflicts
     */
    function loadConflicts() {
        // Detect conflicts
        const conflicts = reservationService.detectConflicts();
        
        // Update conflict count in dashboard
        const conflictCount = document.querySelector('.stat-card:nth-child(2) h3');
        if (conflictCount) {
            conflictCount.textContent = conflicts.length;
        }
        
        // Display conflicts in rescheduled tab
        displayConflicts(conflicts);
    }
    
    /**
     * Display scheduling conflicts
     * @param {Array} conflicts - The conflicts to display
     */
    function displayConflicts(conflicts) {
        // Clear existing items
        rescheduledList.innerHTML = '';
        
        // Display message if no conflicts
        if (conflicts.length === 0) {
            rescheduledList.innerHTML = '<div class="no-conflicts">No scheduling conflicts found.</div>';
            return;
        }
        
        // Add each conflict to the list
        conflicts.forEach(conflict => {
            const conflictItem = createConflictItem(conflict);
            rescheduledList.appendChild(conflictItem);
        });
    }
    
    /**
     * Create a conflict item element
     * @param {Object} conflict - The conflict data
     * @returns {HTMLElement} The conflict item element
     */
    function createConflictItem(conflict) {
        const item = document.createElement('div');
        item.className = 'conflict-item';
        item.dataset.id = conflict.id;
        
        const daysString = conflict.days.join(', ');
        
        item.innerHTML = `
            <div class="conflict-info">
                <div class="conflict-header">
                    <h3>Scheduling Conflict</h3>
                    <span class="conflict-date">Detected: ${formatDate(conflict.detectedDate)}</span>
                </div>
                <div class="conflict-details">
                    <div class="conflict-course">
                        <h4>${conflict.course1}: ${conflict.course1Title}</h4>
                        <p><strong>Teacher:</strong> ${conflict.teacher1Name}</p>
                        <p><strong>Time:</strong> ${conflict.time1Start} - ${conflict.time1End}</p>
                    </div>
                    <div class="conflict-vs">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="conflict-course">
                        <h4>${conflict.course2}: ${conflict.course2Title}</h4>
                        <p><strong>Teacher:</strong> ${conflict.teacher2Name}</p>
                        <p><strong>Time:</strong> ${conflict.time2Start} - ${conflict.time2End}</p>
                    </div>
                    <div class="conflict-common">
                        <p><strong>Room:</strong> ${conflict.room}</p>
                        <p><strong>Days:</strong> ${daysString}</p>
                    </div>
                </div>
            </div>
            <div class="conflict-actions">
                <button class="btn-resolve" data-id="${conflict.id}"><i class="fas fa-check-circle"></i> Resolve</button>
                <button class="btn-reschedule-1" data-course="${conflict.course1}" data-teacher="${conflict.teacher1Id}"><i class="fas fa-calendar-alt"></i> Reschedule ${conflict.course1}</button>
                <button class="btn-reschedule-2" data-course="${conflict.course2}" data-teacher="${conflict.teacher2Id}"><i class="fas fa-calendar-alt"></i> Reschedule ${conflict.course2}</button>
            </div>
        `;
        
        return item;
    }
    
    /**
     * Group reservations by date
     * @param {Array} reservations - The reservations to group
     * @returns {Object} Reservations grouped by date
     */
    function groupReservationsByDate(reservations) {
        const groups = {};
        
        reservations.forEach(reservation => {
            // Use the first day of the week as the key
            const firstDay = reservation.days[0];
            
            if (!groups[firstDay]) {
                groups[firstDay] = [];
            }
            
            groups[firstDay].push(reservation);
        });
        
        return groups;
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
                const tabId = this.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Pending reservation actions
        pendingList.addEventListener('click', function(e) {
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
                
                const reason = prompt('Please provide a reason for rejection:');
                
                if (reason) {
                    rejectReservation(reservationId, reason);
                }
            }
            
            // Reschedule button
            else if (e.target.classList.contains('btn-reschedule') || e.target.parentElement.classList.contains('btn-reschedule')) {
                const button = e.target.classList.contains('btn-reschedule') ? e.target : e.target.parentElement;
                const reservationId = button.dataset.id;
                
                // In a real app, this would open a reschedule modal
                alert('Reschedule functionality would open a modal to select new times.');
            }
        });
        
        // Approved reservation actions
        approvedList.addEventListener('click', function(e) {
            // Edit button
            if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
                const button = e.target.classList.contains('btn-edit') ? e.target : e.target.parentElement;
                const reservationId = button.dataset.id;
                
                // In a real app, this would open an edit modal
                alert('Edit functionality would open a modal to edit the reservation.');
            }
            
            // Cancel button
            else if (e.target.classList.contains('btn-cancel') || e.target.parentElement.classList.contains('btn-cancel')) {
                const button = e.target.classList.contains('btn-cancel') ? e.target : e.target.parentElement;
                const reservationId = button.dataset.id;
                
                if (confirm('Are you sure you want to cancel this approved reservation?')) {
                    cancelReservation(reservationId);
                }
            }
        });
        
        // Conflict actions
        rescheduledList.addEventListener('click', function(e) {
            // Resolve button
            if (e.target.classList.contains('btn-resolve') || e.target.parentElement.classList.contains('btn-resolve')) {
                const button = e.target.classList.contains('btn-resolve') ? e.target : e.target.parentElement;
                const conflictId = button.dataset.id;
                
                if (confirm('Are you sure you want to mark this conflict as resolved?')) {
                    resolveConflict(conflictId);
                }
            }
            
            // Reschedule course 1 button
            else if (e.target.classList.contains('btn-reschedule-1') || e.target.parentElement.classList.contains('btn-reschedule-1')) {
                const button = e.target.classList.contains('btn-reschedule-1') ? e.target : e.target.parentElement;
                const courseCode = button.dataset.course;
                const teacherId = button.dataset.teacher;
                
                // In a real app, this would open a reschedule modal
                alert(`Reschedule functionality would open a modal to reschedule ${courseCode}.`);
            }
            
            // Reschedule course 2 button
            else if (e.target.classList.contains('btn-reschedule-2') || e.target.parentElement.classList.contains('btn-reschedule-2')) {
                const button = e.target.classList.contains('btn-reschedule-2') ? e.target : e.target.parentElement;
                const courseCode = button.dataset.course;
                const teacherId = button.dataset.teacher;
                
                // In a real app, this would open a reschedule modal
                alert(`Reschedule functionality would open a modal to reschedule ${courseCode}.`);
            }
        });
    }
    
    /**
     * Set up schedule grid
     */
    function setupScheduleGrid() {
        // Get all approved reservations
        const approvedReservations = sharedDataService.getReservationsByStatus('approved');
        
        // Get all time slots
        const timeSlots = document.querySelectorAll('.time-slots .slot');
        
        // Clear all slots
        timeSlots.forEach(slot => {
            slot.innerHTML = '';
            slot.className = 'slot';
        });
        
        // Populate slots with reservations
        approvedReservations.forEach(reservation => {
            // For demo purposes, we'll only show reservations for the current day (Monday)
            if (reservation.days.includes('Monday')) {
                // Find the right slot based on room and time
                const roomIndex = getRoomIndex(reservation.room);
                const timeIndex = getTimeIndex(reservation.startTime);
                
                if (roomIndex !== -1 && timeIndex !== -1) {
                    // Calculate the slot index
                    const slotIndex = timeIndex * 3 + roomIndex; // 3 is the number of rooms
                    
                    // Get the slot
                    const slot = timeSlots[slotIndex];
                    
                    if (slot) {
                        // Check if slot is already occupied
                        if (slot.innerHTML) {
                            // Mark as conflict
                            slot.className = 'slot conflict';
                            slot.innerHTML += `<div class="reservation-block conflict">${reservation.courseCode}<br>${reservation.teacherName}</div>`;
                        } else {
                            // Add reservation to slot
                            slot.innerHTML = `<div class="reservation-block">${reservation.courseCode}<br>${reservation.teacherName}</div>`;
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Get room index for schedule grid
     * @param {string} room - The room name
     * @returns {number} The room index
     */
    function getRoomIndex(room) {
        const rooms = ['Lab 1', 'Lab 2', 'Lab 3'];
        return rooms.indexOf(room);
    }
    
    /**
     * Get time index for schedule grid
     * @param {string} time - The time string (e.g., '9:00 AM')
     * @returns {number} The time index
     */
    function getTimeIndex(time) {
        const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
        return times.indexOf(time);
    }
    
    /**
     * Approve a reservation
     * @param {string} reservationId - The reservation ID
     */
    function approveReservation(reservationId) {
        const success = reservationService.approveReservation(reservationId, 'Approved by admin');
        
        if (success) {
            alert('Reservation approved successfully.');
            loadAllReservations();
        } else {
            alert('Failed to approve reservation. Please try again.');
        }
    }
    
    /**
     * Reject a reservation
     * @param {string} reservationId - The reservation ID
     * @param {string} reason - The reason for rejection
     */
    function rejectReservation(reservationId, reason) {
        const success = reservationService.rejectReservation(reservationId, reason, 'Rejected by admin');
        
        if (success) {
            alert('Reservation rejected successfully.');
            loadAllReservations();
        } else {
            alert('Failed to reject reservation. Please try again.');
        }
    }
    
    /**
     * Cancel an approved reservation
     * @param {string} reservationId - The reservation ID
     */
    function cancelReservation(reservationId) {
        const success = sharedDataService.deleteReservation(reservationId);
        
        if (success) {
            alert('Reservation cancelled successfully.');
            loadAllReservations();
        } else {
            alert('Failed to cancel reservation. Please try again.');
        }
    }
    
    /**
     * Resolve a scheduling conflict
     * @param {string} conflictId - The conflict ID
     */
    function resolveConflict(conflictId) {
        const success = sharedDataService.resolveConflict(conflictId);
        
        if (success) {
            alert('Conflict marked as resolved.');
            loadConflicts();
        } else {
            alert('Failed to resolve conflict. Please try again.');
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
