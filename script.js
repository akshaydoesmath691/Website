(() => {
  const doc = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const progressBar = document.querySelector('.scroll-progress span');
  const floatingTop = document.querySelector('.floating-top');
  const cursorOrb = document.querySelector('.cursor-orb');
  const heroPhoto = document.querySelector('.hero-photo-card');
  const timeline = document.querySelector('.timeline');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeNavigation = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('nav-open');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
      body.classList.toggle('nav-open', !expanded);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeNavigation));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) closeNavigation();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToTop();
      history.replaceState(null, '', window.location.pathname + window.location.search);
    });
  });

  floatingTop?.addEventListener('click', scrollToTop);

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / scrollable));

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    header?.classList.toggle('is-scrolled', scrollTop > 24);
    floatingTop?.classList.toggle('is-visible', scrollTop > 650);

    if (heroPhoto && window.innerWidth > 1000 && !prefersReducedMotion) {
      const shift = Math.max(-16, Math.min(28, scrollTop * 0.035));
      heroPhoto.style.setProperty('--hero-parallax', `${shift}px`);
    }

    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const viewportPoint = window.innerHeight * 0.72;
      const total = rect.height + window.innerHeight * 0.35;
      const visible = viewportPoint - rect.top;
      const timelineProgress = Math.min(1, Math.max(0, visible / total));
      timeline.style.setProperty('--timeline-progress', timelineProgress.toFixed(3));
    }
  };

  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      updateScrollUI();
      scrollFrame = 0;
    });
  }, { passive: true });
  updateScrollUI();

  const revealItems = [...document.querySelectorAll('.reveal')];
  const revealDirections = ['up', 'left', 'right', 'scale'];
  revealItems.forEach((item, index) => {
    const parent = item.parentElement;
    const siblingIndex = parent ? [...parent.children].indexOf(item) : index;
    item.dataset.reveal = revealDirections[index % revealDirections.length];
    item.style.setProperty('--reveal-delay', `${Math.min(siblingIndex * 70, 280)}ms`);
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.11, rootMargin: '0px 0px -45px 0px' }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const observedSections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
        });
      },
      { rootMargin: '-25% 0px -62% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  if (cursorOrb && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    let orbX = window.innerWidth / 2;
    let orbY = window.innerHeight / 2;
    let targetX = orbX;
    let targetY = orbY;

    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });

    const animateOrb = () => {
      orbX += (targetX - orbX) * 0.08;
      orbY += (targetY - orbY) * 0.08;
      cursorOrb.style.left = `${orbX}px`;
      cursorOrb.style.top = `${orbY}px`;
      requestAnimationFrame(animateOrb);
    };
    animateOrb();
  }

  if (heroPhoto && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    heroPhoto.addEventListener('pointermove', (event) => {
      const rect = heroPhoto.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const parallax = getComputedStyle(heroPhoto).getPropertyValue('--hero-parallax').trim() || '0px';
      heroPhoto.style.transform = `translate3d(0, ${parallax}, 0) perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) rotate(1.5deg)`;
    });
    heroPhoto.addEventListener('pointerleave', () => {
      heroPhoto.style.transform = '';
    });
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const galleryCards = [...document.querySelectorAll('.gallery-card')];
  let lastFocusedCard = null;

  const openLightbox = (card) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const image = card.querySelector('img');
    const title = card.querySelector('strong')?.textContent?.trim() || 'Photograph';
    const description = card.querySelector('figcaption span')?.textContent?.trim() || '';
    if (!image) return;

    lastFocusedCard = card;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = description ? `${title} — ${description}` : title;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('lightbox-open');
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('lightbox-open');
    if (lightboxImage) lightboxImage.src = '';
    lastFocusedCard?.focus();
  };

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
  });
})();
