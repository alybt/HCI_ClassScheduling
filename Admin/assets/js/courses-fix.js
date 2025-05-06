// Improved Courses Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseModal = document.getElementById('course-modal');
    const courseDetailsModal = document.getElementById('course-details-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelCourseBtn = document.getElementById('cancel-course');
    const saveCourseBtn = document.getElementById('save-course');
    const closeDetailsBtn = document.getElementById('close-details');
    const editFromDetailsBtn = document.getElementById('edit-from-details');
    const viewButtons = document.querySelectorAll('.btn-view');
    const editButtons = document.querySelectorAll('.btn-edit');
    const studentButtons = document.querySelectorAll('.btn-students');
    const viewAllStudentsBtn = document.getElementById('view-all-students');
    const departmentFilter = document.getElementById('department-filter');
    const semesterFilter = document.getElementById('semester-filter');
    const statusFilter = document.getElementById('status-filter');
    const courseForm = document.getElementById('course-form');
    const courseTable = document.querySelector('.course-table tbody');
    const paginationBtns = document.querySelectorAll('.pagination button');
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');

    // Sample course data
    const courses = [
        {
            id: 'CS101',
            name: 'Introduction to Programming',
            department: 'Computer Science',
            credits: 3,
            instructor: 'Prof. John Doe',
            schedule: 'MWF 10:00 AM - 11:30 AM',
            status: 'active',
            prerequisites: 'None',
            description: 'An introduction to the fundamentals of computer programming. Students will learn problem-solving and algorithm development, as well as basic programming concepts such as variables, control structures, functions, and arrays.',
            room: 'LR 1',
            capacity: 40,
            enrolled: 25,
            icon: 'laptop-code'
        },
        {
            id: 'CS201',
            name: 'Data Structures',
            department: 'Computer Science',
            credits: 4,
            instructor: 'Prof. Jane Smith',
            schedule: 'TTh 1:00 PM - 3:00 PM',
            status: 'active',
            prerequisites: 'CS 101',
            description: 'A study of data structures and algorithms fundamental to computer science; abstract data-type concepts; stacks, queues, linked lists, trees, and graphs; searching and sorting algorithms.',
            room: 'LR 2',
            capacity: 35,
            enrolled: 30,
            icon: 'project-diagram'
        },
        {
            id: 'IT101',
            name: 'Information Technology Fundamentals',
            department: 'Information Technology',
            credits: 3,
            instructor: 'Prof. Maria Garcia',
            schedule: 'MWF 1:00 PM - 2:30 PM',
            status: 'active',
            prerequisites: 'None',
            description: 'An introduction to the field of Information Technology, including computer hardware, software, networking, and cybersecurity concepts.',
            room: 'LR 3',
            capacity: 40,
            enrolled: 38,
            icon: 'server'
        },
        {
            id: 'IS201',
            name: 'Database Management Systems',
            department: 'Information Systems',
            credits: 4,
            instructor: 'Prof. Robert Johnson',
            schedule: 'TTh 9:00 AM - 11:00 AM',
            status: 'active',
            prerequisites: 'CS 101',
            description: 'Introduction to database concepts, data models, database normalization, data description languages, query facilities, file organization, index organization, file security, and data integrity and reliability.',
            room: 'Lab 1',
            capacity: 30,
            enrolled: 28,
            icon: 'database'
        },
        {
            id: 'MATH101',
            name: 'Calculus I',
            department: 'Mathematics',
            credits: 4,
            instructor: 'Prof. William Chen',
            schedule: 'MWF 8:00 AM - 9:30 AM',
            status: 'inactive',
            prerequisites: 'None',
            description: 'Introduction to calculus of a single variable. Topics include limits, derivatives, applications of differentiation, and integration.',
            room: 'LR 4',
            capacity: 40,
            enrolled: 0,
            icon: 'calculator'
        }
    ];

    // Sample student data for course details
    const students = [
        { id: 'S-2025-001', name: 'Jane Smith', program: 'BS Computer Science', year: '3rd Year' },
        { id: 'S-2025-002', name: 'John Doe', program: 'BS Information Technology', year: '2nd Year' },
        { id: 'S-2025-003', name: 'Maria Garcia', program: 'BS Information Systems', year: '4th Year' },
        { id: 'S-2025-004', name: 'Robert Johnson', program: 'BS Computer Science', year: '1st Year' },
        { id: 'S-2025-005', name: 'William Chen', program: 'BS Information Technology', year: '3rd Year' }
    ];

    // Add event listeners
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', openAddCourseModal);
    }

    if (cancelCourseBtn) {
        cancelCourseBtn.addEventListener('click', closeCourseModal);
    }

    if (saveCourseBtn) {
        saveCourseBtn.addEventListener('click', saveCourse);
    }

    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeDetailsModal);
    }

    if (editFromDetailsBtn) {
        editFromDetailsBtn.addEventListener('click', editFromDetails);
    }

    if (viewAllStudentsBtn) {
        viewAllStudentsBtn.addEventListener('click', viewAllStudents);
    }

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (courseModal) courseModal.style.display = 'none';
            if (courseDetailsModal) courseDetailsModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (courseModal && event.target === courseModal) {
            courseModal.style.display = 'none';
        }
        if (courseDetailsModal && event.target === courseDetailsModal) {
            courseDetailsModal.style.display = 'none';
        }
    });

    // Add event listeners to view buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.closest('tr').querySelector('td:first-child').textContent.replace(' ', '');
            openCourseDetails(courseId);
        });
    });

    // Add event listeners to edit buttons
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.closest('tr').querySelector('td:first-child').textContent.replace(' ', '');
            openEditCourseModal(courseId);
        });
    });

    // Add event listeners to student buttons
    studentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.closest('tr').querySelector('td:first-child').textContent.replace(' ', '');
            viewCourseStudents(courseId);
        });
    });

    // Add event listeners to filters
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterCourses);
    }
    
    if (semesterFilter) {
        semesterFilter.addEventListener('change', filterCourses);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterCourses);
    }

    // Add event listeners to pagination buttons
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active') && !this.classList.contains('btn-prev') && !this.classList.contains('btn-next')) {
                document.querySelector('.pagination button.active').classList.remove('active');
                this.classList.add('active');
                // In a real application, this would load the corresponding page of data
            }
        });
    });

    // Add event listener to search
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchCourses();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCourses();
                e.preventDefault();
            }
        });
    }

    // Functions
    function openAddCourseModal() {
        document.querySelector('.modal-header h2').textContent = 'Add New Course';
        courseForm.reset();
        courseModal.style.display = 'block';
    }

    function openEditCourseModal(courseId) {
        // Find course by ID
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        // Update modal title
        document.querySelector('.modal-header h2').textContent = 'Edit Course';

        // Populate form fields
        document.getElementById('course-code').value = course.id;
        document.getElementById('course-name').value = course.name;
        document.getElementById('course-department').value = course.department.toLowerCase().replace(' ', '');
        document.getElementById('course-credits').value = course.credits;
        document.getElementById('course-instructor').value = course.instructor;
        
        // Split schedule into days and time
        const scheduleParts = course.schedule.split(' ');
        document.getElementById('course-days').value = scheduleParts[0];
        document.getElementById('course-start-time').value = convertToTimeInput(scheduleParts[1] + ' ' + scheduleParts[2]);
        document.getElementById('course-end-time').value = convertToTimeInput(scheduleParts[4] + ' ' + scheduleParts[5]);
        
        document.getElementById('course-status').value = course.status;
        document.getElementById('course-prerequisites').value = course.prerequisites;
        document.getElementById('course-description').value = course.description;
        document.getElementById('course-room').value = course.room;
        document.getElementById('course-capacity').value = course.capacity;

        // Show modal
        courseModal.style.display = 'block';
    }

    function convertToTimeInput(timeStr) {
        // Convert "10:00 AM" to "10:00" format for time input
        // This is a simplified version, in a real app you would need more robust conversion
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        
        if (period === 'PM' && hours !== '12') {
            return `${parseInt(hours) + 12}:${minutes}`;
        } else if (period === 'AM' && hours === '12') {
            return `00:${minutes}`;
        }
        
        return time;
    }

    function closeCourseModal() {
        courseModal.style.display = 'none';
    }

    function saveCourse() {
        // Get form values
        const courseCode = document.getElementById('course-code').value.trim();
        const courseName = document.getElementById('course-name').value.trim();
        
        // Simple validation
        if (!courseCode || !courseName) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Close modal
        courseModal.style.display = 'none';
        
        // Show success message (in a real app, you would update the UI with the new/updated course)
        alert(`Course ${courseCode} has been saved successfully!`);
        
        // Refresh the table (in a real app)
        // refreshCourseTable();
    }

    function openCourseDetails(courseId) {
        // Find course by ID
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        // Populate course details
        document.getElementById('detail-course-name').textContent = `${course.id} - ${course.name}`;
        document.getElementById('detail-course-department').textContent = `${course.department} Department`;
        document.getElementById('detail-course-credits').textContent = `${course.credits} Credits`;
        document.getElementById('detail-course-status').textContent = course.status.charAt(0).toUpperCase() + course.status.slice(1);
        document.getElementById('detail-course-status').className = `status-badge ${course.status}`;
        document.getElementById('detail-course-description').textContent = course.description;
        document.getElementById('detail-course-prerequisites').textContent = course.prerequisites;
        document.getElementById('detail-course-instructor').textContent = course.instructor;
        document.getElementById('detail-course-schedule').textContent = course.schedule;
        document.getElementById('detail-course-room').textContent = course.room;
        document.getElementById('detail-course-capacity').textContent = `${course.capacity} students`;
        document.getElementById('detail-course-enrolled').textContent = `${course.enrolled} students`;

        // Populate enrolled students (first 3 for demo)
        const studentsTable = document.getElementById('detail-course-students');
        studentsTable.innerHTML = '';
        
        // In a real app, you would filter students enrolled in this specific course
        for (let i = 0; i < Math.min(3, students.length); i++) {
            const student = students[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.program}</td>
                <td>${student.year}</td>
            `;
            studentsTable.appendChild(row);
        }

        // Update course icon
        const iconElement = document.querySelector('.course-icon-large i');
        if (iconElement) {
            iconElement.className = `fas fa-${course.icon}`;
        }

        // Show modal
        if (courseDetailsModal) {
            courseDetailsModal.style.display = 'block';
        }
    }

    function closeDetailsModal() {
        if (courseDetailsModal) {
            courseDetailsModal.style.display = 'none';
        }
    }

    function editFromDetails() {
        // Get course ID from details modal
        const courseNameElement = document.getElementById('detail-course-name');
        if (!courseNameElement) return;
        
        const courseId = courseNameElement.textContent.split(' - ')[0];
        
        // Close details modal
        if (courseDetailsModal) {
            courseDetailsModal.style.display = 'none';
        }
        
        // Open edit modal
        openEditCourseModal(courseId);
    }

    function viewCourseStudents(courseId) {
        // In a real application, this would open a modal or page showing all students enrolled in the course
        // For this demo, we'll just open the course details modal which shows some students
        openCourseDetails(courseId);
    }

    function viewAllStudents() {
        // In a real application, this would navigate to a page showing all students enrolled in the course
        // For this demo, we'll just show an alert
        alert('This would show all students enrolled in the course.');
    }

    function filterCourses() {
        // In a real application, this would filter the courses based on the selected filters
        const department = departmentFilter ? departmentFilter.value : 'all';
        const semester = semesterFilter ? semesterFilter.value : 'all';
        const status = statusFilter ? statusFilter.value : 'all';
        
        // Apply filters to table rows
        const rows = courseTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            let showRow = true;
            
            // Department filter
            if (department !== 'all') {
                const rowDepartment = row.querySelector('td:nth-child(3)').textContent;
                if (!rowDepartment.toLowerCase().includes(department.toLowerCase())) {
                    showRow = false;
                }
            }
            
            // Status filter
            if (status !== 'all') {
                const statusBadge = row.querySelector('.status-badge');
                if (statusBadge && !statusBadge.classList.contains(status)) {
                    showRow = false;
                }
            }
            
            // Show/hide row
            row.style.display = showRow ? '' : 'none';
        });
    }
    
    function searchCourses() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        
        if (!searchTerm) return;
        
        // Apply search to table rows
        const rows = courseTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }
    
    // Initialize responsive table
    initResponsiveTable();
    
    function initResponsiveTable() {
        // Add data attributes to table cells for mobile view
        const headers = document.querySelectorAll('.course-table th');
        const rows = document.querySelectorAll('.course-table tbody tr');
        
        if (headers.length === 0 || rows.length === 0) return;
        
        const headerTexts = Array.from(headers).map(header => header.textContent);
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index < headerTexts.length) {
                    cell.setAttribute('data-label', headerTexts[index]);
                }
            });
        });
    }
});
