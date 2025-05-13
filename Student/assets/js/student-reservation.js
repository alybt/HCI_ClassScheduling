/**
 * Student Reservation JavaScript
 * Handles student course reservation functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ensure required services are available
    if (typeof sharedDataService === 'undefined' || typeof reservationService === 'undefined') {
        console.error('Required services not found. Make sure to include shared-data-service.js and reservation-service.js');
        return;
    }
    
    // DOM Elements
    const courseList = document.querySelector('.course-list');
    const reservationList = document.querySelector('.reservation-list');
    const statusFilter = document.getElementById('status-filter');
    const reservationFilter = document.getElementById('reservation-filter');
    const reservationModal = document.getElementById('reservation-modal');
    const closeModalBtn = reservationModal.querySelector('.close-modal');
    const cancelReservationBtn = document.getElementById('cancel-reservation');
    const submitReservationBtn = document.getElementById('submit-reservation');
    const reservationForm = document.getElementById('reservation-form');
    
    // Form Elements
    const courseCodeInput = document.getElementById('course-code');
    const courseTitleInput = document.getElementById('course-title');
    const courseInstructorInput = document.getElementById('course-instructor');
    const dayCheckboxes = document.querySelectorAll('input[name="days"]');
    const startTimeInput = document.getElementById('preferred-time-start');
    const classDurationSelect = document.getElementById('class-duration');
    const timeSlotDisplay = document.getElementById('time-slot-display');
    const preferredRoomSelect = document.getElementById('preferred-room');
    const reasonTextarea = document.getElementById('reason');
    
    // Current course being reserved
    let currentCourse = null;
    
    // Initialize
    init();
    
    /**
     * Initialize the reservation page
     */
    function init() {
        // Load room data
        loadRooms();
        
        // Load student reservations
        loadStudentReservations();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update time slot display
        updateTimeSlotDisplay();
    }
    
    /**
     * Load available rooms
     */
    function loadRooms() {
        const roomAvailability = sharedDataService.getAllRoomAvailability();
        
        // Clear existing options except the first one
        while (preferredRoomSelect.options.length > 1) {
            preferredRoomSelect.remove(1);
        }
        
        // Add room options
        for (const roomId in roomAvailability) {
            if (roomAvailability[roomId].available) {
                const option = document.createElement('option');
                option.value = roomId;
                option.textContent = roomId;
                preferredRoomSelect.appendChild(option);
            }
        }
    }
    
    /**
     * Load student reservations
     */
    function loadStudentReservations() {
        // Clear existing reservations
        reservationList.innerHTML = '';
        
        // Get student reservations
        const reservations = reservationService.getReservations();
        
        // Filter reservations based on selected filter
        const filterValue = reservationFilter.value;
        const filteredReservations = filterValue === 'all' 
            ? reservations 
            : reservations.filter(res => res.status === filterValue);
        
        // Display reservations
        if (filteredReservations.length === 0) {
            reservationList.innerHTML = '<div class="no-reservations">No reservations found.</div>';
            return;
        }
        
        // Add each reservation to the list
        filteredReservations.forEach(reservation => {
            const reservationItem = createReservationItem(reservation);
            reservationList.appendChild(reservationItem);
        });
    }
    
    /**
     * Create a reservation item element
     * @param {Object} reservation - The reservation data
     * @returns {HTMLElement} The reservation item element
     */
    function createReservationItem(reservation) {
        const item = document.createElement('div');
        item.className = `reservation-item ${reservation.status}`;
        item.dataset.id = reservation.id;
        
        const daysString = reservation.days.join(', ');
        
        item.innerHTML = `
            <div class="reservation-info">
                <h3>${reservation.courseCode}: ${reservation.courseTitle}</h3>
                <div class="reservation-details">
                    <p><i class="fas fa-user"></i> ${reservation.teacherName}</p>
                    <p><i class="fas fa-calendar-day"></i> ${daysString}</p>
                    <p><i class="fas fa-clock"></i> ${reservation.startTime} - ${reservation.endTime}</p>
                    <p><i class="fas fa-door-open"></i> Room ${reservation.room}</p>
                    <p><i class="fas fa-calendar-alt"></i> Requested on ${formatDate(reservation.requestDate)}</p>
                    ${reservation.status === 'rejected' ? `<p><i class="fas fa-comment"></i> Reason: ${reservation.rejectionReason}</p>` : ''}
                </div>
            </div>
            <div class="reservation-status">
                <span class="status-badge ${reservation.status}">${capitalizeFirstLetter(reservation.status)}</span>
                ${reservation.status === 'pending' ? `<button class="btn-cancel" data-id="${reservation.id}"><i class="fas fa-times"></i> Cancel</button>` : ''}
                ${reservation.status === 'rejected' ? `<button class="btn-retry" data-id="${reservation.id}"><i class="fas fa-redo"></i> Try Again</button>` : ''}
            </div>
        `;
        
        return item;
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Course reserve buttons
        if (courseList) {
            courseList.addEventListener('click', function(e) {
                if (e.target.classList.contains('btn-reserve') || e.target.parentElement.classList.contains('btn-reserve')) {
                    const button = e.target.classList.contains('btn-reserve') ? e.target : e.target.parentElement;
                    openReservationModal(button);
                }
            });
        }
        
        // Reservation filter
        if (reservationFilter) {
            reservationFilter.addEventListener('change', loadStudentReservations);
        }
        
        // Status filter for unscheduled courses
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const value = this.value;
                const items = courseList.querySelectorAll('.course-item');
                
                items.forEach(item => {
                    if (value === 'all' || item.classList.contains(value)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
        
        // Cancel reservation buttons
        reservationList.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-cancel') || e.target.parentElement.classList.contains('btn-cancel')) {
                const button = e.target.classList.contains('btn-cancel') ? e.target : e.target.parentElement;
                const reservationId = button.dataset.id;
                
                if (confirm('Are you sure you want to cancel this reservation request?')) {
                    cancelReservation(reservationId);
                }
            }
        });
        
        // Retry reservation buttons
        reservationList.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-retry') || e.target.parentElement.classList.contains('btn-retry')) {
                const button = e.target.classList.contains('btn-retry') ? e.target : e.target.parentElement;
                const reservationId = button.dataset.id;
                const reservation = reservationService.getReservationById(reservationId);
                
                if (reservation) {
                    // Populate modal with reservation data
                    courseCodeInput.value = reservation.courseCode;
                    courseTitleInput.value = reservation.courseTitle;
                    courseInstructorInput.value = reservation.teacherName;
                    
                    // Set days
                    dayCheckboxes.forEach(checkbox => {
                        const day = checkbox.value.charAt(0).toUpperCase() + checkbox.value.slice(1);
                        checkbox.checked = reservation.days.includes(day);
                    });
                    
                    // Set time
                    const startTimeParts = reservation.startTime.match(/(\d+):(\d+) ([AP]M)/);
                    if (startTimeParts) {
                        let hours = parseInt(startTimeParts[1]);
                        const minutes = startTimeParts[2];
                        const ampm = startTimeParts[3];
                        
                        // Convert to 24-hour format
                        if (ampm === 'PM' && hours < 12) {
                            hours += 12;
                        } else if (ampm === 'AM' && hours === 12) {
                            hours = 0;
                        }
                        
                        startTimeInput.value = `${hours.toString().padStart(2, '0')}:${minutes}`;
                    }
                    
                    // Set room
                    preferredRoomSelect.value = reservation.room;
                    
                    // Set reason
                    reasonTextarea.value = reservation.reason;
                    
                    // Update time slot display
                    updateTimeSlotDisplay();
                    
                    // Open modal
                    openModal();
                }
            }
        });
        
        // Close modal
        closeModalBtn.addEventListener('click', closeModal);
        cancelReservationBtn.addEventListener('click', closeModal);
        
        // Submit reservation
        submitReservationBtn.addEventListener('click', submitReservation);
        
        // Time inputs change
        startTimeInput.addEventListener('change', updateTimeSlotDisplay);
        classDurationSelect.addEventListener('change', updateTimeSlotDisplay);
    }
    
    /**
     * Open reservation modal
     * @param {HTMLElement} button - The reserve button that was clicked
     */
    function openReservationModal(button) {
        // Get course data from button
        const courseCode = button.dataset.course;
        const courseTitle = button.dataset.title;
        const instructor = button.dataset.instructor;
        
        // Store current course
        currentCourse = {
            code: courseCode,
            title: courseTitle,
            instructor: instructor
        };
        
        // Populate form
        courseCodeInput.value = courseCode;
        courseTitleInput.value = courseTitle;
        courseInstructorInput.value = instructor;
        
        // Reset other form fields
        dayCheckboxes.forEach(checkbox => checkbox.checked = false);
        startTimeInput.value = '08:00';
        classDurationSelect.value = '1.5';
        preferredRoomSelect.value = '';
        reasonTextarea.value = '';
        
        // Update time slot display
        updateTimeSlotDisplay();
        
        // Open modal
        openModal();
    }
    
    /**
     * Open modal
     */
    function openModal() {
        reservationModal.style.display = 'flex';
    }
    
    /**
     * Close modal
     */
    function closeModal() {
        reservationModal.style.display = 'none';
        currentCourse = null;
    }
    
    /**
     * Update time slot display
     */
    function updateTimeSlotDisplay() {
        const startTime = startTimeInput.value;
        const duration = parseFloat(classDurationSelect.value);
        
        // Parse start time
        const [hours, minutes] = startTime.split(':').map(Number);
        
        // Create Date objects for start and end times
        const start = new Date();
        start.setHours(hours, minutes, 0, 0);
        
        const end = new Date(start);
        end.setTime(end.getTime() + duration * 60 * 60 * 1000);
        
        // Format times
        const startFormatted = formatTime(start);
        const endFormatted = formatTime(end);
        
        // Update display
        timeSlotDisplay.textContent = `${startFormatted} - ${endFormatted}`;
    }
    
    /**
     * Submit reservation
     */
    function submitReservation() {
        // Validate form
        if (!validateReservationForm()) {
            return;
        }
        
        // Get selected days
        const selectedDays = [];
        dayCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const day = checkbox.value.charAt(0).toUpperCase() + checkbox.value.slice(1);
                selectedDays.push(day);
            }
        });
        
        // Get time values
        const startTime = startTimeInput.value;
        const duration = parseFloat(classDurationSelect.value);
        
        // Parse start time
        const [hours, minutes] = startTime.split(':').map(Number);
        
        // Create Date objects for start and end times
        const start = new Date();
        start.setHours(hours, minutes, 0, 0);
        
        const end = new Date(start);
        end.setTime(end.getTime() + duration * 60 * 60 * 1000);
        
        // Format times
        const startFormatted = formatTime(start);
        const endFormatted = formatTime(end);
        
        // Create reservation data
        const reservationData = {
            courseCode: currentCourse.code,
            courseTitle: currentCourse.title,
            teacherId: getTeacherIdFromName(currentCourse.instructor),
            teacherName: currentCourse.instructor,
            days: selectedDays,
            startTime: startFormatted,
            endTime: endFormatted,
            room: preferredRoomSelect.value,
            reason: reasonTextarea.value
        };
        
        // Submit reservation
        const reservationId = reservationService.createReservation(reservationData);
        
        if (reservationId) {
            // Close modal
            closeModal();
            
            // Show success message
            alert('Reservation request submitted successfully!');
            
            // Reload reservations
            loadStudentReservations();
        } else {
            alert('Failed to submit reservation request. Please try again.');
        }
    }
    
    /**
     * Validate reservation form
     * @returns {boolean} Whether the form is valid
     */
    function validateReservationForm() {
        // Check if days are selected
        let daysSelected = false;
        dayCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                daysSelected = true;
            }
        });
        
        if (!daysSelected) {
            alert('Please select at least one day.');
            return false;
        }
        
        // Check if room is selected
        if (!preferredRoomSelect.value) {
            alert('Please select a preferred room.');
            return false;
        }
        
        // Check if reason is provided
        if (!reasonTextarea.value.trim()) {
            alert('Please provide a reason for your reservation request.');
            return false;
        }
        
        return true;
    }
    
    /**
     * Cancel a reservation
     * @param {string} reservationId - The reservation ID
     */
    function cancelReservation(reservationId) {
        const success = reservationService.cancelReservation(reservationId);
        
        if (success) {
            alert('Reservation cancelled successfully.');
            loadStudentReservations();
        } else {
            alert('Failed to cancel reservation. Please try again.');
        }
    }
    
    /**
     * Format time (HH:MM) to 12-hour format with AM/PM
     * @param {Date} date - The date object
     * @returns {string} Formatted time string
     */
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
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
    
    /**
     * Capitalize first letter of a string
     * @param {string} str - The string to capitalize
     * @returns {string} Capitalized string
     */
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    /**
     * Get teacher ID from name
     * @param {string} name - The teacher's name
     * @returns {string} The teacher's ID
     */
    function getTeacherIdFromName(name) {
        // For demo purposes, we'll use a simple mapping
        const teacherMap = {
            'Dr. Robert Johnson': 'T001',
            'Prof. William Chen': 'T002',
            'Prof. Sarah Lee': 'T003',
            'Prof. Jane Smith': 'T004',
            'Prof. John Doe': 'T005',
            'Prof. Maria Garcia': 'T006'
        };
        
        return teacherMap[name] || 'T001'; // Default to T001 if not found
    }
});
