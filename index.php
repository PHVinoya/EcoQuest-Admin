<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoQuest | Explore. Protect. Sustain.</title>
    <link rel="stylesheet" href="style.css">
    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="container nav-container">
            <div class="nav-left">
                <div class="logo">
                    <span>EcoQuest</span>
                </div>
            </div>
            <div class="nav-center">
                <ul class="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                    <!-- Admin button inside mobile menu -->
                    <li class="mobile-only"><button class="admin-btn">Admin</button></li>
                </ul>
            </div>
            <div class="nav-right">
                <!-- Admin button for desktop view -->
                <button class="admin-btn desktop-only">Admin</button>
                <div class="mobile-menu-icon">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container hero-container">
            <div class="hero-content fade-in">
                <div class="badge">
                    <i class="fas fa-shield-alt pink-icon"></i> Secure & Eco Friendly
                </div>
                <h1>EcoQuest</h1>
                <p>Join a global community dedicated to environmental awareness. Track your impact, discover sustainable habits, and protect our planet through interactive eco-challenges.</p>
                <div class="hero-btns">
                    <button class="btn primary-btn"><i class="fas fa-download pink-icon"></i> Get App</button>
                </div>
            </div>
            <div class="hero-visual slide-up">
                <div class="phone-mockup">
                    <div class="phone-frame">
                        <div class="phone-screen">
                            <!-- PLACE YOUR IMAGE HERE -->
                            <img src="assets/imageIcon.jfif" alt="EcoQuest App" class="app-screenshot">
                        </div>
                        <div class="phone-button"></div>
                    </div>
                    <div class="glass-card floating">
                        <i class="fas fa-download pink-icon"></i>
                        <span>Download Now!</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content glass-morphism">
            <span class="close-btn">&times;</span>
            <div class="modal-header">
                <h2>Admin Login</h2>
            </div>
            <form id="loginForm" action="login.php" method="POST">
                <div id="errorMessage" class="error-message" style="display: none;"></div>
                <div class="input-group">
                    <label for="username">Username</label>
                    <div class="input-wrapper">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" placeholder="Enter your username" required>
                    </div>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <div class="input-wrapper">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                    </div>
                </div>
                <button type="submit" class="btn primary-btn login-submit">Login</button>
            </form>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
