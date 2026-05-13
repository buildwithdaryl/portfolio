/* ═══════════════════════════════════════════════════════════════
   DARYL BALLECER — PREMIUM PORTFOLIO
   script.js — All JS: GSAP, ScrollTrigger, interactions, etc.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Wait for GSAP + plugins to be ready ─────────────────────── */
window.addEventListener('load', () => {

  /* ── Register GSAP plugins ─────────────────────────────────── */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
  }

  /* ════════════════════════════════════════════════════════════
     1. LOADER
     ════════════════════════════════════════════════════════════ */
  const loader    = document.getElementById('loader');
  const loaderBar = document.querySelector('.loader-bar');
  const loaderPct = document.querySelector('.loader-pct');
  let   progress  = 0;

  const loaderInterval = setInterval(() => {
    // Accelerate toward 90%, then wait for real load
    const step = progress < 70 ? Math.random() * 8 + 4 : Math.random() * 2 + 0.5;
    progress = Math.min(progress + step, 95);
    loaderBar.style.width = progress + '%';
    loaderPct.textContent = Math.round(progress) + '%';
  }, 80);

  function finishLoader() {
    clearInterval(loaderInterval);
    loaderBar.style.width = '100%';
    loaderPct.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      // Kick off hero entrance after loader hides
      animateHeroEntrance();
    }, 400);
  }

  // Always finish after 2s, regardless of actual load state
  setTimeout(finishLoader, 2000);

  /* ════════════════════════════════════════════════════════════
     2. HERO ENTRANCE ANIMATION
     ════════════════════════════════════════════════════════════ */
  function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
      .to('.name-line',    { opacity: 1, y: 0,  duration: 0.9, stagger: 0.15 }, '-=0.4')
      .to('.hero-title',   { opacity: 1, y: 0,  duration: 0.7 }, '-=0.5')
      .to('.hero-typing',  { opacity: 1, y: 0,  duration: 0.6 }, '-=0.4')
      .to('.hero-cta',     { opacity: 1, y: 0,  duration: 0.6 }, '-=0.3')
      .to('.badge',        { opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.2');

    // Start typing effect after hero text reveals
    tl.call(startTypingEffect, [], '-=0.1');
  }

  /* ════════════════════════════════════════════════════════════
     3. TYPING EFFECT
     ════════════════════════════════════════════════════════════ */
  const typedEl   = document.getElementById('typed-text');
  const phrases   = [
    'stunning web experiences.',
    'high-performance apps.',
    'pixel-perfect UIs.',
    'scalable backends.',
    'beautiful animations.',
  ];
  let pIndex = 0, cIndex = 0, isDeleting = false;

  function startTypingEffect() {
    typeLoop();
  }

  function typeLoop() {
    if (!typedEl) return;
    const current = phrases[pIndex];

    if (isDeleting) {
      cIndex--;
    } else {
      cIndex++;
    }

    typedEl.textContent = current.slice(0, cIndex);

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && cIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && cIndex === 0) {
      isDeleting = false;
      pIndex = (pIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  /* ════════════════════════════════════════════════════════════
     4. CUSTOM CURSOR
     ════════════════════════════════════════════════════════════ */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let   mouseX = 0, mouseY = 0;
  let   ringX  = 0, ringY  = 0;

  // Only run cursor on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left  = mouseX + 'px';
      cursorDot.style.top   = mouseY + 'px';
    });

    // Smooth ring follow via RAF
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .project-card, .service-card, .tech-icon, .t-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Hide cursor when off screen
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* ════════════════════════════════════════════════════════════
     5. MAGNETIC BUTTONS
     ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ════════════════════════════════════════════════════════════
     6. NAVBAR SCROLL BEHAVIOUR
     ════════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ════════════════════════════════════════════════════════════
     7. SCROLL PROGRESS INDICATOR
     ════════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = (scrolled / maxScroll) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ════════════════════════════════════════════════════════════
     8. SCROLL TO TOP BUTTON
     ════════════════════════════════════════════════════════════ */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ════════════════════════════════════════════════════════════
     9. HAMBURGER / MOBILE MENU
     ════════════════════════════════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ════════════════════════════════════════════════════════════
     10. DARK / LIGHT THEME TOGGLE
     ════════════════════════════════════════════════════════════ */
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
  });

  /* ════════════════════════════════════════════════════════════
     11. GSAP SCROLL ANIMATIONS
     ════════════════════════════════════════════════════════════ */
  if (window.gsap && window.ScrollTrigger) {

    /* ── Generic reveal ── */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
      });
    });

    /* ── Reveal left ── */
    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out'
      });
    });

    /* ── Reveal right ── */
    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out'
      });
    });

    /* ── Reveal up (staggered via delay var) ── */
    gsap.utils.toArray('.reveal-up').forEach(el => {
      const delay = parseFloat(el.style.getPropertyValue('--delay')) || 0;
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay
      });
    });

    /* ── Skill bars ── */
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const targetW = bar.getAttribute('data-width') + '%';
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => gsap.to(bar, { width: targetW, duration: 1.2, ease: 'power3.out' }),
        once: true
      });
    });

    /* ── Counter numbers ── */
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(el,
            { textContent: 0 },
            {
              textContent: target,
              duration: 1.5,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate() { el.textContent = Math.round(+el.textContent); }
            }
          );
        },
        once: true
      });
    });

    /* ── Parallax hero shapes ── */
    gsap.to('.shape-1', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
      y: -120, x: 40
    });
    gsap.to('.shape-2', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 },
      y: -80, x: -30
    });
    gsap.to('.shape-3', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: -60
    });

    /* ── Hero badges parallax ── */
    gsap.to('.badge-1', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -40 });
    gsap.to('.badge-2', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }, y: -60 });
    gsap.to('.badge-3', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 }, y: -30 });
    gsap.to('.badge-4', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 }, y: -50 });

    /* ── Section numbers parallax ── */
    gsap.utils.toArray('.section-number').forEach(el => {
      gsap.fromTo(el,
        { y: 20 },
        {
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
          y: -40
        }
      );
    });

    /* ── Timeline items ── */
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(item,
        { opacity: 0, x: fromLeft ? -50 : 50 },
        {
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1
        }
      );
    });

    /* ── Project card 3D tilt ── */
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const rx     = ((e.clientY - cy) / (rect.height / 2)) * -6;
        const ry     = ((e.clientX - cx) / (rect.width  / 2)) *  6;
        gsap.to(card, {
          rotateX: rx,
          rotateY: ry,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.6)' });
      });
    });

    /* ── Service cards stagger ── */
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.08
        }
      );
    });

  } // end GSAP block

  /* ════════════════════════════════════════════════════════════
     12. TESTIMONIALS CAROUSEL
     ════════════════════════════════════════════════════════════ */
  const track      = document.getElementById('testimonials-track');
  const dotsWrap   = document.getElementById('t-dots');
  const cards      = track ? track.querySelectorAll('.testimonial-card') : [];
  const totalCards = cards.length;
  let   currentSlide = 0;
  let   slidesPerView = window.innerWidth < 1024 ? 1 : 2;

  // Build dots
  if (dotsWrap && totalCards) {
    const totalDots = Math.ceil(totalCards / slidesPerView);
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const maxSlide = Math.ceil(totalCards / slidesPerView) - 1;
    currentSlide   = Math.max(0, Math.min(index, maxSlide));

    // Each card is 50% of container (2-per-view) or 100% (1-per-view)
    const cardWidthPct = 100 / slidesPerView;
    const gapPx        = 24;
    const offset       = currentSlide * (cardWidthPct);

    if (window.gsap) {
      gsap.to(track, {
        xPercent: -(offset * currentSlide / Math.max(currentSlide, 0.001)) ,
        duration: 0
      });
    }

    // Simpler pixel-based approach for reliability
    const cardWidth = cards[0]?.offsetWidth ?? 0;
    const shift     = currentSlide * (cardWidth + gapPx);
    track.style.transform = `translateX(-${shift}px)`;

    // Update dots
    dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  document.getElementById('t-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('t-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Auto-advance
  let autoplay = setInterval(() => goToSlide(currentSlide + 1 >= Math.ceil(totalCards / slidesPerView) ? 0 : currentSlide + 1), 5000);

  track?.addEventListener('mouseenter', () => clearInterval(autoplay));
  track?.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goToSlide(currentSlide + 1 >= Math.ceil(totalCards / slidesPerView) ? 0 : currentSlide + 1), 5000);
  });

  // Touch swipe for carousel
  let touchStartX = 0;
  track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goToSlide(dx < 0 ? currentSlide + 1 : currentSlide - 1);
  });

  /* ════════════════════════════════════════════════════════════
     13. CONTACT FORM
     ════════════════════════════════════════════════════════════ */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';
    submitBtn.disabled  = true;

    // Simulate async send
    setTimeout(() => {
      btnText.textContent = 'Sent!';
      successMsg.classList.add('show');
      form.reset();

      // Animate success with GSAP if available
      if (window.gsap) {
        gsap.from(successMsg, { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' });
      }

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        submitBtn.disabled  = false;
        successMsg.classList.remove('show');
      }, 4000);
    }, 1500);
  });

  /* ════════════════════════════════════════════════════════════
     14. SMOOTH SCROLL FOR NAV LINKS
     ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════════════════════════════════
     15. FOOTER YEAR
     ════════════════════════════════════════════════════════════ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ════════════════════════════════════════════════════════════
     16. FLOATING BACKGROUND SHAPES — MOUSE PARALLAX
     ════════════════════════════════════════════════════════════ */
  document.addEventListener('mousemove', (e) => {
    const xPct = (e.clientX / window.innerWidth  - 0.5);
    const yPct = (e.clientY / window.innerHeight - 0.5);

    document.querySelectorAll('.shape').forEach((s, i) => {
      const depth = (i + 1) * 8;
      s.style.transform = `translate(${xPct * depth}px, ${yPct * depth}px)`;
    });
  });

  /* ════════════════════════════════════════════════════════════
     17. SECTION ACTIVE LINK HIGHLIGHT
     ════════════════════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerOpts = { rootMargin: '-40% 0px -40% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));

  /* ════════════════════════════════════════════════════════════
     18. RESIZE HANDLER
     ════════════════════════════════════════════════════════════ */
  window.addEventListener('resize', () => {
    slidesPerView = window.innerWidth < 1024 ? 1 : 2;
    goToSlide(0);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  /* ════════════════════════════════════════════════════════════
     19. TECH ICON HOVER SOUND-READY STUB
         (Connect real audio by creating Audio objects here)
     ════════════════════════════════════════════════════════════ */
  // Example: const hoverSound = new Audio('assets/hover.mp3');
  // document.querySelectorAll('.tech-icon').forEach(el => {
  //   el.addEventListener('mouseenter', () => { hoverSound.currentTime = 0; hoverSound.play(); });
  // });

  /* ════════════════════════════════════════════════════════════
     20. PERFORMANCE: LAZY LOAD IMAGES
     ════════════════════════════════════════════════════════════ */
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img   = entry.target;
          img.src     = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

}); // end window.load
