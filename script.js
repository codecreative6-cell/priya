/* ── DEVICE / PREFERENCE DETECTION ──
   Read once at load. Used to scale particle counts, skip cursor-follow
   logic on touch devices, and respect the OS "reduce motion" setting. */
const mqFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const mqReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isTouchDevice = !mqFinePointer.matches;
const prefersReducedMotion = mqReducedMotion.matches;
const isSmallScreen = window.innerWidth < 768;
const DPR = Math.min(window.devicePixelRatio || 1, 2); // cap to keep big phone screens fast

function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ── HERO CANVAS ── */
try {
  const hCvs = document.getElementById('heroCanvas');
  if (hCvs) {
    const hCtx = hCvs.getContext('2d');
    let heroW = 0, heroH = 0;

    function resizeHero() {
      const rect = hCvs.getBoundingClientRect();
      heroW = rect.width;
      heroH = rect.height;
      hCvs.width = Math.max(1, Math.round(heroW * DPR));
      hCvs.height = Math.max(1, Math.round(heroH * DPR));
      hCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resizeHero();
    window.addEventListener('resize', debounce(resizeHero, 150));

    const STAR_COUNT = isSmallScreen ? 90 : 230;
    const SPARKLE_COUNT = isSmallScreen ? 14 : 32;

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + .25,
      phase: Math.random() * Math.PI * 2, spd: Math.random() * .007 + .003
    }));
    const sparkles = Array.from({ length: SPARKLE_COUNT }, () => ({
      x: Math.random(), y: Math.random(), sz: Math.random() * 4 + 1.5,
      vx: (Math.random() - .5) * .00022, vy: -(Math.random() * .00042 + .00018),
      rot: Math.random() * Math.PI * 2, rs: (Math.random() - .5) * .042, hue: Math.random() * 65 + 268
    }));
    let hT = 0;
    function drawHero() {
      const W = heroW, H = heroH;
      hCtx.clearRect(0, 0, W, H); hT += .01;
      stars.forEach(s => {
        const a = .2 + .8 * Math.abs(Math.sin(hT * s.spd * 6 + s.phase));
        hCtx.fillStyle = `rgba(225,215,255,${a})`;
        hCtx.beginPath(); hCtx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); hCtx.fill();
      });
      sparkles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rs;
        if (p.y < -.04) { p.y = 1.04; p.x = Math.random(); }
        if (p.x < -.02) p.x = 1.02; if (p.x > 1.02) p.x = -.02;
        hCtx.save(); hCtx.translate(p.x * W, p.y * H); hCtx.rotate(p.rot);
        hCtx.fillStyle = `hsla(${p.hue},62%,72%,.52)`;
        hCtx.beginPath(); hCtx.moveTo(0, -p.sz); hCtx.lineTo(p.sz * .42, 0);
        hCtx.lineTo(0, p.sz); hCtx.lineTo(-p.sz * .42, 0); hCtx.closePath(); hCtx.fill(); hCtx.restore();
      });
      if (!prefersReducedMotion) requestAnimationFrame(drawHero);
    }
    drawHero();
  }
} catch (err) { console.error('Hero canvas init failed:', err); }

/* ── PARTICLES ── */
try {
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H; const pts = [];
    const PARTICLE_COUNT = isSmallScreen ? 35 : 80;
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.max(1, Math.round(W * DPR));
      canvas.height = Math.max(1, Math.round(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize(); window.addEventListener('resize', debounce(resize, 150));
    for (let i = 0; i < PARTICLE_COUNT; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .3, dx: (Math.random() - .5) * .3, dy: (Math.random() - .5) * .3, alpha: Math.random() * .5 + .1, pulse: Math.random() * Math.PI * 2, color: ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8'][Math.floor(Math.random() * 5)] });
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.dx; p.y += p.dy; p.pulse += .02;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const a = p.alpha * (0.5 + Math.sin(p.pulse) * .5);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = a; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = a * .15; ctx.fill();
      });
      ctx.globalAlpha = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(176,122,232,${.06 * (1 - d / 120)})`; ctx.lineWidth = .5; ctx.stroke(); }
        }
      }
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }
    draw();
  }
} catch (err) { console.error('Particles init failed:', err); }

/* ── CONFETTI ── */
function launchConfetti() {
  try {
    const canvas = document.getElementById('confetti');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * DPR));
    canvas.height = Math.max(1, Math.round(h * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const colors = ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8', '#7AE8A0'];
    const count = isSmallScreen ? 90 : 200;
    const pieces = [];
    for (let i = 0; i < count; i++) pieces.push({ x: Math.random() * w, y: Math.random() * h - h, w: Math.random() * 10 + 4, h: Math.random() * 6 + 2, color: colors[Math.floor(Math.random() * colors.length)], vy: Math.random() * 3 + 2, vx: (Math.random() - .5) * 2, rotation: Math.random() * 360, rotSpeed: (Math.random() - .5) * 8, opacity: 1 });
    let frame = 0;
    function anim() {
      ctx.clearRect(0, 0, w, h); frame++;
      pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed; if (frame > 120) p.opacity -= .005; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180); ctx.globalAlpha = Math.max(0, p.opacity); ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (pieces.some(p => p.opacity > 0 && p.y < h + 50)) requestAnimationFrame(anim);
    }
    anim();
  } catch (err) { console.error('Confetti failed:', err); }
}
window.addEventListener('resize', debounce(() => {
  const c = document.getElementById('confetti');
  if (c) {
    const w = window.innerWidth, h = window.innerHeight;
    c.width = Math.max(1, Math.round(w * DPR));
    c.height = Math.max(1, Math.round(h * DPR));
    const cctx = c.getContext('2d');
    if (cctx) cctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
}, 150));

/* ── PETALS ── */
function spawnPetals() {
  try {
    const count = isSmallScreen ? 14 : 25;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div'); p.className = 'petal';
      const colors = ['#E86A92', '#B07AE8', '#F4A0B8', '#F0C850'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.setProperty('--pd', (Math.random() * 8 + 8) + 's');
      p.style.setProperty('--delay', (Math.random() * 6) + 's');
      p.style.setProperty('--px', (Math.random() * 100 - 50) + 'px');
      p.style.width = (Math.random() * 10 + 8) + 'px'; p.style.height = (Math.random() * 10 + 8) + 'px'; p.style.opacity = '0';
      document.body.appendChild(p); setTimeout(() => p.remove(), 20000);
    }
  } catch (err) { console.error('Petals failed:', err); }
}

/* ── LOADING SCREEN SEQUENCE ──
   A redundant failsafe also lives inline in <head> (index.html) so the
   overlay can never get stuck covering the page if anything below fails. */
window.addEventListener('load', () => {
  try {
    const screen = document.getElementById('loadScreen');
    if (!screen) return;

    // Hold for 3 s so the full staggered text + wreath animation plays through
    setTimeout(() => {
      screen.classList.add('hide');          // fade out
      setTimeout(() => screen.remove(), 950); // remove from DOM after fade
      // Reveal hero elements after overlay is gone
      setTimeout(() => {
        const hint = document.getElementById('scrollHint');
        if (hint) hint.classList.add('vis');
        launchConfetti();
        spawnPetals();
      }, 1000);
    }, prefersReducedMotion ? 400 : 3000);
  } catch (err) { console.error('Load sequence failed:', err); }
});

/* ── SCROLL REVEAL ── */
try {
  const revealObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: .15, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => revealObs.observe(el));
} catch (err) { console.error('Scroll reveal init failed:', err); }

/* ── VISUALIZER ── */
try {
  const c = document.getElementById('visualizer');
  if (c) {
    const n = isSmallScreen ? 36 : 60, colors = ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const b = document.createElement('div'); b.className = 'viz-bar';
      b.style.cssText = `--vh-min:${Math.random() * 10 + 5}px;--vh-max:${Math.random() * 55 + 15}px;--vd:${Math.random() * .8 + .4}s;background:${colors[i % colors.length]};box-shadow:0 0 8px ${colors[i % colors.length]}40;animation-delay:${Math.random() * -2}s;`;
      frag.appendChild(b);
    }
    c.appendChild(frag);
  }
} catch (err) { console.error('Visualizer init failed:', err); }

/* ── CANDLE BLOW-OUT ── */
let blown = false;
function spawnSmoke(flameEl) {
  try {
    const rect = flameEl.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('div');
      const sdx = ((Math.random() - .5) * 32).toFixed(1);
      s.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + 4}px;width:5px;height:5px;border-radius:50%;background:rgba(200,195,230,.42);pointer-events:none;z-index:600;--sdx:${sdx}px;animation:smokeUp 1.3s ease forwards;animation-delay:${i * .14}s;`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 1500 + i * 150);
    }
  } catch (err) { console.error('Smoke effect failed:', err); }
}
function fireConfetti() { launchConfetti(); }
function blowOut() {
  try {
    if (blown) return; blown = true;
    const btn = document.getElementById('blowBtn');
    if (btn) btn.disabled = true;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const f = document.getElementById(`flame-${i}`);
        if (!f) return; spawnSmoke(f); f.classList.add('out');
      }, i * 210);
    }
    setTimeout(() => {
      const wish = document.getElementById('wishText');
      if (wish) wish.classList.add('show');
      fireConfetti();
    }, 5 * 210 + 450);
  } catch (err) { console.error('Blow-out failed:', err); }
}

/* ── TYPEWRITER LETTER ── */
try {
  const letterText = `You document everything — the mornings, the playlists, the random thoughts, the places you go, the feelings you can't quite name. And somehow, in doing that, you've let an entire world into yours. You didn't just <em>make content.</em> You made people feel less alone on a Tuesday.<br><br>221K hearts on one video is just the universe agreeing with what the rest of us already knew. <em>You are the kind of person the camera loves</em> — not because of how you look, but because of how real you are.<br><br>This year, may your twenties get louder, your reels hit harder, your world get bigger. The world is catching up, Priya. It was always a matter of time. 🌸`;
  let letterTyped = false;
  const letterBody = document.getElementById('letterBody');
  const letterCard = document.querySelector('.letter-card');

  function typeWriter(html, element, speed = 15) {
    if (prefersReducedMotion) {
      element.innerHTML = html;
      return;
    }
    let i = 0, output = '', inTag = false;
    function type() {
      if (i < html.length) {
        const char = html[i];
        if (char === '<') inTag = true;
        if (inTag) { let tag = ''; while (i < html.length) { tag += html[i]; if (html[i] === '>') { i++; inTag = false; break; } i++; } output += tag; element.innerHTML = output + '<span class="typewriter-cursor"></span>'; setTimeout(type, 0); }
        else { output += char; i++; element.innerHTML = output + '<span class="typewriter-cursor"></span>'; setTimeout(type, speed); }
      } else { setTimeout(() => { const c = element.querySelector('.typewriter-cursor'); if (c) c.remove(); }, 2000); }
    }
    type();
  }

  if (letterBody && letterCard) {
    const letterObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting && !letterTyped) { letterTyped = true; typeWriter(letterText, letterBody, 18); } }); }, { threshold: .3 });
    letterObs.observe(letterCard);
  }
} catch (err) { console.error('Letter typewriter init failed:', err); }

/* ── CAROUSEL ── */
try {
  const items = document.querySelectorAll('.carousel-item');
  const cContainer = document.getElementById('carousel');
  if (items.length && cContainer) {
    let activeIdx = Math.floor(items.length / 2);
    function updateCarousel() {
      items.forEach((item, i) => {
        item.className = 'carousel-item';
        let diff = (i - activeIdx) % items.length;
        if (diff < -items.length / 2) diff += items.length;
        if (diff > items.length / 2) diff -= items.length;
        if (diff === 0) item.classList.add('active');
        else if (diff === -1) item.classList.add('prev');
        else if (diff === 1) item.classList.add('next');
        else if (diff === -2) item.classList.add('prev-2');
        else if (diff === 2) item.classList.add('next-2');
      });
    }
    items.forEach((item, i) => item.addEventListener('click', () => { activeIdx = i; updateCarousel(); }));
    updateCarousel();

    const spinDelay = 2500;
    let spinInterval = prefersReducedMotion ? null : setInterval(() => { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); }, spinDelay);

    function pauseSpin() { if (spinInterval) { clearInterval(spinInterval); spinInterval = null; } }
    function resumeSpin() { if (!spinInterval && !prefersReducedMotion) spinInterval = setInterval(() => { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); }, spinDelay); }

    cContainer.addEventListener('mouseenter', pauseSpin);
    cContainer.addEventListener('mouseleave', resumeSpin);

    // Touch swipe support
    let touchStartX = 0, touchStartY = 0;
    cContainer.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      pauseSpin();
    }, { passive: true });
    cContainer.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        activeIdx = dx < 0 ? (activeIdx + 1) % items.length : (activeIdx - 1 + items.length) % items.length;
        updateCarousel();
      }
      resumeSpin();
    }, { passive: true });

    const cPrev = document.getElementById('cPrev'), cNext = document.getElementById('cNext');
    if (cPrev) cPrev.addEventListener('click', () => { activeIdx = (activeIdx - 1 + items.length) % items.length; updateCarousel(); });
    if (cNext) cNext.addEventListener('click', () => { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { activeIdx = (activeIdx - 1 + items.length) % items.length; updateCarousel(); }
      if (e.key === 'ArrowRight') { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); }
    });
  }
} catch (err) { console.error('Carousel init failed:', err); }

/* ── CURSOR (mouse/trackpad only — skipped entirely on touch devices) ── */
if (!isTouchDevice) {
  try {
    const curGlow = document.getElementById('curGlow'), cur = document.getElementById('cur'), curR = document.getElementById('curR');
    if (cur && curR) {
      let mx = -100, my = -100, rx = -100, ry = -100;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
      (function animC() {
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        if (curGlow) { curGlow.style.left = mx + 'px'; curGlow.style.top = my + 'px'; }
        rx += (mx - rx) * .13; ry += (my - ry) * .13;
        curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
        requestAnimationFrame(animC);
      })();

      /* ── CURSOR SPARKS ── */
      const sColors = ['#E86A92', '#F0C850', '#B07AE8', '#7AE8E8', '#F4A0B8'];
      const sSyms = ['✦', '✧', '·', '⋆', '✿', '♡'];
      let lastS = 0;
      document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastS < 50 || Math.random() > .5) return;
        lastS = now;
        const s = document.createElement('span'); s.className = 'spark';
        s.textContent = sSyms[Math.floor(Math.random() * sSyms.length)];
        const tx = (Math.random() - .5) * 60, ty = -(Math.random() * 45 + 15);
        s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-size:${Math.random() * 9 + 7}px;color:${sColors[Math.floor(Math.random() * sColors.length)]};--tx:${tx}px;--ty:${ty}px;`;
        document.body.appendChild(s); setTimeout(() => s.remove(), 740);
      }, { passive: true });
    }
  } catch (err) { console.error('Cursor effects init failed:', err); }
}

/* ── SCROLL EFFECTS (progress bar + parallax), batched into one rAF tick ── */
try {
  const progEl = document.getElementById('prog');
  const heroVisualImg = document.querySelector('.hero-visual img');
  let scrollTicking = false;

  function updateScrollEffects() {
    const doc = document.documentElement;
    const scrollY = window.scrollY || doc.scrollTop;
    const maxScroll = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;

    if (progEl) {
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
      progEl.style.width = pct + '%';
    }
    if (heroVisualImg) {
      heroVisualImg.style.transform = `scale(${1 + scrollY * .0002}) translateY(${scrollY * .15}px)`;
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollEffects);
      scrollTicking = true;
    }
  }, { passive: true });
} catch (err) { console.error('Scroll effects init failed:', err); }

/* ── FLOATING HEARTS ── */
function spawnHearts() {
  try {
    function oneHeart(isInitial = false) {
      const h = document.createElement('div'); h.className = 'float-heart';
      const symbols = ['♥', '♡', '✦', '⋆'];
      h.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      const dur = Math.random() * 8 + 12, delay = isInitial ? -(Math.random() * dur) : Math.random() * 3;
      const colors = ['var(--blush)', 'var(--rose)', 'var(--violet)', 'var(--gold)'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      h.style.cssText = `left:${Math.random() * 100}vw;font-size:${Math.random() * 30 + 26}px;color:${color};--dur:${dur}s;--del:${delay}s;--drift:${(Math.random() - .5) * 120}px;--rot:${(Math.random() - .5) * 60}deg;--op:${Math.random() * .3 + .4};`;
      document.body.appendChild(h); setTimeout(() => h.remove(), dur * 1000 + 2000);
    }
    const initialCount = prefersReducedMotion ? 6 : (isSmallScreen ? 10 : 20);
    for (let i = 0; i < initialCount; i++) oneHeart(true);
    if (!prefersReducedMotion) {
      setInterval(() => oneHeart(false), isSmallScreen ? 2000 : 1200);
    }
  } catch (err) { console.error('Floating hearts failed:', err); }
}
spawnHearts();
