// Gomantak Gausevak Mahasang - Main JavaScript
// Shared functionality across all pages

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    const icon = document.getElementById('menuIcon');

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
        if (icon) icon.classList.remove('fa-times');
        if (icon) icon.classList.add('fa-bars');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
        if (icon) icon.classList.remove('fa-bars');
        if (icon) icon.classList.add('fa-times');
    }
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll Top Button Visibility
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    }
});

// Fade-in Animation on Scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Counter Animation
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Toast Notification
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (type === 'success') {
        toast.classList.remove('border-red-500');
        toast.classList.add('border-primary');
        toastIcon.className = 'fas fa-check text-primary text-sm';
    } else {
        toast.classList.remove('border-primary');
        toast.classList.add('border-red-500');
        toastIcon.className = 'fas fa-exclamation text-red-500 text-sm';
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// FAQ Toggle
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Store submission data
function storeSubmission(type, data) {
    const key = 'gg_submissions';
    let submissions = JSON.parse(localStorage.getItem(key) || '[]');
    data.id = Date.now().toString();
    data.type = type;
    data.timestamp = new Date().toISOString();
    data.date = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    submissions.push(data);
    localStorage.setItem(key, JSON.stringify(submissions));
    return data;
}

// Get submissions by type
function getSubmissions(type) {
    const submissions = JSON.parse(localStorage.getItem('gg_submissions') || '[]');
    return submissions.filter(s => s.type === type);
}

// Delete submission
function deleteSubmission(id) {
    let submissions = JSON.parse(localStorage.getItem('gg_submissions') || '[]');
    submissions = submissions.filter(s => s.id !== id);
    localStorage.setItem('gg_submissions', JSON.stringify(submissions));
}

// Track visitor count
(function() {
    let visitors = parseInt(localStorage.getItem('gg_visitors') || '1247');
    if (!sessionStorage.getItem('gg_visit_tracked')) {
        visitors++;
        localStorage.setItem('gg_visitors', visitors.toString());
        sessionStorage.setItem('gg_visit_tracked', 'true');
    }
})();
