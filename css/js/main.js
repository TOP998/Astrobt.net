/* ============================================
   ASTRO-PREMIUM LANDING PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // === Stars Background ===
    createStars();
    
    // === Mobile Menu ===
    initMobileMenu();
    
    // === Smooth Scroll ===
    initSmoothScroll();
    
    // === FAQ Accordion ===
    initFAQ();
    
    // === Counter Animation ===
    initCounters();
    
    // === Timer ===
    initTimer();
    
    // === Header Scroll Effect ===
    initHeaderScroll();
    
    // === Form Handling ===
    initCTAClicks();
});

// === Create Stars Background ===
function createStars() {
    const starsBg = document.getElementById('starsBg');
    if (!starsBg) return;
    
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.opacity = Math.random() * 0.5 + 0.3;
        
        starsBg.appendChild(star);
    }
}

// === Mobile Menu ===
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// === Smooth Scroll ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === FAQ Accordion ===
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// === Counter Animation ===
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = target === 4.9 ? current.toFixed(1) : Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target === 4.9 ? target.toFixed(1) : target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// === Timer ===
function initTimer() {
    const timerElement = document.getElementById('ctaTimer');
    if (!timerElement) return;
    
    // Set timer to 24 hours from now
    let endTime = localStorage.getItem('astroTimer');
    
    if (!endTime) {
        endTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('astroTimer', endTime);
    }
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateTimer() {
        const now = Date.now();
        const distance = endTime - now;
        
        if (distance < 0) {
            // Reset timer
            endTime = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem('astroTimer', endTime);
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// === Header Scroll Effect ===
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(11, 12, 21, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(11, 12, 21, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// === CTA Click Tracking ===
function initCTAClicks() {
    const ctaButtons = document.querySelectorAll('a[href*="t.me/"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Yandex.Metrika goal (if configured)
            if (typeof ym !== 'undefined') {
                ym(XXXXXXXX, 'reachGoal', 'telegram_click');
            }
            
            // Google Analytics (if configured)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': 'Telegram Button'
                });
            }
        });
    });
}

// === Reset Timer (for testing) ===
window.resetAstroTimer = function() {
    localStorage.removeItem('astroTimer');
    location.reload();
};
