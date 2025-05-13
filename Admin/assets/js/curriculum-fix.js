/**
 * Fix for Curriculum Manager Save Buttons
 * This script adds direct event listeners to the save buttons
 * and ensures curricula are displayed properly
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Curriculum fix script loaded');
    
    // Display existing curricula
    displayCurricula();
    
    // Fix for Save Curriculum button
    const saveCurriculumBtn = document.getElementById('save-curriculum');
    if (saveCurriculumBtn) {
        console.log('Save curriculum button found, adding event listener');
        
        saveCurriculumBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Save curriculum button clicked');
            
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
                let curriculumId;
                
                if (isEditMode) {
                    // Use existing ID if in edit mode
                    curriculumId = modal.getAttribute('data-curriculum-id');
                } else {
                    // Create new ID if adding new curriculum
                    curriculumId = `curriculum-${Date.now()}`;
                }
                
                if (!curriculumData.curricula) {
                    curriculumData.curricula = {};
                }
                
                curriculumData.curricula[curriculumId] = {
                    id: curriculumId,
                    ...formData,
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString()
                };
                
                // Save to localStorage
                localStorage.setItem('curriculumManagerData', JSON.stringify(curriculumData));
                
                // Show success message
                alert('Curriculum saved successfully!');
                
                // Close the modal
                if (modal) {
                    modal.style.display = 'none';
                }
                
                // Display the updated curricula
                displayCurricula();
                
            } catch (error) {
                console.error('Error saving curriculum:', error);
                alert('Error saving curriculum. Please try again.');
            }
        });
    } else {
        console.error('Save curriculum button not found in the DOM');
    }
    
    // Fix for Save Program button
    const saveProgramBtn = document.getElementById('save-program');
    if (saveProgramBtn) {
        saveProgramBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Save program button clicked');
            
            // Similar implementation as above for program saving
            // This is a simplified version for demonstration
            alert('Program save functionality will be implemented');
        });
    }
    
    // Fix for Save Subject button
    const saveSubjectBtn = document.getElementById('save-subject');
    if (saveSubjectBtn) {
        saveSubjectBtn.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Save subject button clicked');
            
            // Similar implementation as above for subject saving
            // This is a simplified version for demonstration
            alert('Subject save functionality will be implemented');
        });
    }
});
