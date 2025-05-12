// DOM Elements
const addCurriculumBtn = document.getElementById('add-curriculum-btn');
const curriculumModal = document.getElementById('curriculum-modal');
const programsModal = document.getElementById('programs-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const saveCurriculumBtn = document.getElementById('save-curriculum-btn');
const cancelBtn = document.getElementById('cancel-btn');
const curriculumForm = document.getElementById('curriculum-form');
const addProgramBtn = document.getElementById('add-program-btn');
const editProgramBtn = document.getElementById('edit-program-btn');
const deleteProgramBtn = document.getElementById('delete-program-btn');

// Sample data structure for curricula
let curricula = [
    {
        id: 'CUR-2025-001',
        name: 'High School Curriculum 2025',
        department: 'Department of Computer Science',
        effectiveDate: '2025-08-01',
        academicYear: '2025-2026',
        description: 'Standard high school curriculum with focus on STEM subjects',
        status: 'active',
        programs: [
            {
                id: 'PRG-001',
                name: 'Science Track',
                description: 'Focus on natural sciences and mathematics',
                requiredCredits: 120,
                courses: []
            },
            {
                id: 'PRG-002',
                name: 'Arts Track',
                description: 'Focus on humanities and creative arts',
                requiredCredits: 110,
                courses: []
            }
        ]
    }
];

// Event Listeners
addCurriculumBtn.addEventListener('click', () => {
    showModal(curriculumModal);
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        hideModal(modal);
    });
});

saveCurriculumBtn.addEventListener('click', saveCurriculum);
cancelBtn.addEventListener('click', () => hideModal(curriculumModal));

document.querySelectorAll('.btn-programs').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const curriculumId = e.target.closest('tr').dataset.id;
        openProgramsManager(curriculumId);
    });
});

// Functions
function showModal(modal) {
    modal.style.display = 'block';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function saveCurriculum(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('curriculum-name').value,
        department: document.getElementById('curriculum-department').value,
        academicYear: document.getElementById('academic-year').value,
        effectiveDate: document.getElementById('effective-date').value,
        description: document.getElementById('curriculum-description').value
    };

    // Validate form data
    if (!validateCurriculumForm(formData)) {
        return;
    }

    // Generate new curriculum ID
    const newId = generateCurriculumId();
    
    // Create new curriculum object
    const newCurriculum = {
        id: newId,
        ...formData,
        status: 'active',
        programs: []
    };

    // Add to curricula array
    curricula.push(newCurriculum);

    // Update table
    refreshCurriculaTable();

    // Close modal and reset form
    hideModal(curriculumModal);
    curriculumForm.reset();
}

function validateCurriculumForm(formData) {
    for (const [key, value] of Object.entries(formData)) {
        if (!value && key !== 'description') { // Description is optional
            alert(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    return true;
}

function generateCurriculumId() {
    const year = new Date().getFullYear();
    const lastId = curricula.length > 0 
        ? parseInt(curricula[curricula.length - 1].id.split('-')[2]) 
        : 0;
    return `CUR-${year}-${String(lastId + 1).padStart(3, '0')}`;
}

function refreshCurriculaTable() {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';

    curricula.forEach(curriculum => {
        const row = document.createElement('tr');
        row.dataset.id = curriculum.id;
        
        row.innerHTML = `
            <td>${curriculum.id}</td>
            <td>
                <div class="curriculum-info">
                    <div class="curriculum-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div>
                        <strong>${curriculum.name}</strong>
                        <span>Effective from ${new Date(curriculum.effectiveDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
            </td>
            <td>${curriculum.department}</td>
            <td>
                <div class="program-count">${curriculum.programs.length} Programs</div>
                <div class="program-list">
                    ${generateProgramTags(curriculum.programs)}
                </div>
            </td>
            <td>${curriculum.academicYear}</td>
            <td><span class="status-badge ${curriculum.status}">${curriculum.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-programs" title="Manage Programs"><i class="fas fa-sitemap"></i></button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Reattach event listeners
    attachTableEventListeners();
}

function generateProgramTags(programs) {
    if (programs.length === 0) return '';
    
    const visiblePrograms = programs.slice(0, 2);
    const remaining = programs.length - 2;

    return visiblePrograms.map(program => 
        `<span class="program-tag">${program.name}</span>`
    ).join('') + (remaining > 0 ? `<span class="program-tag">+${remaining} more</span>` : '');
}

function openProgramsManager(curriculumId) {
    const curriculum = curricula.find(c => c.id === curriculumId);
    if (!curriculum) return;

    // Populate programs list
    const programItems = document.querySelector('.program-items');
    programItems.innerHTML = curriculum.programs.map(program => `
        <div class="program-item" data-id="${program.id}">
            <h4>${program.name}</h4>
            <p>${program.description}</p>
            <div class="program-credits">${program.requiredCredits} Credits Required</div>
        </div>
    `).join('');

    // Show modal
    showModal(programsModal);
}

function attachTableEventListeners() {
    document.querySelectorAll('.btn-programs').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const curriculumId = e.target.closest('tr').dataset.id;
            openProgramsManager(curriculumId);
        });
    });

    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const curriculumId = e.target.closest('tr').dataset.id;
            viewCurriculumDetails(curriculumId);
        });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const curriculumId = e.target.closest('tr').dataset.id;
            editCurriculum(curriculumId);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    refreshCurriculaTable();
});