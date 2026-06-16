// =========================================================
// harshit.sh - portfolio interactions
// boot terminal · command palette · PII demo · metrics
// scroll reveal · scroll-spy · zer0CO0L easter egg
// =========================================================

(function () {
    'use strict';

    const root = document.documentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // ---------- THEME ----------
    function toggleTheme() {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // ---------- TOPBAR SCROLLED STATE ----------
    const topbar = document.getElementById('topbar');
    let ticking = false;
    function onScroll() {
        const y = window.scrollY;
        if (topbar) topbar.classList.toggle('scrolled', y > 8);

        // scroll progress
        if (progressBar) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        }
        // scroll-top button
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 700);
        ticking = false;
    }
    const progressBar = document.getElementById('scrollProgress');
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ---------- FOOTER YEAR ----------
    const fy = document.getElementById('footerYear');
    if (fy) fy.textContent = new Date().getFullYear();

    // ---------- SCROLL REVEAL ----------
    const revealEls = document.querySelectorAll(
        '.sec-head, .whoami-grid, .proj-feature, .proj-card, .proj-mini, .proj-more-label, ' +
        '.timeline, .awards, .journey-intro, .stack-group, .certs, .passion-card, ' +
        '.otc-games, .otc-side, .now-item, .contact-term'
    );
    if (revealEls.length && 'IntersectionObserver' in window) {
        revealEls.forEach((el, i) => {
            el.classList.add('reveal');
            // light stagger for siblings in a grid
            el.style.transitionDelay = ((i % 6) * 0.04) + 's';
        });
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => io.observe(el));
    }

    // ---------- HERO ENTRANCE ----------
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('loaded')));

    // ---------- BOOT TERMINAL TYPEWRITER ----------
    const terminalBody = document.getElementById('terminalBody');
    const bootScript = [
        { type: 'cmd', text: 'whoami' },
        { type: 'out', text: 'Harshit Chaurasia - Automation & AI/ML Engineer' },
        { type: 'cmd', text: 'cat mission.txt' },
        { type: 'out', text: 'I build automation and ML systems that move at enterprise scale,\nplus privacy-first tools so your data stays yours.' },
        { type: 'cmd', text: './explore --start', caret: true }
    ];
    const PROMPT = '<span class="term-prompt">harshit@portfolio</span><span class="term-sep">:</span><span class="term-dir">~</span><span class="term-dollar">$</span> ';

    async function typeInto(el, text, speed) {
        for (let i = 0; i < text.length; i++) {
            el.textContent += text[i];
            await sleep(speed + Math.random() * 26);
        }
    }
    async function runBoot() {
        if (!terminalBody || prefersReduced) return;     // keep static fallback
        terminalBody.innerHTML = '';
        for (const row of bootScript) {
            const line = document.createElement('div');
            if (row.type === 'cmd') {
                line.className = 'term-line boot-line';
                line.innerHTML = PROMPT;
                terminalBody.appendChild(line);
                const cmd = document.createElement('span');
                cmd.className = 'term-cmd';
                line.appendChild(cmd);
                await typeInto(cmd, row.text, 34);
                if (row.caret) {
                    const c = document.createElement('span');
                    c.className = 'term-caret'; c.setAttribute('aria-hidden', 'true'); c.textContent = '▋';
                    line.appendChild(c);
                }
                await sleep(220);
            } else {
                const out = document.createElement('div');
                out.className = 'term-out boot-line';
                out.innerHTML = row.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
                terminalBody.appendChild(out);
                await sleep(300);
            }
        }
    }
    runBoot();

    // ---------- BOOT LOADER (first visit) ----------
    (function bootLoader() {
        const loader = document.getElementById('bootLoader');
        if (!root.classList.contains('booting')) { if (loader) loader.remove(); return; }
        if (!loader) { root.classList.remove('booting'); return; }
        const log = loader.querySelector('#bootLog');
        const bar = loader.querySelector('#bootBar');
        let finished = false;
        function finish() {
            if (finished) return; finished = true;
            try { sessionStorage.setItem('booted', '1'); } catch (e) { }
            root.classList.remove('booting');
            loader.classList.add('done');
            setTimeout(() => loader.remove(), 600);
        }
        loader.addEventListener('click', finish);
        window.addEventListener('keydown', finish, { once: true });
        const lines = [
            { t: 'booting harshit.sh ...', cls: 'bl-head' },
            { t: 'loading modules ......... ok' },
            { t: 'mounting /portfolio ...... ok' },
            { t: 'starting services ........ ok' },
            { t: 'ready.' }
        ];
        (async () => {
            for (let i = 0; i < lines.length && !finished; i++) {
                const span = document.createElement('span');
                if (lines[i].cls) span.className = lines[i].cls;
                span.textContent = lines[i].t + '\n';
                log.appendChild(span);
                if (bar) bar.style.width = Math.round(((i + 1) / lines.length) * 100) + '%';
                await sleep(150);
            }
            await sleep(260);
            finish();
        })();
    })();

    // ---------- GITHUB ACTIVITY ----------
    (function ghActivity() {
        const panel = document.getElementById('ghStats');
        if (!panel) return;
        fetch('github-stats.json', { cache: 'no-cache' })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => {
                if (!d || !d.updated) return;     // no real data yet -> stay hidden
                panel.querySelectorAll('[data-gh]').forEach(el => {
                    const v = d[el.getAttribute('data-gh')];
                    if (v === undefined || v === null) return;   // leave the "--" placeholder
                    el.textContent = (typeof v === 'number') ? v.toLocaleString() : v;
                });
                panel.hidden = false;
                requestAnimationFrame(() => panel.classList.add('in'));
            })
            .catch(() => { /* offline or missing -> panel stays hidden */ });
    })();

    // ---------- SECTION HEADING TYPEWRITER ----------
    (function headingTyper() {
        const headings = Array.from(document.querySelectorAll('.sec-title'));
        if (!headings.length || prefersReduced || !('IntersectionObserver' in window)) return;
        headings.forEach(h => {
            const word = h.textContent.trim();
            h.innerHTML = '<span class="type-word" aria-hidden="true"></span>'
                + '<span class="type-caret" aria-hidden="true">▋</span>'
                + '<span class="sr-only">' + word + '</span>';
            h._ts = { active: false, word: word, el: h.querySelector('.type-word') };
            h._ts.el.textContent = word;          // full word until it scrolls into view
        });
        async function loop(st) {
            const word = st.word, el = st.el;
            while (st.active) {
                for (let i = 1; i <= word.length && st.active; i++) { el.textContent = word.slice(0, i); await sleep(85 + Math.random() * 40); }
                await sleep(1500);
                if (!st.active) break;
                for (let i = word.length - 1; i >= 0 && st.active; i--) { el.textContent = word.slice(0, i); await sleep(45); }
                await sleep(450);
            }
            el.textContent = word;                // settle on the full word when paused
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                const st = e.target._ts;
                if (!st) return;
                if (e.isIntersecting && !st.active) { st.active = true; loop(st); }
                else if (!e.isIntersecting) { st.active = false; }
            });
        }, { threshold: 0.6 });
        headings.forEach(h => io.observe(h));
    })();

    // ---------- METRICS COUNT-UP ----------
    const metricsStrip = document.querySelector('.metrics');
    if (metricsStrip && 'IntersectionObserver' in window) {
        let done = false;
        const mo = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !done) { done = true; animateMetrics(); mo.unobserve(e.target); }
            });
        }, { threshold: 0.3 });
        mo.observe(metricsStrip);
    }
    function animateMetrics() {
        document.querySelectorAll('.metric').forEach(metric => {
            const target = parseInt(metric.getAttribute('data-target'), 10);
            const valueEl = metric.querySelector('.metric-value');
            if (!valueEl || isNaN(target)) return;
            if (prefersReduced) { valueEl.textContent = target.toLocaleString(); return; }
            const duration = 1300, start = performance.now();
            const ease = t => 1 - Math.pow(1 - t, 4);
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                valueEl.textContent = Math.round(ease(p) * target).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // ---------- PII DEMO ----------
    const piiInput = document.getElementById('piiInput');
    const piiOutput = document.getElementById('piiOutput');
    const piiBtn = document.getElementById('piiRedactBtn');
    const piiStats = document.getElementById('piiStats');
    const PII_API = 'https://pii-shield-49982461185.us-central1.run.app/api/redact-text';

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function highlightMasks(text) {
        // wrap [TOKENS] in a styled span
        return escapeHtml(text).replace(/\[[A-Z0-9_ ]+\]/g, m => '<span class="pii-mask">' + m + '</span>');
    }
    async function runPii() {
        const text = piiInput.value.trim();
        if (!text) { piiInput.focus(); return; }
        const label = piiBtn.querySelector('span');
        piiBtn.disabled = true;
        if (label) label.textContent = 'shielding...';
        piiOutput.innerHTML = '';
        if (piiStats) piiStats.textContent = '';
        try {
            const res = await fetch(PII_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, fast_mode: false })
            });
            if (!res.ok) throw new Error('api');
            const data = await res.json();
            piiOutput.innerHTML = highlightMasks(data.redacted_text || '') || '<p class="demo-placeholder">No PII detected - nothing to redact.</p>';
            if (piiStats) {
                piiStats.innerHTML =
                    '<span>' + (data.redaction_count || 0) + ' redactions</span>' +
                    '<span>' + ((data.processing_time_ms || 0).toFixed(0)) + 'ms</span>';
            }
        } catch (err) {
            piiOutput.innerHTML = '<span class="demo-placeholder">API is waking up - <a href="https://pii-shield-49982461185.us-central1.run.app" target="_blank" rel="noopener" style="color:var(--sec)">open the full app →</a></span>';
        } finally {
            piiBtn.disabled = false;
            if (label) label.textContent = 'shield it';
        }
    }
    if (piiBtn && piiInput && piiOutput) {
        piiBtn.addEventListener('click', runPii);
        piiInput.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); runPii(); }
        });
    }

    // ---------- CARD SPOTLIGHT ----------
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.proj-card').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
            });
        });
    }

    // ---------- SCROLL-SPY RAIL + SECTION ACCENT ----------
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const dots = Array.from(document.querySelectorAll('.rail-dot'));
    function updateSpy() {
        const y = window.scrollY + window.innerHeight * 0.35;
        let current = sections[0];
        for (const s of sections) { if (s.offsetTop <= y) current = s; }
        dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + current.id));
    }
    window.addEventListener('scroll', () => { requestAnimationFrame(updateSpy); }, { passive: true });
    updateSpy();

    // =====================================================
    // COMMAND PALETTE
    // =====================================================
    const cmdk = document.getElementById('cmdk');
    const cmdkInput = document.getElementById('cmdkInput');
    const cmdkList = document.getElementById('cmdkList');
    const cmdkTrigger = document.getElementById('cmdkTrigger');

    const COMMANDS = [
        { id: 'top', name: 'top', desc: 'back to start', go: () => jump('#top') },
        { id: 'whoami', name: 'whoami', desc: 'about me', go: () => jump('#whoami') },
        { id: 'projects', name: 'projects', desc: 'what I built', go: () => jump('#projects') },
        { id: 'journey', name: 'journey', desc: 'experience', go: () => jump('#journey') },
        { id: 'stack', name: 'stack', desc: 'skills & certs', go: () => jump('#skills') },
        { id: 'passions', name: 'passions', desc: 'what I geek out on', go: () => jump('#passions') },
        { id: 'off', name: 'off-the-clock', desc: 'gaming', go: () => jump('#off-the-clock') },
        { id: 'now', name: 'now', desc: 'current focus', go: () => jump('#now') },
        { id: 'contact', name: 'contact', desc: 'get in touch', go: () => jump('#contact') },
        { id: 'resume', name: 'download resume', desc: 'pdf', go: () => { window.location.href = 'Harshit_Chaurasia_Resume.pdf'; } },
        { id: 'theme', name: 'toggle theme', desc: 'dark / light', go: toggleTheme },
        { id: 'email', name: 'email harshit', desc: 'outlook', go: () => { window.location.href = 'mailto:harshit1chaurasia@outlook.com'; } },
        { id: 'egg', name: 'sudo unlock zer0CO0L', desc: '???', go: showEgg }
    ];
    let activeIdx = 0, filtered = COMMANDS.slice();

    function jump(sel) {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
    function renderCmdk() {
        cmdkList.innerHTML = '';
        if (!filtered.length) {
            cmdkList.innerHTML = '<li class="cmdk-empty">no match - try "projects", "theme", "contact"</li>';
            return;
        }
        filtered.forEach((c, i) => {
            const li = document.createElement('li');
            li.className = 'cmdk-item' + (i === activeIdx ? ' active' : '');
            li.setAttribute('role', 'option');
            li.innerHTML = '<span class="ci-num">' + String(i + 1).padStart(2, '0') + '</span>' +
                '<span class="ci-name">' + c.name + '</span><span class="ci-desc">' + c.desc + '</span>';
            li.addEventListener('click', () => { closeCmdk(); c.go(); });
            li.addEventListener('mousemove', () => { if (activeIdx !== i) { activeIdx = i; renderCmdk(); } });
            cmdkList.appendChild(li);
        });
    }
    function openCmdk() {
        if (!cmdk) return;
        cmdk.hidden = false;
        cmdkInput.value = ''; filtered = COMMANDS.slice(); activeIdx = 0; renderCmdk();
        setTimeout(() => cmdkInput.focus(), 20);
    }
    function closeCmdk() { if (cmdk) cmdk.hidden = true; }
    function filterCmdk() {
        const q = cmdkInput.value.trim().toLowerCase();
        filtered = COMMANDS.filter(c => (c.name + ' ' + c.desc).toLowerCase().includes(q));
        activeIdx = 0; renderCmdk();
    }
    if (cmdkTrigger) cmdkTrigger.addEventListener('click', openCmdk);
    if (cmdk) {
        cmdk.querySelector('[data-cmdk-close]').addEventListener('click', closeCmdk);
        cmdkInput.addEventListener('input', filterCmdk);
        cmdkInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); renderCmdk(); scrollActive(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); renderCmdk(); scrollActive(); }
            else if (e.key === 'Enter') { e.preventDefault(); const c = filtered[activeIdx]; if (c) { closeCmdk(); c.go(); } }
            else if (e.key === 'Escape') { closeCmdk(); }
        });
    }
    function scrollActive() {
        const el = cmdkList.querySelector('.cmdk-item.active');
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    // =====================================================
    // EASTER EGG - zer0CO0L
    // =====================================================
    const egg = document.getElementById('egg');
    function showEgg() {
        if (!egg) return;
        egg.hidden = false;
        document.querySelectorAll('.id-alias').forEach(a => { a.textContent = '✪ zer0CO0L ♛'; a.classList.add('revealed'); });
    }
    function hideEgg() { if (egg) egg.hidden = true; }
    if (egg) egg.addEventListener('click', (e) => { if (e.target === egg || e.target.classList.contains('egg-scan')) hideEgg(); });
    document.querySelectorAll('#aliasReveal, #aliasReveal2').forEach(el => el.addEventListener('click', showEgg));

    // konami: ↑ ↑ ↓ ↓ ← → ← → b a
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kseq = [];

    // =====================================================
    // GLOBAL KEYBOARD
    // =====================================================
    document.addEventListener('keydown', (e) => {
        // command palette: ⌘K / Ctrl+K
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (cmdk && cmdk.hidden) openCmdk(); else closeCmdk();
            return;
        }
        const typing = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;

        if (e.key === 'Escape') {
            if (egg && !egg.hidden) { hideEgg(); return; }
            if (cmdk && !cmdk.hidden) { closeCmdk(); return; }
        }
        if (typing) return;

        // open palette with "/"
        if (e.key === '/') { e.preventDefault(); openCmdk(); return; }
        if (e.key === 't') { toggleTheme(); return; }

        // konami tracking
        kseq.push(e.key);
        kseq = kseq.slice(-KONAMI.length);
        if (kseq.join(',') === KONAMI.join(',')) { showEgg(); kseq = []; }
    });

})();
