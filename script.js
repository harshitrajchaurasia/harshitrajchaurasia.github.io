// ============================================
// HARSHIT CHAURASIA — PORTFOLIO v5
// GSAP + Lenis + Dark Mode + Showcase Animations
// ============================================

(function () {
    'use strict';

    // ============================================
    // LOADER
    // ============================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 600);
    });

    // ============================================
    // LENIS SMOOTH SCROLL
    // ============================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5
        });

        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { offset: -80 });
                }
            });
        });
    }

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function getTheme() {
        return root.getAttribute('data-theme') || 'light';
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = getTheme() === 'light' ? 'dark' : 'light';
            setTheme(next);
        });
    }

    // ============================================
    // NAV
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    const logoMark = document.getElementById('logoMark');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
        if (logoMark) logoMark.textContent = window.scrollY > 10 ? 'Home' : 'Welcome';
    });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => navLinks.classList.remove('open'))
        );
    }

    // Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const y = window.scrollY + 120;
        sections.forEach(s => {
            const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
            if (link) {
                link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // TYPEWRITER
    // ============================================
    const phrases = [
        'ML pipelines that actually run in prod.',
        'bots that replaced 25 manual workflows.',
        'a privacy tool for ChatGPT users.',
        'a copyright-awarded RPA platform.',
        'back-to-back hackathon gold at TCS.',
        'stuff that makes manual work disappear.'
    ];

    let phraseIdx = 0, charIdx = 0, deleting = false;
    const tw = document.getElementById('typewriter');

    function typewrite() {
        if (!tw) return;
        const phrase = phrases[phraseIdx];
        if (deleting) {
            tw.textContent = phrase.substring(0, --charIdx);
        } else {
            tw.textContent = phrase.substring(0, ++charIdx);
        }

        let delay = deleting ? 25 : 55;
        if (!deleting && charIdx === phrase.length) {
            delay = 2200;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 350;
        }
        setTimeout(typewrite, delay);
    }
    typewrite();

    // ============================================
    // FOOTER YEAR
    // ============================================
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // ============================================
    // SCROLL TO TOP
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
        });
        scrollTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ============================================
    // TILT EFFECT (desktop only)
    // ============================================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -4;
                const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // ============================================
    // MAGNETIC BUTTON EFFECT (desktop only)
    // ============================================
    if (window.matchMedia('(pointer: fine)').matches && typeof gsap !== 'undefined') {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.15;
                const y = (e.clientY - r.top - r.height / 2) * 0.15;
                gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    // ============================================
    // MAIL BUTTON — explicit handler for reliability
    // ============================================
    const mailBtn = document.getElementById('mailBtn');
    if (mailBtn) {
        mailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = mailBtn.href;
        });
    }

    // ============================================
    // GSAP + SCROLLTRIGGER ANIMATIONS
    // ============================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- Hero entrance ---
        const heroTl = gsap.timeline({ delay: 0.7 });
        heroTl
            .from('.hero-badge', { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out' })
            .from('.hero-greeting', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' }, '-=0.1')
            .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .from('.hero-description', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .from('.hero-stats', { opacity: 0, y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .from('.hero-visual', { opacity: 0, scale: 0.9, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.4');

        // --- Nav slide in ---
        gsap.from('.nav', {
            y: -80, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.5
        });

        // --- Section labels, titles, subtitles ---
        gsap.utils.toArray('.section-label, .section-title, .section-subtitle').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                opacity: 0, y: 30, duration: 0.6, ease: 'power2.out'
            });
        });

        // --- Showcase headers slide in ---
        gsap.utils.toArray('.showcase-header').forEach(sh => {
            gsap.from(sh, {
                scrollTrigger: { trigger: sh, start: 'top 85%', once: true },
                opacity: 0, x: -30, duration: 0.7, ease: 'power2.out'
            });
        });

        // --- PII Demo window rise up ---
        const demoWindow = document.querySelector('.showcase-demo');
        if (demoWindow) {
            gsap.from(demoWindow, {
                scrollTrigger: { trigger: demoWindow, start: 'top 85%', once: true },
                opacity: 0, y: 60, duration: 0.9, ease: 'power3.out'
            });
        }

        // --- PII text highlight animation ---
        gsap.utils.toArray('.pii').forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                opacity: 0, scale: 0.9, duration: 0.4, delay: i * 0.06,
                ease: 'back.out(1.7)'
            });
        });

        // --- Visual cards (Ticket Router, RPA) ---
        gsap.utils.toArray('.showcase-visual').forEach(vis => {
            gsap.from(vis, {
                scrollTrigger: { trigger: vis, start: 'top 85%', once: true },
                opacity: 0, y: 50, duration: 0.8, ease: 'power3.out'
            });
        });

        // --- Diagram nodes stagger ---
        gsap.utils.toArray('.diagram-node').forEach((node, i) => {
            gsap.from(node, {
                scrollTrigger: { trigger: node, start: 'top 90%', once: true },
                opacity: 0, y: 20, scale: 0.9, duration: 0.5,
                delay: i * 0.15, ease: 'back.out(1.5)'
            });
        });

        // --- Bot grid stagger ---
        gsap.utils.toArray('.bot-node').forEach((bot, i) => {
            gsap.from(bot, {
                scrollTrigger: { trigger: bot, start: 'top 92%', once: true },
                opacity: 0, y: 20, scale: 0.9, duration: 0.4,
                delay: i * 0.06, ease: 'back.out(1.5)'
            });
        });

        // --- Counter animation for v-metric-num ---
        document.querySelectorAll('.v-metric-num').forEach(num => {
            const countTo = parseInt(num.getAttribute('data-count'), 10);
            if (isNaN(countTo)) return;

            gsap.fromTo(num, { innerText: 0 }, {
                innerText: countTo,
                duration: 2,
                ease: 'power1.out',
                snap: { innerText: 1 },
                scrollTrigger: { trigger: num, start: 'top 90%', once: true },
                onUpdate: function () {
                    num.textContent = Math.round(parseFloat(num.innerText));
                }
            });
        });

        // --- Showcase details pills ---
        gsap.utils.toArray('.showcase-details').forEach(det => {
            gsap.from(det, {
                scrollTrigger: { trigger: det, start: 'top 92%', once: true },
                opacity: 0, y: 20, duration: 0.5, ease: 'power2.out'
            });
        });

        // --- More projects heading ---
        const moreHeading = document.querySelector('.more-work-heading');
        if (moreHeading) {
            gsap.from(moreHeading, {
                scrollTrigger: { trigger: moreHeading, start: 'top 88%', once: true },
                opacity: 0, y: 20, duration: 0.5, ease: 'power2.out'
            });
        }

        // --- Compact project cards ---
        gsap.utils.toArray('.compact-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 90%', once: true },
                opacity: 0, y: 30, duration: 0.5, delay: i * 0.08, ease: 'power2.out'
            });
        });

        // --- About section ---
        gsap.from('.about-image-wrap', {
            scrollTrigger: { trigger: '.about-row', start: 'top 80%', once: true },
            opacity: 0, x: -50, duration: 0.8, ease: 'power2.out'
        });
        gsap.from('.about-text', {
            scrollTrigger: { trigger: '.about-row', start: 'top 80%', once: true },
            opacity: 0, x: 50, duration: 0.8, ease: 'power2.out', delay: 0.15
        });

        // --- About tool pills stagger ---
        gsap.utils.toArray('.about-tools span').forEach((pill, i) => {
            gsap.from(pill, {
                scrollTrigger: { trigger: pill.parentElement, start: 'top 90%', once: true },
                opacity: 0, y: 12, duration: 0.3, delay: i * 0.04, ease: 'power2.out'
            });
        });

        // --- Contact section ---
        gsap.from('.contact-text', {
            scrollTrigger: { trigger: '.contact-wrapper', start: 'top 80%', once: true },
            opacity: 0, x: -30, duration: 0.6, ease: 'power2.out'
        });
        gsap.utils.toArray('.c-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 90%', once: true },
                opacity: 0, x: 30, duration: 0.5, delay: i * 0.1, ease: 'power2.out'
            });
        });

        // --- Certifications badges ---
        gsap.utils.toArray('.cert-badge').forEach((badge, i) => {
            gsap.from(badge, {
                scrollTrigger: { trigger: badge, start: 'top 90%', once: true },
                opacity: 0, y: 30, scale: 0.95, duration: 0.5,
                delay: i * 0.08, ease: 'back.out(1.5)'
            });
        });

        // --- Parallax on gradient blobs ---
        gsap.to('.glow-1', {
            scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
            y: -200, ease: 'none'
        });
        gsap.to('.glow-2', {
            scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
            y: 150, ease: 'none'
        });
    } else {
        // Fallback: simple IntersectionObserver if GSAP fails to load
        const fadeObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                    fadeObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll(
            '.section-label, .section-title, .section-subtitle, ' +
            '.showcase-header, .showcase-demo, .showcase-visual, ' +
            '.compact-card, .about-image-wrap, .about-text, ' +
            '.contact-text, .c-card'
        ).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObs.observe(el);
        });
    }

    // ============================================
    // CONSOLE EASTER EGG
    // ============================================
    console.log(
        '%c\u{1F44B} Hey! Curious about the code? Check it out: https://github.com/harshitrajchaurasia',
        'font-size: 14px; color: #3b82f6; font-weight: bold;'
    );

})();
