/**
 * Teacher Availability Management JavaScript
 * Handles the teacher's availability settings and preferences
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize data storage
    let availabilityData = {
        teacherId: 'teacher-smith', // This would come from authentication in a real app
        semester: '1st',
        year: 2025,
        preferences: {
            preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            maxHoursPerDay: 6,
            preferredTime: 'afternoon',
            additionalNotes: ''
        },
        availability: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: []
        },
        preferred: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: []
        }
    };

    // DOM Elements
    const dayTabs = document.querySelectorAll('.day-tab');
    const daySchedules = document.querySelectorAll('.day-schedule');
    const saveAvailabilityBtn = document.getElementById('save-availability-btn');
    const semesterSelect = document.getElementById('semester-select');
    const currentDateDisplay = document.getElementById('current-date');
    
    // Preference elements
    const prefDays = {
        monday: document.getElementById('pref-monday'),
        tuesday: document.getElementById('pref-tuesday'),
        wednesday: document.getElementById('pref-wednesday'),
        thursday: document.getElementById('pref-thursday'),
        friday: document.getElementById('pref-friday'),
        saturday: document.getElementById('pref-saturday')
    };
    
    const maxHoursPerDay = document.getElementById('max-hours-per-day');
    const preferredTime = document.getElementById('preferred-time');
    const additionalNotes = document.getElementById('additional-notes');
    
    // Load data from localStorage if exists
    function loadData() {
        const savedData = localStorage.getItem('teacherAvailabilityData');
        if (savedData) {
            availabilityData = JSON.parse(savedData);
            
            // Update UI with loaded data
            updatePreferencesUI();
            updateAvailabilityUI();
        } else {
            // Initialize with default availability
            initializeDefaultAvailability();
        }
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('teacherAvailabilityData', JSON.stringify(availabilityData));
    }

    // Initialize with default availability
    function initializeDefaultAvailability() {
        // Default working hours (8 AM - 5 PM, Monday to Friday)
        const workingHours = ['8', '9', '10', '11', '13', '14', '15', '16'];
        const preferredHours = ['8', '9', '13', '14', '15'];
        
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
            availabilityData.availability[day] = workingHours;
            availabilityData.preferred[day] = preferredHours;
        });
        
        // Update UI
        updateAvailabilityUI();
        saveData();
    }

    // Update preferences UI from data
    function updatePreferencesUI() {
        // Update preferred days checkboxes
        Object.keys(prefDays).forEach(day => {
            if (prefDays[day]) {
                prefDays[day].checked = availabilityData.preferences.preferredDays.includes(day);
            }
        });
        
        // Update other preferences
        if (maxHoursPerDay) maxHoursPerDay.value = availabilityData.preferences.maxHoursPerDay;
        if (preferredTime) preferredTime.value = availabilityData.preferences.preferredTime;
        if (additionalNotes) additionalNotes.value = availabilityData.preferences.additionalNotes;
    }

    // Update availability UI from data
    function updateAvailabilityUI() {
        // For each day
        Object.keys(availabilityData.availability).forEach(day => {
            // Get the day's schedule container
            const daySchedule = document.getElementById(`${day}-schedule`);
            
            // If it's not Monday (which is already in the HTML), create the time slots
            if (day !== 'monday' && daySchedule) {
                createTimeSlots(day, daySchedule);
            }
            
            // Update the checkboxes based on saved data
            availabilityData.availability[day].forEach(hour => {
                const checkbox = document.getElementById(`${day}-${hour}-available`);
                if (checkbox) checkbox.checked = true;
            });
            
            availabilityData.preferred[day].forEach(hour => {
                const checkbox = document.getElementById(`${day}-${hour}-preferred`);
                if (checkbox) checkbox.checked = true;
            });
        });
    }

    // Create time slots for a day
    function createTimeSlots(day, container) {
        const timeSlots = document.createElement('div');
        timeSlots.className = 'time-slots';
        
        // Add header
        timeSlots.innerHTML = `
            <div class="time-slot-header">
                <div class="time-label">Time</div>
                <div class="availability-label">Available</div>
                <div class="preferred-label">Preferred</div>
            </div>
        `;
        
        // Add time slots from 7 AM to 8 PM
        for (let hour = 7; hour < 20; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = `time-slot ${hour === 12 ? 'lunch-break' : ''}`;
            
            const hourLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
            const nextHourLabel = (hour + 1) <= 12 ? `${hour + 1}:00 AM` : `${hour + 1 - 12}:00 PM`;
            
            timeSlot.innerHTML = `
                <div class="time-label">${hourLabel} - ${nextHourLabel}</div>
                <div class="availability-toggle">
                    <input type="checkbox" id="${day}-${hour}-available" class="available-checkbox">
                    <label for="${day}-${hour}-available"></label>
                </div>
                <div class="preferred-toggle">
                    <input type="checkbox" id="${day}-${hour}-preferred" class="preferred-checkbox">
                    <label for="${day}-${hour}-preferred"></label>
                </div>
            `;
            
            timeSlots.appendChild(timeSlot);
        }
        
        container.appendChild(timeSlots);
    }

    // Save availability from UI to data
    function saveAvailability() {
        // Save preferences
        availabilityData.preferences.preferredDays = Object.keys(prefDays).filter(day => prefDays[day] && prefDays[day].checked);
        availabilityData.preferences.maxHoursPerDay = parseInt(maxHoursPerDay.value);
        availabilityData.preferences.preferredTime = preferredTime.value;
        availabilityData.preferences.additionalNotes = additionalNotes.value;
        
        // Save availability for each day
        Object.keys(availabilityData.availability).forEach(day => {
            availabilityData.availability[day] = [];
            availabilityData.preferred[day] = [];
            
            // Check each hour
            for (let hour = 7; hour < 20; hour++) {
                const availableCheckbox = document.getElementById(`${day}-${hour}-available`);
                const preferredCheckbox = document.getElementById(`${day}-${hour}-preferred`);
                
                if (availableCheckbox && availableCheckbox.checked) {
                    availabilityData.availability[day].push(hour.toString());
                }
                
                if (preferredCheckbox && preferredCheckbox.checked) {
                    availabilityData.preferred[day].push(hour.toString());
                }
            }
        });
        
        // Save data
        saveData();
        
        // Show success notification
        showNotification();
    }

    // Show success notification
    function showNotification() {
        const notification = document.getElementById('success-notification');
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Day tabs
        dayTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const day = tab.getAttribute('data-day');
                
                // Update active tab
                dayTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active schedule
                daySchedules.forEach(s => s.classList.remove('active'));
                document.getElementById(`${day}-schedule`).classList.add('active');
            });
        });
        
        // Save button
        if (saveAvailabilityBtn) {
            saveAvailabilityBtn.addEventListener('click', saveAvailability);
        }
        
        // Semester select
        if (semesterSelect) {
            semesterSelect.addEventListener('change', () => {
                availabilityData.semester = semesterSelect.value;
                saveData();
            });
        }
        
        // Availability checkboxes
        document.addEventListener('change', (e) => {
            // If a preferred checkbox is checked, make sure the available checkbox is also checked
            if (e.target.classList.contains('preferred-checkbox') && e.target.checked) {
                const id = e.target.id;
                const availableId = id.replace('-preferred', '-available');
                const availableCheckbox = document.getElementById(availableId);
                
                if (availableCheckbox) {
                    availableCheckbox.checked = true;
                }
            }
            
            // If an available checkbox is unchecked, uncheck the preferred checkbox too
            if (e.target.classList.contains('available-checkbox') && !e.target.checked) {
                const id = e.target.id;
                const preferredId = id.replace('-available', '-preferred');
                const preferredCheckbox = document.getElementById(preferredId);
                
                if (preferredCheckbox) {
                    preferredCheckbox.checked = false;
                }
            }
        });
    }

    // Set current date
    function setCurrentDate() {
        const now = new Date();
        currentDateDisplay.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Initialize the application
    function init() {
        setCurrentDate();
        loadData();
        setupEventListeners();
    }
    
    // Start the application
    init();
});
