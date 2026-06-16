/* ══════════════════════════════════════════
       PARTICLE STARFIELD
    ══════════════════════════════════════════ */
    (function initParticles() {
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let W, H;
      const particles = [];
      const PARTICLE_COUNT = 80;

      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.3,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.5 + 0.1,
          pulse: Math.random() * Math.PI * 2,
          color: ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8'][Math.floor(Math.random() * 5)]
        });
      }

      function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
          p.x += p.dx;
          p.y += p.dy;
          p.pulse += 0.02;

          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;

          const a = p.alpha * (0.5 + Math.sin(p.pulse) * 0.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = a;
          ctx.fill();

          // tiny glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = a * 0.15;
          ctx.fill();
        });

        // Draw connections
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(176, 122, 232, ${0.06 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(drawParticles);
      }
      drawParticles();
    })();

    /* ══════════════════════════════════════════
       CONFETTI
    ══════════════════════════════════════════ */
    function launchConfetti() {
      const canvas = document.getElementById('confetti');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const pieces = [];
      const colors = ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8', '#7AE8A0'];

      for (let i = 0; i < 200; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          w: Math.random() * 10 + 4,
          h: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          vy: Math.random() * 3 + 2,
          vx: (Math.random() - 0.5) * 2,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          opacity: 1
        });
      }

      let frame = 0;
      function animConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        pieces.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;

          if (frame > 120) p.opacity -= 0.005;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });

        if (pieces.some(p => p.opacity > 0 && p.y < canvas.height + 50)) {
          requestAnimationFrame(animConfetti);
        }
      }
      animConfetti();
    }

    /* ── PETALS ──────────────────────────── */
    function spawnPetals() {
      for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        const colors = ['#E86A92', '#B07AE8', '#F4A0B8', '#F0C850'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.setProperty('--pd', (Math.random() * 8 + 8) + 's');
        p.style.setProperty('--delay', (Math.random() * 6) + 's');
        p.style.setProperty('--px', (Math.random() * 100 - 50) + 'px');
        p.style.width = (Math.random() * 10 + 8) + 'px';
        p.style.height = (Math.random() * 10 + 8) + 'px';
        p.style.opacity = '0';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 20000);
      }
    }

    /* ── CURTAIN OPEN ─────────────────────────── */
    window.addEventListener('load', () => {
      const cL = document.getElementById('cL');
      const cR = document.getElementById('cR');
      const logo = document.getElementById('cLogo');

      setTimeout(() => {
        logo.classList.add('hide');
        setTimeout(() => {
          cL.classList.add('open');
          cR.classList.add('open');
          logo.remove();
          setTimeout(() => {
            cL.remove(); cR.remove();
            document.getElementById('scrollHint').classList.add('vis');
            launchConfetti();
            spawnPetals();
          }, 1400);
        }, 400);
      }, 800);
    });

    /* ══════════════════════════════════════════
       SCROLL REVEAL (IntersectionObserver)
    ══════════════════════════════════════════ */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });

    /* ══════════════════════════════════════════
       MUSIC VISUALIZER BARS
    ══════════════════════════════════════════ */
    (function buildVisualizer() {
      const container = document.getElementById('visualizer');
      const barCount = 60;
      const colors = ['#E86A92', '#B07AE8', '#7AE8E8', '#F0C850', '#F4A0B8'];

      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'viz-bar';
        const hMin = Math.random() * 10 + 5;
        const hMax = Math.random() * 55 + 15;
        const dur = Math.random() * 0.8 + 0.4;
        bar.style.cssText = `
          --vh-min: ${hMin}px;
          --vh-max: ${hMax}px;
          --vd: ${dur}s;
          background: ${colors[i % colors.length]};
          box-shadow: 0 0 8px ${colors[i % colors.length]}40;
          animation-delay: ${Math.random() * -2}s;
        `;
        container.appendChild(bar);
      }
    })();

    /* ══════════════════════════════════════════
       BIRTHDAY CAKE INTERACTION
    ══════════════════════════════════════════ */
    let candlesBlown = false;
    const cakeClickTarget = document.getElementById('cakeContainer');
    const cakeGlowRing = document.getElementById('cakeGlow');

    // Also make the msg clickable
    document.getElementById('cakeMsg').addEventListener('click', blowCandles);
    cakeClickTarget.addEventListener('click', blowCandles);

    function blowCandles() {
      if (candlesBlown) return;
      candlesBlown = true;

      const flames = document.querySelectorAll('.flame');
      flames.forEach((f, i) => {
        setTimeout(() => {
          f.classList.add('out');
        }, i * 200);
      });

      // Activate glow ring
      setTimeout(() => {
        if (cakeGlowRing) cakeGlowRing.classList.add('active');
      }, flames.length * 200);

      const msg = document.getElementById('cakeMsg');
      setTimeout(() => {
        msg.textContent = '🎉 Happy Birthday Priya! 🎉';
        msg.classList.add('blown');
        launchConfetti();
      }, flames.length * 200 + 400);
    }

    /* ══════════════════════════════════════════
       TYPEWRITER LETTER
    ══════════════════════════════════════════ */
    const letterText = `You document everything — the mornings, the playlists, the random thoughts, the places you go, the feelings you can't quite name. And somehow, in doing that, you've let an entire world into yours. You didn't just <em>make content.</em> You made people feel less alone on a Tuesday.<br><br>221K hearts on one video is just the universe agreeing with what the rest of us already knew. <em>You are the kind of person the camera loves</em> — not because of how you look, but because of how real you are.<br><br>This year, may your twenties get louder, your reels hit harder, your world get bigger. The world is catching up, Priya. It was always a matter of time. 🌸`;

    let letterTyped = false;
    const letterBody = document.getElementById('letterBody');

    function typeWriter(html, element, speed = 15) {
      // Parse HTML and type it out with tags rendered properly
      let i = 0;
      let output = '';
      let inTag = false;

      function type() {
        if (i < html.length) {
          const char = html[i];
          if (char === '<') inTag = true;
          if (inTag) {
            // Collect entire tag at once
            let tag = '';
            while (i < html.length) {
              tag += html[i];
              if (html[i] === '>') { i++; inTag = false; break; }
              i++;
            }
            output += tag;
            element.innerHTML = output + '<span class="typewriter-cursor"></span>';
            setTimeout(type, 0);
          } else {
            output += char;
            i++;
            element.innerHTML = output + '<span class="typewriter-cursor"></span>';
            setTimeout(type, speed);
          }
        } else {
          // Remove cursor after done
          setTimeout(() => {
            const cursor = element.querySelector('.typewriter-cursor');
            if (cursor) cursor.remove();
          }, 2000);
        }
      }
      type();
    }

    // Trigger typewriter when letter section is in view
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !letterTyped) {
          letterTyped = true;
          typeWriter(letterText, letterBody, 18);
        }
      });
    }, { threshold: 0.3 });
    letterObserver.observe(document.querySelector('.letter-card'));

    /* ── CAROUSEL LOGIC ───────────────────────── */
    const items = document.querySelectorAll('.carousel-item');
    let activeIdx = Math.floor(items.length / 2);

    function updateCarousel() {
      items.forEach((item, i) => {
        item.className = 'carousel-item'; // reset

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

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        activeIdx = i;
        updateCarousel();
      });
    });

    updateCarousel();

    /* ── AUTO SPIN ────────────────────────────── */
    let spinInterval = setInterval(() => {
      activeIdx = (activeIdx + 1) % items.length;
      updateCarousel();
    }, 2500);

    const cContainer = document.getElementById('carousel');
    cContainer.addEventListener('mouseenter', () => clearInterval(spinInterval));
    cContainer.addEventListener('mouseleave', () => {
      spinInterval = setInterval(() => {
        activeIdx = (activeIdx + 1) % items.length;
        updateCarousel();
      }, 2500);
    });

    document.getElementById('cPrev').addEventListener('click', () => {
      activeIdx = (activeIdx - 1 + items.length) % items.length;
      updateCarousel();
    });
    document.getElementById('cNext').addEventListener('click', () => {
      activeIdx = (activeIdx + 1) % items.length;
      updateCarousel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        activeIdx = (activeIdx - 1 + items.length) % items.length;
        updateCarousel();
      }
      if (e.key === 'ArrowRight') {
        activeIdx = (activeIdx + 1) % items.length;
        updateCarousel();
      }
    });

    /* ── CUSTOM CURSOR ────────────────────────── */
    const curGlow = document.getElementById('curGlow');
    const cur = document.getElementById('cur');
    const curR = document.getElementById('curR');
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animC() {
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      if (curGlow) { curGlow.style.left = mx + 'px'; curGlow.style.top = my + 'px'; }
      rx += (mx - rx) * .13; ry += (my - ry) * .13;
      curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
      requestAnimationFrame(animC);
    })();

    /* ── CURSOR SPARKS ────────────────────────── */
    const sColors = ['#E86A92', '#F0C850', '#B07AE8', '#7AE8E8', '#F4A0B8'];
    const sSyms = ['✦', '✧', '·', '⋆', '✿', '♡'];
    let lastS = 0;
    document.addEventListener('mousemove', e => {
      const now = Date.now();
      if (now - lastS < 50 || Math.random() > .5) return;
      lastS = now;
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = sSyms[Math.floor(Math.random() * sSyms.length)];
      const tx = (Math.random() - .5) * 60, ty = -(Math.random() * 45 + 15);
      s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;
    font-size:${Math.random() * 9 + 7}px;
    color:${sColors[Math.floor(Math.random() * sColors.length)]};
    --tx:${tx}px;--ty:${ty}px;`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 740);
    });

    /* ── PROGRESS BAR ─────────────────────────── */
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      document.getElementById('prog').style.width = pct + '%';
    });

    /* ── RESIZE ───────────────────────────────── */
    window.addEventListener('resize', () => {
      const c = document.getElementById('confetti');
      if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
    });

    /* ── FLOATING HEARTS ──────────────────────── */
    function spawnHearts() {
      function oneHeart(isInitial = false) {
        const h = document.createElement('div');
        h.className = 'float-heart';
        const symbols = ['♥', '♡', '✦', '⋆'];
        h.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        const dur = Math.random() * 8 + 12;
        const delay = isInitial ? -(Math.random() * dur) : Math.random() * 3;
        const colors = ['var(--blush)', 'var(--rose)', 'var(--violet)', 'var(--gold)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        h.style.cssText = `
          left:${Math.random() * 100}vw;
          font-size:${Math.random() * 30 + 26}px;
          color:${color};
          --dur:${dur}s; --del:${delay}s;
          --drift:${(Math.random() - 0.5) * 120}px;
          --rot:${(Math.random() - 0.5) * 60}deg;
          --op:${Math.random() * 0.3 + 0.4};
        `;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), dur * 1000 + 2000);
      }
      for (let i = 0; i < 20; i++) oneHeart(true);
      setInterval(() => oneHeart(false), 1200);
    }
    spawnHearts();

    /* ══════════════════════════════════════════
       PARALLAX ON SCROLL
    ══════════════════════════════════════════ */
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroVisual = document.querySelector('.hero-visual img');
      if (heroVisual) {
        heroVisual.style.transform = `scale(${1 + scrollY * 0.0002}) translateY(${scrollY * 0.15}px)`;
      }
    });