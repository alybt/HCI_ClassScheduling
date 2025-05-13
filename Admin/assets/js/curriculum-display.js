/**
 * Curriculum Display Functions
 * This script handles displaying curricula in the curriculum manager
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Curriculum display script loaded');
    
    // Display existing curricula on page load
    displayCurricula();
    
    // Add event listener to the save curriculum button
    const saveCurriculumBtn = document.getElementById('save-curriculum');
    if (saveCurriculumBtn) {
        saveCurriculumBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Save curriculum button clicked');
            
            saveCurriculum();
        });
    }
    
    // Add event listener to the save program button
    const saveProgramBtn = document.getElementById('save-program');
    if (saveProgramBtn) {
        saveProgramBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Save program button clicked');
            
            saveProgram();
        });
    }
    
    // Add event listener to the save subject button
    const saveSubjectBtn = document.getElementById('save-subject');
    if (saveSubjectBtn) {
        saveSubjectBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Save subject button clicked');
            
            saveSubject();
        });
    }
    
    // Add event listener to the add program button
    const addProgramBtn = document.getElementById('add-program-btn');
    if (addProgramBtn) {
        addProgramBtn.addEventListener('click', function() {
            openAddProgramModal();
        });
    }
    
    // Add event listener to the add subject button
    const addSubjectBtn = document.getElementById('add-subject-btn');
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', function() {
            openAddSubjectModal();
        });
    }
    
    // Add event listener to course type select for dynamic form fields
    const courseTypeSelect = document.getElementById('course-type');
    if (courseTypeSelect) {
        courseTypeSelect.addEventListener('change', function() {
            updateCourseTypeFields(this.value);
        });
        
        // Initialize on page load
        updateCourseTypeFields(courseTypeSelect.value);
    }
    
    /**
     * Save curriculum data
     */
    function saveCurriculum() {
        // Get form values
        const nameInput = document.getElementById('curriculum-name');
        const codeInput = document.getElementById('curriculum-code');
        const yearInput = document.getElementById('curriculum-year');
        const descriptionInput = document.getElementById('curriculum-description');
        const statusSelect = document.getElementById('curriculum-status');
        
        if (!nameInput || !codeInput || !yearInput || !statusSelect) {
            alert('Error: Form elements not found');
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
        if (!formData.name || !formData.code || !formData.year) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            // Get existing data from localStorage
            let curriculumData = {};
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                curriculumData = JSON.parse(savedData);
            } else {
                curriculumData = {
                    curricula: {},
                    programs: {},
                    subjects: {},
                    teachers: {}
                };
            }
            
            // Check if we're in edit mode
            const modal = document.getElementById('curriculum-modal');
            const isEditMode = modal && modal.hasAttribute('data-curriculum-id');
            const editId = isEditMode ? modal.getAttribute('data-curriculum-id') : null;
            const curriculumId = editId || `curriculum-${Date.now()}`;
            
            // Ensure curricula object exists
            if (!curriculumData.curricula) {
                curriculumData.curricula = {};
            }
            
            if (isEditMode) {
                // Update existing curriculum
                curriculumData.curricula[curriculumId] = {
                    ...curriculumData.curricula[curriculumId],
                    ...formData,
                    dateUpdated: new Date().toISOString()
                };
                console.log('Updated curriculum:', curriculumId);
                alert('Curriculum updated successfully!');
            } else {
                // Create new curriculum
                curriculumData.curricula[curriculumId] = {
                    id: curriculumId,
                    ...formData,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                console.log('Created new curriculum:', curriculumId);
                alert('Curriculum created successfully!');
            }
            
            // Save to localStorage
            localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
            
            // Close the modal
            if (modal) {
                modal.style.display = 'none';
                if (isEditMode) {
                    modal.removeAttribute('data-curriculum-id');
                }
            }
            
            // Display the updated curricula
            displayCurricula();
            
        } catch (error) {
            console.error('Error saving curriculum:', error);
            alert('Error saving curriculum. Please try again.');
        }
    }
    
    /**
     * Display curricula in the curriculum list
     */
    function displayCurricula() {
        const curriculumList = document.getElementById('curriculum-list');
        if (!curriculumList) {
            console.error('Curriculum list element not found');
            return;
        }
        
        // Get data from localStorage
        let curriculumData = {};
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                curriculumData = JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error loading curriculum data:', error);
            return;
        }
        
        // Get curricula
        const curricula = curriculumData.curricula || {};
        const curriculaArray = Object.values(curricula);
        
        // Clear current list
        curriculumList.innerHTML = '';
        
        if (curriculaArray.length === 0) {
            curriculumList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <p>No curricula found. Click the "New Curriculum" button to create one.</p>
                </div>
            `;
            return;
        }
        
        // Sort curricula by date (newest first)
        curriculaArray.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        
        // Create curriculum items
        curriculaArray.forEach(curriculum => {
            const curriculumItem = createCurriculumItem(curriculum);
            curriculumList.appendChild(curriculumItem);
        });
        
        console.log(`Displayed ${curriculaArray.length} curricula`);
    }
    
    /**
     * Create a curriculum item element
     */
    function createCurriculumItem(curriculum) {
        const item = document.createElement('div');
        item.className = 'curriculum-item';
        item.setAttribute('data-id', curriculum.id);
        
        // Format date
        const dateCreated = new Date(curriculum.dateCreated);
        const formattedDate = dateCreated.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
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
                <span class="meta-item"><i class="fas fa-clock"></i> ${formattedDate}</span>
            </div>
        `;
        
        // Add click handlers
        item.querySelector('.edit-curriculum').addEventListener('click', function(e) {
            e.stopPropagation();
            openEditCurriculumModal(curriculum.id);
        });
        
        item.querySelector('.delete-curriculum').addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the curriculum "${curriculum.name}"?`)) {
                deleteCurriculum(curriculum.id);
            }
        });
        
        item.addEventListener('click', function() {
            selectCurriculum(curriculum.id);
        });
        
        return item;
    }
    
    /**
     * Open edit curriculum modal
     */
    function openEditCurriculumModal(curriculumId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const curriculum = curriculumData.curricula[curriculumId];
                
                if (curriculum) {
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
                    const modalHeader = document.querySelector('#curriculum-modal .modal-header h2');
                    if (modalHeader) {
                        modalHeader.innerHTML = '<i class="fas fa-graduation-cap"></i> Edit Curriculum';
                    }
                    
                    // Store the current curriculum ID for later use
                    const modal = document.getElementById('curriculum-modal');
                    if (modal) {
                        modal.setAttribute('data-curriculum-id', curriculumId);
                        modal.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.error('Error opening edit curriculum modal:', error);
        }
    }
    
    /**
     * Delete curriculum
     */
    function deleteCurriculum(curriculumId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                
                // Delete the curriculum
                if (curriculumData.curricula && curriculumData.curricula[curriculumId]) {
                    delete curriculumData.curricula[curriculumId];
                    
                    // Save the updated data
                    localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
                    
                    // Display the updated curricula
                    displayCurricula();
                    
                    // Show success message
                    alert('Curriculum deleted successfully!');
                }
            }
        } catch (error) {
            console.error('Error deleting curriculum:', error);
            alert('Error deleting curriculum. Please try again.');
        }
    }
    
    /**
     * Select curriculum
     */
    function selectCurriculum(curriculumId) {
        try {
            // Update active state in UI
            const curriculumItems = document.querySelectorAll('.curriculum-item');
            curriculumItems.forEach(item => {
                if (item.getAttribute('data-id') === curriculumId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Enable add program button
            const addProgramBtn = document.getElementById('add-program-btn');
            if (addProgramBtn) {
                addProgramBtn.disabled = false;
            }
            
            // Display programs for this curriculum
            displayPrograms(curriculumId);
        } catch (error) {
            console.error('Error selecting curriculum:', error);
        }
    }
    
    /**
     * Display programs for a curriculum
     */
    /**
     * Save program data
     */
    function saveProgram() {
        // Check if a curriculum is selected
        const curriculumItems = document.querySelectorAll('.curriculum-item.active');
        if (curriculumItems.length === 0) {
            alert('Please select a curriculum first');
            return;
        }
        
        const curriculumId = curriculumItems[0].getAttribute('data-id');
        if (!curriculumId) {
            alert('Invalid curriculum selection');
            return;
        }
        
        // Get form values
        const nameInput = document.getElementById('program-name');
        const codeInput = document.getElementById('program-code');
        const yearsSelect = document.getElementById('program-years');
        const departmentInput = document.getElementById('program-department');
        const descriptionInput = document.getElementById('program-description');
        
        if (!nameInput || !codeInput || !yearsSelect || !departmentInput) {
            alert('Error: Form elements not found');
            return;
        }
        
        const formData = {
            name: nameInput.value.trim(),
            code: codeInput.value.trim(),
            years: parseInt(yearsSelect.value),
            department: departmentInput.value.trim(),
            description: descriptionInput ? descriptionInput.value.trim() : '',
            curriculumId: curriculumId
        };
        
        // Validate required fields
        if (!formData.name || !formData.code || !formData.department) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            // Get existing data from localStorage
            let curriculumData = {};
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                curriculumData = JSON.parse(savedData);
            } else {
                curriculumData = {
                    curricula: {},
                    programs: {},
                    subjects: {},
                    teachers: {}
                };
            }
            
            // Check if we're in edit mode
            const modal = document.getElementById('program-modal');
            const isEditMode = modal && modal.hasAttribute('data-program-id');
            const editId = isEditMode ? modal.getAttribute('data-program-id') : null;
            const programId = editId || `program-${Date.now()}`;
            
            // Ensure programs object exists
            if (!curriculumData.programs) {
                curriculumData.programs = {};
            }
            
            if (isEditMode) {
                // Update existing program
                curriculumData.programs[programId] = {
                    ...curriculumData.programs[programId],
                    ...formData,
                    dateUpdated: new Date().toISOString()
                };
                console.log('Updated program:', programId);
                alert('Program updated successfully!');
            } else {
                // Create new program
                curriculumData.programs[programId] = {
                    id: programId,
                    ...formData,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                console.log('Created new program:', programId);
                alert('Program created successfully!');
            }
            
            // Save to localStorage
            localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
            
            // Close the modal
            if (modal) {
                modal.style.display = 'none';
                if (isEditMode) {
                    modal.removeAttribute('data-program-id');
                }
            }
            
            // Display the updated programs
            displayPrograms(curriculumId);
            
        } catch (error) {
            console.error('Error saving program:', error);
            alert('Error saving program. Please try again.');
        }
    }
    
    /**
     * Save subject data
     */
    function saveSubject() {
        // Check if a program is selected
        const programItems = document.querySelectorAll('.program-item.active');
        if (programItems.length === 0) {
            alert('Please select a program first');
            return;
        }
        
        const programId = programItems[0].getAttribute('data-id');
        if (!programId) {
            alert('Invalid program selection');
            return;
        }
        
        // Get form values
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
            alert('Error: Form elements not found');
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
            programId: programId
        };
        
        // Validate required fields
        if (!formData.code || !formData.name) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            // Get existing data from localStorage
            let curriculumData = {};
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                curriculumData = JSON.parse(savedData);
            } else {
                curriculumData = {
                    curricula: {},
                    programs: {},
                    subjects: {},
                    teachers: {}
                };
            }
            
            // Check if we're in edit mode
            const modal = document.getElementById('subject-modal');
            const isEditMode = modal && modal.hasAttribute('data-subject-id');
            const editId = isEditMode ? modal.getAttribute('data-subject-id') : null;
            const subjectId = editId || `subject-${Date.now()}`;
            
            // Ensure subjects object exists
            if (!curriculumData.subjects) {
                curriculumData.subjects = {};
            }
            
            if (isEditMode) {
                // Update existing subject
                curriculumData.subjects[subjectId] = {
                    ...curriculumData.subjects[subjectId],
                    ...formData,
                    dateUpdated: new Date().toISOString()
                };
                console.log('Updated subject:', subjectId);
                alert('Subject updated successfully!');
            } else {
                // Create new subject
                curriculumData.subjects[subjectId] = {
                    id: subjectId,
                    ...formData,
                    assignedTeacher: null,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                console.log('Created new subject:', subjectId);
                alert('Subject created successfully!');
            }
            
            // Save to localStorage
            localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
            
            // Close the modal
            if (modal) {
                modal.style.display = 'none';
                if (isEditMode) {
                    modal.removeAttribute('data-subject-id');
                }
            }
            
            // Display the updated subjects
            displaySubjects(programId);
            
        } catch (error) {
            console.error('Error saving subject:', error);
            alert('Error saving subject. Please try again.');
        }
    }
    
    /**
     * Open add program modal
     */
    function openAddProgramModal() {
        // Check if a curriculum is selected
        const curriculumItems = document.querySelectorAll('.curriculum-item.active');
        if (curriculumItems.length === 0) {
            alert('Please select a curriculum first');
            return;
        }
        
        // Reset form
        const programForm = document.getElementById('program-form');
        if (programForm) {
            programForm.reset();
        }
        
        // Update modal title
        const modalHeader = document.querySelector('#program-modal .modal-header h2');
        if (modalHeader) {
            modalHeader.innerHTML = '<i class="fas fa-book"></i> Add New Program';
        }
        
        // Show modal
        const modal = document.getElementById('program-modal');
        if (modal) {
            if (modal.hasAttribute('data-program-id')) {
                modal.removeAttribute('data-program-id');
            }
            modal.style.display = 'block';
        }
    }
    
    /**
     * Open add subject modal
     */
    function openAddSubjectModal() {
        // Check if a program is selected
        const programItems = document.querySelectorAll('.program-item.active');
        if (programItems.length === 0) {
            alert('Please select a program first');
            return;
        }
        
        // Reset form
        const subjectForm = document.getElementById('subject-form');
        if (subjectForm) {
            subjectForm.reset();
        }
        
        // Update modal title
        const modalHeader = document.querySelector('#subject-modal .modal-header h2');
        if (modalHeader) {
            modalHeader.innerHTML = '<i class="fas fa-book-open"></i> Add New Course';
        }
        
        // Update prerequisites dropdown
        populatePrerequisitesDropdown();
        
        // Show modal
        const modal = document.getElementById('subject-modal');
        if (modal) {
            if (modal.hasAttribute('data-subject-id')) {
                modal.removeAttribute('data-subject-id');
            }
            modal.style.display = 'block';
        }
    }
    
    /**
     * Populate prerequisites dropdown
     */
    function populatePrerequisitesDropdown() {
        const prerequisitesSelect = document.getElementById('subject-prerequisites');
        if (!prerequisitesSelect) return;
        
        // Get active program ID
        const programItems = document.querySelectorAll('.program-item.active');
        if (programItems.length === 0) return;
        
        const programId = programItems[0].getAttribute('data-id');
        if (!programId) return;
        
        // Clear current options
        prerequisitesSelect.innerHTML = '';
        
        // Get data from localStorage
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const subjects = curriculumData.subjects || {};
                
                // Filter subjects by program ID
                const programSubjects = Object.values(subjects).filter(
                    subject => subject.programId === programId
                );
                
                // Add options for each subject
                programSubjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = `${subject.code}: ${subject.name}`;
                    prerequisitesSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating prerequisites dropdown:', error);
        }
    }
    
    /**
     * Update course type fields visibility
     */
    function updateCourseTypeFields(courseType) {
        const lectureHoursGroup = document.getElementById('lecture-hours-group');
        const labHoursGroup = document.getElementById('lab-hours-group');
        
        if (!lectureHoursGroup || !labHoursGroup) return;
        
        switch (courseType) {
            case 'lecture-only':
                lectureHoursGroup.style.display = 'block';
                labHoursGroup.style.display = 'none';
                break;
            case 'lab-only':
                lectureHoursGroup.style.display = 'none';
                labHoursGroup.style.display = 'block';
                break;
            case 'both':
                lectureHoursGroup.style.display = 'block';
                labHoursGroup.style.display = 'block';
                break;
        }
    }
    
    /**
     * Display programs for a curriculum
     */
    function displayPrograms(curriculumId) {
        const programsList = document.getElementById('programs-list');
        if (!programsList) {
            console.error('Programs list element not found');
            return;
        }
        
        // Clear current list
        programsList.innerHTML = '';
        
        if (!curriculumId) {
            programsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>Select a curriculum to view its programs or add a new program.</p>
                </div>
            `;
            return;
        }
        
        // Get data from localStorage
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const programs = curriculumData.programs || {};
                
                // Filter programs by curriculum ID
                const programsArray = Object.values(programs).filter(
                    program => program.curriculumId === curriculumId
                );
                
                if (programsArray.length === 0) {
                    programsList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-book"></i>
                            <p>No programs found for this curriculum. Click the "Add Program" button to create one.</p>
                        </div>
                    `;
                    return;
                }
                
                // Sort programs alphabetically
                programsArray.sort((a, b) => a.name.localeCompare(b.name));
                
                // Create program items
                programsArray.forEach(program => {
                    const programItem = document.createElement('div');
                    programItem.className = 'program-item';
                    programItem.setAttribute('data-id', program.id);
                    
                    programItem.innerHTML = `
                        <div class="item-header">
                            <h3 class="item-title">${program.name}</h3>
                            <span class="item-code">${program.code}</span>
                            <div class="item-actions">
                                <button class="btn-icon edit-program" title="Edit program">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon delete-program" title="Delete program">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <p class="item-description">${program.description || 'No description available'}</p>
                        <div class="item-meta">
                            <span class="meta-item"><i class="fas fa-building"></i> ${program.department}</span>
                            <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${program.years} years</span>
                        </div>
                    `;
                    
                    programsList.appendChild(programItem);
                    
                    // Add click event to select program
                    programItem.addEventListener('click', function() {
                        selectProgram(program.id);
                    });
                    
                    // Add click handlers for edit and delete
                    const editBtn = programItem.querySelector('.edit-program');
                    if (editBtn) {
                        editBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            openEditProgramModal(program.id);
                        });
                    }
                    
                    const deleteBtn = programItem.querySelector('.delete-program');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete the program "${program.name}"?`)) {
                                deleteProgram(program.id);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error displaying programs:', error);
        }
    }
    
    /**
     * Select program
     */
    function selectProgram(programId) {
        try {
            // Update active state in UI
            const programItems = document.querySelectorAll('.program-item');
            programItems.forEach(item => {
                if (item.getAttribute('data-id') === programId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Enable add subject button
            const addSubjectBtn = document.getElementById('add-subject-btn');
            if (addSubjectBtn) {
                addSubjectBtn.disabled = false;
            }
            
            // Display subjects for this program
            displaySubjects(programId);
        } catch (error) {
            console.error('Error selecting program:', error);
        }
    }
    
    /**
     * Open edit program modal
     */
    function openEditProgramModal(programId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const program = curriculumData.programs[programId];
                
                if (program) {
                    // Fill form with program data
                    const nameInput = document.getElementById('program-name');
                    const codeInput = document.getElementById('program-code');
                    const yearsSelect = document.getElementById('program-years');
                    const departmentInput = document.getElementById('program-department');
                    const descriptionInput = document.getElementById('program-description');
                    
                    if (nameInput) nameInput.value = program.name;
                    if (codeInput) codeInput.value = program.code;
                    if (yearsSelect) yearsSelect.value = program.years;
                    if (departmentInput) departmentInput.value = program.department;
                    if (descriptionInput) descriptionInput.value = program.description || '';
                    
                    // Update modal title
                    const modalHeader = document.querySelector('#program-modal .modal-header h2');
                    if (modalHeader) {
                        modalHeader.innerHTML = '<i class="fas fa-book"></i> Edit Program';
                    }
                    
                    // Store the current program ID for later use
                    const modal = document.getElementById('program-modal');
                    if (modal) {
                        modal.setAttribute('data-program-id', programId);
                        modal.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.error('Error opening edit program modal:', error);
        }
    }
    
    /**
     * Delete program
     */
    function deleteProgram(programId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                
                // Get the curriculum ID before deleting the program
                const curriculumId = curriculumData.programs[programId]?.curriculumId;
                
                // Delete the program
                if (curriculumData.programs && curriculumData.programs[programId]) {
                    delete curriculumData.programs[programId];
                    
                    // Delete all subjects associated with this program
                    if (curriculumData.subjects) {
                        Object.keys(curriculumData.subjects).forEach(subjectId => {
                            if (curriculumData.subjects[subjectId].programId === programId) {
                                delete curriculumData.subjects[subjectId];
                            }
                        });
                    }
                    
                    // Save the updated data
                    localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
                    
                    // Display the updated programs
                    if (curriculumId) {
                        displayPrograms(curriculumId);
                    }
                    
                    // Clear subjects list
                    const subjectsList = document.getElementById('subjects-list');
                    if (subjectsList) {
                        subjectsList.innerHTML = `
                            <div class="empty-state">
                                <i class="fas fa-book-open"></i>
                                <p>Select a program to view its subjects or add a new subject.</p>
                            </div>
                        `;
                    }
                    
                    // Show success message
                    alert('Program deleted successfully!');
                }
            }
        } catch (error) {
            console.error('Error deleting program:', error);
            alert('Error deleting program. Please try again.');
        }
    }
    
    /**
     * Display subjects for a program
     */
    function displaySubjects(programId) {
        const subjectsList = document.getElementById('subjects-list');
        if (!subjectsList) {
            console.error('Subjects list element not found');
            return;
        }
        
        // Clear current list
        subjectsList.innerHTML = '';
        
        if (!programId) {
            subjectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>Select a program to view its subjects or add a new subject.</p>
                </div>
            `;
            return;
        }
        
        // Get data from localStorage
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const subjects = curriculumData.subjects || {};
                
                // Filter subjects by program ID
                const subjectsArray = Object.values(subjects).filter(
                    subject => subject.programId === programId
                );
                
                if (subjectsArray.length === 0) {
                    subjectsList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-book-open"></i>
                            <p>No subjects found for this program. Click the "Add Subject" button to create one.</p>
                        </div>
                    `;
                    return;
                }
                
                // Sort subjects by code
                subjectsArray.sort((a, b) => a.code.localeCompare(b.code));
                
                // Create subject items
                subjectsArray.forEach(subject => {
                    const subjectItem = document.createElement('div');
                    subjectItem.className = 'subject-item';
                    subjectItem.setAttribute('data-id', subject.id);
                    
                    // Get course type display
                    let courseTypeDisplay = 'Unknown';
                    switch (subject.courseType) {
                        case 'lecture-only':
                            courseTypeDisplay = 'Lecture';
                            break;
                        case 'lab-only':
                            courseTypeDisplay = 'Laboratory';
                            break;
                        case 'both':
                            courseTypeDisplay = 'Lecture & Lab';
                            break;
                    }
                    
                    // Get semester display
                    let semesterDisplay = 'Unknown';
                    switch (subject.semester) {
                        case 1:
                            semesterDisplay = '1st Semester';
                            break;
                        case 2:
                            semesterDisplay = '2nd Semester';
                            break;
                        case 3:
                            semesterDisplay = 'Summer';
                            break;
                    }
                    
                    subjectItem.innerHTML = `
                        <div class="item-header">
                            <h3 class="item-title">${subject.code}</h3>
                            <span class="course-type-badge">${courseTypeDisplay}</span>
                            <div class="item-actions">
                                <button class="btn-icon edit-subject" title="Edit subject">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon delete-subject" title="Delete subject">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <p class="item-name">${subject.name}</p>
                        <div class="item-meta">
                            <span class="meta-item"><i class="fas fa-clock"></i> ${subject.credits} credits</span>
                            <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${semesterDisplay}, Year ${subject.year}</span>
                        </div>
                    `;
                    
                    subjectsList.appendChild(subjectItem);
                    
                    // Add click event to view subject details
                    subjectItem.addEventListener('click', function() {
                        viewSubjectDetails(subject.id);
                    });
                    
                    // Add click handlers for edit and delete
                    const editBtn = subjectItem.querySelector('.edit-subject');
                    if (editBtn) {
                        editBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            openEditSubjectModal(subject.id);
                        });
                    }
                    
                    const deleteBtn = subjectItem.querySelector('.delete-subject');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete the subject "${subject.code}: ${subject.name}"?`)) {
                                deleteSubject(subject.id);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error displaying subjects:', error);
        }
    }
    
    /**
     * View subject details
     */
    function viewSubjectDetails(subjectId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const subject = curriculumData.subjects[subjectId];
                
                if (subject) {
                    // Get course type display
                    let courseTypeDisplay = 'Unknown';
                    switch (subject.courseType) {
                        case 'lecture-only':
                            courseTypeDisplay = 'Lecture';
                            break;
                        case 'lab-only':
                            courseTypeDisplay = 'Laboratory';
                            break;
                        case 'both':
                            courseTypeDisplay = 'Lecture & Lab';
                            break;
                    }
                    
                    // Get semester display
                    let semesterDisplay = 'Unknown';
                    switch (subject.semester) {
                        case 1:
                            semesterDisplay = '1st Semester';
                            break;
                        case 2:
                            semesterDisplay = '2nd Semester';
                            break;
                        case 3:
                            semesterDisplay = 'Summer';
                            break;
                    }
                    
                    // Get prerequisites
                    let prerequisitesDisplay = 'None';
                    if (subject.prerequisites && subject.prerequisites.length > 0) {
                        const prerequisiteNames = subject.prerequisites.map(prereqId => {
                            const prereq = curriculumData.subjects[prereqId];
                            return prereq ? `${prereq.code}: ${prereq.name}` : 'Unknown';
                        });
                        prerequisitesDisplay = prerequisiteNames.join('<br>');
                    }
                    
                    // Get assigned teacher
                    let teacherDisplay = 'Not assigned';
                    if (subject.assignedTeacher) {
                        const teacher = curriculumData.teachers[subject.assignedTeacher];
                        teacherDisplay = teacher ? teacher.name : 'Unknown';
                    }
                    
                    // Update modal content
                    const detailsContent = document.getElementById('subject-details-content');
                    if (detailsContent) {
                        detailsContent.innerHTML = `
                            <div class="subject-details">
                                <h3>${subject.code}: ${subject.name}</h3>
                                <div class="detail-row">
                                    <div class="detail-label">Type:</div>
                                    <div class="detail-value">${courseTypeDisplay}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Credits:</div>
                                    <div class="detail-value">${subject.credits}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Schedule:</div>
                                    <div class="detail-value">${semesterDisplay}, Year ${subject.year}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Hours:</div>
                                    <div class="detail-value">
                                        ${subject.lectureHours > 0 ? `Lecture: ${subject.lectureHours} hours<br>` : ''}
                                        ${subject.labHours > 0 ? `Laboratory: ${subject.labHours} hours` : ''}
                                    </div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Prerequisites:</div>
                                    <div class="detail-value">${prerequisitesDisplay}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Teacher:</div>
                                    <div class="detail-value">${teacherDisplay}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Description:</div>
                                    <div class="detail-value">${subject.description || 'No description available'}</div>
                                </div>
                            </div>
                        `;
                    }
                    
                    // Update modal title
                    const modalTitle = document.getElementById('subject-detail-title');
                    if (modalTitle) {
                        modalTitle.textContent = `${subject.code}: ${subject.name}`;
                    }
                    
                    // Show modal
                    const modal = document.getElementById('subject-details-modal');
                    if (modal) {
                        modal.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.error('Error viewing subject details:', error);
        }
    }
    
    /**
     * Open edit subject modal
     */
    function openEditSubjectModal(subjectId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                const subject = curriculumData.subjects[subjectId];
                
                if (subject) {
                    // Fill form with subject data
                    const codeInput = document.getElementById('subject-code');
                    const nameInput = document.getElementById('subject-name');
                    const descriptionInput = document.getElementById('subject-description');
                    const courseTypeSelect = document.getElementById('course-type');
                    const lectureHoursInput = document.getElementById('lecture-hours');
                    const labHoursInput = document.getElementById('lab-hours');
                    const creditsInput = document.getElementById('subject-credits');
                    const semesterSelect = document.getElementById('subject-semester');
                    const yearSelect = document.getElementById('subject-year');
                    
                    if (codeInput) codeInput.value = subject.code;
                    if (nameInput) nameInput.value = subject.name;
                    if (descriptionInput) descriptionInput.value = subject.description || '';
                    if (courseTypeSelect) courseTypeSelect.value = subject.courseType;
                    if (lectureHoursInput) lectureHoursInput.value = subject.lectureHours;
                    if (labHoursInput) labHoursInput.value = subject.labHours;
                    if (creditsInput) creditsInput.value = subject.credits;
                    if (semesterSelect) semesterSelect.value = subject.semester;
                    if (yearSelect) yearSelect.value = subject.year;
                    
                    // Update course type fields visibility
                    updateCourseTypeFields(subject.courseType);
                    
                    // Update prerequisites dropdown
                    populatePrerequisitesDropdown();
                    
                    // Set selected prerequisites
                    const prerequisitesSelect = document.getElementById('subject-prerequisites');
                    if (prerequisitesSelect && subject.prerequisites) {
                        // Need to wait a bit for the dropdown to be populated
                        setTimeout(() => {
                            for (let i = 0; i < prerequisitesSelect.options.length; i++) {
                                const option = prerequisitesSelect.options[i];
                                if (subject.prerequisites.includes(option.value)) {
                                    option.selected = true;
                                }
                            }
                        }, 100);
                    }
                    
                    // Update modal title
                    const modalHeader = document.querySelector('#subject-modal .modal-header h2');
                    if (modalHeader) {
                        modalHeader.innerHTML = '<i class="fas fa-book-open"></i> Edit Course';
                    }
                    
                    // Store the current subject ID for later use
                    const modal = document.getElementById('subject-modal');
                    if (modal) {
                        modal.setAttribute('data-subject-id', subjectId);
                        modal.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.error('Error opening edit subject modal:', error);
        }
    }
    
    /**
     * Delete subject
     */
    function deleteSubject(subjectId) {
        try {
            const savedData = localStorage.getItem('curriculumManagerData');
            if (savedData) {
                const curriculumData = JSON.parse(savedData);
                
                // Get the program ID before deleting the subject
                const programId = curriculumData.subjects[subjectId]?.programId;
                
                // Delete the subject
                if (curriculumData.subjects && curriculumData.subjects[subjectId]) {
                    delete curriculumData.subjects[subjectId];
                    
                    // Remove this subject from prerequisites of other subjects
                    if (curriculumData.subjects) {
                        Object.values(curriculumData.subjects).forEach(subject => {
                            if (subject.prerequisites && subject.prerequisites.includes(subjectId)) {
                                subject.prerequisites = subject.prerequisites.filter(id => id !== subjectId);
                            }
                        });
                    }
                    
                    // Save the updated data
                    localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
                    
                    // Display the updated subjects
                    if (programId) {
                        displaySubjects(programId);
                    }
                    
                    // Show success message
                    alert('Subject deleted successfully!');
                }
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            alert('Error deleting subject. Please try again.');
        }
    }
});
