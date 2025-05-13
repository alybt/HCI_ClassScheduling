/**
 * Enhanced Curriculum Manager JavaScript
 * Adds additional functionality to the curriculum manager
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the base CurriculumManager exists
    if (typeof CurriculumManager === 'undefined') {
        console.error('Base CurriculumManager not found!');
        return;
    }

    // Additional event handlers for the course type selection
    const courseTypeSelect = document.getElementById('course-type');
    const lectureHoursGroup = document.getElementById('lecture-hours-group');
    const labHoursGroup = document.getElementById('lab-hours-group');

    if (courseTypeSelect) {
        courseTypeSelect.addEventListener('change', function() {
            updateCourseTypeFields(this.value);
        });

        // Initialize fields based on current selection
        updateCourseTypeFields(courseTypeSelect.value);
    }

    // Function to update the visibility of lecture/lab hours fields
    function updateCourseTypeFields(courseType) {
        if (!lectureHoursGroup || !labHoursGroup) return;

        switch (courseType) {
            case 'lecture-only':
                lectureHoursGroup.style.display = 'block';
                labHoursGroup.style.display = 'none';
                document.getElementById('lab-hours').required = false;
                break;
            case 'lab-only':
                lectureHoursGroup.style.display = 'none';
                labHoursGroup.style.display = 'block';
                document.getElementById('lecture-hours').required = false;
                document.getElementById('lab-hours').required = true;
                break;
            case 'both':
                lectureHoursGroup.style.display = 'block';
                labHoursGroup.style.display = 'block';
                document.getElementById('lecture-hours').required = true;
                document.getElementById('lab-hours').required = true;
                break;
        }
    }

    // Auto-calculate credits based on lecture and lab hours
    const lectureHoursInput = document.getElementById('lecture-hours');
    const labHoursInput = document.getElementById('lab-hours');
    const creditsInput = document.getElementById('subject-credits');

    if (lectureHoursInput && labHoursInput && creditsInput) {
        const updateCredits = function() {
            const lectureHours = parseInt(lectureHoursInput.value) || 0;
            const labHours = parseInt(labHoursInput.value) || 0;
            
            // Simple formula: lecture hours + (lab hours / 2)
            let calculatedCredits = lectureHours + Math.ceil(labHours / 2);
            
            // Ensure minimum of 1 credit
            calculatedCredits = Math.max(1, calculatedCredits);
            
            creditsInput.value = calculatedCredits;
        };

        lectureHoursInput.addEventListener('input', updateCredits);
        labHoursInput.addEventListener('input', updateCredits);
    }

    // Teacher assignment functionality
    const teacherSelect = document.getElementById('teacher-select');
    const teacherWorkloadDiv = document.getElementById('teacher-workload');
    
    if (teacherSelect) {
        teacherSelect.addEventListener('change', function() {
            updateTeacherWorkload(this.value);
        });
    }

    function updateTeacherWorkload(teacherId) {
        if (!teacherWorkloadDiv) return;
        
        if (!teacherId) {
            teacherWorkloadDiv.innerHTML = '<p>Select a teacher to view their current workload</p>';
            return;
        }
        
        // Get teacher data from localStorage
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const data = JSON.parse(savedData);
                const teacher = data.teachers[teacherId];
                
                if (teacher) {
                    const workloadPercentage = Math.round((teacher.currentWorkload / teacher.maxWorkload) * 100);
                    const workloadClass = workloadPercentage > 80 ? 'high' : 
                                         workloadPercentage > 50 ? 'medium' : 'low';
                    
                    teacherWorkloadDiv.innerHTML = `
                        <div class="teacher-info">
                            <p><strong>${teacher.name}</strong></p>
                            <p><i class="fas fa-building"></i> ${teacher.department}</p>
                            <p><i class="fas fa-brain"></i> ${teacher.expertise.join(', ')}</p>
                        </div>
                        <div class="workload-meter">
                            <div class="workload-label">Current Workload: ${teacher.currentWorkload} / ${teacher.maxWorkload} hours</div>
                            <div class="workload-bar">
                                <div class="workload-fill ${workloadClass}" style="width: ${workloadPercentage}%"></div>
                            </div>
                        </div>
                    `;
                } else {
                    teacherWorkloadDiv.innerHTML = '<p>Teacher information not found</p>';
                }
            }
        } catch (error) {
            console.error('Error loading teacher data:', error);
            teacherWorkloadDiv.innerHTML = '<p>Error loading teacher workload information</p>';
        }
    }

    // Populate teacher select dropdown
    function populateTeacherSelect() {
        if (!teacherSelect) return;
        
        // Clear current options
        teacherSelect.innerHTML = '<option value="">Select a teacher</option>';
        
        // Get teacher data from localStorage
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const data = JSON.parse(savedData);
                const teachers = Object.values(data.teachers || {});
                
                // Sort teachers by name
                teachers.sort((a, b) => a.name.localeCompare(b.name));
                
                // Add options for each teacher
                teachers.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher.id;
                    option.textContent = `${teacher.name} (${teacher.department})`;
                    teacherSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading teacher data:', error);
        }
    }

    // Initialize teacher assignment modal when opened
    const assignTeacherBtn = document.getElementById('assign-teacher-btn');
    const teacherAssignmentModal = document.getElementById('teacher-assignment-modal');
    const courseToAssignInput = document.getElementById('course-to-assign');
    
    if (assignTeacherBtn && teacherAssignmentModal) {
        assignTeacherBtn.addEventListener('click', function() {
            // Get the current subject
            const subjectId = this.getAttribute('data-subject-id');
            if (!subjectId) return;
            
            try {
                const savedData = localStorage.getItem('curriculumManagerData');
                if (savedData) {
                    const data = JSON.parse(savedData);
                    const subject = data.subjects[subjectId];
                    
                    if (subject) {
                        // Set the course name in the modal
                        if (courseToAssignInput) {
                            courseToAssignInput.value = `${subject.code}: ${subject.name}`;
                        }
                        
                        // Store the subject ID for later use
                        if (teacherAssignmentModal) {
                            teacherAssignmentModal.setAttribute('data-subject-id', subjectId);
                        }
                        
                        // Populate teacher select
                        populateTeacherSelect();
                        
                        // Select currently assigned teacher if any
                        if (teacherSelect && subject.assignedTeacher) {
                            teacherSelect.value = subject.assignedTeacher;
                            updateTeacherWorkload(subject.assignedTeacher);
                        } else {
                            updateTeacherWorkload('');
                        }
                        
                        // Show the modal
                        teacherAssignmentModal.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Error preparing teacher assignment:', error);
            }
        });
    }

    // Save teacher assignment
    const saveAssignmentBtn = document.getElementById('save-assignment');
    
    if (saveAssignmentBtn && teacherAssignmentModal) {
        saveAssignmentBtn.addEventListener('click', function() {
            const subjectId = teacherAssignmentModal.getAttribute('data-subject-id');
            const teacherId = teacherSelect ? teacherSelect.value : '';
            
            if (!subjectId) return;
            
            try {
                const savedData = localStorage.getItem('curriculumManagerData');
                if (savedData) {
                    const data = JSON.parse(savedData);
                    const subject = data.subjects[subjectId];
                    
                    if (subject) {
                        // Update the subject with the new teacher
                        subject.assignedTeacher = teacherId || null;
                        
                        // Save the updated data
                        localStorage.setItem('curriculumManagerData', JSON.stringify(data));
                        
                        // Show success notification
                        const notification = document.getElementById('notification');
                        if (notification) {
                            notification.textContent = teacherId ? 
                                `Teacher assigned to ${subject.code} successfully` : 
                                `Teacher assignment removed from ${subject.code}`;
                            notification.className = 'notification success';
                            notification.style.display = 'block';
                            
                            setTimeout(() => {
                                notification.classList.add('show');
                            }, 10);
                            
                            setTimeout(() => {
                                notification.classList.remove('show');
                                setTimeout(() => {
                                    notification.style.display = 'none';
                                }, 300);
                            }, 3000);
                        }
                        
                        // Close the modal
                        teacherAssignmentModal.style.display = 'none';
                        
                        // Refresh the subject details if open
                        const viewSubjectDetailsFunction = window.viewSubjectDetails;
                        if (typeof viewSubjectDetailsFunction === 'function') {
                            viewSubjectDetailsFunction(subjectId);
                        }
                    }
                }
            } catch (error) {
                console.error('Error saving teacher assignment:', error);
            }
        });
    }

    // Close modal buttons for teacher assignment modal
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    console.log('Enhanced Curriculum Manager initialized');
});
