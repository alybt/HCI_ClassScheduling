/**
 * Enhanced Map JavaScript for Teacher View
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Map Enhanced JS loaded');
    // DOM Elements
    const buildingSelect = document.getElementById('building-select');
    const roomSearch = document.getElementById('room-search');
    const searchBtn = document.getElementById('search-btn');
    const buildingItems = document.querySelectorAll('.building-item');
    const floorBtns = document.querySelectorAll('.floor-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const roomItems = document.querySelectorAll('.room-item');
    const buildingMaps = document.querySelectorAll('.building-map');
    const roomElements = document.querySelectorAll('.room');
    
    // Control buttons
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetViewBtn = document.getElementById('reset-view');
    const toggleClassesBtn = document.getElementById('toggle-classes');
    const toggleAvailabilityBtn = document.getElementById('toggle-availability');
    
    // Action buttons
    const reserveRoomBtn = document.getElementById('reserve-room-btn');
    const reportIssueBtn = document.getElementById('report-issue-btn');
    
    // Info panel
    const infoPanel = document.querySelector('.map-info-panel');
    const closeInfoPanel = document.querySelector('.close-info-panel');
    
    // Modals
    const roomDetailsModal = document.getElementById('room-details-modal');
    const reservationModal = document.getElementById('reservation-modal');
    const reportModal = document.getElementById('report-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Modal buttons
    const reserveThisRoomBtn = document.getElementById('reserve-this-room');
    const reportRoomIssueBtn = document.getElementById('report-room-issue');
    const modalReserveBtn = document.getElementById('modal-reserve-btn');
    const modalReportBtn = document.getElementById('modal-report-btn');
    const submitReservationBtn = document.getElementById('submit-reservation-btn');
    const cancelReservationBtn = document.getElementById('cancel-reservation-btn');
    const submitReportBtn = document.getElementById('submit-report-btn');
    const cancelReportBtn = document.getElementById('cancel-report-btn');
    
    // State variables
    let currentBuilding = 'ccs';
    let currentFloor = '1';
    let currentFilter = 'all';
    let currentScale = 1;
    let selectedRoom = null;
    
    // Initialize map
    function initMap() {
        // Check if all required elements exist
        if (!buildingSelect || !roomElements.length) {
            console.error('Some map elements are missing. Check the HTML structure.');
            return;
        }

        // Set up event listeners
        setupEventListeners();
        
        // Show initial building and floor
        showBuilding('ccs');
        showFloor('1');
        
        // Make rooms interactive
        makeRoomsInteractive();

        // Initialize info panel
        if (infoPanel) {
            infoPanel.classList.remove('active');
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Building select
        buildingSelect.addEventListener('change', function() {
            showBuilding(this.value);
        });
        
        // Room search
        searchBtn.addEventListener('click', function() {
            searchRooms(roomSearch.value);
        });
        
        roomSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchRooms(this.value);
            }
        });
        
        // Building items
        buildingItems.forEach(item => {
            item.addEventListener('click', function() {
                const building = this.getAttribute('data-building');
                selectBuilding(building);
                showBuilding(building);
            });
        });
        
        // Floor buttons
        floorBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const floor = this.getAttribute('data-floor');
                selectFloor(floor);
                showFloor(floor);
            });
        });
        
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                selectFilter(filter);
                applyFilter(filter);
            });
        });
        
        // Room items in sidebar
        roomItems.forEach(item => {
            item.addEventListener('click', function() {
                const roomId = this.getAttribute('data-room');
                selectRoomById(roomId);
            });
        });
        
        // Zoom controls
        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
        resetViewBtn.addEventListener('click', resetView);
        
        // Toggle buttons
        toggleClassesBtn.addEventListener('click', toggleClasses);
        toggleAvailabilityBtn.addEventListener('click', toggleAvailability);
        
        // Close info panel
        closeInfoPanel.addEventListener('click', closeRoomInfo);
        
        // Action buttons
        reserveRoomBtn.addEventListener('click', showReservationModal);
        reportIssueBtn.addEventListener('click', showReportModal);
        
        // Info panel action buttons
        reserveThisRoomBtn.addEventListener('click', function() {
            showReservationModal(selectedRoom);
        });
        
        reportRoomIssueBtn.addEventListener('click', function() {
            showReportModal(selectedRoom);
        });
        
        // Modal buttons
        modalReserveBtn.addEventListener('click', function() {
            showReservationModal(selectedRoom);
            closeModal(roomDetailsModal);
        });
        
        modalReportBtn.addEventListener('click', function() {
            showReportModal(selectedRoom);
            closeModal(roomDetailsModal);
        });
        
        submitReservationBtn.addEventListener('click', submitReservation);
        cancelReservationBtn.addEventListener('click', function() {
            closeModal(reservationModal);
        });
        
        submitReportBtn.addEventListener('click', submitReport);
        cancelReportBtn.addEventListener('click', function() {
            closeModal(reportModal);
        });
        
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                closeModal(modal);
            });
        });
        
        // Photo upload preview
        const issuePhoto = document.getElementById('issue-photo');
        if (issuePhoto) {
            issuePhoto.addEventListener('change', function() {
                previewPhoto(this);
            });
        }
    }
    
    // Make rooms interactive
    function makeRoomsInteractive() {
        console.log(`Setting up interactivity for ${roomElements.length} room elements`);
        roomElements.forEach(room => {
            room.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const roomId = this.getAttribute('data-room-id');
                console.log(`Room clicked: ${roomId}`);
                selectRoomById(roomId);
            });
        });
    }
    
    // Select building
    function selectBuilding(building) {
        // Update UI
        buildingItems.forEach(item => {
            if (item.getAttribute('data-building') === building) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        buildingSelect.value = building;
        currentBuilding = building;
    }
    
    // Show building
    function showBuilding(building) {
        if (building === 'all') {
            // Show all buildings
            buildingMaps.forEach(map => {
                const mapId = map.getAttribute('id');
                if (mapId.includes(`-${currentFloor}`)) {
                    map.classList.add('active');
                } else {
                    map.classList.remove('active');
                }
            });
        } else {
            // Show specific building
            buildingMaps.forEach(map => {
                const mapId = map.getAttribute('id');
                if (mapId === `${building}-map-${currentFloor}` || mapId === `${building}-map-${currentFloor}`) {
                    map.classList.add('active');
                } else {
                    map.classList.remove('active');
                }
            });
        }
        
        // Update room list
        updateRoomList();
    }
    
    // Select floor
    function selectFloor(floor) {
        // Update UI
        floorBtns.forEach(btn => {
            if (btn.getAttribute('data-floor') === floor) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        currentFloor = floor;
    }
    
    // Show floor
    function showFloor(floor) {
        buildingMaps.forEach(map => {
            const mapId = map.getAttribute('id');
            if (currentBuilding === 'all') {
                if (mapId.includes(`-${floor}`) || mapId === `${currentBuilding}-map-${floor}`) {
                    map.classList.add('active');
                } else {
                    map.classList.remove('active');
                }
            } else {
                // Handle both formats: ccs-map-1 and ccs-map-1
                if (mapId === `${currentBuilding}-map-${floor}` || mapId === `${currentBuilding}-map-${floor}`) {
                    map.classList.add('active');
                } else {
                    map.classList.remove('active');
                }
            }
        });
        
        // Update room list
        updateRoomList();
    }
    
    // Select filter
    function selectFilter(filter) {
        // Update UI
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        currentFilter = filter;
    }
    
    // Apply filter
    function applyFilter(filter) {
        // Filter room items in sidebar
        roomItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else if (filter === 'available' && item.classList.contains('available')) {
                item.style.display = 'flex';
            } else if (filter === 'occupied' && item.classList.contains('occupied')) {
                item.style.display = 'flex';
            } else if (filter === 'my-classes' && item.classList.contains('my-class')) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Highlight rooms on map
        roomElements.forEach(room => {
            const status = room.getAttribute('data-status');
            const teacher = room.getAttribute('data-teacher');
            
            if (filter === 'all') {
                room.style.opacity = '1';
            } else if (filter === 'available' && status === 'available') {
                room.style.opacity = '1';
            } else if (filter === 'occupied' && status === 'occupied') {
                room.style.opacity = '1';
            } else if (filter === 'my-classes' && teacher === 'Dr. Robert Johnson') {
                room.style.opacity = '1';
            } else {
                room.style.opacity = '0.3';
            }
        });
    }
    
    // Search rooms
    function searchRooms(query) {
        if (!query) {
            // Reset filters if query is empty
            selectFilter('all');
            applyFilter('all');
            return;
        }
        
        query = query.toLowerCase();
        
        // Search room items in sidebar
        roomItems.forEach(item => {
            const roomName = item.querySelector('span').textContent.toLowerCase();
            const roomInfo = item.querySelector('.room-info').textContent.toLowerCase();
            
            if (roomName.includes(query) || roomInfo.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Highlight rooms on map
        roomElements.forEach(room => {
            const roomId = room.getAttribute('data-room-id').toLowerCase();
            const roomText = room.querySelector('text').textContent.toLowerCase();
            
            if (roomId.includes(query) || roomText.includes(query)) {
                room.style.opacity = '1';
            } else {
                room.style.opacity = '0.3';
            }
        });
    }
    
    // Select room by ID
    function selectRoomById(roomId) {
        console.log(`Selecting room by ID: ${roomId}`);
        // Find room element
        const roomElement = document.querySelector(`.room[data-room-id="${roomId}"]`);
        if (!roomElement) {
            console.warn(`Room element with ID ${roomId} not found`);
            return;
        }
        
        // Store selected room
        selectedRoom = roomId;
        
        // Show room details
        showRoomInfo(roomElement);
        
        // Highlight room on map
        highlightRoom(roomElement);
    }
    
    // Show room info
    function showRoomInfo(roomElement) {
        console.log(`Showing room info for: ${roomElement.getAttribute('data-room-id')}`);
        // Get room data
        const roomId = roomElement.getAttribute('data-room-id');
        const roomName = roomElement.querySelector('text').textContent;
        const status = roomElement.getAttribute('data-status');
        const className = roomElement.getAttribute('data-class') || '';
        const teacher = roomElement.getAttribute('data-teacher') || '';
        const time = roomElement.getAttribute('data-time') || '';
        const capacity = roomElement.getAttribute('data-capacity') || '30';
        const facilities = roomElement.getAttribute('data-facilities') || '';
        
        // Update info panel
        document.getElementById('info-room-name').textContent = roomName;
        
        // Set status badge
        const statusBadge = document.querySelector('.room-status-badge');
        statusBadge.className = 'room-status-badge ' + status;
        statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        
        // Update current class info
        if (status === 'occupied') {
            document.getElementById('info-current-class').textContent = className;
            document.getElementById('info-class-time').textContent = time;
            document.getElementById('info-teacher').textContent = teacher + (teacher === 'Dr. Robert Johnson' ? ' (You)' : '');
            document.getElementById('info-current-class').parentElement.style.display = 'block';
        } else {
            document.getElementById('info-current-class').parentElement.style.display = 'none';
        }
        
        // Update room details
        document.getElementById('info-capacity').textContent = capacity;
        
        // Update facilities
        const facilitiesContainer = document.getElementById('info-facilities');
        facilitiesContainer.innerHTML = '';
        
        if (facilities) {
            const facilityList = facilities.split(',');
            facilityList.forEach(facility => {
                let icon = 'fas fa-check';
                switch (facility.trim()) {
                    case 'computers':
                        icon = 'fas fa-desktop';
                        break;
                    case 'projector':
                        icon = 'fas fa-projector';
                        break;
                    case 'whiteboard':
                        icon = 'fas fa-chalkboard';
                        break;
                    case 'aircon':
                        icon = 'fas fa-snowflake';
                        break;
                    case 'internet':
                        icon = 'fas fa-wifi';
                        break;
                    case 'sound':
                        icon = 'fas fa-volume-up';
                        break;
                }
                
                const facilityElement = document.createElement('span');
                facilityElement.className = 'facility';
                facilityElement.innerHTML = `<i class="${icon}"></i> ${facility.trim().charAt(0).toUpperCase() + facility.trim().slice(1)}`;
                facilitiesContainer.appendChild(facilityElement);
            });
        }
        
        // Show info panel
        if (infoPanel) {
            infoPanel.classList.add('active');
            console.log('Info panel activated');
        } else {
            console.warn('Info panel element not found');
        }
        
        // Update reservation form if needed
        const reservationRoom = document.getElementById('reservation-room');
        if (reservationRoom) {
            const options = reservationRoom.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === roomId) {
                    reservationRoom.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Update issue form if needed
        const issueRoom = document.getElementById('issue-room');
        if (issueRoom) {
            const options = issueRoom.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === roomId) {
                    issueRoom.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    // Close room info
    function closeRoomInfo() {
        console.log('Closing room info');
        if (infoPanel) {
            infoPanel.classList.remove('active');
        }
        
        // Remove highlight from room
        roomElements.forEach(room => {
            room.classList.remove('highlighted');
            const rect = room.querySelector('rect');
            if (rect) {
                rect.setAttribute('stroke-width', '1');
                rect.setAttribute('stroke', '#333');
            }
        });
        
        selectedRoom = null;
    }
    
    // Highlight room on map
    function highlightRoom(roomElement) {
        console.log(`Highlighting room: ${roomElement.getAttribute('data-room-id')}`);
        // Remove highlight from all rooms
        roomElements.forEach(room => {
            room.classList.remove('highlighted');
            const rect = room.querySelector('rect');
            if (rect) {
                rect.setAttribute('stroke-width', '1');
                rect.setAttribute('stroke', '#333');
            }
        });
        
        // Add highlight to selected room
        roomElement.classList.add('highlighted');
        const rect = roomElement.querySelector('rect');
        if (rect) {
            rect.setAttribute('stroke-width', '3');
            rect.setAttribute('stroke', '#673ab7');
        }
        
        // Scroll to room if needed
        roomElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // Update room list
    function updateRoomList() {
        // TODO: Implement dynamic room list update based on building and floor
        // This would typically involve fetching data from a server
        console.log(`Updating room list for ${currentBuilding} floor ${currentFloor}`);
        
        // For now, let's just update the visibility of room items based on the current building and floor
        const roomList = document.getElementById('rooms');
        if (roomList) {
            const items = roomList.querySelectorAll('.room-item');
            items.forEach(item => {
                // Show all items for now - in a real implementation, we would filter by building and floor
                item.style.display = 'flex';
            });
        }
    }
    
    // Zoom in
    function zoomIn() {
        currentScale += 0.1;
        applyZoom();
    }
    
    // Zoom out
    function zoomOut() {
        currentScale = Math.max(0.5, currentScale - 0.1);
        applyZoom();
    }
    
    // Reset view
    function resetView() {
        currentScale = 1;
        applyZoom();
    }
    
    // Apply zoom
    function applyZoom() {
        const activeMap = document.querySelector('.building-map.active');
        if (activeMap) {
            activeMap.style.transform = `scale(${currentScale})`;
            activeMap.style.transformOrigin = 'center';
            console.log(`Applied zoom: ${currentScale} to map ${activeMap.id}`);
        } else {
            console.warn('No active map found to apply zoom');
        }
    }
    
    // Toggle classes
    function toggleClasses() {
        toggleClassesBtn.classList.toggle('active');
        
        // Show/hide class labels
        const classLabels = document.querySelectorAll('.room text:nth-child(3)');
        classLabels.forEach(label => {
            label.style.display = toggleClassesBtn.classList.contains('active') ? 'block' : 'none';
        });
    }
    
    // Toggle availability
    function toggleAvailability() {
        toggleAvailabilityBtn.classList.toggle('active');
        
        // Highlight available/occupied rooms
        if (toggleAvailabilityBtn.classList.contains('active')) {
            roomElements.forEach(room => {
                const status = room.getAttribute('data-status');
                if (status === 'available') {
                    room.querySelector('rect').setAttribute('stroke', '#4caf50');
                    room.querySelector('rect').setAttribute('stroke-width', '3');
                } else if (status === 'occupied') {
                    room.querySelector('rect').setAttribute('stroke', '#f44336');
                    room.querySelector('rect').setAttribute('stroke-width', '3');
                } else if (status === 'maintenance') {
                    room.querySelector('rect').setAttribute('stroke', '#ff9800');
                    room.querySelector('rect').setAttribute('stroke-width', '3');
                }
            });
        } else {
            roomElements.forEach(room => {
                const teacher = room.getAttribute('data-teacher');
                if (teacher === 'Dr. Robert Johnson') {
                    room.querySelector('rect').setAttribute('stroke', '#673ab7');
                    room.querySelector('rect').setAttribute('stroke-width', '2');
                    room.querySelector('rect').setAttribute('stroke-dasharray', '5, 5');
                } else {
                    room.querySelector('rect').setAttribute('stroke', '#333');
                    room.querySelector('rect').setAttribute('stroke-width', '1');
                    room.querySelector('rect').setAttribute('stroke-dasharray', '');
                }
            });
        }
    }
    
    // Show reservation modal
    function showReservationModal(roomId = null) {
        // If room is specified, select it in the dropdown
        if (roomId) {
            const reservationRoom = document.getElementById('reservation-room');
            if (reservationRoom) {
                const options = reservationRoom.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === roomId) {
                        reservationRoom.selectedIndex = i;
                        break;
                    }
                }
            }
        }
        
        // Set default date to today
        const today = new Date();
        const dateInput = document.getElementById('reservation-date');
        if (dateInput) {
            dateInput.value = today.toISOString().split('T')[0];
        }
        
        // Show modal
        if (reservationModal) {
            reservationModal.classList.add('active');
        } else {
            console.warn('Reservation modal not found');
        }
    }
    
    // Show report modal
    function showReportModal(roomId = null) {
        // If room is specified, select it in the dropdown
        if (roomId) {
            const issueRoom = document.getElementById('issue-room');
            if (issueRoom) {
                const options = issueRoom.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === roomId) {
                        issueRoom.selectedIndex = i;
                        break;
                    }
                }
            }
        }
        
        // Show modal
        if (reportModal) {
            reportModal.classList.add('active');
        } else {
            console.warn('Report modal not found');
        }
    }
    
    // Close modal
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        } else {
            console.warn('Attempted to close a modal that does not exist');
        }
    }
    
    // Submit reservation
    function submitReservation() {
        const room = document.getElementById('reservation-room').value;
        const course = document.getElementById('reservation-course').value;
        const date = document.getElementById('reservation-date').value;
        const startTime = document.getElementById('reservation-start').value;
        const endTime = document.getElementById('reservation-end').value;
        const recurring = document.getElementById('reservation-recurring').value;
        const notes = document.getElementById('reservation-notes').value;
        
        if (!room || !course || !date || !startTime || !endTime) {
            alert('Please fill in all required fields');
            return;
        }
        
        // TODO: Submit reservation to server
        console.log('Submitting reservation:', {
            room,
            course,
            date,
            startTime,
            endTime,
            recurring,
            notes
        });
        
        // Show success message
        alert('Room reservation submitted successfully!');
        
        // Close modal
        closeModal(reservationModal);
    }
    
    // Submit report
    function submitReport() {
        const room = document.getElementById('issue-room').value;
        const issueType = document.getElementById('issue-type').value;
        const priority = document.getElementById('issue-priority').value;
        const description = document.getElementById('issue-description').value;
        
        if (!room || !issueType || !description) {
            alert('Please fill in all required fields');
            return;
        }
        
        // TODO: Submit report to server
        console.log('Submitting report:', {
            room,
            issueType,
            priority,
            description
        });
        
        // Show success message
        alert('Room issue report submitted successfully!');
        
        // Close modal
        closeModal(reportModal);
    }
    
    // Preview photo
    function previewPhoto(input) {
        const preview = document.getElementById('photo-preview');
        if (!preview) return;
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Issue Photo">`;
            };
            
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.innerHTML = '';
        }
    }
    
    // Initialize the map
    initMap();
});
