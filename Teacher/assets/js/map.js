document.addEventListener('DOMContentLoaded', function() {
    // Initialize building selector
    const buildingSelect = document.getElementById('building-select');
    const buildingItems = document.querySelectorAll('.building-item');
    
    buildingSelect.addEventListener('change', function() {
        const selectedBuilding = this.value;
        updateBuildingView(selectedBuilding);
    });
    
    buildingItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedBuilding = this.getAttribute('data-building');
            
            // Update sidebar selection
            buildingItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update dropdown selection
            buildingSelect.value = selectedBuilding;
            
            // Update map view
            updateBuildingView(selectedBuilding);
        });
    });
    
    // Initialize floor selector
    const floorButtons = document.querySelectorAll('.floor-btn');
    
    floorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedFloor = this.getAttribute('data-floor');
            
            // Update button selection
            floorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update map view
            updateFloorView(selectedFloor);
        });
    });
    
    // Initialize room filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomItems = document.querySelectorAll('.room-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update button selection
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter rooms
            filterRooms(filter);
        });
    });
    
    // Room item click handler
    roomItems.forEach(item => {
        item.addEventListener('click', function() {
            const roomId = this.getAttribute('data-room');
            showRoomDetails(roomId);
        });
    });
    
    // Room search functionality
    const searchInput = document.getElementById('room-search');
    const searchButton = document.getElementById('search-btn');
    
    searchButton.addEventListener('click', function() {
        searchRooms(searchInput.value);
    });
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchRooms(this.value);
        }
    });
    
    // Map zooming and panning
    const mapCanvas = document.querySelector('.map-canvas');
    const mapWrapper = document.querySelector('.map-wrapper');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetViewBtn = document.getElementById('reset-view');
    
    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX, startY;
    let startPanX, startPanY;
    
    zoomInBtn.addEventListener('click', function() {
        zoomLevel += 0.1;
        updateMapTransform();
    });
    
    zoomOutBtn.addEventListener('click', function() {
        zoomLevel = Math.max(0.5, zoomLevel - 0.1);
        updateMapTransform();
    });
    
    resetViewBtn.addEventListener('click', function() {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        updateMapTransform();
    });
    
    mapCanvas.addEventListener('mousedown', function(event) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startPanX = panX;
        startPanY = panY;
        mapCanvas.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(event) {
        if (!isDragging) return;
        
        panX = startPanX + (event.clientX - startX) / zoomLevel;
        panY = startPanY + (event.clientY - startY) / zoomLevel;
        
        updateMapTransform();
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        mapCanvas.style.cursor = 'grab';
    });
    
    // SVG map room click handler
    const svgRooms = document.querySelectorAll('.room');
    
    svgRooms.forEach(room => {
        room.addEventListener('click', function() {
            const roomId = this.getAttribute('data-room-id');
            showRoomDetails(roomId);
        });
    });

    // Function to update map transform
    function updateMapTransform() {
        mapWrapper.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
    }

    // Function to update building view
    function updateBuildingView(building) {
        console.log(`Showing building: ${building}`);
        
        // Hide all building maps
        const buildingMaps = document.querySelectorAll('.building-map');
        buildingMaps.forEach(map => {
            map.classList.remove('active');
        });

        // Update building selection UI
        const buildingItems = document.querySelectorAll('.building-item');
        buildingItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-building') === building) {
                item.classList.add('active');
            }
        });
        
        // Show the selected building's map and handle floor buttons
        if (building === 'ccs') {
            document.getElementById('ccs-map-1').classList.add('active');
            // Reset floor buttons
            floorButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.disabled = false;
            });
            document.querySelector('[data-floor="1"]').classList.add('active');
        } else if (building === 'highschool') {
            document.getElementById('highschool-map-2').classList.add('active');
            // Reset floor buttons
            floorButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-floor="2"]').classList.add('active');
            
            // Disable 1st and 3rd floor buttons for high school building
            document.querySelector('[data-floor="1"]').disabled = true;
            document.querySelector('[data-floor="3"]').disabled = true;
        }

        // Save current building selection to session storage
        sessionStorage.setItem('selectedBuilding', building);
        
        // Get active floor and update room list
        const activeFloor = document.querySelector('.floor-btn.active').getAttribute('data-floor');
        updateRoomList(building, activeFloor);

        // Trigger a custom event for building change
        const event = new CustomEvent('buildingChanged', { detail: { building, floor: activeFloor } });
        document.dispatchEvent(event);
    }

    // Function to update room list based on building and floor
    function updateRoomList(building, floor) {
        const rooms = document.getElementById('rooms');
        
        // Clear current room list
        rooms.innerHTML = '';
        
        // This would typically come from your database or teacher-data.js
        if (building === 'ccs') {
            if (floor === '1') {
                rooms.innerHTML = `
                    <li class="room-item available" data-room="lab1">
                        <div class="room-status available"></div>
                        <span>Lab 1</span>
                        <span class="room-info">Available</span>
                    </li>
                    <li class="room-item occupied" data-room="lab2">
                        <div class="room-status occupied"></div>
                        <span>Lab 2</span>
                        <span class="room-info">Your class: CC 101 until 3:00 PM</span>
                    </li>
                    <li class="room-item occupied" data-room="faculty1">
                        <div class="room-status occupied"></div>
                        <span>Faculty Office</span>
                        <span class="room-info">Office Hours</span>
                    </li>
                    <li class="room-item occupied" data-room="csdept">
                        <div class="room-status occupied"></div>
                        <span>CS Department</span>
                        <span class="room-info">Office Hours</span>
                    </li>
                `;
            } else if (floor === '2') {
                rooms.innerHTML = `
                    <li class="room-item available" data-room="lr1">
                        <div class="room-status available"></div>
                        <span>LR 1</span>
                        <span class="room-info">Available for scheduling</span>
                    </li>
                    <li class="room-item available" data-room="lr2">
                        <div class="room-status available"></div>
                        <span>LR 2</span>
                        <span class="room-info">Available for scheduling</span>
                    </li>
                    <li class="room-item occupied" data-room="faculty2">
                        <div class="room-status occupied"></div>
                        <span>Faculty Office</span>
                        <span class="room-info">Office Hours</span>
                    </li>
                    <li class="room-item available" data-room="auditorium">
                        <div class="room-status available"></div>
                        <span>Auditorium</span>
                        <span class="room-info">Available for events</span>
                    </li>
                `;
            } else if (floor === '3') {
                rooms.innerHTML = `
                    <li class="room-item available" data-room="lr5">
                        <div class="room-status available"></div>
                        <span>LR 5</span>
                        <span class="room-info">Available for scheduling</span>
                    </li>
                `;
            }
        } else if (building === 'highschool') {
            if (floor === '2') {
                rooms.innerHTML = `
                    <li class="room-item available" data-room="lr3">
                        <div class="room-status available"></div>
                        <span>LR 3</span>
                        <span class="room-info">Available for scheduling</span>
                    </li>
                    <li class="room-item occupied" data-room="lr4">
                        <div class="room-status occupied"></div>
                        <span>LR 4</span>
                        <span class="room-info">Your class: CS 201 until 1:00 PM</span>
                    </li>
                `;
            }
        }
        
        // Add click event to new room items
        const newRoomItems = document.querySelectorAll('.room-item');
        newRoomItems.forEach(item => {
            item.addEventListener('click', function() {
                const roomId = this.getAttribute('data-room');
                showRoomDetails(roomId);
            });
        });
    }

    // Function to update floor view
    function updateFloorView(floor) {
        console.log(`Showing floor: ${floor}`);
        
        // Get the currently selected building
        const selectedBuilding = document.querySelector('.building-item.active').getAttribute('data-building');
        if (!selectedBuilding) {
            console.error('No building selected');
            return;
        }

        // Update floor button UI
        floorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-floor') === floor) {
                btn.classList.add('active');
            }
        });
        
        // Hide all building maps
        const buildingMaps = document.querySelectorAll('.building-map');
        buildingMaps.forEach(map => {
            map.classList.remove('active');
        });
        
        // Show the selected floor's map
        if (selectedBuilding === 'ccs') {
            // Enable all floor buttons for CCS building
            floorButtons.forEach(btn => btn.disabled = false);
            
            const mapId = `ccs-map-${floor}`;
            const map = document.getElementById(mapId);
            if (map) {
                map.classList.add('active');
            } else {
                console.error(`Map not found for floor ${floor}`);
            }
        } else if (selectedBuilding === 'highschool') {
            // Handle high school building floor restrictions
            if (floor === '2') {
                document.getElementById('highschool-map-2').classList.add('active');
            } else {
                console.warn(`Floor ${floor} not accessible in high school building`);
                return;
            }

            // Update floor button states
            document.querySelector('[data-floor="1"]').disabled = true;
            document.querySelector('[data-floor="3"]').disabled = true;
        }

        // Save current floor selection to session storage
        sessionStorage.setItem('selectedFloor', floor);
        
        // Update room list and dispatch event
        updateRoomList(selectedBuilding, floor);

        // Trigger a custom event for floor change
        const event = new CustomEvent('floorChanged', { 
            detail: { 
                building: selectedBuilding, 
                floor: floor,
                timestamp: new Date().toISOString()
            } 
        });
        document.dispatchEvent(event);
    }

    // Function to filter rooms
    function filterRooms(filter) {
        console.log(`Filtering rooms: ${filter}`);
        
        const roomItems = document.querySelectorAll('.room-item');
        
        roomItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else if (filter === 'available' && item.classList.contains('available')) {
                item.style.display = 'flex';
            } else if (filter === 'occupied' && item.classList.contains('occupied')) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Function to search rooms
    function searchRooms(query) {
        console.log(`Searching for: ${query}`);
        
        if (!query) {
            // If query is empty, show all rooms
            const roomItems = document.querySelectorAll('.room-item');
            roomItems.forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }
        
        query = query.toLowerCase();
        
        const roomItems = document.querySelectorAll('.room-item');
        
        roomItems.forEach(item => {
            const roomName = item.querySelector('span').textContent.toLowerCase();
            const roomInfo = item.querySelector('.room-info').textContent.toLowerCase();
            
            if (roomName.includes(query) || roomInfo.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Function to show room details
    function showRoomDetails(roomId) {
        console.log(`Showing details for room: ${roomId}`);
        
        const modal = document.getElementById('room-details-modal');
        const modalTitle = document.getElementById('modal-room-title');
        const modalStatus = document.getElementById('modal-room-status');
        const modalClass = document.getElementById('modal-room-class');
        const modalTime = document.getElementById('modal-room-time');
        const modalInstructor = document.getElementById('modal-room-instructor');
        const modalCapacity = document.getElementById('modal-room-capacity');
        const modalEquipment = document.getElementById('modal-room-equipment');
        
        // This would typically come from your database or teacher-data.js
        const roomData = {
            'lab1': {
                title: 'Lab 1',
                status: 'Available',
                class: 'N/A',
                time: 'N/A',
                instructor: 'N/A',
                capacity: '30 students',
                equipment: 'Computers, Projector, Whiteboard, Air Conditioning'
            },
            'lab2': {
                title: 'Lab 2',
                status: 'Occupied',
                class: 'CC 101 Introduction to Computing',
                time: '12:00 PM - 3:00 PM',
                instructor: 'You',
                capacity: '35 students',
                equipment: 'Computers, Projector, Whiteboard, Air Conditioning'
            },
            'lr1': {
                title: 'LR 1',
                status: 'Available',
                class: 'N/A',
                time: 'N/A',
                instructor: 'N/A',
                capacity: '40 students',
                equipment: 'Projector, Whiteboard, Air Conditioning'
            },
            'lr2': {
                title: 'LR 2',
                status: 'Available',
                class: 'N/A',
                time: 'N/A',
                instructor: 'N/A',
                capacity: '40 students',
                equipment: 'Projector, Whiteboard, Air Conditioning'
            },
            'lr3': {
                title: 'LR 3',
                status: 'Available',
                class: 'N/A',
                time: 'N/A',
                instructor: 'N/A',
                capacity: '35 students',
                equipment: 'Projector, Whiteboard'
            },
            'lr4': {
                title: 'LR 4',
                status: 'Occupied',
                class: 'CS 201 Data Structures',
                time: '10:00 AM - 1:00 PM',
                instructor: 'You',
                capacity: '35 students',
                equipment: 'Projector, Whiteboard'
            },
            'lr5': {
                title: 'LR 5',
                status: 'Available',
                class: 'N/A',
                time: 'N/A',
                instructor: 'N/A',
                capacity: '30 students',
                equipment: 'Projector, Whiteboard'
            },
            'auditorium': {
                title: 'Auditorium',
                status: 'Available',
                class: 'N/A',
                time: 'N/A',
                instructor: 'N/A',
                capacity: '150 students',
                equipment: 'Stage, Sound System, Projector, Air Conditioning'
            },
            'csdept': {
                title: 'CS Department',
                status: 'Occupied',
                class: 'Office Hours',
                time: '8:00 AM - 5:00 PM',
                instructor: 'Department Staff',
                capacity: 'N/A',
                equipment: 'Office Equipment'
            },
            'faculty1': {
                title: 'Faculty Office (1st Floor)',
                status: 'Occupied',
                class: 'Office Hours',
                time: '8:00 AM - 5:00 PM',
                instructor: 'Faculty Staff',
                capacity: 'N/A',
                equipment: 'Office Equipment'
            },
            'faculty2': {
                title: 'Faculty Office (2nd Floor)',
                status: 'Occupied',
                class: 'Office Hours',
                time: '8:00 AM - 5:00 PM',
                instructor: 'Faculty Staff',
                capacity: 'N/A',
                equipment: 'Office Equipment'
            }
        };
        
        // Set default values if room data is not available
        const room = roomData[roomId] || {
            title: `Room ${roomId}`,
            status: 'Available',
            class: 'N/A',
            time: 'N/A',
            instructor: 'N/A',
            capacity: '30 students',
            equipment: 'Projector, Whiteboard'
        };
        
        modalTitle.textContent = room.title;
        modalStatus.textContent = room.status;
        modalClass.textContent = room.class;
        modalTime.textContent = room.time;
        modalInstructor.textContent = room.instructor;
        modalCapacity.textContent = room.capacity;
        modalEquipment.textContent = room.equipment;
        
        // Update status indicator
        const statusIndicator = document.querySelector('.room-status-large');
        statusIndicator.className = 'room-status-large';
        
        if (room.status === 'Available') {
            statusIndicator.classList.add('available');
        } else if (room.status === 'Occupied') {
            statusIndicator.classList.add('occupied');
        } else if (room.status === 'Under Maintenance') {
            statusIndicator.classList.add('maintenance');
        }
        
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
});