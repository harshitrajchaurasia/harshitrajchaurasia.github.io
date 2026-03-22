// ============================================
// PARTICLES
// ============================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 28000);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            size: Math.random() * 1.8 + 0.5,
            opacity: Math.random() * 0.25 + 0.08
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
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

        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 14400) { // 120^2
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(37, 99, 235, ${0.05 * (1 - Math.sqrt(dist) / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}

resizeCanvas();
initParticles();
drawParticles();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeCanvas(); initParticles(); }, 200);
});

// ============================================
// NAV
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
});

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active nav
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const y = window.scrollY + 120;
    sections.forEach(s => {
        const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (link) link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    });
});

// ============================================
// TYPEWRITER
// ============================================
const phrases = [
    'AI systems that ship to production.',
    'automation that saves 1000+ hours.',
    'ML models at 97% accuracy.',
    'tools that protect your privacy.',
    'cloud infra that doesn\'t go down.',
    'things that make manual work obsolete.'
];

let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
    const phrase = phrases[pi];
    if (deleting) {
        tw.textContent = phrase.substring(0, --ci);
    } else {
        tw.textContent = phrase.substring(0, ++ci);
    }

    let delay = deleting ? 25 : 55;

    if (!deleting && ci === phrase.length) {
        delay = 2200;
        deleting = true;
    } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 350;
    }
    setTimeout(type, delay);
}
type();

// ============================================
// SCROLL ANIMATIONS
// ============================================
const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            fadeObs.unobserve(e.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll(
    '.section-label, .section-title, .section-subtitle, .pii-showcase, ' +
    '.tech-used, .story-card, .contact-text, .c-card, .resume-download'
).forEach((el, i) => {
    el.classList.add('fade-in');
    // Stagger siblings of same type
    const siblings = el.parentElement ?
        Array.from(el.parentElement.children).filter(c => c.tagName === el.tagName) : [];
    const idx = siblings.indexOf(el);
    if (idx >= 0 && idx < 7) el.classList.add(`stagger-${idx + 1}`);
    fadeObs.observe(el);
});

// ============================================
// TILT EFFECT
// ============================================
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
