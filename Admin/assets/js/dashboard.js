// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set default semester to 2nd semester (since it's May 2025)
    const semesterSelect = document.getElementById('semester-select');
    if (semesterSelect) {
        semesterSelect.value = '2nd';
    }
    
    // Update date display
    updateDateDisplay();
    
    // Initialize approval action buttons
    initApprovalButtons();
    
    // Initialize room status cards
    initRoomStatusCards();
    
    // Functions
    
    // Update the date display in the overview section
    function updateDateDisplay() {
        const dateDisplay = document.querySelector('.date-display');
        if (dateDisplay) {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplay.textContent = today.toLocaleDateString('en-US', options);
        }
    }
    
    // Initialize approval action buttons
    function initApprovalButtons() {
        const approveButtons = document.querySelectorAll('.btn-approve');
        const rejectButtons = document.querySelectorAll('.btn-reject');
        
        approveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const approvalItem = this.closest('.approval-item');
                const approvalTitle = approvalItem.querySelector('h3').textContent;
                
                // Show confirmation message
                if (confirm(`Are you sure you want to approve "${approvalTitle}"?`)) {
                    // In a real application, this would send an API request to approve the item
                    approvalItem.classList.add('approved');
                    approvalItem.style.backgroundColor = '#e8f5e9';
                    
                    // Disable buttons after action
                    this.disabled = true;
                    approvalItem.querySelector('.btn-reject').disabled = true;
                    
                    // Show success message
                    alert(`"${approvalTitle}" has been approved successfully.`);
                }
            });
        });
        
        rejectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const approvalItem = this.closest('.approval-item');
                const approvalTitle = approvalItem.querySelector('h3').textContent;
                
                // Show confirmation message
                if (confirm(`Are you sure you want to reject "${approvalTitle}"?`)) {
                    // In a real application, this would send an API request to reject the item
                    approvalItem.classList.add('rejected');
                    approvalItem.style.backgroundColor = '#ffebee';
                    
                    // Disable buttons after action
                    this.disabled = true;
                    approvalItem.querySelector('.btn-approve').disabled = true;
                    
                    // Show success message
                    alert(`"${approvalTitle}" has been rejected.`);
                }
            });
        });
    }
    
    // Initialize room status cards
    function initRoomStatusCards() {
        const roomCards = document.querySelectorAll('.room-card');
        
        roomCards.forEach(card => {
            card.addEventListener('click', function() {
                const roomName = this.querySelector('h3').textContent;
                const roomLocation = this.querySelector('p').textContent;
                const roomStatus = this.querySelector('.room-status').textContent;
                
                // In a real application, this would navigate to the room details page
                // For this demo, just show an alert with room information
                alert(`Room: ${roomName}\nLocation: ${roomLocation}\nStatus: ${roomStatus}`);
            });
        });
    }
    
    // Simulate real-time updates (for demo purposes)
    function simulateRealTimeUpdates() {
        // Update stats periodically
        setInterval(() => {
            // Randomly update one of the stats
            const statCards = document.querySelectorAll('.stat-card h3');
            if (statCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * statCards.length);
                const currentValue = parseInt(statCards[randomIndex].textContent);
                
                // Randomly increase or decrease by 1 (for demo effect)
                const newValue = Math.max(0, currentValue + (Math.random() > 0.5 ? 1 : -1));
                statCards[randomIndex].textContent = newValue;
            }
        }, 30000); // Every 30 seconds
        
        // Update room statuses periodically
        setInterval(() => {
            // Randomly update one of the room statuses
            const roomStatuses = document.querySelectorAll('.room-status');
            if (roomStatuses.length > 0) {
                const randomIndex = Math.floor(Math.random() * roomStatuses.length);
                const currentStatus = roomStatuses[randomIndex].textContent;
                
                // Randomly change status (for demo effect)
                const statuses = ['Available', 'Occupied', 'Under Maintenance'];
                let newStatus;
                
                do {
                    newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                } while (newStatus === currentStatus);
                
                roomStatuses[randomIndex].textContent = newStatus;
                
                // Update room card class
                const roomCard = roomStatuses[randomIndex].closest('.room-card');
                roomCard.className = 'room-card';
                
                if (newStatus === 'Available') {
                    roomCard.classList.add('available');
                } else if (newStatus === 'Occupied') {
                    roomCard.classList.add('occupied');
                } else if (newStatus === 'Under Maintenance') {
                    roomCard.classList.add('maintenance');
                }
            }
        }, 60000); // Every 60 seconds
    }
    
    // Start simulating real-time updates
    simulateRealTimeUpdates();
});
