document.addEventListener('DOMContentLoaded', function() {
    // Initialize view toggle
    const viewButtons = document.querySelectorAll('.toggle-btn');
    const scheduleViews = document.querySelectorAll('.schedule-view');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Remove active class from all buttons and views
            viewButtons.forEach(btn => btn.classList.remove('active'));
            scheduleViews.forEach(view => view.classList.remove('active'));
            
            // Add active class to clicked button and corresponding view
            this.classList.add('active');
            document.getElementById(`${viewType}-view`).classList.add('active');
        });
    });
    
    // Initialize semester selector
    const semesterSelect = document.getElementById('semester-select');
    semesterSelect.addEventListener('change', function() {
        updateSemesterData(this.value);
    });
    
    // Calendar navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthEl = document.getElementById('current-month');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    updateCalendar(currentMonth, currentYear);
    
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar(currentMonth, currentYear);
    });
    
    // Function to update the calendar
    function updateCalendar(month, year) {
        const months = [
            'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
            'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
        ];
        
        currentMonthEl.textContent = months[month];
        
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
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
