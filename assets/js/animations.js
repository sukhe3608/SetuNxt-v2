/* ================================================================
   SETUNXT — ANIMATION ENGINE
   IntersectionObserver • Counters • Metric Bars • Particles • Nav
   All functionality-safe — only adds visual enhancement
   ================================================================ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. Scroll Progress Bar
  ───────────────────────────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'sn-progress-bar';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? ((scrollTop / docHeight) * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─────────────────────────────────────────────────────────────
     2. Nav Scroll Effect (landing pages only)
  ───────────────────────────────────────────────────────────── */
  const nav = document.querySelector('nav');
  if (nav) {
    function handleNavScroll() {
      nav.classList.toggle('sn-nav-scrolled', window.scrollY > 64);
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ─────────────────────────────────────────────────────────────
     3. IntersectionObserver — Scroll Reveal
  ───────────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.sn-reveal, .sn-reveal-left, .sn-reveal-right, .sn-reveal-scale, .sn-reveal-blur'
  );

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sn-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────
     4. Animated Number Counter
  ───────────────────────────────────────────────────────────── */
  function animateCounter(el) {
    const raw = el.dataset.target || el.textContent;
    const suffix = el.dataset.suffix || raw.replace(/[\d.]/g, '');
    const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(target)) return;

    const duration = 1800;
    const isDecimal = !Number.isInteger(target);
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.sn-counter');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counterEls.forEach((el) => counterObserver.observe(el));
  }

  /* ─────────────────────────────────────────────────────────────
     5. Metric Bar Animate (width 0 → target on scroll)
  ───────────────────────────────────────────────────────────── */
  const barFills = document.querySelectorAll('.bar-fill');
  if (barFills.length > 0) {
    // Store original widths, reset to 0
    barFills.forEach((bar) => {
      const w = bar.style.width || '0';
      bar.dataset.targetWidth = w;
      bar.style.width = '0';
    });

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.width = bar.dataset.targetWidth;
            });
          });
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    barFills.forEach((bar) => barObserver.observe(bar));
  }

  /* ─────────────────────────────────────────────────────────────
     6. Hero Particle Canvas (Landing Page Only)
  ───────────────────────────────────────────────────────────── */
  const heroSection = document.querySelector('.sn-landing .hero');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.id = 'sn-particles';
    heroSection.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(55, Math.floor(canvas.width / 22));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          dx: (Math.random() - 0.5) * 0.35,
          dy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.4 + 0.12,
          col: Math.random() > 0.55 ? '#1a6fd4' : '#f07c1a',
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -2) p.x = canvas.width + 2;
        if (p.x > canvas.width + 2) p.x = -2;
        if (p.y < -2) p.y = canvas.height + 2;
        if (p.y > canvas.height + 2) p.y = -2;
      });

      // Draw connecting lines between nearby particles
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,185,255,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); createParticles(); }, 250);
    });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     7. Hero Floating Orbs (inject into hero if landing)
  ───────────────────────────────────────────────────────────── */
  if (heroSection) {
    const orbA = document.createElement('div');
    orbA.className = 'sn-hero-orb sn-hero-orb-a';
    const orbB = document.createElement('div');
    orbB.className = 'sn-hero-orb sn-hero-orb-b';
    heroSection.prepend(orbA);
    heroSection.prepend(orbB);
  }

  /* ─────────────────────────────────────────────────────────────
     8. Dashboard / App: KPI cards entrance stagger
  ───────────────────────────────────────────────────────────── */
  const kpiCards = document.querySelectorAll('.card.stat-card, .kpi-card, .summary-card, [class*="metric-card"]');
  kpiCards.forEach((card, i) => {
    card.style.animationDelay = (i * 0.1) + 's';
    card.classList.add('sn-stat-card');
  });

  /* ─────────────────────────────────────────────────────────────
     9. Tab switching fade effect (Bootstrap tabs)
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    panel.addEventListener('shown.bs.tab', () => {
      panel.style.animation = 'none';
      panel.offsetHeight; // force reflow
      panel.style.animation = 'sn-fadeInUp 0.35s cubic-bezier(0.22,1,0.36,1) both';
    });
  });

  /* ─────────────────────────────────────────────────────────────
     10. Smooth anchor scroll (landing page)
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = document.querySelector('nav')?.offsetHeight || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────────
     11. Button ripple effect
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn, .btn-hero-primary, .btn-hero-secondary, .cta-submit, .submit-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        transform:scale(0); animation:sn-ripple 0.55s linear;
        background:rgba(255,255,255,0.3);
        width:${Math.max(rect.width, rect.height)}px;
        height:${Math.max(rect.width, rect.height)}px;
        left:${e.clientX - rect.left - Math.max(rect.width, rect.height)/2}px;
        top:${e.clientY - rect.top - Math.max(rect.width, rect.height)/2}px;
        pointer-events:none;
      `;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframe dynamically
  if (!document.getElementById('sn-ripple-style')) {
    const st = document.createElement('style');
    st.id = 'sn-ripple-style';
    st.textContent = `@keyframes sn-ripple{to{transform:scale(4);opacity:0}}`;
    document.head.appendChild(st);
  }

  /* ─────────────────────────────────────────────────────────────
     12. Image lazy-reveal
  ───────────────────────────────────────────────────────────── */
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window && images.length) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'sn-blurIn 0.6s cubic-bezier(0.22,1,0.36,1) both';
          imgObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    images.forEach((img) => imgObserver.observe(img));
  }

})();
