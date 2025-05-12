/**
 * Schedule Manager JavaScript
 * Handles the scheduling system with weekly, daily, and monthly views
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize data storage
    let scheduleData = {
        courses: {},
        teachers: {},
        rooms: {},
        schedules: {},
        constraints: {
            maxHoursPerDay: 8,
            lunchBreak: '12:00-13:00',
            avoidEvening: false,
            consecutiveLabs: true
        }
    };

    // DOM Elements
    const weeklyView = document.getElementById('weekly-view');
    const dailyView = document.getElementById('daily-view');
    const monthlyView = document.getElementById('monthly-view');
    
    const weeklyScheduleGrid = document.getElementById('weekly-schedule-grid');
    const dailySchedule = document.getElementById('daily-schedule');
    const monthlyCalendar = document.getElementById('monthly-calendar');
    
    const weekDisplay = document.getElementById('week-display');
    const dayDisplay = document.getElementById('day-display');
    const monthDisplay = document.getElementById('month-display');
    
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    const generateScheduleBtn = document.getElementById('generate-schedule-btn');
    const confirmGenerateBtn = document.getElementById('confirm-generate-btn');
    const editScheduleBtn = document.getElementById('edit-schedule-btn');
    const saveScheduleBtn = document.getElementById('save-schedule-btn');
    
    const programFilter = document.getElementById('program-filter');
    const yearFilter = document.getElementById('year-filter');
    const teacherFilter = document.getElementById('teacher-filter');
    const roomFilter = document.getElementById('room-filter');
    
    const maxHoursPerDay = document.getElementById('max-hours-per-day');
    const lunchBreak = document.getElementById('lunch-break');
    const avoidEvening = document.getElementById('avoid-evening');
    const consecutiveLabs = document.getElementById('consecutive-labs');
    
    const unassignedCourses = document.getElementById('unassigned-courses');
    const semesterSelect = document.getElementById('semester-select');
    
    // State variables
    let currentDate = new Date();
    let currentView = 'weekly';
    let currentSemester = 1;
    let currentFilters = {
        program: 'all',
        year: 'all',
        teacher: 'all',
        room: 'all'
    };
    let currentScheduleItemId = null;
    let isEditMode = false;

    // Load data from localStorage if exists
    function loadData() {
        // Load curriculum data (courses, programs)
        const curriculumData = localStorage.getItem('curriculumManagerData');
        if (curriculumData) {
            const parsedData = JSON.parse(curriculumData);
            scheduleData.courses = parsedData.subjects || {};
        }
        
        // Load schedule data
        const savedScheduleData = localStorage.getItem('scheduleManagerData');
        if (savedScheduleData) {
            const parsedScheduleData = JSON.parse(savedScheduleData);
            scheduleData.teachers = parsedScheduleData.teachers || {};
            scheduleData.rooms = parsedScheduleData.rooms || {};
            scheduleData.schedules = parsedScheduleData.schedules || {};
            scheduleData.constraints = parsedScheduleData.constraints || {
                maxHoursPerDay: 8,
                lunchBreak: '12:00-13:00',
                avoidEvening: false,
                consecutiveLabs: true
            };
        } else {
            // Initialize with sample data if no data exists
            initializeSampleData();
        }
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('scheduleManagerData', JSON.stringify({
            teachers: scheduleData.teachers,
            rooms: scheduleData.rooms,
            schedules: scheduleData.schedules,
            constraints: scheduleData.constraints
        }));
    }

    // Initialize with sample data for demonstration
    function initializeSampleData() {
        // Sample rooms
        scheduleData.rooms = {
            'room-lr1': {
                id: 'room-lr1',
                name: 'LR 1',
                type: 'lecture',
                capacity: 40,
                building: 'Main Building',
                floor: 1
            },
            'room-lr2': {
                id: 'room-lr2',
                name: 'LR 2',
                type: 'lecture',
                capacity: 35,
                building: 'Main Building',
                floor: 1
            },
            'room-lab1': {
                id: 'room-lab1',
                name: 'Computer Lab 1',
                type: 'lab',
                capacity: 30,
                building: 'Science Building',
                floor: 2
            }
        };
        
        // Sample teachers (if not loaded from curriculum manager)
        if (Object.keys(scheduleData.teachers).length === 0) {
            scheduleData.teachers = {
                'teacher-smith': {
                    id: 'teacher-smith',
                    name: 'Dr. Smith',
                    department: 'Computer Science',
                    expertise: ['Programming', 'Algorithms'],
                    availability: {
                        monday: ['8:00-17:00'],
                        tuesday: ['8:00-17:00'],
                        wednesday: ['8:00-17:00'],
                        thursday: ['8:00-17:00'],
                        friday: ['8:00-17:00']
                    }
                },
                'teacher-johnson': {
                    id: 'teacher-johnson',
                    name: 'Prof. Johnson',
                    department: 'Physics',
                    expertise: ['Physics', 'Mathematics'],
                    availability: {
                        monday: ['10:00-19:00'],
                        tuesday: ['10:00-19:00'],
                        wednesday: ['10:00-19:00'],
                        thursday: ['10:00-19:00'],
                        friday: ['10:00-16:00']
                    }
                }
            };
        }
        
        // Sample schedules
        scheduleData.schedules = {
            'schedule-cs101-lecture': {
                id: 'schedule-cs101-lecture',
                courseId: 'cs101-subject',
                teacherId: 'teacher-smith',
                roomId: 'room-lr1',
                day: 'monday',
                startTime: '9:00',
                endTime: '12:00',
                type: 'lecture',
                semester: 1,
                year: 2025
            },
            'schedule-cs102-lecture': {
                id: 'schedule-cs102-lecture',
                courseId: 'cs102-subject',
                teacherId: 'teacher-smith',
                roomId: 'room-lr2',
                day: 'tuesday',
                startTime: '13:00',
                endTime: '15:00',
                type: 'lecture',
                semester: 1,
                year: 2025
            },
            'schedule-cs102-lab': {
                id: 'schedule-cs102-lab',
                courseId: 'cs102-subject',
                teacherId: 'teacher-smith',
                roomId: 'room-lab1',
                day: 'thursday',
                startTime: '13:00',
                endTime: '15:00',
                type: 'lab',
                semester: 1,
                year: 2025
            }
        };
        
        saveData();
    }

    // Render weekly schedule
    function renderWeeklySchedule() {
        if (!weeklyScheduleGrid) return;
        
        // Clear current grid
        weeklyScheduleGrid.innerHTML = '';
        
        // Create grid cells (6 days x 13 hours)
        for (let day = 0; day < 6; day++) {
            for (let hour = 0; hour < 13; hour++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.setAttribute('data-day', day);
                cell.setAttribute('data-hour', hour + 7); // Starting from 7 AM
                weeklyScheduleGrid.appendChild(cell);
            }
        }
        
        // Get current week's start and end dates
        const weekStart = getWeekStartDate(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 5); // Monday to Saturday
        
        // Update week display
        weekDisplay.textContent = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
        
        // Filter schedules for current semester and week
        const filteredSchedules = filterSchedules();
        
        // Render schedule items
        filteredSchedules.forEach(schedule => {
            renderScheduleItem(schedule);
        });
    }

    // Render a schedule item in the weekly grid
    function renderScheduleItem(schedule) {
        // Convert day string to index (0 = Monday, 5 = Saturday)
        const dayIndex = getDayIndex(schedule.day);
        
        // Convert time to hour index
        const startHour = parseInt(schedule.startTime.split(':')[0]);
        const endHour = parseInt(schedule.endTime.split(':')[0]);
        const duration = endHour - startHour;
        
        // Find the corresponding cell
        const startCell = weeklyScheduleGrid.querySelector(`[data-day="${dayIndex}"][data-hour="${startHour}"]`);
        if (!startCell) return;
        
        // Create schedule item
        const scheduleItem = document.createElement('div');
        scheduleItem.className = `schedule-item ${schedule.type === 'lecture' ? 'lecture-class' : 'lab-class'}`;
        scheduleItem.setAttribute('data-id', schedule.id);
        scheduleItem.style.top = '0';
        scheduleItem.style.height = `${duration * 60}px`; // Each hour is 60px
        
        // Get course and teacher info
        const course = scheduleData.courses[schedule.courseId] || { code: 'Unknown', name: 'Unknown Course' };
        const teacher = scheduleData.teachers[schedule.teacherId] || { name: 'Unknown Teacher' };
        const room = scheduleData.rooms[schedule.roomId] || { name: 'Unknown Room' };
        
        scheduleItem.innerHTML = `
            <h4>${course.code}: ${schedule.type === 'lecture' ? 'Lecture' : 'Lab'}</h4>
            <p>${room.name} | ${teacher.name}</p>
            <p>${schedule.startTime} - ${schedule.endTime}</p>
        `;
        
        // Add click event to view details
        scheduleItem.addEventListener('click', () => {
            viewScheduleDetails(schedule.id);
        });
        
        // Append to cell
        startCell.appendChild(scheduleItem);
    }

    // Filter schedules based on current filters and semester
    function filterSchedules() {
        return Object.values(scheduleData.schedules).filter(schedule => {
            // Filter by semester and year
            if (schedule.semester !== parseInt(currentSemester)) {
                return false;
            }
            
            // Filter by program
            if (currentFilters.program !== 'all') {
                const course = scheduleData.courses[schedule.courseId];
                if (!course || course.programId !== currentFilters.program) {
                    return false;
                }
            }
            
            // Filter by year level
            if (currentFilters.year !== 'all') {
                const course = scheduleData.courses[schedule.courseId];
                if (!course || course.year !== parseInt(currentFilters.year)) {
                    return false;
                }
            }
            
            // Filter by teacher
            if (currentFilters.teacher !== 'all' && schedule.teacherId !== currentFilters.teacher) {
                return false;
            }
            
            // Filter by room
            if (currentFilters.room !== 'all' && schedule.roomId !== currentFilters.room) {
                return false;
            }
            
            return true;
        });
    }

    // View schedule details
    function viewScheduleDetails(scheduleId) {
        currentScheduleItemId = scheduleId;
        const schedule = scheduleData.schedules[scheduleId];
        if (!schedule) return;
        
        const course = scheduleData.courses[schedule.courseId] || { code: 'Unknown', name: 'Unknown Course' };
        const teacher = scheduleData.teachers[schedule.teacherId] || { name: 'Unknown Teacher' };
        const room = scheduleData.rooms[schedule.roomId] || { name: 'Unknown Room' };
        
        // Populate modal
        document.getElementById('modal-class-title').textContent = `${course.code}: ${course.name}`;
        document.getElementById('modal-course-code').textContent = course.code;
        document.getElementById('modal-course-name').textContent = course.name;
        document.getElementById('modal-course-type').textContent = schedule.type === 'lecture' ? 'Lecture' : 'Laboratory';
        document.getElementById('modal-teacher').textContent = teacher.name;
        document.getElementById('modal-schedule').textContent = `${capitalizeFirstLetter(schedule.day)}, ${schedule.startTime} - ${schedule.endTime}`;
        document.getElementById('modal-room').textContent = room.name;
        
        // Open modal
        const modal = document.getElementById('class-details-modal');
        modal.style.display = 'block';
    }

    // Open edit schedule modal
    function openEditScheduleModal() {
        isEditMode = true;
        const schedule = scheduleData.schedules[currentScheduleItemId];
        if (!schedule) return;
        
        const course = scheduleData.courses[schedule.courseId] || { code: 'Unknown', name: 'Unknown Course' };
        
        // Populate form
        document.getElementById('edit-course').value = `${course.code}: ${course.name}`;
        
        // Populate teacher dropdown
        const teacherSelect = document.getElementById('edit-teacher');
        teacherSelect.innerHTML = '';
        Object.values(scheduleData.teachers).forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            if (teacher.id === schedule.teacherId) {
                option.selected = true;
            }
            teacherSelect.appendChild(option);
        });
        
        // Populate room dropdown
        const roomSelect = document.getElementById('edit-room');
        roomSelect.innerHTML = '';
        Object.values(scheduleData.rooms).forEach(room => {
            // Only show appropriate rooms for the schedule type
            if ((schedule.type === 'lecture' && room.type === 'lecture') || 
                (schedule.type === 'lab' && room.type === 'lab') ||
                room.type === 'both') {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = room.name;
                if (room.id === schedule.roomId) {
                    option.selected = true;
                }
                roomSelect.appendChild(option);
            }
        });
        
        // Set day
        document.getElementById('edit-day').value = schedule.day;
        
        // Set times
        document.getElementById('edit-start-time').value = schedule.startTime;
        document.getElementById('edit-end-time').value = schedule.endTime;
        
        // Hide conflict warning initially
        document.getElementById('schedule-conflict-warning').style.display = 'none';
        
        // Open modal
        const modal = document.getElementById('edit-schedule-modal');
        modal.style.display = 'block';
        
        // Close details modal
        document.getElementById('class-details-modal').style.display = 'none';
    }

    // Save schedule changes
    function saveScheduleChanges() {
        const teacherId = document.getElementById('edit-teacher').value;
        const roomId = document.getElementById('edit-room').value;
        const day = document.getElementById('edit-day').value;
        const startTime = document.getElementById('edit-start-time').value;
        const endTime = document.getElementById('edit-end-time').value;
        
        // Validate
        if (!teacherId || !roomId || !day || !startTime || !endTime) {
            alert('Please fill in all fields');
            return;
        }
        
        // Check for scheduling conflicts
        if (hasSchedulingConflict(currentScheduleItemId, teacherId, roomId, day, startTime, endTime)) {
            document.getElementById('schedule-conflict-warning').style.display = 'block';
            return;
        }
        
        // Update schedule
        scheduleData.schedules[currentScheduleItemId] = {
            ...scheduleData.schedules[currentScheduleItemId],
            teacherId,
            roomId,
            day,
            startTime,
            endTime
        };
        
        // Save data
        saveData();
        
        // Close modal and refresh view
        document.getElementById('edit-schedule-modal').style.display = 'none';
        renderCurrentView();
    }

    // Check for scheduling conflicts
    function hasSchedulingConflict(scheduleId, teacherId, roomId, day, startTime, endTime) {
        const start = timeToMinutes(startTime);
        const end = timeToMinutes(endTime);
        
        return Object.values(scheduleData.schedules).some(schedule => {
            // Skip the current schedule being edited
            if (schedule.id === scheduleId) return false;
            
            // Check if same day
            if (schedule.day !== day) return false;
            
            // Check if same teacher or room
            if (schedule.teacherId !== teacherId && schedule.roomId !== roomId) return false;
            
            // Check time overlap
            const scheduleStart = timeToMinutes(schedule.startTime);
            const scheduleEnd = timeToMinutes(schedule.endTime);
            
            return (start < scheduleEnd && end > scheduleStart);
        });
    }

    // Convert time string (HH:MM) to minutes for comparison
    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + (minutes || 0);
    }

    // Get week start date (Monday)
    function getWeekStartDate(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        return new Date(d.setDate(diff));
    }

    // Get day index from day name
    function getDayIndex(dayName) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days.indexOf(dayName.toLowerCase());
    }

    // Format date for display
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Render current view based on state
    function renderCurrentView() {
        if (currentView === 'weekly') {
            renderWeeklySchedule();
        } else if (currentView === 'daily') {
            renderDailySchedule();
        } else if (currentView === 'monthly') {
            renderMonthlySchedule();
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // View toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentView = btn.getAttribute('data-view');
                
                // Update active button
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active view
                document.querySelectorAll('.schedule-view').forEach(view => view.classList.remove('active'));
                document.getElementById(`${currentView}-view`).classList.add('active');
                
                // Render the selected view
                renderCurrentView();
            });
        });
        
        // Navigation buttons
        if (prevWeekBtn) prevWeekBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 7);
            renderWeeklySchedule();
        });
        
        if (nextWeekBtn) nextWeekBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 7);
            renderWeeklySchedule();
        });
        
        // Filter change events
        if (programFilter) programFilter.addEventListener('change', () => {
            currentFilters.program = programFilter.value;
            renderCurrentView();
        });
        
        if (yearFilter) yearFilter.addEventListener('change', () => {
            currentFilters.year = yearFilter.value;
            renderCurrentView();
        });
        
        if (teacherFilter) teacherFilter.addEventListener('change', () => {
            currentFilters.teacher = teacherFilter.value;
            renderCurrentView();
        });
        
        if (roomFilter) roomFilter.addEventListener('change', () => {
            currentFilters.room = roomFilter.value;
            renderCurrentView();
        });
        
        // Semester change
        if (semesterSelect) semesterSelect.addEventListener('change', () => {
            currentSemester = semesterSelect.value;
            renderCurrentView();
        });
        
        // Generate schedule button
        if (generateScheduleBtn) generateScheduleBtn.addEventListener('click', () => {
            const modal = document.getElementById('generate-schedule-modal');
            modal.style.display = 'block';
        });
        
        // Confirm generate button
        if (confirmGenerateBtn) confirmGenerateBtn.addEventListener('click', generateSchedule);
        
        // Edit schedule button
        if (editScheduleBtn) editScheduleBtn.addEventListener('click', openEditScheduleModal);
        
        // Save schedule button
        if (saveScheduleBtn) saveScheduleBtn.addEventListener('click', saveScheduleChanges);
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        // Close on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Constraint changes
        if (maxHoursPerDay) maxHoursPerDay.addEventListener('change', () => {
            scheduleData.constraints.maxHoursPerDay = parseInt(maxHoursPerDay.value);
            saveData();
        });
        
        if (lunchBreak) lunchBreak.addEventListener('change', () => {
            scheduleData.constraints.lunchBreak = lunchBreak.value;
            saveData();
        });
        
        if (avoidEvening) avoidEvening.addEventListener('change', () => {
            scheduleData.constraints.avoidEvening = avoidEvening.checked;
            saveData();
        });
        
        if (consecutiveLabs) consecutiveLabs.addEventListener('change', () => {
            scheduleData.constraints.consecutiveLabs = consecutiveLabs.checked;
            saveData();
        });
    }

    // Generate schedule automatically
    function generateSchedule() {
        // This would be a complex algorithm in a real application
        // For demonstration, we'll just show a success message
        alert('Schedule generated successfully!');
        
        // Close modal
        document.getElementById('generate-schedule-modal').style.display = 'none';
        
        // Refresh view
        renderCurrentView();
    }

    // Initialize the application
    function init() {
        loadData();
        setupEventListeners();
        
        // Populate filter dropdowns
        populateFilters();
        
        // Set constraint values from data
        if (maxHoursPerDay) maxHoursPerDay.value = scheduleData.constraints.maxHoursPerDay;
        if (lunchBreak) lunchBreak.value = scheduleData.constraints.lunchBreak;
        if (avoidEvening) avoidEvening.checked = scheduleData.constraints.avoidEvening;
        if (consecutiveLabs) consecutiveLabs.checked = scheduleData.constraints.consecutiveLabs;
        
        // Render initial view
        renderCurrentView();
    }

    // Populate filter dropdowns
    function populateFilters() {
        // Populate program filter
        if (programFilter) {
            // Get unique programs from courses
            const programs = {};
            Object.values(scheduleData.courses).forEach(course => {
                if (course.programId) {
                    programs[course.programId] = true;
                }
            });
            
            // Add program options
            Object.keys(programs).forEach(programId => {
                const option = document.createElement('option');
                option.value = programId;
                option.textContent = `Program ${programId.split('-')[0].toUpperCase()}`; // Simplified for demo
                programFilter.appendChild(option);
            });
        }
        
        // Populate teacher filter
        if (teacherFilter) {
            Object.values(scheduleData.teachers).forEach(teacher => {
                const option = document.createElement('option');
                option.value = teacher.id;
                option.textContent = teacher.name;
                teacherFilter.appendChild(option);
            });
        }
        
        // Populate room filter
        if (roomFilter) {
            Object.values(scheduleData.rooms).forEach(room => {
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = room.name;
                roomFilter.appendChild(option);
            });
        }
    }
    
    // Start the application
    init();
});
