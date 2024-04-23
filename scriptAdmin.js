document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#admin-login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form data
        const formData = new FormData(loginForm);

        try {
            // Send POST request to the backend
            const response = await fetch('/admin-main', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // If the response is successful (status code 200-299), redirect to the admin main page
                window.location.href = '/admin_main_page.html';
            } else if (response.status === 401) {
                // If login fails due to unauthorized access
                alert('Unauthorized access. Please check your credentials.');
            } else {
                // Handle other error cases
                alert('An error occurred. Please try again later.');
            }
        } catch (error) {
            // Handle network errors
            console.error('Error:', error);
            alert('An error occurred. Please check your network connection.');
        }
    });
});
