// Global state management
const scheduleState = {
    currentDate: new Date(),
    currentView: 'daily',
    currentSemester: null,
    scheduleData: null,
    isLoading: false,
    error: null
};

document.addEventListener('DOMContentLoaded', function() {
    initSchedulePage();
});

function initSchedulePage() {
    try {
        // Initialize display
        updateDateDisplay(scheduleState.currentDate);
        
        // Set up view toggle buttons
        initializeViewToggle();
        
        // Set up navigation buttons
        setupNavigation();
        
        // Set up class details modal
        setupClassDetailsModal();
        
        // Set up semester select
        initializeSemesterSelect();
        
        // Load initial data
        const semesterSelect = document.getElementById('semester-select');
        loadSemesterData(semesterSelect.value);
    } catch (error) {
        console.error('Failed to initialize schedule page:', error);
        showError('Failed to initialize the schedule. Please refresh the page.');
    }
}

function initializeViewToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const scheduleViews = document.querySelectorAll('.schedule-view');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            try {
                const viewType = this.getAttribute('data-view');
                scheduleState.currentView = viewType;
                
                // Update active button
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show selected view
                scheduleViews.forEach(view => {
                    view.classList.toggle('active', view.id === viewType + '-view');
                });
                
                // Update view-specific displays
                updateViewDisplay(viewType, scheduleState.currentDate);
            } catch (error) {
                console.error('Error switching views:', error);
                showError('Failed to switch views. Please try again.');
            }
        });
    });
}

function initializeSemesterSelect() {
    const semesterSelect = document.getElementById('semester-select');
    semesterSelect.addEventListener('change', function() {
        try {
            scheduleState.currentSemester = this.value;
            loadSemesterData(this.value);
        } catch (error) {
            console.error('Error changing semester:', error);
            showError('Failed to load semester data. Please try again.');
        }
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.schedule-container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function updateDateDisplay(date) {
    if (!date || !(date instanceof Date)) {
        console.error('Invalid date provided to updateDateDisplay');
        showError('Failed to update date display');
        return;
    }

    try {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error updating date display:', error);
        showError('Failed to update date display');
    }
}

function updateViewDisplay(viewType, date) {
    if (!date || !(date instanceof Date)) {
        console.error('Invalid date provided to updateViewDisplay');
        showError('Failed to update view display');
        return;
    }

    if (!['daily', 'weekly', 'monthly'].includes(viewType)) {
        console.error(`Invalid view type: ${viewType}`);
        showError('Failed to update view display');
        return;
    }

    try {
        const viewUpdaters = {
            daily: updateDailyView,
            weekly: updateWeeklyView,
            monthly: updateMonthlyView
        };

        viewUpdaters[viewType](date);

        // Update state
        scheduleState.currentDate = date;
        scheduleState.currentView = viewType;
    } catch (error) {
        console.error('Error updating view display:', error);
        showError('Failed to update schedule view');
    }
}

function updateDailyView(date) {
    try {
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        document.getElementById('day-display').textContent = date.toLocaleDateString('en-US', options);
        
        const dailySchedule = getDailySchedule(date);
        const dailyContainer = document.getElementById('daily-schedule');
        
        if (!dailySchedule || !dailySchedule.length) {
            dailyContainer.innerHTML = '<p class="no-classes">No classes scheduled for this day.</p>';
            return;
        }
        
        renderDailySchedule(dailySchedule);
    } catch (error) {
        console.error('Error updating daily view:', error);
        showError('Failed to update daily schedule');
    }
}

function updateWeeklyView(date) {
    try {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { month: 'long', day: 'numeric' };
        const startStr = startOfWeek.toLocaleDateString('en-US', options);
        const endStr = endOfWeek.toLocaleDateString('en-US', options);
        const yearStr = endOfWeek.getFullYear();
        
        document.getElementById('week-display').textContent = `${startStr} - ${endStr}, ${yearStr}`;
        
        const weeklySchedule = getWeeklySchedule(startOfWeek, endOfWeek);
        if (weeklySchedule && weeklySchedule.length) {
            renderWeeklySchedule(weeklySchedule);
        } else {
            document.getElementById('weekly-schedule').innerHTML = '<p class="no-classes">No classes scheduled for this week.</p>';
        }
    } catch (error) {
        console.error('Error updating weekly view:', error);
        showError('Failed to update weekly schedule');
    }
}

function updateMonthlyView(date) {
    try {
        const options = { month: 'long', year: 'numeric' };
        document.getElementById('month-display').textContent = date.toLocaleDateString('en-US', options);
        
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthlySchedule = getMonthlySchedule(firstDay, lastDay);
        if (monthlySchedule && monthlySchedule.length) {
            renderMonthlySchedule(monthlySchedule);
        } else {
            document.getElementById('monthly-schedule').innerHTML = '<p class="no-classes">No classes scheduled for this month.</p>';
        }
    } catch (error) {
        console.error('Error updating monthly view:', error);
        showError('Failed to update monthly schedule');
    }
}

function getDailySchedule(date) {
    if (!scheduleState.scheduleData) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    return scheduleState.scheduleData.filter(class => {
        const classDate = new Date(class.schedule).toISOString().split('T')[0];
        return classDate === dateStr;
    });
}

function getWeeklySchedule(startDate, endDate) {
    if (!scheduleState.scheduleData) return [];
    
    return scheduleState.scheduleData.filter(class => {
        const classDate = new Date(class.schedule);
        return classDate >= startDate && classDate <= endDate;
    });
}

function getMonthlySchedule(firstDay, lastDay) {
    if (!scheduleState.scheduleData) return [];
    
    return scheduleState.scheduleData.filter(class => {
        const classDate = new Date(class.schedule);
        return classDate >= firstDay && classDate <= lastDay;
    });
}

function renderDailySchedule(schedule) {
    const container = document.getElementById('daily-schedule');
    container.innerHTML = schedule.map(class => `
        <div class="class-block has-class" data-class-id="${class.id}">
            <div class="class-header">
                <h3>${class.code}: ${class.name}</h3>
                <span class="class-type">${class.type}</span>
            </div>
            <div class="class-info">
                <p><i class="fas fa-user"></i> ${class.teacher}</p>
                <p><i class="fas fa-location-dot"></i> ${class.room}</p>
                <p><i class="fas fa-clock"></i> ${formatTime(class.schedule)}</p>
                <p><i class="fas fa-graduation-cap"></i> ${class.credits}</p>
            </div>
        </div>
    `).join('');
}

function renderWeeklySchedule(schedule) {
    // Implementation for rendering weekly schedule
    // This would populate the timetable grid with the schedule data
}

function renderMonthlySchedule(schedule) {
    // Implementation for rendering monthly schedule
    // This would populate the calendar grid with the schedule data
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function setupNavigation() {
    try {
        // Daily view navigation
        document.getElementById('prev-day').addEventListener('click', () => navigateDate('daily', -1));
        document.getElementById('next-day').addEventListener('click', () => navigateDate('daily', 1));
        
        // Weekly view navigation
        document.getElementById('prev-week').addEventListener('click', () => navigateDate('weekly', -7));
        document.getElementById('next-week').addEventListener('click', () => navigateDate('weekly', 7));
        
        // Monthly view navigation
        document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
    } catch (error) {
        console.error('Error setting up navigation:', error);
        showError('Failed to set up schedule navigation');
    }
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

async function loadSemesterData(semesterId) {
    try {
        scheduleState.isLoading = true;
        scheduleState.error = null;
        
        // Show loading state
        const container = document.querySelector('.schedule-container');
        container.classList.add('loading');
        
        // In a real application, this would be an API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const semesterData = {
            id: semesterId,
            name: getSemesterName(semesterId),
            courses: generateSampleCourses(semesterId)
        };
        
        // Process and store the data
        scheduleState.currentSemester = semesterId;
        scheduleState.scheduleData = processSemesterData(semesterData.courses);
        
        // Update the current view
        updateViewDisplay(scheduleState.currentView, scheduleState.currentDate);
        
    } catch (error) {
        console.error('Error loading semester data:', error);
        scheduleState.error = 'Failed to load semester data';
        showError('Failed to load semester data. Please try again.');
    } finally {
        scheduleState.isLoading = false;
        document.querySelector('.schedule-container').classList.remove('loading');
    }
}

function initSchedulePage() {
    try {
        // Initialize display
        updateDateDisplay(scheduleState.currentDate);
        
        // Set up view toggle buttons
        initializeViewToggle();
        
        // Set up navigation buttons
        setupNavigation();
        
        // Set up class details modal
        setupClassDetailsModal();
        
        // Set up semester select
        initializeSemesterSelect();
        
        // Load initial data
        const semesterSelect = document.getElementById('semester-select');
        loadSemesterData(semesterSelect.value);
    } catch (error) {
        console.error('Failed to initialize schedule page:', error);
        showError('Failed to initialize the schedule. Please refresh the page.');
    }
}

function updateDateDisplay(date) {
    if (!date || !(date instanceof Date)) {
        console.error('Invalid date provided to updateDateDisplay');
        showError('Failed to update date display');
        return;
    }

    try {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error updating date display:', error);
        showError('Failed to update date display');
    }
}

function updateViewDisplay(viewType, date) {
    if (!date || !(date instanceof Date)) {
        console.error('Invalid date provided to updateViewDisplay');
        showError('Failed to update view display');
        return;
    }

    if (!['daily', 'weekly', 'monthly'].includes(viewType)) {
        console.error(`Invalid view type: ${viewType}`);
        showError('Failed to update view display');
        return;
    }

    try {
        const viewUpdaters = {
            daily: updateDailyView,
            weekly: updateWeeklyView,
            monthly: updateMonthlyView
        };

        viewUpdaters[viewType](date);

        // Update state
        scheduleState.currentDate = date;
        scheduleState.currentView = viewType;
    } catch (error) {
        console.error('Error updating view display:', error);
        showError('Failed to update schedule view');
    }
}

function updateDailyView(date) {
    try {
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        document.getElementById('day-display').textContent = date.toLocaleDateString('en-US', options);
        
        const dailySchedule = getDailySchedule(date);
        const dailyContainer = document.getElementById('daily-schedule');
        
        if (!dailySchedule || !dailySchedule.length) {
            dailyContainer.innerHTML = '<p class="no-classes">No classes scheduled for this day.</p>';
            return;
        }
        
        renderDailySchedule(dailySchedule);
    } catch (error) {
        console.error('Error updating daily view:', error);
        showError('Failed to update daily schedule');
    }
}

function updateWeeklyView(date) {
    try {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { month: 'long', day: 'numeric' };
        const startStr = startOfWeek.toLocaleDateString('en-US', options);
        const endStr = endOfWeek.toLocaleDateString('en-US', options);
        const yearStr = endOfWeek.getFullYear();
        
        document.getElementById('week-display').textContent = `${startStr} - ${endStr}, ${yearStr}`;
        
        const weeklySchedule = getWeeklySchedule(startOfWeek, endOfWeek);
        if (weeklySchedule && weeklySchedule.length) {
            renderWeeklySchedule(weeklySchedule);
        } else {
            document.getElementById('weekly-schedule').innerHTML = '<p class="no-classes">No classes scheduled for this week.</p>';
        }
    } catch (error) {
        console.error('Error updating weekly view:', error);
        showError('Failed to update weekly schedule');
    }
}

function updateMonthlyView(date) {
    try {
        const options = { month: 'long', year: 'numeric' };
        document.getElementById('month-display').textContent = date.toLocaleDateString('en-US', options);
        
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthlySchedule = getMonthlySchedule(firstDay, lastDay);
        if (monthlySchedule && monthlySchedule.length) {
            renderMonthlySchedule(monthlySchedule);
        } else {
            document.getElementById('monthly-schedule').innerHTML = '<p class="no-classes">No classes scheduled for this month.</p>';
        }
    } catch (error) {
        console.error('Error updating monthly view:', error);
        showError('Failed to update monthly schedule');
    }
}

function getDailySchedule(date) {
    if (!scheduleState.scheduleData) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    return scheduleState.scheduleData.filter(class => {
        const classDate = new Date(class.schedule).toISOString().split('T')[0];
        return classDate === dateStr;
    });
}

function getWeeklySchedule(startDate, endDate) {
    if (!scheduleState.scheduleData) return [];
    
    return scheduleState.scheduleData.filter(class => {
        const classDate = new Date(class.schedule);
        return classDate >= startDate && classDate <= endDate;
    });
}

function getMonthlySchedule(firstDay, lastDay) {
    if (!scheduleState.scheduleData) return [];
    
    return scheduleState.scheduleData.filter(class => {
        const classDate = new Date(class.schedule);
        return classDate >= firstDay && classDate <= lastDay;
    });
}

function renderDailySchedule(schedule) {
    const container = document.getElementById('daily-schedule');
    container.innerHTML = schedule.map(class => `
        <div class="class-block has-class" data-class-id="${class.id}">
            <div class="class-header">
                <h3>${class.code}: ${class.name}</h3>
                <span class="class-type">${class.type}</span>
            </div>
            <div class="class-info">
                <p><i class="fas fa-user"></i> ${class.teacher}</p>
                <p><i class="fas fa-location-dot"></i> ${class.room}</p>
                <p><i class="fas fa-clock"></i> ${formatTime(class.schedule)}</p>
                <p><i class="fas fa-graduation-cap"></i> ${class.credits}</p>
            </div>
        </div>
    `).join('');
}

function renderWeeklySchedule(schedule) {
    // Implementation for rendering weekly schedule
    // This would populate the timetable grid with the schedule data
}

function renderMonthlySchedule(schedule) {
    // Implementation for rendering monthly schedule
    // This would populate the calendar grid with the schedule data
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function setupNavigation() {
    try {
        // Daily view navigation
        document.getElementById('prev-day').addEventListener('click', () => navigateDate('daily', -1));
        document.getElementById('next-day').addEventListener('click', () => navigateDate('daily', 1));
        
        // Weekly view navigation
        document.getElementById('prev-week').addEventListener('click', () => navigateDate('weekly', -7));
        document.getElementById('next-week').addEventListener('click', () => navigateDate('weekly', 7));
        
        // Monthly view navigation
        document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
    } catch (error) {
        console.error('Error setting up navigation:', error);
        showError('Failed to set up schedule navigation');
    }
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

async function loadSemesterData(semesterId) {
    try {
        scheduleState.isLoading = true;
        scheduleState.error = null;
        
        // Show loading state
        const container = document.querySelector('.schedule-container');
        container.classList.add('loading');
        
        // In a real application, this would be an API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const semesterData = {
            id: semesterId,
            name: getSemesterName(semesterId),
            courses: generateSampleCourses(semesterId)
        };
        
        // Process and store the data
        scheduleState.currentSemester = semesterId;
        scheduleState.scheduleData = processSemesterData(semesterData.courses);
        
        // Update the current view
        updateViewDisplay(scheduleState.currentView, scheduleState.currentDate);
        
    } catch (error) {
        console.error('Error loading semester data:', error);
        scheduleState.error = 'Failed to load semester data';
        showError('Failed to load semester data. Please try again.');
    } finally {
        scheduleState.isLoading = false;
        document.querySelector('.schedule-container').classList.remove('loading');
    }
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
        if (!dailySchedule) {
            console.error('Daily schedule container not found');
            return;
        }

        // Update schedule date display
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const scheduleDate = document.querySelector('.schedule-date');
        if (scheduleDate) {
            scheduleDate.textContent = date.toLocaleDateString('en-US', options);
        }
        
        // Clear existing class blocks
        const classBlocks = dailySchedule.querySelectorAll('.class-block');
        classBlocks.forEach(block => {
            block.className = 'class-block';
            block.innerHTML = '';
        });

        // Get user's enrolled courses from session storage or API
        let enrolledCourses;
        try {
            enrolledCourses = JSON.parse(sessionStorage.getItem('enrolledCourses')) || [];
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
            enrolledCourses = [];
        }

        // Filter courses for the current day
        const todayCourses = enrolledCourses.filter(course => {
            const courseSchedule = course.schedule.split(' ')[0]; // Get days part of schedule
            const days = courseSchedule.split('');
            const dayMap = { 'M': 1, 'T': 2, 'W': 3, 'H': 4, 'F': 5 };
            return days.some(day => dayMap[day] === dayOfWeek);
        });

        // Sort courses by start time
        todayCourses.sort((a, b) => {
            const timeA = a.schedule.split(' ')[1]; // Get time part of schedule
            const timeB = b.schedule.split(' ')[1];
            return new Date('1970/01/01 ' + timeA) - new Date('1970/01/01 ' + timeB);
        });

        // Add courses to schedule
        todayCourses.forEach(course => {
            const [startTime] = course.schedule.split(' - ')[0].split(' ').slice(-1);
            const timeIndex = getTimeSlotIndex(startTime);
            
            if (timeIndex !== -1 && dailySchedule.children[timeIndex]) {
                const classBlock = dailySchedule.children[timeIndex].querySelector('.class-block');
                classBlock.className = 'class-block has-class';
                classBlock.innerHTML = `
                    <div class="class-details">
                        <h3>${course.code}</h3>
                        <p>${course.title}</p>
                        <p>Room: ${course.room}</p>
                        <p>${course.schedule}</p>
                    </div>
                `;

                // Add click event listener
                classBlock.addEventListener('click', () => {
                    showClassDetails(course.code, [
                        course.title,
                        `Room: ${course.room}`,
                        course.schedule,
                        `Professor: ${course.teacher}`,
                        `Enrolled: ${course.enrolled}/${course.capacity}`
                    ]);
                });
            }
        });

        // Dispatch schedule updated event
        const event = new CustomEvent('scheduleUpdated', {
            detail: {
                date: date,
                courses: todayCourses,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    // Helper function to get time slot index
    function getTimeSlotIndex(time) {
        const timeSlots = [
            '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
            '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
            '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
        ];
        return timeSlots.indexOf(time);
    }
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
