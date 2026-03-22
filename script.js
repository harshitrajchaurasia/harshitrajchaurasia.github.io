// ============================================
// HARSHIT CHAURASIA - PORTFOLIO
// Lightweight: theme toggle, nav, scroll reveal,
// PII demo, count-up metrics, keyboard shortcuts
// ============================================

(function () {
    'use strict';

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function toggleTheme() {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Nav scroll state — hide on scroll down, show on scroll up or at top
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;
    let ticking = false;
    function onNavScroll() {
        const y = window.scrollY;
        if (nav) {
            nav.classList.toggle('scrolled', y > 10);
            // Show when at top or scrolling up; hide when scrolling down past 60px
            if (y <= 10) {
                nav.classList.remove('nav-hidden');
            } else if (y > lastScrollY && y > 60) {
                nav.classList.add('nav-hidden');
            } else if (y < lastScrollY) {
                nav.classList.remove('nav-hidden');
            }
        }
        lastScrollY = y;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onNavScroll); ticking = true; }
    }, { passive: true });

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => navLinks.classList.remove('open'))
        );
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
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
        '.project-slide, .project-card, .section-title, .contact-desc, .contact-info, .more-heading, .project-demo, .intro-expand, .exp-role, .exp-awards, .skills-grid, .certs-section, .education-section, .metrics-strip, .currently-content, .exp-narrative'
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
            introBtn.querySelector('.intro-expand-label').textContent = isOpen ? 'Hide highlights' : 'Key highlights';
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

    // ============================================
    // SCROLL-ANIMATED METRICS (count-up on scroll)
    // ============================================
    var metricsStrip = document.querySelector('.metrics-strip');
    if (metricsStrip) {
        var metricsAnimated = false;
        var metricsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !metricsAnimated) {
                    metricsAnimated = true;
                    animateMetrics();
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        metricsObserver.observe(metricsStrip);
    }

    function animateMetrics() {
        document.querySelectorAll('.metric').forEach(function (metric) {
            var target = parseInt(metric.getAttribute('data-target'), 10);
            var valueEl = metric.querySelector('.metric-value');
            if (!valueEl || isNaN(target)) return;

            var duration = 1200;
            var start = performance.now();

            function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

            function tick(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var current = Math.round(easeOutQuart(progress) * target);
                valueEl.textContent = current.toLocaleString();
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        });
    }

    // ============================================
    // INTERACTIVE PII DEMO
    // ============================================
    var piiInput = document.getElementById('piiInput');
    var piiOutput = document.getElementById('piiOutput');
    var piiBtn = document.getElementById('piiRedactBtn');
    var piiStats = document.getElementById('piiStats');
    var PII_API = 'https://pii-shield-49982461185.us-central1.run.app/api/redact-text';

    if (piiBtn && piiInput && piiOutput) {
        piiBtn.addEventListener('click', async function () {
            var text = piiInput.value.trim();
            if (!text) return;

            piiBtn.disabled = true;
            piiBtn.textContent = 'Processing…';
            piiOutput.innerHTML = '';
            if (piiStats) piiStats.textContent = '';

            try {
                var response = await fetch(PII_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text, fast_mode: false })
                });

                if (!response.ok) throw new Error('API error');

                var data = await response.json();
                piiOutput.textContent = data.redacted_text || '';

                if (piiStats) {
                    piiStats.innerHTML =
                        '<span>' + (data.redaction_count || 0) + ' redactions</span>' +
                        '<span>' + ((data.processing_time_ms || 0).toFixed(0)) + 'ms</span>';
                }
            } catch (err) {
                // Fallback: show a static demo if API is unavailable
                piiOutput.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">API unavailable — <a href="https://pii-shield-49982461185.us-central1.run.app" target="_blank" rel="noopener" style="color:var(--accent);">try the full app</a></span>';
            } finally {
                piiBtn.disabled = false;
                piiBtn.textContent = 'Shield it';
            }
        });
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    var kbdToast = document.getElementById('kbdToast');
    var sectionIds = ['work', 'experience', 'skills', 'currently', 'contact'];
    var kbdVisible = false;

    function getCurrentSectionIndex() {
        var y = window.scrollY + 200;
        for (var i = sectionIds.length - 1; i >= 0; i--) {
            var el = document.getElementById(sectionIds[i]);
            if (el && el.offsetTop <= y) return i;
        }
        return -1;
    }

    function navigateSection(delta) {
        var idx = getCurrentSectionIndex() + delta;
        idx = Math.max(0, Math.min(idx, sectionIds.length - 1));
        var el = document.getElementById(sectionIds[idx]);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showKbdToast() {
        if (!kbdToast) return;
        kbdVisible = !kbdVisible;
        kbdToast.classList.toggle('show', kbdVisible);
    }

    document.addEventListener('keydown', function (e) {
        // Ignore when typing in inputs/textareas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        switch (e.key) {
            case 'j': navigateSection(1); break;
            case 'k': navigateSection(-1); break;
            case 't': toggleTheme(); break;
            case '?': showKbdToast(); e.preventDefault(); break;
            case 'Escape':
                if (kbdVisible) { kbdVisible = false; kbdToast.classList.remove('show'); }
                break;
        }
    });

})();
