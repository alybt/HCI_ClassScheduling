/**
 * Curriculum Manager JavaScript
 * Handles curriculum, program, and subject management
 * Integrates with the scheduling system
 */

const CurriculumManager = (() => {
    // Data and state
    let curriculumData = {
        curricula: {},
        programs: {},
        subjects: {},
        teachers: {},
        schedules: {}
    };

    const state = {
        currentCurriculumId: null,
        currentProgramId: null,
        currentSubjectId: null,
        isEditMode: false
    };

    // Button elements
    const elements = {
        // Add buttons
        addCurriculumBtn: document.getElementById('add-curriculum-btn'),
        addProgramBtn: document.getElementById('add-program-btn'),
        addSubjectBtn: document.getElementById('add-subject-btn'),
        
        // Save buttons
        saveCurriculumBtn: document.getElementById('save-curriculum'),
        saveProgramBtn: document.getElementById('save-program'),
        saveSubjectBtn: document.getElementById('save-subject'),
        
        // Edit/Delete buttons
        editSubjectBtn: document.getElementById('edit-subject-btn'),
        deleteSubjectBtn: document.getElementById('delete-subject-btn'),
        
        // Modals
        curriculumModal: document.getElementById('curriculum-modal'),
        programModal: document.getElementById('program-modal'),
        subjectModal: document.getElementById('subject-modal'),
        subjectDetailsModal: document.getElementById('subject-details-modal'),
        teacherAssignmentModal: document.getElementById('teacher-assignment-modal'),
        
        // Lists
        curriculumList: document.getElementById('curriculum-list'),
        programsList: document.getElementById('programs-list'),
        subjectsList: document.getElementById('subjects-list'),
        
        // Forms
        curriculumForm: document.getElementById('curriculum-form'),
        programForm: document.getElementById('program-form'),
        subjectForm: document.getElementById('subject-form'),
        teacherAssignmentForm: document.getElementById('teacher-assignment-form'),

        // Search
        searchInput: document.getElementById('search-input'),
        searchButton: document.getElementById('search-button')
    };

    // Initialize event handlers
    function initializeEventHandlers() {
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
        if (elements.addCurriculumBtn) {
            elements.addCurriculumBtn.addEventListener('click', openAddCurriculumModal);
        }

        // Add program button
        if (elements.addProgramBtn) {
            elements.addProgramBtn.addEventListener('click', openAddProgramModal);
            elements.addProgramBtn.disabled = !state.currentCurriculumId;
        }

        // Add subject button
        if (elements.addSubjectBtn) {
            elements.addSubjectBtn.addEventListener('click', openAddSubjectModal);
            elements.addSubjectBtn.disabled = !state.currentProgramId;
        }

        // Save buttons - using direct DOM queries as a fallback
        const saveCurriculumBtn = document.getElementById('save-curriculum');
        if (saveCurriculumBtn) {
            saveCurriculumBtn.addEventListener('click', saveCurriculum);
            console.log('Save curriculum button event listener attached');
        } else {
            console.error('Save curriculum button not found');
        }
        
        const saveProgramBtn = document.getElementById('save-program');
        if (saveProgramBtn) {
            saveProgramBtn.addEventListener('click', saveProgram);
        }
        
        const saveSubjectBtn = document.getElementById('save-subject');
        if (saveSubjectBtn) {
            saveSubjectBtn.addEventListener('click', saveSubject);
        }

        // Search functionality
        if (elements.searchButton && elements.searchInput) {
            elements.searchButton.addEventListener('click', performSearch);
            elements.searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }

    // Data management functions
    function loadData() {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                curriculumData = JSON.parse(savedData);
                console.log('Data loaded successfully');
            } else {
                // Initialize with sample data if no data exists
                console.log('No saved data found, initializing with sample data');
                initializeSampleData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('Error loading data. Initializing with sample data.', 'error');
            initializeSampleData();
        }
    }

    function saveData() {
        try {
            localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
            console.log('Data saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            showNotification('Error saving data. Please try again.', 'error');
            return false;
        }
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
        if (!elements.curriculumList) return;

        // Clear current list
        elements.curriculumList.innerHTML = '';

        const curricula = Object.values(curriculumData.curricula);
        
        if (curricula.length === 0) {
            elements.curriculumList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <p>No curricula found. Click "Add Curriculum" to create one.</p>
                </div>
            `;
            return;
        }

        // Sort curricula by date (newest first)
        curricula.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

        // Create curriculum items
        renderCurriculumItems(curricula);
    }

    function renderCurriculumItems(curricula) {
        curricula.forEach(curriculum => {
            const curriculumItem = createCurriculumItem(curriculum);
            elements.curriculumList.appendChild(curriculumItem);
        });
    }

    function createCurriculumItem(curriculum) {
        const item = document.createElement('div');
        item.className = `curriculum-item ${curriculum.id === state.currentCurriculumId ? 'active' : ''}`;
        item.setAttribute('data-id', curriculum.id);

        item.innerHTML = `
            <div class="item-header">
                <h3 class="item-title">${curriculum.name}</h3>
                <span class="status-badge ${curriculum.status}">${curriculum.status}</span>
                <div class="item-actions">
                    <button class="btn-icon edit-curriculum" title="Edit curriculum">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-curriculum" title="Delete curriculum">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="item-code">${curriculum.code}</div>
            <p class="item-description">${curriculum.description || 'No description available'}</p>
            <div class="item-meta">
                <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${curriculum.year}</span>
                <span class="meta-item"><i class="fas fa-clock"></i> ${formatDate(curriculum.dateCreated)}</span>
            </div>
        `;

        // Add click handlers
        item.querySelector('.edit-curriculum').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditCurriculumModal(curriculum.id);
        });

        item.querySelector('.delete-curriculum').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the curriculum "${curriculum.name}"?`)) {
                deleteCurriculum(curriculum.id);
            }
        });

        item.addEventListener('click', () => selectCurriculum(curriculum.id));
        return item;
    }

    // Render programs list for a specific curriculum
    function renderPrograms(curriculumId) {
        if (!elements.programsList) return;

        // Clear current list
        elements.programsList.innerHTML = '';
        
        // If no curriculum is selected
        if (!curriculumId) {
            elements.programsList.innerHTML = `
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
            elements.programsList.innerHTML = `
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
            const programItem = createProgramItem(program);
            elements.programsList.appendChild(programItem);
        });
    }

    function createProgramItem(program) {
        const programItem = document.createElement('div');
        programItem.className = `program-item ${program.id === state.currentProgramId ? 'active' : ''}`;
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
        
        elements.programsList.appendChild(programItem);
        
        // Add click event to select program
        programItem.addEventListener('click', () => {
            selectProgram(program.id);
        });
    }

    // Render subjects list for a specific program
    function renderSubjects(programId) {
        if (!elements.subjectsList) return;

        // Clear current list
        elements.subjectsList.innerHTML = '';
        
        // If no program is selected
        if (!programId) {
            elements.subjectsList.innerHTML = `
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
        state.currentCurriculumId = curriculumId;
        state.currentProgramId = null;
        state.currentSubjectId = null;

        // Update UI
        document.querySelectorAll('.curriculum-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-id') === curriculumId);
        });

        // Enable add program button
        if (elements.addProgramBtn) {
            elements.addProgramBtn.disabled = !curriculumId;
        }

        // Render programs for this curriculum
        renderPrograms(curriculumId);
        
        // Clear subjects list
        clearSubjectsList();
    }
    
    function selectProgram(programId) {
        // Update current selection
        state.currentProgramId = programId;
        state.currentSubjectId = null;

        // Update UI
        document.querySelectorAll('.program-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-id') === programId);
        });

        // Enable add subject button
        if (elements.addSubjectBtn) {
            elements.addSubjectBtn.disabled = !programId;
        }
        
        // Render subjects for this program
        renderSubjects(programId);
    }
    
    // View subject details
    function viewSubjectDetails(subjectId) {
        const subject = curriculumData.subjects[subjectId];
        if (!subject) return;
        
        state.currentSubjectId = subjectId;
        
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
                deleteSubject(subjectId);
                closeModal(subjectDetailsModal);
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
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
    
    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
    
    // Curriculum modal functions
    function openAddCurriculumModal() {
        state.isEditMode = false;
        
        // Reset the form
        if (elements.curriculumForm) {
            elements.curriculumForm.reset();
        }
        
        // Update modal title
        const modalHeader = elements.curriculumModal.querySelector('.modal-header h2');
        if (modalHeader) {
            modalHeader.innerHTML = '<i class="fas fa-graduation-cap"></i> Add New Curriculum';
        }
        
        openModal(elements.curriculumModal);
    }

    function openEditCurriculumModal(curriculumId) {
        const curriculum = curriculumData.curricula[curriculumId];
        if (!curriculum) return;

        state.isEditMode = true;
        state.currentCurriculumId = curriculumId;

        // Fill form with curriculum data
        const nameInput = document.getElementById('curriculum-name');
        const codeInput = document.getElementById('curriculum-code');
        const yearInput = document.getElementById('curriculum-year');
        const descriptionInput = document.getElementById('curriculum-description');
        const statusSelect = document.getElementById('curriculum-status');
        
        if (nameInput) nameInput.value = curriculum.name;
        if (codeInput) codeInput.value = curriculum.code;
        if (yearInput) yearInput.value = curriculum.year;
        if (descriptionInput) descriptionInput.value = curriculum.description || '';
        if (statusSelect) statusSelect.value = curriculum.status;

        // Update modal title
        const modalHeader = elements.curriculumModal.querySelector('.modal-header h2');
        if (modalHeader) {
            modalHeader.innerHTML = '<i class="fas fa-graduation-cap"></i> Edit Curriculum';
        }
        
        openModal(elements.curriculumModal);
    }

    // CRUD Operations
    function saveCurriculum(event) {
        if (event) event.preventDefault();
        
        // Get form values directly from input elements
        const nameInput = document.getElementById('curriculum-name');
        const codeInput = document.getElementById('curriculum-code');
        const yearInput = document.getElementById('curriculum-year');
        const descriptionInput = document.getElementById('curriculum-description');
        const statusSelect = document.getElementById('curriculum-status');
        
        if (!nameInput || !codeInput || !yearInput || !statusSelect) {
            showNotification('Form elements not found', 'error');
            return;
        }
        
        const formData = {
            name: nameInput.value.trim(),
            code: codeInput.value.trim(),
            year: yearInput.value.trim(),
            description: descriptionInput ? descriptionInput.value.trim() : '',
            status: statusSelect.value
        };

        // Validate required fields
        const requiredFields = {
            name: 'Curriculum Name',
            code: 'Curriculum Code',
            year: 'Academic Year'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !formData[key])
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Validate curriculum code format (allow more flexible formats)
        const codePattern = /^[A-Za-z0-9-_]+$/;
        if (!codePattern.test(formData.code)) {
            showNotification('Curriculum Code should contain only letters, numbers, hyphens, and underscores', 'error');
            return;
        }

        try {
            if (state.isEditMode && state.currentCurriculumId) {
                // Update existing curriculum
                curriculumData.curricula[state.currentCurriculumId] = {
                    ...curriculumData.curricula[state.currentCurriculumId],
                    ...formData,
                    dateUpdated: new Date().toISOString()
                };
                showNotification('Curriculum updated successfully', 'success');
            } else {
                // Check if curriculum code already exists
                const codeExists = Object.values(curriculumData.curricula)
                    .some(c => c.code === formData.code);
                
                if (codeExists) {
                    showNotification('A curriculum with this code already exists', 'error');
                    return;
                }

                // Create new curriculum
                const curriculumId = `curriculum-${Date.now()}`;
                curriculumData.curricula[curriculumId] = {
                    id: curriculumId,
                    ...formData,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                
                // Select the new curriculum after creation
                state.currentCurriculumId = curriculumId;
                
                showNotification('Curriculum created successfully', 'success');
            }

            // Save to localStorage
            saveData();
            
            // Update UI
            renderCurricula();
            closeModal(elements.curriculumModal);
            
            // Reset state
            if (!state.isEditMode) {
                state.currentCurriculumId = null;
            }
            state.isEditMode = false;

        } catch (error) {
            console.error('Error saving curriculum:', error);
            showNotification('Failed to save curriculum. Please try again.', 'error');
        }
    }

    function saveProgram(e) {
        if (e) e.preventDefault();
        
        if (!state.currentCurriculumId) {
            showNotification('Please select a curriculum first', 'error');
            return;
        }

        // Get form values directly from input elements
        const nameInput = document.getElementById('program-name');
        const codeInput = document.getElementById('program-code');
        const yearsSelect = document.getElementById('program-years');
        const departmentInput = document.getElementById('program-department');
        const descriptionInput = document.getElementById('program-description');
        
        if (!nameInput || !codeInput || !yearsSelect || !departmentInput) {
            showNotification('Form elements not found', 'error');
            return;
        }

        const formData = {
            name: nameInput.value.trim(),
            code: codeInput.value.trim(),
            years: parseInt(yearsSelect.value),
            department: departmentInput.value.trim(),
            description: descriptionInput ? descriptionInput.value.trim() : '',
            curriculumId: state.currentCurriculumId
        };

        // Validate required fields
        const requiredFields = {
            name: 'Program Name',
            code: 'Program Code',
            years: 'Program Duration',
            department: 'Department'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !formData[key])
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Validate program code format (allow more flexible formats)
        const codePattern = /^[A-Za-z0-9-_]+$/;
        if (!codePattern.test(formData.code)) {
            showNotification('Program Code should contain only letters, numbers, hyphens, and underscores', 'error');
            return;
        }

        // Validate years (between 1 and 6)
        if (formData.years < 1 || formData.years > 6) {
            showNotification('Program duration must be between 1 and 6 years', 'error');
            return;
        }

        try {
            if (state.isEditMode && state.currentProgramId) {
                // Check if code changed and if it exists in other programs
                const oldProgram = curriculumData.programs[state.currentProgramId];
                if (formData.code !== oldProgram.code) {
                    const codeExists = Object.values(curriculumData.programs)
                        .some(p => p.id !== state.currentProgramId && p.code === formData.code);
                    
                    if (codeExists) {
                        showNotification('A program with this code already exists', 'error');
                        return;
                    }
                }

                // Update existing program
                curriculumData.programs[state.currentProgramId] = {
                    ...curriculumData.programs[state.currentProgramId],
                    ...formData,
                    dateUpdated: new Date().toISOString()
                };
                showNotification('Program updated successfully', 'success');
            } else {
                // Check if program code already exists
                const codeExists = Object.values(curriculumData.programs)
                    .some(p => p.code === formData.code);
                
                if (codeExists) {
                    showNotification('A program with this code already exists', 'error');
                    return;
                }

                // Create new program
                const programId = `program-${Date.now()}`;
                curriculumData.programs[programId] = {
                    id: programId,
                    ...formData,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                
                // Select the new program after creation
                state.currentProgramId = programId;
                
                showNotification('Program created successfully', 'success');
            }

            saveData();
            renderPrograms(state.currentCurriculumId);
            closeModal(elements.programModal);

        } catch (error) {
            console.error('Error saving program:', error);
            showNotification('Failed to save program. Please try again.', 'error');
        }
    }

    async function saveSubject(e) {
        if (e) e.preventDefault();
        
        if (!state.currentProgramId) {
            showNotification('Please select a program first', 'error');
            return;
        }

        // Get form values directly from input elements
        const codeInput = document.getElementById('subject-code');
        const nameInput = document.getElementById('subject-name');
        const descriptionInput = document.getElementById('subject-description');
        const courseTypeSelect = document.getElementById('course-type');
        const lectureHoursInput = document.getElementById('lecture-hours');
        const labHoursInput = document.getElementById('lab-hours');
        const creditsInput = document.getElementById('subject-credits');
        const semesterSelect = document.getElementById('subject-semester');
        const yearSelect = document.getElementById('subject-year');
        const prerequisitesSelect = document.getElementById('subject-prerequisites');
        
        if (!codeInput || !nameInput || !courseTypeSelect || !creditsInput || !semesterSelect || !yearSelect) {
            showNotification('Form elements not found', 'error');
            return;
        }

        const courseType = courseTypeSelect.value;
        const lectureHours = (courseType !== 'lab-only' && lectureHoursInput) ? parseInt(lectureHoursInput.value) : 0;
        const labHours = (courseType !== 'lecture-only' && labHoursInput) ? parseInt(labHoursInput.value) : 0;
        
        // Get prerequisites
        const prerequisites = prerequisitesSelect ? 
            Array.from(prerequisitesSelect.selectedOptions).map(option => option.value) : [];

        const formData = {
            code: codeInput.value.trim(),
            name: nameInput.value.trim(),
            description: descriptionInput ? descriptionInput.value.trim() : '',
            courseType: courseType,
            lectureHours: lectureHours,
            labHours: labHours,
            credits: parseInt(creditsInput.value),
            semester: parseInt(semesterSelect.value),
            year: parseInt(yearSelect.value),
            prerequisites: prerequisites,
            programId: state.currentProgramId
        };

        // Validate required fields
        if (!formData.code || !formData.name) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            if (state.isEditMode) {
                // Update existing subject
                curriculumData.subjects[state.currentSubjectId] = {
                    ...curriculumData.subjects[state.currentSubjectId],
                    ...formData,
                    dateUpdated: new Date().toISOString()
                };
                showNotification('Subject updated successfully', 'success');
            } else {
                // Create new subject
                const subjectId = `subject-${Date.now()}`;
                curriculumData.subjects[subjectId] = {
                    id: subjectId,
                    ...formData,
                    assignedTeacher: null,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                
                // Select the new subject after creation
                state.currentSubjectId = subjectId;
                
                showNotification('Subject created successfully', 'success');
            }

            saveData();
            renderSubjects(state.currentProgramId);
            closeModal(elements.subjectModal);
        } catch (error) {
            console.error('Error saving subject:', error);
            showNotification('Error saving subject', 'error');
        }
    }

    async function assignTeacher(e) {
        if (e) e.preventDefault();
        
        const form = elements.teacherAssignmentForm;
        if (!form) return;

        const teacherId = form.querySelector('#teacher-select').value;
        if (!teacherId) {
            showNotification('Please select a teacher', 'error');
            return;
        }

        try {
            const subject = curriculumData.subjects[state.currentSubjectId];
            const teacher = curriculumData.teachers[teacherId];
            
            if (!subject || !teacher) {
                showNotification('Invalid subject or teacher selection', 'error');
                return;
            }

            // Calculate workload
            const totalHours = subject.lectureHours + (subject.labHours || 0);
            const newWorkload = teacher.currentWorkload + totalHours;

            if (newWorkload > teacher.maxWorkload) {
                if (!confirm(`This will exceed ${teacher.name}'s maximum workload. Continue anyway?`)) {
                    return;
                }
            }

            // Update subject and teacher
            subject.assignedTeacher = teacherId;
            teacher.currentWorkload = newWorkload;

            saveData();
            renderSubjects(state.currentProgramId);
            closeModal(elements.teacherAssignmentModal);
            showNotification(`Teacher ${teacher.name} assigned successfully`, 'success');
        } catch (error) {
            console.error('Error assigning teacher:', error);
            showNotification('Error assigning teacher', 'error');
        }
    }

    // Delete operations
    async function deleteCurriculum(curriculumId) {
        try {
            const curriculum = curriculumData.curricula[curriculumId];
            if (!curriculum) return;

            // Check if curriculum has any programs
            const hasPrograms = Object.values(curriculumData.programs)
                .some(program => program.curriculumId === curriculumId);

            if (hasPrograms) {
                showNotification('Cannot delete curriculum with existing programs', 'error');
                return;
            }

            // Delete the curriculum
            delete curriculumData.curricula[curriculumId];

            // Reset current selections if needed
            if (state.currentCurriculumId === curriculumId) {
                state.currentCurriculumId = null;
                state.currentProgramId = null;
                state.currentSubjectId = null;
            }

            saveData();
            renderCurricula();
            showNotification('Curriculum deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting curriculum:', error);
            showNotification('Error deleting curriculum', 'error');
        }
    }

    async function deleteProgram(programId) {
        try {
            const program = curriculumData.programs[programId];
            if (!program) return;

            // Check if program has any subjects
            const hasSubjects = Object.values(curriculumData.subjects)
                .some(subject => subject.programId === programId);

            if (hasSubjects) {
                showNotification('Cannot delete program with existing subjects', 'error');
                return;
            }

            // Delete the program
            delete curriculumData.programs[programId];

            // Reset current selections if needed
            if (state.currentProgramId === programId) {
                state.currentProgramId = null;
                state.currentSubjectId = null;
            }

            saveData();
            renderPrograms(state.currentCurriculumId);
            showNotification('Program deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting program:', error);
            showNotification('Error deleting program', 'error');
        }
    }

    async function deleteSubject(subjectId) {
        try {
            const subject = curriculumData.subjects[subjectId];
            if (!subject) return;

            // Check if subject is a prerequisite for other subjects
            const isPrerequisite = Object.values(curriculumData.subjects)
                .some(s => s.prerequisites.includes(subjectId));

            if (isPrerequisite) {
                showNotification('Cannot delete subject that is a prerequisite for other subjects', 'error');
                return;
            }

            // Update teacher workload if assigned
            if (subject.assignedTeacher && curriculumData.teachers[subject.assignedTeacher]) {
                const teacher = curriculumData.teachers[subject.assignedTeacher];
                teacher.currentWorkload -= subject.lectureHours + (subject.labHours || 0);
            }

            // Delete the subject
            delete curriculumData.subjects[subjectId];

            // Reset current selection if needed
            if (state.currentSubjectId === subjectId) {
                state.currentSubjectId = null;
            }

            saveData();
            renderSubjects(state.currentProgramId);
            showNotification('Subject deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting subject:', error);
            showNotification('Error deleting subject', 'error');
        }
    }

    // Helper functions
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function performSearch() {
        if (!elements.searchInput) return;
        
        const searchQuery = elements.searchInput.value.trim().toLowerCase();
        if (!searchQuery) {
            renderCurricula();
            return;
        }
        
        // Search in curricula
        const matchingCurricula = Object.values(curriculumData.curricula).filter(curriculum => {
            return curriculum.name.toLowerCase().includes(searchQuery) ||
                   curriculum.code.toLowerCase().includes(searchQuery) ||
                   (curriculum.description && curriculum.description.toLowerCase().includes(searchQuery));
        });
        
        // Search in programs
        const matchingPrograms = Object.values(curriculumData.programs).filter(program => {
            return program.name.toLowerCase().includes(searchQuery) ||
                   program.code.toLowerCase().includes(searchQuery) ||
                   (program.description && program.description.toLowerCase().includes(searchQuery));
        });
        
        // Search in subjects
        const matchingSubjects = Object.values(curriculumData.subjects).filter(subject => {
            return subject.name.toLowerCase().includes(searchQuery) ||
                   subject.code.toLowerCase().includes(searchQuery) ||
                   (subject.description && subject.description.toLowerCase().includes(searchQuery));
        });
        
        // Display matching curricula
        if (elements.curriculumList) {
            elements.curriculumList.innerHTML = '';
            if (matchingCurricula.length > 0) {
                renderCurriculumItems(matchingCurricula);
            } else {
                elements.curriculumList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>No matching curricula found.</p>
                    </div>
                `;
            }
        }
        
        // If a curriculum is selected, filter its programs
        if (state.currentCurriculumId && elements.programsList) {
            const curriculumPrograms = matchingPrograms.filter(
                program => program.curriculumId === state.currentCurriculumId
            );
            
            if (curriculumPrograms.length > 0) {
                elements.programsList.innerHTML = '';
                curriculumPrograms.forEach(program => {
                    const programItem = createProgramItem(program);
                    elements.programsList.appendChild(programItem);
                });
            } else {
                elements.programsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>No matching programs found.</p>
                    </div>
                `;
            }
        }
        
        // If a program is selected, filter its subjects
        if (state.currentProgramId && elements.subjectsList) {
            const programSubjects = matchingSubjects.filter(
                subject => subject.programId === state.currentProgramId
            );
            
            if (programSubjects.length > 0) {
                elements.subjectsList.innerHTML = '';
                programSubjects.forEach(subject => {
                    const subjectItem = createSubjectItem(subject);
                    elements.subjectsList.appendChild(subjectItem);
                });
            } else {
                elements.subjectsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>No matching subjects found.</p>
                    </div>
                `;
            }
        }
    }

    function populatePrerequisitesDropdown() {
        const prerequisitesSelect = document.getElementById('subject-prerequisites');
        if (!prerequisitesSelect) return;
        
        // Clear current options
        prerequisitesSelect.innerHTML = '';
        
        // Get all subjects from the current program
        const subjects = Object.values(curriculumData.subjects).filter(
            subject => subject.programId === state.currentProgramId
        );
        
        // Add options for each subject
        subjects.forEach(subject => {
            // Skip the current subject if in edit mode
            if (state.isEditMode && subject.id === state.currentSubjectId) return;
            
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = `${subject.code}: ${subject.name}`;
            prerequisitesSelect.appendChild(option);
        });
    }

    // Initialize the application
    function init() {
        loadData();
        initializeEventHandlers();
        renderCurricula();
    }
    
    // Main initialization function
    function initialize() {
        // Load any existing data
        loadData();
        
        // Initialize event handlers
        initializeEventHandlers();
        
        // Render initial views
        renderCurricula();
        
        console.log('Curriculum Manager initialized');
    }
    
    // Start the application
    initialize();
    
    // Return the public API
})();

// The CurriculumManager is already initialized in the IIFE above
// No need for this additional initialization

