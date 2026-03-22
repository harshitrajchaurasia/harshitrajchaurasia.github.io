// ============================================
// HARSHIT CHAURASIA - PORTFOLIO
// Lightweight: theme toggle, nav, scroll reveal
// ============================================

(function () {
    'use strict';

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // Nav scroll state
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
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
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Footer year
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // Scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll reveal via IntersectionObserver
    const revealElements = document.querySelectorAll(
        '.project-slide, .project-card, .section-title, .contact-desc, .contact-info, .more-heading, .project-demo, .intro-expand'
    );
    if (revealElements.length) {
        revealElements.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealElements.forEach(el => observer.observe(el));
    }

    // Intro "More about me" expand/collapse
    var introBtn = document.getElementById('introExpandBtn');
    var introContent = document.getElementById('introExpandContent');
    if (introBtn && introContent) {
        introBtn.addEventListener('click', function () {
            var wrapper = introBtn.closest('.intro-expand');
            var isOpen = wrapper.classList.toggle('open');
            introBtn.querySelector('.intro-expand-label').textContent = isOpen ? 'Less about me' : 'More about me';
        });
    }

    // Projects expand/collapse toggle
    const expandBtn = document.getElementById('projectsExpandBtn');
    const carousel = document.getElementById('projectsCarousel');
    const carouselWrapper = carousel ? carousel.parentElement : null;
    if (expandBtn && carousel) {
        expandBtn.addEventListener('click', function () {
            var isExpanded = carousel.classList.toggle('expanded');
            if (carouselWrapper) carouselWrapper.classList.toggle('expanded', isExpanded);
            expandBtn.classList.toggle('active', isExpanded);
            expandBtn.querySelector('.expand-label').textContent = isExpanded ? 'Collapse' : 'Expand all';
            updateArrows();
        });
    }

    // Carousel arrow navigation
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');

    function updateArrows() {
        if (!carousel || !prevBtn || !nextBtn) return;
        if (carousel.classList.contains('expanded')) return;
        var scrollLeft = carousel.scrollLeft;
        var maxScroll = carousel.scrollWidth - carousel.clientWidth;
        prevBtn.classList.toggle('hidden', scrollLeft < 5);
        nextBtn.classList.toggle('hidden', scrollLeft >= maxScroll - 5);
    }

    if (carousel && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function () {
            var slide = carousel.querySelector('.project-slide');
            if (slide) carousel.scrollBy({ left: -(slide.offsetWidth + 20), behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', function () {
            var slide = carousel.querySelector('.project-slide');
            if (slide) carousel.scrollBy({ left: slide.offsetWidth + 20, behavior: 'smooth' });
        });
        carousel.addEventListener('scroll', updateArrows, { passive: true });
        updateArrows();
    }

})();
