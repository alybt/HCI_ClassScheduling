// Reservation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const statusFilter = document.getElementById('status-filter');
    const reservationFilter = document.getElementById('reservation-filter');
    const courseItems = document.querySelectorAll('.course-item');
    const reservationItems = document.querySelectorAll('.reservation-item');
    const reserveButtons = document.querySelectorAll('.btn-reserve');
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    const retryButtons = document.querySelectorAll('.btn-retry');
    const reservationModal = document.getElementById('reservation-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelReservationBtn = document.getElementById('cancel-reservation');
    const submitReservationBtn = document.getElementById('submit-reservation');
    const courseCodeInput = document.getElementById('course-code');
    const courseTitleInput = document.getElementById('course-title');
    const courseInstructorInput = document.getElementById('course-instructor');
    const preferredRoomSelect = document.getElementById('preferred-room');
    const roomSuggestionsContainer = document.getElementById('room-suggestions');
    const semesterSelect = document.getElementById('semester-select');
    
    // Set default semester to 2nd semester (since it's May 2025)
    if (semesterSelect) {
        semesterSelect.value = '2nd';
        
        // Disable 1st semester option since it's already passed
        const firstSemOption = semesterSelect.querySelector('option[value="1st"]');
        if (firstSemOption) {
            firstSemOption.disabled = true;
        }
        
        // Add note that 1st semester is no longer available
        const optionGroup = document.createElement('optgroup');
        optionGroup.label = "Current Semester";
        
        // Move 2nd semester option to the optgroup
        const secondSemOption = semesterSelect.querySelector('option[value="2nd"]');
        if (secondSemOption) {
            const newOption = document.createElement('option');
            newOption.value = '2nd';
            newOption.textContent = secondSemOption.textContent;
            optionGroup.appendChild(newOption);
            secondSemOption.remove();
        }
        
        semesterSelect.appendChild(optionGroup);
    }
    
    // Load appropriate courses based on current semester (2nd semester)
    loadCurrentSemesterCourses();
    
    // Function to load current semester courses
    function loadCurrentSemesterCourses() {
        const courseList = document.querySelector('.course-list');
        if (!courseList) return;
        
        // Clear existing courses
        courseList.innerHTML = '';
        
        // 2nd semester courses data (unscheduled/conflicted)
        const secondSemesterCourses = [
            {
                code: 'CC 102',
                title: 'COMPUTER PROGRAMMING 2',
                instructor: 'Dr. Robert Johnson',
                status: 'unscheduled'
            },
            {
                code: 'CC 102',
                title: 'COMPUTER PROGRAMMING 2 (LAB)',
                instructor: 'Dr. Robert Johnson',
                status: 'unscheduled'
            },
            {
                code: 'WD 111',
                title: 'WEB DEVELOPMENT 1',
                instructor: 'Prof. Sarah Williams',
                status: 'conflicted'
            },
            {
                code: 'WD 111',
                title: 'WEB DEVELOPMENT 1 (LAB)',
                instructor: 'Prof. Sarah Williams',
                status: 'unscheduled'
            },
            {
                code: 'HCI 116',
                title: 'HUMAN COMPUTER INTERACTION',
                instructor: 'Dr. Michael Chen',
                status: 'unscheduled'
            },
            {
                code: 'DS 118',
                title: 'DISCRETE STRUCTURES 2',
                instructor: 'Dr. Robert Johnson',
                status: 'unscheduled'
            },
            {
                code: 'OOP 112',
                title: 'OBJECT ORIENTED PROGRAMMING',
                instructor: 'Prof. Emily Davis',
                status: 'conflicted'
            },
            {
                code: 'OOP 112',
                title: 'OBJECT ORIENTED PROGRAMMING (LAB)',
                instructor: 'Prof. Emily Davis',
                status: 'unscheduled'
            }
        ];
        
        // Add courses to the list
        secondSemesterCourses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = `course-item ${course.status}`;
            
            const iconClass = course.status === 'unscheduled' ? 
                'fas fa-exclamation-triangle' : 'fas fa-exclamation-circle';
            
            const statusText = course.status === 'unscheduled' ? 
                'Not scheduled yet' : 'Schedule conflict detected';
            
            courseItem.innerHTML = `
                <div class="course-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="course-info">
                    <h3>${course.code} - ${course.title}</h3>
                    <p><i class="fas fa-user"></i> ${course.instructor}</p>
                    <p><i class="fas fa-exclamation-circle"></i> <span class="status">${statusText}</span></p>
                </div>
                <div class="course-actions">
                    <button class="btn-reserve" data-course="${course.code}" data-title="${course.title}" data-instructor="${course.instructor}">
                        <i class="fas fa-calendar-plus"></i> Reserve
                    </button>
                </div>
            `;
            
            courseList.appendChild(courseItem);
        });
        
        // Reattach event listeners for new reserve buttons
        const newReserveButtons = courseList.querySelectorAll('.btn-reserve');
        newReserveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const courseCode = this.getAttribute('data-course');
                const courseTitle = this.getAttribute('data-title');
                const instructor = this.getAttribute('data-instructor');
                
                // Populate modal with course details
                courseCodeInput.value = courseCode;
                courseTitleInput.value = courseTitle;
                courseInstructorInput.value = instructor;
                
                // Clear previous room suggestions
                if (roomSuggestionsContainer) {
                    roomSuggestionsContainer.innerHTML = '';
                    roomSuggestionsContainer.style.display = 'none';
                }
                
                // Show modal
                reservationModal.style.display = 'block';
            });
        });
    }
    
    // Event Listeners
    
    // Filter unscheduled/conflicted courses
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            
            courseItems.forEach(item => {
                if (status === 'all') {
                    item.style.display = 'flex';
                } else if (status === 'unscheduled' && item.classList.contains('unscheduled')) {
                    item.style.display = 'flex';
                } else if (status === 'conflicted' && item.classList.contains('conflicted')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Filter reservations
    if (reservationFilter) {
        reservationFilter.addEventListener('change', function() {
            const status = this.value;
            
            reservationItems.forEach(item => {
                if (status === 'all') {
                    item.style.display = 'flex';
                } else if (status === 'pending' && item.classList.contains('pending')) {
                    item.style.display = 'flex';
                } else if (status === 'approved' && item.classList.contains('approved')) {
                    item.style.display = 'flex';
                } else if (status === 'rejected' && item.classList.contains('rejected')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Reserve buttons
    reserveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseCode = this.getAttribute('data-course');
            const courseTitle = this.getAttribute('data-title');
            const instructor = this.getAttribute('data-instructor');
            
            // Populate modal with course details
            courseCodeInput.value = courseCode;
            courseTitleInput.value = courseTitle;
            courseInstructorInput.value = instructor;
            
            // Clear previous room suggestions
            if (roomSuggestionsContainer) {
                roomSuggestionsContainer.innerHTML = '';
                roomSuggestionsContainer.style.display = 'none';
            }
            
            // Show modal
            reservationModal.style.display = 'block';
        });
    });
    
    // Cancel reservation buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reservationItem = this.closest('.reservation-item');
            const courseName = reservationItem.querySelector('h3').textContent;
            
            if (confirm(`Are you sure you want to cancel your reservation for ${courseName}?`)) {
                // In a real app, this would send a request to the server
                // For this demo, we'll just remove the item from the UI
                reservationItem.remove();
                
                // Show success message
                alert(`Your reservation for ${courseName} has been cancelled.`);
            }
        });
    });
    
    // Retry buttons for rejected reservations
    retryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reservationItem = this.closest('.reservation-item');
            const courseName = reservationItem.querySelector('h3').textContent;
            
            // Extract course code from course name (e.g., "CS 201 - Data Structures" -> "CS 201")
            const courseCode = courseName.split(' - ')[0];
            const courseTitle = courseName.split(' - ')[1];
            const instructor = reservationItem.querySelector('.reservation-details p:first-child').textContent.replace('Prof. ', '');
            
            // Populate modal with course details
            courseCodeInput.value = courseCode;
            courseTitleInput.value = courseTitle;
            courseInstructorInput.value = instructor;
            
            // Clear previous room suggestions
            if (roomSuggestionsContainer) {
                roomSuggestionsContainer.innerHTML = '';
                roomSuggestionsContainer.style.display = 'none';
            }
            
            // Show modal
            reservationModal.style.display = 'block';
        });
    });
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            reservationModal.style.display = 'none';
        });
    }
    
    // Cancel reservation button in modal
    if (cancelReservationBtn) {
        cancelReservationBtn.addEventListener('click', function() {
            reservationModal.style.display = 'none';
        });
    }
    
    // Handle time and day selection to show available rooms
    const timeStartInput = document.getElementById('preferred-time-start');
    const durationSelect = document.getElementById('class-duration');
    const timeSlotDisplay = document.getElementById('time-slot-display');
    const dayCheckboxes = document.querySelectorAll('input[name="days"]');
    
    // Function to calculate end time based on start time and duration
    function calculateEndTime(startTime, durationHours) {
        const [hours, minutes] = startTime.split(':').map(Number);
        
        // Calculate total minutes
        let totalMinutes = hours * 60 + minutes;
        
        // Add duration in minutes
        totalMinutes += durationHours * 60;
        
        // Calculate new hours and minutes
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
        
        // Format as HH:MM
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
    
    // Function to update the time slot display
    function updateTimeSlotDisplay() {
        const startTime = timeStartInput.value;
        const duration = parseFloat(durationSelect.value);
        
        if (startTime) {
            const endTime = calculateEndTime(startTime, duration);
            
            // Format for display
            const formatTime = (timeString) => {
                const [hours, minutes] = timeString.split(':');
                const hour = parseInt(hours);
                const period = hour >= 12 ? 'PM' : 'AM';
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                return `${formattedHour}:${minutes} ${period}`;
            };
            
            const formattedStartTime = formatTime(startTime);
            const formattedEndTime = formatTime(endTime);
            
            timeSlotDisplay.textContent = `${formattedStartTime} - ${formattedEndTime}`;
            
            // Trigger room suggestions update
            updateRoomSuggestions();
        }
    }
    
    // Function to update room suggestions
    function updateRoomSuggestions() {
        const selectedDays = [];
        document.querySelectorAll('input[name="days"]:checked').forEach(checkbox => {
            // Capitalize first letter for day format
            selectedDays.push(checkbox.value.charAt(0).toUpperCase() + checkbox.value.slice(1));
        });
        
        const startTime = timeStartInput.value;
        const duration = parseFloat(durationSelect.value);
        const endTime = calculateEndTime(startTime, duration);
        
        // Only proceed if we have days and time selected
        if (selectedDays.length > 0 && startTime) {
            // Format times for display
            const formatTime = (timeString) => {
                const [hours, minutes] = timeString.split(':');
                const hour = parseInt(hours);
                const period = hour >= 12 ? 'PM' : 'AM';
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                return `${formattedHour}:${minutes} ${period}`;
            };
            
            const formattedStartTime = formatTime(startTime);
            const formattedEndTime = formatTime(endTime);
            
            // Get available rooms
            const availableRooms = getAvailableRooms(selectedDays, formattedStartTime, formattedEndTime);
            
            // Update room suggestions in the UI
            if (roomSuggestionsContainer) {
                roomSuggestionsContainer.innerHTML = '';
                
                if (availableRooms.length > 0) {
                    // Show the suggestions container
                    roomSuggestionsContainer.style.display = 'block';
                    
                    // Create header
                    const header = document.createElement('h4');
                    header.textContent = 'Available Rooms:';
                    roomSuggestionsContainer.appendChild(header);
                    
                    // Create room suggestions
                    const roomsList = document.createElement('div');
                    roomsList.className = 'rooms-list';
                    
                    // Group rooms by building
                    const roomsByBuilding = {};
                    availableRooms.forEach(room => {
                        if (!roomsByBuilding[room.building]) {
                            roomsByBuilding[room.building] = [];
                        }
                        roomsByBuilding[room.building].push(room);
                    });
                    
                    // Create room suggestions by building
                    for (const building in roomsByBuilding) {
                        const buildingName = building === 'CCS' ? 'CCS Building' : 'Old Building';
                        const buildingSection = document.createElement('div');
                        buildingSection.className = 'building-section';
                        
                        const buildingHeader = document.createElement('h5');
                        buildingHeader.textContent = buildingName;
                        buildingSection.appendChild(buildingHeader);
                        
                        const roomsGrid = document.createElement('div');
                        roomsGrid.className = 'rooms-grid';
                        
                        roomsByBuilding[building].forEach(room => {
                            const roomItem = document.createElement('div');
                            roomItem.className = 'room-suggestion';
                            roomItem.setAttribute('data-room-id', room.id);
                            
                            roomItem.innerHTML = `
                                <div class="room-name">${room.name}</div>
                                <div class="room-details">
                                    <span><i class="fas fa-users"></i> ${room.capacity}</span>
                                    <span><i class="fas fa-building"></i> Floor ${room.floor}</span>
                                </div>
                                <button class="btn-select-room" data-room-id="${room.id}">Select</button>
                            `;
                            
                            roomsGrid.appendChild(roomItem);
                        });
                        
                        buildingSection.appendChild(roomsGrid);
                        roomsList.appendChild(buildingSection);
                    }
                    
                    roomSuggestionsContainer.appendChild(roomsList);
                    
                    // Add event listeners to select room buttons
                    document.querySelectorAll('.btn-select-room').forEach(button => {
                        button.addEventListener('click', function() {
                            const roomId = this.getAttribute('data-room-id');
                            const room = getRoomById(roomId);
                            
                            // Update the preferred room select
                            if (preferredRoomSelect) {
                                // Check if the option already exists
                                let optionExists = false;
                                for (let i = 0; i < preferredRoomSelect.options.length; i++) {
                                    if (preferredRoomSelect.options[i].value === room.id) {
                                        preferredRoomSelect.selectedIndex = i;
                                        optionExists = true;
                                        break;
                                    }
                                }
                                
                                // If the option doesn't exist, add it
                                if (!optionExists) {
                                    const option = document.createElement('option');
                                    option.value = room.id;
                                    option.textContent = `${room.name} (${room.building === 'CCS' ? 'CCS Building' : 'Old Building'}, Floor ${room.floor})`;
                                    preferredRoomSelect.appendChild(option);
                                    preferredRoomSelect.value = room.id;
                                }
                            }
                            
                            // Highlight the selected room
                            document.querySelectorAll('.room-suggestion').forEach(item => {
                                item.classList.remove('selected');
                            });
                            this.closest('.room-suggestion').classList.add('selected');
                        });
                    });
                } else {
                    // No available rooms
                    roomSuggestionsContainer.style.display = 'block';
                    roomSuggestionsContainer.innerHTML = '<p class="no-rooms">No available rooms for the selected days and time. Please try different days or time slots.</p>';
                }
            }
            
            // Update the room select options
            if (preferredRoomSelect) {
                // Clear existing options except the first one
                while (preferredRoomSelect.options.length > 1) {
                    preferredRoomSelect.remove(1);
                }
                
                // Add available rooms as options
                availableRooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.id;
                    option.textContent = `${room.name} (${room.building === 'CCS' ? 'CCS Building' : 'Old Building'}, Floor ${room.floor})`;
                    preferredRoomSelect.appendChild(option);
                });
            }
        }
    }
    
    // Add event listeners to update time slot display and room suggestions
    if (timeStartInput) {
        timeStartInput.addEventListener('change', updateTimeSlotDisplay);
    }
    
    if (durationSelect) {
        durationSelect.addEventListener('change', updateTimeSlotDisplay);
    }
    
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateRoomSuggestions);
    });
    
    // Initialize time slot display
    updateTimeSlotDisplay();
    
    // Submit reservation button in modal
    if (submitReservationBtn) {
        submitReservationBtn.addEventListener('click', function() {
            // Get form values
            const courseCode = courseCodeInput.value;
            const courseTitle = courseTitleInput.value;
            const instructor = courseInstructorInput.value;
            
            // Get selected days
            const selectedDays = [];
            document.querySelectorAll('input[name="days"]:checked').forEach(checkbox => {
                selectedDays.push(checkbox.value);
            });
            
            // Get time range
            const startTime = document.getElementById('preferred-time-start').value;
            const duration = parseFloat(document.getElementById('class-duration').value);
            const endTime = calculateEndTime(startTime, duration);
            
            // Get preferred room
            const preferredRoomId = document.getElementById('preferred-room').value;
            let preferredRoomName = 'To be assigned';
            
            if (preferredRoomId) {
                const room = getRoomById(preferredRoomId);
                if (room) {
                    preferredRoomName = room.name;
                }
            }
            
            // Get reason
            const reason = document.getElementById('reason').value;
            
            // Validate form
            if (selectedDays.length === 0) {
                alert('Please select at least one preferred day.');
                return;
            }
            
            if (!startTime) {
                alert('Please specify your preferred start time.');
                return;
            }
            
            if (!reason) {
                alert('Please provide a reason for your reservation request.');
                return;
            }
            
            // In a real app, this would send the reservation request to the server
            // For this demo, we'll just add a new reservation to the UI
            addReservation(courseCode, courseTitle, instructor, selectedDays, startTime, endTime, preferredRoomName, reason);
            
            // Close modal
            reservationModal.style.display = 'none';
            
            // Show success message
            alert(`Your reservation request for ${courseCode} has been submitted successfully.`);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === reservationModal) {
            reservationModal.style.display = 'none';
        }
    });
    
    // Function to add a new reservation to the UI
    function addReservation(courseCode, courseTitle, instructor, days, startTime, endTime, room, reason) {
        // Create reservation item
        const reservationItem = document.createElement('div');
        reservationItem.className = 'reservation-item pending';
        
        // Format days (e.g., ["monday", "wednesday", "friday"] -> "MWF")
        const formattedDays = days.map(day => day.charAt(0).toUpperCase()).join('');
        
        // Format time (e.g., "08:00" -> "8:00 AM")
        const formatTime = (timeString) => {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${formattedHour}:${minutes} ${period}`;
        };
        
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        const formattedTimeRange = `${formattedDays} ${formattedStartTime} - ${formattedEndTime}`;
        
        // Format today's date
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        
        // Create HTML for reservation item
        reservationItem.innerHTML = `
            <div class="reservation-info">
                <h3>${courseCode} - ${courseTitle}</h3>
                <div class="reservation-details">
                    <p><i class="fas fa-user"></i> ${instructor}</p>
                    <p><i class="fas fa-clock"></i> ${formattedTimeRange}</p>
                    <p><i class="fas fa-door-open"></i> Room ${room}</p>
                    <p><i class="fas fa-calendar-alt"></i> Requested on ${formattedDate}</p>
                </div>
            </div>
            <div class="reservation-status">
                <span class="status-badge pending">Pending</span>
                <button class="btn-cancel"><i class="fas fa-times"></i> Cancel</button>
            </div>
        `;
        
        // Add event listener to cancel button
        const cancelBtn = reservationItem.querySelector('.btn-cancel');
        cancelBtn.addEventListener('click', function() {
            if (confirm(`Are you sure you want to cancel your reservation for ${courseCode} - ${courseTitle}?`)) {
                reservationItem.remove();
                alert(`Your reservation for ${courseCode} has been cancelled.`);
            }
        });
        
        // Add to reservation list
        const reservationList = document.querySelector('.reservation-list');
        reservationList.prepend(reservationItem);
    }
});
