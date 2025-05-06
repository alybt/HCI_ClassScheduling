/**
 * Admin Courses JavaScript
 * Handles the functionality for the admin courses page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set default semester to 2nd semester (since it's May 2025)
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.value = '2nd';
    }
    
    // Load courses data
    loadCoursesData();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Load courses data
 */
function loadCoursesData() {
    // Get selected semester
    const semesterSelect = document.getElementById('semester-select');
    const selectedSemester = semesterSelect ? semesterSelect.value : '2nd';
    
    // Get courses container
    const coursesContainer = document.getElementById('courses-container');
    
    if (!coursesContainer) return;
    
    // Clear existing courses
    coursesContainer.innerHTML = '';
    
    // Get courses data for the selected semester
    const coursesData = getCoursesData(selectedSemester);
    
    // Add courses to container
    coursesData.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesContainer.appendChild(courseCard);
    });
}

/**
 * Get courses data for a specific semester
 * @param {string} semester - The semester to get courses for
 * @returns {Array} - The courses data
 */
function getCoursesData(semester) {
    // In a real app, this would come from an API call
    // For this demo, we'll use hardcoded data
    
    // 1st semester courses
    const firstSemesterCourses = [
        {
            id: 'CC100',
            code: 'CC 100',
            name: 'INTRODUCING TO COMPUTING',
            type: 'Lecture',
            credits: 3,
            schedule: 'MWF 9:00 AM - 10:30 AM',
            room: 'LR 3',
            instructor: 'Dr. Robert Johnson',
            capacity: 40,
            enrolled: 35
        },
        {
            id: 'CC100L',
            code: 'CC 100',
            name: 'INTRODUCING TO COMPUTING (LAB)',
            type: 'Laboratory',
            credits: 1,
            schedule: 'TTh 1:00 PM - 3:00 PM',
            room: 'CL 1',
            instructor: 'Dr. Robert Johnson',
            capacity: 40,
            enrolled: 35
        },
        {
            id: 'DS111',
            code: 'DS 111',
            name: 'DISCRETE STRUCTURES 1',
            type: 'Lecture',
            credits: 3,
            schedule: 'MWF 10:30 AM - 12:00 PM',
            room: 'LR 5',
            instructor: 'Dr. Robert Johnson',
            capacity: 35,
            enrolled: 32
        },
        {
            id: 'CC101',
            code: 'CC 101',
            name: 'COMPUTER PROGRAMMING',
            type: 'Lecture',
            credits: 3,
            schedule: 'TTh 9:00 AM - 10:30 AM',
            room: 'LR 4',
            instructor: 'Prof. Sarah Williams',
            capacity: 35,
            enrolled: 30
        },
        {
            id: 'CC101L',
            code: 'CC 101',
            name: 'COMPUTER PROGRAMMING (LAB)',
            type: 'Laboratory',
            credits: 1,
            schedule: 'TTh 3:30 PM - 5:30 PM',
            room: 'CL 2',
            instructor: 'Prof. Sarah Williams',
            capacity: 35,
            enrolled: 30
        }
    ];
    
    // 2nd semester courses
    const secondSemesterCourses = [
        {
            id: 'CC102',
            code: 'CC 102',
            name: 'COMPUTER PROGRAMMING 2',
            type: 'Lecture',
            credits: 3,
            schedule: 'MWF 9:00 AM - 10:30 AM',
            room: 'LR 3',
            instructor: 'Dr. Robert Johnson',
            capacity: 35,
            enrolled: 33
        },
        {
            id: 'CC102L',
            code: 'CC 102',
            name: 'COMPUTER PROGRAMMING 2 (LAB)',
            type: 'Laboratory',
            credits: 1,
            schedule: 'TTh 1:00 PM - 3:00 PM',
            room: 'CL 1',
            instructor: 'Dr. Robert Johnson',
            capacity: 35,
            enrolled: 33
        },
        {
            id: 'WD111',
            code: 'WD 111',
            name: 'WEB DEVELOPMENT 1',
            type: 'Lecture',
            credits: 3,
            schedule: 'MWF 10:30 AM - 12:00 PM',
            room: 'LR 5',
            instructor: 'Prof. Sarah Williams',
            capacity: 30,
            enrolled: 28
        },
        {
            id: 'WD111L',
            code: 'WD 111',
            name: 'WEB DEVELOPMENT 1 (LAB)',
            type: 'Laboratory',
            credits: 1,
            schedule: 'TTh 3:30 PM - 5:30 PM',
            room: 'CL 2',
            instructor: 'Prof. Sarah Williams',
            capacity: 30,
            enrolled: 28
        },
        {
            id: 'HCI116',
            code: 'HCI 116',
            name: 'HUMAN COMPUTER INTERACTION',
            type: 'Lecture',
            credits: 3,
            schedule: 'TTh 9:00 AM - 10:30 AM',
            room: 'LR 4',
            instructor: 'Dr. Michael Chen',
            capacity: 30,
            enrolled: 25
        },
        {
            id: 'DS118',
            code: 'DS 118',
            name: 'DISCRETE STRUCTURES 2',
            type: 'Lecture',
            credits: 3,
            schedule: 'MWF 1:00 PM - 2:30 PM',
            room: 'LR 6',
            instructor: 'Dr. Robert Johnson',
            capacity: 35,
            enrolled: 30
        },
        {
            id: 'OOP112',
            code: 'OOP 112',
            name: 'OBJECT ORIENTED PROGRAMMING',
            type: 'Lecture',
            credits: 3,
            schedule: 'TTh 10:30 AM - 12:00 PM',
            room: 'LR 2',
            instructor: 'Prof. Emily Davis',
            capacity: 30,
            enrolled: 26
        },
        {
            id: 'OOP112L',
            code: 'OOP 112',
            name: 'OBJECT ORIENTED PROGRAMMING (LAB)',
            type: 'Laboratory',
            credits: 1,
            schedule: 'WF 3:30 PM - 5:30 PM',
            room: 'CL 3',
            instructor: 'Prof. Emily Davis',
            capacity: 30,
            enrolled: 26
        }
    ];
    
    return semester === '1st' ? firstSemesterCourses : secondSemesterCourses;
}

/**
 * Create a course card
 * @param {Object} course - The course data
 * @returns {HTMLElement} - The course card element
 */
function createCourseCard(course) {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.setAttribute('data-id', course.id);
    
    // Determine card color based on course type
    if (course.type === 'Laboratory') {
        courseCard.classList.add('lab-course');
    }
    
    // Calculate enrollment percentage
    const enrollmentPercentage = Math.round((course.enrolled / course.capacity) * 100);
    
    // Set card content
    courseCard.innerHTML = `
        <div class="course-header">
            <h3>${course.code}</h3>
            <span class="course-type">${course.type}</span>
        </div>
        <div class="course-body">
            <h4>${course.name}</h4>
            <p><i class="fas fa-user-tie"></i> ${course.instructor}</p>
            <p><i class="fas fa-calendar-alt"></i> ${course.schedule}</p>
            <p><i class="fas fa-door-open"></i> ${course.room}</p>
            <div class="enrollment-info">
                <div class="enrollment-text">
                    <span>${course.enrolled}/${course.capacity} Students</span>
                    <span>${enrollmentPercentage}%</span>
                </div>
                <div class="enrollment-bar">
                    <div class="enrollment-progress" style="width: ${enrollmentPercentage}%"></div>
                </div>
            </div>
        </div>
        <div class="course-footer">
            <button class="edit-btn" data-id="${course.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="view-btn" data-id="${course.id}"><i class="fas fa-eye"></i> View</button>
        </div>
    `;
    
    // Add event listeners to buttons
    const editBtn = courseCard.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        editCourse(course.id);
    });
    
    const viewBtn = courseCard.querySelector('.view-btn');
    viewBtn.addEventListener('click', function() {
        viewCourse(course.id);
    });
    
    return courseCard;
}

/**
 * Edit a course
 * @param {string} courseId - The ID of the course to edit
 */
function editCourse(courseId) {
    // In a real app, this would open a modal to edit the course
    // For this demo, we'll just show an alert
    alert(`Editing course ${courseId}. In a real app, this would open a modal.`);
}

/**
 * View a course
 * @param {string} courseId - The ID of the course to view
 */
function viewCourse(courseId) {
    // In a real app, this would open a modal with course details
    // For this demo, we'll just show an alert
    alert(`Viewing course ${courseId}. In a real app, this would open a modal with full details.`);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Semester select change
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', function() {
            // Reload courses data with the selected semester
            loadCoursesData();
        });
    }
    
    // Add course button
    const addCourseBtn = document.getElementById('add-course-btn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', function() {
            // In a real app, this would open a modal to add a new course
            // For this demo, we'll just show an alert
            alert('In a real app, this would open a modal to add a new course.');
        });
    }
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Filter courses based on search input
            filterCourses(this.value);
        });
    }
}

/**
 * Filter courses based on search input
 * @param {string} query - The search query
 */
function filterCourses(query) {
    const courseCards = document.querySelectorAll('.course-card');
    
    // Convert query to lowercase for case-insensitive search
    query = query.toLowerCase();
    
    courseCards.forEach(card => {
        const courseCode = card.querySelector('.course-header h3').textContent.toLowerCase();
        const courseName = card.querySelector('.course-body h4').textContent.toLowerCase();
        const instructor = card.querySelector('.course-body p:nth-child(2)').textContent.toLowerCase();
        
        // Show card if it matches the query, hide otherwise
        if (courseCode.includes(query) || courseName.includes(query) || instructor.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
