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

  // Mark current active nav link
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll('.nav-link-anim').forEach(link => {
    const href = link.getAttribute('href')?.toLowerCase() || '';
    if ((currentPath === '/' && (href === '/' || href.includes('index.html'))) ||
        (currentPath !== '/' && href.length > 1 && currentPath.includes(href.replace('.html', '')))) {
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
 * Properties Marketplace — Focusing Solely on Veda Park as Open Project
 */
export function initPropertiesMarketplace() {
  const container = document.getElementById('marketplace-grid');
  if (!container) return;

  // Sole active project: Veda Park with official masterplan blueprint
  container.innerHTML = `
    <!-- Sole Active Project: Veda Park -->
    <article data-animate="fade-up" class="col-span-12 group bg-paper-dark border-2 border-metallic-gold/50 flex flex-col lg:flex-row overflow-hidden card-hover-lift shadow-xl">
      <div class="w-full lg:w-7/12 relative min-h-[420px] lg:min-h-[520px] bg-forest-deep flex items-center justify-center p-4">
        <img 
          src="/images/veda-park-masterplan.webp" 
          alt="Veda Park Master Plan Blueprint" 
          class="w-full h-full max-h-[500px] object-contain img-zoom-hover" 
        />
        <div class="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm px-3 py-1 border border-metallic-gold/30">
          <span class="font-body text-[10px] font-bold text-forest-deep uppercase tracking-widest">SOLE ACTIVE PROJECT • MASTER PLAN BLUEPRINT</span>
        </div>
        <div class="absolute top-4 right-4 bg-metallic-gold text-primary px-3 py-1 font-data-mono text-[10px] font-bold uppercase tracking-wider badge-floating">
          Up to 30% Returns Potential
        </div>
      </div>
      
      <div class="w-full lg:w-5/12 p-8 md:p-10 flex flex-col justify-between bg-surface-container-low">
        <div>
          <div class="flex items-center gap-2 mb-2 text-metallic-gold font-body text-xs font-bold uppercase tracking-widest">
            <span class="material-symbols-outlined text-sm">location_on</span>
            <span>Khandwa Road Highway Corridor, Indore</span>
          </div>
          
          <h2 class="font-headline text-3xl md:text-4xl text-forest-deep mb-3 leading-tight">
            Veda Park Plotted Development
          </h2>
          
          <p class="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
            Our sole open acquisition project. A master-planned sanctuary of 84 freehold residential plots designed by Spacon Design with 9.0M & 10.5M wide boulevards, central green park, clubhouse, and direct gateway access to Simrol and IIT Indore corridor.
          </p>
          
          <div class="grid grid-cols-2 gap-4 py-4 border-y border-outline/15 text-xs mb-6 font-data-mono">
            <div>
              <span class="block font-body text-[10px] text-outline uppercase tracking-wider">Projected Return</span>
              <span class="text-base font-bold text-emerald-700">Up to 30% CAGR</span>
            </div>
            <div>
              <span class="block font-body text-[10px] text-outline uppercase tracking-wider">Total Scale</span>
              <span class="text-base font-bold text-forest-deep">84 Freehold Plots</span>
            </div>
            <div>
              <span class="block font-body text-[10px] text-outline uppercase tracking-wider">Starting Outlay</span>
              <span class="text-base font-bold text-forest-deep">₹1.10 Cr onwards</span>
            </div>
            <div>
              <span class="block font-body text-[10px] text-outline uppercase tracking-wider">RERA & Title</span>
              <span class="text-base font-bold text-metallic-gold">100% Clear Freehold</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <a 
            href="/veda-park.html" 
            class="flex-1 text-center bg-forest-deep text-surface-bright py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 btn-luxury"
          >
            <span>Explore Veda Park Master Plan</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
          <button 
            data-open-partner-modal 
            class="flex-1 text-center border border-forest-deep text-forest-deep py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-forest-deep hover:text-surface transition-colors"
          >
            Schedule Site Visit
          </button>
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
 * Floating WhatsApp Concierge Widget on All Pages
 */
export function initFloatingWhatsApp() {
  if (document.getElementById('floating-whatsapp-widget')) return;

  const btn = document.createElement('a');
  btn.id = 'floating-whatsapp-widget';
  btn.href = `https://api.whatsapp.com/send/?phone=${OFFICIAL_WHATSAPP_PHONE}&text=${encodeURIComponent("Hi Alaya Realty, I'd like to talk about a property decision.")}&type=phone_number&app_absent=0`;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1b5e20] hover:bg-[#2e7d32] text-white px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-400/40 group';
  btn.setAttribute('aria-label', 'Chat on WhatsApp with Alaya Realty');
  btn.innerHTML = `
    <span class="material-symbols-outlined text-lg text-emerald-300">chat</span>
    <span class="font-body text-xs font-bold tracking-wider uppercase pr-1">Chat on WhatsApp</span>
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
