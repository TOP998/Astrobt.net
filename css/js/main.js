// === ТОЧКА ВХОДА ===
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initHeaderScroll();
    initTimer(); // <--- 1. ДОБАВИТЬ ВЫЗОВ ЭТОЙ ФУНКЦИИ
});

// === СОЗДАНИЕ ЗВЕЗД ===
function createStars() {
    const starsBg = document.getElementById('starsBg');
    if (!starsBg) return;
    
    starsBg.innerHTML = ''; 

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsBg.appendChild(star);
    }
}

// === МЕНЮ ===
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        this.classList.toggle('open');
    });
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('open');
        });
    });

    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('open');
        }
    });
}

// === ПЛАВНЫЙ СКРОЛЛ ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Игнорируем пустые ссылки
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                const mobileMenu = document.getElementById('mobileMenu');
                if(mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });
}

// === СЧЕТЧИКИ ЦИФР ===
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;

    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                const duration = 2000;
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

// === ШАПКА ПРИ СКРОЛЛЕ ===
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// === ТАЙМЕР (НОВАЯ ФУНКЦИЯ) ===
function initTimer() {
    const timerElement = document.getElementById('ctaTimer');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Если элементов нет на странице, выходим
    if (!timerElement || !hoursEl || !minutesEl || !secondsEl) return;

    let endTime = localStorage.getItem('astroTimerEnd');
    const now = Date.now();

    // Если таймер истек или его нет — создаем новый на 1 час
    if (!endTime || now > parseInt(endTime)) {
        endTime = now + (60 * 60 * 1000); // 1 час в миллисекундах
        localStorage.setItem('astroTimerEnd', endTime.toString());
        console.log("🕒 Таймер сброшен и запущен заново!");
    }

    function updateTimer() {
        const currentTime = Date.now();
        const distance = parseInt(endTime) - currentTime;

        // Если время вышло — перезапускаем
        if (distance < 0) {
            const newEndTime = currentTime + (60 * 60 * 1000);
            localStorage.setItem('astroTimerEnd', newEndTime.toString());
            return; 
        }

        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        hoursEl.textContent = h.toString().padStart(2, '0');
        minutesEl.textContent = m.toString().padStart(2, '0');
        secondsEl.textContent = s.toString().padStart(2, '0');
    }

    updateTimer(); // Запустить сразу
    setInterval(updateTimer, 1000); // Обновлять каждую секунду
}
