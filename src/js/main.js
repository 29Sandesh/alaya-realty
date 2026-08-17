/**
 * Alaya Realty — Institutional Platform Scripts
 * Modern ES2024+ Vanilla JS Architecture
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
      <h4 class="font-bold text-sm uppercase tracking-wider text-surface-bright mb-1">${title}</h4>
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

// Make globally available
window.showToast = showToast;

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
        `Thank you ${name}. Managing Principal Arjun Singh or Head of Strategy Elena Rostova will review your mandate and connect within 4 business hours.`,
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
 * Veda Park Interactive Plot Explorer & ROI Calculator
 */
export function initVedaParkExplorer() {
  const plotGrid = document.getElementById('plot-grid-container');
  const plotDetailCard = document.getElementById('selected-plot-details');
  const plotSelectInput = document.getElementById('enquiry-plot-select');
  const roiCalculator = document.getElementById('veda-roi-calculator');

  if (!plotGrid && !roiCalculator) return;

  // Generate 88 realistic plots data across 4 sectors
  const plots = [];
  const sectors = ['A', 'B', 'C', 'D'];
  const facings = ['North (Vaastu)', 'East (Morning Light)', 'North-East (Ishanya)', 'North-West'];
  const sizes = [2400, 3200, 4500, 6000, 8500, 10000];

  for (let i = 1; i <= 88; i++) {
    const sector = sectors[Math.floor((i - 1) / 22)];
    const size = sizes[(i * 7) % sizes.length];
    // status distribution: mostly available, some reserved, some sold
    let status = 'available';
    if (i % 5 === 0) status = 'sold';
    else if (i % 7 === 0) status = 'reserved';

    const baseRatePerSqFt = 4250; // INR per sq.ft
    const price = (size * baseRatePerSqFt) / 10000000; // in Cr

    plots.push({
      id: i,
      plotNumber: `VP-${sector}-${String((i - 1) % 22 + 1).padStart(2, '0')}`,
      sector: `Sector ${sector}`,
      size: size,
      facing: facings[i % facings.length],
      priceCr: price.toFixed(2),
      status: status,
      clubhouseDist: `${100 + (i % 6) * 45}m`
    });
  }

  // Render plot grid if present
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

    // Plot click listener
    plotGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.plot-cell');
      if (!btn || btn.disabled) return;

      const plotId = parseInt(btn.dataset.plotId, 10);
      const plot = plots.find(p => p.id === plotId);
      if (!plot) return;

      // Highlight active cell
      plotGrid.querySelectorAll('.plot-cell').forEach(c => c.classList.remove('ring-2', 'ring-metallic-gold', 'bg-metallic-gold/10'));
      btn.classList.add('ring-2', 'ring-metallic-gold', 'bg-metallic-gold/10');

      // Update detail card
      if (plotDetailCard) {
        plotDetailCard.innerHTML = `
          <div class="bg-surface-container-low p-6 border border-metallic-gold/40 fade-in">
            <div class="flex justify-between items-start border-b border-outline-variant/30 pb-4 mb-4">
              <div>
                <span class="font-label-caps text-xs text-metallic-gold uppercase tracking-widest">${plot.sector}</span>
                <h4 class="font-headline-md text-2xl text-forest-deep mt-1">${plot.plotNumber}</h4>
              </div>
              <span class="px-3 py-1 text-xs font-label-caps uppercase tracking-wider ${plot.status === 'available' ? 'bg-metallic-gold/20 text-forest-deep border border-metallic-gold' : 'bg-outline-variant/30 text-outline'}">
                ${plot.status}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p class="text-xs text-outline uppercase font-label-caps">Plot Area</p>
                <p class="font-data-mono font-bold text-base text-primary">${plot.size.toLocaleString()} sq.ft.</p>
              </div>
              <div>
                <p class="text-xs text-outline uppercase font-label-caps">Estimated Value</p>
                <p class="font-data-mono font-bold text-base text-forest-deep">₹${plot.priceCr} Cr</p>
              </div>
              <div>
                <p class="text-xs text-outline uppercase font-label-caps">Orientation</p>
                <p class="font-body-md text-on-surface">${plot.facing}</p>
              </div>
              <div>
                <p class="text-xs text-outline uppercase font-label-caps">Clubhouse</p>
                <p class="font-body-md text-on-surface">${plot.clubhouseDist}</p>
              </div>
            </div>
            <button 
              id="reserve-selected-plot-btn" 
              class="w-full bg-forest-deep text-surface-bright py-3 text-xs font-label-caps uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2"
            >
              <span>Enquire for ${plot.plotNumber}</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        `;

        const reserveBtn = document.getElementById('reserve-selected-plot-btn');
        reserveBtn?.addEventListener('click', () => {
          const nameInput = document.querySelector('#site-visit-form input[type="text"]');
          if (nameInput) {
            nameInput.scrollIntoView({ behavior: 'smooth' });
            nameInput.focus();
            showToast(`Plot ${plot.plotNumber} (${plot.size} sq.ft) pre-selected for your site visit inquiry.`, 'Plot Selected', 'info');
          } else {
            showToast(`Inquiry initiated for Plot ${plot.plotNumber}.`, 'Selected', 'info');
          }
        });
      }

      // Sync select input if exists
      if (plotSelectInput) {
        plotSelectInput.value = plot.plotNumber;
      }
    });

    // Auto-select first available plot
    const firstAvail = plots.find(p => p.status === 'available');
    if (firstAvail) {
      const firstBtn = plotGrid.querySelector(`[data-plot-id="${firstAvail.id}"]`);
      firstBtn?.click();
    }
  }

  // Interactive ROI Calculator Logic
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
      const size = parseFloat(sizeSelect?.value || '3200');
      const years = parseInt(horizonSlider?.value || '3', 10);
      const cagr = parseFloat(cagrSlider?.value || '14') / 100;

      if (horizonLabel) horizonLabel.textContent = `${years} Year${years > 1 ? 's' : ''}`;
      if (cagrLabel) cagrLabel.textContent = `${(cagr * 100).toFixed(0)}% YoY`;

      const currentVal = size * 4250; // Current base price ₹4,250/sqft
      const futureVal = currentVal * Math.pow(1 + cagr, years);
      const gain = futureVal - currentVal;

      const formatCr = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        return `₹${(val / 100000).toFixed(1)} Lakhs`;
      };

      if (resultCurrentVal) resultCurrentVal.textContent = formatCr(currentVal);
      if (resultFutureVal) resultFutureVal.textContent = formatCr(futureVal);
      if (resultAppreciation) resultAppreciation.textContent = `+${formatCr(gain)} (${((gain / currentVal) * 100).toFixed(0)}% ROI)`;
    };

    sizeSelect?.addEventListener('change', recalculate);
    horizonSlider?.addEventListener('input', recalculate);
    cagrSlider?.addEventListener('input', recalculate);
    recalculate();
  }
}

/**
 * Properties Marketplace Filter & Search Engine
 */
export function initPropertiesMarketplace() {
  const container = document.getElementById('marketplace-grid');
  const filterButtons = document.querySelectorAll('[data-asset-filter]');
  const searchInput = document.getElementById('property-search-input');
  const sortSelect = document.getElementById('property-sort-select');

  if (!container) return;

  const assets = [
    {
      id: 'veda-park',
      title: 'Veda Park Plotted Development',
      category: 'plotted',
      categoryLabel: 'Plotted Development',
      location: 'Khandwa Road, Indore',
      status: 'Now Selling',
      isFeatured: true,
      scale: '88 Plots',
      size: '2,400 – 10,000 sq.ft.',
      price: '₹1.02 Cr onwards',
      yieldPct: 14.5,
      link: '/veda-park.html',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdMQLzK0Ju_jVo4AI4E5pzeVsQ1ot9rjEJdtS4AZxGJBbQnwm_LfA1UnZTmJQhYKiib8VRN2KFVCASKZfVL3YwDLoWpRTxoFmF4tw5Cca1gCGhsQyGKV4J-QLdMuyZHDo_l6uNChfRzCWW7z_tUAhIozm6OfEUIKMlWQY6WCcdYGd-_zJTVKbXK6D3hu98s0utL5rWxrTYcY1mLgJIlfMZyAbDWhkwoqbcXqNurZGbAHOeUgDMDPa3',
      description: 'Gated plotted development planned around wide internal roads, generous green belts, and a central clubhouse with clear freehold titles.'
    },
    {
      id: 'zenith-tower',
      title: 'Zenith Institutional Business Tower',
      category: 'commercial',
      categoryLabel: 'Grade-A Commercial Office',
      location: 'AB Road / Vijay Nagar, Indore',
      status: 'Pre-Leased (Institutional Yield)',
      isFeatured: false,
      scale: '14 Floors / 185,000 sq.ft.',
      size: '12,500 – 45,000 sq.ft.',
      price: '₹18.5 Cr onwards',
      yieldPct: 9.8,
      link: '#',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3hQTjrE-siFUkyFC4Ncjn9mURbU_SEuv2wQxKtGQ8-7Vhy4GPKxIQtAOkpeLGKPYZx8cC5uhFt0aXHC_BiIJL1OsLaHFqcRB9n8bH3jhk1z5LBN5y58rgYi9CcEHV2LKikj92LF5EI__JrFds7UtfGv_zn4lEHyB66Z-rYzcifobqPkeIMBR25_N-CwjJd8YdHkdyF8lZu22Oq2fNvchdpl18ygkz4KVfP9G5UIzMckEiotcCBsDH',
      description: 'Fully pre-leased commercial tower with blue-chip IT and banking covenants offering stable 9.8% gross annual dividend yield.'
    },
    {
      id: 'super-corridor-logistics',
      title: 'Malwa Logistics & Industrial Gateway',
      category: 'industrial',
      categoryLabel: 'Industrial Logistics Land',
      location: 'Pithampur Industrial Corridor, Indore',
      status: 'Zoned & Clear Title',
      isFeatured: false,
      scale: '42 Acres Greenfield Parcel',
      size: '5 – 42 Acres',
      price: '₹28.0 Cr aggregate',
      yieldPct: 16.2,
      link: '/article-industrial.html',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbBQ39XBfH6RWsbmEVUAiidhwouLFqhBcWtkXfra3TUCkeOQI1iDI30i1kXEhifuNwwH7Qbz69Gp9ebL44nRGiDzFfoV3vF8qWayY-PYg_57cuzluB882vXv7Y3RPDLCELF3UuSjEPVnnIpN7nj7Odyi9neilaHvafVQS-9Of1CaBeqjNlRu4cWHOPeve-zX-3OCUttY26MPEUgg3MrBy6vG1o4C4mnlHgk9GjF8jRbXZ0407RxNpO',
      description: 'Strategic logistics land with direct expressway frontage, 33kV dedicated power feeder access, and warehouse entitlement clearance.'
    },
    {
      id: 'sovereign-estates',
      title: 'The Sovereign Private Residences',
      category: 'residential',
      categoryLabel: 'Bespoke Luxury Villas',
      location: 'Bicholi Mardana, Indore',
      status: 'Exclusive Mandate',
      isFeatured: false,
      scale: '16 Ultra-Luxury Estates',
      size: '6,200 – 12,000 sq.ft.',
      price: '₹4.8 Cr – ₹11.5 Cr',
      yieldPct: 11.2,
      link: '#',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCWlV0ZtIOWcyuycSOkle1bD5Dnyh_Bwnfp5KQ5iWBCArFaO6mIqg09yfxRRM5tJkadN_cQ1ooDcklbhpaPZLx6mNRKzimpa_HH6vWHZL9CZIm-RU_J-ogIWul1EJh_GqtCuNYCFswLdXhBRRmKh9-61WKv4chW9uGTRdXUqFn2h98lsoj-9_y3XeqZobHMKx3IxraxVFrpotCMd06LgHbMzvCwILzBQmAwOkobo6WVMgwOkIn4zUN',
      description: 'Private gated enclave of 16 bespoke luxury estates designed by award-winning architects with private lap pools and lush landscaped grounds.'
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'recommended';

  const render = () => {
    let filtered = assets.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery) ||
        item.location.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (currentSort === 'yield-desc') {
      filtered.sort((a, b) => b.yieldPct - a.yieldPct);
    } else if (currentSort === 'size-desc') {
      filtered.sort((a, b) => b.scale.localeCompare(a.scale));
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-12 py-16 text-center bg-surface-container-low border border-outline/10">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
          <h3 class="font-headline-md text-xl text-forest-deep mb-2">No Matching Assets Found</h3>
          <p class="text-sm text-on-surface-variant max-w-md mx-auto mb-4">We maintain confidential off-market institutional mandates not listed publicly.</p>
          <button data-open-partner-modal class="bg-forest-deep text-surface-bright px-6 py-3 font-label-caps uppercase text-xs">Request Bespoke Mandate</button>
        </div>
      `;
      initPartnerModal();
      return;
    }

    container.innerHTML = filtered.map(item => {
      const isLarge = item.isFeatured;
      return `
        <article class="${isLarge ? 'md:col-span-8' : 'md:col-span-4'} group relative bg-paper-dark border border-outline/10 flex flex-col ${isLarge ? 'md:flex-row' : ''} overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div class="${isLarge ? 'w-full md:w-1/2' : 'w-full'} relative h-64 ${isLarge ? 'md:h-auto' : ''} overflow-hidden">
            <img 
              src="${item.image}" 
              alt="${item.title}" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              loading="lazy"
            />
            <div class="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm px-3 py-1 border border-metallic-gold/30">
              <span class="font-label-caps text-[10px] text-forest-deep uppercase tracking-widest">${item.categoryLabel}</span>
            </div>
            <div class="absolute top-4 right-4 bg-forest-deep text-surface-bright px-3 py-1 font-data-mono text-[10px]">
              ${item.status}
            </div>
          </div>
          <div class="${isLarge ? 'w-full md:w-1/2 p-8' : 'p-6'} flex flex-col flex-grow justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2 text-outline">
                <span class="material-symbols-outlined text-sm">location_on</span>
                <span class="font-data-mono text-xs uppercase">${item.location}</span>
              </div>
              <h2 class="font-headline-md ${isLarge ? 'text-2xl' : 'text-xl'} text-forest-deep mb-3 leading-tight group-hover:text-metallic-gold transition-colors">
                ${item.title}
              </h2>
              <p class="font-body-md text-sm text-on-surface-variant mb-4 line-clamp-2">
                ${item.description}
              </p>
              <div class="grid grid-cols-2 gap-3 py-3 border-y border-outline/10 text-xs mb-4">
                <div>
                  <span class="block font-label-caps text-[10px] text-outline uppercase">Scale</span>
                  <span class="font-data-mono font-bold text-forest-deep">${item.scale}</span>
                </div>
                <div>
                  <span class="block font-label-caps text-[10px] text-outline uppercase">Exp. Yield / ROI</span>
                  <span class="font-data-mono font-bold text-metallic-gold">${item.yieldPct}% CAGR</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="font-data-mono text-xs font-bold text-primary">${item.price}</span>
              <a 
                href="${item.link !== '#' ? item.link : 'javascript:void(0)'}" 
                ${item.link === '#' ? 'data-open-partner-modal' : ''}
                class="inline-flex items-center gap-1 font-label-caps text-xs text-forest-deep uppercase tracking-widest hover:text-metallic-gold transition-colors"
              >
                <span>${item.link !== '#' ? 'View Asset Dossier' : 'Request Private Dossier'}</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    initPartnerModal();
  };

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('border-forest-deep', 'text-forest-deep', 'font-bold');
        b.classList.add('border-transparent', 'text-on-surface-variant');
      });
      btn.classList.add('border-forest-deep', 'text-forest-deep', 'font-bold');
      btn.classList.remove('border-transparent', 'text-on-surface-variant');
      currentCategory = btn.dataset.assetFilter;
      render();
    });
  });

  // Search Input
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    render();
  });

  // Sort Select
  sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    render();
  });

  render();
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
  // Newsletter Form
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

  // Site Visit & Contact Forms
  const siteVisitForm = document.getElementById('site-visit-form');
  if (siteVisitForm) {
    siteVisitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = siteVisitForm.querySelector('input[name="name"]')?.value || 'Investor';
      const phone = siteVisitForm.querySelector('input[name="phone"]')?.value || '';
      
      showToast(
        `Site visit itinerary scheduled for ${name}. Our partner team will reach out at ${phone} to coordinate chauffeur pickup.`,
        'Site Visit Scheduled',
        'success'
      );
      siteVisitForm.reset();
    });
  }

  // Share and Copy Link buttons
  document.querySelectorAll('[data-copy-link]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Article link copied to clipboard.', 'Link Copied', 'info');
    });
  });

  // Brochure Download Buttons
  document.querySelectorAll('[data-download-brochure]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const asset = btn.dataset.downloadBrochure || 'Alaya Realty Investment Prospectus';
      showToast(
        `Downloading institutional dossier for "${asset}". (PDF generated)`,
        'Dossier Generated',
        'success'
      );
    });
  });
}

// Global Document Lifecycle Initialization
document.addEventListener('DOMContentLoaded', () => {
  initPartnerModal();
  initMobileNav();
  initVedaParkExplorer();
  initPropertiesMarketplace();
  initInsightsFilter();
  initFormHandlers();
});
