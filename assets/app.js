/* ==========================================================================
   3-Month Training Plan — interactivity
   - Per-exercise set tracking (localStorage, reset weekly-friendly per page)
   - Floating rest timer with presets + beep
   - Scroll reveal
   - Service worker registration (offline / installable)
   ========================================================================== */
(function () {
  'use strict';

  /* ----- helpers -------------------------------------------------------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const fmtW = n => (Math.round(n * 100) / 100).toString();
  const today = () => new Date().toISOString().slice(0, 10);

  /* ----- scroll reveal -------------------------------------------------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || !els.length) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    els.forEach((e, i) => { e.style.transitionDelay = Math.min(i * 60, 360) + 'ms'; io.observe(e); });
  }

  /* ----- set tracker ---------------------------------------------------- */
  function initTracker() {
    const list = $('#exlist');
    if (!list) return;
    const key = 'sets:' + (document.body.dataset.day || location.pathname);
    let state = store.get(key, {});

    const bar   = $('#progressFill');
    const label = $('#progressText');

    function totalSets() {
      return $$('.ex', list).reduce((n, ex) => n + $$('.set-dot', ex).length, 0);
    }
    function doneSets() {
      return Object.values(state).reduce((n, arr) => n + (arr ? arr.filter(Boolean).length : 0), 0);
    }
    function refresh() {
      $$('.ex', list).forEach(ex => {
        const dots = $$('.set-dot', ex);
        const allOn = dots.length && dots.every(d => d.classList.contains('on'));
        ex.classList.toggle('done', !!allOn);
      });
      const t = totalSets(), d = doneSets();
      const pct = t ? Math.round(d / t * 100) : 0;
      if (bar)   bar.style.width = pct + '%';
      if (label) label.innerHTML = `<b>${d}/${t}</b> مجموعة • ${pct}%`;
    }

    $$('.ex', list).forEach((ex, ei) => {
      const dots = $$('.set-dot', ex);
      const saved = state[ei] || [];
      dots.forEach((dot, di) => {
        if (saved[di]) dot.classList.add('on');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        const toggle = () => {
          dot.classList.toggle('on');
          state[ei] = dots.map(x => x.classList.contains('on'));
          store.set(key, state);
          refresh();
          // auto-open rest timer when a set is completed
          if (dot.classList.contains('on') && window.RestTimer) window.RestTimer.start();
        };
        dot.addEventListener('click', toggle);
        dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      });
    });

    const resetBtn = $('#resetSets');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      state = {};
      store.set(key, state);
      $$('.set-dot', list).forEach(d => d.classList.remove('on'));
      refresh();
    });

    refresh();
  }

  /* ----- rest timer ----------------------------------------------------- */
  function initTimer() {
    if (!document.body.classList.contains('has-timer')) return;

    const DEFAULT = store.get('restDefault', 90);
    let remaining = DEFAULT, tick = null, total = DEFAULT;

    const fab = document.createElement('button');
    fab.className = 'timer-fab'; fab.title = 'مؤقّت الراحة'; fab.setAttribute('aria-label', 'مؤقّت الراحة');
    fab.innerHTML = clockSVG();

    const box = document.createElement('div');
    box.className = 'timer';
    box.innerHTML =
      '<div class="t-head"><span>مؤقّت الراحة</span><button class="t-close" aria-label="إغلاق">×</button></div>' +
      '<div class="t-time" id="tTime">1:30</div>' +
      '<div class="t-row"><button id="tToggle">ابدأ</button><button id="tReset">صفّر</button></div>' +
      '<div class="t-presets"><button data-s="60">60</button><button data-s="90">90</button><button data-s="120">120</button></div>';

    document.body.append(fab, box);

    const elTime  = $('#tTime', box);
    const elTog   = $('#tToggle', box);
    const elReset = $('#tReset', box);

    const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    function render() {
      elTime.textContent = fmt(Math.max(remaining, 0));
      elTime.classList.toggle('warn', remaining <= 10);
    }
    function stop() { clearInterval(tick); tick = null; elTog.textContent = 'ابدأ'; }
    function run() {
      stop(); elTog.textContent = 'إيقاف';
      tick = setInterval(() => {
        remaining--;
        render();
        if (remaining <= 0) { stop(); remaining = total; render(); beep(); vibrate(); }
      }, 1000);
    }
    function open() { box.classList.add('open'); fab.style.display = 'none'; }
    function close() { box.classList.remove('open'); fab.style.display = 'grid'; }

    fab.addEventListener('click', open);
    $('.t-close', box).addEventListener('click', () => { stop(); close(); });
    elTog.addEventListener('click', () => (tick ? stop() : run()));
    elReset.addEventListener('click', () => { stop(); remaining = total; render(); });
    $$('.t-presets button', box).forEach(b => b.addEventListener('click', () => {
      total = remaining = +b.dataset.s; store.set('restDefault', total); render();
      if (!tick) run();
    }));

    render();

    // public API used by the tracker
    window.RestTimer = {
      start() { open(); total = store.get('restDefault', DEFAULT); remaining = total; run(); }
    };

    function beep() {
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.type = 'sine'; o.frequency.value = 880;
        g.gain.setValueAtTime(.001, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(.3, ac.currentTime + .02);
        g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .6);
        o.start(); o.stop(ac.currentTime + .62);
      } catch {}
    }
    function vibrate() { if (navigator.vibrate) navigator.vibrate([120, 60, 120]); }
    function clockSVG() {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6"/></svg>';
    }
  }

  /* ----- theme (light / dark) ------------------------------------------- */
  function initTheme() {
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const btn  = $('#themeToggle');

    const sunSVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>';
    const moonSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>';
    const prefersLight = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const effective = () => root.dataset.theme || (prefersLight() ? 'light' : 'dark');

    function paint() {
      const mode = effective();
      if (btn) {
        btn.innerHTML = mode === 'light' ? moonSVG : sunSVG; // icon = mode you switch TO
        const label = mode === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل الوضع النهاري';
        btn.setAttribute('aria-label', label);
        btn.title = label;
      }
      if (meta) meta.setAttribute('content', mode === 'light' ? '#f7f9fb' : '#0b1a2b');
    }

    if (btn) btn.addEventListener('click', () => {
      const next = effective() === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      store.set('theme', next);
      paint();
    });

    // follow OS changes only while the user hasn't made an explicit choice
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const onChange = () => { if (store.get('theme', null) == null) paint(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    paint();
  }

  /* ----- per-exercise weight log (progress tracing) --------------------- */
  function initWeights() {
    const day = document.body.dataset.day || (location.pathname.split('/').pop() || 'page');
    $$('#exlist .ex').forEach((ex, i) => {
      const input = $('.w-input', ex);
      if (!input) return;
      const elLast  = $('.w-last', ex);
      const elBest  = $('.w-best', ex);
      const elDelta = $('.w-delta', ex);
      const key = 'weightlog:' + day + '-' + (i + 1);

      const sorted = () => store.get(key, []).slice().sort((a, b) => b.d.localeCompare(a.d));

      function render() {
        const arr  = sorted();
        const td   = today();
        const cur  = arr.find(e => e.d === td);          // today's logged entry (if any)
        const prev = arr.find(e => e.d !== td);          // most recent previous session
        const best = arr.reduce((m, e) => Math.max(m, e.w), 0);

        if (cur && document.activeElement !== input) input.value = cur.w;

        if (elLast) elLast.innerHTML = prev ? `آخر <b>${fmtW(prev.w)}</b>` : 'آخر —';
        if (elBest) elBest.innerHTML = best > 0 ? `أفضل <b>${fmtW(best)}</b>` : 'أفضل —';

        const now = cur ? cur.w : (input.value !== '' && !isNaN(parseFloat(input.value)) ? parseFloat(input.value) : null);
        if (elDelta) {
          if (now != null && prev) {
            const d = +(now - prev.w).toFixed(2);
            if (d > 0)      { elDelta.textContent = '▲ ' + fmtW(d); elDelta.className = 'w-delta up'; }
            else if (d < 0) { elDelta.textContent = '▼ ' + fmtW(-d); elDelta.className = 'w-delta down'; }
            else            { elDelta.textContent = '='; elDelta.className = 'w-delta'; }
          } else {
            elDelta.textContent = ''; elDelta.className = 'w-delta';
          }
        }
      }

      function save() {
        const td = today();
        let arr = store.get(key, []).filter(e => e.d !== td);
        const v = parseFloat(input.value);
        if (input.value !== '' && !isNaN(v) && v >= 0) arr.push({ d: td, w: v });
        arr.sort((a, b) => b.d.localeCompare(a.d));
        store.set(key, arr.slice(0, 60));
        render();
      }

      input.addEventListener('change', save);
      input.addEventListener('blur', save);
      render();
    });
  }

  /* ----- exercise media catalogue --------------------------------------- */
  // animation: local GIF from hasaneyldrm/exercises-dataset (primary — plays animated)
  // thumbnail: local JPG still from same dataset (shown while GIF loads or as fallback)
  // source:    YouTube video link already in the HTML (final network fallback)
  function _yt(id) { return 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'; }

  const EXERCISE_MEDIA = {
    'push-1':  { animation: '/exercises/animations/chest-hammer-press.gif',     thumbnail: '/exercises/thumbnails/chest-hammer-press.jpg',     source: _yt('RzXnpxAsvYY'), alt: 'صدر همر مستوي' },
    'push-2':  { animation: '/exercises/animations/chest-fly-machine.gif',       thumbnail: '/exercises/thumbnails/chest-fly-machine.jpg',       source: _yt('Q25jB9kp7vM'), alt: 'صدر فلاي جهاز' },
    'push-3':  { animation: '/exercises/animations/cable-lateral-raise.gif',     thumbnail: '/exercises/thumbnails/cable-lateral-raise.jpg',     source: _yt('3Hf7-okifIQ'), alt: 'أكتاف جانبي رفرفة بالكيبل' },
    'push-4':  { animation: '/exercises/animations/cable-tricep-pushdown.gif',   thumbnail: '/exercises/thumbnails/cable-tricep-pushdown.jpg',   source: _yt('Eprlq_sCimA'), alt: 'تراي كيبل بالحبل' },
    'pull-1':  { animation: '/exercises/animations/lat-pulldown.gif',            thumbnail: '/exercises/thumbnails/lat-pulldown.jpg',            source: _yt('Y9sEdMLcnpg'), alt: 'سحب ظهر علوي' },
    'pull-2':  { animation: '/exercises/animations/t-bar-row.gif',               thumbnail: '/exercises/thumbnails/t-bar-row.jpg',               source: _yt('uxAiZ5XMC8Q'), alt: 'تي بار واسع' },
    'pull-3':  { animation: '/exercises/animations/rear-delt-machine.gif',       thumbnail: '/exercises/thumbnails/rear-delt-machine.jpg',       source: _yt('hQbOzBU0X8U'), alt: 'كتف خلفي جهاز' },
    'pull-4':  { animation: '/exercises/animations/seated-alternating-curl.gif', thumbnail: '/exercises/thumbnails/seated-alternating-curl.jpg', source: _yt('ogRAOsdzuGQ'), alt: 'باي تبادل جالس' },
    'legs-1':  { animation: '/exercises/animations/hack-squat.gif',              thumbnail: '/exercises/thumbnails/hack-squat.jpg',              source: _yt('tb5KeF00yII'), alt: 'هاك سكوات' },
    'legs-2':  { animation: '/exercises/animations/bulgarian-split-squat.gif',   thumbnail: '/exercises/thumbnails/bulgarian-split-squat.jpg',   source: _yt('JhJDKw-mVKY'), alt: 'بلغيريان سكوات' },
    'legs-3':  { animation: '/exercises/animations/lying-leg-curl.gif',          thumbnail: '/exercises/thumbnails/lying-leg-curl.jpg',          source: _yt('7GuwkODf9SU'), alt: 'خلفي جهاز نائم' },
    'legs-4':  { animation: '/exercises/animations/seated-calf-raise.gif',       thumbnail: '/exercises/thumbnails/seated-calf-raise.jpg',       source: _yt('JxM9Kg7q3j4'), alt: 'بطّات جالس' },
    'upper-1': { animation: '/exercises/animations/upper-chest-hammer.gif',      thumbnail: '/exercises/thumbnails/upper-chest-hammer.jpg',      source: _yt('iEFJOYxwrJo'), alt: 'جهاز همر صدر علوي' },
    'upper-2': { animation: '/exercises/animations/single-arm-pulldown.gif',     thumbnail: '/exercises/thumbnails/single-arm-pulldown.jpg',     source: _yt('QY1Pz-7P9r8'), alt: 'سحب علوي فردي' },
    'upper-3': { animation: '/exercises/animations/lateral-raise-machine.gif',   thumbnail: '/exercises/thumbnails/lateral-raise-machine.jpg',   source: _yt('FUsmRA2Ljoo'), alt: 'كتف جانبي دفع' },
    'upper-4': { animation: '/exercises/animations/arm-superset.gif',            thumbnail: '/exercises/thumbnails/arm-superset.jpg',            source: _yt('99m0NJORe24'), alt: 'سوبر ست ذراع' },
    // added exercises (5–6 per day) from the same dataset
    'push-5':  { animation: '/exercises/animations/incline-dumbbell-press.gif',  thumbnail: '/exercises/thumbnails/incline-dumbbell-press.jpg',  alt: 'بنش علوي دمبل' },
    'push-6':  { animation: '/exercises/animations/overhead-tricep-extension.gif', thumbnail: '/exercises/thumbnails/overhead-tricep-extension.jpg', alt: 'تراي علوي بالحبل' },
    'pull-5':  { animation: '/exercises/animations/seated-cable-row.gif',         thumbnail: '/exercises/thumbnails/seated-cable-row.jpg',         alt: 'تجديف كيبل جالس' },
    'pull-6':  { animation: '/exercises/animations/face-pull.gif',               thumbnail: '/exercises/thumbnails/face-pull.jpg',               alt: 'فيس بُل بالحبل' },
    'legs-5':  { animation: '/exercises/animations/leg-extension.gif',           thumbnail: '/exercises/thumbnails/leg-extension.jpg',           alt: 'تمديد أمامي جهاز' },
    'legs-6':  { animation: '/exercises/animations/romanian-deadlift.gif',       thumbnail: '/exercises/thumbnails/romanian-deadlift.jpg',       alt: 'رفعة رومانية' },
    'upper-5': { animation: '/exercises/animations/chest-dip.gif',               thumbnail: '/exercises/thumbnails/chest-dip.jpg',               alt: 'غطس صدر' },
    'upper-6': { animation: '/exercises/animations/preacher-curl.gif',           thumbnail: '/exercises/thumbnails/preacher-curl.jpg',           alt: 'باي بريتشر دمبل' },
  };

  /* ----- exercise animation previews ------------------------------------ */
  function initPreviews() {
    if (!$('#exlist')) return;
    const day = document.body.dataset.day || location.pathname.split('/').pop().replace('.html', '');

    $$('#exlist .ex').forEach((ex, i) => {
      const media     = EXERCISE_MEDIA[day + '-' + (i + 1)] || {};
      const animSrc   = media.animation || null;  // local GIF (primary)
      const thumbSrc  = media.thumbnail || null;  // local JPG still (fast placeholder)
      const sourceSrc = media.source    || null;  // YouTube thumbnail (network fallback)
      const firstSrc  = animSrc || thumbSrc || sourceSrc;
      const alt       = media.alt || (ex.querySelector('h3') || {}).textContent || '';

      const wrap = document.createElement('div');
      wrap.className = 'ex-preview';

      const skeleton = document.createElement('div');
      skeleton.className = 'ex-preview-skeleton';

      const fallback = document.createElement('div');
      fallback.className = 'ex-preview-fallback';
      fallback.innerHTML = _previewIcon() + '<span>لا صورة</span>';

      if (firstSrc) {
        const img = document.createElement('img');
        img.className = 'ex-preview-img';
        img.alt = alt;
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        // stage: 0=GIF 1=local JPG 2=YouTube 3=give up
        let stage = animSrc ? 0 : (thumbSrc ? 1 : 2);

        img.addEventListener('load', () => {
          img.classList.add('loaded');
          skeleton.classList.add('hidden');
        });
        img.addEventListener('error', () => {
          stage++;
          if (stage === 1 && thumbSrc)  { img.src = thumbSrc;  return; }
          if (stage === 2 && sourceSrc) { img.src = sourceSrc; return; }
          img.classList.add('hidden');
          skeleton.classList.add('hidden');
          fallback.classList.add('visible');
        });

        img.src = firstSrc;
        wrap.append(skeleton, img, fallback);
      } else {
        fallback.classList.add('visible');
        wrap.append(fallback);
      }

      // Insert between .ex-num and .ex-body (grid column 2)
      const exNum = ex.querySelector('.ex-num');
      if (exNum) exNum.insertAdjacentElement('afterend', wrap);
      else ex.prepend(wrap);
    });
  }

  function _previewIcon() {
    return '<svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><rect x="78" y="216" width="40" height="80" rx="12"/><rect x="122" y="186" width="44" height="140" rx="14"/><rect x="346" y="186" width="44" height="140" rx="14"/><rect x="394" y="216" width="40" height="80" rx="12"/><rect x="166" y="240" width="180" height="32" rx="16"/></svg>';
  }

  /* ----- InBody manual entry (editable + localStorage) ------------------ */
  function initInbody() {
    if (document.body.dataset.day !== 'inbody') return;
    const KEY = 'inbody:data';
    const fields = $$('[data-ib]');
    if (!fields.length) return;

    const defaults = {};
    fields.forEach(f => { defaults[f.dataset.ib] = f.textContent.trim(); });

    const stamp = () => {
      const d = new Date();
      return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
    };
    const setDate = txt => $$('[data-ib-date]').forEach(e => e.textContent = txt);
    function syncRing() {
      const s = $('[data-ib="score"]');
      if (!s) return;
      const ring = s.closest('.score-ring');
      if (ring) ring.style.setProperty('--p', Math.max(0, Math.min(100, parseFloat(s.textContent) || 0)));
    }
    function restore(data) {
      fields.forEach(f => { const v = data[f.dataset.ib]; if (v != null && v !== '') f.textContent = v; });
    }
    function save() {
      const data = {};
      fields.forEach(f => { data[f.dataset.ib] = f.textContent.replace(/\s+/g, ' ').trim(); });
      data._date = stamp();
      store.set(KEY, data);
      syncRing(); setDate(data._date);
    }

    const saved = store.get(KEY, {});
    if (saved && Object.keys(saved).length) { restore(saved); setDate(saved._date || stamp()); }
    else setDate('—');
    syncRing();

    fields.forEach(f => {
      f.addEventListener('blur', save);
      f.addEventListener('input', syncRing);
      f.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); f.blur(); } });
    });

    const saveBtn = $('#ibSave');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      save();
      saveBtn.textContent = 'تم الحفظ ✓';
      setTimeout(() => { saveBtn.textContent = 'حفظ القياس'; }, 1600);
    });
    const resetBtn = $('#ibReset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      restore(defaults); store.set(KEY, {}); syncRing(); setDate('—');
    });
  }

  /* ----- active nav link ------------------------------------------------ */
  function initNav() {
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === here) a.classList.add('active');
    });
  }

  /* ----- service worker ------------------------------------------------- */
  function initSW() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
  }

  /* ----- boot ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme(); initNav(); initReveal(); initTracker(); initWeights(); initPreviews(); initInbody(); initTimer(); initSW();
  });
})();
