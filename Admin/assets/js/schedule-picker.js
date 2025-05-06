/**
 * Schedule Picker for Course Management
 * Allows selecting multiple sessions per week and viewing teacher availability
 */

class SchedulePicker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }

        // Default options
        this.options = {
            startHour: 7, // 7 AM
            endHour: 19.5, // 7:30 PM
            interval: 0.5, // 30 minutes
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            timeFormat: '12h', // '12h' or '24h'
            ...options
        };

        this.selectedSlots = [];
        this.teacherSchedule = null;
        this.courseSchedule = [];
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        // Create the main structure
        this.container.innerHTML = `
            <div class="schedule-actions">
                <button class="view-teacher-schedule" id="view-teacher-schedule">
                    <i class="fas fa-user-clock"></i> View Teacher's Schedule
                </button>
            </div>
            
            <div class="schedule-legend">
                <div class="legend-item">
                    <div class="legend-color available"></div>
                    <span>Available</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color unavailable"></div>
                    <span>Unavailable</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color occupied"></div>
                    <span>Occupied</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color selected"></div>
                    <span>Selected</span>
                </div>
            </div>
            
            <div class="schedule-picker">
                <div class="schedule-picker-header">
                    <div class="time-column">Time</div>
                    ${this.options.days.map(day => `<div class="day-column">${day}</div>`).join('')}
                </div>
                <div class="schedule-picker-body">
                    <div class="schedule-picker-times">
                        ${this.generateTimeSlots()}
                    </div>
                    <div class="schedule-picker-grid">
                        ${this.options.days.map(day => `
                            <div class="schedule-picker-day" data-day="${day}">
                                ${this.generateDaySlots(day)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="session-modal" id="session-modal">
                <div class="session-modal-content">
                    <div class="session-modal-header">
                        <h3>Add Session</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="session-modal-body">
                        <div class="session-info">
                            <p><strong>Day:</strong> <span id="session-day"></span></p>
                            <p><strong>Time:</strong> <span id="session-time"></span></p>
                        </div>
                        <div class="duration-control">
                            <label>Duration (hours):</label>
                            <div class="duration-buttons">
                                <button id="decrease-duration"><i class="fas fa-minus"></i></button>
                                <span id="duration-value">1</span>
                                <button id="increase-duration"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="session-modal-footer">
                        <button class="btn-secondary" id="cancel-session">Cancel</button>
                        <button class="btn-primary" id="add-session">Add Session</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateTimeSlots() {
        let slots = '';
        for (let hour = this.options.startHour; hour <= this.options.endHour; hour += this.options.interval) {
            slots += `<div class="time-slot">${this.formatTime(hour)}</div>`;
        }
        return slots;
    }

    generateDaySlots(day) {
        let slots = '';
        for (let hour = this.options.startHour; hour <= this.options.endHour; hour += this.options.interval) {
            slots += `
                <div class="time-slot" 
                     data-day="${day}" 
                     data-hour="${hour}" 
                     data-time="${this.formatTime(hour)}"
                     data-available="true">
                </div>
            `;
        }
        return slots;
    }

    formatTime(hour) {
        const isHalfHour = hour % 1 !== 0;
        const hourValue = Math.floor(hour);
        const minutes = isHalfHour ? '30' : '00';
        
        if (this.options.timeFormat === '24h') {
            return `${hourValue}:${minutes}`;
        } else {
            const period = hourValue >= 12 ? 'PM' : 'AM';
            const displayHour = hourValue > 12 ? hourValue - 12 : (hourValue === 0 ? 12 : hourValue);
            return `${displayHour}:${minutes} ${period}`;
        }
    }

    attachEventListeners() {
        // Time slot click event
        const timeSlots = this.container.querySelectorAll('.schedule-picker-day .time-slot');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', (e) => this.handleTimeSlotClick(e));
        });

        // View teacher schedule button
        const viewTeacherBtn = this.container.querySelector('#view-teacher-schedule');
        if (viewTeacherBtn) {
            viewTeacherBtn.addEventListener('click', () => this.loadTeacherSchedule());
        }

        // Attach modal event listeners
        this.attachModalEventListeners();
        
        // Add global click handler for the session modal
        const sessionModal = this.container.querySelector('#session-modal');
        if (sessionModal) {
            sessionModal.addEventListener('click', (event) => {
                // Only close if clicking directly on the modal background
                if (event.target === sessionModal) {
                    this.closeSessionModal();
                }
            });
        }
    }

    handleTimeSlotClick(event) {
        const slot = event.currentTarget;
        const isAvailable = slot.getAttribute('data-available') === 'true';
        const isUnavailable = slot.classList.contains('unavailable');
        const isOccupied = slot.classList.contains('occupied');

        if (isUnavailable || isOccupied) {
            return; // Can't select unavailable or occupied slots
        }

        // Show the session modal
        this.currentSlot = {
            element: slot,
            day: slot.getAttribute('data-day'),
            hour: parseFloat(slot.getAttribute('data-hour')),
            time: slot.getAttribute('data-time')
        };

        this.showSessionModal();
    }

    showSessionModal() {
        const modal = this.container.querySelector('#session-modal');
        const daySpan = this.container.querySelector('#session-day');
        const timeSpan = this.container.querySelector('#session-time');
        const durationValue = this.container.querySelector('#duration-value');

        if (modal && daySpan && timeSpan && durationValue) {
            daySpan.textContent = this.currentSlot.day;
            timeSpan.textContent = this.currentSlot.time;
            durationValue.textContent = '1.5'; // Reset to 1.5 hours
            this.currentDuration = 1.5;
            modal.style.display = 'flex';
            
            // Add one-time event listener to handle modal background click
            const handleModalClick = (event) => {
                // Only close if clicking directly on the modal background (not on content)
                if (event.target === modal) {
                    this.closeSessionModal();
                }
                // Remove this event listener after modal is closed
                modal.removeEventListener('click', handleModalClick);
            };
            
            // Add the event listener
            modal.addEventListener('click', handleModalClick);
        }
    }

    closeSessionModal() {
        const modal = this.container.querySelector('#session-modal');
        if (modal) {
            // Remove any existing event listeners to prevent memory leaks
            const newModal = modal.cloneNode(true);
            modal.parentNode.replaceChild(newModal, modal);
            newModal.style.display = 'none';
            
            // Re-attach event listeners to the modal content elements
            this.attachModalEventListeners();
        }
    }
    
    attachModalEventListeners() {
        // This method re-attaches event listeners after the modal is closed and reopened
        const modalContent = this.container.querySelector('.session-modal-content');
        const closeModal = this.container.querySelector('.close-modal');
        const cancelBtn = this.container.querySelector('#cancel-session');
        const addBtn = this.container.querySelector('#add-session');
        const increaseBtn = this.container.querySelector('#increase-duration');
        const decreaseBtn = this.container.querySelector('#decrease-duration');
        
        // Prevent clicks on modal content from closing the modal
        if (modalContent) {
            modalContent.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', (event) => {
                event.preventDefault();
                this.closeSessionModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.closeSessionModal();
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.addSession();
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', (event) => this.changeDuration(1, event));
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', (event) => this.changeDuration(-1, event));
        }
    }

    changeDuration(change, event) {
        // Prevent default action and stop propagation
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const durationValue = this.container.querySelector('#duration-value');
        if (durationValue) {
            let currentDuration = parseFloat(durationValue.textContent);
            let newDuration;
            
            // Only allow specific durations: 1.5, 2, or 3 hours
            if (currentDuration === 1.5 && change > 0) {
                newDuration = 2;
            } else if (currentDuration === 1.5 && change < 0) {
                newDuration = 1.5; // Keep at minimum
            } else if (currentDuration === 2 && change > 0) {
                newDuration = 3;
            } else if (currentDuration === 2 && change < 0) {
                newDuration = 1.5;
            } else if (currentDuration === 3 && change > 0) {
                newDuration = 3; // Keep at maximum
            } else if (currentDuration === 3 && change < 0) {
                newDuration = 2;
            } else {
                // Default starting value
                newDuration = 1.5;
            }
            
            // Check if slots are available for this duration
            const canExtend = this.checkDurationAvailability(newDuration);
            
            if (canExtend) {
                durationValue.textContent = newDuration;
                this.currentDuration = newDuration;
            } else {
                // Show a message that the duration can't be extended
                alert('Cannot extend duration. Some time slots are unavailable or already occupied.');
            }
        }
        
        return false;
    }

    checkDurationAvailability(duration) {
        const day = this.currentSlot.day;
        const startHour = this.currentSlot.hour;
        const endHour = startHour + duration;
        
        // Check if end hour exceeds the schedule
        if (endHour > this.options.endHour) {
            return false;
        }
        
        // Check each hour in the duration
        for (let hour = startHour + this.options.interval; hour < endHour; hour += this.options.interval) {
            const slot = this.container.querySelector(`.time-slot[data-day="${day}"][data-hour="${hour}"]`);
            if (!slot || 
                slot.classList.contains('unavailable') || 
                slot.classList.contains('occupied')) {
                return false;
            }
        }
        
        return true;
    }

    addSession() {
        if (!this.currentSlot) return;
        
        const { day, hour, time } = this.currentSlot;
        const duration = this.currentDuration;
        
        // Add to selected slots
        this.selectedSlots.push({
            day,
            startHour: hour,
            endHour: hour + duration,
            startTime: time,
            endTime: this.formatTime(hour + duration),
            duration
        });
        
        // Update UI to show selected slots
        this.updateSelectedSlots();
        
        // Explicitly close the modal with a slight delay to ensure all processing is complete
        setTimeout(() => {
            this.closeSessionModal();
        }, 50);
        
        // Trigger change event
        this.triggerChangeEvent();
        
        return false; // Prevent default action
    }

    updateSelectedSlots() {
        // First, remove all selected classes
        const allSlots = this.container.querySelectorAll('.time-slot');
        allSlots.forEach(slot => {
            slot.classList.remove('selected');
            
            // Remove any existing session info
            const existingInfo = slot.querySelector('.schedule-slot-info');
            if (existingInfo) {
                slot.removeChild(existingInfo);
            }
        });
        
        // Then, add selected class to all selected slots
        this.selectedSlots.forEach(session => {
            for (let h = session.startHour; h < session.endHour; h += this.options.interval) {
                const slot = this.container.querySelector(`.time-slot[data-day="${session.day}"][data-hour="${h}"]`);
                if (slot) {
                    slot.classList.add('selected');
                    
                    // Add session info to the first slot of each session
                    if (h === session.startHour) {
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'schedule-slot-info';
                        infoDiv.innerHTML = `
                            <div class="duration">${session.duration} hr${session.duration > 1 ? 's' : ''}</div>
                            <div class="time-range">${session.startTime} - ${session.endTime}</div>
                        `;
                        slot.appendChild(infoDiv);
                    }
                }
            }
        });
    }

    loadTeacherSchedule() {
        // In a real application, this would make an API call to get the teacher's schedule
        // For demonstration, we'll simulate a teacher schedule
        
        // Clear any existing teacher schedule data
        const allSlots = this.container.querySelectorAll('.time-slot');
        allSlots.forEach(slot => {
            slot.classList.remove('unavailable', 'occupied');
            
            // Remove any existing teacher info
            const existingInfo = slot.querySelector('.schedule-slot-info');
            if (existingInfo && !slot.classList.contains('selected')) {
                slot.removeChild(existingInfo);
            }
        });
        
        // Simulate teacher unavailability (random slots)
        const unavailableTimes = [
            { day: 'Monday', startHour: 9, endHour: 12 },
            { day: 'Monday', startHour: 15, endHour: 17 },
            { day: 'Tuesday', startHour: 13, endHour: 15 },
            { day: 'Wednesday', startHour: 8, endHour: 10 },
            { day: 'Thursday', startHour: 16, endHour: 19 },
            { day: 'Friday', startHour: 12, endHour: 14 }
        ];
        
        // Simulate occupied slots (other courses)
        const occupiedTimes = [
            { day: 'Monday', startHour: 13, endHour: 15, course: 'CS 101', instructor: 'Prof. Smith' },
            { day: 'Tuesday', startHour: 9, endHour: 11, course: 'MATH 201', instructor: 'Prof. Johnson' },
            { day: 'Wednesday', startHour: 14, endHour: 16, course: 'ENG 101', instructor: 'Prof. Williams' },
            { day: 'Friday', startHour: 10, endHour: 12, course: 'PHYS 101', instructor: 'Prof. Brown' }
        ];
        
        // Mark unavailable times
        unavailableTimes.forEach(time => {
            for (let h = time.startHour; h < time.endHour; h += this.options.interval) {
                const slot = this.container.querySelector(`.time-slot[data-day="${time.day}"][data-hour="${h}"]`);
                if (slot) {
                    slot.classList.add('unavailable');
                    slot.setAttribute('data-available', 'false');
                    
                    // Add unavailable info to the first slot
                    if (h === time.startHour) {
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'schedule-slot-info';
                        infoDiv.innerHTML = `
                            <div>Unavailable</div>
                            <div class="time-range">${this.formatTime(h)} - ${this.formatTime(time.endHour)}</div>
                        `;
                        slot.appendChild(infoDiv);
                    }
                }
            }
        });
        
        // Mark occupied times
        occupiedTimes.forEach(time => {
            for (let h = time.startHour; h < time.endHour; h += this.options.interval) {
                const slot = this.container.querySelector(`.time-slot[data-day="${time.day}"][data-hour="${h}"]`);
                if (slot) {
                    slot.classList.add('occupied');
                    slot.setAttribute('data-available', 'false');
                    
                    // Add course info to the first slot
                    if (h === time.startHour) {
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'schedule-slot-info';
                        infoDiv.innerHTML = `
                            <div class="course-code">${time.course}</div>
                            <div class="instructor">${time.instructor}</div>
                            <div class="time-range">${this.formatTime(h)} - ${this.formatTime(time.endHour)}</div>
                        `;
                        slot.appendChild(infoDiv);
                    }
                }
            }
        });
    }

    getSelectedSchedule() {
        return this.selectedSlots;
    }

    setSelectedSchedule(schedule) {
        this.selectedSlots = schedule;
        this.updateSelectedSlots();
    }

    clearSelection() {
        this.selectedSlots = [];
        this.updateSelectedSlots();
        this.triggerChangeEvent();
    }

    triggerChangeEvent() {
        const event = new CustomEvent('schedule-change', {
            detail: {
                schedule: this.selectedSlots
            }
        });
        this.container.dispatchEvent(event);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the course edit/add page
    const scheduleContainer = document.getElementById('schedule-picker-container');
    if (scheduleContainer) {
        const picker = new SchedulePicker('schedule-picker-container');
        
        // Listen for schedule changes
        scheduleContainer.addEventListener('schedule-change', function(e) {
            console.log('Schedule updated:', e.detail.schedule);
            
            // Update the schedule summary in the form
            updateScheduleSummary(e.detail.schedule);
        });
    }
});

// Function to update the schedule summary in the form
function updateScheduleSummary(schedule) {
    const summaryContainer = document.getElementById('schedule-summary');
    if (!summaryContainer) return;
    
    if (schedule.length === 0) {
        summaryContainer.innerHTML = '<p>No sessions scheduled yet.</p>';
        return;
    }
    
    let html = '<ul class="schedule-summary-list">';
    schedule.forEach(session => {
        html += `
            <li>
                <strong>${session.day}:</strong> ${session.startTime} - ${session.endTime} 
                (${session.duration} hour${session.duration > 1 ? 's' : ''})
                <button class="btn-remove-session" data-day="${session.day}" data-hour="${session.startHour}">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `;
    });
    html += '</ul>';
    
    summaryContainer.innerHTML = html;
    
    // Add event listeners to remove buttons
    const removeButtons = summaryContainer.querySelectorAll('.btn-remove-session');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const hour = parseFloat(this.getAttribute('data-hour'));
            removeSession(day, hour);
        });
    });
}

// Function to remove a session
function removeSession(day, startHour) {
    const scheduleContainer = document.getElementById('schedule-picker-container');
    if (!scheduleContainer) return;
    
    const picker = scheduleContainer._schedulePicker;
    if (!picker) return;
    
    // Find and remove the session
    const index = picker.selectedSlots.findIndex(session => 
        session.day === day && session.startHour === startHour
    );
    
    if (index !== -1) {
        picker.selectedSlots.splice(index, 1);
        picker.updateSelectedSlots();
        picker.triggerChangeEvent();
    }
}
