// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Preloader & Initialization
window.addEventListener('load', () => {
    lucide.createIcons();
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            initGSAP();
            ScrollTrigger.refresh();
            
            // Initialize AOS after GSAP refresh
            AOS.init({
                duration: 1000,
                once: true,
                easing: 'ease-out-cubic',
                offset: 100
            });
        }, 500);
    }, 100);
});

function initGSAP() {
    gsap.from(".hero-content > *", { y: 60, duration: 1, stagger: 0.15, ease: "power3.out" });
    gsap.from(".hero-image", { scale: 0.95, duration: 1, delay: 0.5, ease: "power3.out" });
    gsap.from(".hero-floating-card", { scale: 0.8, duration: 0.8, delay: 0.8, stagger: 0.1, ease: "back.out(1.7)" });
    
    gsap.from(".stat-card", { scrollTrigger: { trigger: ".stats-row", start: "top bottom" }, y: 50, duration: 0.8, stagger: 0.1, ease: "power3.out" });
    gsap.from(".about-image", { scrollTrigger: { trigger: "#about", start: "top 90%" }, x: -50, duration: 1, ease: "power3.out" });
    gsap.from(".about-content", { scrollTrigger: { trigger: "#about", start: "top 90%" }, x: 50, duration: 1, ease: "power3.out" });
    gsap.to(".hero", { backgroundPositionY: "30%", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.from(".course-card", { scrollTrigger: { trigger: "#courses", start: "top 95%" }, y: 40, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    gsap.from(".path-item", { scrollTrigger: { trigger: ".path-grid", start: "top 95%" }, y: 40, duration: 0.6, stagger: 0.1, ease: "power3.out" });
}

// Mouse movement for glass cards spotlight
document.querySelectorAll(".glass-card").forEach(card => {
    card.onmousemove = e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };
});


// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Sticky Header
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Ripple Effect for Buttons
const rippleButtons = document.querySelectorAll('.ripple');
rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;
        
        let ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple-effect');
        this.appendChild(ripples);
        
        setTimeout(() => {
            ripples.remove();
        }, 600);
    });
});

// Counter Animation for Results
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounters = (section) => {
    const sectionCounters = section.querySelectorAll('.counter');
    sectionCounters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.innerText.replace(/[^0-9]/g, '');
            const count = +counter.getAttribute('data-count') || 0;
            const inc = target / speed;

            if (count < target) {
                const nextCount = Math.ceil(count + inc);
                counter.setAttribute('data-count', nextCount);
                counter.innerText = nextCount + (counter.innerText.includes('%') ? '%' : counter.innerText.includes('+') ? '+' : '');
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + (counter.innerText.includes('%') ? '%' : counter.innerText.includes('+') ? '+' : '');
            }
        };
        updateCount();
    });
};

// Intersection Observer for Statistics
const statsSections = document.querySelectorAll('.stats-row, .stats-grid');
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

statsSections.forEach(section => {
    observer.observe(section);
});

// Testimonial Slider
const slides = document.querySelectorAll('.testimonial-slide');
const nextBtn = document.querySelector('.slider-btn.next');
const prevBtn = document.querySelector('.slider-btn.prev');
let currentTestimonial = 0;

function showTestimonial(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % slides.length;
        showTestimonial(currentTestimonial);
    });

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + slides.length) % slides.length;
        showTestimonial(currentTestimonial);
    });

    // Autoplay testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % slides.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Add CSS for ripple effect dynamically if not in style.css
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .ripple-effect {
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        transform: translate(-50%, -50%);
        pointer-events: none;
        border-radius: 50%;
        animation: animateRipple 0.6s linear;
    }

    @keyframes animateRipple {
        0% {
            width: 0px;
            height: 0px;
            opacity: 0.5;
        }
        100% {
            width: 500px;
            height: 500px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);
