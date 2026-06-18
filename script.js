/* ── HERO CANVAS ── */
const hCvs = document.getElementById('heroCanvas');
const hCtx = hCvs.getContext('2d');
function resizeHero() { hCvs.width = hCvs.offsetWidth; hCvs.height = hCvs.offsetHeight; }
resizeHero();
window.addEventListener('resize', resizeHero);

const stars = Array.from({ length: 230 }, () => ({
  x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + .25,
  phase: Math.random() * Math.PI * 2, spd: Math.random() * .007 + .003
}));
const sparkles = Array.from({ length: 32 }, () => ({
  x: Math.random(), y: Math.random(), sz: Math.random() * 4 + 1.5,
  vx: (Math.random() - .5) * .00022, vy: -(Math.random() * .00042 + .00018),
  rot: Math.random() * Math.PI * 2, rs: (Math.random() - .5) * .042, hue: Math.random() * 65 + 268
}));
let hT = 0;
function drawHero() {
  const W = hCvs.width, H = hCvs.height;
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
  requestAnimationFrame(drawHero);
}
drawHero();

/* ── PARTICLES ── */
(function () {
  const canvas = document.getElementById('particles'), ctx = canvas.getContext('2d');
  let W, H; const pts = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for (let i = 0; i < 80; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .3, dx: (Math.random() - .5) * .3, dy: (Math.random() - .5) * .3, alpha: Math.random() * .5 + .1, pulse: Math.random() * Math.PI * 2, color: ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8'][Math.floor(Math.random() * 5)] });
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
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── CONFETTI ── */
function launchConfetti() {
  const canvas = document.getElementById('confetti'), ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const pieces = [], colors = ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8', '#7AE8A0'];
  for (let i = 0; i < 200; i++) pieces.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, w: Math.random() * 10 + 4, h: Math.random() * 6 + 2, color: colors[Math.floor(Math.random() * colors.length)], vy: Math.random() * 3 + 2, vx: (Math.random() - .5) * 2, rotation: Math.random() * 360, rotSpeed: (Math.random() - .5) * 8, opacity: 1 });
  let frame = 0;
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); frame++;
    pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed; if (frame > 120) p.opacity -= .005; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * Math.PI / 180); ctx.globalAlpha = Math.max(0, p.opacity); ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
    if (pieces.some(p => p.opacity > 0 && p.y < canvas.height + 50)) requestAnimationFrame(anim);
  }
  anim();
}

/* ── PETALS ── */
function spawnPetals() {
  for (let i = 0; i < 25; i++) {
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
}

/* ── LOADING SCREEN SEQUENCE ── */
window.addEventListener('load', () => {
  const cL   = document.getElementById('cL');
  const cR   = document.getElementById('cR');
  const logo = document.getElementById('cLogo');
  const ring = document.getElementById('loadRing');

  // Hold the loading screen for 2.6 s so the full reveal animates in
  setTimeout(() => {
    // 1) fade out text card + ring
    logo.classList.add('hide');
    if (ring) ring.classList.add('hide');

    // 2) after fade, open the curtains
    setTimeout(() => {
      cL.classList.add('open');
      cR.classList.add('open');
      logo.remove();
      if (ring) ring.remove();

      // 3) after curtains finish sliding, reveal page & launch effects
      setTimeout(() => {
        cL.remove();
        cR.remove();
        document.getElementById('scrollHint').classList.add('vis');
        launchConfetti();
        spawnPetals();
      }, 1700);
    }, 520);
  }, 2600);
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: .15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => revealObs.observe(el));

/* ── VISUALIZER ── */
(function () {
  const c = document.getElementById('visualizer'), n = 60, colors = ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8'];
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div'); b.className = 'viz-bar';
    b.style.cssText = `--vh-min:${Math.random() * 10 + 5}px;--vh-max:${Math.random() * 55 + 15}px;--vd:${Math.random() * .8 + .4}s;background:${colors[i % colors.length]};box-shadow:0 0 8px ${colors[i % colors.length]}40;animation-delay:${Math.random() * -2}s;`;
    c.appendChild(b);
  }
})();

/* ── CANDLE BLOW-OUT ── */
let blown = false;
function spawnSmoke(flameEl) {
  const rect = flameEl.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('div');
    const sdx = ((Math.random() - .5) * 32).toFixed(1);
    s.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + 4}px;width:5px;height:5px;border-radius:50%;background:rgba(200,195,230,.42);pointer-events:none;z-index:600;--sdx:${sdx}px;animation:smokeUp 1.3s ease forwards;animation-delay:${i * .14}s;`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 1500 + i * 150);
  }
}
function fireConfetti() { launchConfetti(); }
function blowOut() {
  if (blown) return; blown = true;
  const btn = document.getElementById('blowBtn'); btn.disabled = true;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const f = document.getElementById(`flame-${i}`);
      if (!f) return; spawnSmoke(f); f.classList.add('out');
    }, i * 210);
  }
  setTimeout(() => { document.getElementById('wishText').classList.add('show'); fireConfetti(); }, 5 * 210 + 450);
}

/* ── TYPEWRITER LETTER ── */
const letterText = `You document everything — the mornings, the playlists, the random thoughts, the places you go, the feelings you can't quite name. And somehow, in doing that, you've let an entire world into yours. You didn't just <em>make content.</em> You made people feel less alone on a Tuesday.<br><br>221K hearts on one video is just the universe agreeing with what the rest of us already knew. <em>You are the kind of person the camera loves</em> — not because of how you look, but because of how real you are.<br><br>This year, may your twenties get louder, your reels hit harder, your world get bigger. The world is catching up, Priya. It was always a matter of time. 🌸`;
let letterTyped = false;
const letterBody = document.getElementById('letterBody');
function typeWriter(html, element, speed = 15) {
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
const letterObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting && !letterTyped) { letterTyped = true; typeWriter(letterText, letterBody, 18); } }); }, { threshold: .3 });
letterObs.observe(document.querySelector('.letter-card'));

/* ── CAROUSEL ── */
const items = document.querySelectorAll('.carousel-item');
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
let spinInterval = setInterval(() => { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); }, 2500);
const cContainer = document.getElementById('carousel');
cContainer.addEventListener('mouseenter', () => clearInterval(spinInterval));
cContainer.addEventListener('mouseleave', () => { spinInterval = setInterval(() => { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); }, 2500); });
document.getElementById('cPrev').addEventListener('click', () => { activeIdx = (activeIdx - 1 + items.length) % items.length; updateCarousel(); });
document.getElementById('cNext').addEventListener('click', () => { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); });
document.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { activeIdx = (activeIdx - 1 + items.length) % items.length; updateCarousel(); } if (e.key === 'ArrowRight') { activeIdx = (activeIdx + 1) % items.length; updateCarousel(); } });

/* ── CURSOR ── */
const curGlow = document.getElementById('curGlow'), cur = document.getElementById('cur'), curR = document.getElementById('curR');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
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
});

/* ── PROGRESS BAR ── */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('prog').style.width = pct + '%';
});

window.addEventListener('resize', () => { const c = document.getElementById('confetti'); if (c) { c.width = window.innerWidth; c.height = window.innerHeight; } });

/* ── FLOATING HEARTS ── */
function spawnHearts() {
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
  for (let i = 0; i < 20; i++)oneHeart(true);
  setInterval(() => oneHeart(false), 1200);
}
spawnHearts();

/* ── PARALLAX ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroVisual = document.querySelector('.hero-visual img');
  if (heroVisual) heroVisual.style.transform = `scale(${1 + scrollY * .0002}) translateY(${scrollY * .15}px)`;
});
