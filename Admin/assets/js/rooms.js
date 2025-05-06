// Room Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const viewTabs = document.querySelectorAll('.view-tabs .tab-btn');
    const viewContents = document.querySelectorAll('.view-content');
    const addRoomBtn = document.getElementById('add-room-btn');
    const addRoomGridBtn = document.getElementById('add-room-grid-btn');
    const roomModal = document.getElementById('room-modal');
    const roomDetailsModal = document.getElementById('room-details-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelRoomBtn = document.getElementById('cancel-room');
    const saveRoomBtn = document.getElementById('save-room');
    const closeDetailsBtn = document.getElementById('close-details');
    const editFromDetailsBtn = document.getElementById('edit-from-details');
    const viewButtons = document.querySelectorAll('.btn-view');
    const editButtons = document.querySelectorAll('.btn-edit');
    const scheduleButtons = document.querySelectorAll('.btn-schedule');
    const buildingFilter = document.getElementById('building-filter');
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const buildingFilterGrid = document.getElementById('building-filter-grid');
    const floorFilterGrid = document.getElementById('floor-filter-grid');
    const roomForm = document.getElementById('room-form');
    const buildingBtns = document.querySelectorAll('.building-btn');
    const floorBtns = document.querySelectorAll('.floor-btn');
    const roomCards = document.querySelectorAll('.room-card');
    const roomElements = document.querySelectorAll('.room');
    const paginationBtns = document.querySelectorAll('.pagination button');

    // Sample room data
    const rooms = [
        {
            id: 'R-001',
            name: 'LR 1',
            building: 'CCS Building',
            floor: 'Floor 1',
            type: 'Lecture Room',
            capacity: 40,
            status: 'available',
            facilities: 'Projector, AC, Whiteboard',
            icon: 'chalkboard',
            schedule: [
                { course: 'CS 201 - Data Structures', instructor: 'Prof. John Doe', time: 'MWF 10:00 AM - 11:30 AM', students: '35/40' },
                { course: 'CS 301 - Database Systems', instructor: 'Prof. Jane Smith', time: 'TTh 1:00 PM - 3:30 PM', students: '28/40' }
            ]
        },
        {
            id: 'R-002',
            name: 'LR 2',
            building: 'CCS Building',
            floor: 'Floor 1',
            type: 'Lecture Room',
            capacity: 35,
            status: 'occupied',
            facilities: 'Projector, AC, Whiteboard',
            icon: 'chalkboard',
            schedule: [
                { course: 'IT 101 - IT Fundamentals', instructor: 'Prof. Maria Garcia', time: 'MWF 8:00 AM - 9:30 AM', students: '30/35' }
            ]
        },
        {
            id: 'R-003',
            name: 'Lab 1',
            building: 'CCS Building',
            floor: 'Floor 2',
            type: 'Laboratory',
            capacity: 30,
            status: 'available',
            facilities: 'Computers, Projector, AC',
            icon: 'desktop',
            schedule: [
                { course: 'CS 102 - Programming Lab', instructor: 'Prof. Robert Johnson', time: 'TTh 9:00 AM - 12:00 PM', students: '25/30' }
            ]
        },
        {
            id: 'R-004',
            name: 'Lab 2',
            building: 'CCS Building',
            floor: 'Floor 2',
            type: 'Laboratory',
            capacity: 30,
            status: 'maintenance',
            facilities: 'Computers, Projector, AC',
            icon: 'desktop',
            schedule: []
        },
        {
            id: 'R-005',
            name: 'Auditorium',
            building: 'Old High School',
            floor: 'Ground Floor',
            type: 'Auditorium',
            capacity: 150,
            status: 'available',
            facilities: 'Stage, Sound System, Projector, AC',
            icon: 'users',
            schedule: [
                { course: 'College Assembly', instructor: 'Dean Williams', time: 'F 1:00 PM - 4:00 PM', students: '120/150' }
            ]
        }
    ];

    // Event Listeners
    // Tab switching
    viewTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            viewTabs.forEach(t => t.classList.remove('active'));
            viewContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const view = this.getAttribute('data-view');
            document.getElementById(`${view}-view`).classList.add('active');
        });
    });

    // Add room buttons
    addRoomBtn.addEventListener('click', openAddRoomModal);
    addRoomGridBtn.addEventListener('click', openAddRoomModal);
    
    // Modal buttons
    cancelRoomBtn.addEventListener('click', closeRoomModal);
    saveRoomBtn.addEventListener('click', saveRoom);
    closeDetailsBtn.addEventListener('click', closeDetailsModal);
    editFromDetailsBtn.addEventListener('click', editFromDetails);
    
    // Close modals when clicking on X button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            roomModal.style.display = 'none';
            roomDetailsModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === roomModal) {
            roomModal.style.display = 'none';
        }
        if (event.target === roomDetailsModal) {
            roomDetailsModal.style.display = 'none';
        }
    });

    // Add event listeners to view buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const roomRow = this.closest('tr');
            const roomId = roomRow.querySelector('td:first-child').textContent;
            openRoomDetails(roomId);
        });
    });

    // Add event listeners to edit buttons
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const roomRow = this.closest('tr');
            const roomId = roomRow.querySelector('td:first-child').textContent;
            openEditRoomModal(roomId);
        });
    });

    // Add event listeners to schedule buttons
    scheduleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const roomRow = this.closest('tr');
            const roomId = roomRow.querySelector('td:first-child').textContent;
            viewRoomSchedule(roomId);
        });
    });

    // Add event listeners to room cards
    roomCards.forEach(card => {
        const viewBtn = card.querySelector('.btn-view');
        const scheduleBtn = card.querySelector('.btn-schedule');
        
        viewBtn.addEventListener('click', function() {
            const roomName = card.querySelector('h3').textContent;
            const room = rooms.find(r => r.name === roomName);
            if (room) openRoomDetails(room.id);
        });
        
        scheduleBtn.addEventListener('click', function() {
            const roomName = card.querySelector('h3').textContent;
            const room = rooms.find(r => r.name === roomName);
            if (room) viewRoomSchedule(room.id);
        });
    });

    // Add event listeners to SVG room elements
    roomElements.forEach(element => {
        element.addEventListener('click', function() {
            const roomId = this.getAttribute('data-room');
            // In a real application, you would find the room by ID and open details
            alert(`Clicked on room ${roomId} in the map view.`);
        });
    });

    // Add event listeners to building and floor buttons in map view
    buildingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            buildingBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const building = this.getAttribute('data-building');
            // In a real application, you would update the map to show the selected building
            console.log(`Switched to ${building} map`);
        });
    });

    floorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            floorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const floor = this.getAttribute('data-floor');
            // In a real application, you would update the map to show the selected floor
            console.log(`Switched to floor ${floor} map`);
        });
    });

    // Add event listeners to filters
    buildingFilter.addEventListener('change', filterRooms);
    typeFilter.addEventListener('change', filterRooms);
    statusFilter.addEventListener('change', filterRooms);
    buildingFilterGrid.addEventListener('change', filterRoomsGrid);
    floorFilterGrid.addEventListener('change', filterRoomsGrid);

    // Add event listeners to pagination buttons
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('btn-prev') && !this.classList.contains('btn-next')) {
                document.querySelector('.pagination button.active').classList.remove('active');
                this.classList.add('active');
                // In a real application, this would load the corresponding page of data
            }
        });
    });

    // Functions
    function openAddRoomModal() {
        // Reset form
        roomForm.reset();
        document.querySelector('.modal-header h2').textContent = 'Add New Room';
        roomModal.style.display = 'block';
    }

    function openEditRoomModal(roomId) {
        // Find room by ID
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        // Populate form with room data
        document.getElementById('room-id').value = room.id;
        document.getElementById('room-name').value = room.name;
        document.getElementById('room-building').value = room.building.toLowerCase().replace(' ', '-');
        document.getElementById('room-floor').value = room.floor.toLowerCase().replace('floor ', '');
        document.getElementById('room-type').value = room.type.toLowerCase().replace(' ', '');
        document.getElementById('room-capacity').value = room.capacity;
        document.getElementById('room-status').value = room.status;
        
        // Set facilities (simplified for demo)
        const facilities = room.facilities.split(', ');
        facilities.forEach(facility => {
            const checkbox = document.querySelector(`input[value="${facility.toLowerCase()}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Update modal title
        document.querySelector('.modal-header h2').textContent = 'Edit Room';
        roomModal.style.display = 'block';
    }

    function closeRoomModal() {
        roomModal.style.display = 'none';
    }

    function saveRoom() {
        // In a real application, this would save the room data to a database
        // For this demo, we'll just close the modal and show a success message
        
        // Get form data
        const roomId = document.getElementById('room-id').value;
        const roomName = document.getElementById('room-name').value;
        const roomBuilding = document.getElementById('room-building').value;
        const roomType = document.getElementById('room-type').value;
        const roomCapacity = document.getElementById('room-capacity').value;
        
        // Validate required fields
        if (!roomId || !roomName || !roomBuilding || !roomType || !roomCapacity) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Close modal
        roomModal.style.display = 'none';
        
        // Show success message (in a real app, you would update the UI with the new/updated room)
        alert(`Room ${roomId} has been saved successfully!`);
    }

    function openRoomDetails(roomId) {
        // Find room by ID
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        // Populate room details
        document.getElementById('detail-room-name').textContent = room.name;
        document.getElementById('detail-room-location').textContent = `${room.building}, ${room.floor}`;
        document.getElementById('detail-room-type').textContent = room.type;
        document.getElementById('detail-room-status').textContent = room.status.charAt(0).toUpperCase() + room.status.slice(1);
        document.getElementById('detail-room-status').className = `status-badge ${room.status}`;
        document.getElementById('detail-room-id').textContent = room.id;
        document.getElementById('detail-room-capacity').textContent = `${room.capacity} students`;
        document.getElementById('detail-room-facilities').textContent = room.facilities;

        // Update room icon
        document.querySelector('.room-icon-large i').className = `fas fa-${room.icon}`;

        // Populate schedule (simplified for demo)
        const scheduleGrid = document.getElementById('detail-room-schedule');
        scheduleGrid.innerHTML = '';
        
        // Create a simple weekly schedule grid
        // Headers
        const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = day ? 'day-header' : '';
            dayHeader.textContent = day;
            scheduleGrid.appendChild(dayHeader);
        });
        
        // Time slots
        const timeSlots = [
            '7:00 AM', '7:30 AM', 
            '8:00 AM', '8:30 AM', 
            '9:00 AM', '9:30 AM', 
            '10:00 AM', '10:30 AM', 
            '11:00 AM', '11:30 AM', 
            '12:00 PM', '12:30 PM', 
            '1:00 PM', '1:30 PM', 
            '2:00 PM', '2:30 PM', 
            '3:00 PM', '3:30 PM', 
            '4:00 PM', '4:30 PM', 
            '5:00 PM', '5:30 PM', 
            '6:00 PM', '6:30 PM', 
            '7:00 PM'
        ];
        timeSlots.forEach(time => {
            // Time slot
            const timeSlotDiv = document.createElement('div');
            timeSlotDiv.className = 'time-slot';
            timeSlotDiv.textContent = time;
            scheduleGrid.appendChild(timeSlotDiv);
            
            // Slots for each day
            for (let i = 1; i <= 5; i++) {
                const slotDiv = document.createElement('div');
                
                // Check if there's a class scheduled at this time
                let isOccupied = false;
                let courseInfo = '';
                
                room.schedule.forEach(schedule => {
                    const scheduleTime = schedule.time.split(' ');
                    const scheduleDays = scheduleTime[0];
                    const scheduleTimeRange = scheduleTime.slice(1).join(' ');
                    const startTime = scheduleTimeRange.split(' - ')[0];
                    
                    // Check if the day matches
                    let dayMatch = false;
                    if (i === 1 && scheduleDays.includes('M')) dayMatch = true;
                    if (i === 2 && scheduleDays.includes('T') && !scheduleDays.includes('Th')) dayMatch = true;
                    if (i === 3 && scheduleDays.includes('W')) dayMatch = true;
                    if (i === 4 && scheduleDays.includes('Th')) dayMatch = true;
                    if (i === 5 && scheduleDays.includes('F')) dayMatch = true;
                    
                    // Check if the time matches (simplified)
                    if (dayMatch && startTime === time) {
                        isOccupied = true;
                        courseInfo = schedule.course;
                    }
                });
                
                if (isOccupied) {
                    slotDiv.className = 'occupied';
                    slotDiv.textContent = courseInfo;
                }
                
                scheduleGrid.appendChild(slotDiv);
            }
        });

        // Populate upcoming classes
        const classesTable = document.getElementById('detail-room-classes');
        classesTable.innerHTML = '';
        
        room.schedule.forEach(schedule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${schedule.course}</td>
                <td>${schedule.instructor}</td>
                <td>${schedule.time}</td>
                <td>${schedule.students}</td>
            `;
            classesTable.appendChild(row);
        });

        // Show modal
        roomDetailsModal.style.display = 'block';
    }

    function closeDetailsModal() {
        roomDetailsModal.style.display = 'none';
    }

    function editFromDetails() {
        // Get room ID from details modal
        const roomId = document.getElementById('detail-room-id').textContent;
        
        // Close details modal
        roomDetailsModal.style.display = 'none';
        
        // Open edit modal
        openEditRoomModal(roomId);
    }

    function viewRoomSchedule(roomId) {
        // In a real application, this might open a dedicated schedule view
        // For this demo, we'll just open the room details which shows the schedule
        openRoomDetails(roomId);
    }

    function filterRooms() {
        // In a real application, this would filter the rooms based on the selected filters
        // For this demo, we'll just show an alert
        const building = buildingFilter.value;
        const type = typeFilter.value;
        const status = statusFilter.value;
        
        alert(`Filtering rooms by: Building=${building}, Type=${type}, Status=${status}`);
    }

    function filterRoomsGrid() {
        // In a real application, this would filter the room cards based on the selected filters
        // For this demo, we'll just show an alert
        const building = buildingFilterGrid.value;
        const floor = floorFilterGrid.value;
        
        alert(`Filtering room grid by: Building=${building}, Floor=${floor}`);
    }
});
