// ============================================
// PARTICLES BACKGROUND
// ============================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 25000);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(37, 99, 235, ${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resizeCanvas();
        createParticles();
    }, 200);
});

// ============================================
// NAVIGATION
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// ============================================
// TYPEWRITER EFFECT
// ============================================
const phrases = [
    'ML systems at scale.',
    'automation platforms.',
    'cloud infrastructure.',
    'tools that protect privacy.',
    'BERT-powered classifiers.',
    'things that save 1000+ hours.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typewrite() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }

    setTimeout(typewrite, delay);
}

typewrite();

// ============================================
// ANIMATED STAT COUNTERS
// ============================================
function animateCounters() {
    const stats = document.querySelectorAll('.stat');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const numEl = el.querySelector('.stat-number');
                const target = parseFloat(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const duration = 1500;
                const start = performance.now();
                const isDecimal = target % 1 !== 0;

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = target * eased;

                    numEl.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

animateCounters();

// ============================================
// SCROLL ANIMATIONS
// ============================================
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

// Apply to elements
document.querySelectorAll(
    '.section-title, .about-intro, .wid-card, .achievement, ' +
    '.journey-step, .project-featured, .project-card, ' +
    '.skill-group, .c-card, .story-text, .contact-text'
).forEach((el, i) => {
    el.classList.add('fade-in');
    // Add stagger to grouped elements
    const parent = el.parentElement;
    if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('fade-in'));
        const idx = siblings.indexOf(el);
        if (idx >= 0 && idx < 6) {
            el.classList.add(`stagger-${idx + 1}`);
        }
    }
    fadeObserver.observe(el);
});

// Journey progress bar
const journeyProgress = document.getElementById('journeyProgress');
if (journeyProgress) {
    const journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                journeyProgress.style.height = '100%';
                journeyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const journey = document.querySelector('.journey');
    if (journey) journeyObserver.observe(journey);
}

// ============================================
// TILT EFFECT ON CARDS
// ============================================
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// PAUSE MARQUEE ON HOVER
// ============================================
const marqueeTrack = document.querySelector('.certs-track');
if (marqueeTrack) {
    const marqueeContainer = document.querySelector('.certs-marquee');
    marqueeContainer.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeContainer.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}
