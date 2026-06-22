/* ============================================= */
/* SCRIPT.JS — Evorange Ltd Website              */
/* ============================================= */

(function () {
  'use strict';

  // ---- Sticky Header ----
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Mobile Burger Menu ----
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  function updateActiveNav() {
    const scrollY = window.scrollY + 80;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // ---- Scroll Reveal Animations ----
  function addRevealClasses() {
    const revealTargets = [
      '.about__text > *',
      '.about__pillar',
      '.service-card',
      '.fleet__text > *',
      '.commitment__card',
      '.coverage__region',
      '.contact__detail',
      '.footer__col',
      '.hero__stat',
    ];
    revealTargets.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.08}s`;
      });
    });
  }

  function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  addRevealClasses();
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Run once on load

  // ---- Contact Form Submission ----
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        }
      });

      if (!valid) {
        shakeForm();
        return;
      }

      // Simulate submission
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.textContent = '✓ Enquiry Sent!';
        submitBtn.style.background = '#469028';
        submitBtn.style.opacity = '1';
        contactForm.querySelectorAll('.form__input').forEach(f => { f.value = ''; });

        setTimeout(() => {
          submitBtn.textContent = 'Send Enquiry';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 4000);
      }, 1400);
    });
  }

  function shakeForm() {
    const wrap = document.querySelector('.contact__form-wrap');
    wrap.style.animation = 'none';
    wrap.offsetHeight; // reflow
    wrap.style.animation = 'shake 0.4s ease';
  }

  // Add shake keyframes dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header.offsetHeight;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- Hero scroll indicator ----
  const heroScroll = document.getElementById('hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) {
        about.scrollIntoView({ behavior: 'smooth' });
      }
    });
    heroScroll.style.cursor = 'pointer';
  }

  // ---- Animated counter for hero stats ----
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const startTime = performance.now();
    const isPlus = el.textContent.includes('+');
    const update = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // Trigger counters when hero stats enter viewport
  const statNums = document.querySelectorAll('.hero__stat-num');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNums.forEach(el => {
          const raw = parseInt(el.textContent.replace(/\D/g, ''), 10);
          if (!isNaN(raw)) animateCounter(el, raw);
        });
      }
    });
  }, { threshold: 0.5 });

  if (statNums.length) counterObserver.observe(statNums[0].closest('.hero__stats'));

  // ---- Ticker pause on hover ----
  const tickerTrack = document.querySelector('.ticker__track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  // ---- Initial load ----
  onScroll();

})();
