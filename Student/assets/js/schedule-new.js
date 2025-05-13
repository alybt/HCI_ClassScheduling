document.addEventListener('DOMContentLoaded', function() {
    // Initialize the schedule page
    initSchedulePage();
});

function initSchedulePage() {
    // Initialize current date
    const currentDate = new Date();
    updateDateDisplay(currentDate);
    
    // Set up view toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const scheduleViews = document.querySelectorAll('.schedule-view');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Update active button
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected view
            scheduleViews.forEach(view => {
                if (view.id === viewType + '-view') {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
            
            // Update view-specific displays
            updateViewDisplay(viewType, currentDate);
        });
    });
    
    // Set up navigation buttons
    setupNavigation(currentDate);
    
    // Set up class details modal
    setupClassDetailsModal();
    
    // Set up semester select
    const semesterSelect = document.getElementById('semester-select');
    semesterSelect.addEventListener('change', function() {
        loadSemesterData(this.value);
    });
    
    // Load initial data
    loadSemesterData(semesterSelect.value);
}

function updateDateDisplay(date) {
    // Update the current date display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
}

function updateViewDisplay(viewType, date) {
    switch(viewType) {
        case 'daily':
            updateDailyView(date);
            break;
        case 'weekly':
            updateWeeklyView(date);
            break;
        case 'monthly':
            updateMonthlyView(date);
            break;
    }
}

function updateDailyView(date) {
    // Format date for display
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('day-display').textContent = date.toLocaleDateString('en-US', options);
    
    // In a real application, this would load the schedule data for the selected date
    // For now, we'll just use the static HTML content
}

function updateWeeklyView(date) {
    // Calculate the start and end of the week
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    
    // Format dates for display
    const options = { month: 'long', day: 'numeric' };
    const startStr = startOfWeek.toLocaleDateString('en-US', options);
    const endStr = endOfWeek.toLocaleDateString('en-US', options);
    const yearStr = endOfWeek.getFullYear();
    
    document.getElementById('week-display').textContent = `${startStr} - ${endStr}, ${yearStr}`;
    
    // In a real application, this would load the schedule data for the selected week
    // For now, we'll just use the static HTML content
}

function updateMonthlyView(date) {
    // Format month for display
    const options = { month: 'long', year: 'numeric' };
    document.getElementById('month-display').textContent = date.toLocaleDateString('en-US', options);
    
    // In a real application, this would generate the calendar for the selected month
    // For now, we'll just use the static HTML content
}

function setupNavigation(currentDate) {
    // Daily view navigation
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');
    
    if (prevDayBtn) {
        prevDayBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDateDisplay(currentDate);
            updateDailyView(currentDate);
        });
    }
    
    if (nextDayBtn) {
        nextDayBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDateDisplay(currentDate);
            updateDailyView(currentDate);
        });
    }
    
    // Weekly view navigation
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() - 7);
            updateDateDisplay(currentDate);
            updateWeeklyView(currentDate);
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() + 7);
            updateDateDisplay(currentDate);
            updateWeeklyView(currentDate);
        });
    }
    
    // Monthly view navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateDateDisplay(currentDate);
            updateMonthlyView(currentDate);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateDateDisplay(currentDate);
            updateMonthlyView(currentDate);
        });
    }
}

function setupClassDetailsModal() {
    // Set up class details modal
    const modal = document.getElementById('class-details-modal');
    if (!modal) return;
    
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Add click event to all class blocks
    const classBlocks = document.querySelectorAll('.class-block.has-class');
    classBlocks.forEach(block => {
        block.addEventListener('click', function() {
            openClassDetailsModal(block);
        });
    });
    
    // Add click event to all schedule items in weekly view
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.addEventListener('click', function() {
            openClassDetailsModal(item);
        });
    });
    
    // Add click event to all day classes in monthly view
    const dayClasses = document.querySelectorAll('.day-class');
    dayClasses.forEach(dayClass => {
        dayClass.addEventListener('click', function() {
            openClassDetailsModal(dayClass);
        });
    });
    
    // Close modal when clicking close button or outside the modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openClassDetailsModal(element) {
    const modal = document.getElementById('class-details-modal');
    if (!modal) return;
    
    // Extract class information based on the element type
    let courseCode = '', courseName = '', courseType = '', teacher = '', schedule = '', room = '', credits = '', description = '';
    
    if (element.classList.contains('class-block')) {
        // Daily view class block
        const header = element.querySelector('.class-header');
        if (header) {
            const titleElement = header.querySelector('h3');
            if (titleElement) {
                const titleParts = titleElement.textContent.split(': ');
                courseCode = titleParts[0] || '';
                courseName = titleParts[1] || '';
            }
            
            const typeElement = header.querySelector('.class-type');
            if (typeElement) {
                courseType = typeElement.textContent;
            }
            
            const info = element.querySelectorAll('.class-info p');
            if (info.length > 0) teacher = info[0].textContent.replace(/^\s*\S+\s*/, ''); // Remove icon
            if (info.length > 1) room = info[1].textContent.replace(/^\s*\S+\s*/, '');
            if (info.length > 2) schedule = info[2].textContent.replace(/^\s*\S+\s*/, '');
            if (info.length > 3) credits = info[3].textContent.replace(/^\s*\S+\s*/, '');
            description = 'Detailed course description will be shown here.';
        }
    } else if (element.classList.contains('schedule-item')) {
        // Weekly view schedule item
        const titleElement = element.querySelector('h4');
        if (titleElement) {
            const titleParts = titleElement.textContent.split(': ');
            courseCode = titleParts[0] || '';
            courseType = titleParts[1] || '';
            courseName = courseCode === 'CS101' ? 'Introduction to Computing' : 
                        courseCode === 'CS102' ? 'Computer Programming 1' : 
                        courseCode === 'PHYS101' ? 'Physics for Computing' : 'Course Name';
        }
        
        const info = element.querySelectorAll('p');
        if (info.length > 0) {
            const teacherRoom = info[0].textContent.split(' | ');
            teacher = teacherRoom[0] || '';
            room = teacherRoom.length > 1 ? teacherRoom[1] : '';
        }
        if (info.length > 1) schedule = info[1].textContent;
        credits = courseCode === 'CS101' ? '3 credits' : '4 credits (with lab)';
        description = 'Detailed course description will be shown here.';
    } else if (element.classList.contains('day-class')) {
        // Monthly view day class
        courseCode = element.textContent || '';
        courseName = courseCode === 'CC 101' ? 'Introduction to Computing' : 'Computer Programming';
        courseType = 'Lecture';
        teacher = 'Dr. Smith';
        room = 'LR 1';
        schedule = 'Monday, 9:00 AM - 12:00 PM';
        credits = '3 credits';
        description = 'Detailed course description will be shown here.';
    }
    
    // Populate modal with class details
    const modalElements = {
        'modal-class-title': courseName,
        'modal-course-code': courseCode,
        'modal-course-name': courseName,
        'modal-course-type': courseType,
        'modal-teacher': teacher,
        'modal-schedule': schedule,
        'modal-room': room,
        'modal-credits': credits,
        'modal-description': description
    };
    
    // Update each element if it exists
    Object.entries(modalElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Show modal
    modal.style.display = 'block';
}

function loadSemesterData(semesterId) {
    if (!semesterId) {
        console.error('No semester ID provided');
        return;
    }
    
    console.log(`Loading data for semester ${semesterId}`);
    
    // In a real application, this would fetch data from a server or local storage
    // For now, we'll just simulate loading data
    
    // Sample data structure that would be loaded
    const semesterData = {
        id: semesterId,
        name: semesterId === '1' ? '1st Semester (Aug-Dec)' : 
              semesterId === '2' ? '2nd Semester (Jan-May)' : 'Summer (Jun-Jul)',
        courses: [
            {
                id: 'cs101',
                code: 'CS101',
                name: 'Introduction to Computing',
                type: 'Lecture',
                teacher: 'Dr. Smith',
                room: 'LR 1',
                schedule: 'Monday, 9:00 AM - 12:00 PM',
                credits: 3,
                description: 'Basic concepts of computing and computer science.'
            },
            {
                id: 'phys101-lab',
                code: 'PHYS101',
                name: 'Physics for Computing',
                type: 'Laboratory',
                teacher: 'Prof. Johnson',
                room: 'Lab 1',
                schedule: 'Monday, 1:00 PM - 3:00 PM',
                credits: 4,
                description: 'Laboratory component of Physics for Computing.'
            },
            {
                id: 'cs102',
                code: 'CS102',
                name: 'Computer Programming 1',
                type: 'Lecture',
                teacher: 'Dr. Smith',
                room: 'LR 2',
                schedule: 'Monday, 4:00 PM - 6:00 PM',
                credits: 4,
                description: 'Introduction to programming concepts and problem-solving.'
            }
        ]
    };
    
    // In a real application, this data would be used to populate the schedule views
    // For now, we'll just log it to the console
    console.log('Semester data loaded:', semesterData);
    
    // Update the views with the new data
    const currentView = document.querySelector('.toggle-btn.active');
    if (currentView) {
        const viewType = currentView.getAttribute('data-view');
        const currentDate = new Date();
        updateViewDisplay(viewType, currentDate);
    }
}
