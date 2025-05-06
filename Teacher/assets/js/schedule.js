/**
 * Teacher Schedule JavaScript
 * Handles the teacher's schedule display and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const viewToggleBtns = document.querySelectorAll('.view-btn');
    const scheduleViews = document.querySelectorAll('.schedule-view');
    const dayTabs = document.querySelectorAll('.day-tab');
    const daySchedules = document.querySelectorAll('.day-schedule');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const weekDisplay = document.getElementById('week-display');
    const currentDateDisplay = document.getElementById('current-date');
    const semesterSelect = document.getElementById('semester-select');
    const scheduleGrid = document.getElementById('schedule-grid');
    const classDetailsModal = document.getElementById('class-details-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewCourseBtn = document.getElementById('view-course-btn');
    
    // Current date and week
    const currentDate = new Date();
    let currentWeekStart = getWeekStart(currentDate);
    
    // Set current date display
    currentDateDisplay.textContent = formatDate(currentDate);
    
    // Set default semester to 2nd semester (since it's May 2025)
    semesterSelect.value = '2nd';
    
    // Update week display
    updateWeekDisplay();
    
    // Sample schedule data for the teacher
    const teacherSchedule = {
        '1st': {
            'Monday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 100', title: 'INTRODUCING TO COMPUTING', room: 'LR 3', students: 35 },
                { time: '10:30 AM - 12:00 PM', course: 'DS 111', title: 'DISCRETE STRUCTURES 1', room: 'LR 5', students: 32 }
            ],
            'Tuesday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 101', title: 'COMPUTER PROGRAMMING', room: 'LR 4', students: 30 },
                { time: '1:00 PM - 3:00 PM', course: 'CC 100', title: 'INTRODUCING TO COMPUTING (LAB)', room: 'CL 1', students: 35 },
                { time: '3:30 PM - 5:30 PM', course: 'CC 101', title: 'COMPUTER PROGRAMMING (LAB)', room: 'CL 2', students: 30 }
            ],
            'Wednesday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 100', title: 'INTRODUCING TO COMPUTING', room: 'LR 3', students: 35 },
                { time: '10:30 AM - 12:00 PM', course: 'DS 111', title: 'DISCRETE STRUCTURES 1', room: 'LR 5', students: 32 }
            ],
            'Thursday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 101', title: 'COMPUTER PROGRAMMING', room: 'LR 4', students: 30 },
                { time: '1:00 PM - 3:00 PM', course: 'CC 100', title: 'INTRODUCING TO COMPUTING (LAB)', room: 'CL 1', students: 35 },
                { time: '3:30 PM - 5:30 PM', course: 'CC 101', title: 'COMPUTER PROGRAMMING (LAB)', room: 'CL 2', students: 30 }
            ],
            'Friday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 100', title: 'INTRODUCING TO COMPUTING', room: 'LR 3', students: 35 },
                { time: '10:30 AM - 12:00 PM', course: 'DS 111', title: 'DISCRETE STRUCTURES 1', room: 'LR 5', students: 32 }
            ]
        },
        '2nd': {
            'Monday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 102', title: 'COMPUTER PROGRAMMING 2', room: 'LR 3', students: 33 },
                { time: '10:30 AM - 12:00 PM', course: 'WD 111', title: 'WEB DEVELOPMENT 1', room: 'LR 5', students: 28 },
                { time: '1:00 PM - 2:30 PM', course: 'DS 118', title: 'DISCRETE STRUCTURES 2', room: 'LR 6', students: 30 }
            ],
            'Tuesday': [
                { time: '9:00 AM - 10:30 AM', course: 'HCI 116', title: 'HUMAN COMPUTER INTERACTION', room: 'LR 4', students: 25 },
                { time: '10:30 AM - 12:00 PM', course: 'OOP 112', title: 'OBJECT ORIENTED PROGRAMMING', room: 'LR 2', students: 26 },
                { time: '1:00 PM - 3:00 PM', course: 'CC 102', title: 'COMPUTER PROGRAMMING 2 (LAB)', room: 'CL 1', students: 33 },
                { time: '3:30 PM - 5:30 PM', course: 'WD 111', title: 'WEB DEVELOPMENT 1 (LAB)', room: 'CL 2', students: 28 }
            ],
            'Wednesday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 102', title: 'COMPUTER PROGRAMMING 2', room: 'LR 3', students: 33 },
                { time: '10:30 AM - 12:00 PM', course: 'WD 111', title: 'WEB DEVELOPMENT 1', room: 'LR 5', students: 28 },
                { time: '1:00 PM - 2:30 PM', course: 'DS 118', title: 'DISCRETE STRUCTURES 2', room: 'LR 6', students: 30 },
                { time: '3:30 PM - 5:30 PM', course: 'OOP 112', title: 'OBJECT ORIENTED PROGRAMMING (LAB)', room: 'CL 3', students: 26 }
            ],
            'Thursday': [
                { time: '9:00 AM - 10:30 AM', course: 'HCI 116', title: 'HUMAN COMPUTER INTERACTION', room: 'LR 4', students: 25 },
                { time: '10:30 AM - 12:00 PM', course: 'OOP 112', title: 'OBJECT ORIENTED PROGRAMMING', room: 'LR 2', students: 26 },
                { time: '1:00 PM - 3:00 PM', course: 'CC 102', title: 'COMPUTER PROGRAMMING 2 (LAB)', room: 'CL 1', students: 33 },
                { time: '3:30 PM - 5:30 PM', course: 'WD 111', title: 'WEB DEVELOPMENT 1 (LAB)', room: 'CL 2', students: 28 }
            ],
            'Friday': [
                { time: '9:00 AM - 10:30 AM', course: 'CC 102', title: 'COMPUTER PROGRAMMING 2', room: 'LR 3', students: 33 },
                { time: '10:30 AM - 12:00 PM', course: 'WD 111', title: 'WEB DEVELOPMENT 1', room: 'LR 5', students: 28 },
                { time: '1:00 PM - 2:30 PM', course: 'DS 118', title: 'DISCRETE STRUCTURES 2', room: 'LR 6', students: 30 },
                { time: '3:30 PM - 5:30 PM', course: 'OOP 112', title: 'OBJECT ORIENTED PROGRAMMING (LAB)', room: 'CL 3', students: 26 }
            ]
        }
    };

    // Get logged-in teacher information
    const loggedInTeacher = getLoggedInTeacher();
    
    // Initialize schedule
    loadTeacherSchedule();
    
    // Event listeners for view toggle
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active button
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected view
            scheduleViews.forEach(v => v.classList.remove('active'));
            document.getElementById(`${view}-view`).classList.add('active');
        });
    });
    
    // Event listeners for day tabs
    dayTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            
            // Update active tab
            dayTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected day schedule
            daySchedules.forEach(s => s.classList.remove('active'));
            document.getElementById(`${day}-schedule`).classList.add('active');
        });
    });
    
    // Event listeners for week navigation
    prevWeekBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekDisplay();
        loadTeacherSchedule();
    });
    
    nextWeekBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekDisplay();
        loadTeacherSchedule();
    });
    
    // Event listener for semester change
    semesterSelect.addEventListener('change', function() {
        loadTeacherSchedule();
    });
    
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        classDetailsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === classDetailsModal) {
            classDetailsModal.style.display = 'none';
        }
    });
    
    // View course details button
    viewCourseBtn.addEventListener('click', function() {
        const courseCode = document.getElementById('modal-course-code').textContent;
        window.location.href = `courses.html?course=${courseCode}`;
    });
    
    /**
     * Get the logged-in teacher information
     */
    function getLoggedInTeacher() {
        // Get username from session storage
        const username = sessionStorage.getItem('username');
        
        // For demo purposes, we'll use a hardcoded teacher
        // In a real app, this would come from an API call
        return {
            id: 'T001',
            name: 'Dr. Robert Johnson',
            department: 'Computer Science',
            courses: [
                {
                    courseCode: 'CC100',
                    courseName: 'INTRODUCTION TO COMPUTING',
                    schedule: [
                        { day: 'monday', startTime: '9:00', endTime: '10:30', room: 'LR 3' },
                        { day: 'wednesday', startTime: '9:00', endTime: '10:30', room: 'LR 3' },
                        { day: 'friday', startTime: '9:00', endTime: '10:30', room: 'LR 3' }
                    ],
                    students: 35,
                    studentList: [
                        { id: '2023-0001', name: 'Jane Smith', program: 'BSCS' },
                        { id: '2023-0002', name: 'John Doe', program: 'BSIT' },
                        { id: '2023-0003', name: 'Michael Brown', program: 'BSCS' }
                    ]
                },
                {
                    courseCode: 'CC101',
                    courseName: 'COMPUTER PROGRAMMING',
                    schedule: [
                        { day: 'tuesday', startTime: '13:00', endTime: '15:00', room: 'LR 4' },
                        { day: 'thursday', startTime: '13:00', endTime: '15:00', room: 'LR 4' }
                    ],
                    students: 28,
                    studentList: [
                        { id: '2023-0004', name: 'Emily Johnson', program: 'BSCS' },
                        { id: '2023-0005', name: 'David Wilson', program: 'BSIT' },
                        { id: '2023-0006', name: 'Sarah Davis', program: 'BSCS' }
                    ]
                },
                {
                    courseCode: 'DS111',
                    courseName: 'DISCRETE STRUCTURES 1',
                    schedule: [
                        { day: 'monday', startTime: '10:30', endTime: '12:00', room: 'LR 5' },
                        { day: 'wednesday', startTime: '10:30', endTime: '12:00', room: 'LR 5' },
                        { day: 'friday', startTime: '10:30', endTime: '12:00', room: 'LR 5' }
                    ],
                    students: 32,
                    studentList: [
                        { id: '2023-0007', name: 'James Taylor', program: 'BSCS' },
                        { id: '2023-0008', name: 'Emma Martinez', program: 'BSIT' },
                        { id: '2023-0009', name: 'Daniel Anderson', program: 'BSCS' }
                    ]
                }
            ]
        };
    }
    
    /**
     * Load the teacher's schedule
     */
    function loadTeacherSchedule() {
        // Clear existing schedule
        clearSchedule();
        
        // Get selected semester
        const semester = semesterSelect.value;
        
        // Load weekly view
        loadWeeklyView(teacherSchedule[semester]);
        
        // Load list view
        loadListView(teacherSchedule[semester]);
    }
    
    /**
     * Load the weekly view schedule
     * @param {Object} schedule - The teacher's schedule
     */
    function loadWeeklyView(schedule) {
        // Clear existing schedule
        scheduleGrid.innerHTML = '';
        
        // Days of the week
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        // Loop through days
        days.forEach(day => {
            // Loop through schedule for each day
            schedule[day].forEach(item => {
                // Create class item
                const classItem = document.createElement('div');
                classItem.className = 'class-item';
                
                // Calculate position and size
                const dayIndex = days.indexOf(day);
                const startHour = parseInt(item.time.split(' - ')[0].split(' ')[0]);
                const startMinute = parseInt(item.time.split(' - ')[0].split(' ')[1].split(':')[1]);
                const endHour = parseInt(item.time.split(' - ')[1].split(' ')[0]);
                const endMinute = parseInt(item.time.split(' - ')[1].split(' ')[1].split(':')[1]);
                
                // Calculate top position (each hour is 60px)
                const top = (startHour - 7) * 60 + (startMinute / 60) * 60;
                
                // Calculate height (duration in hours * 60px)
                const durationHours = (endHour - startHour) + (endMinute - startMinute) / 60;
                const height = durationHours * 60;
                
                // Set position and size
                classItem.style.top = `${top}px`;
                classItem.style.height = `${height}px`;
                classItem.style.left = `${(dayIndex * 100) / 6}%`;
                classItem.style.width = `${100 / 6}%`;
                
                // Set content
                classItem.innerHTML = `
                    <h3>${item.course}</h3>
                    <p>${item.title}</p>
                    <p>${item.time}</p>
                    <p>Room: ${item.room}</p>
                `;
                
                // Add click event to show details
                classItem.addEventListener('click', function() {
                    showClassDetails(item);
                });
                
                // Add to grid
                scheduleGrid.appendChild(classItem);
            });
        });
    }
    
    /**
     * Load the list view schedule
     * @param {Object} schedule - The teacher's schedule
     */
    function loadListView(schedule) {
        // Days of the week
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        // Clear existing lists
        days.forEach(day => {
            const list = document.getElementById(`${day}-list`);
            list.innerHTML = '';
        });
        
        // Loop through days
        days.forEach(day => {
            // Loop through schedule for each day
            schedule[day].forEach(item => {
                // Create schedule item
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'schedule-item';
                
                // Set content
                scheduleItem.innerHTML = `
                    <div class="schedule-time">
                        <h3>${item.time}</h3>
                    </div>
                    <div class="schedule-details">
                        <h3>${item.course}: ${item.title}</h3>
                        <p>${item.students} Students</p>
                        <p class="room">Room: ${item.room}</p>
                    </div>
                `;
                
                // Add click event to show details
                scheduleItem.addEventListener('click', function() {
                    showClassDetails(item);
                });
                
                // Add to list
                const list = document.getElementById(`${day}-list`);
                list.appendChild(scheduleItem);
            });
        });
    }
    
    /**
     * Show class details in modal
     * @param {Object} item - The class item
     */
    function showClassDetails(item) {
        // Set modal content
        document.getElementById('modal-class-title').textContent = `${item.course}: ${item.title}`;
        document.getElementById('modal-course-code').textContent = item.course;
        document.getElementById('modal-course-name').textContent = item.title;
        
        // Format schedule days
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = days.indexOf(item.day.charAt(0).toUpperCase() + item.day.slice(1));
        document.getElementById('modal-schedule').textContent = `${days[dayIndex]}, ${item.time}`;
        
        document.getElementById('modal-room').textContent = item.room;
        document.getElementById('modal-students').textContent = `${item.students} Students`;
        
        // Populate student list
        const studentList = document.getElementById('modal-student-list');
        studentList.innerHTML = '';
        
        // For demo purposes, we'll use a hardcoded student list
        // In a real app, this would come from an API call
        const students = [
            { id: '2023-0001', name: 'Jane Smith', program: 'BSCS' },
            { id: '2023-0002', name: 'John Doe', program: 'BSIT' },
            { id: '2023-0003', name: 'Michael Brown', program: 'BSCS' }
        ];
        
        students.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.className = 'student-item';
            
            studentItem.innerHTML = `
                <div class="student-avatar">
                    <img src="assets/img/student-avatar.png" alt="${student.name}">
                </div>
                <div class="student-info">
                    <h4>${student.name}</h4>
                    <p>${student.id} - ${student.program}</p>
                </div>
            `;
            
            studentList.appendChild(studentItem);
        });
        
        // Show modal
        classDetailsModal.style.display = 'flex';
    }
    
    /**
     * Clear the schedule
     */
    function clearSchedule() {
        scheduleGrid.innerHTML = '';
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        days.forEach(day => {
            const list = document.getElementById(`${day}-list`);
            list.innerHTML = '';
        });
    }
    
    /**
     * Get the start of the week for a given date
     * @param {Date} date - The date to get the week start for
     * @returns {Date} - The start of the week
     */
    function getWeekStart(date) {
        const result = new Date(date);
        const day = result.getDay();
        const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        result.setDate(diff);
        return result;
    }
    
    /**
     * Update the week display
     */
    function updateWeekDisplay() {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        weekDisplay.textContent = `${formatDate(currentWeekStart)} - ${formatDate(weekEnd)}`;
    }
    
    /**
     * Format a date as Month D, YYYY
     * @param {Date} date - The date to format
     * @returns {string} - The formatted date
     */
    function formatDate(date) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
});
