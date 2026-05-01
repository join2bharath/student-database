document.addEventListener('DOMContentLoaded', () => {
    // Handling the 2-second loading animation
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        // Fade out loader
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Show main content
            mainContent.classList.remove('hidden');
            document.body.style.overflow = 'auto'; // allow scroll if needed
        }, 500); // Wait for fade out
    }, 2000); // 2 seconds loading delay

    // Form submission handling
    const form = document.getElementById('studentForm');
    const messageEl = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        messageEl.className = 'message hidden';
        messageEl.textContent = '';
        
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Enrolling...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(result.message || 'Enrollment Successful!', 'success');
                form.reset();
            } else {
                showMessage(result.message || 'Error occurred during enrollment.', 'error');
            }
        } catch (error) {
            showMessage('Network error. Is the backend running?', 'error');
            console.error('Error:', error);
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }
});
