/**
 * Rooms Database
 * Contains information about all available rooms across campus buildings
 */

// Define the buildings
const buildings = [
    {
        id: "CCS",
        name: "CCS Building",
        floors: 4,
        description: "College of Computer Studies Building"
    },
    {
        id: "OLD",
        name: "Old Building",
        floors: 3,
        description: "Original campus building with lecture halls and labs"
    }
];

// Define room types
const roomTypes = {
    "LR": "Lecture Room",
    "LAB": "Computer Laboratory",
    "CONF": "Conference Room",
    "STUDY": "Study Area"
};

// Define all rooms
const rooms = [
    // CCS Building Rooms
    {
        id: "CCS-LAB1",
        name: "Lab 1",
        building: "CCS",
        floor: 1,
        type: "LAB",
        capacity: 30,
        features: ["Computers", "Projector", "Whiteboard", "Air Conditioning", "Specialized Software"],
        availability: {
            "Monday": ["7:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Tuesday": ["7:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Wednesday": ["7:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Thursday": ["7:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Friday": ["7:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Saturday": ["7:00 AM - 12:00 PM"]
        }
    },
    {
        id: "CCS-LAB2",
        name: "Lab 2",
        building: "CCS",
        floor: 1,
        type: "LAB",
        capacity: 30,
        features: ["Computers", "Projector", "Whiteboard", "Air Conditioning", "Specialized Software"],
        availability: {
            "Monday": ["7:00 AM - 10:00 AM", "1:00 PM - 4:00 PM"],
            "Tuesday": ["10:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Wednesday": ["7:00 AM - 10:00 AM", "1:00 PM - 4:00 PM"],
            "Thursday": ["10:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Friday": ["10:00 AM - 1:00 PM", "4:00 PM - 8:00 PM"],
            "Saturday": ["7:00 AM - 12:00 PM"]
        }
    },
    {
        id: "CCS-LR1",
        name: "LR 1",
        building: "CCS",
        floor: 2,
        type: "LR",
        capacity: 40,
        features: ["Projector", "Whiteboard", "Air Conditioning"],
        availability: {
            "Monday": ["7:00 AM - 9:00 AM", "12:00 PM - 1:30 PM", "4:30 PM - 8:00 PM"],
            "Tuesday": ["7:00 AM - 10:30 AM", "3:00 PM - 8:00 PM"],
            "Wednesday": ["7:00 AM - 9:00 AM", "12:00 PM - 1:30 PM", "4:30 PM - 8:00 PM"],
            "Thursday": ["7:00 AM - 10:30 AM", "3:00 PM - 8:00 PM"],
            "Friday": ["10:30 AM - 12:00 PM", "1:30 PM - 8:00 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    },
    {
        id: "CCS-LR2",
        name: "LR 2",
        building: "CCS",
        floor: 2,
        type: "LR",
        capacity: 40,
        features: ["Projector", "Whiteboard", "Air Conditioning"],
        availability: {
            "Monday": ["10:30 AM - 12:00 PM", "1:30 PM - 4:30 PM"],
            "Tuesday": ["10:30 AM - 1:00 PM", "4:30 PM - 8:00 PM"],
            "Wednesday": ["10:30 AM - 12:00 PM", "1:30 PM - 4:30 PM"],
            "Thursday": ["10:30 AM - 1:00 PM", "4:30 PM - 8:00 PM"],
            "Friday": ["7:00 AM - 10:30 AM", "12:00 PM - 1:30 PM", "4:30 PM - 8:00 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    },
    {
        id: "CCS-LR5",
        name: "LR 5",
        building: "CCS",
        floor: 3,
        type: "LR",
        capacity: 50,
        features: ["Projector", "Whiteboard", "Air Conditioning", "Smart Board", "Audio System"],
        availability: {
            "Monday": ["10:30 AM - 12:00 PM", "2:30 PM - 8:00 PM"],
            "Tuesday": ["7:00 AM - 10:30 AM", "1:30 PM - 3:00 PM"],
            "Wednesday": ["10:30 AM - 12:00 PM", "2:30 PM - 8:00 PM"],
            "Thursday": ["7:00 AM - 10:30 AM", "1:30 PM - 3:00 PM"],
            "Friday": ["7:00 AM - 10:30 AM", "1:30 PM - 3:00 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    },
    {
        id: "CCS-CONF1",
        name: "Conference Room 1",
        building: "CCS",
        floor: 3,
        type: "CONF",
        capacity: 20,
        features: ["Projector", "Whiteboard", "Air Conditioning", "Video Conferencing", "Round Table"],
        availability: {
            "Monday": ["7:00 AM - 8:00 PM"],
            "Tuesday": ["7:00 AM - 8:00 PM"],
            "Wednesday": ["7:00 AM - 8:00 PM"],
            "Thursday": ["7:00 AM - 8:00 PM"],
            "Friday": ["7:00 AM - 8:00 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    },
    
    // Old Building Rooms
    {
        id: "OLD-LR3",
        name: "LR 3",
        building: "OLD",
        floor: 2,
        type: "LR",
        capacity: 40,
        features: ["Projector", "Whiteboard", "Air Conditioning"],
        availability: {
            "Monday": ["7:00 AM - 8:00 PM"],
            "Tuesday": ["7:00 AM - 10:30 AM", "1:30 PM - 8:00 PM"],
            "Wednesday": ["7:00 AM - 8:00 PM"],
            "Thursday": ["7:00 AM - 10:30 AM", "1:30 PM - 8:00 PM"],
            "Friday": ["7:00 AM - 10:30 AM", "1:30 PM - 8:00 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    },
    {
        id: "OLD-LR4",
        name: "LR 4",
        building: "OLD",
        floor: 2,
        type: "LR",
        capacity: 45,
        features: ["Projector", "Whiteboard", "Air Conditioning", "Smart Board"],
        availability: {
            "Monday": ["7:00 AM - 8:30 AM", "12:00 PM - 8:00 PM"],
            "Tuesday": ["10:30 AM - 12:00 PM", "1:30 PM - 4:30 PM"],
            "Wednesday": ["7:00 AM - 8:30 AM", "12:00 PM - 8:00 PM"],
            "Thursday": ["10:30 AM - 12:00 PM", "1:30 PM - 4:30 PM"],
            "Friday": ["10:30 AM - 12:00 PM", "1:30 PM - 4:30 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    },
    {
        id: "OLD-STUDY1",
        name: "Study Area 1",
        building: "OLD",
        floor: 3,
        type: "STUDY",
        capacity: 30,
        features: ["Tables", "Chairs", "Wi-Fi", "Power Outlets"],
        availability: {
            "Monday": ["7:00 AM - 8:00 PM"],
            "Tuesday": ["7:00 AM - 8:00 PM"],
            "Wednesday": ["7:00 AM - 8:00 PM"],
            "Thursday": ["7:00 AM - 8:00 PM"],
            "Friday": ["7:00 AM - 8:00 PM"],
            "Saturday": ["7:00 AM - 5:00 PM"]
        }
    }
];

/**
 * Get available rooms based on preferred days, time, and type
 * @param {Array} preferredDays - Array of preferred days (e.g., ["Monday", "Wednesday", "Friday"])
 * @param {string} startTime - Start time in 24-hour format (e.g., "08:00")
 * @param {string} endTime - End time in 24-hour format (e.g., "09:30")
 * @param {string} roomType - Type of room (optional)
 * @returns {Array} - Array of available rooms
 */
function getAvailableRooms(preferredDays, startTime, endTime, roomType = null) {
    // Convert times to 24-hour format for comparison
    const requestedStartTime = convertTo24Hour(startTime);
    const requestedEndTime = convertTo24Hour(endTime);
    
    // Filter rooms based on type if specified
    let filteredRooms = rooms;
    if (roomType) {
        filteredRooms = rooms.filter(room => room.type === roomType);
    }
    
    // Check availability for each room on the preferred days and time
    const availableRooms = filteredRooms.filter(room => {
        // Check if the room is available on all preferred days
        return preferredDays.every(day => {
            // Get availability slots for the day
            const daySlots = room.availability[day] || [];
            
            // Check if any slot contains the requested time
            return daySlots.some(slot => {
                const [slotStart, slotEnd] = slot.split(' - ').map(convertTo24Hour);
                
                // Check if the requested time fits within this slot
                return requestedStartTime >= slotStart && requestedEndTime <= slotEnd;
            });
        });
    });
    
    return availableRooms;
}

/**
 * Convert time from 12-hour format to 24-hour format
 * @param {string} time - Time in 12-hour format (e.g., "9:00 AM")
 * @returns {string} - Time in 24-hour format (e.g., "09:00")
 */
function convertTo24Hour(time) {
    if (!time.includes('AM') && !time.includes('PM')) {
        // Already in 24-hour format
        return time;
    }
    
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));
    
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Convert time from 24-hour format to 12-hour format
 * @param {string} time - Time in 24-hour format (e.g., "14:30")
 * @returns {string} - Time in 12-hour format (e.g., "2:30 PM")
 */
function convertTo12Hour(time) {
    const [hours, minutes] = time.split(':').map(part => parseInt(part, 10));
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get room details by ID
 * @param {string} roomId - The ID of the room
 * @returns {Object} - Room details
 */
function getRoomById(roomId) {
    return rooms.find(room => room.id === roomId);
}

/**
 * Get all rooms in a building
 * @param {string} buildingId - The ID of the building
 * @returns {Array} - Array of rooms in the building
 */
function getRoomsByBuilding(buildingId) {
    return rooms.filter(room => room.building === buildingId);
}

/**
 * Get all rooms of a specific type
 * @param {string} type - The type of room
 * @returns {Array} - Array of rooms of the specified type
 */
function getRoomsByType(type) {
    return rooms.filter(room => room.type === type);
}
