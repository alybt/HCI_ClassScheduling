/**
 * Map Editor JavaScript
 * Provides functionality for the admin map editor interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvas = document.getElementById('editor-canvas');
    const buildingSelect = document.getElementById('building-select');
    const floorSelect = document.getElementById('floor-select');
    const addBuildingBtn = document.getElementById('add-building-btn');
    const saveMapBtn = document.getElementById('save-map-btn');
    const previewMapBtn = document.getElementById('preview-map-btn');
    const exportMapBtn = document.getElementById('export-map-btn');
    
    // Tool buttons
    const selectTool = document.getElementById('select-tool');
    const drawTool = document.getElementById('draw-tool');
    const eraseTool = document.getElementById('erase-tool');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetViewBtn = document.getElementById('reset-view');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const gridToggleBtn = document.getElementById('grid-toggle');
    const snapToggleBtn = document.getElementById('snap-toggle');
    
    // Modals
    const addBuildingModal = document.getElementById('add-building-modal');
    const roomDetailsModal = document.getElementById('room-details-modal');
    const previewModal = document.getElementById('preview-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Form elements
    const applyPropertiesBtn = document.getElementById('apply-properties');
    const createBuildingBtn = document.getElementById('create-building-btn');
    const cancelBuildingBtn = document.getElementById('cancel-building-btn');
    
    // State variables
    let currentTool = 'select';
    let selectedElement = null;
    let isDragging = false;
    let startX, startY;
    let currentScale = 1;
    let gridEnabled = true;
    let snapEnabled = true;
    let undoStack = [];
    let redoStack = [];
    
    // Initialize map editor
    function initMapEditor() {
        // Set up event listeners
        setupEventListeners();
        
        // Initialize grid
        toggleGrid(true);
        
        // Make elements selectable and draggable
        makeElementsInteractive();
        
        // Save initial state for undo
        saveState();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Tool selection
        selectTool.addEventListener('click', () => setActiveTool('select'));
        drawTool.addEventListener('click', () => setActiveTool('draw'));
        eraseTool.addEventListener('click', () => setActiveTool('erase'));
        
        // Zoom controls
        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
        resetViewBtn.addEventListener('click', resetView);
        
        // Undo/Redo
        undoBtn.addEventListener('click', undo);
        redoBtn.addEventListener('click', redo);
        
        // Grid and snap
        gridToggleBtn.addEventListener('click', () => toggleGrid());
        snapToggleBtn.addEventListener('click', () => toggleSnap());
        
        // Building and floor selection
        buildingSelect.addEventListener('change', changeBuilding);
        floorSelect.addEventListener('change', changeFloor);
        
        // Buttons
        addBuildingBtn.addEventListener('click', showAddBuildingModal);
        saveMapBtn.addEventListener('click', saveMap);
        previewMapBtn.addEventListener('click', previewMap);
        exportMapBtn.addEventListener('click', exportMap);
        
        // Apply properties
        applyPropertiesBtn.addEventListener('click', applyProperties);
        
        // Modal buttons
        createBuildingBtn.addEventListener('click', createBuilding);
        cancelBuildingBtn.addEventListener('click', hideAddBuildingModal);
        
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Room list actions
        setupRoomListActions();
        
        // Element drag and drop
        setupDragAndDrop();
    }
    
    // Set active tool
    function setActiveTool(tool) {
        currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`${tool}-tool`).classList.add('active');
        
        // Change cursor based on tool
        switch(tool) {
            case 'select':
                canvas.style.cursor = 'default';
                break;
            case 'draw':
                canvas.style.cursor = 'crosshair';
                break;
            case 'erase':
                canvas.style.cursor = 'no-drop';
                break;
        }
    }
    
    // Make SVG elements interactive
    function makeElementsInteractive() {
        const mapElements = document.querySelectorAll('.map-element');
        
        mapElements.forEach(element => {
            // Select element on click
            element.addEventListener('click', function(e) {
                if (currentTool === 'select') {
                    selectElement(this);
                } else if (currentTool === 'erase') {
                    deleteElement(this);
                }
                e.stopPropagation();
            });
            
            // Drag functionality
            element.addEventListener('mousedown', startDrag);
        });
        
        // Deselect when clicking on canvas background
        canvas.addEventListener('click', function(e) {
            if (e.target === canvas) {
                deselectElement();
            }
        });
    }
    
    // Select an element
    function selectElement(element) {
        // Deselect previous element
        deselectElement();
        
        // Select new element
        selectedElement = element;
        element.classList.add('selected');
        
        // Show element properties
        showElementProperties(element);
    }
    
    // Deselect element
    function deselectElement() {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
            
            // Clear properties panel
            clearElementProperties();
        }
    }
    
    // Show element properties in the properties panel
    function showElementProperties(element) {
        const elementType = element.getAttribute('data-element-type');
        const elementId = element.getAttribute('data-element-id');
        
        // Get the rect element inside the group
        const rect = element.querySelector('rect');
        
        if (rect) {
            // Set form values
            document.getElementById('element-type').value = elementType;
            document.getElementById('room-id').value = element.getAttribute('data-room-id') || '';
            document.getElementById('room-name').value = element.querySelector('text')?.textContent || '';
            document.getElementById('element-width').value = rect.getAttribute('width');
            document.getElementById('element-height').value = rect.getAttribute('height');
            document.getElementById('element-x').value = rect.getAttribute('x');
            document.getElementById('element-y').value = rect.getAttribute('y');
            document.getElementById('element-fill').value = rgbToHex(rect.getAttribute('fill'));
            document.getElementById('element-stroke').value = rgbToHex(rect.getAttribute('stroke'));
            document.getElementById('element-stroke-width').value = rect.getAttribute('stroke-width');
        }
    }
    
    // Clear element properties
    function clearElementProperties() {
        document.getElementById('element-type').value = 'room';
        document.getElementById('room-id').value = '';
        document.getElementById('room-name').value = '';
        document.getElementById('element-width').value = '150';
        document.getElementById('element-height').value = '150';
        document.getElementById('element-x').value = '0';
        document.getElementById('element-y').value = '0';
        document.getElementById('element-fill').value = '#a5d6a7';
        document.getElementById('element-stroke').value = '#333333';
        document.getElementById('element-stroke-width').value = '2';
        document.getElementById('room-capacity').value = '30';
        document.getElementById('room-type').value = 'classroom';
    }
    
    // Apply properties to selected element
    function applyProperties() {
        if (!selectedElement) return;
        
        // Save state for undo
        saveState();
        
        const elementType = document.getElementById('element-type').value;
        const roomId = document.getElementById('room-id').value;
        const roomName = document.getElementById('room-name').value;
        const width = document.getElementById('element-width').value;
        const height = document.getElementById('element-height').value;
        const x = document.getElementById('element-x').value;
        const y = document.getElementById('element-y').value;
        const fill = document.getElementById('element-fill').value;
        const stroke = document.getElementById('element-stroke').value;
        const strokeWidth = document.getElementById('element-stroke-width').value;
        
        // Update element attributes
        selectedElement.setAttribute('data-element-type', elementType);
        selectedElement.setAttribute('data-room-id', roomId);
        
        // Update rect attributes
        const rect = selectedElement.querySelector('rect');
        if (rect) {
            rect.setAttribute('width', width);
            rect.setAttribute('height', height);
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('fill', fill);
            rect.setAttribute('stroke', stroke);
            rect.setAttribute('stroke-width', strokeWidth);
        }
        
        // Update text
        const text = selectedElement.querySelector('text');
        if (text) {
            text.textContent = roomName;
            text.setAttribute('x', parseInt(x) + parseInt(width) / 2);
            text.setAttribute('y', parseInt(y) + parseInt(height) / 2);
        }
        
        // Update room list if needed
        updateRoomList();
    }
    
    // Start dragging an element
    function startDrag(e) {
        if (currentTool !== 'select') return;
        
        // Select this element
        selectElement(this);
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Add event listeners for drag
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        e.preventDefault();
    }
    
    // Drag element
    function drag(e) {
        if (!isDragging || !selectedElement) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Get the rect element
        const rect = selectedElement.querySelector('rect');
        const text = selectedElement.querySelector('text');
        
        if (rect) {
            // Get current position
            let x = parseInt(rect.getAttribute('x'));
            let y = parseInt(rect.getAttribute('y'));
            
            // Calculate new position
            let newX = x + dx;
            let newY = y + dy;
            
            // Apply snap to grid if enabled
            if (snapEnabled) {
                const gridSize = 20;
                newX = Math.round(newX / gridSize) * gridSize;
                newY = Math.round(newY / gridSize) * gridSize;
            }
            
            // Update rect position
            rect.setAttribute('x', newX);
            rect.setAttribute('y', newY);
            
            // Update text position
            if (text) {
                const width = parseInt(rect.getAttribute('width'));
                const height = parseInt(rect.getAttribute('height'));
                text.setAttribute('x', newX + width / 2);
                text.setAttribute('y', newY + height / 2);
            }
            
            // Update properties panel
            document.getElementById('element-x').value = newX;
            document.getElementById('element-y').value = newY;
        }
        
        // Update start position for next move
        startX = e.clientX;
        startY = e.clientY;
    }
    
    // Stop dragging
    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            
            // Save state for undo
            saveState();
        }
    }
    
    // Delete an element
    function deleteElement(element) {
        // Save state for undo
        saveState();
        
        // Remove element
        element.remove();
        
        // Update room list
        updateRoomList();
    }
    
    // Toggle grid visibility
    function toggleGrid(forceState) {
        const grid = document.getElementById('editor-grid');
        
        if (forceState !== undefined) {
            gridEnabled = forceState;
        } else {
            gridEnabled = !gridEnabled;
        }
        
        if (gridEnabled) {
            grid.style.display = 'block';
            gridToggleBtn.classList.add('active');
        } else {
            grid.style.display = 'none';
            gridToggleBtn.classList.remove('active');
        }
    }
    
    // Toggle snap to grid
    function toggleSnap() {
        snapEnabled = !snapEnabled;
        
        if (snapEnabled) {
            snapToggleBtn.classList.add('active');
        } else {
            snapToggleBtn.classList.remove('active');
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
    
    // Apply zoom level
    function applyZoom() {
        canvas.style.transform = `scale(${currentScale})`;
        canvas.style.transformOrigin = 'center';
    }
    
    // Save current state for undo
    function saveState() {
        const currentState = canvas.innerHTML;
        undoStack.push(currentState);
        
        // Clear redo stack when a new action is performed
        redoStack = [];
        
        // Limit stack size
        if (undoStack.length > 20) {
            undoStack.shift();
        }
    }
    
    // Undo last action
    function undo() {
        if (undoStack.length <= 1) return;
        
        // Save current state to redo stack
        redoStack.push(undoStack.pop());
        
        // Restore previous state
        canvas.innerHTML = undoStack[undoStack.length - 1];
        
        // Reattach event listeners
        makeElementsInteractive();
    }
    
    // Redo last undone action
    function redo() {
        if (redoStack.length === 0) return;
        
        // Get state from redo stack
        const state = redoStack.pop();
        
        // Save current state to undo stack
        undoStack.push(state);
        
        // Restore state
        canvas.innerHTML = state;
        
        // Reattach event listeners
        makeElementsInteractive();
    }
    
    // Change building
    function changeBuilding() {
        const building = buildingSelect.value;
        console.log(`Changed to building: ${building}`);
        
        // TODO: Load building data
    }
    
    // Change floor
    function changeFloor() {
        const floor = floorSelect.value;
        console.log(`Changed to floor: ${floor}`);
        
        // TODO: Load floor data
    }
    
    // Show add building modal
    function showAddBuildingModal() {
        addBuildingModal.classList.add('active');
    }
    
    // Hide add building modal
    function hideAddBuildingModal() {
        addBuildingModal.classList.remove('active');
    }
    
    // Create new building
    function createBuilding() {
        const buildingId = document.getElementById('building-id').value;
        const buildingName = document.getElementById('building-name').value;
        const floors = document.getElementById('building-floors').value;
        
        if (!buildingId || !buildingName) {
            alert('Please enter building ID and name');
            return;
        }
        
        console.log(`Creating building: ${buildingName} (${buildingId}) with ${floors} floors`);
        
        // TODO: Create building data structure
        
        // Add to building select
        const option = document.createElement('option');
        option.value = buildingId;
        option.textContent = buildingName;
        buildingSelect.appendChild(option);
        buildingSelect.value = buildingId;
        
        // Hide modal
        hideAddBuildingModal();
    }
    
    // Save map
    function saveMap() {
        console.log('Saving map...');
        
        // TODO: Save map data to server/localStorage
        
        alert('Map saved successfully!');
    }
    
    // Preview map
    function previewMap() {
        console.log('Previewing map...');
        
        // Show preview modal
        previewModal.classList.add('active');
        
        // Clone canvas for preview
        const previewWrapper = document.querySelector('.preview-wrapper');
        previewWrapper.innerHTML = '';
        const canvasClone = canvas.cloneNode(true);
        previewWrapper.appendChild(canvasClone);
    }
    
    // Export map
    function exportMap() {
        console.log('Exporting map...');
        
        // Create a blob with the SVG content
        const svgData = new XMLSerializer().serializeToString(canvas);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `map_${buildingSelect.value}_floor${floorSelect.value}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Setup room list actions
    function setupRoomListActions() {
        const roomList = document.getElementById('editor-room-list');
        
        // Add click event to room items
        roomList.addEventListener('click', function(e) {
            const roomItem = e.target.closest('.room-item');
            if (!roomItem) return;
            
            const roomId = roomItem.getAttribute('data-room-id');
            
            // Check if edit or delete button was clicked
            if (e.target.closest('.btn-edit')) {
                editRoom(roomId);
            } else if (e.target.closest('.btn-delete')) {
                confirmDeleteRoom(roomId);
            } else {
                // Select the room on the map
                selectRoomOnMap(roomId);
            }
        });
    }
    
    // Edit room
    function editRoom(roomId) {
        console.log(`Editing room: ${roomId}`);
        
        // Show room details modal
        const modal = document.getElementById('room-details-modal');
        modal.classList.add('active');
        
        // Set room details
        document.getElementById('detail-room-id').value = roomId;
        
        // TODO: Load room data
    }
    
    // Confirm delete room
    function confirmDeleteRoom(roomId) {
        if (confirm(`Are you sure you want to delete room ${roomId}?`)) {
            deleteRoom(roomId);
        }
    }
    
    // Delete room
    function deleteRoom(roomId) {
        console.log(`Deleting room: ${roomId}`);
        
        // Save state for undo
        saveState();
        
        // Find and remove the room element
        const roomElement = document.querySelector(`.map-element[data-room-id="${roomId}"]`);
        if (roomElement) {
            roomElement.remove();
        }
        
        // Update room list
        updateRoomList();
    }
    
    // Select room on map
    function selectRoomOnMap(roomId) {
        const roomElement = document.querySelector(`.map-element[data-room-id="${roomId}"]`);
        if (roomElement) {
            selectElement(roomElement);
        }
    }
    
    // Update room list
    function updateRoomList() {
        const roomList = document.getElementById('editor-room-list');
        roomList.innerHTML = '';
        
        // Get all room elements
        const roomElements = document.querySelectorAll('.map-element[data-room-id]');
        
        roomElements.forEach(element => {
            const roomId = element.getAttribute('data-room-id');
            const roomName = element.querySelector('text')?.textContent || roomId;
            
            // Create room item
            const roomItem = document.createElement('div');
            roomItem.className = 'room-item';
            roomItem.setAttribute('data-room-id', roomId);
            roomItem.innerHTML = `
                <span>${roomName}</span>
                <div class="room-actions">
                    <button class="btn-edit" title="Edit Room"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" title="Delete Room"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            roomList.appendChild(roomItem);
        });
    }
    
    // Setup drag and drop for new elements
    function setupDragAndDrop() {
        const elementItems = document.querySelectorAll('.element-item');
        
        elementItems.forEach(item => {
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.getAttribute('data-element'));
            });
        });
        
        canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        canvas.addEventListener('drop', function(e) {
            e.preventDefault();
            
            const elementType = e.dataTransfer.getData('text/plain');
            
            // Get drop position relative to canvas
            const rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            
            // Apply snap to grid if enabled
            if (snapEnabled) {
                const gridSize = 20;
                x = Math.round(x / gridSize) * gridSize;
                y = Math.round(y / gridSize) * gridSize;
            }
            
            // Create new element
            createNewElement(elementType, x, y);
        });
    }
    
    // Create new element
    function createNewElement(elementType, x, y) {
        // Save state for undo
        saveState();
        
        // Generate unique ID
        const elementId = `${elementType}-${Date.now()}`;
        const roomId = elementType === 'room' ? `room-${Date.now()}` : '';
        
        // Create SVG group
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('map-element');
        group.setAttribute('data-element-type', elementType);
        group.setAttribute('data-element-id', elementId);
        
        if (elementType === 'room') {
            group.setAttribute('data-room-id', roomId);
        }
        
        // Create element based on type
        switch (elementType) {
            case 'room':
                createRoomElement(group, x, y, 150, 150, roomId);
                break;
            case 'corridor':
                createCorridorElement(group, x, y, 50, 200);
                break;
            case 'stairs':
                createStairsElement(group, x, y, 100, 100);
                break;
            case 'door':
                createDoorElement(group, x, y, 30, 5);
                break;
            case 'text':
                createTextElement(group, x, y, 'Label');
                break;
        }
        
        // Add to canvas
        canvas.appendChild(group);
        
        // Make interactive
        group.addEventListener('click', function(e) {
            if (currentTool === 'select') {
                selectElement(this);
            } else if (currentTool === 'erase') {
                deleteElement(this);
            }
            e.stopPropagation();
        });
        
        group.addEventListener('mousedown', startDrag);
        
        // Select the new element
        selectElement(group);
        
        // Update room list if it's a room
        if (elementType === 'room') {
            updateRoomList();
        }
    }
    
    // Create room element
    function createRoomElement(group, x, y, width, height, roomId) {
        // Create rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', '#a5d6a7');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', 2);
        
        // Create text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + width / 2);
        text.setAttribute('y', y + height / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333');
        text.textContent = roomId.toUpperCase();
        
        // Add to group
        group.appendChild(rect);
        group.appendChild(text);
    }
    
    // Create corridor element
    function createCorridorElement(group, x, y, width, height) {
        // Create rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', '#e0e0e0');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', 1);
        
        // Add to group
        group.appendChild(rect);
    }
    
    // Create stairs element
    function createStairsElement(group, x, y, width, height) {
        // Create rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', '#d1c4e9');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', 2);
        
        // Create text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + width / 2);
        text.setAttribute('y', y + height / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333');
        text.textContent = 'STAIRS';
        
        // Add to group
        group.appendChild(rect);
        group.appendChild(text);
    }
    
    // Create door element
    function createDoorElement(group, x, y, width, height) {
        // Create rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', '#795548');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', 1);
        
        // Add to group
        group.appendChild(rect);
    }
    
    // Create text element
    function createTextElement(group, x, y, content) {
        // Create text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333');
        text.setAttribute('font-size', '16');
        text.textContent = content;
        
        // Add to group
        group.appendChild(text);
    }
    
    // Convert RGB to Hex
    function rgbToHex(rgb) {
        // If already hex, return it
        if (rgb && rgb.startsWith('#')) {
            return rgb;
        }
        
        // If rgb format, convert to hex
        if (rgb && rgb.startsWith('rgb')) {
            const rgbArray = rgb.match(/\d+/g);
            if (rgbArray && rgbArray.length === 3) {
                return '#' + rgbArray.map(x => {
                    const hex = parseInt(x).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('');
            }
        }
        
        // Default
        return '#333333';
    }
    
    // Initialize the map editor
    initMapEditor();
});
