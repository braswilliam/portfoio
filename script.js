// ============================================================
// WILLIAM BRASIL PEREIRA — PORTFÓLIO — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- menu mobile ---------- */
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('scrim');

  function closeMenu(){
    mobileMenu.classList.remove('open');
    scrim.classList.remove('show');
    burger.setAttribute('aria-expanded','false');
  }
  function openMenu(){
    mobileMenu.classList.add('open');
    scrim.classList.add('show');
    burger.setAttribute('aria-expanded','true');
  }
  burger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  scrim.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- abas do universo geek ---------- */
  const geekTabs = document.querySelectorAll('.geek-tabs .geek-tab');
  const geekPanels = document.querySelectorAll('.geek-panel');
  geekTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      geekTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      geekPanels.forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });

  /* ---------- filtro de certificados ---------- */
  const certFilters = document.querySelectorAll('.cert-filters .geek-tab');
  const certCards = document.querySelectorAll('.cert-card');
  certFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      certCards.forEach(card => {
        card.hidden = !(f === 'all' || card.dataset.cat === f);
      });
    });
  });

  /* ---------- lightbox de certificados ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const certArray = Array.from(certCards);
  let currentIndex = 0;

  function openLightbox(index){
    const visible = certArray.filter(c => !c.hidden);
    const card = visible[index] || certArray[index];
    currentIndex = certArray.indexOf(card);
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function renderLightbox(){
    const card = certArray[currentIndex];
    lbImg.src = card.dataset.img;
    lbImg.alt = 'Certificado: ' + card.dataset.title;
    lbCaption.textContent = card.dataset.org + ' — ' + card.dataset.title + ' · ' + card.dataset.hrs;
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function step(dir){
    let i = currentIndex;
    do {
      i = (i + dir + certArray.length) % certArray.length;
    } while (certArray[i].hidden && i !== currentIndex);
    currentIndex = i;
    renderLightbox();
  }

  certCards.forEach((card, i) => {
    card.addEventListener('click', () => openLightbox(certArray.filter(c => !c.hidden).indexOf(card) >= 0 ? certArray.indexOf(card) : i));
  });
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- carregamento sob demanda dos previews dos projetos ---------- */
  document.querySelectorAll('.project-card').forEach(card => {
    const url = card.dataset.url;
    const frameWrap = card.querySelector('.frame-wrap');
    const loadBtn = card.querySelector('.load-frame');

    loadBtn.addEventListener('click', () => {
      loadBtn.remove();

      const loading = document.createElement('div');
      loading.className = 'frame-loading';
      loading.textContent = 'Carregando preview…';
      frameWrap.appendChild(loading);

      const fallback = document.createElement('div');
      fallback.className = 'frame-fallback';
      fallback.innerHTML = `<p>Este site bloqueia visualização incorporada por segurança do navegador.</p>`;
      const fallbackLink = document.createElement('a');
      fallbackLink.className = 'btn primary';
      fallbackLink.href = url; fallbackLink.target = '_blank'; fallbackLink.rel = 'noopener';
      fallbackLink.textContent = 'Abrir em nova aba ↗';
      fallback.appendChild(fallbackLink);
      frameWrap.appendChild(fallback);

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.loading = 'lazy';
      iframe.title = card.querySelector('h3').textContent;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';

      let loaded = false;
      const timer = setTimeout(() => {
        if (!loaded){
          loading.remove();
          fallback.classList.add('show');
        }
      }, 5000);

      iframe.addEventListener('load', () => {
        loaded = true;
        clearTimeout(timer);
        loading.remove();
      });

      frameWrap.prepend(iframe);
    });
  });

  /* ---------- ano automático / pequenos detalhes ---------- */
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

});
