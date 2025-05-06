/**
 * Login Page JavaScript
 * Handles login functionality and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const loginBtn = document.getElementById('login-btn');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Check if there are saved credentials
    checkSavedCredentials();
    
    // Add event listeners
    loginBtn.addEventListener('click', handleLogin);
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    usernameInput.addEventListener('input', clearErrors);
    passwordInput.addEventListener('input', clearErrors);
    
    // Add keyboard event for Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Set up forgot password functionality
    setupForgotPassword();
    
    /**
     * Check for saved credentials in local storage
     */
    function checkSavedCredentials() {
        const savedUsername = localStorage.getItem('username');
        
        if (savedUsername) {
            usernameInput.value = savedUsername;
            rememberMeCheckbox.checked = true;
        }
    }
    
    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
    
    /**
     * Clear error messages
     */
    function clearErrors() {
        usernameError.textContent = '';
        passwordError.textContent = '';
    }
    
    /**
     * Detect user role based on username format
     * @param {string} username - The username to check
     * @returns {string} - The detected role (admin, teacher, student)
     */
    function detectUserRole(username) {
        // Admin username is simply 'admin'
        if (username.toLowerCase() === 'admin') {
            return 'admin';
        }
        
        // Teacher ID format: T followed by numbers (e.g., T001)
        const teacherPattern = /^T\d+$/i;
        if (teacherPattern.test(username)) {
            return 'teacher';
        }
        
        // Student ID format: YYYY-NNNN (year-number)
        const studentPattern = /^\d{4}-\d{4}$/;
        if (studentPattern.test(username)) {
            return 'student';
        }
        
        // Default to student if format is unknown
        return 'student';
    }
    
    /**
     * Validate username
     * @param {string} username - The username to validate
     * @returns {boolean} - Whether the username is valid
     */
    function validateUsername(username) {
        if (!username.trim()) {
            usernameError.textContent = 'Username is required';
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate password
     * @param {string} password - The password to validate
     * @returns {boolean} - Whether the password is valid
     */
    function validatePassword(password) {
        if (!password.trim()) {
            passwordError.textContent = 'Password is required';
            return false;
        }
        
        if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            return false;
        }
        
        return true;
    }
    
    /**
     * Handle login form submission
     */
    function handleLogin() {
        // Clear previous errors
        clearErrors();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validate inputs
        const isUsernameValid = validateUsername(username);
        const isPasswordValid = validatePassword(password);
        
        if (!isUsernameValid || !isPasswordValid) {
            return;
        }
        
        // Detect user role based on username format
        const detectedRole = detectUserRole(username);
        
        // Save credentials if remember me is checked
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
        
        // Simulate login (in a real app, this would be an API call)
        simulateLogin(username, password, detectedRole);
    }
    
    /**
     * Simulate login process
     * @param {string} username - The username entered
     * @param {string} password - The password entered
     * @param {string} role - The detected role (admin, teacher, student)
     */
    function simulateLogin(username, password, role) {
        // Show loading state
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        loginBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // For demo purposes, we'll use simple validation
            // In a real app, this would be a server-side validation
            
            // Demo credentials for each role
            const credentials = {
                admin: { username: 'admin', password: 'admin123' },
                teacher: { username: 'T001', password: 'teacher123' },
                student: { username: '2023-0001', password: 'student123' }
            };
            
            // Check credentials
            let isValid = false;
            
            // For admin, check exact match (case insensitive for username)
            if (role === 'admin' && username.toLowerCase() === credentials.admin.username && password === credentials.admin.password) {
                isValid = true;
            }
            // For teacher, check if it's one of our demo teachers (case insensitive for username)
            else if (role === 'teacher' && username.toUpperCase() === credentials.teacher.username.toUpperCase() && password === credentials.teacher.password) {
                isValid = true;
            }
            // For student, check if it's one of our demo students
            else if (role === 'student' && username === credentials.student.username && password === credentials.student.password) {
                isValid = true;
            }
            
            if (isValid) {
                // Login successful
                
                // Store login info in session storage
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('currentSemester', '2nd');
                
                // Show success message
                loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                loginBtn.style.backgroundColor = '#4caf50';
                
                // Redirect to appropriate dashboard after a short delay
                setTimeout(() => {
                    switch (role) {
                        case 'admin':
                            window.location.href = 'Admin/index.html';
                            break;
                        case 'teacher':
                            window.location.href = 'Teacher/index.html';
                            break;
                        case 'student':
                            window.location.href = 'Student/index.html';
                            break;
                        default:
                            window.location.href = 'index.html';
                    }
                }, 1000);
            } else {
                // Login failed
                passwordError.textContent = 'Invalid username or password';
                
                // Shake the login form to indicate error
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
                
                // Reset button
                loginBtn.innerHTML = 'Login';
                loginBtn.disabled = false;
            }
        }, 1500);
    }
    
    /**
     * Set up forgot password functionality
     */
    function setupForgotPassword() {
        const forgotPasswordLink = document.querySelector('.forgot-password');
        const forgotPasswordModal = document.getElementById('forgot-password-modal');
        const closeModalBtn = forgotPasswordModal.querySelector('.close-modal');
        const cancelResetBtn = document.getElementById('cancel-reset');
        const sendResetBtn = document.getElementById('send-reset');
        const resetEmailInput = document.getElementById('reset-email');
        const resetEmailError = document.getElementById('reset-email-error');
        
        // Show modal when clicking on "Forgot Password"
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'flex';
            resetEmailInput.focus();
        });
        
        // Close modal when clicking on X or Cancel
        closeModalBtn.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
            resetEmailInput.value = '';
            resetEmailError.textContent = '';
        });
        
        cancelResetBtn.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
            resetEmailInput.value = '';
            resetEmailError.textContent = '';
        });
        
        // Handle send reset link button
        sendResetBtn.addEventListener('click', function() {
            const email = resetEmailInput.value.trim();
            
            // Validate email
            if (!email) {
                resetEmailError.textContent = 'Email address is required';
                return;
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                resetEmailError.textContent = 'Please enter a valid email address';
                return;
            }
            
            // Show loading state
            sendResetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            sendResetBtn.disabled = true;
            
            // Simulate sending reset link
            setTimeout(() => {
                // Success message
                resetEmailInput.value = '';
                resetEmailError.textContent = '';
                
                // Close modal
                forgotPasswordModal.style.display = 'none';
                
                // Show success alert
                alert('Password reset link has been sent to your email address. Please check your inbox.');
                
                // Reset button
                sendResetBtn.innerHTML = 'Send Reset Link';
                sendResetBtn.disabled = false;
            }, 1500);
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
                resetEmailInput.value = '';
                resetEmailError.textContent = '';
            }
        });
    }
});
