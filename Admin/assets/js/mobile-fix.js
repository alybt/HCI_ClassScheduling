// Mobile layout fixes for Admin pages

document.addEventListener('DOMContentLoaded', function() {
    // Fix sidebar toggle for mobile
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header').prepend(sidebarToggle);

    sidebarToggle.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        
        if (sidebar && sidebarToggle && window.innerWidth <= 992) {
            if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Responsive table handling
    function initResponsiveTables() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            if (!table.classList.contains('responsive-initialized')) {
                const headers = table.querySelectorAll('th');
                const headerTexts = Array.from(headers).map(header => header.textContent);
                
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, index) => {
                        if (index < headerTexts.length && !cell.hasAttribute('data-label')) {
                            cell.setAttribute('data-label', headerTexts[index]);
                        }
                    });
                });
                
                table.classList.add('responsive-initialized');
            }
        });
    }

    // Fix modals
    function initModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal, .btn-secondary[id*="cancel"], .btn-secondary[id*="close"]');
        
        // Close modal when clicking on close button
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                } else {
                    modals.forEach(m => m.style.display = 'none');
                }
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Fix filter dropdowns
    function initFilters() {
        const filterSelects = document.querySelectorAll('.filter-group select');
        
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                // Add visual feedback when filter is changed
                this.classList.add('filter-active');
                
                // Remove the class after animation completes
                setTimeout(() => {
                    this.classList.remove('filter-active');
                }, 500);
            });
        });
    }

    // Initialize all fixes
    initResponsiveTables();
    initModals();
    initFilters();

    // Handle window resize events
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        
        if (window.innerWidth > 992 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
});
