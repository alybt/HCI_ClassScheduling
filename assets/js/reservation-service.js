/**
 * Reservation Service
 * Handles reservation operations and communication between Admin, Teacher, and Student interfaces
 */

class ReservationService {
    constructor() {
        // Ensure SharedDataService is available
        if (typeof sharedDataService === 'undefined') {
            console.error('SharedDataService not found. Make sure to include shared-data-service.js first.');
            return;
        }
        
        this.dataService = sharedDataService;
        this.currentUserId = sessionStorage.getItem('userId') || sessionStorage.getItem('username');
        this.currentUserRole = sessionStorage.getItem('userRole');
    }
    
    /**
     * Get all reservations based on user role
     * @returns {Array} Filtered reservations based on user role
     */
    getReservations() {
        if (!this.currentUserId || !this.currentUserRole) {
            console.error('User not authenticated');
            return [];
        }
        
        switch (this.currentUserRole) {
            case 'admin':
                return this.dataService.getAllReservations();
            case 'teacher':
                return this.dataService.getTeacherReservations(this.currentUserId);
            case 'student':
                return this.dataService.getStudentReservations(this.currentUserId);
            default:
                return [];
        }
    }
    
    /**
     * Get reservations by status
     * @param {string} status - The status to filter by (pending, approved, rejected)
     * @returns {Array} Filtered reservations
     */
    getReservationsByStatus(status) {
        const reservations = this.getReservations();
        return reservations.filter(res => res.status === status);
    }
    
    /**
     * Create a new reservation request (Student)
     * @param {Object} reservationData - The reservation data
     * @returns {string} The new reservation ID
     */
    createReservation(reservationData) {
        if (this.currentUserRole !== 'student') {
            console.error('Only students can create reservations');
            return null;
        }
        
        // Add student info to reservation data
        const completeData = {
            ...reservationData,
            studentId: this.currentUserId,
            studentName: this.getUserDisplayName()
        };
        
        return this.dataService.addReservation(completeData);
    }
    
    /**
     * Approve a reservation request (Teacher or Admin)
     * @param {string} reservationId - The reservation ID
     * @param {string} notes - Additional notes
     * @returns {boolean} Success status
     */
    approveReservation(reservationId, notes = '') {
        if (this.currentUserRole !== 'teacher' && this.currentUserRole !== 'admin') {
            console.error('Only teachers or admins can approve reservations');
            return false;
        }
        
        return this.dataService.updateReservationStatus(reservationId, 'approved', '', notes);
    }
    
    /**
     * Reject a reservation request (Teacher or Admin)
     * @param {string} reservationId - The reservation ID
     * @param {string} reason - Reason for rejection
     * @param {string} notes - Additional notes
     * @returns {boolean} Success status
     */
    rejectReservation(reservationId, reason, notes = '') {
        if (this.currentUserRole !== 'teacher' && this.currentUserRole !== 'admin') {
            console.error('Only teachers or admins can reject reservations');
            return false;
        }
        
        return this.dataService.updateReservationStatus(reservationId, 'rejected', reason, notes);
    }
    
    /**
     * Cancel a reservation request (Student)
     * @param {string} reservationId - The reservation ID
     * @returns {boolean} Success status
     */
    cancelReservation(reservationId) {
        if (this.currentUserRole !== 'student') {
            console.error('Only students can cancel their reservations');
            return false;
        }
        
        const reservation = this.dataService.getReservationById(reservationId);
        
        // Ensure the student is cancelling their own reservation
        if (reservation && reservation.studentId === this.currentUserId) {
            return this.dataService.deleteReservation(reservationId);
        }
        
        return false;
    }
    
    /**
     * Get user display name based on current user ID
     * @returns {string} User display name
     */
    getUserDisplayName() {
        // For demo purposes, we'll use predefined names
        // In a real app, this would be fetched from the server
        const names = {
            'admin': 'Admin User',
            'T001': 'Dr. Robert Johnson',
            'T002': 'Prof. William Chen',
            'T003': 'Prof. Sarah Lee',
            '2023-0001': 'John Smith',
            '2023-0002': 'Jane Smith',
            '2023-0003': 'Michael Brown'
        };
        
        return names[this.currentUserId] || this.currentUserId;
    }
    
    /**
     * Check if a room is available for the requested time
     * @param {string} room - The room ID
     * @param {Array} days - Array of days (e.g., ['Monday', 'Wednesday'])
     * @param {string} startTime - Start time (e.g., '9:00 AM')
     * @param {string} endTime - End time (e.g., '10:30 AM')
     * @returns {boolean} Whether the room is available
     */
    checkRoomAvailability(room, days, startTime, endTime) {
        // Get all approved reservations
        const approvedReservations = this.dataService.getReservationsByStatus('approved');
        
        // Check for conflicts
        for (const reservation of approvedReservations) {
            if (reservation.room === room) {
                // Check if days overlap
                const daysOverlap = days.some(day => reservation.days.includes(day));
                
                if (daysOverlap) {
                    // Check if times overlap
                    if (this.timesOverlap(startTime, endTime, reservation.startTime, reservation.endTime)) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    /**
     * Check if two time ranges overlap
     * @param {string} start1 - First range start time
     * @param {string} end1 - First range end time
     * @param {string} start2 - Second range start time
     * @param {string} end2 - Second range end time
     * @returns {boolean} Whether the time ranges overlap
     */
    timesOverlap(start1, end1, start2, end2) {
        // Convert times to minutes since midnight for easier comparison
        const start1Minutes = this.timeToMinutes(start1);
        const end1Minutes = this.timeToMinutes(end1);
        const start2Minutes = this.timeToMinutes(start2);
        const end2Minutes = this.timeToMinutes(end2);
        
        // Check for overlap
        return (start1Minutes < end2Minutes && end1Minutes > start2Minutes);
    }
    
    /**
     * Convert time string to minutes since midnight
     * @param {string} timeStr - Time string (e.g., '9:00 AM')
     * @returns {number} Minutes since midnight
     */
    timeToMinutes(timeStr) {
        const [timePart, ampm] = timeStr.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        // Convert to 24-hour format
        if (ampm === 'PM' && hours < 12) {
            hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    }
    
    /**
     * Detect scheduling conflicts
     * @returns {Array} Array of conflicts
     */
    detectConflicts() {
        const approvedReservations = this.dataService.getReservationsByStatus('approved');
        const conflicts = [];
        
        // Compare each pair of reservations
        for (let i = 0; i < approvedReservations.length; i++) {
            for (let j = i + 1; j < approvedReservations.length; j++) {
                const res1 = approvedReservations[i];
                const res2 = approvedReservations[j];
                
                // Check if same room
                if (res1.room === res2.room) {
                    // Check if days overlap
                    const daysOverlap = res1.days.some(day => res2.days.includes(day));
                    
                    if (daysOverlap) {
                        // Check if times overlap
                        if (this.timesOverlap(res1.startTime, res1.endTime, res2.startTime, res2.endTime)) {
                            // Create conflict object
                            const conflict = {
                                course1: res1.courseCode,
                                course1Title: res1.courseTitle,
                                teacher1Id: res1.teacherId,
                                teacher1Name: res1.teacherName,
                                course2: res2.courseCode,
                                course2Title: res2.courseTitle,
                                teacher2Id: res2.teacherId,
                                teacher2Name: res2.teacherName,
                                room: res1.room,
                                days: res1.days.filter(day => res2.days.includes(day)),
                                time1Start: res1.startTime,
                                time1End: res1.endTime,
                                time2Start: res2.startTime,
                                time2End: res2.endTime
                            };
                            
                            conflicts.push(conflict);
                        }
                    }
                }
            }
        }
        
        return conflicts;
    }
}

// Create a singleton instance
const reservationService = new ReservationService();
