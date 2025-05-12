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
    document.getElementById('prev-day').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDailyView(currentDate);
    });
    
    document.getElementById('next-day').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDailyView(currentDate);
    });
    
    // Weekly view navigation
    document.getElementById('prev-week').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeeklyView(currentDate);
    });
    
    document.getElementById('next-week').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeeklyView(currentDate);
    });
    
    // Monthly view navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthlyView(currentDate);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthlyView(currentDate);
    });
}

function setupClassDetailsModal() {
    // Set up class details modal
    const modal = document.getElementById('class-details-modal');
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
    
    // Extract class information based on the element type
    let courseCode, courseName, courseType, teacher, schedule, room, credits, description;
    
    if (element.classList.contains('class-block')) {
        // Daily view class block
        const header = element.querySelector('.class-header');
        if (header) {
            const title = header.querySelector('h3').textContent;
            [courseCode, courseName] = title.split(': ');
            courseType = header.querySelector('.class-type').textContent;
            
            const info = element.querySelectorAll('.class-info p');
            teacher = info[0].textContent.replace(/^\s*\S+\s*/, ''); // Remove icon
            room = info[1].textContent.replace(/^\s*\S+\s*/, '');
            schedule = info[2].textContent.replace(/^\s*\S+\s*/, '');
            credits = info[3].textContent.replace(/^\s*\S+\s*/, '');
            description = 'Detailed course description will be shown here.';
        }
    } else if (element.classList.contains('schedule-item')) {
        // Weekly view schedule item
        const title = element.querySelector('h4').textContent;
        [courseCode, courseType] = title.split(': ');
        courseName = courseCode === 'CS101' ? 'Introduction to Computing' : 
                    courseCode === 'CS102' ? 'Computer Programming 1' : 
                    courseCode === 'PHYS101' ? 'Physics for Computing' : 'Course Name';
        
        const info = element.querySelectorAll('p');
        const teacherRoom = info[0].textContent.split(' | ');
        teacher = teacherRoom[0];
        room = teacherRoom[1];
        schedule = info[1].textContent;
        credits = courseCode === 'CS101' ? '3 credits' : '4 credits (with lab)';
        description = 'Detailed course description will be shown here.';
    } else if (element.classList.contains('day-class')) {
        // Monthly view day class
        courseCode = element.textContent;
        courseName = courseCode === 'CC 101' ? 'Introduction to Computing' : 'Computer Programming';
        courseType = 'Lecture';
        teacher = 'Dr. Smith';
        room = 'LR 1';
        schedule = 'Monday, 9:00 AM - 12:00 PM';
        credits = '3 credits';
        description = 'Detailed course description will be shown here.';
    }
    
    // Populate modal with class details
    document.getElementById('modal-class-title').textContent = courseName;
    document.getElementById('modal-course-code').textContent = courseCode;
    document.getElementById('modal-course-name').textContent = courseName;
    document.getElementById('modal-course-type').textContent = courseType;
    document.getElementById('modal-teacher').textContent = teacher;
    document.getElementById('modal-schedule').textContent = schedule;
    document.getElementById('modal-room').textContent = room;
    document.getElementById('modal-credits').textContent = credits;
    document.getElementById('modal-description').textContent = description;
    
    // Show modal
    modal.style.display = 'block';
}

function loadSemesterData(semesterId) {
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
}

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
    document.getElementById('prev-day').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDailyView(currentDate);
    });
    
    document.getElementById('next-day').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDailyView(currentDate);
    });
    
    // Weekly view navigation
    document.getElementById('prev-week').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeeklyView(currentDate);
    });
    
    document.getElementById('next-week').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeeklyView(currentDate);
    });
    
    // Monthly view navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthlyView(currentDate);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthlyView(currentDate);
    });
}

function setupClassDetailsModal() {
    // Set up class details modal
    const modal = document.getElementById('class-details-modal');
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
    
    // Extract class information based on the element type
    let courseCode, courseName, courseType, teacher, schedule, room, credits, description;
    
    if (element.classList.contains('class-block')) {
        // Daily view class block
        const header = element.querySelector('.class-header');
        if (header) {
            const title = header.querySelector('h3').textContent;
            [courseCode, courseName] = title.split(': ');
            courseType = header.querySelector('.class-type').textContent;
            
            const info = element.querySelectorAll('.class-info p');
            teacher = info[0].textContent.replace(/^\s*\S+\s*/, ''); // Remove icon
            room = info[1].textContent.replace(/^\s*\S+\s*/, '');
            schedule = info[2].textContent.replace(/^\s*\S+\s*/, '');
            credits = info[3].textContent.replace(/^\s*\S+\s*/, '');
            description = 'Detailed course description will be shown here.';
        }
    } else if (element.classList.contains('schedule-item')) {
        // Weekly view schedule item
        const title = element.querySelector('h4').textContent;
        [courseCode, courseType] = title.split(': ');
        courseName = courseCode === 'CS101' ? 'Introduction to Computing' : 
                    courseCode === 'CS102' ? 'Computer Programming 1' : 
                    courseCode === 'PHYS101' ? 'Physics for Computing' : 'Course Name';
        
        const info = element.querySelectorAll('p');
        const teacherRoom = info[0].textContent.split(' | ');
        teacher = teacherRoom[0];
        room = teacherRoom[1];
        schedule = info[1].textContent;
        credits = courseCode === 'CS101' ? '3 credits' : '4 credits (with lab)';
        description = 'Detailed course description will be shown here.';
    } else if (element.classList.contains('day-class')) {
        // Monthly view day class
        courseCode = element.textContent;
        courseName = courseCode === 'CC 101' ? 'Introduction to Computing' : 'Computer Programming';
        courseType = 'Lecture';
        teacher = 'Dr. Smith';
        room = 'LR 1';
        schedule = 'Monday, 9:00 AM - 12:00 PM';
        credits = '3 credits';
        description = 'Detailed course description will be shown here.';
    }
    
    // Populate modal with class details
    document.getElementById('modal-class-title').textContent = courseName;
    document.getElementById('modal-course-code').textContent = courseCode;
    document.getElementById('modal-course-name').textContent = courseName;
    document.getElementById('modal-course-type').textContent = courseType;
    document.getElementById('modal-teacher').textContent = teacher;
    document.getElementById('modal-schedule').textContent = schedule;
    document.getElementById('modal-room').textContent = room;
    document.getElementById('modal-credits').textContent = credits;
    document.getElementById('modal-description').textContent = description;
    
    // Show modal
    modal.style.display = 'block';
}

function loadSemesterData(semesterId) {
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
}
        
        // Get the first day of the month
        const firstDay = new Date(year, month, 1).getDay();
        
        // Get the number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get the number of days in the previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayEl);
        }
        
        // Add days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = i;
            
            // Check if it's today
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('current');
            }
            
            // Add classes for days with events (this would come from your data)
            // For demonstration, we'll mark some random days
            if (i % 5 === 0) {
                dayEl.classList.add('has-class');
            }
            if (i % 7 === 0) {
                dayEl.classList.add('has-event');
            }
            if (i === 15) {
                dayEl.classList.add('has-holiday');
            }
            
            // Add click event to show day's schedule
            dayEl.addEventListener('click', function() {
                const selectedDate = new Date(year, month, i);
                showDaySchedule(selectedDate);
            });
            
            calendarDays.appendChild(dayEl);
        }
        
        // Add days from next month to fill the grid
        const totalDays = calendarDays.childElementCount;
        const daysToAdd = 35 - totalDays; // 5 rows of 7 days
        
        for (let i = 1; i <= daysToAdd; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = i;
            calendarDays.appendChild(dayEl);
        }
        
        // Update monthly view as well
        updateMonthlyView(month, year);
    }
    
    // Function to update the monthly view
    function updateMonthlyView(month, year) {
        const monthGrid = document.getElementById('month-grid');
        if (!monthGrid) return;
        
        const viewDate = document.querySelector('#monthly-view .view-date');
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        viewDate.textContent = `${months[month]} ${year}`;
        
        // In a real implementation, you would update the monthly calendar grid
        // based on the selected month and year, including holidays specific to Zamboanga City
    }
    
    // Function to show a specific day's schedule
    function showDaySchedule(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('en-US', options);
        
        // Update daily view
        const dailyViewDate = document.querySelector('#daily-view .view-date');
        dailyViewDate.textContent = dateString;
        
        // Switch to daily view
        viewButtons.forEach(btn => btn.classList.remove('active'));
        scheduleViews.forEach(view => view.classList.remove('active'));
        
        document.querySelector('[data-view="daily"]').classList.add('active');
        document.getElementById('daily-view').classList.add('active');
        
        // In a real implementation, you would fetch and display the schedule for this date
        console.log(`Showing schedule for ${dateString}`);
        
        // For demonstration, we'll update the time slots based on the day of the week
        updateDailySchedule(date);
    }
    
    // Function to update the daily schedule
    function updateDailySchedule(date) {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dailySchedule = document.querySelector('.daily-schedule');
        
        // Clear existing class blocks
        const classBlocks = dailySchedule.querySelectorAll('.class-block');
        classBlocks.forEach(block => {
            block.className = 'class-block';
            block.innerHTML = '';
        });
        
        // Add classes based on the day of the week
        // This is just for demonstration - in a real app, this would come from your database
        if (dayOfWeek === 1 || dayOfWeek === 3) { // Monday or Wednesday
            // Add classes for Monday/Wednesday
            const classBlock1 = dailySchedule.children[4].querySelector('.class-block'); // 12:00 PM
            classBlock1.className = 'class-block has-class';
            classBlock1.innerHTML = `
                <div class="class-details">
                    <h3>CC 101</h3>
                    <p>Introduction to Computing</p>
                    <p>Room: 104 ADTECH</p>
                    <p>12:00 PM - 3:00 PM</p>
                </div>
            `;
            
            const classBlock2 = dailySchedule.children[7].querySelector('.class-block'); // 3:00 PM
            classBlock2.className = 'class-block has-class';
            classBlock2.innerHTML = `
                <div class="class-details">
                    <h3>CC 100</h3>
                    <p>Introduction to Computing</p>
                    <p>Room: 104 ADTECH</p>
                    <p>3:00 PM - 5:00 PM</p>
                </div>
            `;
        } else if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday or Thursday
            // Add classes for Tuesday/Thursday
            const classBlock1 = dailySchedule.children[2].querySelector('.class-block'); // 10:00 AM
            classBlock1.className = 'class-block has-class';
            classBlock1.innerHTML = `
                <div class="class-details">
                    <h3>CS 201</h3>
                    <p>Data Structures</p>
                    <p>Room: 105 ADTECH</p>
                    <p>10:00 AM - 1:00 PM</p>
                </div>
            `;
            
            const classBlock2 = dailySchedule.children[9].querySelector('.class-block'); // 5:00 PM
            classBlock2.className = 'class-block has-class';
            classBlock2.innerHTML = `
                <div class="class-details">
                    <h3>CC 100</h3>
                    <p>Introduction to Computing</p>
                    <p>Room: 104 ADTECH</p>
                    <p>5:30 PM - 7:00 PM</p>
                </div>
            `;
        }
        
        // Add click event to class blocks
        const newClassBlocks = dailySchedule.querySelectorAll('.class-block.has-class');
        newClassBlocks.forEach(block => {
            block.addEventListener('click', function() {
                const className = this.querySelector('h3').textContent;
                const classDetails = Array.from(this.querySelectorAll('p')).map(p => p.textContent);
                showClassDetails(className, classDetails);
            });
        });
    }
    
    // Function to update weekly view
    function updateWeeklyView(startDate) {
        const weeklyViewDate = document.querySelector('#weekly-view .view-date');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        const options = { month: 'long', day: 'numeric' };
        const startDateStr = startDate.toLocaleDateString('en-US', options);
        const endDateStr = endDate.toLocaleDateString('en-US', options);
        const yearStr = startDate.getFullYear();
        
        weeklyViewDate.textContent = `${startDateStr} - ${endDateStr}, ${yearStr}`;
        
        // In a real implementation, you would update the weekly schedule grid
        // based on the selected week
    }
    
    // Function to update data based on selected semester
    function updateSemesterData(semester) {
        console.log(`Updating schedule for semester: ${semester}`);
        
        // This would typically involve an API call to fetch data for the selected semester
        if (semester === '1st') {
            console.log('Loading 1st Semester schedule (August to December)');
            // Update calendar with 1st semester data
            
            // For demonstration, we'll set the current date to September
            currentMonth = 8; // September (0-indexed)
            currentYear = 2024;
            updateCalendar(currentMonth, currentYear);
        } else {
            console.log('Loading 2nd Semester schedule (January to May)');
            // Update calendar with 2nd semester data
            
            // For demonstration, we'll set the current date to February
            currentMonth = 1; // February (0-indexed)
            currentYear = 2025;
            updateCalendar(currentMonth, currentYear);
        }
    }
    
    // Function to show class details in a modal
    function showClassDetails(className, details) {
        const modal = document.getElementById('event-details-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalCourse = document.getElementById('modal-course');
        const modalRoom = document.getElementById('modal-room');
        const modalTime = document.getElementById('modal-time');
        const modalInstructor = document.getElementById('modal-instructor');
        const modalStatus = document.getElementById('modal-status');
        
        modalTitle.textContent = `Class Details: ${className}`;
        
        // Parse details
        let courseTitle = '';
        let room = '';
        let time = '';
        
        details.forEach(detail => {
            if (detail.includes('ROOM:')) {
                room = detail.replace('ROOM:', '').trim();
            } else if (detail.includes('TIME:')) {
                time = detail.replace('TIME:', '').trim();
            } else {
                courseTitle = detail;
            }
        });
        
        modalCourse.textContent = `${className} - ${courseTitle}`;
        modalRoom.textContent = room;
        modalTime.textContent = time;
        modalInstructor.textContent = 'Prof. John Doe'; // This would come from your data
        modalStatus.textContent = 'Active'; // This would come from your data
        
        // Show modal
        modal.style.display = 'flex';
        
        // Close modal when clicking the X
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Initialize the page with today's schedule
    const today = new Date();
    showDaySchedule(today);
    
    // Initialize weekly view with current week
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    startOfWeek.setDate(diff);
    
    updateWeeklyView(startOfWeek);
    
    // Add Zamboanga City holidays
    const zamboangeHolidays = [
        { date: '2025-01-01', name: 'New Year\'s Day' },
        { date: '2025-01-15', name: 'Zamboanga City Charter Day' },
        { date: '2025-04-09', name: 'Araw ng Kagitingan' },
        { date: '2025-04-18', name: 'Good Friday' },
        { date: '2025-05-01', name: 'Labor Day' },
        { date: '2025-06-12', name: 'Independence Day' },
        { date: '2025-08-21', name: 'Ninoy Aquino Day' },
        { date: '2025-08-27', name: 'National Heroes Day' },
        { date: '2025-10-08', name: 'Fiesta Pilar' },
        { date: '2025-11-01', name: 'All Saints\' Day' },
        { date: '2025-11-30', name: 'Bonifacio Day' },
        { date: '2025-12-25', name: 'Christmas Day' },
        { date: '2025-12-30', name: 'Rizal Day' }
    ];
    
    // This function would be used to check if a date is a holiday
    function isHoliday(date) {
        const dateString = date.toISOString().split('T')[0];
        return zamboangeHolidays.some(holiday => holiday.date === dateString);
    }
    
    // This function would be used to get holiday name
    function getHolidayName(date) {
        const dateString = date.toISOString().split('T')[0];
        const holiday = zamboangeHolidays.find(h => h.date === dateString);
        return holiday ? holiday.name : '';
    }
});
