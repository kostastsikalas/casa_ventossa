(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isTouch = matchMedia('(hover:none)').matches;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------------- Config: booking links ---------------- */
  const LISTINGS = {
    booking: (lang) => `https://www.booking.com/hotel/gr/cassa-ventossa-mochlos.${lang === 'el' ? 'el' : 'en-gb'}.html`,
    airbnb: (lang) => `https://www.airbnb.${lang === 'el' ? 'gr' : 'com'}/rooms/1400128932687620276`,
  };
  const MAX_GUESTS = 4;

  /* ---------------- i18n ---------------- */
  const EN = {
    'nav.about': 'The house', 'nav.spaces': 'Spaces', 'nav.gallery': 'Gallery', 'nav.location': 'Mochlos', 'nav.reviews': 'Reviews',
    'cta.book': 'Book', 'cta.bookNow': 'Book your stay', 'cta.checkAvail': 'Check availability', 'cta.photos': 'Photos',
    'hero.eyebrow': 'Mochlos · Lasithi · Crete', 'hero.sub': 'A hillside home where the wind meets the sea of Mochlos.', 'hero.scroll': 'Scroll',
    'about.eyebrow': 'The house', 'about.title': 'Live Mochlos <em>from above</em>',
    'about.p1': 'Cassa Ventossa sits on the hillside above the fishing village of Mochlos, with the sea spread out before you and the islet mirrored in the bay.',
    'about.p2': 'A warm, bright home with wooden ceilings, a stone fireplace and a covered veranda overlooking the sea. A fully equipped kitchen, two bedrooms and everything you need to unwind at your own pace — minutes from the village tavernas and the water.',
    'facts.guests': 'Guests', 'facts.bedrooms': 'Bedrooms', 'facts.beds': 'Beds', 'facts.bath': 'Bathroom',
    'am.view': 'Sea & mountain view', 'am.whole': 'Entire home', 'am.kitchen': 'Equipped kitchen', 'am.fire': 'Stone fireplace', 'am.ac': 'Air conditioning', 'am.veranda': 'Covered veranda', 'am.beach': 'Beach access',
    'spaces.eyebrow': 'The spaces', 'spaces.title': 'Every corner, <em>made for slowing down</em>',
    'sp.living': 'Living room & fireplace', 'sp.livingP': 'Velvet sofas, a stone fireplace and light pouring in from every side.',
    'sp.master': 'Master bedroom', 'sp.masterP': 'Double bed, air conditioning and a door opening onto the veranda.',
    'sp.bed2': 'Second bedroom', 'sp.bed2P': 'Two single beds — perfect for kids or friends.',
    'sp.kitchen': 'Kitchen', 'sp.kitchenP': 'Fully equipped, ready for cooking with local produce.',
    'sp.veranda': 'Veranda with a view', 'sp.verandaP': 'Morning coffee and sunsets over the Cretan Sea.',
    'sp.bath': 'Bathroom', 'sp.bathP': 'Clean and bright, with a shower and all the essentials.',
    'quote.text': '“Few homes greet you with a view like this every morning.”',
    'gal.eyebrow': 'Gallery', 'gal.title': 'Glimpses of <em>the house</em>',
    'f.all': 'All', 'f.living': 'Living', 'f.bedrooms': 'Bedrooms', 'f.kitchen': 'Kitchen', 'f.bath': 'Bathroom', 'f.outdoor': 'Outdoors', 'f.mochlos': 'Mochlos',
    'mo.eyebrow': 'The area', 'mo.title': 'Mochlos, <em>East Crete’s best-kept secret</em>',
    'mo.p': 'A small fishing village on the Gulf of Mirabello, with tavernas right on the water, crystal-clear sea and the Minoan islet just a few strokes from the shore.',
    'mo.d1': 'Village & tavernas', 'mo.d1v': 'a few minutes', 'mo.d2': 'The sea', 'mo.d2v': 'close by, with access', 'mo.d3': 'Mochlos islet', 'mo.d3v': 'just off the shore', 'mo.d4': 'Agios Nikolaos · Sitia', 'mo.d4v': 'an easy drive',
    'rv.eyebrow': 'Our guests', 'rv.src': 'Rating on Airbnb', 'rv.clean': 'Cleanliness', 'rv.acc': 'Accuracy', 'rv.loc': 'Location', 'rv.checkin': 'Check‑in', 'rv.comm': 'Communication',
    'rv.t1': 'Stunning view', 'rv.t2': 'Perfect location', 'rv.t3': 'Spotless', 'rv.t4': 'Great for families', 'rv.t5': 'Welcoming host',
    'bk.eyebrow': 'Booking', 'bk.title': 'Choose where to <em>book</em>', 'bk.sub': 'Same house, two trusted platforms. Book wherever suits you best.',
    'bk.bookingTxt': 'Instant confirmation & your Genius perks', 'bk.airbnbTxt': 'Chat with the host & 5★ reviews', 'bk.go': 'Book →', 'bk.dates': 'Pick your dates first',
    'ft.tag': 'Mochlos, Lasithi, Crete', 'ft.host': 'Your host', 'ft.hostName': 'Georgia — usually replies within an hour', 'ft.book': 'Bookings', 'ft.reg': 'Registration no. (AMA)', 'ft.credit': 'Design & development by',
    'md.eyebrow': 'Booking', 'md.title': 'When are <em>you coming?</em>', 'md.in': 'Check-in', 'md.out': 'Check-out', 'md.guests': 'Guests', 'md.choose': 'Choose a platform:',
    'md.note': 'You’ll land on the listing with your dates already filled in.', 'cursor.view': 'View',
    nights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}`,
  };
  const EL = {};
  $$('[data-i18n]').forEach((el) => (EL[el.dataset.i18n] = el.textContent));
  $$('[data-i18n-html]').forEach((el) => (EL[el.dataset.i18nHtml] = el.innerHTML));
  EL.nights = (n) => `${n} ${n === 1 ? 'βράδυ' : 'βράδια'}`;

  let lang = 'el';
  let saved = null;
  try { saved = localStorage.getItem('cv-lang'); } catch {}
  lang = saved || ((navigator.language || 'el').toLowerCase().startsWith('el') ? 'el' : 'en');
  const t = (k) => (lang === 'en' ? EN : EL)[k];

  function applyLang() {
    document.documentElement.lang = lang;
    const dict = lang === 'en' ? EN : EL;
    $$('[data-i18n]').forEach((el) => { const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    $$('#langBtn span').forEach((s) => s.classList.toggle('on', s.dataset.l === lang));
    updateLinks();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'el' ? 'en' : 'el';
    try { localStorage.setItem('cv-lang', lang); } catch {}
    applyLang();
  });

  /* ---------------- Loader ---------------- */
  const heroImg = new Image();
  heroImg.src = 'img/lg/exterior-5.jpg';
  const start = performance.now();
  const finish = () => {
    const wait = Math.max(0, 1500 - (performance.now() - start));
    setTimeout(() => {
      document.body.classList.add('loaded');
      document.body.classList.remove('is-loading');
      startHero();
    }, reduced ? 0 : wait);
  };
  heroImg.complete ? finish() : (heroImg.onload = heroImg.onerror = finish);
  setTimeout(() => { if (!document.body.classList.contains('loaded')) finish(); }, 4000);

  /* ---------------- Hero slideshow ---------------- */
  const slides = $$('.hero__slide');
  const dotsWrap = $('#heroDots');
  let slideIdx = 0, slideTimer, heroStarted = false;
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Slide ${i + 1}`);
    b.addEventListener('click', () => goSlide(i));
    dotsWrap.appendChild(b);
  });
  const dots = $$('button', dotsWrap);
  function goSlide(i) {
    slides[slideIdx].classList.remove('is-active');
    dots[slideIdx].classList.remove('is-active');
    slideIdx = (i + slides.length) % slides.length;
    slides[slideIdx].classList.add('is-active');
    void dots[slideIdx].offsetWidth;
    dots[slideIdx].classList.add('is-active');
    clearTimeout(slideTimer);
    slideTimer = setTimeout(() => goSlide(slideIdx + 1), 6000);
  }
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    dots[0].classList.add('is-active');
    slideTimer = setTimeout(() => goSlide(1), 6000);
  }

  /* ---------------- Nav ---------------- */
  const nav = $('#nav');
  const mbar = $('#mbar');
  const toTop = $('#toTop'), toTopRing = $('#toTopProgress');
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  let lastY = 0;
  function onScrollNav() {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > innerHeight * 0.75);
    const menuOpen = document.body.classList.contains('menu-open');
    nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > innerHeight);
    mbar.classList.toggle('show', y > innerHeight * 0.6 && !isNearBook());
    toTop.classList.toggle('show', y > innerHeight * 0.8);
    const max = document.documentElement.scrollHeight - innerHeight;
    toTopRing.style.strokeDashoffset = 150.8 * (1 - Math.min(1, y / (max || 1)));
    lastY = y;
  }
  const bookSec = $('#book');
  const isNearBook = () => { const r = bookSec.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };

  const burger = $('#burger'), menu = $('#menu');
  function toggleMenu(open) {
    const o = open ?? !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', o);
    document.body.classList.toggle('menu-open', o);
    document.body.classList.toggle('no-scroll', o);
    burger.setAttribute('aria-expanded', o);
    menu.setAttribute('aria-hidden', !o);
  }
  burger.addEventListener('click', () => toggleMenu());
  $$('#menu a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  // current section highlight
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) $$('#navLinks a').forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'spaces', 'gallery', 'mochlos', 'reviews'].forEach((id) => secObs.observe(document.getElementById(id)));

  /* ---------------- Reveal + counters ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('.count', e.target).forEach(countUp);
      if (e.target.classList.contains('count')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .reveal-stagger').forEach((el) => io.observe(el));
  // clip-path hides the target from IntersectionObserver, so watch the parent instead
  const imgIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    $$(':scope > .img-reveal', e.target).forEach((el) => el.classList.add('in'));
    imgIO.unobserve(e.target);
  }), { threshold: 0.1 });
  new Set($$('.img-reveal').map((el) => el.parentElement)).forEach((p) => imgIO.observe(p));

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), dur = 1400, t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - p, 4));
      el.textContent = v.toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- Gallery ---------------- */
  const SIZES = {"bath-1":[599,900],"bath-2":[599,900],"bath-3":[599,900],"bedroom-1":[900,599],"bedroom-2":[599,900],"bedroom-3":[900,599],"bedroom-4":[599,900],"exterior-1":[599,900],"exterior-2":[900,599],"exterior-3":[900,599],"exterior-4":[599,900],"exterior-5":[900,599],"exterior-6":[900,599],"kitchen-1":[900,600],"kitchen-2":[600,900],"living-1":[599,900],"living-2":[900,600],"living-3":[900,600],"living-4":[900,600],"living-5":[900,600],"living-6":[900,600],"master-1":[900,600],"master-2":[900,600],"master-3":[599,900],"view-1":[900,599],"view-10":[900,600],"view-11":[900,600],"view-12":[600,900],"view-13":[600,900],"view-2":[900,599],"view-3":[900,599],"view-4":[900,599],"view-5":[900,599],"view-6":[900,599],"view-7":[900,599],"view-8":[900,599],"view-9":[900,599]};
  const CAT = (n) => n.startsWith('living') ? 'living' : /^(master|bedroom)/.test(n) ? 'bedrooms' : n.startsWith('kitchen') ? 'kitchen' : n.startsWith('bath') ? 'bath' : n.startsWith('exterior') ? 'outdoor' : 'mochlos';
  const ORDER = ['exterior-5','living-2','master-1','exterior-2','view-4','living-3','kitchen-1','bedroom-3','exterior-3','view-10','living-1','master-2','view-1','exterior-4','living-5','bedroom-1','view-9','kitchen-2','exterior-1','master-3','view-2','living-4','bath-3','view-6','bedroom-2','exterior-6','view-12','living-6','bath-2','view-3','bedroom-4','view-8','bath-1','view-11','view-7','view-13','view-5'];
  const masonry = $('#masonry');
  ORDER.forEach((n) => {
    const [w, h] = SIZES[n];
    const fig = document.createElement('figure');
    fig.className = 'tile';
    fig.dataset.cat = CAT(n);
    fig.dataset.name = n;
    fig.innerHTML = `<img src="img/sm/${n}.jpg" width="${w}" height="${h}" alt="Cassa Ventossa – ${n}" loading="lazy" decoding="async">`;
    masonry.appendChild(fig);
  });
  const tiles = $$('.tile');
  const tileIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); tileIO.unobserve(e.target); }
  }), { rootMargin: '0px 0px -5% 0px' });
  tiles.forEach((t) => tileIO.observe(t));

  function setFilter(f) {
    $$('#filters button').forEach((b) => b.classList.toggle('is-active', b.dataset.filter === f));
    tiles.forEach((tile) => {
      tile.classList.remove('in');
      tile.classList.toggle('is-out', f !== 'all' && tile.dataset.cat !== f);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      visibleTiles().forEach((tile, i) => setTimeout(() => tile.classList.add('in'), Math.min(i, 10) * 50));
    }));
  }
  $$('#filters button').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter)));
  const visibleTiles = () => tiles.filter((t) => !t.classList.contains('is-out'));

  // spaces cards jump to filtered gallery
  $$('.space-card').forEach((c) => c.addEventListener('click', () => {
    setFilter(c.dataset.gallery);
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCount = $('#lbCount');
  let lbList = [], lbIdx = 0;
  function openLb(name) {
    lbList = visibleTiles().map((t) => t.dataset.name);
    lbIdx = lbList.indexOf(name);
    showLb(false);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  function showLb(anim = true) {
    const set = () => {
      lbImg.src = `img/lg/${lbList[lbIdx]}.jpg`;
      lbCount.textContent = `${String(lbIdx + 1).padStart(2, '0')} / ${String(lbList.length).padStart(2, '0')}`;
      lbImg.onload = () => lbImg.classList.remove('swap');
    };
    if (anim) { lbImg.classList.add('swap'); setTimeout(set, 220); } else set();
    // preload neighbours
    [1, -1].forEach((d) => { const i = new Image(); i.src = `img/lg/${lbList[(lbIdx + d + lbList.length) % lbList.length]}.jpg`; });
  }
  const stepLb = (d) => { lbIdx = (lbIdx + d + lbList.length) % lbList.length; showLb(); };
  function closeLb() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }
  masonry.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) openLb(t.dataset.name); });
  $$('[data-lb]').forEach((b) => b.addEventListener('click', () => stepLb(+b.dataset.lb)));
  $('[data-lb-close]').addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  let tx = null;
  lb.addEventListener('touchstart', (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) stepLb(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ---------------- Booking modal ---------------- */
  const modal = $('#bookModal');
  const ci = $('#checkin'), co = $('#checkout'), gOut = $('#guests'), nightsEl = $('#nights');
  let guests = 2;
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = new Date();
  ci.min = iso(today);
  co.min = iso(new Date(today.getTime() + 864e5));

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    if (menu.classList.contains('is-open')) toggleMenu(false);
    setTimeout(() => $('.modal__close').focus({ preventScroll: true }), 50);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!lb.classList.contains('is-open')) document.body.classList.remove('no-scroll');
  }
  $$('[data-open-booking]').forEach((b) => b.addEventListener('click', openModal));
  $$('[data-close]', modal).forEach((b) => b.addEventListener('click', closeModal));

  ci.addEventListener('change', () => {
    if (ci.value) {
      const next = new Date(ci.value); next.setDate(next.getDate() + 1);
      co.min = iso(next);
      if (!co.value || co.value <= ci.value) { const d = new Date(ci.value); d.setDate(d.getDate() + 3); co.value = iso(d); }
    }
    updateLinks();
  });
  co.addEventListener('change', updateLinks);
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => {
    guests = Math.min(MAX_GUESTS, Math.max(1, guests + +b.dataset.step));
    gOut.textContent = guests;
    updateLinks();
  }));

  function updateLinks() {
    const valid = ci.value && co.value && co.value > ci.value;
    const n = valid ? Math.round((new Date(co.value) - new Date(ci.value)) / 864e5) : 0;
    nightsEl.textContent = valid ? `${t('nights')(n)} · ${guests} ${lang === 'en' ? (guests === 1 ? 'guest' : 'guests') : (guests === 1 ? 'επισκέπτης' : 'επισκέπτες')}` : '';
    const bq = new URLSearchParams({ group_adults: guests, no_rooms: 1, group_children: 0 });
    const aq = new URLSearchParams({ adults: guests });
    if (valid) { bq.set('checkin', ci.value); bq.set('checkout', co.value); aq.set('check_in', ci.value); aq.set('check_out', co.value); }
    $$('[data-platform="booking"]').forEach((a) => (a.href = `${LISTINGS.booking(lang)}?${bq}`));
    $$('[data-platform="airbnb"]').forEach((a) => (a.href = `${LISTINGS.airbnb(lang)}?${aq}`));
  }

  addEventListener('keydown', (e) => {
    if (lb.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') stepLb(1);
      if (e.key === 'ArrowLeft') stepLb(-1);
    } else if (e.key === 'Escape') { closeModal(); if (menu.classList.contains('is-open')) toggleMenu(false); }
  });

  /* ---------------- Horizontal spaces + parallax ---------------- */
  const pin = $('#spacesPin'), track = $('#spacesTrack'), bar = $('#spacesBar');
  const pinned = () => !matchMedia('(max-width:860px),(hover:none)').matches;
  function sizePin() {
    if (!pinned()) { pin.style.height = ''; return; }
    const dist = track.scrollWidth - innerWidth;
    pin.style.height = `${innerHeight + Math.max(0, dist)}px`;
  }
  function onScrollSpaces() {
    if (!pinned()) {
      const max = track.scrollWidth - track.clientWidth;
      bar.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 0})`;
      return;
    }
    const r = pin.getBoundingClientRect();
    const dist = track.scrollWidth - innerWidth;
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight || 1)));
    track.style.transform = `translate3d(${-dist * p}px,0,0)`;
    bar.style.transform = `scaleX(${p})`;
  }
  track.addEventListener('scroll', onScrollSpaces, { passive: true });

  const parallaxImgs = $$('[data-parallax]');
  const parallaxBgs = $$('[data-parallax-bg]');
  function onScrollParallax() {
    if (reduced) return;
    const vh = innerHeight;
    parallaxImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const c = (r.top + r.height / 2 - vh / 2);
      img.style.translate = `0 ${c * -parseFloat(img.dataset.parallax)}px`;
    });
    parallaxBgs.forEach((bg) => {
      const r = bg.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      bg.style.transform = `translate3d(0,${p * -12}%,0)`;
    });
  }

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScrollNav(); onScrollSpaces(); onScrollParallax(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', () => { sizePin(); onScrollSpaces(); });
  addEventListener('load', sizePin);

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch) {
    const cur = $('#cursor');
    let cx = 0, cy = 0, x = 0, y = 0;
    addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; });
    (function loop() { x += (cx - x) * 0.18; y += (cy - y) * 0.18; cur.style.translate = `${x}px ${y}px`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', (e) => cur.classList.toggle('on', !!e.target.closest('.tile, .space-card')));
  }

  /* ---------------- Init ---------------- */
  $('#year').textContent = new Date().getFullYear();
  applyLang();
  sizePin();
  onScrollNav();
  onScrollSpaces();
  onScrollParallax();
})();
