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
  const plotGrid = document.getElementById('plot-grid-container');
  const plotDetailCard = document.getElementById('selected-plot-details');
  const plotSelectInput = document.getElementById('enquiry-plot-select');
  const roiCalculator = document.getElementById('veda-roi-calculator');

  if (!plotGrid && !roiCalculator) return;

  const plots = [];
  const dimensions = [
    { label: '13.72m × 21.00m (3,100 sq.ft)', size: 3100 },
    { label: '13.72m × 18.00m (2,658 sq.ft)', size: 2658 },
    { label: '13.72m × 17.60m (2,600 sq.ft)', size: 2600 },
    { label: '13.72m × 19.00m (2,805 sq.ft)', size: 2805 },
    { label: 'Signature Corner (4,500 sq.ft)', size: 4500 },
    { label: 'Grand Executive (6,200 sq.ft)', size: 6200 }
  ];

  const facings = ['North (Vaastu Compliant)', 'East (Morning Light)', 'North-East (Ishanya)', 'North-West (Garden Facing)'];

  // 84 numbered plots matching the architectural blueprint
  for (let i = 1; i <= 84; i++) {
    const dim = dimensions[i % dimensions.length];
    let status = 'available';
    if (i % 6 === 0) status = 'sold';
    else if (i % 8 === 0) status = 'reserved';

    const baseRatePerSqFt = 4250;
    const price = (dim.size * baseRatePerSqFt) / 10000000;
    const sectorLetter = i <= 20 ? 'A' : (i <= 44 ? 'B' : (i <= 66 ? 'C' : 'D'));

    plots.push({
      id: i,
      plotNumber: `Plot ${String(i).padStart(2, '0')}`,
      sector: `Sector ${sectorLetter}`,
      dimensions: dim.label,
      size: dim.size,
      facing: facings[i % facings.length],
      priceCr: price.toFixed(2),
      status: status,
      clubhouseDist: `${80 + (i % 7) * 35}m`
    });
  }

  if (plotGrid) {
    plotGrid.innerHTML = plots.map(p => {
      let statusClass = 'bg-surface-container hover:border-metallic-gold border border-outline-variant/40 text-primary cursor-pointer';
      let badge = '<span class="text-[9px] font-bold text-metallic-gold uppercase">Avail</span>';
      
      if (p.status === 'reserved') {
        statusClass = 'bg-outline-variant/20 border border-outline/30 text-on-surface-variant cursor-pointer';
        badge = '<span class="text-[9px] font-medium text-outline uppercase">Hold</span>';
      } else if (p.status === 'sold') {
        statusClass = 'bg-surface-dim/40 border border-outline-variant/20 text-outline line-through cursor-not-allowed opacity-40';
        badge = '<span class="text-[9px] text-outline uppercase">Sold</span>';
      }

      return `
        <button 
          data-plot-id="${p.id}" 
          class="plot-cell p-2 flex flex-col items-center justify-between text-left transition-all duration-200 rounded-none h-14 ${statusClass}"
          ${p.status === 'sold' ? 'disabled' : ''}
          title="${p.plotNumber} • ${p.size.toLocaleString()} sq.ft • ₹${p.priceCr} Cr"
        >
          <span class="font-data-mono text-[11px] font-bold">${p.plotNumber}</span>
          <div class="flex justify-between items-center w-full">
            <span class="text-[10px] text-outline">${p.size}sf</span>
            ${badge}
          </div>
        </button>
      `;
    }).join('');

    plotGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.plot-cell');
      if (!btn || btn.disabled) return;

      const plotId = parseInt(btn.dataset.plotId, 10);
      const plot = plots.find(p => p.id === plotId);
      if (!plot) return;

      plotGrid.querySelectorAll('.plot-cell').forEach(c => c.classList.remove('ring-2', 'ring-metallic-gold', 'bg-metallic-gold/15'));
      btn.classList.add('ring-2', 'ring-metallic-gold', 'bg-metallic-gold/15');

      if (plotDetailCard) {
        plotDetailCard.innerHTML = `
          <div class="bg-surface-container-low p-6 border border-metallic-gold/40 fade-in">
            <div class="flex justify-between items-start border-b border-outline-variant/30 pb-4 mb-4">
              <div>
                <span class="font-body text-xs font-bold text-metallic-gold uppercase tracking-widest">${plot.sector} • Concept Blueprint</span>
                <h4 class="font-headline text-2xl text-forest-deep mt-1">${plot.plotNumber}</h4>
              </div>
              <span class="px-3 py-1 text-xs font-body uppercase font-bold tracking-wider ${plot.status === 'available' ? 'bg-metallic-gold/20 text-forest-deep border border-metallic-gold' : 'bg-outline-variant/30 text-outline'}">
                ${plot.status}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p class="text-xs text-outline uppercase font-body">Plot Dimensions</p>
                <p class="font-data-mono font-bold text-xs text-primary">${plot.dimensions}</p>
              </div>
              <div>
                <p class="text-xs text-outline uppercase font-body">Current Valuation</p>
                <p class="font-data-mono font-bold text-base text-forest-deep">₹${plot.priceCr} Cr</p>
              </div>
              <div>
                <p class="text-xs text-outline uppercase font-body">Facing & Vaastu</p>
                <p class="font-body text-xs text-on-surface">${plot.facing}</p>
              </div>
              <div>
                <p class="text-xs text-outline uppercase font-body">Clubhouse Proximity</p>
                <p class="font-body text-xs text-on-surface">${plot.clubhouseDist} (9.0M Blvd)</p>
              </div>
            </div>
            <button 
              id="reserve-selected-plot-btn" 
              class="w-full bg-forest-deep text-surface-bright py-3 text-xs font-body uppercase font-bold tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 btn-luxury"
            >
              <span>Enquire & Reserve ${plot.plotNumber}</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        `;

        const reserveBtn = document.getElementById('reserve-selected-plot-btn');
        reserveBtn?.addEventListener('click', () => {
          const nameInput = document.querySelector('#site-visit-form input[name="name"]');
          if (nameInput) {
            nameInput.scrollIntoView({ behavior: 'smooth' });
            nameInput.focus();
            showToast(`${plot.plotNumber} (${plot.dimensions}) selected for your private site visit.`, 'Plot Selected', 'info');
          } else {
            showToast(`Inquiry initiated for ${plot.plotNumber}.`, 'Selected', 'info');
          }
        });
      }

      if (plotSelectInput) {
        plotSelectInput.value = `${plot.plotNumber} (${plot.sector})`;
      }
    });

    const firstAvail = plots.find(p => p.status === 'available');
    if (firstAvail) {
      const firstBtn = plotGrid.querySelector(`[data-plot-id="${firstAvail.id}"]`);
      firstBtn?.click();
    }
  }

  // Appreciation Calculator supporting up to 30% returns
  if (roiCalculator) {
    const sizeSelect = roiCalculator.querySelector('#calc-plot-size');
    const horizonSlider = roiCalculator.querySelector('#calc-horizon');
    const horizonLabel = roiCalculator.querySelector('#calc-horizon-val');
    const cagrSlider = roiCalculator.querySelector('#calc-cagr');
    const cagrLabel = roiCalculator.querySelector('#calc-cagr-val');

    const resultCurrentVal = roiCalculator.querySelector('#calc-current-val');
    const resultFutureVal = roiCalculator.querySelector('#calc-future-val');
    const resultAppreciation = roiCalculator.querySelector('#calc-appreciation');

    const recalculate = () => {
      const size = parseFloat(sizeSelect?.value || '2658');
      const years = parseInt(horizonSlider?.value || '3', 10);
      const cagr = parseFloat(cagrSlider?.value || '22') / 100;

      if (horizonLabel) horizonLabel.textContent = `${years} Year${years > 1 ? 's' : ''}`;
      if (cagrLabel) cagrLabel.textContent = `${(cagr * 100).toFixed(0)}% YoY Return`;

      const currentVal = size * 4250;
      const futureVal = currentVal * Math.pow(1 + cagr, years);
      const gain = futureVal - currentVal;

      const formatCr = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        return `₹${(val / 100000).toFixed(1)} Lakhs`;
      };

      if (resultCurrentVal) resultCurrentVal.textContent = formatCr(currentVal);
      if (resultFutureVal) resultFutureVal.textContent = formatCr(futureVal);
      if (resultAppreciation) {
        const totalPct = ((gain / currentVal) * 100).toFixed(0);
        resultAppreciation.textContent = `+${formatCr(gain)} (+${totalPct}% Total Return)`;
      }
    };

    sizeSelect?.addEventListener('change', recalculate);
    horizonSlider?.addEventListener('input', recalculate);
    cagrSlider?.addEventListener('input', recalculate);
    recalculate();
  }
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
 * Form Submit Helpers with Instant Toast Feedback
 */
export function initFormHandlers() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input?.value || '';
      if (email) {
        showToast(
          `You are subscribed to the Alaya Sovereign Editorial quarterly research briefings.`,
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
      
      showToast(
        `Site visit itinerary scheduled for ${name} at Veda Park. Our partner team will reach out at ${phone} to coordinate chauffeur pickup.`,
        'Site Visit Scheduled',
        'success'
      );
      siteVisitForm.reset();
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
});
