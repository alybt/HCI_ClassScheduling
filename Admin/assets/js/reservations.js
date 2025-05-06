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

    // Calendar functionality
    const calendarDates = document.querySelector('.calendar-dates');
    const prevMonthBtn = document.querySelector('.btn-prev-month');
    const nextMonthBtn = document.querySelector('.btn-next-month');
    const monthTitle = document.querySelector('.calendar-header h3');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    if (calendarDates && prevMonthBtn && nextMonthBtn && monthTitle) {
        // Initialize calendar
        generateCalendar(currentMonth, currentYear);

        // Previous month button
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        // Next month button
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    // Generate calendar for given month and year
    function generateCalendar(month, year) {
        if (!calendarDates || !monthTitle) return;

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Update month title
        monthTitle.textContent = `${months[month]} ${year}`;
        
        // Clear previous calendar
        calendarDates.innerHTML = '';
        
        // Get first day of month and number of days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date empty';
            calendarDates.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            
            // Check if this is today's date
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dateCell.classList.add('today');
            }
            
            // Create date number
            const dateNumber = document.createElement('div');
            dateNumber.className = 'date-number';
            dateNumber.textContent = i;
            dateCell.appendChild(dateNumber);
            
            // Add some sample events (in a real app, these would come from a database)
            if (i === 6 && month === 4) { // May 6
                addEventIndicator(dateCell, 'CC 100', 'LR 2', '3:00 PM - 5:00 PM');
                addEventIndicator(dateCell, 'CC 101', 'Lab 2', '12:00 PM - 3:00 PM');
            } else if (i === 10 && month === 4) { // May 10
                addEventIndicator(dateCell, 'CS 201', 'LR 1', '10:00 AM - 1:00 PM');
            } else if (i === 15 && month === 4) { // May 15
                addEventIndicator(dateCell, 'Programming Competition', 'Auditorium', '9:00 AM - 5:00 PM');
            }
            
            // Add click event to show daily schedule
            dateCell.addEventListener('click', function() {
                const selectedDate = new Date(year, month, i);
                updateDailySchedule(selectedDate);
                
                // Remove selected class from all dates
                document.querySelectorAll('.calendar-date').forEach(date => {
                    date.classList.remove('selected');
                });
                
                // Add selected class to clicked date
                this.classList.add('selected');
            });
            
            calendarDates.appendChild(dateCell);
        }
    }

    // Add event indicator to calendar date cell
    function addEventIndicator(dateCell, title, room, time) {
        const eventIndicator = document.createElement('div');
        eventIndicator.className = 'event-indicator';
        eventIndicator.innerHTML = `<span class="event-title">${title}</span><span class="event-details">${room}, ${time}</span>`;
        dateCell.appendChild(eventIndicator);
    }

    // Update daily schedule for selected date
    function updateDailySchedule(date) {
        const dailyScheduleTitle = document.querySelector('.daily-schedule h3');
        if (!dailyScheduleTitle) return;
        
        // Format date for display
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dailyScheduleTitle.textContent = `Schedule for ${date.toLocaleDateString('en-US', options)}`;
        
        // In a real app, you would fetch the schedule data for this date from the server
        // For demo purposes, we're just showing the same schedule
    }

    // Reservation Modal
    const createReservationBtn = document.querySelector('.tab-actions .btn-primary');
    const reservationModal = document.getElementById('reservation-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelReservationBtn = document.getElementById('cancel-reservation');
    const saveReservationBtn = document.getElementById('save-reservation');
    const reservationRecurring = document.getElementById('reservation-recurring');
    const recurringEndGroup = document.getElementById('recurring-end-group');

    if (createReservationBtn && reservationModal) {
        createReservationBtn.addEventListener('click', function() {
            // Reset the form
            document.getElementById('reservation-form').reset();
            
            // Update modal title
            document.querySelector('#reservation-modal .modal-header h2').textContent = 'Create Reservation';
            
            // Show the modal
            reservationModal.style.display = 'flex';
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

    if (cancelReservationBtn) {
        cancelReservationBtn.addEventListener('click', function() {
            reservationModal.style.display = 'none';
        });
    }

    if (saveReservationBtn) {
        saveReservationBtn.addEventListener('click', function() {
            // Get form values
            const type = document.getElementById('reservation-type').value;
            const course = document.getElementById('reservation-course').value;
            const teacher = document.getElementById('reservation-teacher').value;
            const room = document.getElementById('reservation-room').value;
            const date = document.getElementById('reservation-date').value;
            const startTime = document.getElementById('reservation-start-time').value;
            const endTime = document.getElementById('reservation-end-time').value;
            const reason = document.getElementById('reservation-reason').value;
            
            // Validate form
            if (!type || !room || !date || !startTime || !endTime) {
                alert('Please fill in all required fields');
                return;
            }

            // Here you would typically send the data to the server
            console.log('Saving reservation:', { type, course, teacher, room, date, startTime, endTime, reason });
            
            // For demo purposes, add the reservation to the list
            addReservationToList(type, course, teacher, room, date, startTime, endTime, reason);
            
            // Close the modal
            reservationModal.style.display = 'none';
        });
    }

    if (reservationRecurring) {
        reservationRecurring.addEventListener('change', function() {
            if (this.value !== 'no' && recurringEndGroup) {
                recurringEndGroup.style.display = 'block';
            } else if (recurringEndGroup) {
                recurringEndGroup.style.display = 'none';
            }
        });
    }

    // Function to add a new reservation to the list
    function addReservationToList(type, course, teacher, room, date, startTime, endTime, reason) {
        const reservationList = document.querySelector('.reservation-list');
        if (!reservationList) return;

        // Format date
        const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        // Get course and teacher text
        const courseSelect = document.getElementById('reservation-course');
        const teacherSelect = document.getElementById('reservation-teacher');
        const roomSelect = document.getElementById('reservation-room');
        
        const courseText = courseSelect.options[courseSelect.selectedIndex].text;
        const teacherText = teacherSelect.options[teacherSelect.selectedIndex].text;
        const roomText = roomSelect.options[roomSelect.selectedIndex].text;

        const reservationItem = document.createElement('div');
        reservationItem.className = 'reservation-item';
        reservationItem.innerHTML = `
            <div class="reservation-info">
                <div class="reservation-header">
                    <h3>${type === 'class' ? 'Room Reservation Request' : type === 'event' ? 'Special Event Request' : 'Meeting Request'}</h3>
                    <span class="reservation-date">Requested: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div class="reservation-details">
                    ${course ? `<p><strong>Course:</strong> ${courseText}</p>` : ''}
                    ${teacher ? `<p><strong>Teacher:</strong> ${teacherText}</p>` : ''}
                    <p><strong>Room:</strong> ${roomText}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                </div>
            </div>
            <div class="reservation-actions">
                <button class="btn-approve"><i class="fas fa-check"></i> Approve</button>
                <button class="btn-reject"><i class="fas fa-times"></i> Reject</button>
                <button class="btn-reschedule"><i class="fas fa-calendar-alt"></i> Reschedule</button>
            </div>
        `;

        // Add event listeners to the new buttons
        const approveBtn = reservationItem.querySelector('.btn-approve');
        const rejectBtn = reservationItem.querySelector('.btn-reject');
        const rescheduleBtn = reservationItem.querySelector('.btn-reschedule');

        if (approveBtn) {
            approveBtn.addEventListener('click', function() {
                // Approve functionality
                alert(`Reservation for ${roomText} on ${formattedDate} has been approved.`);
                reservationItem.remove();
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                // Reject functionality
                alert(`Reservation for ${roomText} on ${formattedDate} has been rejected.`);
                reservationItem.remove();
            });
        }

        if (rescheduleBtn) {
            rescheduleBtn.addEventListener('click', function() {
                // Reschedule functionality
                alert(`Please create a new reservation with the rescheduled date and time.`);
            });
        }

        // Add the new reservation to the top of the list
        reservationList.insertBefore(reservationItem, reservationList.firstChild);
    }

    // Action buttons in the pending requests tab
    const actionButtons = document.querySelectorAll('.reservation-actions button');
    
    if (actionButtons) {
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.className.split(' ')[0].replace('btn-', '');
                const reservationItem = this.closest('.reservation-item');
                const roomElement = reservationItem.querySelector('p:nth-child(3)');
                const dateElement = reservationItem.querySelector('p:nth-child(4)');
                
                if (roomElement && dateElement) {
                    const room = roomElement.textContent.replace('Room:', '').trim();
                    const date = dateElement.textContent.replace('Date:', '').trim();
                    
                    // For demo purposes, just log the action
                    console.log(`${action} action for reservation in ${room} on ${date}`);
                    
                    if (action === 'approve') {
                        alert(`Reservation for ${room} on ${date} has been approved.`);
                        reservationItem.remove();
                    } else if (action === 'reject') {
                        alert(`Reservation for ${room} on ${date} has been rejected.`);
                        reservationItem.remove();
                    } else if (action === 'suggest') {
                        alert(`Please create a new reservation with suggested alternative date and time.`);
                    }
                }
            });
        });
    }

    // Rescheduled tab action buttons
    const rescheduledButtons = document.querySelectorAll('.rescheduled-list button');
    
    if (rescheduledButtons) {
        rescheduledButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.className.split(' ')[0].replace('btn-', '');
                const row = this.closest('tr');
                const course = row.querySelector('td:first-child').textContent;
                
                // For demo purposes, just log the action
                console.log(`${action} action for ${course}`);
                
                if (action === 'approve') {
                    // Update the status badge to "Approved"
                    const statusBadge = row.querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.className = 'status-badge approved';
                        statusBadge.textContent = 'Approved';
                    }
                    alert(`Rescheduling for ${course} has been approved.`);
                } else if (action === 'reject') {
                    // Update the status badge to "Rejected"
                    const statusBadge = row.querySelector('.status-badge');
                    if (statusBadge) {
                        statusBadge.className = 'status-badge rejected';
                        statusBadge.textContent = 'Rejected';
                    }
                    alert(`Rescheduling for ${course} has been rejected.`);
                } else if (action === 'cancel') {
                    if (confirm(`Are you sure you want to cancel the rescheduling for ${course}?`)) {
                        row.remove();
                    }
                }
            });
        });
    }

    // Event tab action buttons
    const eventButtons = document.querySelectorAll('.event-actions button');
    
    if (eventButtons) {
        eventButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.className.split(' ')[0].replace('btn-', '');
                const eventItem = this.closest('.event-item');
                const eventTitle = eventItem.querySelector('h3').textContent;
                
                // For demo purposes, just log the action
                console.log(`${action} action for ${eventTitle}`);
                
                if (action === 'edit') {
                    alert(`Editing event: ${eventTitle}`);
                    // In a real app, you would open the edit modal with the event data
                } else if (action === 'delete') {
                    if (confirm(`Are you sure you want to delete the event "${eventTitle}"?`)) {
                        eventItem.remove();
                    }
                } else if (action === 'notify') {
                    alert(`Notification about "${eventTitle}" has been sent to all relevant users.`);
                }
            });
        });
    }

    // Occupied slots in the daily schedule
    const occupiedSlots = document.querySelectorAll('.slot.occupied');
    
    if (occupiedSlots) {
        occupiedSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                const course = this.getAttribute('data-course');
                const teacher = this.getAttribute('data-teacher');
                const time = this.getAttribute('data-time');
                
                if (course && teacher && time) {
                    alert(`${course}\nTeacher: ${teacher}\nTime: ${time}`);
                }
            });
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Add CSS for calendar date cells (since they're generated dynamically)
    const style = document.createElement('style');
    style.textContent = `
        .calendar-dates {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-auto-rows: minmax(100px, auto);
        }
        
        .calendar-date {
            border: 1px solid #eee;
            padding: 10px;
            min-height: 100px;
            position: relative;
        }
        
        .calendar-date.empty {
            background-color: #f9f9f9;
        }
        
        .calendar-date.today {
            background-color: #e3f2fd;
        }
        
        .calendar-date.selected {
            border: 2px solid #4a6cf7;
        }
        
        .date-number {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .event-indicator {
            background-color: #f5f5f5;
            border-left: 3px solid #4a6cf7;
            padding: 5px;
            margin-bottom: 5px;
            font-size: 12px;
        }
        
        .event-title {
            font-weight: 600;
            display: block;
        }
        
        .event-details {
            color: #666;
            font-size: 11px;
        }
    `;
    document.head.appendChild(style);
});
