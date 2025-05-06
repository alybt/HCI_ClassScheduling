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
    
    // Initialize the semester tabs
    initializeSemesterTabs();
    
    // Load courses
    loadCourses();
    
    // Get URL parameters to check if we need to open a specific course
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    if (courseParam) {
        // Find the course and open its details
        const allCourses = [...firstSemesterCoursesData, ...secondSemesterCoursesData];
        const course = allCourses.find(c => c.courseCode === courseParam);
        if (course) {
            setTimeout(() => showCourseDetails(course), 500);
        }
    }
    
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
    
    /**
     * Initialize semester tabs
     */
    function initializeSemesterTabs() {
        // Get current semester from semester select
        const currentSemester = semesterSelect.value;
        
        // Set current semester tab as active by default
        semesterTabs.forEach(tab => {
            if (tab.getAttribute('data-semester') === currentSemester) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Set current semester content as active by default
        semesterContents.forEach(content => {
            if (content.id === `${currentSemester}-semester`) {
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
        
        // Course data is now loaded from teacher-data.js
        
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
