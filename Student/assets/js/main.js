/**
 * Student Dashboard JavaScript
 * Handles common functionality across all student pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the header if date display exists
    const currentDateDisplay = document.getElementById('current-date');
    if (currentDateDisplay) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Set default semester to 2nd semester (since it's May 2025)
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.value = '2nd';
        
        // Disable 1st semester option since it's already passed
        const firstSemOption = semesterSelect.querySelector('option[value="1st"]');
        if (firstSemOption) {
            firstSemOption.disabled = true;
        }
        
        // Trigger change event to update any dependent components
        const event = new Event('change');
        semesterSelect.dispatchEvent(event);
    }
    
    // Initialize sidebar navigation
    initializeSidebar();
    
    // Initialize modals
    initializeModals();
    
    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        initializeDashboard();
    }
    
    // Handle logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Set student name if element exists
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        const studentName = sessionStorage.getItem('studentName') || 'John Smith';
        userNameElement.textContent = studentName;
    }
});

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
    // Load student data
    const studentData = getStudentData();
    
    // Update dashboard stats
    updateDashboardStats(studentData);
    
    // Load upcoming classes
    loadUpcomingClasses();
    
    // Load recent announcements
    loadRecentAnnouncements();
    
    // Load enrolled courses
    loadEnrolledCourses();
}

/**
 * Get student data
 * @returns {Object} - The student data
 */
function getStudentData() {
    // In a real app, this would come from an API call
    // For this demo, we'll use hardcoded data
    return {
        id: '2023-0001',
        name: 'Jane Smith',
        program: 'BS Computer Science',
        year: '2nd Year',
        enrolledCourses: 8,
        completedCourses: 10,
        gpa: 3.75
    };
}

/**
 * Update dashboard stats
 * @param {Object} studentData - The student data
 */
function updateDashboardStats(studentData) {
    // Update enrolled courses count
    const enrolledCoursesCount = document.getElementById('enrolled-courses-count');
    if (enrolledCoursesCount) {
        enrolledCoursesCount.textContent = studentData.enrolledCourses;
    }
    
    // Update completed courses count
    const completedCoursesCount = document.getElementById('completed-courses-count');
    if (completedCoursesCount) {
        completedCoursesCount.textContent = studentData.completedCourses;
    }
    
    // Update GPA
    const gpaValue = document.getElementById('gpa-value');
    if (gpaValue) {
        gpaValue.textContent = studentData.gpa;
    }
}

/**
 * Initialize sidebar navigation
 */
function initializeSidebar() {
    // Handle mobile sidebar toggle if it exists
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize all modals on the page
 */
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

/**
 * Logout function
 */
function logout() {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '../index.html';
}

/**
 * Load upcoming classes
 */
function loadUpcomingClasses() {
    const upcomingClassesContainer = document.getElementById('upcoming-classes');
    
    if (!upcomingClassesContainer) return;
    
    // Clear existing classes
    upcomingClassesContainer.innerHTML = '';
    
    // Demo data for upcoming classes (2nd semester courses)
    const upcomingClasses = [
        {
            course: 'CC 102: COMPUTER PROGRAMMING 2',
            time: '9:00 AM - 10:30 AM',
            room: 'LR 3',
            instructor: 'Dr. Robert Johnson',
            timeUntil: '1 hour'
        },
        {
            course: 'WD 111: WEB DEVELOPMENT 1',
            time: '10:30 AM - 12:00 PM',
            room: 'LR 5',
            instructor: 'Prof. Sarah Williams',
            timeUntil: '3 hours'
        },
        {
            course: 'DS 118: DISCRETE STRUCTURES 2',
            time: '1:00 PM - 2:30 PM',
            room: 'LR 6',
            instructor: 'Dr. Robert Johnson',
            timeUntil: '5 hours'
        }
    ];
    
    // Add classes to container
    upcomingClasses.forEach(classItem => {
        const classElement = document.createElement('div');
        classElement.className = 'class-item';
        
        classElement.innerHTML = `
            <div class="class-time">
                <h3>${classItem.time}</h3>
                <p>${classItem.timeUntil}</p>
            </div>
            <div class="class-details">
                <h3>${classItem.course}</h3>
                <p><i class="fas fa-user"></i> ${classItem.instructor}</p>
                <p><i class="fas fa-door-open"></i> ${classItem.room}</p>
            </div>
        `;
        
        upcomingClassesContainer.appendChild(classElement);
    });
}

/**
 * Load recent announcements
 */
function loadRecentAnnouncements() {
    const announcementsContainer = document.getElementById('announcements');
    
    if (!announcementsContainer) return;
    
    // Clear existing announcements
    announcementsContainer.innerHTML = '';
    
    // Demo data for announcements
    const announcements = [
        {
            title: '2nd Semester Final Exam Schedule',
            content: 'Final exams for the 2nd semester will be held from May 20-25, 2025. Please check your schedule.',
            date: 'May 5, 2025',
            type: 'important'
        },
        {
            title: 'Summer Course Registration',
            content: 'Registration for summer courses will open on May 15, 2025. Please consult with your advisor.',
            date: 'May 3, 2025',
            type: 'info'
        },
        {
            title: 'OOP 112 Project Deadline Extended',
            content: 'The deadline for the OOP 112 final project has been extended to May 12, 2025.',
            date: 'May 1, 2025',
            type: 'course'
        }
    ];
    
    // Add announcements to container
    announcements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = `announcement-item ${announcement.type}`;
        
        // Set icon based on announcement type
        let icon = '';
        switch (announcement.type) {
            case 'important':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle"></i>';
                break;
            case 'course':
                icon = '<i class="fas fa-book"></i>';
                break;
            default:
                icon = '<i class="fas fa-bell"></i>';
        }
        
        announcementElement.innerHTML = `
            <div class="announcement-icon">
                ${icon}
            </div>
            <div class="announcement-details">
                <h3>${announcement.title}</h3>
                <p>${announcement.content}</p>
                <span class="announcement-date">${announcement.date}</span>
            </div>
        `;
        
        announcementsContainer.appendChild(announcementElement);
    });
}

/**
 * Load enrolled courses
 */
function loadEnrolledCourses() {
    const enrolledCoursesContainer = document.getElementById('enrolled-courses');
    
    if (!enrolledCoursesContainer) return;
    
    // Clear existing courses
    enrolledCoursesContainer.innerHTML = '';
    
    // Demo data for enrolled courses (2nd semester courses)
    const enrolledCourses = [
        {
            code: 'CC 102',
            name: 'COMPUTER PROGRAMMING 2',
            schedule: 'MWF 9:00 AM - 10:30 AM',
            room: 'LR 3',
            instructor: 'Dr. Robert Johnson',
            progress: 85
        },
        {
            code: 'CC 102',
            name: 'COMPUTER PROGRAMMING 2 (LAB)',
            schedule: 'TTh 1:00 PM - 3:00 PM',
            room: 'CL 1',
            instructor: 'Dr. Robert Johnson',
            progress: 90
        },
        {
            code: 'WD 111',
            name: 'WEB DEVELOPMENT 1',
            schedule: 'MWF 10:30 AM - 12:00 PM',
            room: 'LR 5',
            instructor: 'Prof. Sarah Williams',
            progress: 78
        },
        {
            code: 'WD 111',
            name: 'WEB DEVELOPMENT 1 (LAB)',
            schedule: 'TTh 3:30 PM - 5:30 PM',
            room: 'CL 2',
            instructor: 'Prof. Sarah Williams',
            progress: 82
        },
        {
            code: 'HCI 116',
            name: 'HUMAN COMPUTER INTERACTION',
            schedule: 'TTh 9:00 AM - 10:30 AM',
            room: 'LR 4',
            instructor: 'Dr. Michael Chen',
            progress: 75
        },
        {
            code: 'DS 118',
            name: 'DISCRETE STRUCTURES 2',
            schedule: 'MWF 1:00 PM - 2:30 PM',
            room: 'LR 6',
            instructor: 'Dr. Robert Johnson',
            progress: 68
        },
        {
            code: 'OOP 112',
            name: 'OBJECT ORIENTED PROGRAMMING',
            schedule: 'TTh 10:30 AM - 12:00 PM',
            room: 'LR 2',
            instructor: 'Prof. Emily Davis',
            progress: 92
        },
        {
            code: 'OOP 112',
            name: 'OBJECT ORIENTED PROGRAMMING (LAB)',
            schedule: 'WF 3:30 PM - 5:30 PM',
            room: 'CL 3',
            instructor: 'Prof. Emily Davis',
            progress: 95
        }
    ];
    
    // Add courses to container
    enrolledCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-item';
        
        courseElement.innerHTML = `
            <div class="course-header">
                <h3>${course.code}</h3>
                <span class="progress-badge">${course.progress}%</span>
            </div>
            <div class="course-body">
                <h4>${course.name}</h4>
                <p><i class="fas fa-user"></i> ${course.instructor}</p>
                <p><i class="fas fa-calendar-alt"></i> ${course.schedule}</p>
                <p><i class="fas fa-door-open"></i> ${course.room}</p>
            </div>
            <div class="course-footer">
                <div class="progress-bar">
                    <div class="progress" style="width: ${course.progress}%"></div>
                </div>
            </div>
        `;
        
        enrolledCoursesContainer.appendChild(courseElement);
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Semester select change
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function() {
            // Refresh the dashboard with the selected semester
            initializeDashboard();
        });
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear session storage
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('username');
            
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }
}
