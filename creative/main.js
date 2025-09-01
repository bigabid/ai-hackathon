/* Minimal, dependency-free MRAID bootstrap + swipe deck */
(function() {
  'use strict';

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    mraidReady: false,
    viewable: false,
    config: null,
    currentIndex: 0,
    mraidTimeoutId: null
  };

  const firedEventKeys = new Set();

  function replaceMacros(url, extra) {
    const base = {
      CACHEBUSTER: cachebuster()
    };
    const macros = Object.assign({}, base, extra || {});
    return String(url).replace(/\{([A-Z0-9_]+)\}/g, (m, key) => {
      return Object.prototype.hasOwnProperty.call(macros, key) ? String(macros[key]) : m;
    });
  }

  function cachebuster() { return String(Date.now()) + Math.floor(Math.random() * 100000); }
  function firePixels(urls, extraMacros) {
    if (!urls || !urls.length) return;
    urls.forEach(url => {
      const u = replaceMacros(url, extraMacros);
      const img = new Image();
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer-when-downgrade';
      img.src = u;
    });
  }

  function sendPixelsOnce(eventKey, urls, extraMacros) {
    if (firedEventKeys.has(eventKey)) return;
    firedEventKeys.add(eventKey);
    // Debounce microtask to coalesce multiple calls in same tick
    setTimeout(() => firePixels(urls, extraMacros), 0);
  }

  function mraidOpen(url) {
    if (window.mraid && state.mraidReady) {
      try { window.mraid.open(url); return; } catch (_) {}
    }
    window.open(url, '_blank');
  }

  function onReady() {
    const btnClose = qs('#btn-close');
    btnClose.addEventListener('click', () => {
      if (window.mraid && state.mraidReady) {
        try { window.mraid.close(); } catch (_) {}
      } else {
        // In non-MRAID, just hide
        qs('#ad-root').classList.add('hidden');
      }
    }, { passive: true });

    loadConfig().then(cfg => {
      state.config = cfg;
      initDeck(cfg.cards || []);
      wireCTA();
      // Impression on viewable or immediate fallback
      if (window.mraid && state.mraidReady) {
        if (window.mraid.isViewable && window.mraid.isViewable()) {
          sendPixelsOnce('impression', cfg?.tracking?.impression);
        } else {
          document.addEventListener('mraidViewable', () => sendPixelsOnce('impression', cfg?.tracking?.impression), { once: true });
        }
      } else {
        sendPixelsOnce('impression', cfg?.tracking?.impression);
      }
    });
  }

  async function loadConfig() {
    try {
      const res = await fetch('config.json', { cache: 'no-store' });
      return await res.json();
    } catch (e) {
      return { cards: [], tracking: {} };
    }
  }

  function wireCTA() {
    const cta = qs('#cta');
    function handler() {
      const card = currentCard();
      const url = card?.ctaUrl || 'https://example.com';
      const key = `click-${state.currentIndex}`;
      sendPixelsOnce(key, state.config?.tracking?.click);
      mraidOpen(url);
    }
    cta.addEventListener('click', handler);
    cta.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  }

  function currentCard() {
    return state.config?.cards?.[state.currentIndex];
  }

  function initDeck(cards) {
    const deck = qs('#deck');
    deck.innerHTML = '';
    const toRender = cards.slice(0, 3);
    for (let i = 0; i < toRender.length; i++) {
      const c = toRender[i];
      const el = createCardElement(c, i);
      deck.appendChild(el);
    }
    // Preload next images
    preloadNextImages(cards);
    updateCTA();
  }

  function createCardElement(card, depthIndex) {
    const el = document.createElement('div');
    el.className = 'card';
    el.style.zIndex = String(3 - depthIndex);

    const img = new Image();
    img.src = card.image;
    img.alt = card.headline || 'Card';
    el.appendChild(img);

    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = card.headline || '';
    const body = document.createElement('div');
    body.className = 'body';
    body.textContent = card.body || '';
    content.appendChild(title);
    content.appendChild(body);
    el.appendChild(content);

    if (depthIndex === 0) enableDrag(el);
    return el;
  }

  function preloadNextImages(cards) {
    const next = cards.slice(state.currentIndex + 1, state.currentIndex + 3);
    next.forEach(c => { const i = new Image(); i.src = c.image; });
  }

  function updateCTA() {
    const card = currentCard();
    qs('#cta-text').textContent = card?.ctaText || 'Learn More';
  }

  function enableDrag(cardEl) {
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let rafId = null;

    function onPointerDown(e) {
      dragging = true;
      startX = getX(e);
      currentX = startX;
      cardEl.setPointerCapture?.(e.pointerId);
      rafId = requestAnimationFrame(update);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      currentX = getX(e);
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      cancelAnimationFrame(rafId);
      const deltaX = currentX - startX;
      const width = cardEl.clientWidth;
      const threshold = width * 0.25;
      if (Math.abs(deltaX) > threshold) {
        const dir = deltaX > 0 ? 'right' : 'left';
        completeDismiss(cardEl, dir);
      } else {
        cardEl.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
        cardEl.style.transform = 'translate3d(0,0,0) rotate(0)';
        setTimeout(() => { cardEl.style.transition = ''; }, 240);
      }
    }

    function update() {
      if (dragging) {
        const deltaX = currentX - startX;
        const rot = Math.max(-12, Math.min(12, (deltaX / cardEl.clientWidth) * 18));
        cardEl.style.transform = `translate3d(${deltaX}px,0,0) rotate(${rot}deg)`;
        rafId = requestAnimationFrame(update);
      }
    }

    cardEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
  }

  function completeDismiss(cardEl, dir) {
    const off = dir === 'right' ? window.innerWidth : -window.innerWidth;
    cardEl.style.transition = 'transform 220ms cubic-bezier(.2,.8,.2,1)';
    cardEl.style.transform = `translate3d(${off}px,0,0) rotate(${dir === 'right' ? 18 : -18}deg)`;
    setTimeout(() => {
      cardEl.remove();
      onCardDismissed(dir);
    }, 230);
  }

  function onCardDismissed(dir) {
    const cards = state.config.cards;
    const track = dir === 'right' ? state.config?.tracking?.swipeRight : state.config?.tracking?.swipeLeft;
    const key = `${dir}-${state.currentIndex}`;
    sendPixelsOnce(key, track);

    state.currentIndex += 1;
    if (state.currentIndex >= cards.length) {
      renderEndCard();
      return;
    }
    const deck = qs('#deck');
    // Re-render top three
    deck.innerHTML = '';
    const toRender = cards.slice(state.currentIndex, state.currentIndex + 3);
    toRender.forEach((c, i) => deck.appendChild(createCardElement(c, i)));
    preloadNextImages(cards);
    updateCTA();
  }

  function renderEndCard() {
    const deck = qs('#deck');
    deck.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'card';
    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = 'Thanks for exploring!';
    const body = document.createElement('div');
    body.className = 'body';
    body.textContent = 'Tap below to visit the site.';
    content.appendChild(title);
    content.appendChild(body);
    el.appendChild(content);
    deck.appendChild(el);
    qs('#cta-text').textContent = 'Visit Site';
  }

  function getX(e) { return (e.touches ? e.touches[0].clientX : (e.clientX ?? 0)); }

  // MRAID bootstrap
  function initMraid() {
    if (window.mraid) {
      if (window.mraid.getState && window.mraid.getState() === 'loading') {
        window.mraid.addEventListener('ready', onMraidReady);
      } else {
        onMraidReady();
      }
    } else {
      // Fallback timeout
      state.mraidTimeoutId = setTimeout(() => {
        onReady();
      }, 750);
      // If mraid appears late, switch
      Object.defineProperty(window, 'mraid', {
        set(v) { this._mraid = v; try { clearTimeout(state.mraidTimeoutId); } catch(_){}; onMraidReady(); },
        get() { return this._mraid; },
        configurable: true
      });
    }
  }

  function onMraidReady() {
    try { window.mraid.removeEventListener('ready', onMraidReady); } catch (_) {}
    state.mraidReady = true;
    try {
      window.mraid.addEventListener('viewableChange', v => {
        state.viewable = !!v;
        const ev = new Event('mraidViewable');
        document.dispatchEvent(ev);
      });
      window.mraid.addEventListener('stateChange', () => {});
      window.mraid.addEventListener('sizeChange', () => { updateLayout(); });
      window.mraid.addEventListener('error', () => {});
    } catch (_) {}
    onReady();
    updateLayout();
  }

  // Kickoff
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initMraid();
    window.addEventListener('resize', updateLayout, { passive: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => { initMraid(); window.addEventListener('resize', updateLayout, { passive: true }); });
  }

  function updateLayout() {
    const root = qs('#ad-root');
    if (!root) return;
    const w = window.innerWidth || root.clientWidth;
    const h = window.innerHeight || root.clientHeight;
    root.classList.remove('banner-mode', 'portrait-mode', 'rectangle-mode');
    if (h <= 90) {
      root.classList.add('banner-mode');
    } else if (h >= 380 && (h / Math.max(1, w)) > 0.9) {
      root.classList.add('portrait-mode');
    } else {
      root.classList.add('rectangle-mode');
    }
  }
})();


