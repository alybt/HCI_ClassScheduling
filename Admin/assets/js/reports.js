// Reports Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const reportTypeButtons = document.querySelectorAll('.filter-btn');
    const reportSections = document.querySelectorAll('.report-section');
    const quickDateButtons = document.querySelectorAll('.quick-date-btn');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const departmentFilter = document.getElementById('department-filter');
    const buildingFilter = document.getElementById('building-filter');
    const programFilter = document.getElementById('program-filter');
    const yearFilter = document.getElementById('year-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const generateReportBtn = document.getElementById('generate-report');
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportExcelBtn = document.getElementById('export-excel');
    const printReportBtn = document.getElementById('print-report');
    const reportHeader = document.querySelector('.report-header h2');
    const reportDateRange = document.querySelector('.report-header p');
    const buildCustomReportBtn = document.getElementById('build-custom-report');
    
    // Initialize default date range to 1st semester (Aug-Dec)
    if (startDateInput && endDateInput) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const firstSemStart = new Date(currentYear, 7, 1); // August 1
        const firstSemEnd = new Date(currentYear, 11, 31); // December 31
        
        startDateInput.value = formatDateForInput(firstSemStart);
        endDateInput.value = formatDateForInput(firstSemEnd);
        
        // Update the report date range display
        if (reportDateRange) {
            reportDateRange.textContent = `${formatDate(startDateInput.value)} - ${formatDate(endDateInput.value)}`;
        }
    }
    
    // Event Listeners
    // Report type selection
    reportTypeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            reportTypeButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update report header
            const reportType = this.getAttribute('data-report');
            updateReportHeader(reportType);
        });
    });
    
    // Quick date selection
    quickDateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            setDateRange(period);
        });
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Generate report
    generateReportBtn.addEventListener('click', generateReport);
    
    // Export buttons
    exportPdfBtn.addEventListener('click', exportPdf);
    exportExcelBtn.addEventListener('click', exportExcel);
    printReportBtn.addEventListener('click', printReport);
    
    // Build custom report
    buildCustomReportBtn.addEventListener('click', buildCustomReport);
    
    // Functions
    function updateReportHeader(reportType) {
        // Update report header based on selected report type
        switch(reportType) {
            case 'utilization':
                reportHeader.textContent = 'Room Utilization Report';
                break;
            case 'enrollment':
                reportHeader.textContent = 'Enrollment Statistics Report';
                break;
            case 'scheduling':
                reportHeader.textContent = 'Scheduling Conflicts Report';
                break;
            case 'faculty':
                reportHeader.textContent = 'Faculty Workload Report';
                break;
            case 'custom':
                reportHeader.textContent = 'Custom Report';
                break;
            default:
                reportHeader.textContent = 'Report';
        }
        
        // Update date range display
        const startDate = formatDate(startDateInput.value);
        const endDate = formatDate(endDateInput.value);
        reportDateRange.textContent = `${startDate} - ${endDate}`;
    }
    
    function setDateRange(period) {
        const today = new Date();
        let startDate, endDate;
        const currentYear = today.getFullYear();
        
        switch(period) {
            case 'first-sem':
                // 1st Semester: August to December
                startDate = new Date(currentYear, 7, 1); // August 1
                endDate = new Date(currentYear, 11, 31); // December 31
                break;
            case 'second-sem':
                // 2nd Semester: January to May
                startDate = new Date(currentYear, 0, 1); // January 1
                endDate = new Date(currentYear, 4, 31); // May 31
                break;
            case 'academic-year':
                // Example: September 1 to August 31
                if (today.getMonth() < 8) { // Before September
                    startDate = new Date(today.getFullYear() - 1, 8, 1); // September 1 last year
                    endDate = new Date(today.getFullYear(), 7, 31); // August 31 this year
                } else { // September or later
                    startDate = new Date(today.getFullYear(), 8, 1); // September 1 this year
                    endDate = new Date(today.getFullYear() + 1, 7, 31); // August 31 next year
                }
                break;
            default:
                return;
        }
        
        // Format dates for input fields (YYYY-MM-DD)
        startDateInput.value = formatDateForInput(startDate);
        endDateInput.value = formatDateForInput(endDate);
        
        // Update date range display
        reportDateRange.textContent = `${formatDate(startDateInput.value)} - ${formatDate(endDateInput.value)}`;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function resetFilters() {
        // Reset date inputs to default values - set to 1st semester (Aug-Dec)
        const today = new Date();
        const currentYear = today.getFullYear();
        const firstSemStart = new Date(currentYear, 7, 1); // August 1
        const firstSemEnd = new Date(currentYear, 11, 31); // December 31
        
        startDateInput.value = formatDateForInput(firstSemStart);
        endDateInput.value = formatDateForInput(firstSemEnd);
        
        // Reset all filter dropdowns
        departmentFilter.value = 'all';
        buildingFilter.value = 'all';
        programFilter.value = 'all';
        yearFilter.value = 'all';
        
        // Update date range display
        reportDateRange.textContent = `${formatDate(startDateInput.value)} - ${formatDate(endDateInput.value)}`;
        
        // Show success message
        alert('Filters have been reset to default values.');
    }
    
    function generateReport() {
        // Get selected report type
        const reportType = document.querySelector('.filter-btn.active').getAttribute('data-report');
        
        // Hide all report sections
        reportSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected report section
        document.getElementById(`${reportType}-report`).classList.add('active');
        
        // Update report header
        updateReportHeader(reportType);
        
        // In a real application, this would fetch data from the server based on the selected filters
        // and generate the appropriate report
        
        // For this demo, we'll just show a success message
        const department = departmentFilter.value;
        const building = buildingFilter.value;
        const program = programFilter.value;
        const year = yearFilter.value;
        
        console.log(`Generating ${reportType} report with filters:
            Date Range: ${startDateInput.value} to ${endDateInput.value}
            Department: ${department}
            Building: ${building}
            Program: ${program}
            Year: ${year}`);
            
        // Simulate loading time
        const generateBtn = document.getElementById('generate-report');
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;
        
        setTimeout(() => {
            generateBtn.textContent = 'Generate Report';
            generateBtn.disabled = false;
            
            // Show success message
            alert(`${reportHeader.textContent} has been generated successfully!`);
        }, 1500);
    }
    
    function exportPdf() {
        // In a real application, this would generate a PDF of the current report
        // For this demo, we'll just show a success message
        alert(`${reportHeader.textContent} has been exported as PDF.`);
    }
    
    function exportExcel() {
        // In a real application, this would generate an Excel file of the current report
        // For this demo, we'll just show a success message
        alert(`${reportHeader.textContent} has been exported as Excel.`);
    }
    
    function printReport() {
        // In a real application, this would open the print dialog
        // For this demo, we'll just show a success message
        alert(`Preparing ${reportHeader.textContent} for printing.`);
    }
    
    function buildCustomReport() {
        // Get selected metrics
        const metrics = [];
        document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').forEach(checkbox => {
            metrics.push(checkbox.value);
        });
        
        // Get selected chart type
        const chartType = document.querySelector('input[name="chart-type"]:checked')?.value || 'bar';
        
        // Get group by value
        const groupBy = document.getElementById('group-by').value;
        
        // Validate selections
        if (metrics.length === 0) {
            alert('Please select at least one metric for your custom report.');
            return;
        }
        
        // In a real application, this would generate a custom report based on the selected options
        // For this demo, we'll just show a success message
        console.log(`Building custom report with:
            Metrics: ${metrics.join(', ')}
            Chart Type: ${chartType}
            Group By: ${groupBy}`);
            
        // Simulate loading time
        const buildBtn = document.getElementById('build-custom-report');
        buildBtn.textContent = 'Building...';
        buildBtn.disabled = true;
        
        setTimeout(() => {
            buildBtn.textContent = 'Build Custom Report';
            buildBtn.disabled = false;
            
            // Show success message
            alert('Custom report has been built successfully!');
            
            // Update report header
            reportHeader.textContent = 'Custom Report';
            reportDateRange.textContent = `${formatDate(startDateInput.value)} - ${formatDate(endDateInput.value)}`;
            
            // Hide all report sections
            reportSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show utilization report as a placeholder
            document.getElementById('utilization-report').classList.add('active');
        }, 1500);
    }
});
