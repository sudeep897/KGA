// ------------------------------------------------------------------
// COMBINED JAVASCRIPT – Kinder Garden Academy
// Merged from: index, contact, faqs, gallery, programs, teams
// Includes preloader, navbar scroll, modals, sliders, counters,
// gallery lightbox, team tabs, form handling, and security.
// ------------------------------------------------------------------

(function() {
  'use strict';

  // ---------- PRELOADER ----------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 800);
    });
  }

  // ---------- COMMON DOM ELEMENTS ----------
  const navbar = document.getElementById('navbar');
  const logoText = document.getElementById('logoText');
  const topBar = document.getElementById('topContactBar');
  const navLinks = document.querySelectorAll('.nav-link');
  const loginBtn = document.getElementById('loginBtn');
  const menuToggle = document.getElementById('menuToggle');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const barDividers = [
    document.getElementById('barDivider1'),
    document.getElementById('barDivider2')
  ];

  // Adjust navbar top position dynamically based on actual rendered heights.
  // Previously this hardcoded 32px/40px breakpoints, which broke whenever the
  // top contact bar wrapped onto two lines (long phone/email on narrow screens)
  // and caused the navbar/hero content to overlap it. We now measure the real
  // element heights and expose them as CSS variables so any fixed/sticky
  // element (navbar, sticky team tabs, etc.) can stay perfectly in sync.
  function adjustNavbarTop() {
    if (!navbar) return;
    const topBarHeight = topBar ? topBar.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty('--topbar-h', `${topBarHeight}px`);
    navbar.style.top = `${topBarHeight}px`;
    // Wait a frame so layout has settled before measuring the navbar itself
    requestAnimationFrame(() => {
      const navHeight = navbar.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--navbar-h', `${navHeight}px`);
    });
  }
  adjustNavbarTop();

  // Debounced resize handler (previously fired on every pixel of drag/resize)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(adjustNavbarTop, 120);
  });
  // Recheck after fonts/images load, since text reflow can change topbar height
  window.addEventListener('load', adjustNavbarTop);

  // Scroll handler for navbar, top bar, and scroll buttons
  function handleScroll() {
    const scrolled = window.scrollY > 50;
    if (navbar) {
      if (scrolled) {
        navbar.classList.add('scrolled');
        if (logoText) logoText.classList.replace('text-white', 'text-gray-900');
        navLinks.forEach(link => {
          link.classList.replace('text-white/90', 'text-gray-800');
          link.classList.replace('hover:text-white', 'hover:text-blue-900');
        });
        if (loginBtn) loginBtn.classList.add('dark');
        if (menuToggle) menuToggle.classList.replace('text-white', 'text-gray-800');
        if (topBar) topBar.classList.add('scrolled');
        barDividers.forEach(d => d?.classList.replace('bg-white/30', 'bg-gray-300'));
        // Teams page tabs container
        const tabsContainer = document.getElementById('tabsContainer');
        if (tabsContainer) tabsContainer.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
        if (logoText) logoText.classList.replace('text-gray-900', 'text-white');
        navLinks.forEach(link => {
          link.classList.replace('text-gray-800', 'text-white/90');
          link.classList.replace('hover:text-blue-900', 'hover:text-white');
        });
        if (loginBtn) loginBtn.classList.remove('dark');
        if (menuToggle) menuToggle.classList.replace('text-gray-800', 'text-white');
        if (topBar) topBar.classList.remove('scrolled');
        barDividers.forEach(d => d?.classList.replace('bg-gray-300', 'bg-white/30'));
        const tabsContainer = document.getElementById('tabsContainer');
        if (tabsContainer) tabsContainer.classList.remove('scrolled');
      }
    }

    // Scroll to top / back to top buttons
    if (scrollTopBtn) {
      if (window.scrollY > 500) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
    if (backToTopBtn) {
      if (window.scrollY > 400) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Scroll to top functionality (both variants)
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- MOBILE MENU ----------
  if (menuToggle) {
    const mobileMenu = document.getElementById('mobileMenu');
    const openMenu = () => {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('hidden');
      // Force reflow so the max-height transition actually plays
      void mobileMenu.offsetHeight;
      mobileMenu.classList.add('menu-open');
      menuToggle.classList.add('open');
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      menuToggle.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('menu-open');
      menuToggle.classList.remove('open');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!mobileMenu) return;
      const isOpen = mobileMenu.classList.contains('menu-open');
      isOpen ? closeMenu() : openMenu();
    });
    // Close after tapping a link (nicer on same-page anchors, and tidy on nav)
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('menu-open') &&
            !mobileMenu.contains(e.target) &&
            e.target !== menuToggle &&
            !menuToggle.contains(e.target)) {
          closeMenu();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('menu-open')) closeMenu();
      });
    }
  }

  // ---------- SCROLL REVEAL (all pages) ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // Give each direct child of a `.stagger` container an incremental delay
  // so grids of cards cascade in rather than popping in all at once.
  document.querySelectorAll('.stagger').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--stagger-i', i);
    });
  });

  // ---------- FOOTER: dynamic copyright year (keeps every page in sync) ----------
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- INDEX PAGE SPECIFIC ----------
  // Hero slider
  const heroSlides = document.querySelectorAll('.hero-slide');
  const slideDots = document.querySelectorAll('.slide-dot');
  if (heroSlides.length && slideDots.length) {
    let currentSlide = 0;
    function showSlide(index) {
      heroSlides.forEach(s => s.classList.remove('active'));
      slideDots.forEach(d => d.classList.remove('active'));
      heroSlides[index].classList.add('active');
      slideDots[index].classList.add('active');
      currentSlide = index;
    }
    slideDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (!isNaN(idx)) showSlide(idx);
      });
    });
    setInterval(() => showSlide((currentSlide + 1) % heroSlides.length), 5000);
  }

  // Testimonial slider
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.querySelectorAll('.dot');
  if (testimonialTrack && testimonialDots.length) {
    let tIndex = 0;
    function moveTestimonial(index) {
      testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
      testimonialDots.forEach(d => d.classList.remove('active'));
      testimonialDots[index].classList.add('active');
      tIndex = index;
    }
    testimonialDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        if (!isNaN(idx)) moveTestimonial(idx);
      });
    });
    setInterval(() => moveTestimonial((tIndex + 1) % testimonialDots.length), 5000);
  }

  // Counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          const duration = 2000;
          const step = target / (duration / 16);
          let currentVal = 0;
          const updateCounter = () => {
            currentVal += step;
            if (currentVal < target) {
              el.innerText = Math.floor(currentVal);
              requestAnimationFrame(updateCounter);
            } else {
              el.innerText = target;
            }
          };
          updateCounter();
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // Notice Modal (index page)
  const noticeModal = document.getElementById('noticeModal');
  const closeNoticeBtn = document.getElementById('closeNoticeBtn');
  if (noticeModal && closeNoticeBtn) {
    // Show modal after preloader (handled by preloader delay + modal activation)
    // Activation is done in window load, but we can also ensure it's shown.
    // In original index, modal is shown after preloader hides.
    // We'll add an extra trigger on load to ensure it's visible (preloader hides then modal active)
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (noticeModal) noticeModal.classList.add('active');
      }, 800);
    });
    closeNoticeBtn.addEventListener('click', () => {
      noticeModal.classList.remove('active');
    });
    noticeModal.addEventListener('click', (e) => {
      if (e.target === noticeModal) noticeModal.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && noticeModal.classList.contains('active')) {
        noticeModal.classList.remove('active');
      }
    });
  }

  // Partner grayscale to color on click (index)
  const partnerImages = document.querySelectorAll('.partner-img');
  partnerImages.forEach(img => {
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!this.classList.contains('original-color')) {
        this.classList.add('original-color');
      }
      this.style.transform = 'scale(0.98)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });

  // ---------- NOTICES & DOWNLOADS (index page) ----------
  // Tags any notice-card dated within the last 30 days as "NEW" (via CSS ::after ribbon)
  // and rewrites the raw ISO date into a friendlier display format.
  const noticeCards = document.querySelectorAll('.notice-card[data-date]');
  if (noticeCards.length) {
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const dateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    noticeCards.forEach(card => {
      const raw = card.dataset.date;
      const parsed = new Date(raw);
      if (isNaN(parsed)) return;

      const ageDays = (now - parsed) / msPerDay;
      if (ageDays >= 0 && ageDays <= 30) {
        card.classList.add('is-new');
      }

      const dateEl = card.querySelector('.notice-date');
      if (dateEl) dateEl.textContent = dateFormatter.format(parsed);
    });
  }

  // ---------- CONTACT PAGE ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message. We will get back to you soon!');
      contactForm.reset();
    });
  }

  // ---------- GALLERY LIGHTBOX ----------
  const galleryItems = document.querySelectorAll('.modern-card[data-gallery]');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightboxBtn = document.getElementById('closeLightbox');
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  const thumbnailStrip = document.getElementById('thumbnailStrip');
  const autoplayBtn = document.getElementById('autoplayBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const pageIndicator = document.getElementById('pageIndicator');

  if (lightbox && galleryItems.length) {
    let currentImages = [];
    let currentIndex = 0;
    let autoplayInterval = null;

    function getImageUrls(galleryId) {
      const container = document.getElementById(galleryId);
      if (!container) return [];
      return Array.from(container.querySelectorAll('img')).map(img => img.src);
    }

    function showImage() {
      if (!currentImages.length) return;
      lightboxImage.src = currentImages[currentIndex];
      if (downloadBtn) downloadBtn.href = currentImages[currentIndex];
      if (pageIndicator) pageIndicator.textContent = `${currentIndex+1} / ${currentImages.length}`;
      renderThumbnails();
    }

    function renderThumbnails() {
      if (!thumbnailStrip) return;
      thumbnailStrip.innerHTML = '';
      currentImages.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = `w-10 h-10 md:w-12 md:h-12 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${idx === currentIndex ? 'border-blue-500 scale-105 ring-2 ring-blue-300' : 'border-transparent opacity-80 hover:opacity-100'}`;
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = idx;
          showImage();
        });
        thumbnailStrip.appendChild(thumb);
      });
      const activeThumb = thumbnailStrip.children[currentIndex];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function closeLightbox() {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        updateAutoplayButton();
      }
    }

    function updateAutoplayButton() {
      if (!autoplayBtn) return;
      if (autoplayInterval) {
        autoplayBtn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
        autoplayBtn.setAttribute('title', 'Stop slideshow');
      } else {
        autoplayBtn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
        autoplayBtn.setAttribute('title', 'Autoplay slideshow (2.5s)');
      }
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const galleryId = `gallery-${item.dataset.gallery}`;
        currentImages = getImageUrls(galleryId);
        if (currentImages.length === 0) return;
        currentIndex = 0;
        showImage();
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
          updateAutoplayButton();
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentImages.length) {
          currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
          showImage();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentImages.length) {
          currentIndex = (currentIndex + 1) % currentImages.length;
          showImage();
        }
      });
    }
    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (lightbox && !lightbox.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
      }
    });
    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => {
        if (!currentImages.length) return;
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
        } else {
          autoplayInterval = setInterval(() => {
            if (currentImages.length) {
              currentIndex = (currentIndex + 1) % currentImages.length;
              showImage();
            }
          }, 2500);
        }
        updateAutoplayButton();
      });
    }
  }

  // ---------- TEAMS PAGE: TABS ----------
  const teamTabs = document.querySelectorAll('.team-tab');
  const teamContents = document.querySelectorAll('.team-content');
  if (teamTabs.length && teamContents.length) {
    teamTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        teamTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        teamContents.forEach(c => c.classList.add('hidden'));
        const targetId = tab.dataset.tab;
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.remove('hidden');
          // Re-trigger reveal animations inside new content
          targetContent.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), 20);
          });
        }
      });
    });
  }

  // ---------- FAQ PAGE: No additional JS needed (details element works natively) ----------

  // ---------- SECURITY: Disable right-click and devtools shortcuts ----------
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) e.preventDefault();
    if (e.ctrlKey && e.key === 'u') e.preventDefault();
  });

})();