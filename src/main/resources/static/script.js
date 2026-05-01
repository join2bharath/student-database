document.addEventListener('DOMContentLoaded', () => {
    // Handling the loading animation
    const loader = document.getElementById('loader');
    
    // Elements
    const navStudent = document.getElementById('nav-student');
    const navAdmin = document.getElementById('nav-admin');
    const viewStudent = document.getElementById('student-view');
    const viewAdminLogin = document.getElementById('admin-login-view');
    const viewAdminDashboard = document.getElementById('admin-dashboard-view');
    const logoutBtn = document.getElementById('logout-btn');
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // View Switching Logic
    function switchView(viewName) {
        // Reset Nav
        navStudent.classList.remove('active');
        navAdmin.classList.remove('active');
        
        // Hide all views
        viewStudent.classList.remove('active-view');
        viewAdminLogin.classList.remove('active-view');
        viewAdminDashboard.classList.remove('active-view');

        if (viewName === 'student') {
            navStudent.classList.add('active');
            viewStudent.classList.add('active-view');
        } else if (viewName === 'admin-login') {
            navAdmin.classList.add('active');
            viewAdminLogin.classList.add('active-view');
        } else if (viewName === 'admin-dashboard') {
            navAdmin.classList.add('active');
            viewAdminDashboard.classList.add('active-view');
        }
    }

    navStudent.addEventListener('click', () => switchView('student'));
    navAdmin.addEventListener('click', () => switchView('admin-login'));
    logoutBtn.addEventListener('click', () => {
        document.getElementById('adminPassword').value = '';
        switchView('admin-login');
    });

    // Handle Student Enrollment
    const studentForm = document.getElementById('studentForm');
    const messageEl = document.getElementById('message');
    
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = studentForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enrolling... ⏳';
        submitBtn.disabled = true;

        const data = Object.fromEntries(new FormData(studentForm).entries());

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (response.ok) {
                showMessage(messageEl, result.message, 'success');
                studentForm.reset();
            } else {
                showMessage(messageEl, result.message, 'error');
            }
        } catch (error) {
            // Netlify fallback for form
            showMessage(messageEl, 'Demo Mode: Form submitted successfully! 🎉 (Data not saved)', 'success');
            studentForm.reset();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle Admin Login
    const adminForm = document.getElementById('adminLoginForm');
    const adminMsg = document.getElementById('admin-login-message');
    const tableBody = document.getElementById('student-table-body');
    const demoBadge = document.getElementById('demo-badge');

    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const btn = adminForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Verifying... ⏳';
        
        try {
            const response = await fetch(`/api/students?password=${encodeURIComponent(password)}`);
            
            if (response.ok) {
                const students = await response.json();
                populateTable(students);
                switchView('admin-dashboard');
                adminMsg.className = 'message hidden';
                demoBadge.classList.add('hidden');
            } else {
                const res = await response.json();
                showMessage(adminMsg, res.message || 'Access Denied 🛑', 'error');
            }
        } catch (error) {
            // Netlify fallback for admin dashboard
            if (password === 'admin123') {
                populateTable([
                    {studentId: 'S1001', rollNumber: '21BCE001', phoneNumber: '+1 234 567 8900', dateOfBirth: '2003-05-15', address: '123 Tech Lane, NY'},
                    {studentId: 'S1002', rollNumber: '21BCE002', phoneNumber: '+1 987 654 3210', dateOfBirth: '2004-08-22', address: '456 Innovation Blvd, CA'},
                    {studentId: 'S1003', rollNumber: '21BCE003', phoneNumber: '+1 555 123 4567', dateOfBirth: '2002-11-05', address: '789 Startup Road, TX'}
                ]);
                demoBadge.classList.remove('hidden');
                switchView('admin-dashboard');
                adminMsg.className = 'message hidden';
            } else {
                showMessage(adminMsg, 'Invalid admin password. 🚫', 'error');
            }
        } finally {
            btn.textContent = originalText;
        }
    });

    function populateTable(students) {
        tableBody.innerHTML = '';
        if (students.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">No students found. 📭</td></tr>';
            return;
        }
        students.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.studentId}</td>
                <td>${s.rollNumber}</td>
                <td>${s.phoneNumber}</td>
                <td>${s.dateOfBirth}</td>
                <td>${s.address}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function showMessage(element, text, type) {
        element.textContent = text;
        element.className = `message ${type}`;
    }
});
