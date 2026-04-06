document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navCenter = document.querySelector('.nav-center');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Modal Elements
    const modal = document.getElementById('loginModal');
    const adminBtns = document.querySelectorAll('.admin-btn');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');

    // 1. Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    mobileMenuIcon.addEventListener('click', () => {
        navCenter.classList.toggle('active');
        const icon = mobileMenuIcon.querySelector('i');
        if (navCenter.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // 3. Close Mobile Menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navCenter.classList.remove('active');
            const icon = mobileMenuIcon.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // 4. Modal Functionality
    const openModal = () => {
        modal.classList.add('show');
        // Close mobile menu if open
        navCenter.classList.remove('active');
        const icon = mobileMenuIcon.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    };

    const closeModal = () => {
        modal.classList.remove('show');
    };

    adminBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const errorMessage = document.getElementById('errorMessage');
        
        // Hide any previous error message
        errorMessage.style.display = 'none';
        
        fetch('login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorMessage.textContent = data.error;
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        });
    });
    // 5. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for sticky navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Subtle Hover Effects for Primary Button
    const primaryBtn = document.querySelector('.primary-btn');
    if (primaryBtn) {
        primaryBtn.addEventListener('mouseenter', () => {
            primaryBtn.style.boxShadow = '0 15px 30px rgba(46, 204, 113, 0.6)';
        });
        primaryBtn.addEventListener('mouseleave', () => {
            primaryBtn.style.boxShadow = '0 10px 20px rgba(46, 204, 113, 0.4)';
        });
    }

    
});

