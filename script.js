function showLogin(userType) {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.add('hidden');
    });

    const selectedForm = document.getElementById(`${userType}-login`);
    selectedForm.classList.remove('hidden');
}

async function login(userType) {
    const webmailOrUsername = document.getElementById(userType === 'admin' ? 'admin-username' : `${userType}-webmail`).value;
    const password = document.getElementById(`${userType}-password`).value;
    const messageElement = document.getElementById(`${userType}-message`);

    try {
        const response = await fetch(`/login/${userType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                [userType === 'admin' ? 'username' : 'webmail']: webmailOrUsername, 
                password 
            }),
        });

        console.log(`Response status: ${response.status}`); // Log response status
        const data = await response.json();
        console.log(data); // Log response data

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            // Redirect or update UI for successful login
        } else {
            messageElement.textContent = data.message || 'Login failed. Please try again.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageElement.textContent = 'An error occurred. Please check the console and try again.';
        messageElement.style.color = 'red';
    }

    // Redirect to a new page after the login attempt (success or failure)
    window.location.href = 'prof.html'; // Replace '/dashboard' with the actual target page
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
