/**
 * Curriculum Manager JavaScript
 * Handles curriculum, program, and subject management
 * Integrates with the scheduling system
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize data storage
    let curriculumData = {
        curricula: {},
        programs: {},
        subjects: {},
        teachers: {},
        schedules: {}
    };

    // DOM Elements
    const curriculumList = document.getElementById('curriculum-list');
    const programsList = document.getElementById('programs-list');
    const subjectsList = document.getElementById('subjects-list');
    
    const addCurriculumBtn = document.getElementById('add-curriculum-btn');
    const addProgramBtn = document.getElementById('add-program-btn');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    
    const curriculumModal = document.getElementById('curriculum-modal');
    const programModal = document.getElementById('program-modal');
    const subjectModal = document.getElementById('subject-modal');
    const subjectDetailsModal = document.getElementById('subject-details-modal');
    
    const saveCurriculumBtn = document.getElementById('save-curriculum');
    const saveProgramBtn = document.getElementById('save-program');
    const saveSubjectBtn = document.getElementById('save-subject');
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // State variables
    let currentCurriculumId = null;
    let currentProgramId = null;
    let currentSubjectId = null;
    let isEditMode = false;

    // Load data from localStorage if exists
    function loadData() {
        const savedData = localStorage.getItem('curriculumManagerData');
        if (savedData) {
            curriculumData = JSON.parse(savedData);
        } else {
            // Initialize with sample data if no data exists
            initializeSampleData();
        }
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
    }

    // Initialize with sample data for demonstration
    function initializeSampleData() {
        // Sample teachers
        const teacher1Id = 'teacher-smith';
        curriculumData.teachers[teacher1Id] = {
            id: teacher1Id,
            name: 'Dr. Smith',
            department: 'Computer Science',
            expertise: ['Programming', 'Algorithms', 'Data Structures'],
            email: 'smith@example.edu',
            currentWorkload: 6, // hours per week
            maxWorkload: 15,    // maximum hours per week
            dateCreated: new Date().toISOString()
        };
        
        const teacher2Id = 'teacher-johnson';
        curriculumData.teachers[teacher2Id] = {
            id: teacher2Id,
            name: 'Prof. Johnson',
            department: 'Physics',
            expertise: ['Physics', 'Mathematics'],
            email: 'johnson@example.edu',
            currentWorkload: 4,
            maxWorkload: 12,
            dateCreated: new Date().toISOString()
        };
        // Sample curriculum
        const curriculumId = 'cs-curriculum-2025';
        curriculumData.curricula[curriculumId] = {
            id: curriculumId,
            name: 'Computer Science Curriculum 2025',
            code: 'CS-2025',
            year: '2025-2026',
            description: 'Bachelor of Science in Computer Science curriculum for academic year 2025-2026',
            status: 'active',
            dateCreated: new Date().toISOString()
        };

        // Sample program
        const programId = 'bscs-program';
        curriculumData.programs[programId] = {
            id: programId,
            name: 'Bachelor of Science in Computer Science',
            code: 'BSCS',
            years: 4,
            department: 'College of Computer Studies',
            description: 'A four-year program focusing on computer science and software development',
            curriculumId: curriculumId,
            dateCreated: new Date().toISOString()
        };

        // Sample subjects
        const subject1Id = 'cs101-subject';
        curriculumData.subjects[subject1Id] = {
            id: subject1Id,
            code: 'CS101',
            name: 'Introduction to Computing',
            description: 'Basic concepts of computing and computer science',
            courseType: 'lecture-only',
            lectureHours: 3,
            labHours: 0,
            credits: 3,
            semester: 1,
            year: 1,
            programId: programId,
            prerequisites: [],
            assignedTeacher: null,
            dateCreated: new Date().toISOString()
        };

        const subject2Id = 'cs102-subject';
        curriculumData.subjects[subject2Id] = {
            id: subject2Id,
            code: 'CS102',
            name: 'Computer Programming 1',
            description: 'Introduction to programming using a high-level language',
            courseType: 'both',
            lectureHours: 3,
            labHours: 2,
            credits: 4,
            semester: 1,
            year: 1,
            programId: programId,
            prerequisites: [],
            assignedTeacher: null,
            dateCreated: new Date().toISOString()
        };
        
        // Add a physics course with lab component
        const subject3Id = 'phys101-subject';
        curriculumData.subjects[subject3Id] = {
            id: subject3Id,
            code: 'PHYS101',
            name: 'Physics for Computing',
            description: 'Fundamental physics concepts relevant to computer science',
            courseType: 'both',
            lectureHours: 3,
            labHours: 2,
            credits: 4,
            semester: 1,
            year: 1,
            programId: programId,
            prerequisites: [],
            assignedTeacher: null,
            dateCreated: new Date().toISOString()
        };

        saveData();
    }

    // Render curricula list
    function renderCurricula() {
        if (!curriculumList) return;

        // Clear current list
        curriculumList.innerHTML = '';

        const curricula = Object.values(curriculumData.curricula);
        
        if (curricula.length === 0) {
            curriculumList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <p>No curricula found. Click the "New Curriculum" button to create one.</p>
                </div>
            `;
            return;
        }

        // Sort curricula by date (newest first)
        curricula.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        // Create curriculum items
        curricula.forEach(curriculum => {
            const curriculumItem = document.createElement('div');
            curriculumItem.className = `curriculum-item ${curriculum.id === currentCurriculumId ? 'active' : ''}`;
            curriculumItem.setAttribute('data-id', curriculum.id);
            
            curriculumItem.innerHTML = `
                <div class="item-header">
                    <h3 class="item-title">${curriculum.name}</h3>
                    <span class="status-badge ${curriculum.status}">${curriculum.status}</span>
                </div>
                <div class="item-code">${curriculum.code}</div>
                <p class="item-description">${curriculum.description || 'No description available'}</p>
                <div class="item-meta">
                    <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${curriculum.year}</span>
                    <span class="meta-item"><i class="fas fa-clock"></i> ${formatDate(curriculum.dateCreated)}</span>
                </div>
            `;
            
            curriculumList.appendChild(curriculumItem);
            
            // Add click event to select curriculum
            curriculumItem.addEventListener('click', () => {
                selectCurriculum(curriculum.id);
            });
        });
    }

    // Render programs list for a specific curriculum
    function renderPrograms(curriculumId) {
        if (!programsList) return;

        // Clear current list
        programsList.innerHTML = '';
        
        // If no curriculum is selected
        if (!curriculumId) {
            programsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>Select a curriculum to view its programs or add a new program.</p>
                </div>
            `;
            return;
        }

        // Filter programs by curriculum ID
        const programs = Object.values(curriculumData.programs).filter(
            program => program.curriculumId === curriculumId
        );
        
        if (programs.length === 0) {
            programsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>No programs found for this curriculum. Click the "Add Program" button to create one.</p>
                </div>
            `;
            return;
        }

        // Sort programs alphabetically
        programs.sort((a, b) => a.name.localeCompare(b.name));

        // Create program items
        programs.forEach(program => {
            const programItem = document.createElement('div');
            programItem.className = `program-item ${program.id === currentProgramId ? 'active' : ''}`;
            programItem.setAttribute('data-id', program.id);
            
            programItem.innerHTML = `
                <div class="item-header">
                    <h3 class="item-title">${program.name}</h3>
                    <span class="item-code">${program.code}</span>
                </div>
                <p class="item-description">${program.description || 'No description available'}</p>
                <div class="item-meta">
                    <span class="meta-item"><i class="fas fa-building"></i> ${program.department}</span>
                    <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${program.years} years</span>
                </div>
            `;
            
            programsList.appendChild(programItem);
            
            // Add click event to select program
            programItem.addEventListener('click', () => {
                selectProgram(program.id);
            });
        });
    }

    // Render subjects list for a specific program
    function renderSubjects(programId) {
        if (!subjectsList) return;

        // Clear current list
        subjectsList.innerHTML = '';
        
        // If no program is selected
        if (!programId) {
            subjectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>Select a program to view its subjects or add a new subject.</p>
                </div>
            `;
            return;
        }

        // Filter subjects by program ID
        const subjects = Object.values(curriculumData.subjects).filter(
            subject => subject.programId === programId
        );
        
        if (subjects.length === 0) {
            subjectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>No subjects found for this program. Click the "Add Subject" button to create one.</p>
                </div>
            `;
            return;
        }

        // Sort subjects by year and semester
        subjects.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.semester - b.semester;
        });

        // Group subjects by year and semester
        const groupedSubjects = {};
        subjects.forEach(subject => {
            const key = `Year ${subject.year}, Semester ${subject.semester}`;
            if (!groupedSubjects[key]) {
                groupedSubjects[key] = [];
            }
            groupedSubjects[key].push(subject);
        });

        // Create subject items grouped by year and semester
        Object.entries(groupedSubjects).forEach(([group, groupSubjects]) => {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'subject-group-header';
            groupHeader.textContent = group;
            subjectsList.appendChild(groupHeader);

            groupSubjects.forEach(subject => {
                const subjectItem = document.createElement('div');
                subjectItem.className = 'subject-item';
                subjectItem.setAttribute('data-id', subject.id);
                
                subjectItem.innerHTML = `
                    <div class="item-header">
                        <h3 class="item-title">${subject.name}</h3>
                        <span class="item-code">${subject.code}</span>
                    </div>
                    <p class="item-description">${subject.description || 'No description available'}</p>
                    <div class="subject-type">
                        ${subject.courseType === 'lecture-only' || subject.courseType === 'both' ? 
                            `<span class="subject-type-badge lecture"><i class="fas fa-book"></i> Lecture (${subject.lectureHours} hrs/week)</span>` : ''}
                        ${subject.courseType === 'lab-only' || subject.courseType === 'both' ? 
                            `<span class="subject-type-badge lab"><i class="fas fa-flask"></i> Laboratory (${subject.labHours} hrs/week)</span>` : ''}
                    </div>
                    <div class="item-meta">
                        <span class="meta-item"><i class="fas fa-clock"></i> ${subject.credits} credits</span>
                        ${subject.prerequisites.length > 0 ? 
                            `<span class="meta-item"><i class="fas fa-link"></i> ${subject.prerequisites.length} prerequisites</span>` : ''}
                        ${subject.assignedTeacher ? 
                            `<span class="meta-item teacher-assigned"><i class="fas fa-chalkboard-teacher"></i> ${getTeacherName(subject.assignedTeacher)}</span>` : 
                            `<span class="meta-item teacher-needed"><i class="fas fa-exclamation-circle"></i> No teacher assigned</span>`}
                    </div>
                `;
                
                subjectsList.appendChild(subjectItem);
                
                // Add click event to view subject details
                subjectItem.addEventListener('click', () => {
                    viewSubjectDetails(subject.id);
                });
            });
        });
    }

    // Selection Functions
    function selectCurriculum(curriculumId) {
        // Update current selection
        currentCurriculumId = curriculumId;
        currentProgramId = null;
        
        // Update UI
        document.querySelectorAll('.curriculum-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-id') === curriculumId);
        });
        
        // Enable add program button
        if (addProgramBtn) {
            addProgramBtn.disabled = !curriculumId;
        }
        
        // Render programs for this curriculum
        renderPrograms(curriculumId);
        
        // Clear subjects list
        if (subjectsList) {
            subjectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>Select a program to view its subjects.</p>
                </div>
            `;
        }
    }
    
    function selectProgram(programId) {
        // Update current selection
        currentProgramId = programId;
        
        // Update UI
        document.querySelectorAll('.program-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-id') === programId);
        });
        
        // Enable add subject button
        if (addSubjectBtn) {
            addSubjectBtn.disabled = !programId;
        }
        
        // Render subjects for this program
        renderSubjects(programId);
    }
    
    // View subject details
    function viewSubjectDetails(subjectId) {
        const subject = curriculumData.subjects[subjectId];
        if (!subject) return;
        
        currentSubjectId = subjectId;
        
        // Get program and curriculum info
        const program = curriculumData.programs[subject.programId];
        const curriculum = program ? curriculumData.curricula[program.curriculumId] : null;
        
        // Get prerequisite subjects
        const prerequisites = subject.prerequisites.map(prereqId => {
            return curriculumData.subjects[prereqId] || { name: 'Unknown Subject' };
        });
        
        // Update modal content
        const detailsContent = document.getElementById('subject-details-content');
        const detailTitle = document.getElementById('subject-detail-title');
        
        if (detailTitle) {
            detailTitle.textContent = `${subject.code}: ${subject.name}`;
        }
        
        if (detailsContent) {
            detailsContent.innerHTML = `
                <div class="detail-section">
                    <h3>Basic Information</h3>
                    <div class="detail-item">
                        <div class="detail-label">Subject Code:</div>
                        <div class="detail-value">${subject.code}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Subject Name:</div>
                        <div class="detail-value">${subject.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Description:</div>
                        <div class="detail-value">${subject.description || 'No description available'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Type:</div>
                        <div class="detail-value">
                            ${subject.hasLecture ? '<span class="subject-type-badge lecture"><i class="fas fa-book"></i> Lecture</span>' : ''}
                            ${subject.hasLab ? '<span class="subject-type-badge lab"><i class="fas fa-flask"></i> Laboratory</span>' : ''}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Credits:</div>
                        <div class="detail-value">${subject.credits} (${subject.credits * 1.5} hours)</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Curriculum Information</h3>
                    <div class="detail-item">
                        <div class="detail-label">Program:</div>
                        <div class="detail-value">${program ? program.name : 'Unknown Program'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Curriculum:</div>
                        <div class="detail-value">${curriculum ? curriculum.name : 'Unknown Curriculum'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Year Level:</div>
                        <div class="detail-value">Year ${subject.year}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Semester:</div>
                        <div class="detail-value">${getSemesterName(subject.semester)}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Prerequisites</h3>
                    ${prerequisites.length > 0 ? 
                        `<ul class="prerequisites-list">
                            ${prerequisites.map(prereq => `<li>${prereq.code}: ${prereq.name}</li>`).join('')}
                        </ul>` : 
                        `<p>No prerequisites required for this subject.</p>`
                    }
                </div>
                
                <div class="detail-section">
                    <h3>Schedule Information</h3>
                    <div class="schedule-info">
                        ${getSubjectScheduleInfo(subject.id)}
                    </div>
                </div>
            `;
        }
        
        // Setup edit and delete buttons
        const editSubjectBtn = document.getElementById('edit-subject-btn');
        const deleteSubjectBtn = document.getElementById('delete-subject-btn');
        
        if (editSubjectBtn) {
            editSubjectBtn.onclick = () => {
                closeModal(subjectDetailsModal);
                openEditSubjectModal(subjectId);
            };
        }
        
        if (deleteSubjectBtn) {
            deleteSubjectBtn.onclick = () => {
                if (confirm(`Are you sure you want to delete the subject ${subject.code}: ${subject.name}?`)) {
                    deleteSubject(subjectId);
                    closeModal(subjectDetailsModal);
                }
            };
        }
        
        // Show the modal
        openModal(subjectDetailsModal);
    }
    
    // Get semester name
    function getSemesterName(semesterNum) {
        switch (parseInt(semesterNum)) {
            case 1: return 'First Semester';
            case 2: return 'Second Semester';
            case 3: return 'Summer';
            default: return `Semester ${semesterNum}`;
        }
    }
    
    // Get subject schedule information
    function getSubjectScheduleInfo(subjectId) {
        const subject = curriculumData.subjects[subjectId];
        if (!subject) return 'No schedule information available.';
        
        // Check if subject has schedule in the schedules data
        const schedule = curriculumData.schedules[subjectId];
        
        if (!schedule || !schedule.sessions || schedule.sessions.length === 0) {
            return `
                <p>No schedule has been assigned to this subject yet.</p>
                <button class="btn-primary" onclick="openScheduleEditor('${subjectId}')">Create Schedule</button>
            `;
        }
        
        // Format the schedule information
        let scheduleHtml = '<div class="schedule-sessions">';
        
        schedule.sessions.forEach(session => {
            scheduleHtml += `
                <div class="schedule-session">
                    <div class="session-day">${session.day}</div>
                    <div class="session-time">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</div>
                    ${session.room ? `<div class="session-room"><i class="fas fa-door-open"></i> ${session.room}</div>` : ''}
                    ${session.teacher ? `<div class="session-teacher"><i class="fas fa-user"></i> ${session.teacher}</div>` : ''}
                </div>
            `;
        });
        
        scheduleHtml += '</div>';
        scheduleHtml += `<button class="btn-primary" onclick="openScheduleEditor('${subjectId}')">Edit Schedule</button>`;
        
        return scheduleHtml;
    }
    
    // Format time (from decimal hours to HH:MM format)
    function formatTime(decimalHours) {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Get course type display
    function getCourseTypeDisplay(subject) {
        if (subject.courseType === 'lecture-only') {
            return `Lecture (${subject.lectureHours} hrs/week)`;
        } else if (subject.courseType === 'lab-only') {
            return `Lab (${subject.labHours} hrs/week)`;
        } else {
            return `Lecture (${subject.lectureHours} hrs/week) + Lab (${subject.labHours} hrs/week)`;
        }
    }
    
    // Get teacher name from ID
    function getTeacherName(teacherId) {
        if (!teacherId || !curriculumData.teachers[teacherId]) {
            return 'Unknown Teacher';
        }
        return curriculumData.teachers[teacherId].name;
    }
    
    // Modal Functions
    function openModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
    }
    
    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
    
    // Open add curriculum modal
    function openAddCurriculumModal() {
        isEditMode = false;
        
        // Set modal title
        const modalTitle = document.getElementById('curriculum-modal-title');
        if (modalTitle) modalTitle.textContent = 'Add New Curriculum';
        
        // Reset form
        const form = curriculumModal.querySelector('form');
        if (form) form.reset();
        
        // Show modal
        openModal(curriculumModal);
    }
    
    // Open edit curriculum modal
    function openEditCurriculumModal(curriculumId) {
        const curriculum = curriculumData.curricula[curriculumId];
        if (!curriculum) return;
        
        isEditMode = true;
        currentCurriculumId = curriculumId;
        
        // Set modal title
        const modalTitle = document.getElementById('curriculum-modal-title');
        if (modalTitle) modalTitle.textContent = 'Edit Curriculum';
        
        // Fill form with curriculum data
        document.getElementById('curriculum-name').value = curriculum.name;
        document.getElementById('curriculum-code').value = curriculum.code;
        document.getElementById('curriculum-year').value = curriculum.year;
        document.getElementById('curriculum-description').value = curriculum.description || '';
        document.getElementById('curriculum-status').value = curriculum.status;
        
        // Show modal
        openModal(curriculumModal);
    }
    
    // Open add program modal
    function openAddProgramModal() {
        if (!currentCurriculumId) {
            showNotification('Please select a curriculum first', 'error');
            return;
        }
        
        isEditMode = false;
        
        // Set modal title
        const modalTitle = document.getElementById('program-modal-title');
        if (modalTitle) modalTitle.textContent = 'Add New Program';
        
        // Reset form
        const form = programModal.querySelector('form');
        if (form) form.reset();
        
        // Show modal
        openModal(programModal);
    }
    
    // Open edit program modal
    function openEditProgramModal(programId) {
        const program = curriculumData.programs[programId];
        if (!program) return;
        
        isEditMode = true;
        currentProgramId = programId;
        
        // Set modal title
        const modalTitle = document.getElementById('program-modal-title');
        if (modalTitle) modalTitle.textContent = 'Edit Program';
        
        // Fill form with program data
        document.getElementById('program-name').value = program.name;
        document.getElementById('program-code').value = program.code;
        document.getElementById('program-years').value = program.years;
        document.getElementById('program-department').value = program.department;
        document.getElementById('program-description').value = program.description || '';
        
        // Show modal
        openModal(programModal);
    }
    
    // Open add subject modal
    function openAddSubjectModal() {
        if (!currentProgramId) {
            showNotification('Please select a program first', 'error');
            return;
        }
        
        isEditMode = false;
        
        // Set modal title
        const modalTitle = document.getElementById('subject-modal-title');
        if (modalTitle) modalTitle.textContent = 'Add New Subject';
        
        // Reset form
        const form = subjectModal.querySelector('form');
        if (form) form.reset();
        
        // Populate prerequisites dropdown
        populatePrerequisitesDropdown();
        
        // Show modal
        openModal(subjectModal);
    }
    
    // Open edit subject modal
    function openEditSubjectModal(subjectId) {
        const subject = curriculumData.subjects[subjectId];
        if (!subject) return;
        
        isEditMode = true;
        currentSubjectId = subjectId;
        
        // Set modal title
        const modalTitle = document.getElementById('subject-modal-title');
        if (modalTitle) modalTitle.textContent = 'Edit Subject';
        
        // Fill form with subject data
        document.getElementById('subject-code').value = subject.code;
        document.getElementById('subject-name').value = subject.name;
        document.getElementById('subject-description').value = subject.description || '';
        document.getElementById('subject-credits').value = subject.credits;
        document.getElementById('subject-year').value = subject.year;
        document.getElementById('subject-semester').value = subject.semester;
        document.getElementById('subject-has-lecture').checked = subject.hasLecture;
        document.getElementById('subject-has-lab').checked = subject.hasLab;
        
        // Populate prerequisites dropdown
        populatePrerequisitesDropdown(subject.id);
        
        // Set selected prerequisites
        const prerequisitesSelect = document.getElementById('subject-prerequisites');
        if (prerequisitesSelect) {
            // Clear previous selections
            Array.from(prerequisitesSelect.options).forEach(option => {
                option.selected = subject.prerequisites.includes(option.value);
            });
        }
        
        // Show modal
        openModal(subjectModal);
    }
    
    // Populate prerequisites dropdown
    function populatePrerequisitesDropdown(excludeSubjectId = null) {
        const prerequisitesSelect = document.getElementById('subject-prerequisites');
        if (!prerequisitesSelect) return;
        
        // Clear previous options
        prerequisitesSelect.innerHTML = '';
        
        // Get all subjects from the current program
        const subjects = Object.values(curriculumData.subjects).filter(
            subject => subject.programId === currentProgramId && subject.id !== excludeSubjectId
        );
        
        // Sort subjects by year and semester
        subjects.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.semester - b.semester;
        });
        
        // Add options for each subject
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = `${subject.code}: ${subject.name} (Year ${subject.year}, Semester ${subject.semester})`;
            prerequisitesSelect.appendChild(option);
        });
    }
    
    // CRUD Functions
    // Save curriculum
    function saveCurriculum(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('curriculum-name').value.trim();
        const code = document.getElementById('curriculum-code').value.trim();
        const year = document.getElementById('curriculum-year').value.trim();
        const description = document.getElementById('curriculum-description').value.trim();
        const status = document.getElementById('curriculum-status').value;
        
        // Validate required fields
        if (!name || !code || !year) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (isEditMode) {
            // Update existing curriculum
            curriculumData.curricula[currentCurriculumId] = {
                ...curriculumData.curricula[currentCurriculumId],
                name,
                code,
                year,
                description,
                status,
                dateUpdated: new Date().toISOString()
            };
            
            showNotification(`Curriculum "${name}" updated successfully`, 'success');
        } else {
            // Create new curriculum
            const curriculumId = `curriculum-${Date.now()}`;
            curriculumData.curricula[curriculumId] = {
                id: curriculumId,
                name,
                code,
                year,
                description,
                status,
                dateCreated: new Date().toISOString()
            };
            
            // Select the new curriculum
            currentCurriculumId = curriculumId;
            
            showNotification(`Curriculum "${name}" created successfully`, 'success');
        }
        
        // Save data and update UI
        saveData();
        renderCurricula();
        closeModal(curriculumModal);
    }
    
    // Save program
    function saveProgram(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('program-name').value.trim();
        const code = document.getElementById('program-code').value.trim();
        const years = document.getElementById('program-years').value.trim();
        const department = document.getElementById('program-department').value.trim();
        const description = document.getElementById('program-description').value.trim();
        
        // Validate required fields
        if (!name || !code || !years || !department) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (isEditMode) {
            // Update existing program
            curriculumData.programs[currentProgramId] = {
                ...curriculumData.programs[currentProgramId],
                name,
                code,
                years,
                department,
                description,
                dateUpdated: new Date().toISOString()
            };
            
            showNotification(`Program "${name}" updated successfully`, 'success');
        } else {
            // Create new program
            const programId = `program-${Date.now()}`;
            curriculumData.programs[programId] = {
                id: programId,
                name,
                code,
                years,
                department,
                description,
                curriculumId: currentCurriculumId,
                dateCreated: new Date().toISOString()
            };
            
            // Select the new program
            currentProgramId = programId;
            
            showNotification(`Program "${name}" created successfully`, 'success');
        }
        
        // Save data and update UI
        saveData();
        renderPrograms(currentCurriculumId);
        closeModal(programModal);
    }
    
    // Save subject/course
    function saveSubject(event) {
        event.preventDefault();
        
        // Get form values
        const subjectCode = document.getElementById('subject-code').value.trim();
        const subjectName = document.getElementById('subject-name').value.trim();
        const subjectDescription = document.getElementById('subject-description').value.trim();
        const courseType = document.getElementById('course-type').value;
        const lectureHours = courseType !== 'lab-only' ? parseInt(document.getElementById('lecture-hours').value) : 0;
        const labHours = courseType !== 'lecture-only' ? parseInt(document.getElementById('lab-hours').value) : 0;
        const credits = parseInt(document.getElementById('subject-credits').value);
        const semester = parseInt(document.getElementById('subject-semester').value);
        const year = parseInt(document.getElementById('subject-year').value);
        
        // Get prerequisites
        const prerequisitesSelect = document.getElementById('subject-prerequisites');
        const prerequisites = Array.from(prerequisitesSelect.selectedOptions).map(option => option.value);
        
        // Validate
        if (!subjectCode || !subjectName || !credits) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate hours based on course type
        if ((courseType === 'lecture-only' || courseType === 'both') && (!lectureHours || lectureHours < 1)) {
            showNotification('Please specify valid lecture hours', 'error');
            return;
        }
        
        if ((courseType === 'lab-only' || courseType === 'both') && (!labHours || labHours < 1)) {
            showNotification('Please specify valid lab hours', 'error');
            return;
        }
        
        // Check if subject code already exists (except when editing the same subject)
        const existingSubject = Object.values(curriculumData.subjects).find(
            subject => subject.code === subjectCode && (!isEditMode || subject.id !== currentSubjectId)
        );
        
        if (existingSubject) {
            showNotification(`Course code ${subjectCode} already exists`, 'error');
            return;
        }
        
        // Create or update subject
        if (isEditMode && currentSubjectId) {
            // Update existing subject
            curriculumData.subjects[currentSubjectId] = {
                ...curriculumData.subjects[currentSubjectId],
                code: subjectCode,
                name: subjectName,
                description: subjectDescription,
                courseType,
                lectureHours,
                labHours,
                credits,
                semester,
                year,
                prerequisites
            };
            
            showNotification(`Course ${subjectCode} updated successfully`, 'success');
        } else {
            // Create new subject
            const newSubjectId = `${subjectCode.toLowerCase().replace(/\s+/g, '-')}-subject`;
            
            curriculumData.subjects[newSubjectId] = {
                id: newSubjectId,
                code: subjectCode,
                name: subjectName,
                description: subjectDescription,
                courseType,
                lectureHours,
                labHours,
                credits,
                semester,
                year,
                programId: currentProgramId,
                prerequisites,
                assignedTeacher: null,
                dateCreated: new Date().toISOString()
            };
            
            showNotification(`Course ${subjectCode} added successfully`, 'success');
        }
        
        // Save data and refresh UI
        saveData();
        renderSubjects(currentProgramId);
        closeModal(subjectModal);
    }
    
    // Delete curriculum
    function deleteCurriculum(curriculumId) {
        const curriculum = curriculumData.curricula[curriculumId];
        if (!curriculum) return;
        
        // Check if curriculum has programs
        const hasPrograms = Object.values(curriculumData.programs).some(
            program => program.curriculumId === curriculumId
        );
        
        if (hasPrograms) {
            showNotification('Cannot delete curriculum that has programs. Delete all programs first.', 'error');
            return;
        }
        
        // Delete curriculum
        delete curriculumData.curricula[curriculumId];
        
        // Reset current selection if needed
        if (currentCurriculumId === curriculumId) {
            currentCurriculumId = null;
            currentProgramId = null;
        }
        
        // Save data and update UI
        saveData();
        renderCurricula();
        renderPrograms(null);
        renderSubjects(null);
        
        showNotification(`Curriculum "${curriculum.name}" deleted successfully`, 'success');
    }
    
    // Delete program
    function deleteProgram(programId) {
        const program = curriculumData.programs[programId];
        if (!program) return;
        
        // Check if program has subjects
        const hasSubjects = Object.values(curriculumData.subjects).some(
            subject => subject.programId === programId
        );
        
        if (hasSubjects) {
            showNotification('Cannot delete program that has subjects. Delete all subjects first.', 'error');
            return;
        }
        
        // Delete program
        delete curriculumData.programs[programId];
        
        // Reset current selection if needed
        if (currentProgramId === programId) {
            currentProgramId = null;
        }
        
        // Save data and update UI
        saveData();
        renderPrograms(currentCurriculumId);
        renderSubjects(null);
        
        showNotification(`Program "${program.name}" deleted successfully`, 'success');
    }
    
    // Delete subject
    function deleteSubject(subjectId) {
        const subject = curriculumData.subjects[subjectId];
        if (!subject) return;
        
        // Check if subject is a prerequisite for other subjects
        const isPrerequisite = Object.values(curriculumData.subjects).some(
            s => s.prerequisites.includes(subjectId)
        );
        
        if (isPrerequisite) {
            showNotification('Cannot delete subject that is a prerequisite for other subjects.', 'error');
            return;
        }
        
        // Delete subject
        delete curriculumData.subjects[subjectId];
        
        // Delete any schedule associated with this subject
        if (curriculumData.schedules[subjectId]) {
            delete curriculumData.schedules[subjectId];
        }
        
        // Save data and update UI
        saveData();
        renderSubjects(currentProgramId);
        
        showNotification(`Subject "${subject.code}: ${subject.name}" deleted successfully`, 'success');
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add appropriate icon based on notification type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `${icon} ${message}`;
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Open schedule editor
    function openScheduleEditor(subjectId) {
        // This function would integrate with the existing scheduling system
        // For now, we'll just show a notification that this would link to the scheduling system
        showNotification('This would open the schedule editor for this subject. Integration with scheduling system pending.', 'info');
    }
    
    // Event listeners
    function setupEventListeners() {
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                if (modal) closeModal(modal);
            });
        });
        
        // Modal background click to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Add curriculum button
        if (addCurriculumBtn) {
            addCurriculumBtn.addEventListener('click', openAddCurriculumModal);
        }
        
        // Add program button
        if (addProgramBtn) {
            addProgramBtn.addEventListener('click', openAddProgramModal);
            // Initially disable until a curriculum is selected
            addProgramBtn.disabled = !currentCurriculumId;
        }
        
        // Add subject button
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', openAddSubjectModal);
            // Initially disable until a program is selected
            addSubjectBtn.disabled = !currentProgramId;
        }
        
        }
        
        // Search functionality
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }
    
    // Search functionality
    const performSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        // Search in curricula
        const matchingCurricula = Object.values(curriculumData.curricula).filter(curriculum => {
            return curriculum.name.toLowerCase().includes(searchTerm) ||
                curriculum.code.toLowerCase().includes(searchTerm) ||
                curriculum.description.toLowerCase().includes(searchTerm);
        });

        // Search in programs
        const matchingPrograms = Object.values(curriculumData.programs).filter(program => {
            return program.name.toLowerCase().includes(searchTerm) ||
                program.code.toLowerCase().includes(searchTerm) ||
                program.description.toLowerCase().includes(searchTerm);
        });

        // Search in subjects
        const matchingSubjects = Object.values(curriculumData.subjects).filter(subject => {
            return subject.name.toLowerCase().includes(searchTerm) ||
                subject.code.toLowerCase().includes(searchTerm) ||
                subject.description.toLowerCase().includes(searchTerm);
        });

        // Display search results
        displaySearchResults(matchingCurricula, matchingPrograms, matchingSubjects);
    }
    
    // Display search results
    function displaySearchResults(curricula, programs, subjects) {
        // Create a modal to display search results
        const searchResultsModal = document.createElement('div');
        searchResultsModal.className = 'modal';
        searchResultsModal.id = 'search-results-modal';
        searchResultsModal.style.display = 'flex';
        
        let resultsHtml = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-search"></i> Search Results</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
        `;
        
        // Add curricula results
        if (curricula.length > 0) {
            resultsHtml += `<h3>Curricula (${curricula.length})</h3><ul class="search-results-list">`;
            curricula.forEach(curriculum => {
                resultsHtml += `
                    <li class="search-result-item" data-type="curriculum" data-id="${curriculum.id}">
                        <div class="result-header">
                            <span class="result-title">${curriculum.name}</span>
                            <span class="result-code">${curriculum.code}</span>
                        </div>
                        <p class="result-description">${curriculum.description || 'No description'}</p>
                    </li>
                `;
            });
            resultsHtml += `</ul>`;
        }
        
        // Add programs results
        if (programs.length > 0) {
            resultsHtml += `<h3>Programs (${programs.length})</h3><ul class="search-results-list">`;
            programs.forEach(program => {
                const curriculum = curriculumData.curricula[program.curriculumId] || { name: 'Unknown Curriculum' };
                resultsHtml += `
                    <li class="search-result-item" data-type="program" data-id="${program.id}" data-curriculum-id="${program.curriculumId}">
                        <div class="result-header">
                            <span class="result-title">${program.name}</span>
                            <span class="result-code">${program.code}</span>
                        </div>
                        <p class="result-description">${program.description || 'No description'}</p>
                        <div class="result-meta">Curriculum: ${curriculum.name}</div>
                    </li>
                `;
            });
            resultsHtml += `</ul>`;
        }
        
        // Add subjects results
        if (subjects.length > 0) {
            resultsHtml += `<h3>Subjects (${subjects.length})</h3><ul class="search-results-list">`;
            subjects.forEach(subject => {
                const program = curriculumData.programs[subject.programId] || { name: 'Unknown Program' };
                resultsHtml += `
                    <li class="search-result-item" data-type="subject" data-id="${subject.id}" data-program-id="${subject.programId}">
                        <div class="result-header">
                            <span class="result-title">${subject.name}</span>
                            <span class="result-code">${subject.code}</span>
                        </div>
                        <p class="result-description">${subject.description || 'No description'}</p>
                        <div class="result-meta">Program: ${program.name} | Year ${subject.year}, Semester ${subject.semester}</div>
                    </li>
                `;
            });
            resultsHtml += `</ul>`;
        }
        
        // No results message
        if (curricula.length === 0 && programs.length === 0 && subjects.length === 0) {
            resultsHtml += `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No results found. Try a different search term.</p>
                </div>
            `;
        }
        
        resultsHtml += `
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;
        
        searchResultsModal.innerHTML = resultsHtml;
        document.body.appendChild(searchResultsModal);
        
        // Add event listeners for search results
        searchResultsModal.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const id = item.getAttribute('data-id');
                
                if (type === 'curriculum') {
                    selectCurriculum(id);
                } else if (type === 'program') {
                    const curriculumId = item.getAttribute('data-curriculum-id');
                    selectCurriculum(curriculumId);
                    setTimeout(() => selectProgram(id), 100); // Small delay to ensure curriculum is selected first
                } else if (type === 'subject') {
                    const programId = item.getAttribute('data-program-id');
                    const program = curriculumData.programs[programId];
                    if (program) {
                        selectCurriculum(program.curriculumId);
                        setTimeout(() => {
                            selectProgram(programId);
                            setTimeout(() => viewSubjectDetails(id), 100);
                        }, 100);
                    }
                }
                
                closeModal(searchResultsModal);
            });
        });
        
        // Add close button event listener
        searchResultsModal.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(searchResultsModal);
            });
        });
        
        // Close on background click
        searchResultsModal.addEventListener('click', (event) => {
            if (event.target === searchResultsModal) {
                document.body.removeChild(searchResultsModal);
            }
        });
    }


// Open teacher assignment modal
function openTeacherAssignmentModal(subjectId) {
    currentSubjectId = subjectId;
    const subject = curriculumData.subjects[subjectId];
    const modal = document.getElementById('teacher-assignment-modal');

    if (!modal || !subject) return;

    // Populate course info
    document.getElementById('course-to-assign').value = `${subject.code}: ${subject.name}`;

    // Populate teacher dropdown
    const teacherSelect = document.getElementById('teacher-select');
    teacherSelect.innerHTML = '<option value="">Select a teacher</option>';

    Object.values(curriculumData.teachers).forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = `${teacher.name} (${teacher.department})`;
        if (subject.assignedTeacher === teacher.id) {
            option.selected = true;
        }
        teacherSelect.appendChild(option);
    });

    // Show teacher workload when selected
    teacherSelect.addEventListener('change', function() {
        const teacherId = this.value;
        const workloadDiv = document.getElementById('teacher-workload');

        if (!teacherId) {
            workloadDiv.innerHTML = '<p>Select a teacher to view their current workload</p>';
            return;
        }

        const teacher = curriculumData.teachers[teacherId];
        if (teacher) {
            const courseHours = getSubjectTotalHours(subject);
            const newWorkload = teacher.currentWorkload + (subject.assignedTeacher === teacherId ? 0 : courseHours);
            const isOverloaded = newWorkload > teacher.maxWorkload;

            workloadDiv.innerHTML = `
                <p><strong>Current workload:</strong> ${teacher.currentWorkload} hours/week</p>
                <p><strong>This course:</strong> ${courseHours} hours/week</p>
                <p><strong>New workload:</strong> <span class="${isOverloaded ? 'overload' : ''}">${newWorkload} hours/week</span></p>
                <p><strong>Maximum workload:</strong> ${teacher.maxWorkload} hours/week</p>
                ${isOverloaded ? '<p class="warning"><i class="fas fa-exclamation-triangle"></i> This assignment will exceed the teacher\'s maximum workload!</p>' : ''}
            `;
        }
    });

    // If there's already an assigned teacher, trigger the change event
    if (subject.assignedTeacher) {
        teacherSelect.dispatchEvent(new Event('change'));
    }

    openModal(modal);
}

// Get total hours for a subject (lecture + lab)
function getSubjectTotalHours(subject) {
    let hours = 0;
    if (subject.courseType === 'lecture-only') {
        hours = subject.lectureHours;
    } else if (subject.courseType === 'lab-only') {
        hours = subject.labHours;
    } else { // both
        hours = subject.lectureHours + subject.labHours;
    }
    
    // Assign teacher to subject
    function assignTeacher(event) {
        event.preventDefault();
        
        const teacherId = document.getElementById('teacher-select').value;
        if (!teacherId) {
            showNotification('Please select a teacher', 'error');
            return;
        }
        
        const subject = curriculumData.subjects[currentSubjectId];
        const teacher = curriculumData.teachers[teacherId];
        
        if (!subject || !teacher) {
            showNotification('Invalid course or teacher selection', 'error');
            return;
        }
        
        // Calculate new workload
        const courseHours = getSubjectTotalHours(subject);
        const oldTeacherId = subject.assignedTeacher;
        const newWorkload = teacher.currentWorkload + (oldTeacherId === teacherId ? 0 : courseHours);
        
        // Check if this exceeds max workload
        if (newWorkload > teacher.maxWorkload) {
            if (!confirm(`This assignment will exceed ${teacher.name}'s maximum workload of ${teacher.maxWorkload} hours/week. Continue anyway?`)) {
                return;
            }
        }
        
        // Update old teacher's workload if there was one
        if (oldTeacherId && oldTeacherId !== teacherId && curriculumData.teachers[oldTeacherId]) {
            curriculumData.teachers[oldTeacherId].currentWorkload -= courseHours;
        }
        
        // Update new teacher's workload
        if (oldTeacherId !== teacherId) {
            teacher.currentWorkload = newWorkload;
        }
        
        // Assign teacher to subject
        subject.assignedTeacher = teacherId;
        
        saveData();
        renderSubjects(currentProgramId);
        showNotification(`${teacher.name} has been assigned to ${subject.code}`, 'success');
        
        const modal = document.getElementById('teacher-assignment-modal');
        closeModal(modal);
    }
    
    // Initialize the application
    function init() {
        loadData();
        setupEventListeners();
        renderCurricula();
    }
    
    // Start the application
    init();
});
