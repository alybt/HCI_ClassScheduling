/**
 * Teacher Courses JavaScript
 * Handles the teacher's courses display and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const semesterSelect = document.getElementById('semester-select');
    const semesterTabs = document.querySelectorAll('.semester-tab');
    const semesterContents = document.querySelectorAll('.semester-content');
    const firstSemesterCourses = document.getElementById('first-semester-courses');
    const secondSemesterCourses = document.getElementById('second-semester-courses');
    const courseDetailsModal = document.getElementById('course-details-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Set default semester to 2nd semester (since it's May 2025)
    semesterSelect.value = '2nd';
    
    // Initialize the semester tabs
    initializeSemesterTabs();
    
    // Load courses
    loadCourses();
    
    // Event listener for semester select
    semesterSelect.addEventListener('change', function() {
        const selectedSemester = this.value;
        
        // Update semester tabs
        semesterTabs.forEach(tab => {
            if (tab.getAttribute('data-semester') === selectedSemester) {
                tab.click();
            }
        });
    });
    
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        courseDetailsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === courseDetailsModal) {
            courseDetailsModal.style.display = 'none';
        }
    });
    
    /**
     * Initialize semester tabs
     */
    function initializeSemesterTabs() {
        // Set 2nd semester tab as active by default
        semesterTabs.forEach(tab => {
            if (tab.getAttribute('data-semester') === '2nd') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Set 2nd semester content as active by default
        semesterContents.forEach(content => {
            if (content.id === '2nd-semester') {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Add click event to semester tabs
        semesterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const semester = this.getAttribute('data-semester');
                
                // Update active tab
                semesterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update active content
                semesterContents.forEach(content => {
                    if (content.id === `${semester}-semester`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
                
                // Update semester select
                semesterSelect.value = semester;
            });
        });
    }
    
    /**
     * Load courses for the teacher
     */
    function loadCourses() {
        // Clear existing courses
        firstSemesterCourses.innerHTML = '';
        secondSemesterCourses.innerHTML = '';
        
        // 1st semester courses data
        const firstSemesterCoursesData = [
            {
                courseCode: 'CC 100',
                courseName: 'INTRODUCING TO COMPUTING',
                schedule: 'MWF 9:00 AM - 10:30 AM',
                room: 'LR 3',
                students: 35,
                type: 'Lecture'
            },
            {
                courseCode: 'CC 100',
                courseName: 'INTRODUCING TO COMPUTING (LAB)',
                schedule: 'TTh 1:00 PM - 3:00 PM',
                room: 'CL 1',
                students: 35,
                type: 'Laboratory'
            },
            {
                courseCode: 'DS 111',
                courseName: 'DISCRETE STRUCTURES 1',
                schedule: 'MWF 10:30 AM - 12:00 PM',
                room: 'LR 5',
                students: 32,
                type: 'Lecture'
            },
            {
                courseCode: 'CC 101',
                courseName: 'COMPUTER PROGRAMMING',
                schedule: 'TTh 9:00 AM - 10:30 AM',
                room: 'LR 4',
                students: 30,
                type: 'Lecture'
            },
            {
                courseCode: 'CC 101',
                courseName: 'COMPUTER PROGRAMMING (LAB)',
                schedule: 'TTh 3:30 PM - 5:30 PM',
                room: 'CL 2',
                students: 30,
                type: 'Laboratory'
            }
        ];
        
        // 2nd semester courses data
        const secondSemesterCoursesData = [
            {
                courseCode: 'CC 102',
                courseName: 'COMPUTER PROGRAMMING 2',
                schedule: 'MWF 9:00 AM - 10:30 AM',
                room: 'LR 3',
                students: 33,
                type: 'Lecture'
            },
            {
                courseCode: 'CC 102',
                courseName: 'COMPUTER PROGRAMMING 2 (LAB)',
                schedule: 'TTh 1:00 PM - 3:00 PM',
                room: 'CL 1',
                students: 33,
                type: 'Laboratory'
            },
            {
                courseCode: 'WD 111',
                courseName: 'WEB DEVELOPMENT 1',
                schedule: 'MWF 10:30 AM - 12:00 PM',
                room: 'LR 5',
                students: 28,
                type: 'Lecture'
            },
            {
                courseCode: 'WD 111',
                courseName: 'WEB DEVELOPMENT 1 (LAB)',
                schedule: 'TTh 3:30 PM - 5:30 PM',
                room: 'CL 2',
                students: 28,
                type: 'Laboratory'
            },
            {
                courseCode: 'HCI 116',
                courseName: 'HUMAN COMPUTER INTERACTION',
                schedule: 'TTh 9:00 AM - 10:30 AM',
                room: 'LR 4',
                students: 25,
                type: 'Lecture'
            },
            {
                courseCode: 'DS 118',
                courseName: 'DISCRETE STRUCTURES 2',
                schedule: 'MWF 1:00 PM - 2:30 PM',
                room: 'LR 6',
                students: 30,
                type: 'Lecture'
            },
            {
                courseCode: 'OOP 112',
                courseName: 'OBJECT ORIENTED PROGRAMMING',
                schedule: 'TTh 10:30 AM - 12:00 PM',
                room: 'LR 2',
                students: 26,
                type: 'Lecture'
            },
            {
                courseCode: 'OOP 112',
                courseName: 'OBJECT ORIENTED PROGRAMMING (LAB)',
                schedule: 'WF 3:30 PM - 5:30 PM',
                room: 'CL 3',
                students: 26,
                type: 'Laboratory'
            }
        ];
        
        // Create course cards for 1st semester
        firstSemesterCoursesData.forEach(course => {
            const courseCard = createCourseCard(course);
            firstSemesterCourses.appendChild(courseCard);
        });
        
        // Create course cards for 2nd semester
        secondSemesterCoursesData.forEach(course => {
            const courseCard = createCourseCard(course);
            secondSemesterCourses.appendChild(courseCard);
        });
    }
    
    /**
     * Create a course card
     * @param {Object} course - The course data
     * @returns {HTMLElement} - The course card element
     */
    function createCourseCard(course) {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        courseCard.innerHTML = `
            <div class="course-header">
                <h3>${course.courseCode}</h3>
                <span class="course-type">${course.type}</span>
            </div>
            <div class="course-body">
                <h4>${course.courseName}</h4>
                <p><i class="fas fa-calendar-alt"></i> ${course.schedule}</p>
                <p><i class="fas fa-door-open"></i> ${course.room}</p>
                <p><i class="fas fa-users"></i> ${course.students} Students</p>
            </div>
            <div class="course-footer">
                <button class="view-details-btn" data-course="${course.courseCode}">View Details</button>
            </div>
        `;
        
        // Add click event to view details button
        const viewDetailsBtn = courseCard.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', function() {
            showCourseDetails(course);
        });
        
        return courseCard;
    }
    
    /**
     * Show course details in modal
     * @param {Object} course - The course data
     */
    function showCourseDetails(course) {
        // Set modal content
        document.getElementById('modal-course-title').textContent = `${course.courseCode}: ${course.courseName}`;
        document.getElementById('modal-course-code').textContent = course.courseCode;
        document.getElementById('modal-course-name').textContent = course.courseName;
        document.getElementById('modal-schedule').textContent = course.schedule;
        document.getElementById('modal-room').textContent = course.room;
        document.getElementById('modal-students').textContent = `${course.students} Students`;
        
        // Populate student list with dummy data
        const studentList = document.getElementById('modal-student-list');
        studentList.innerHTML = '';
        
        // Generate random student data
        for (let i = 1; i <= 5; i++) {
            const studentItem = document.createElement('div');
            studentItem.className = 'student-item';
            
            studentItem.innerHTML = `
                <div class="student-avatar">
                    <img src="assets/img/student-avatar.png" alt="Student ${i}">
                </div>
                <div class="student-info">
                    <h4>Student ${i}</h4>
                    <p>2023-000${i} - BSCS</p>
                </div>
            `;
            
            studentList.appendChild(studentItem);
        }
        
        // Show modal
        courseDetailsModal.style.display = 'flex';
    }
});
