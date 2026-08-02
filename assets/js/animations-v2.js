/* ================================================================
   SETUNXT — ANIMATIONS ENGINE V2
   Typewriter · 3D Tilt · Magnetic · Sparkles · Page Loader
   Parallax · Scroll Reveals · Sound Wave · Number Roll
   ================================================================ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     0. Page Loader (Landing only)
  ───────────────────────────────────────────────────────────── */
  const isLanding = document.body.classList.contains('sn-landing');

  if (isLanding) {
    const loader = document.createElement('div');
    loader.className = 'sn-page-loader';
    loader.id = 'sn-page-loader';
    loader.innerHTML = `
      <img class="sn-loader-logo" src="assets/images/Logo.png" alt="SetuNXT" style="height:72px;filter:brightness(10)">
      <div class="sn-loader-bar"><div class="sn-loader-bar-fill"></div></div>
    `;
    document.body.prepend(loader);
    setTimeout(() => {
      loader.style.display = 'none';
    }, 2100);
  }

  /* ─────────────────────────────────────────────────────────────
     1. Tech Grid + Scan Line (Hero)
  ───────────────────────────────────────────────────────────── */
  const hero = document.querySelector('.sn-landing .hero');
  if (hero) {
    const grid = document.createElement('div');
    grid.className = 'sn-tech-grid';
    hero.prepend(grid);

    const scanline = document.createElement('div');
    scanline.className = 'sn-scanline';
    hero.prepend(scanline);

    // Morphing blobs
    const blobContainer = document.createElement('div');
    blobContainer.className = 'sn-blob-container';
    ['sn-blob-a', 'sn-blob-b', 'sn-blob-c'].forEach(cls => {
      const b = document.createElement('div');
      b.className = `sn-blob ${cls}`;
      blobContainer.appendChild(b);
    });
    hero.prepend(blobContainer);
  }

  /* ─────────────────────────────────────────────────────────────
     2. Typewriter Effect (hero h1 accent words)
  ───────────────────────────────────────────────────────────── */
  const h1 = document.querySelector('.sn-landing .hero h1');
  if (h1) {
    const words = ['Customer', 'Business', 'Audience', 'Market'];
    const accentEl = h1.querySelector('.accent');
    if (accentEl) {
      let wi = 0;
      let ci = 0;
      let deleting = false;
      const cursor = document.createElement('span');
      cursor.className = 'sn-typewriter-cursor';
      accentEl.after(cursor);

      function typeLoop() {
        const word = words[wi];
        if (!deleting) {
          accentEl.textContent = word.slice(0, ++ci);
          if (ci === word.length) {
            deleting = true;
            setTimeout(typeLoop, 1800);
            return;
          }
          setTimeout(typeLoop, 90);
        } else {
          accentEl.textContent = word.slice(0, --ci);
          if (ci === 0) {
            deleting = false;
            wi = (wi + 1) % words.length;
            setTimeout(typeLoop, 300);
            return;
          }
          setTimeout(typeLoop, 50);
        }
      }
      setTimeout(typeLoop, 2200); // start after loader
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. Gradient Text on section headings
  ───────────────────────────────────────────────────────────── */
  // Already handled via sn-grad-text CSS class

  /* ─────────────────────────────────────────────────────────────
     4. 3D Tilt on service cards
  ───────────────────────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.service-card, .usecase-card, .sn-tilt');

  tiltCards.forEach(card => {
    card.classList.add('sn-tilt');
    // Add shine overlay
    const shine = document.createElement('div');
    shine.className = 'sn-tilt-shine';
    card.style.position = 'relative';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const maxTilt = 12;
      const tiltX = -(y / r.height) * maxTilt;
      const tiltY = (x / r.width) * maxTilt;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
      shine.style.opacity = '1';
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      shine.style.setProperty('--mx', mx + '%');
      shine.style.setProperty('--my', my + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      shine.style.opacity = '0';
    });
  });

  /* ─────────────────────────────────────────────────────────────
     5. Magnetic Button Effect (CTA buttons)
  ───────────────────────────────────────────────────────────── */
  const magnetBtns = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary, .btn-solid, .cta-submit');
  magnetBtns.forEach(btn => {
    btn.classList.add('sn-magnetic');
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.22;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────────────────────
     6. Sparkle Effect on hover (service cards)
  ───────────────────────────────────────────────────────────── */
  const sparkColors = ['#1a6fd4', '#f07c1a', '#2d88f0', '#ff9340', '#ffffff'];

  function createSparkles(el) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const spark = document.createElement('div');
      spark.className = 'sn-spark';
      const size = Math.random() * 8 + 4;
      spark.style.cssText = `
        width:${size}px; height:${size}px;
        background: ${sparkColors[Math.floor(Math.random() * sparkColors.length)]};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 0.3}s;
      `;
      el.style.position = 'relative';
      el.style.overflow = 'visible';
      el.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove());
    }
  }

  document.querySelectorAll('.service-card, .step').forEach(el => {
    el.addEventListener('mouseenter', () => createSparkles(el));
  });

  /* ─────────────────────────────────────────────────────────────
     7. Spring-Up IntersectionObserver
  ───────────────────────────────────────────────────────────── */
  const springEls = document.querySelectorAll('.sn-spring');
  if (springEls.length) {
    const springObs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('sn-spring-active');
          }, i * 80);
          springObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    springEls.forEach(el => springObs.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────
     8. Scrolling Tech Marquee (inject after hero if landing)
  ───────────────────────────────────────────────────────────── */
  if (isLanding) {
    const channels = [
      '⚡ RCS Business Messaging',
      '📧 Email Marketing',
      '💬 WhatsApp Business',
      '📊 Real-Time Analytics',
      '🚀 Campaign Automation',
      '🛡️ Enterprise Security',
      '🔗 API Integration',
      '🌐 Multi-Channel Hub',
    ];

    const strip = document.createElement('div');
    strip.className = 'sn-brand-strip sn-landing';
    const inner = document.createElement('div');
    inner.className = 'sn-marquee-inner';
    // Duplicate for seamless loop
    const html = channels.map(t =>
      `<span class="sn-brand-item">${t}<span class="sn-brand-sep"></span></span>`
    ).join('');
    inner.innerHTML = html + html;
    const track = document.createElement('div');
    track.className = 'sn-marquee-track';
    track.appendChild(inner);
    strip.appendChild(track);

    // Insert after stats bar
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsBar.after(strip);
  }

  /* ─────────────────────────────────────────────────────────────
     9. Parallax on hero background shapes (mousemove)
  ───────────────────────────────────────────────────────────── */
  if (hero) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      const bgShapes = hero.querySelector('.hero-bg-shapes');
      if (bgShapes) {
        bgShapes.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     10. Number Roll on Stats (landing stats-bar)
  ───────────────────────────────────────────────────────────── */
  // Already handled by animations.js counters — add a CSS roll class
  document.querySelectorAll('.stat-num').forEach(el => {
    el.style.overflow = 'hidden';
  });

  /* ─────────────────────────────────────────────────────────────
     11. Floating decorative icons in hero
  ───────────────────────────────────────────────────────────── */
  if (hero) {
    const icons = ['fas fa-signal', 'fas fa-wifi', 'fas fa-envelope', 'fas fa-mobile-alt', 'fas fa-chart-bar'];
    icons.forEach((ic, i) => {
      const el = document.createElement('i');
      el.className = `${ic} sn-float-icon`;
      el.style.cssText = `
        top: ${15 + i * 15}%;
        left: ${5 + i * 8}%;
        font-size: ${1.5 + Math.random() * 1.5}rem;
        animation-delay: ${i * 0.8}s;
        animation-duration: ${7 + i * 1.5}s;
        color: ${i % 2 === 0 ? '#7cb9ff' : '#ffb366'};
      `;
      hero.appendChild(el);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     12. Section heading gradient text
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.section-title span:not(.o)').forEach(span => {
    span.classList.add('sn-grad-text');
  });

  /* ─────────────────────────────────────────────────────────────
     13. Button click ripple UPGRADE (multi-color)
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = btn.getBoundingClientRect();
      ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.25)'].forEach((color, i) => {
        const ring = document.createElement('span');
        const size = Math.max(r.width, r.height) * 2;
        ring.style.cssText = `
          position:absolute; width:${size}px; height:${size}px; border-radius:50%;
          background:${color}; pointer-events:none;
          left:${e.clientX - r.left - size/2}px;
          top:${e.clientY - r.top - size/2}px;
          transform:scale(0); animation:sn-ripple-expand 0.7s ease forwards;
          animation-delay:${i * 0.1}s;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());
      });
    });
  });

  /* ─────────────────────────────────────────────────────────────
     14. Scroll progress — enhanced color transition
  ───────────────────────────────────────────────────────────── */
  const pb = document.getElementById('sn-progress-bar');
  if (pb) {
    pb.style.background = 'linear-gradient(90deg, #1a6fd4, #2d88f0, #f07c1a)';
    pb.style.backgroundSize = '200% 100%';
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      pb.style.backgroundPosition = `${pct * 100}% 0`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────
     15. Auth page particle field (login / signup)
  ───────────────────────────────────────────────────────────── */
  const authLeft = document.querySelector('.auth-left-panel');
  if (authLeft) {
    const c = document.createElement('canvas');
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0';
    authLeft.style.position = 'relative';
    authLeft.prepend(c);
    const ctx = c.getContext('2d');
    let pts = [];

    function authResize() {
      c.width = authLeft.offsetWidth;
      c.height = authLeft.offsetHeight;
    }
    function createPts() {
      pts = [];
      for (let i = 0; i < 30; i++) {
        pts.push({
          x: Math.random() * c.width,
          y: Math.random() * c.height,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * 0.5 + 0.1,
          col: Math.random() > 0.5 ? '#1a6fd4' : '#f07c1a',
        });
      }
    }
    function drawAuth() {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.round(p.a * 255).toString(16).padStart(2,'0');
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;
      });
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,185,255,${0.1 * (1 - d/90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawAuth);
    }
    authResize(); createPts(); drawAuth();
    window.addEventListener('resize', () => { authResize(); createPts(); });
  }

})();
