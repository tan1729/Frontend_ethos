function showLogin(userType) {
    // Hide all login forms first
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.add('hidden');
    });

    // Show the selected login form
    const selectedForm = document.getElementById(`${userType}-login`);
    selectedForm.classList.remove('hidden');
}

async function login(userType) {
    // Get the correct input fields for webmail/username and password
    const webmailOrUsername = document.getElementById(userType === 'admin' ? 'admin-username' : `${userType}-webmail`).value;
    const password = document.getElementById(`${userType}-password`).value;
    const messageElement = document.getElementById(`${userType}-message`);

    try {
        // Simulate login (replace this with your actual fetch logic to the backend)
        if (webmailOrUsername && password) {
            // Assuming successful login simulation, set a success message
            messageElement.textContent = 'Login successful!';
            messageElement.style.color = 'green';

            // Redirect based on the userType to their respective pages
            if (userType === 'student') {
                window.location.href = 'student.html'; // Redirect to the student's page
            } else if (userType === 'professor') {
                window.location.href = 'prof.html'; // Redirect to the professor's page
            } else if (userType === 'admin') {
                window.location.href = 'admin.html'; // Redirect to the admin's page
            }
        } else {
            // Handle validation failure
            messageElement.textContent = 'Please enter valid credentials.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageElement.textContent = 'An error occurred. Please try again.';
        messageElement.style.color = 'red';
    }
}

function studentLogin() {
    login('student');
}

function professorLogin() {
    login('professor');
}

function adminLogin() {
    login('admin');
}
