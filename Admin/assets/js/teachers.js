document.addEventListener('DOMContentLoaded', function() {
    // Initialize action buttons
    initializeActionButtons();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize add teacher button
    document.getElementById('add-teacher-btn').addEventListener('click', function() {
        openAddTeacherModal();
    });
    
    // Initialize export button
    document.querySelector('.btn-export').addEventListener('click', function() {
        exportTeacherData();
    });
});

/**
 * Initialize all action buttons in the teacher table
 */
function initializeActionButtons() {
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.closest('tr').querySelector('td:first-child').textContent;
            viewTeacherDetails(teacherId);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.closest('tr').querySelector('td:first-child').textContent;
            editTeacherDetails(teacherId);
        });
    });
    
    // Schedule buttons
    const scheduleButtons = document.querySelectorAll('.btn-schedule');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const teacherId = this.closest('tr').querySelector('td:first-child').textContent;
            viewTeacherSchedule(teacherId);
        });
    });
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
    const departmentFilter = document.getElementById('department-filter');
    const statusFilter = document.getElementById('status-filter');
    
    // Add event listeners to filters
    departmentFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

/**
 * Apply filters to the teacher table
 */
function applyFilters() {
    const departmentValue = document.getElementById('department-filter').value;
    const statusValue = document.getElementById('status-filter').value;
    
    const rows = document.querySelectorAll('.teacher-table tbody tr');
    
    rows.forEach(row => {
        const department = row.querySelector('td:nth-child(3)').textContent;
        const status = row.querySelector('td:nth-child(6) .status-badge').textContent;
        
        const departmentMatch = departmentValue === 'all' || department.includes(getDepartmentName(departmentValue));
        const statusMatch = statusValue === 'all' || status.toLowerCase() === statusValue.toLowerCase();
        
        if (departmentMatch && statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Get department name from value
 */
function getDepartmentName(value) {
    const departments = {
        'cs': 'Computer Science',
        'it': 'Information Technology',
        'is': 'Information Systems',
        'math': 'Mathematics'
    };
    return departments[value] || '';
}

/**
 * View teacher details
 * @param {string} teacherId - The ID of the teacher to view
 */
function viewTeacherDetails(teacherId) {
    // Create modal for teacher details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Teacher Details</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading">Loading teacher details...</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Simulate loading teacher data
    setTimeout(() => {
        fetchTeacherDetails(teacherId, modal);
    }, 500);
}

/**
 * Fetch teacher details from server (simulated)
 * @param {string} teacherId - The ID of the teacher
 * @param {HTMLElement} modal - The modal element
 */
function fetchTeacherDetails(teacherId, modal) {
    // Find the teacher row
    const teacherRow = Array.from(document.querySelectorAll('tr')).find(row => 
        row.querySelector('td:first-child') && 
        row.querySelector('td:first-child').textContent === teacherId
    );
    
    if (!teacherRow) {
        modal.querySelector('.modal-body').innerHTML = '<p>Teacher not found</p>';
        return;
    }
    
    // Get teacher data from the row
    const name = teacherRow.querySelector('td:nth-child(2) strong').textContent;
    const position = teacherRow.querySelector('td:nth-child(2) span').textContent;
    const department = teacherRow.querySelector('td:nth-child(3)').textContent;
    const subjects = teacherRow.querySelectorAll('td:nth-child(4) .tag');
    const contact = teacherRow.querySelector('td:nth-child(5)').textContent;
    const status = teacherRow.querySelector('td:nth-child(6) .status-badge').textContent;
    
    // Create subjects HTML
    let subjectsHtml = '';
    subjects.forEach(subject => {
        subjectsHtml += `<span class="tag">${subject.textContent}</span>`;
    });
    
    // Update modal with teacher details
    modal.querySelector('.modal-body').innerHTML = `
        <div class="teacher-profile">
            <div class="teacher-avatar">
                <img src="assets/img/teacher1.png" alt="${name}">
            </div>
            <div class="teacher-info-details">
                <h3>${name}</h3>
                <p>${position}</p>
                <p class="teacher-id">${teacherId}</p>
            </div>
        </div>
        <div class="teacher-details">
            <div class="detail-row">
                <div class="detail-label">Department:</div>
                <div class="detail-value">${department}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Subjects:</div>
                <div class="detail-value subject-tags">${subjectsHtml}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Contact:</div>
                <div class="detail-value">${contact}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><span class="status-badge ${status.toLowerCase()}">${status}</span></div>
            </div>
        </div>
        <div class="teacher-action-buttons">
            <button class="send-message-btn" id="send-message-btn">Send Message</button>
            <button class="view-schedule-btn" id="view-schedule-btn">View Full Schedule</button>
            <button class="view-history-btn" id="view-history-btn">View Teaching History</button>
        </div>
    `;
    
    // Add event listeners to the buttons
    modal.querySelector('#send-message-btn').addEventListener('click', function() {
        openSendMessageModal(teacherId, name, contact);
    });
    
    modal.querySelector('#view-schedule-btn').addEventListener('click', function() {
        viewTeacherSchedule(teacherId);
        modal.remove();
    });
    
    modal.querySelector('#view-history-btn').addEventListener('click', function() {
        viewTeachingHistory(teacherId, name);
        modal.remove();
    });
}

/**
 * Edit teacher details
 * @param {string} teacherId - The ID of the teacher to edit
 */
function editTeacherDetails(teacherId) {
    // Create modal for editing teacher
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Teacher</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading">Loading teacher data...</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Simulate loading teacher data
    setTimeout(() => {
        fetchTeacherForEdit(teacherId, modal);
    }, 500);
}

/**
 * Fetch teacher data for editing (simulated)
 * @param {string} teacherId - The ID of the teacher
 * @param {HTMLElement} modal - The modal element
 */
function fetchTeacherForEdit(teacherId, modal) {
    // Find the teacher row
    const teacherRow = Array.from(document.querySelectorAll('tr')).find(row => 
        row.querySelector('td:first-child') && 
        row.querySelector('td:first-child').textContent === teacherId
    );
    
    if (!teacherRow) {
        modal.querySelector('.modal-body').innerHTML = '<p>Teacher not found</p>';
        return;
    }
    
    // Get teacher data from the row
    const name = teacherRow.querySelector('td:nth-child(2) strong').textContent;
    const position = teacherRow.querySelector('td:nth-child(2) span').textContent;
    const department = teacherRow.querySelector('td:nth-child(3)').textContent;
    const contact = teacherRow.querySelector('td:nth-child(5)').textContent;
    const status = teacherRow.querySelector('td:nth-child(6) .status-badge').textContent;
    
    // Update modal with edit form
    modal.querySelector('.modal-body').innerHTML = `
        <form id="edit-teacher-form">
            <div class="form-group">
                <label for="teacher-name">Full Name</label>
                <input type="text" id="teacher-name" value="${name}" required>
            </div>
            <div class="form-group">
                <label for="teacher-position">Position</label>
                <select id="teacher-position" required>
                    <option value="Full Professor" ${position === 'Full Professor' ? 'selected' : ''}>Full Professor</option>
                    <option value="Associate Professor" ${position === 'Associate Professor' ? 'selected' : ''}>Associate Professor</option>
                    <option value="Assistant Professor" ${position === 'Assistant Professor' ? 'selected' : ''}>Assistant Professor</option>
                    <option value="Instructor" ${position === 'Instructor' ? 'selected' : ''}>Instructor</option>
                </select>
            </div>
            <div class="form-group">
                <label for="teacher-department">Department</label>
                <select id="teacher-department" required>
                    <option value="Computer Science" ${department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                    <option value="Information Technology" ${department === 'Information Technology' ? 'selected' : ''}>Information Technology</option>
                    <option value="Information Systems" ${department === 'Information Systems' ? 'selected' : ''}>Information Systems</option>
                    <option value="Mathematics" ${department === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
                </select>
            </div>
            <div class="form-group">
                <label for="teacher-contact">Contact Email</label>
                <input type="email" id="teacher-contact" value="${contact}" required>
            </div>
            <div class="form-group">
                <label for="teacher-status">Status</label>
                <select id="teacher-status" required>
                    <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="On Leave" ${status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                    <option value="Inactive" ${status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Save Changes</button>
                <button type="button" class="btn-secondary cancel-btn">Cancel</button>
            </div>
        </form>
    `;
    
    // Add event listener to form submission
    modal.querySelector('#edit-teacher-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTeacherChanges(teacherId, modal);
    });
    
    // Add event listener to cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
        modal.remove();
    });
}

/**
 * Save teacher changes (simulated)
 * @param {string} teacherId - The ID of the teacher
 * @param {HTMLElement} modal - The modal element
 */
function saveTeacherChanges(teacherId, modal) {
    // Get form values
    const name = modal.querySelector('#teacher-name').value;
    const position = modal.querySelector('#teacher-position').value;
    const department = modal.querySelector('#teacher-department').value;
    const contact = modal.querySelector('#teacher-contact').value;
    const status = modal.querySelector('#teacher-status').value;
    
    // Find the teacher row
    const teacherRow = Array.from(document.querySelectorAll('tr')).find(row => 
        row.querySelector('td:first-child') && 
        row.querySelector('td:first-child').textContent === teacherId
    );
    
    if (!teacherRow) {
        return;
    }
    
    // Update teacher data in the row
    teacherRow.querySelector('td:nth-child(2) strong').textContent = name;
    teacherRow.querySelector('td:nth-child(2) span').textContent = position;
    teacherRow.querySelector('td:nth-child(3)').textContent = department;
    teacherRow.querySelector('td:nth-child(5)').textContent = contact;
    
    const statusBadge = teacherRow.querySelector('td:nth-child(6) .status-badge');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;
    
    // Show success message
    modal.querySelector('.modal-body').innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <p>Teacher information updated successfully!</p>
        </div>
    `;
    
    // Close modal after a delay
    setTimeout(() => {
        modal.remove();
    }, 1500);
}

/**
 * View teacher schedule
 * @param {string} teacherId - The ID of the teacher
 */
function viewTeacherSchedule(teacherId) {
    // Create modal for teacher schedule
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content schedule-modal">
            <div class="modal-header">
                <h2>Teacher Schedule</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading">Loading schedule...</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Simulate loading schedule data
    setTimeout(() => {
        fetchTeacherSchedule(teacherId, modal);
    }, 500);
}

/**
 * Fetch teacher schedule (simulated)
 * @param {string} teacherId - The ID of the teacher
 * @param {HTMLElement} modal - The modal element
 */
function fetchTeacherSchedule(teacherId, modal) {
    // Simulate loading
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = '<div class="loading">Loading teacher schedule...</div>';
    
    // Simulate API call delay
    setTimeout(() => {
        // Get teacher data (in a real app, this would come from the server)
        const teacher = {
            id: teacherId,
            name: 'Prof. John Doe',
            title: 'Full Professor',
            department: 'Computer Science Department',
            email: 'johndoe@example.com',
            phone: '(555) 123-4567',
            schedule: [
                { day: 'Monday', startHour: 10, endHour: 11.5, course: 'CS 201 - Data Structures' },
                { day: 'Wednesday', startHour: 10, endHour: 11.5, course: 'CS 201 - Data Structures' },
                { day: 'Friday', startHour: 10, endHour: 11.5, course: 'CS 201 - Data Structures' },
                { day: 'Tuesday', startHour: 13, endHour: 15, course: 'CS 301 - Database Systems' },
                { day: 'Thursday', startHour: 13, endHour: 15, course: 'CS 301 - Database Systems' }
            ]
        };
        
        // Update modal content
        modalBody.innerHTML = `
            <div class="teacher-profile-header">
                <div class="teacher-profile-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="teacher-profile-info">
                    <h3>${teacher.name}</h3>
                    <p>${teacher.title}</p>
                    <p>${teacher.department}</p>
                    <p><i class="fas fa-envelope"></i> ${teacher.email}</p>
                    <p><i class="fas fa-phone"></i> ${teacher.phone}</p>
                </div>
            </div>
            
            <div class="schedule-container">
                <h3>Weekly Schedule</h3>
                <p class="schedule-note">Showing all scheduled classes from 7:00 AM to 7:00 PM</p>
                
                <div class="schedule-grid">
                    <!-- Headers -->
                    <div></div>
                    <div class="day-header">Monday</div>
                    <div class="day-header">Tuesday</div>
                    <div class="day-header">Wednesday</div>
                    <div class="day-header">Thursday</div>
                    <div class="day-header">Friday</div>
                    
                    <!-- Time slots -->
                    ${generateTimeSlots()}
                </div>
                
                <div class="schedule-legend">
                    <div class="legend-item">
                        <div class="legend-color occupied"></div>
                        <span>Scheduled Class</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color available"></div>
                        <span>Available</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary"><i class="fas fa-print"></i> Print Schedule</button>
                <button class="btn-secondary"><i class="fas fa-envelope"></i> Contact Teacher</button>
            </div>
        `;
        
        // Populate schedule grid with classes
        populateScheduleGrid(teacher.schedule, modal);
        
        // Add event listeners to buttons
        const printBtn = modalBody.querySelector('.btn-primary');
        const contactBtn = modalBody.querySelector('.btn-secondary');
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
        
        contactBtn.addEventListener('click', function() {
            modal.remove();
            openSendMessageModal(teacher.id, teacher.name, teacher.email);
        });
    }, 1000);
    
    // Helper function to generate time slots
    function generateTimeSlots() {
        const startHour = 7; // 7 AM
        const endHour = 19.5; // 7:30 PM
        const interval = 0.5; // 30 minutes
        let html = '';
        
        for (let hour = startHour; hour <= endHour; hour += interval) {
            const formattedTime = formatTime(hour);
            html += `
                <div class="time-slot">${formattedTime}</div>
                <div data-day="Monday" data-hour="${hour}"></div>
                <div data-day="Tuesday" data-hour="${hour}"></div>
                <div data-day="Wednesday" data-hour="${hour}"></div>
                <div data-day="Thursday" data-hour="${hour}"></div>
                <div data-day="Friday" data-hour="${hour}"></div>
            `;
        }
        
        return html;
    }
    
    // Helper function to format time
    function formatTime(hour) {
        const isHalfHour = hour % 1 !== 0;
        const hourValue = Math.floor(hour);
        const minutes = isHalfHour ? '30' : '00';
        
        const period = hourValue >= 12 ? 'PM' : 'AM';
        const displayHour = hourValue > 12 ? hourValue - 12 : (hourValue === 0 ? 12 : hourValue);
        return `${displayHour}:${minutes} ${period}`;
    }
    
    // Helper function to populate schedule grid with classes
    function populateScheduleGrid(schedule, modal) {
        schedule.forEach(item => {
            const dayMap = {
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5
            };
            
            // Fill all slots for this class
            for (let hour = item.startHour; hour < item.endHour; hour += 0.5) {
                const slot = modal.querySelector(`.schedule-grid div[data-day="${item.day}"][data-hour="${hour}"]`);
                if (slot) {
                    slot.classList.add('occupied');
                    
                    // Add course info to the first slot
                    if (hour === item.startHour) {
                        slot.setAttribute('data-course', item.course);
                        slot.setAttribute('data-time', `${formatTime(item.startHour)} - ${formatTime(item.endHour)}`);
                        slot.textContent = item.course;
                        
                        // Calculate rowspan based on duration
                        const duration = (item.endHour - item.startHour) / 0.5;
                        if (duration > 1) {
                            slot.style.gridRow = `span ${duration}`;
                        }
                    } else {
                        // Hide other slots that are part of the same class
                        slot.style.display = 'none';
                    }
                }
            }
        });
        
        // Add tooltip functionality
        const occupiedSlots = modal.querySelectorAll('.schedule-grid .occupied');
        occupiedSlots.forEach(slot => {
            slot.addEventListener('mouseenter', function() {
                const course = this.getAttribute('data-course');
                const time = this.getAttribute('data-time');
                
                if (course && time) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'schedule-tooltip';
                    tooltip.innerHTML = `
                        <strong>${course}</strong>
                        <span>${time}</span>
                    `;
                    
                    this.appendChild(tooltip);
                }
            });
            
            slot.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.schedule-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }
}

/**
 * Open add teacher modal
 */
function openAddTeacherModal() {
    // Create modal for adding teacher
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Teacher</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="add-teacher-form">
                    <div class="form-group">
                        <label for="new-teacher-id">Teacher ID</label>
                        <input type="text" id="new-teacher-id" placeholder="T-XXX" required>
                    </div>
                    <div class="form-group">
                        <label for="new-teacher-name">Full Name</label>
                        <input type="text" id="new-teacher-name" placeholder="Enter full name" required>
                    </div>
                    <div class="form-group">
                        <label for="new-teacher-position">Position</label>
                        <select id="new-teacher-position" required>
                            <option value="">Select Position</option>
                            <option value="Full Professor">Full Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Instructor">Instructor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-teacher-department">Department</label>
                        <select id="new-teacher-department" required>
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Information Systems">Information Systems</option>
                            <option value="Mathematics">Mathematics</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-teacher-contact">Contact Email</label>
                        <input type="email" id="new-teacher-contact" placeholder="Enter email address" required>
                    </div>
                    <div class="form-group">
                        <label for="new-teacher-status">Status</label>
                        <select id="new-teacher-status" required>
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Add Teacher</button>
                        <button type="button" class="btn-secondary cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Add event listener to form submission
    modal.querySelector('#add-teacher-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewTeacher(modal);
    });
    
    // Add event listener to cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
        modal.remove();
    });
}

/**
 * Add new teacher (simulated)
 * @param {HTMLElement} modal - The modal element
 */
function addNewTeacher(modal) {
    // Get form values
    const id = modal.querySelector('#new-teacher-id').value;
    const name = modal.querySelector('#new-teacher-name').value;
    const position = modal.querySelector('#new-teacher-position').value;
    const department = modal.querySelector('#new-teacher-department').value;
    const contact = modal.querySelector('#new-teacher-contact').value;
    const status = modal.querySelector('#new-teacher-status').value;
    
    // Create new row in table
    const tbody = document.querySelector('.teacher-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>
            <div class="teacher-info">
                <img src="assets/img/teacher-default.png" alt="Teacher">
                <div>
                    <strong>${name}</strong>
                    <span>${position}</span>
                </div>
            </div>
        </td>
        <td>${department}</td>
        <td>
            <div class="subject-tags">
                <span class="tag">No subjects yet</span>
            </div>
        </td>
        <td>${contact}</td>
        <td><span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-view" title="View Details"><i class="fas fa-eye"></i></button>
                <button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-schedule" title="View Schedule"><i class="fas fa-calendar-alt"></i></button>
            </div>
        </td>
    `;
    tbody.appendChild(newRow);
    
    // Initialize action buttons for new row
    const viewButton = newRow.querySelector('.btn-view');
    viewButton.addEventListener('click', function() {
        viewTeacherDetails(id);
    });
    
    const editButton = newRow.querySelector('.btn-edit');
    editButton.addEventListener('click', function() {
        editTeacherDetails(id);
    });
    
    const scheduleButton = newRow.querySelector('.btn-schedule');
    scheduleButton.addEventListener('click', function() {
        viewTeacherSchedule(id);
    });
    
    // Show success message
    modal.querySelector('.modal-body').innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <p>New teacher added successfully!</p>
        </div>
    `;
    
    // Close modal after a delay
    setTimeout(() => {
        modal.remove();
    }, 1500);
}

/**
 * Open send message modal
 * @param {string} teacherId - The ID of the teacher
 * @param {string} teacherName - The name of the teacher
 * @param {string} teacherEmail - The email of the teacher
 */
function openSendMessageModal(teacherId, teacherName, teacherEmail) {
    // Create modal for sending message
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Send Message to ${teacherName}</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="send-message-form">
                    <div class="form-group">
                        <label for="message-to">To:</label>
                        <input type="text" id="message-to" value="${teacherName} (${teacherEmail})" readonly>
                    </div>
                    <div class="form-group">
                        <label for="message-subject">Subject:</label>
                        <input type="text" id="message-subject" placeholder="Enter message subject" required>
                    </div>
                    <div class="form-group">
                        <label for="message-content">Message:</label>
                        <textarea id="message-content" rows="6" placeholder="Type your message here..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="message-priority">Priority:</label>
                        <select id="message-priority">
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Send Message</button>
                        <button type="button" class="btn-secondary cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Add event listener to form submission
    modal.querySelector('#send-message-form').addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage(teacherId, modal);
    });
    
    // Add event listener to cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
        modal.remove();
    });
}

/**
 * Send message to teacher (simulated)
 * @param {string} teacherId - The ID of the teacher
 * @param {HTMLElement} modal - The modal element
 */
function sendMessage(teacherId, modal) {
    // Get form values
    const subject = modal.querySelector('#message-subject').value;
    const content = modal.querySelector('#message-content').value;
    const priority = modal.querySelector('#message-priority').value;
    
    // Show loading state
    modal.querySelector('.modal-body').innerHTML = `
        <div class="loading">
            <i class="fas fa-paper-plane fa-spin"></i>
            <p>Sending message...</p>
        </div>
    `;
    
    // Simulate sending message
    setTimeout(() => {
        // Show success message
        modal.querySelector('.modal-body').innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <p>Message sent successfully!</p>
            </div>
        `;
        
        // Close modal after a delay
        setTimeout(() => {
            modal.remove();
        }, 1500);
    }, 1500);
}

/**
 * View teaching history
 * @param {string} teacherId - The ID of the teacher
 * @param {string} teacherName - The name of the teacher
 */
function viewTeachingHistory(teacherId, teacherName) {
    // Create modal for teaching history
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content schedule-modal">
            <div class="modal-header">
                <h2>${teacherName}'s Teaching History</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading">Loading teaching history...</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
    
    // Simulate loading teaching history data
    setTimeout(() => {
        fetchTeachingHistory(teacherId, teacherName, modal);
    }, 800);
}

/**
 * Fetch teaching history (simulated)
 * @param {string} teacherId - The ID of the teacher
 * @param {string} teacherName - The name of the teacher
 * @param {HTMLElement} modal - The modal element
 */
function fetchTeachingHistory(teacherId, teacherName, modal) {
    // Update modal with teaching history
    modal.querySelector('.modal-body').innerHTML = `
        <div class="history-filters">
            <div class="filter-group">
                <label for="academic-year">Academic Year:</label>
                <select id="academic-year">
                    <option value="all">All Years</option>
                    <option value="2024-2025" selected>2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2022-2023">2022-2023</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="semester">Semester:</label>
                <select id="semester">
                    <option value="all">All Semesters</option>
                    <option value="1st" selected>1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="summer">Summer</option>
                </select>
            </div>
        </div>
        
        <div class="history-table-container">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Section</th>
                        <th>Students</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2024-2025</td>
                        <td>1st Semester</td>
                        <td>CS 201</td>
                        <td>Data Structures</td>
                        <td>BS Computer Science 3A</td>
                        <td>35</td>
                    </tr>
                    <tr>
                        <td>2024-2025</td>
                        <td>1st Semester</td>
                        <td>CS 301</td>
                        <td>Database Systems</td>
                        <td>BS Computer Science 3A</td>
                        <td>35</td>
                    </tr>
                    <tr>
                        <td>2024-2025</td>
                        <td>1st Semester</td>
                        <td>CS 106</td>
                        <td>Web Development</td>
                        <td>BS Computer Science 2B</td>
                        <td>40</td>
                    </tr>
                    <tr>
                        <td>2023-2024</td>
                        <td>2nd Semester</td>
                        <td>CS 201</td>
                        <td>Data Structures</td>
                        <td>BS Computer Science 2A</td>
                        <td>38</td>
                    </tr>
                    <tr>
                        <td>2023-2024</td>
                        <td>2nd Semester</td>
                        <td>CS 106</td>
                        <td>Web Development</td>
                        <td>BS Computer Science 1B</td>
                        <td>42</td>
                    </tr>
                    <tr>
                        <td>2023-2024</td>
                        <td>1st Semester</td>
                        <td>CS 101</td>
                        <td>Introduction to Programming</td>
                        <td>BS Computer Science 1A</td>
                        <td>45</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="history-summary">
            <div class="summary-item">
                <div class="summary-value">6</div>
                <div class="summary-label">Courses Taught</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">235</div>
                <div class="summary-label">Total Students</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">3</div>
                <div class="summary-label">Academic Terms</div>
            </div>
        </div>
        
        <div class="history-actions">
            <button class="btn-primary"><i class="fas fa-print"></i> Print History</button>
            <button class="btn-secondary"><i class="fas fa-download"></i> Export as PDF</button>
        </div>
    `;
    
    // Add event listeners to filters
    const academicYearFilter = modal.querySelector('#academic-year');
    const semesterFilter = modal.querySelector('#semester');
    
    academicYearFilter.addEventListener('change', function() {
        filterTeachingHistory(modal);
    });
    
    semesterFilter.addEventListener('change', function() {
        filterTeachingHistory(modal);
    });
}

/**
 * Filter teaching history based on selected filters
 * @param {HTMLElement} modal - The modal element
 */
function filterTeachingHistory(modal) {
    const academicYear = modal.querySelector('#academic-year').value;
    const semester = modal.querySelector('#semester').value;
    
    const rows = modal.querySelectorAll('.history-table tbody tr');
    let visibleCount = 0;
    let totalStudents = 0;
    
    rows.forEach(row => {
        const rowAcademicYear = row.querySelector('td:nth-child(1)').textContent;
        const rowSemester = row.querySelector('td:nth-child(2)').textContent;
        const students = parseInt(row.querySelector('td:nth-child(6)').textContent);
        
        const academicYearMatch = academicYear === 'all' || rowAcademicYear === academicYear;
        const semesterMatch = semester === 'all' || rowSemester.includes(semester);
        
        if (academicYearMatch && semesterMatch) {
            row.style.display = '';
            visibleCount++;
            totalStudents += students;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update summary
    modal.querySelector('.summary-item:nth-child(1) .summary-value').textContent = visibleCount;
    modal.querySelector('.summary-item:nth-child(2) .summary-value').textContent = totalStudents;
}

/**
 * Export teacher data (simulated)
 */
function exportTeacherData() {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-file-download"></i>
            <span>Exporting teacher data...</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Update toast after a delay
    setTimeout(() => {
        toast.innerHTML = `
            <div class="toast-content success">
                <i class="fas fa-check-circle"></i>
                <span>Teacher data exported successfully!</span>
            </div>
        `;
        
        // Hide toast after another delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }, 1500);
}
