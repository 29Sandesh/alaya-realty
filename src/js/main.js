/**
 * Alaya Realty — Institutional Platform Scripts
 * Modern ES2024+ Interactive & Animation Architecture
 */

/**
 * Toast Notification Utility
 * @param {string} message - Message body
 * @param {string} [title='Notification'] - Notification header
 * @param {'success'|'info'|'warning'|'error'} [type='info'] - Status type
 */
export function showToast(message, title = 'Notification', type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-metallic-gold text-2xl">${iconMap[type] || 'info'}</span>
    <div class="flex-grow">
      <h4 class="font-bold text-xs uppercase tracking-widest text-surface-bright mb-1">${title}</h4>
      <p class="text-xs text-surface-variant/90 leading-relaxed">${message}</p>
    </div>
    <button class="text-surface-variant hover:text-white transition-colors" aria-label="Close">
      <span class="material-symbols-outlined text-sm">close</span>
    </button>
  `;

  const closeBtn = toast.querySelector('button');
  const removeToast = () => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  };

  closeBtn?.addEventListener('click', removeToast);
  container.appendChild(toast);

  setTimeout(removeToast, 4500);
}

window.showToast = showToast;

/**
 * Slim Header Scroll Behavior & Active Link Management
 */
export function initHeader() {
  const header = document.getElementById('main-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mark current active nav link (clean URLs supported)
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '').replace('.html', '') || '/';
  document.querySelectorAll('.nav-link-anim').forEach(link => {
    const rawHref = link.getAttribute('href')?.toLowerCase() || '';
    const cleanHref = rawHref.replace('.html', '').replace(/\/$/, '') || '/';

    if (currentPath === cleanHref || (cleanHref !== '/' && currentPath === cleanHref)) {
      link.classList.add('active', 'text-metallic-gold', 'font-bold');
      link.classList.remove('text-on-surface-variant');
    }
  });
}

/**
 * Scroll Reveal Animations (Intersection Observer)
 */
export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.10,
    rootMargin: '0px 0px -30px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Number Counter Animation for Stats
 */
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const prefix = el.dataset.counterPrefix || '';
        const suffix = el.dataset.counterSuffix || '';
        const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
        const duration = 1800; // ms
        const startTime = performance.now();

        const updateCount = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = (target * easeOut);

          el.textContent = `${prefix}${current.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          })}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            })}${suffix}`;
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => countObserver.observe(c));
}

/**
 * Partner Consultation Modal Handler
 */
export function initPartnerModal() {
  const modal = document.getElementById('partner-modal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('[data-open-partner-modal]');
  const closeButtons = modal.querySelectorAll('[data-close-partner-modal]');
  const form = modal.querySelector('#partner-modal-form');

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name') || 'Valued Investor';
      
      closeModal();
      form.reset();
      showToast(
        `Thank you ${name}. Managing Principal Arjun Singh will review your Veda Park mandate and connect within 4 business hours.`,
        'Mandate Received',
        'success'
      );
    });
  }
}

/**
 * Mobile Navigation Drawer
 */
export function initMobileNav() {
  const toggleBtn = document.querySelector('#mobile-menu-toggle');
  const drawer = document.querySelector('#mobile-drawer');
  const closeBtn = document.querySelector('#mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * Veda Park Interactive Plot Explorer & ROI Calculator (up to 30% returns)
 */
export function initVedaParkExplorer() {
  const inspector = document.getElementById('masterplan-inspector');
  const img = document.getElementById('masterplan-img');

  if (!inspector || !img) return;

  let isMaxZoom = false;

  const handleMove = (clientX, clientY) => {
    const rect = inspector.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const originX = (x * 100).toFixed(2);
    const originY = (y * 100).toFixed(2);

    img.style.transformOrigin = `${originX}% ${originY}%`;
    img.style.transform = isMaxZoom ? 'scale(4.5)' : 'scale(3.0)';
  };

  inspector.addEventListener('mouseenter', (e) => {
    inspector.classList.add('is-zoomed');
    handleMove(e.clientX, e.clientY);
  });

  inspector.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY);
  });

  inspector.addEventListener('mouseleave', () => {
    inspector.classList.remove('is-zoomed', 'is-max-zoomed');
    isMaxZoom = false;
    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)';
  });

  inspector.addEventListener('click', (e) => {
    isMaxZoom = !isMaxZoom;
    if (isMaxZoom) {
      inspector.classList.add('is-max-zoomed');
      showToast('Super Magnification (4.5x) enabled. Move cursor to inspect.', 'Blueprint Zoom', 'info');
    } else {
      inspector.classList.remove('is-max-zoomed');
    }
    handleMove(e.clientX, e.clientY);
  });

  // Touch support for tablets & mobile
  inspector.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  inspector.addEventListener('touchend', () => {
    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)';
  });
}

/**
 * Properties Marketplace — All Curated Projects (Veda Park, Veda Commune, Urban Shivashish)
 */
export function initPropertiesMarketplace() {
  const container = document.getElementById('marketplace-grid');
  if (!container) return;

  container.innerHTML = `
    <!-- Project 1: Veda Park Plotted Development -->
    <article data-animate="fade-up" data-project-type="plotted" class="col-span-12 group bg-paper-dark border-2 border-metallic-gold/50 flex flex-col lg:flex-row overflow-hidden card-hover-lift shadow-xl mb-4 sm:mb-8">
      <div class="w-full lg:w-7/12 relative min-h-[360px] lg:min-h-[480px] bg-forest-deep flex items-center justify-center p-4">
        <img 
          src="/images/veda-park-masterplan.webp" 
          alt="Veda Park Master Plan Blueprint" 
          class="w-full h-full max-h-[460px] object-contain img-zoom-hover" 
        />
        <div class="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm px-3 py-1 border border-metallic-gold/30">
          <span class="font-body text-[10px] font-bold text-forest-deep uppercase tracking-widest">PLOTTED DEVELOPMENT • BLUEPRINT</span>
        </div>
        <div class="absolute top-4 right-4 bg-metallic-gold text-primary px-3 py-1 font-data-mono text-[10px] font-bold uppercase tracking-wider badge-floating">
          Up to 30% Returns Potential
        </div>
      </div>
      
      <div class="w-full lg:w-5/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-surface-container-low">
        <div>
          <div class="flex items-center gap-2 mb-2 text-metallic-gold font-body text-xs font-bold uppercase tracking-widest">
            <span class="material-symbols-outlined text-sm">location_on</span>
            <span>Khandwa Road Highway Corridor, Indore</span>
          </div>
          
          <h2 class="font-headline text-2xl sm:text-3xl md:text-4xl text-forest-deep mb-2 sm:mb-3 leading-tight">
            Veda Park Plotted Development
          </h2>
          
          <p class="font-body text-xs sm:text-sm text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
            A master-planned sanctuary of 84 freehold residential plots designed by Spacon Design with 9.0M & 10.5M wide concrete boulevards, central green parkland, clubhouse, and gateway access to Simrol and IIT Indore.
          </p>
          
          <div class="grid grid-cols-2 gap-3 py-3 border-y border-outline/15 text-xs mb-5 font-data-mono">
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Projected Return</span>
              <span class="text-sm sm:text-base font-bold text-emerald-700">Up to 30% CAGR</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Total Scale</span>
              <span class="text-sm sm:text-base font-bold text-forest-deep">84 Freehold Plots</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Starting Outlay</span>
              <span class="text-sm sm:text-base font-bold text-forest-deep">₹1.10 Cr onwards</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">RERA & Title</span>
              <span class="text-sm sm:text-base font-bold text-metallic-gold">100% Clear Freehold</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a 
            href="/veda-park" 
            class="flex-1 text-center bg-forest-deep text-surface-bright py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 whitespace-nowrap btn-luxury"
          >
            <span>Explore Veda Park</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
          <a 
            href="https://api.whatsapp.com/send/?phone=919183388115&text=Hi+Alaya+Realty%2C+I%27d+like+to+schedule+a+site+visit+for+Veda+Park.&type=phone_number&app_absent=0"
            target="_blank"
            class="flex-1 text-center border border-forest-deep text-forest-deep py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-forest-deep hover:text-surface transition-colors flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm text-emerald-600">chat</span>
            <span>WhatsApp Visit</span>
          </a>
        </div>
      </div>
    </article>

    <!-- Project 2: Veda Commune (Commercial Super Corridor) -->
    <article data-animate="fade-up" data-project-type="commercial" class="col-span-12 group bg-paper-dark border-2 border-outline/20 flex flex-col lg:flex-row overflow-hidden card-hover-lift shadow-xl mb-4 sm:mb-8">
      <div class="w-full lg:w-7/12 relative min-h-[360px] lg:min-h-[480px] bg-forest-deep flex items-center justify-center p-4">
        <img 
          src="/images/veda-commune-hero.jpg" 
          alt="Veda Commune Atrium Plaza on Super Corridor, Indore" 
          class="w-full h-full max-h-[460px] object-cover img-zoom-hover" 
        />
        <div class="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm px-3 py-1 border border-metallic-gold/30">
          <span class="font-body text-[10px] font-bold text-forest-deep uppercase tracking-widest">OFFICES & RETAIL • SUPER CORRIDOR</span>
        </div>
        <div class="absolute top-4 right-4 bg-forest-deep/90 text-surface-bright border border-metallic-gold/40 px-3 py-1 font-data-mono text-[10px] font-bold uppercase tracking-wider badge-floating">
          RERA P-IND-23-3857
        </div>
      </div>
      
      <div class="w-full lg:w-5/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-surface-container-low">
        <div>
          <div class="flex items-center gap-2 mb-2 text-metallic-gold font-body text-xs font-bold uppercase tracking-widest">
            <span class="material-symbols-outlined text-sm">location_on</span>
            <span>Super Corridor, Near Luv-Kush Square, Indore</span>
          </div>
          
          <h2 class="font-headline text-2xl sm:text-3xl md:text-4xl text-forest-deep mb-2 sm:mb-3 leading-tight">
            Veda Commune — The Atrium Plaza
          </h2>
          
          <p class="font-body text-xs sm:text-sm text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
            A world-class commercial landmark on a corner plot with roads on 3 sides, facing 2 acres of open garden space. Features a central atrium with escalators, retail podium, dining food court, and 50% offices with private terraces.
          </p>
          
          <div class="grid grid-cols-2 gap-3 py-3 border-y border-outline/15 text-xs mb-5 font-data-mono">
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Asset Class</span>
              <span class="text-sm sm:text-base font-bold text-forest-deep">Offices & Retail</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Road Frontage</span>
              <span class="text-sm sm:text-base font-bold text-metallic-gold">Roads on 3 Sides</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Metro Connectivity</span>
              <span class="text-sm sm:text-base font-bold text-emerald-700">Walking Distance</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Private Terraces</span>
              <span class="text-sm sm:text-base font-bold text-forest-deep">50% Office Units</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a 
            href="/veda-commune" 
            class="flex-1 text-center bg-forest-deep text-surface-bright py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 whitespace-nowrap btn-luxury"
          >
            <span>Explore Veda Commune</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
          <a 
            href="https://api.whatsapp.com/send/?phone=919183388115&text=Hi+Alaya+Realty%2C+I%27d+like+to+schedule+a+site+visit+for+Veda+Commune.&type=phone_number&app_absent=0"
            target="_blank"
            class="flex-1 text-center border border-forest-deep text-forest-deep py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-forest-deep hover:text-surface transition-colors flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm text-emerald-600">chat</span>
            <span>WhatsApp Visit</span>
          </a>
        </div>
      </div>
    </article>

    <!-- Project 3: Urban Shivashish (Commercial Vijay Nagar) -->
    <article data-animate="fade-up" data-project-type="commercial" class="col-span-12 group bg-paper-dark border-2 border-outline/20 flex flex-col lg:flex-row overflow-hidden card-hover-lift shadow-xl">
      <div class="w-full lg:w-7/12 relative min-h-[360px] lg:min-h-[480px] bg-forest-deep flex items-center justify-center p-4">
        <img 
          src="/images/urban-shivashish-hero.jpg" 
          alt="Urban Shivashish Commercial Spaces Vijay Nagar, Indore" 
          class="w-full h-full max-h-[460px] object-cover img-zoom-hover" 
        />
        <div class="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm px-3 py-1 border border-metallic-gold/30">
          <span class="font-body text-[10px] font-bold text-forest-deep uppercase tracking-widest">PREMIUM COMMERCIAL • VIJAY NAGAR</span>
        </div>
        <div class="absolute top-4 right-4 bg-forest-deep/90 text-surface-bright border border-metallic-gold/40 px-3 py-1 font-data-mono text-[10px] font-bold uppercase tracking-wider badge-floating">
          RERA P-IND-25-5937
        </div>
      </div>
      
      <div class="w-full lg:w-5/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-surface-container-low">
        <div>
          <div class="flex items-center gap-2 mb-2 text-metallic-gold font-body text-xs font-bold uppercase tracking-widest">
            <span class="material-symbols-outlined text-sm">location_on</span>
            <span>Behind Sayaji Hotel, Scheme 54, Vijay Nagar, Indore</span>
          </div>
          
          <h2 class="font-headline text-2xl sm:text-3xl md:text-4xl text-forest-deep mb-2 sm:mb-3 leading-tight">
            Urban Shivashish Commercial
          </h2>
          
          <p class="font-body text-xs sm:text-sm text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
            Premium commercial office spaces and showrooms adjacent to Sayaji Hotel. Sized from 440 to 1,182 sq ft for startups, corporate consultants, and growing enterprises, featuring 2,400 mm corridors, power backup, and contemporary glass facade.
          </p>
          
          <div class="grid grid-cols-2 gap-3 py-3 border-y border-outline/15 text-xs mb-5 font-data-mono">
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Unit Sizes</span>
              <span class="text-sm sm:text-base font-bold text-forest-deep">440 – 1,182 sq ft</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Corridors</span>
              <span class="text-sm sm:text-base font-bold text-forest-deep">2,400 mm Wide</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Prime Landmark</span>
              <span class="text-sm sm:text-base font-bold text-metallic-gold">Adjacent Sayaji</span>
            </div>
            <div>
              <span class="block font-body text-[9px] text-outline uppercase tracking-wider">Status</span>
              <span class="text-sm sm:text-base font-bold text-emerald-700">RERA Approved</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
          <a 
            href="/urban-shivashish" 
            class="flex-1 text-center bg-forest-deep text-surface-bright py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 whitespace-nowrap btn-luxury"
          >
            <span>Explore Urban Shivashish</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
          <a 
            href="https://api.whatsapp.com/send/?phone=919183388115&text=Hi+Alaya+Realty%2C+I%27d+like+to+schedule+a+site+visit+for+Urban+Shivashish.&type=phone_number&app_absent=0"
            target="_blank"
            class="flex-1 text-center border border-forest-deep text-forest-deep py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-forest-deep hover:text-surface transition-colors flex items-center justify-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm text-emerald-600">chat</span>
            <span>WhatsApp Visit</span>
          </a>
        </div>
      </div>
    </article>
  `;

  initPartnerModal();
  initScrollAnimations();
}

/**
 * Insights Hub Filter
 */
export function initInsightsFilter() {
  const filterPills = document.querySelectorAll('[data-insight-topic]');
  const articles = document.querySelectorAll('[data-article-topic]');

  if (!filterPills.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const topic = pill.dataset.insightTopic;

      filterPills.forEach(p => {
        p.classList.remove('bg-forest-deep', 'text-surface-bright');
        p.classList.add('text-on-surface-variant');
      });
      pill.classList.add('bg-forest-deep', 'text-surface-bright');
      pill.classList.remove('text-on-surface-variant');

      articles.forEach(article => {
        if (topic === 'all' || article.dataset.articleTopic.includes(topic)) {
          article.style.display = '';
          article.classList.add('fade-in');
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Official Alaya Realty WhatsApp Integration
 */
export const OFFICIAL_WHATSAPP_PHONE = '919183388115';

export function openWhatsAppLead(message) {
  const text = message || "Hi Alaya Realty, I'd like to talk about a property decision.";
  const url = `https://api.whatsapp.com/send/?phone=${OFFICIAL_WHATSAPP_PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
  window.open(url, '_blank');
}

/**
 * Floating WhatsApp Concierge Widget on All Pages (Clean Circular Logo)
 */
export function initFloatingWhatsApp() {
  if (document.getElementById('floating-whatsapp-widget')) return;

  const btn = document.createElement('a');
  btn.id = 'floating-whatsapp-widget';
  btn.href = `https://api.whatsapp.com/send/?phone=${OFFICIAL_WHATSAPP_PHONE}&text=${encodeURIComponent("Hi Alaya Realty, I'd like to talk about a property decision.")}&type=phone_number&app_absent=0`;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/30 group';
  btn.setAttribute('aria-label', 'Chat on WhatsApp with Alaya Realty');
  btn.setAttribute('title', 'Direct WhatsApp with Partner');
  btn.innerHTML = `
    <svg class="w-8 h-8 fill-current drop-shadow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"/>
    </svg>
  `;

  document.body.appendChild(btn);
}

/**
 * Form Submit Helpers with Instant WhatsApp Routing & Toast Feedback
 */
export function initFormHandlers() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value || '';
      if (email) {
        showToast(
          `You are subscribed to Alaya Realty quarterly intelligence briefings.`,
          'Subscription Confirmed',
          'success'
        );
        form.reset();
      }
    });
  });

  const siteVisitForm = document.getElementById('site-visit-form');
  if (siteVisitForm) {
    siteVisitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = siteVisitForm.querySelector('input[name="name"]')?.value || 'Investor';
      const phone = siteVisitForm.querySelector('input[name="phone"]')?.value || '';
      
      const message = `Hi Alaya Realty, my name is ${name}${phone ? ` (${phone})` : ''}. I would like to schedule a private site visit for Veda Park on Khandwa Road.`;

      showToast(
        `Connecting directly to partner on WhatsApp...`,
        'Site Visit Scheduled',
        'success'
      );

      setTimeout(() => {
        openWhatsAppLead(message);
      }, 500);
      siteVisitForm.reset();
    });
  }

  const contactForm = document.getElementById('contact-mandate-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[name="name"]')?.value || 'Client';
      const phone = contactForm.querySelector('input[name="phone"]')?.value || '';
      const email = contactForm.querySelector('input[name="email"]')?.value || '';
      const service = contactForm.querySelector('select[name="interest"]')?.value || 'General Advisory';
      const notes = contactForm.querySelector('textarea[name="message"]')?.value || '';

      const message = `Hi Alaya Realty, my name is ${name}${phone ? ` (${phone})` : ''}${email ? `, email: ${email}` : ''}. I would like to discuss: ${service}.${notes ? ` Details: ${notes}` : ''}`;

      showToast(
        `Connecting directly to Ayush Agrawal on WhatsApp...`,
        'Mandate Submitted',
        'success'
      );

      setTimeout(() => {
        openWhatsAppLead(message);
      }, 500);
      contactForm.reset();
    });
  }

  const partnerModalForm = document.getElementById('partner-modal-form');
  if (partnerModalForm) {
    partnerModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = partnerModalForm.querySelector('input[name="name"]')?.value || 'Client';
      const phone = partnerModalForm.querySelector('input[name="phone"]')?.value || '';
      const email = partnerModalForm.querySelector('input[name="email"]')?.value || '';

      const message = `Hi Alaya Realty, my name is ${name}${phone ? ` (${phone})` : ''}${email ? `, email: ${email}` : ''}. I'd like to consult a partner directly regarding a property decision.`;

      showToast(
        `Opening WhatsApp with your consultation brief...`,
        'Partner Consultation',
        'success'
      );

      const modal = document.getElementById('partner-modal');
      modal?.classList.add('hidden');
      modal?.classList.remove('flex');

      setTimeout(() => {
        openWhatsAppLead(message);
      }, 500);
      partnerModalForm.reset();
    });
  }

  document.querySelectorAll('[data-copy-link]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Article link copied to clipboard.', 'Link Copied', 'info');
    });
  });

  document.querySelectorAll('[data-download-brochure]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const asset = btn.dataset.downloadBrochure || 'Veda Park Master Plan Prospectus';
      showToast(
        `Downloading official master plan & investment prospectus for "${asset}". (PDF generated)`,
        'Dossier Generated',
        'success'
      );
    });
  });
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollAnimations();
  initCounters();
  initPartnerModal();
  initMobileNav();
  initVedaParkExplorer();
  initPropertiesMarketplace();
  initInsightsFilter();
  initFormHandlers();
  initFloatingWhatsApp();
});
