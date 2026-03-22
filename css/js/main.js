document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initHeaderScroll();
});

// === СОЗДАНИЕ ЗВЕЗД (ОДИН РАЗ) ===
function createStars() {
    const starsBg = document.getElementById('starsBg');
    if (!starsBg) return;
    
    // Очищаем, если там что-то было, чтобы не дублировать
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

// === МЕНЮ (ИСПРАВЛЕННОЕ) ===
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Проверка: существуют ли элементы
    if (!mobileMenuBtn || !mobileMenu) {
        console.error('Элементы меню не найдены! Проверьте ID в HTML.');
        return;
    }
    
    // Клик по гамбургеру
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Чтобы клик не ушел дальше
        mobileMenu.classList.toggle('active');
        
        // Для красоты можно менять цвет кнопок при открытии
        this.classList.toggle('open');
    });
    
    // Закрытие при клике на ссылку внутри меню
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('open');
        });
    });

    // Закрытие при клике вне меню
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
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // Учитываем высоту фиксированной шапки
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Закрываем мобильное меню если открыто
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
