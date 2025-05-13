/**
 * Shared Data Service
 * This service handles data sharing and communication between Admin, Teacher, and Student interfaces
 */

class SharedDataService {
    constructor() {
        this.initialized = false;
        this.initializeData();
    }

    /**
     * Initialize data from localStorage or create default data if not exists
     */
    initializeData() {
        if (this.initialized) return;
        
        // Load or initialize reservations
        this.reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        if (!this.reservations.length) {
            this.createSampleReservations();
        }
        
        // Load or initialize notifications
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        if (!this.notifications.length) {
            this.createSampleNotifications();
        }
        
        // Load or initialize schedule conflicts
        this.conflicts = JSON.parse(localStorage.getItem('scheduleConflicts')) || [];
        
        // Load or initialize room availability
        this.roomAvailability = JSON.parse(localStorage.getItem('roomAvailability')) || this.getDefaultRoomAvailability();
        
        this.initialized = true;
    }
    
    /**
     * Save all data to localStorage
     */
    saveAllData() {
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        localStorage.setItem('scheduleConflicts', JSON.stringify(this.conflicts));
        localStorage.setItem('roomAvailability', JSON.stringify(this.roomAvailability));
    }
    
    /**
     * Create sample reservations for demo purposes
     */
    createSampleReservations() {
        this.reservations = [
            {
                id: 'R001',
                courseCode: 'CC100',
                courseTitle: 'INTRODUCTION TO COMPUTING',
                studentId: '2023-0001',
                studentName: 'Jane Smith',
                teacherId: 'T001',
                teacherName: 'Dr. Robert Johnson',
                days: ['Monday', 'Wednesday', 'Friday'],
                startTime: '9:00 AM',
                endTime: '10:30 AM',
                room: 'LR 3',
                requestDate: '2025-05-06',
                status: 'pending',
                reason: 'Regular class schedule',
                rejectionReason: '',
                notes: ''
            },
            {
                id: 'R002',
                courseCode: 'CC101',
                courseTitle: 'COMPUTER PROGRAMMING',
                studentId: '2023-0002',
                studentName: 'John Doe',
                teacherId: 'T001',
                teacherName: 'Dr. Robert Johnson',
                days: ['Tuesday', 'Thursday'],
                startTime: '1:00 PM',
                endTime: '3:00 PM',
                room: 'LR 4',
                requestDate: '2025-05-05',
                status: 'pending',
                reason: 'Regular class schedule',
                rejectionReason: '',
                notes: ''
            },
            {
                id: 'R003',
                courseCode: 'DS111',
                courseTitle: 'DISCRETE STRUCTURES 1',
                studentId: '2023-0003',
                studentName: 'Michael Brown',
                teacherId: 'T001',
                teacherName: 'Dr. Robert Johnson',
                days: ['Monday', 'Wednesday', 'Friday'],
                startTime: '10:30 AM',
                endTime: '12:00 PM',
                room: 'LR 5',
                requestDate: '2025-05-04',
                status: 'pending',
                reason: 'Regular class schedule',
                rejectionReason: '',
                notes: ''
            },
            {
                id: 'R004',
                courseCode: 'IT101',
                courseTitle: 'INTRODUCTION TO INFORMATION TECHNOLOGY',
                studentId: '2023-0001',
                studentName: 'Jane Smith',
                teacherId: 'T002',
                teacherName: 'Prof. William Chen',
                days: ['Tuesday', 'Thursday'],
                startTime: '1:00 PM',
                endTime: '2:30 PM',
                room: 'LR 5',
                requestDate: '2025-05-03',
                status: 'approved',
                reason: 'Regular class schedule',
                rejectionReason: '',
                notes: 'Approved by department chair'
            },
            {
                id: 'R005',
                courseCode: 'MATH201',
                courseTitle: 'CALCULUS II',
                studentId: '2023-0001',
                studentName: 'Jane Smith',
                teacherId: 'T003',
                teacherName: 'Prof. Sarah Lee',
                days: ['Monday', 'Wednesday', 'Friday'],
                startTime: '8:00 AM',
                endTime: '9:30 AM',
                room: 'LR 3',
                requestDate: '2025-05-02',
                status: 'rejected',
                reason: 'Regular class schedule',
                rejectionReason: 'Room not available at requested time',
                notes: ''
            }
        ];
    }
    
    /**
     * Create sample notifications for demo purposes
     */
    createSampleNotifications() {
        this.notifications = [
            {
                id: 'N001',
                type: 'alert',
                title: 'Class Cancelled',
                message: 'CC 101 Introduction to Computing is cancelled today',
                timestamp: new Date(new Date().getTime() - 10 * 60000).toISOString(), // 10 minutes ago
                read: false,
                recipients: ['2023-0001', '2023-0002', '2023-0003'] // Student IDs
            },
            {
                id: 'N002',
                type: 'info',
                title: 'Room Change',
                message: 'CC 100 Introduction to Computing moved to Room 104 ADTECH',
                timestamp: new Date(new Date().getTime() - 2 * 3600000).toISOString(), // 2 hours ago
                read: false,
                recipients: ['2023-0001', '2023-0002', '2023-0003'] // Student IDs
            },
            {
                id: 'N003',
                type: 'reminder',
                title: 'Class Reminder',
                message: 'CC 100 Introduction to Computing starts in 30 minutes',
                timestamp: new Date(new Date().getTime() - 30 * 60000).toISOString(), // 30 minutes ago
                read: false,
                recipients: ['2023-0001', '2023-0002', '2023-0003'] // Student IDs
            },
            {
                id: 'N004',
                type: 'reservation',
                title: 'Reservation Approved',
                message: 'Your reservation for IT 101 has been approved',
                timestamp: new Date(new Date().getTime() - 5 * 3600000).toISOString(), // 5 hours ago
                read: true,
                recipients: ['2023-0001'] // Student IDs
            },
            {
                id: 'N005',
                type: 'reservation',
                title: 'Reservation Rejected',
                message: 'Your reservation for MATH 201 has been rejected: Room not available at requested time',
                timestamp: new Date(new Date().getTime() - 1 * 86400000).toISOString(), // 1 day ago
                read: true,
                recipients: ['2023-0001'] // Student IDs
            }
        ];
    }
    
    /**
     * Get default room availability data
     */
    getDefaultRoomAvailability() {
        return {
            'LR 1': { capacity: 40, equipment: ['Projector', 'Whiteboard'], available: true },
            'LR 2': { capacity: 40, equipment: ['Projector', 'Whiteboard'], available: true },
            'LR 3': { capacity: 40, equipment: ['Projector', 'Whiteboard'], available: true },
            'LR 4': { capacity: 40, equipment: ['Projector', 'Whiteboard'], available: true },
            'LR 5': { capacity: 40, equipment: ['Projector', 'Whiteboard'], available: true },
            'Lab 1': { capacity: 30, equipment: ['Computers', 'Projector', 'Whiteboard'], available: true },
            'Lab 2': { capacity: 30, equipment: ['Computers', 'Projector', 'Whiteboard'], available: true },
            'Lab 3': { capacity: 30, equipment: ['Computers', 'Projector', 'Whiteboard'], available: true },
            'Auditorium': { capacity: 200, equipment: ['Projector', 'Sound System'], available: true }
        };
    }
    
    // ==========================================
    // Reservation Methods
    // ==========================================
    
    /**
     * Get all reservations
     * @returns {Array} All reservations
     */
    getAllReservations() {
        return this.reservations;
    }
    
    /**
     * Get reservations by status
     * @param {string} status - The status to filter by (pending, approved, rejected)
     * @returns {Array} Filtered reservations
     */
    getReservationsByStatus(status) {
        return this.reservations.filter(res => res.status === status);
    }
    
    /**
     * Get reservations for a specific teacher
     * @param {string} teacherId - The teacher's ID
     * @returns {Array} Teacher's reservations
     */
    getTeacherReservations(teacherId) {
        return this.reservations.filter(res => res.teacherId === teacherId);
    }
    
    /**
     * Get reservations for a specific student
     * @param {string} studentId - The student's ID
     * @returns {Array} Student's reservations
     */
    getStudentReservations(studentId) {
        return this.reservations.filter(res => res.studentId === studentId);
    }
    
    /**
     * Get a specific reservation by ID
     * @param {string} reservationId - The reservation ID
     * @returns {Object} The reservation object
     */
    getReservationById(reservationId) {
        return this.reservations.find(res => res.id === reservationId);
    }
    
    /**
     * Add a new reservation
     * @param {Object} reservation - The reservation object
     * @returns {string} The new reservation ID
     */
    addReservation(reservation) {
        // Generate a new ID
        const newId = 'R' + String(this.reservations.length + 1).padStart(3, '0');
        
        // Set default values
        const newReservation = {
            ...reservation,
            id: newId,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            rejectionReason: '',
            notes: ''
        };
        
        this.reservations.push(newReservation);
        this.saveAllData();
        
        // Create notification for teacher
        this.addNotification({
            type: 'reservation',
            title: 'New Reservation Request',
            message: `New reservation request for ${newReservation.courseCode} from ${newReservation.studentName}`,
            recipients: [newReservation.teacherId]
        });
        
        // Create notification for admin
        this.addNotification({
            type: 'reservation',
            title: 'New Reservation Request',
            message: `New reservation request for ${newReservation.courseCode} from ${newReservation.studentName}`,
            recipients: ['admin']
        });
        
        return newId;
    }
    
    /**
     * Update reservation status
     * @param {string} reservationId - The reservation ID
     * @param {string} status - The new status (approved, rejected)
     * @param {string} reason - Reason for rejection (if applicable)
     * @param {string} notes - Additional notes
     */
    updateReservationStatus(reservationId, status, reason = '', notes = '') {
        const reservation = this.getReservationById(reservationId);
        if (!reservation) return false;
        
        reservation.status = status;
        
        if (status === 'rejected' && reason) {
            reservation.rejectionReason = reason;
        }
        
        if (notes) {
            reservation.notes = notes;
        }
        
        this.saveAllData();
        
        // Create notification for student
        this.addNotification({
            type: 'reservation',
            title: `Reservation ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your reservation for ${reservation.courseCode} has been ${status}${reason ? ': ' + reason : ''}`,
            recipients: [reservation.studentId]
        });
        
        // Create notification for admin
        this.addNotification({
            type: 'reservation',
            title: `Reservation ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Reservation for ${reservation.courseCode} has been ${status} by ${reservation.teacherName}`,
            recipients: ['admin']
        });
        
        return true;
    }
    
    /**
     * Delete a reservation
     * @param {string} reservationId - The reservation ID
     * @returns {boolean} Success status
     */
    deleteReservation(reservationId) {
        const index = this.reservations.findIndex(res => res.id === reservationId);
        if (index === -1) return false;
        
        this.reservations.splice(index, 1);
        this.saveAllData();
        return true;
    }
    
    // ==========================================
    // Notification Methods
    // ==========================================
    
    /**
     * Get all notifications
     * @returns {Array} All notifications
     */
    getAllNotifications() {
        return this.notifications;
    }
    
    /**
     * Get notifications for a specific user
     * @param {string} userId - The user's ID
     * @returns {Array} User's notifications
     */
    getUserNotifications(userId) {
        return this.notifications.filter(notif => notif.recipients.includes(userId));
    }
    
    /**
     * Add a new notification
     * @param {Object} notification - The notification object
     * @returns {string} The new notification ID
     */
    addNotification(notification) {
        // Generate a new ID
        const newId = 'N' + String(this.notifications.length + 1).padStart(3, '0');
        
        // Set default values
        const newNotification = {
            ...notification,
            id: newId,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.notifications.push(newNotification);
        this.saveAllData();
        
        return newId;
    }
    
    /**
     * Mark notification as read
     * @param {string} notificationId - The notification ID
     * @returns {boolean} Success status
     */
    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(notif => notif.id === notificationId);
        if (!notification) return false;
        
        notification.read = true;
        this.saveAllData();
        
        return true;
    }
    
    /**
     * Delete a notification
     * @param {string} notificationId - The notification ID
     * @returns {boolean} Success status
     */
    deleteNotification(notificationId) {
        const index = this.notifications.findIndex(notif => notif.id === notificationId);
        if (index === -1) return false;
        
        this.notifications.splice(index, 1);
        this.saveAllData();
        
        return true;
    }
    
    // ==========================================
    // Room Availability Methods
    // ==========================================
    
    /**
     * Get all room availability data
     * @returns {Object} Room availability data
     */
    getAllRoomAvailability() {
        return this.roomAvailability;
    }
    
    /**
     * Update room availability
     * @param {string} roomId - The room ID
     * @param {boolean} available - Whether the room is available
     * @returns {boolean} Success status
     */
    updateRoomAvailability(roomId, available) {
        if (!this.roomAvailability[roomId]) return false;
        
        this.roomAvailability[roomId].available = available;
        this.saveAllData();
        
        return true;
    }
    
    // ==========================================
    // Schedule Conflict Methods
    // ==========================================
    
    /**
     * Get all schedule conflicts
     * @returns {Array} All schedule conflicts
     */
    getAllConflicts() {
        return this.conflicts;
    }
    
    /**
     * Add a new schedule conflict
     * @param {Object} conflict - The conflict object
     * @returns {string} The new conflict ID
     */
    addConflict(conflict) {
        // Generate a new ID
        const newId = 'C' + String(this.conflicts.length + 1).padStart(3, '0');
        
        // Set default values
        const newConflict = {
            ...conflict,
            id: newId,
            detectedDate: new Date().toISOString().split('T')[0],
            resolved: false
        };
        
        this.conflicts.push(newConflict);
        this.saveAllData();
        
        // Create notification for admin
        this.addNotification({
            type: 'conflict',
            title: 'Scheduling Conflict Detected',
            message: `Conflict detected between ${newConflict.course1} and ${newConflict.course2}`,
            recipients: ['admin']
        });
        
        // Create notification for affected teachers
        this.addNotification({
            type: 'conflict',
            title: 'Scheduling Conflict Detected',
            message: `Conflict detected for your course ${newConflict.course1}`,
            recipients: [newConflict.teacher1Id]
        });
        
        this.addNotification({
            type: 'conflict',
            title: 'Scheduling Conflict Detected',
            message: `Conflict detected for your course ${newConflict.course2}`,
            recipients: [newConflict.teacher2Id]
        });
        
        return newId;
    }
    
    /**
     * Resolve a schedule conflict
     * @param {string} conflictId - The conflict ID
     * @returns {boolean} Success status
     */
    resolveConflict(conflictId) {
        const conflict = this.conflicts.find(conf => conf.id === conflictId);
        if (!conflict) return false;
        
        conflict.resolved = true;
        this.saveAllData();
        
        // Create notification for affected teachers
        this.addNotification({
            type: 'conflict',
            title: 'Scheduling Conflict Resolved',
            message: `The conflict for your course ${conflict.course1} has been resolved`,
            recipients: [conflict.teacher1Id]
        });
        
        this.addNotification({
            type: 'conflict',
            title: 'Scheduling Conflict Resolved',
            message: `The conflict for your course ${conflict.course2} has been resolved`,
            recipients: [conflict.teacher2Id]
        });
        
        return true;
    }
}

// Create a singleton instance
const sharedDataService = new SharedDataService();
