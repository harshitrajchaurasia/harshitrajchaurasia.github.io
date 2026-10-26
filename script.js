// =========================================================
// Harshit Chaurasia - portfolio behaviour
// Theme, the skills <-> projects map, PII demo, GitHub stats.
// One IIFE, no modules, no dependencies.
// =========================================================

(function () {
    'use strict';
    const root = document.documentElement;

    // ---------- THEME ----------
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme-v2', next); } catch (e) {}
    });

    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Date().getFullYear();

    // ---------- SKILLS <-> PROJECTS ----------
    // The project cards are the source of truth: each tag carries its category in data-c.
    // The skills panel is built from those tags, so a skill can never be listed without a project.
    const CATS = [
        ['rpa', 'RPA & automation'],
        ['ml', 'AI & machine learning'],
        ['genai', 'GenAI & agents'],
        ['cloud', 'Cloud & data'],
        ['dev', 'Code & DevOps'],
        ['ent', 'Enterprise integration'],
        ['prac', 'Practice & delivery'],
    ];
    const catName = Object.fromEntries(CATS);

    const projectsEl = document.getElementById('projects');
    const groupsEl = document.getElementById('skillsGroups');
    const panel = document.getElementById('skillsPanel');
    const statusText = document.getElementById('skillsStatusText');
    const clearBtn = document.getElementById('clearFilter');
    const cards = projectsEl ? Array.from(projectsEl.querySelectorAll('.proj')) : [];
    const groups = projectsEl ? Array.from(projectsEl.querySelectorAll('.pgroup')) : [];
    const groupsBtn = document.getElementById('toggleGroups');
    const IDLE = 'Pick a skill to see where I used it';

    const skills = new Map();   // name -> { cat, cards: Set }
    cards.forEach(card => {
        const tags = card.querySelectorAll('.tags li');
        if (!tags.length) console.warn('Project has no skills:', card.querySelector('h4').textContent);
        card._skills = new Set();
        tags.forEach(li => {
            const name = li.textContent.trim(), cat = li.dataset.c;
            if (!catName[cat]) console.warn('Unknown category on tag:', name, cat);
            li.style.setProperty('--c', 'var(--' + cat + ')');
            card._skills.add(name);
            if (!skills.has(name)) skills.set(name, { cat, cards: new Set() });
            skills.get(name).cards.add(card);
        });
    });

    const skillBtns = new Map();  // name -> button
    const catBtns = new Map();    // cat -> button
    if (groupsEl) {
        CATS.forEach(([cat, label]) => {
            const names = [...skills.keys()]
                .filter(n => skills.get(n).cat === cat)
                .sort((a, b) => skills.get(b).cards.size - skills.get(a).cards.size || a.localeCompare(b));
            if (!names.length) return;
            const group = document.createElement('div');
            group.className = 'cat';
            group.style.setProperty('--c', 'var(--' + cat + ')');
            const head = document.createElement('button');
            head.type = 'button';
            head.className = 'cat-head';
            head.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-' + cat + '"/></svg>';
            head.append(label);
            head.setAttribute('aria-pressed', 'false');
            head.addEventListener('click', () => toggle({ type: 'cat', v: cat }));
            catBtns.set(cat, head);
            const list = document.createElement('div');
            list.className = 'cat-list';
            names.forEach(n => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'skill';
                b.setAttribute('aria-pressed', 'false');
                const count = skills.get(n).cards.size;
                b.setAttribute('aria-label', n + ', used in ' + count + (count === 1 ? ' project' : ' projects'));
                b.innerHTML = '<span></span><small></small>';
                b.firstChild.textContent = n;
                b.lastChild.textContent = count;
                b.addEventListener('click', () => toggle({ type: 'skill', v: n }));
                skillBtns.set(n, b);
                list.appendChild(b);
            });
            group.append(head, list);
            groupsEl.appendChild(group);
        });
    }

    let selected = null;   // null | { type: 'skill' | 'cat', v }
    function toggle(sel) {
        select(selected && selected.type === sel.type && selected.v === sel.v ? null : sel);
    }
    function select(sel) {
        selected = sel;
        let n = 0;
        cards.forEach(card => {
            let match = false;
            card.querySelectorAll('.tags li').forEach(li => {
                const hit = !!sel && (sel.type === 'skill' ? li.textContent.trim() === sel.v : li.dataset.c === sel.v);
                li.classList.toggle('hit', hit);
                if (hit) match = true;
            });
            card.classList.toggle('match', match);
            if (match) n++;
        });
        if (projectsEl) projectsEl.classList.toggle('filtering', !!sel);
        skillBtns.forEach((b, name) => b.setAttribute('aria-pressed', String(!!sel && sel.type === 'skill' && sel.v === name)));
        catBtns.forEach((b, cat) => b.setAttribute('aria-pressed', String(!!sel && sel.type === 'cat' && sel.v === cat)));
        if (statusText) {
            const label = sel && (sel.type === 'skill' ? sel.v : catName[sel.v]);
            statusText.textContent = !sel ? IDLE : label + ': ' + n + (n === 1 ? ' project' : ' projects');
        }
        if (clearBtn) clearBtn.hidden = !sel;
        // a match inside a closed area would be invisible, so open every area that has one
        if (sel) groups.forEach(g => { if (g.querySelector('.proj.match')) g.open = true; });
    }
    if (clearBtn) clearBtn.addEventListener('click', () => select(null));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && selected) select(null); });

    // reverse direction: pointing at (or focusing) a project lights up its skills in the panel
    function light(card) {
        if (!panel) return;
        panel.classList.toggle('hovering', !!card);
        skillBtns.forEach((b, name) => b.classList.toggle('lit', !!card && card._skills.has(name)));
    }
    cards.forEach(card => {
        card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') light(card); });
        card.addEventListener('pointerleave', () => light(null));
        card.addEventListener('focusin', () => light(card));
        card.addEventListener('focusout', () => light(null));
        // clicking a tag on a card selects that skill everywhere
        card.querySelectorAll('.tags li').forEach(li => {
            li.addEventListener('click', () => toggle({ type: 'skill', v: li.textContent.trim() }));
        });
    });

    // ---------- PROJECT AREAS (collapsible <details>) ----------
    // a closed area still lists its project names; picking one opens the area and scrolls to that card
    groups.forEach(g => {
        const peek = document.createElement('span');
        peek.className = 'pgroup-peek';
        g.querySelectorAll('.proj').forEach(card => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.textContent = card.querySelector('h4').textContent;
            // the card's headline number (40+, 160K+ ...) rides along so results show while closed
            const num = card.querySelector('.proj-result strong');
            if (num) {
                const b = document.createElement('b');
                b.textContent = num.textContent;
                chip.appendChild(b);
            }
            chip.style.setProperty('--c', card.style.getPropertyValue('--c'));
            chip.addEventListener('click', e => {
                e.preventDefault();   // a click inside <summary> would otherwise toggle the area
                const go = (tries = 0) => {
                    // the opening transition keeps the cards hidden for its first frame; retry until shown
                    if (card.checkVisibility && !card.checkVisibility() && tries < 30) {
                        requestAnimationFrame(() => go(tries + 1));
                        return;
                    }
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.focus({ preventScroll: true });
                };
                // a closed area's cards can't take focus yet; 'toggle' fires once it has opened
                if (g.open) go();
                else { g.addEventListener('toggle', () => go(), { once: true }); g.open = true; }
            });
            peek.appendChild(chip);
        });
        g.querySelector('summary').appendChild(peek);
        g.addEventListener('toggle', syncGroupsBtn);
    });
    function syncGroupsBtn() {
        if (groupsBtn) groupsBtn.textContent = groups.every(g => g.open) ? 'Collapse all' : 'Expand all';
    }
    if (groupsBtn) groupsBtn.addEventListener('click', () => {
        const open = !groups.every(g => g.open);
        groups.forEach(g => { g.open = open; });
    });
    syncGroupsBtn();

    // hero spectrum segments jump to the work section with that area selected
    document.querySelectorAll('[data-jump-cat]').forEach(a => {
        a.addEventListener('click', () => select({ type: 'cat', v: a.dataset.jumpCat }));
    });

    // ---------- GITHUB ACTIVITY ----------
    // github-stats.json is refreshed nightly; keys: contributions, streak, repos, since, updated
    (function ghActivity() {
        const box = document.getElementById('ghStats');
        if (!box) return;
        fetch('github-stats.json', { cache: 'no-cache' })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d => {
                if (!d || !d.updated) return;     // no real data yet -> stay hidden
                box.querySelectorAll('[data-gh]').forEach(el => {
                    const v = d[el.getAttribute('data-gh')];
                    // a missing value or a 0 streak reads as a negative; hide that tile instead
                    if (v === undefined || v === null || v === 0) { el.closest('.gh-stat').hidden = true; return; }
                    el.textContent = (typeof v === 'number') ? v.toLocaleString() : v;
                });
                box.hidden = false;
            })
            .catch(() => { /* offline or missing -> panel stays hidden */ });
    })();

    // ---------- PII DEMO ----------
    const PII_APP = 'https://pii-shield-49982461185.us-central1.run.app';
    const piiInput = document.getElementById('piiInput');
    const piiOutput = document.getElementById('piiOutput');
    const piiBtn = document.getElementById('piiRedactBtn');
    const piiStats = document.getElementById('piiStats');

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function highlightMasks(text) {
        return escapeHtml(text).replace(/\[[A-Z0-9_ ]+\]/g, m => '<span class="pii-mask">' + m + '</span>');
    }
    async function runPii() {
        const text = piiInput.value.trim();
        if (!text) { piiInput.focus(); return; }
        piiBtn.disabled = true;
        piiBtn.textContent = 'Redacting...';
        piiStats.textContent = '';
        try {
            const res = await fetch(PII_APP + '/api/redact-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, fast_mode: false })
            });
            if (!res.ok) throw new Error('api');
            const data = await res.json();
            piiOutput.innerHTML = highlightMasks(data.redacted_text || '') || 'No personal details found, so nothing was redacted.';
            piiStats.textContent = (data.redaction_count || 0) + ' redactions in ' + (data.processing_time_ms || 0).toFixed(0) + ' ms';
        } catch (err) {
            piiOutput.innerHTML = 'The demo server is starting up. Try again in a few seconds, or <a href="' + PII_APP + '" target="_blank" rel="noopener">open the full app</a>.';
        } finally {
            piiBtn.disabled = false;
            piiBtn.textContent = 'Redact';
        }
    }
    if (piiBtn && piiInput && piiOutput) {
        piiBtn.addEventListener('click', runPii);
        piiInput.addEventListener('keydown', e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); runPii(); }
        });
    }
})();
