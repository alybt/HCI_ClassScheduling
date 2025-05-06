document.addEventListener('DOMContentLoaded', function() {
    // Initialize action buttons
    initializeActionButtons();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize add student button
    document.getElementById('add-student-btn').addEventListener('click', function() {
        openAddStudentModal();
    });
    
    // Initialize export button
    document.querySelector('.btn-export').addEventListener('click', function() {
        exportStudentData();
    });
});

/**
 * Initialize all action buttons in the student table
 */
function initializeActionButtons() {
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.closest('tr').querySelector('td:first-child').textContent;
            viewStudentDetails(studentId);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.closest('tr').querySelector('td:first-child').textContent;
            editStudentDetails(studentId);
        });
    });
    
    // Schedule buttons
    const scheduleButtons = document.querySelectorAll('.btn-schedule');
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.closest('tr').querySelector('td:first-child').textContent;
            viewStudentSchedule(studentId);
        });
    });
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
    const programFilter = document.getElementById('program-filter');
    const yearFilter = document.getElementById('year-filter');
    const statusFilter = document.getElementById('status-filter');
    
    // Add event listeners to filters
    programFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
}

/**
 * Apply filters to the student table
 */
function applyFilters() {
    const programValue = document.getElementById('program-filter').value;
    const yearValue = document.getElementById('year-filter').value;
    const statusValue = document.getElementById('status-filter').value;
    
    const rows = document.querySelectorAll('.student-table tbody tr');
    
    rows.forEach(row => {
        const program = row.querySelector('td:nth-child(3)').textContent;
        const year = row.querySelector('td:nth-child(4)').textContent;
        const status = row.querySelector('td:nth-child(6) .status-badge').textContent;
        
        const programMatch = programValue === 'all' || program.includes(getProgramName(programValue));
        const yearMatch = yearValue === 'all' || year.includes(getYearName(yearValue));
        const statusMatch = statusValue === 'all' || status.toLowerCase() === statusValue.toLowerCase();
        
        if (programMatch && yearMatch && statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Get program name from value
 */
function getProgramName(value) {
    const programs = {
        'bscs': 'BS Computer Science',
        'bsit': 'BS Information Technology',
        'bsis': 'BS Information Systems'
    };
    return programs[value] || '';
}

/**
 * Get year name from value
 */
function getYearName(value) {
    const years = {
        '1': '1st Year',
        '2': '2nd Year',
        '3': '3rd Year',
        '4': '4th Year'
    };
    return years[value] || '';
}

/**
 * View student details
 * @param {string} studentId - The ID of the student to view
 */
function viewStudentDetails(studentId) {
    // Create modal for student details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Student Details</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading">Loading student details...</div>
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
    
    // Simulate loading student data
    setTimeout(() => {
        fetchStudentDetails(studentId, modal);
    }, 500);
}

/**
 * Fetch student details from server (simulated)
 * @param {string} studentId - The ID of the student
 * @param {HTMLElement} modal - The modal element
 */
function fetchStudentDetails(studentId, modal) {
    // In a real application, this would be an API call
    // For demo purposes, we'll use dummy data based on the student ID
    
    // Find the student row
    const studentRow = document.querySelector(`tr td:first-child:contains('${studentId}')`).closest('tr');
    if (!studentRow) {
        modal.querySelector('.modal-body').innerHTML = '<p>Student not found</p>';
        return;
    }
    
    // Get student data from the row
    const name = studentRow.querySelector('td:nth-child(2) strong').textContent;
    const email = studentRow.querySelector('td:nth-child(2) span').textContent;
    const program = studentRow.querySelector('td:nth-child(3)').textContent;
    const year = studentRow.querySelector('td:nth-child(4)').textContent;
    const courses = studentRow.querySelector('td:nth-child(5)').textContent;
    const status = studentRow.querySelector('td:nth-child(6) .status-badge').textContent;
    
    // Update modal with student details
    modal.querySelector('.modal-body').innerHTML = `
        <div class="student-profile">
            <div class="student-avatar">
                <img src="assets/img/student1.png" alt="${name}">
            </div>
            <div class="student-info-details">
                <h3>${name}</h3>
                <p>${email}</p>
                <p class="student-id">${studentId}</p>
            </div>
        </div>
        <div class="student-details">
            <div class="detail-row">
                <div class="detail-label">Program:</div>
                <div class="detail-value">${program}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Year Level:</div>
                <div class="detail-value">${year}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Courses:</div>
                <div class="detail-value">${courses}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><span class="status-badge ${status.toLowerCase()}">${status}</span></div>
            </div>
        </div>
        <div class="student-actions">
            <button class="btn-primary">Send Message</button>
            <button class="btn-secondary">View Full Schedule</button>
            <button class="btn-secondary">View Academic Record</button>
        </div>
    `;
}

/**
 * Edit student details
 * @param {string} studentId - The ID of the student to edit
 */
function editStudentDetails(studentId) {
    // Create modal for editing student
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Student</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading">Loading student data...</div>
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
    
    // Simulate loading student data
    setTimeout(() => {
        fetchStudentForEdit(studentId, modal);
    }, 500);
}

/**
 * Fetch student data for editing (simulated)
 * @param {string} studentId - The ID of the student
 * @param {HTMLElement} modal - The modal element
 */
function fetchStudentForEdit(studentId, modal) {
    // Find the student row
    const studentRow = Array.from(document.querySelectorAll('tr')).find(row => 
        row.querySelector('td:first-child') && 
        row.querySelector('td:first-child').textContent === studentId
    );
    
    if (!studentRow) {
        modal.querySelector('.modal-body').innerHTML = '<p>Student not found</p>';
        return;
    }
    
    // Get student data from the row
    const name = studentRow.querySelector('td:nth-child(2) strong').textContent;
    const email = studentRow.querySelector('td:nth-child(2) span').textContent;
    const program = studentRow.querySelector('td:nth-child(3)').textContent;
    const year = studentRow.querySelector('td:nth-child(4)').textContent;
    const status = studentRow.querySelector('td:nth-child(6) .status-badge').textContent;
    
    // Update modal with edit form
    modal.querySelector('.modal-body').innerHTML = `
        <form id="edit-student-form">
            <div class="form-group">
                <label for="student-name">Full Name</label>
                <input type="text" id="student-name" value="${name}" required>
            </div>
            <div class="form-group">
                <label for="student-email">Email</label>
                <input type="email" id="student-email" value="${email}" required>
            </div>
            <div class="form-group">
                <label for="student-program">Program</label>
                <select id="student-program" required>
                    <option value="BS Computer Science" ${program === 'BS Computer Science' ? 'selected' : ''}>BS Computer Science</option>
                    <option value="BS Information Technology" ${program === 'BS Information Technology' ? 'selected' : ''}>BS Information Technology</option>
                    <option value="BS Information Systems" ${program === 'BS Information Systems' ? 'selected' : ''}>BS Information Systems</option>
                </select>
            </div>
            <div class="form-group">
                <label for="student-year">Year Level</label>
                <select id="student-year" required>
                    <option value="1st Year" ${year === '1st Year' ? 'selected' : ''}>1st Year</option>
                    <option value="2nd Year" ${year === '2nd Year' ? 'selected' : ''}>2nd Year</option>
                    <option value="3rd Year" ${year === '3rd Year' ? 'selected' : ''}>3rd Year</option>
                    <option value="4th Year" ${year === '4th Year' ? 'selected' : ''}>4th Year</option>
                </select>
            </div>
            <div class="form-group">
                <label for="student-status">Status</label>
                <select id="student-status" required>
                    <option value="Enrolled" ${status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
                    <option value="On Leave" ${status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                    <option value="Graduated" ${status === 'Graduated' ? 'selected' : ''}>Graduated</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Save Changes</button>
                <button type="button" class="btn-secondary cancel-btn">Cancel</button>
            </div>
        </form>
    `;
    
    // Add event listener to form submission
    modal.querySelector('#edit-student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveStudentChanges(studentId, modal);
    });
    
    // Add event listener to cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
        modal.remove();
    });
}

/**
 * Save student changes (simulated)
 * @param {string} studentId - The ID of the student
 * @param {HTMLElement} modal - The modal element
 */
function saveStudentChanges(studentId, modal) {
    // Get form values
    const name = modal.querySelector('#student-name').value;
    const email = modal.querySelector('#student-email').value;
    const program = modal.querySelector('#student-program').value;
    const year = modal.querySelector('#student-year').value;
    const status = modal.querySelector('#student-status').value;
    
    // Find the student row
    const studentRow = Array.from(document.querySelectorAll('tr')).find(row => 
        row.querySelector('td:first-child') && 
        row.querySelector('td:first-child').textContent === studentId
    );
    
    if (!studentRow) {
        return;
    }
    
    // Update student data in the row
    studentRow.querySelector('td:nth-child(2) strong').textContent = name;
    studentRow.querySelector('td:nth-child(2) span').textContent = email;
    studentRow.querySelector('td:nth-child(3)').textContent = program;
    studentRow.querySelector('td:nth-child(4)').textContent = year;
    
    const statusBadge = studentRow.querySelector('td:nth-child(6) .status-badge');
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;
    
    // Show success message
    modal.querySelector('.modal-body').innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <p>Student information updated successfully!</p>
        </div>
    `;
    
    // Close modal after a delay
    setTimeout(() => {
        modal.remove();
    }, 1500);
}

/**
 * View student schedule
 * @param {string} studentId - The ID of the student
 */
function viewStudentSchedule(studentId) {
    // Create modal for student schedule
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content schedule-modal">
            <div class="modal-header">
                <h2>Student Schedule</h2>
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
        fetchStudentSchedule(studentId, modal);
    }, 500);
}

/**
 * Fetch student schedule (simulated)
 * @param {string} studentId - The ID of the student
 * @param {HTMLElement} modal - The modal element
 */
function fetchStudentSchedule(studentId, modal) {
    // Find the student row
    const studentRow = Array.from(document.querySelectorAll('tr')).find(row => 
        row.querySelector('td:first-child') && 
        row.querySelector('td:first-child').textContent === studentId
    );
    
    if (!studentRow) {
        modal.querySelector('.modal-body').innerHTML = '<p>Student not found</p>';
        return;
    }
    
    // Get student name
    const name = studentRow.querySelector('td:nth-child(2) strong').textContent;
    
    // Update modal with schedule
    modal.querySelector('.modal-body').innerHTML = `
        <div class="student-info-header">
            <h3>${name}'s Schedule</h3>
            <p>${studentId}</p>
        </div>
        <div class="schedule-tabs">
            <button class="tab-btn active" data-tab="current">Current Semester</button>
            <button class="tab-btn" data-tab="upcoming">Upcoming Semester</button>
            <button class="tab-btn" data-tab="past">Past Semesters</button>
        </div>
        <div class="schedule-content active" id="current-tab">
            <div class="weekly-schedule">
                <div class="schedule-day">
                    <h4>Monday</h4>
                    <div class="schedule-item">
                        <div class="time">7:30 AM - 9:00 AM</div>
                        <div class="course">CS 201: Data Structures</div>
                        <div class="room">CCS Lab 1</div>
                    </div>
                    <div class="schedule-item">
                        <div class="time">1:00 PM - 2:30 PM</div>
                        <div class="course">CS 301: Database Systems</div>
                        <div class="room">LR 2</div>
                    </div>
                </div>
                <div class="schedule-day">
                    <h4>Tuesday</h4>
                    <div class="schedule-item">
                        <div class="time">9:00 AM - 10:30 AM</div>
                        <div class="course">CS 106: Web Development</div>
                        <div class="room">CCS Lab 2</div>
                    </div>
                </div>
                <div class="schedule-day">
                    <h4>Wednesday</h4>
                    <div class="schedule-item">
                        <div class="time">7:30 AM - 9:00 AM</div>
                        <div class="course">CS 201: Data Structures</div>
                        <div class="room">CCS Lab 1</div>
                    </div>
                </div>
                <div class="schedule-day">
                    <h4>Thursday</h4>
                    <div class="schedule-item">
                        <div class="time">9:00 AM - 10:30 AM</div>
                        <div class="course">CS 106: Web Development</div>
                        <div class="room">CCS Lab 2</div>
                    </div>
                </div>
                <div class="schedule-day">
                    <h4>Friday</h4>
                    <div class="schedule-item">
                        <div class="time">1:00 PM - 2:30 PM</div>
                        <div class="course">CS 301: Database Systems</div>
                        <div class="room">LR 2</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="schedule-content" id="upcoming-tab" style="display: none;">
            <p class="empty-state">No upcoming semester schedule available yet.</p>
        </div>
        <div class="schedule-content" id="past-tab" style="display: none;">
            <div class="semester-select">
                <select>
                    <option>1st Year, 1st Semester (2023-2024)</option>
                    <option>1st Year, 2nd Semester (2023-2024)</option>
                </select>
            </div>
            <div class="past-schedule">
                <p class="empty-state">Select a semester to view past schedules.</p>
            </div>
        </div>
        <div class="schedule-actions">
            <button class="btn-primary"><i class="fas fa-print"></i> Print Schedule</button>
            <button class="btn-secondary"><i class="fas fa-download"></i> Export as PDF</button>
        </div>
    `;
    
    // Add event listeners to tabs
    const tabButtons = modal.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            modal.querySelectorAll('.schedule-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            const tabContent = modal.querySelector(`#${tabId}-tab`);
            if (tabContent) {
                tabContent.style.display = 'block';
            }
        });
    });
}

/**
 * Open add student modal
 */
function openAddStudentModal() {
    // Create modal for adding student
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Student</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="add-student-form">
                    <div class="form-group">
                        <label for="new-student-id">Student ID</label>
                        <input type="text" id="new-student-id" placeholder="S-YYYY-XXX" required>
                    </div>
                    <div class="form-group">
                        <label for="new-student-name">Full Name</label>
                        <input type="text" id="new-student-name" placeholder="Enter full name" required>
                    </div>
                    <div class="form-group">
                        <label for="new-student-email">Email</label>
                        <input type="email" id="new-student-email" placeholder="Enter email address" required>
                    </div>
                    <div class="form-group">
                        <label for="new-student-program">Program</label>
                        <select id="new-student-program" required>
                            <option value="">Select Program</option>
                            <option value="BS Computer Science">BS Computer Science</option>
                            <option value="BS Information Technology">BS Information Technology</option>
                            <option value="BS Information Systems">BS Information Systems</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-student-year">Year Level</label>
                        <select id="new-student-year" required>
                            <option value="">Select Year Level</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="new-student-status">Status</label>
                        <select id="new-student-status" required>
                            <option value="">Select Status</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Add Student</button>
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
    modal.querySelector('#add-student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewStudent(modal);
    });
    
    // Add event listener to cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', function() {
        modal.remove();
    });
}

/**
 * Add new student (simulated)
 * @param {HTMLElement} modal - The modal element
 */
function addNewStudent(modal) {
    // Get form values
    const id = modal.querySelector('#new-student-id').value;
    const name = modal.querySelector('#new-student-name').value;
    const email = modal.querySelector('#new-student-email').value;
    const program = modal.querySelector('#new-student-program').value;
    const year = modal.querySelector('#new-student-year').value;
    const status = modal.querySelector('#new-student-status').value;
    
    // Create new row in table
    const tbody = document.querySelector('.student-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>
            <div class="student-info">
                <img src="assets/img/student-default.png" alt="Student">
                <div>
                    <strong>${name}</strong>
                    <span>${email}</span>
                </div>
            </div>
        </td>
        <td>${program}</td>
        <td>${year}</td>
        <td>
            <div class="course-count">0 courses</div>
        </td>
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
        viewStudentDetails(id);
    });
    
    const editButton = newRow.querySelector('.btn-edit');
    editButton.addEventListener('click', function() {
        editStudentDetails(id);
    });
    
    const scheduleButton = newRow.querySelector('.btn-schedule');
    scheduleButton.addEventListener('click', function() {
        viewStudentSchedule(id);
    });
    
    // Show success message
    modal.querySelector('.modal-body').innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <p>New student added successfully!</p>
        </div>
    `;
    
    // Close modal after a delay
    setTimeout(() => {
        modal.remove();
    }, 1500);
}

/**
 * Export student data (simulated)
 */
function exportStudentData() {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-file-download"></i>
            <span>Exporting student data...</span>
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
                <span>Student data exported successfully!</span>
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

// Helper function to fix querySelector for text content
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Add :contains selector
jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
