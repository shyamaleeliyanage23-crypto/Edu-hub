// Toggle Mobile Navbar
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Simple slide/fade effect for mobile menu
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--glass-background)';
            navLinks.style.backdropFilter = 'blur(10px)';
            navLinks.style.padding = '2rem';
            navLinks.style.zIndex = '999';
        } else {
            navLinks.style.display = '';
        }
    });
}
