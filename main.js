/* ===== HV Petvilla — Shared interactivity ===== */

// Escapes user-submitted text before it's interpolated into innerHTML,
// so a review/product field can't inject markup or break out of an
// HTML attribute (e.g. an img src) into a new one.
function escapeHtml(str){
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Nav: solid background once the page is scrolled. Over a full-bleed hero
// (.nav--over) this is also what flips it from transparent to sand.
(function(){
  const nav = document.getElementById('mainNav') || document.querySelector('.nav');
  if(!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

// Mobile menu. toggleNav stays global since older markup calls it inline.
function toggleNav(force){
  const h = document.getElementById('hamburger');
  const m = document.getElementById('navMobile');
  if(!h || !m) return;
  const open = typeof force === 'boolean' ? force : !m.classList.contains('open');
  h.classList.toggle('open', open);
  m.classList.toggle('open', open);
  h.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.classList.toggle('nav-open', open);
}
(function(){
  const h = document.getElementById('hamburger');
  const m = document.getElementById('navMobile');
  if(!h || !m) return;
  if(!h.hasAttribute('onclick')) h.addEventListener('click', () => toggleNav());
  m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleNav(false)));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') toggleNav(false); });
  window.addEventListener('resize', () => { if(window.innerWidth > 960) toggleNav(false); });
})();

// Scroll reveals for .reveal (fade up) and .reveal-left (slide in from the
// left). Each element animates once, the first time it enters the viewport,
// then is unobserved. Exposed as window.applyScrollReveal so pages that
// render content asynchronously (product/review cards fetched after load)
// can re-run it once that content exists in the DOM.
window.applyScrollReveal = (function(){
  const skip = REDUCED_MOTION || !('IntersectionObserver' in window);
  const io = skip ? null : new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  return function applyScrollReveal(){
    document.querySelectorAll('.reveal:not([data-reveal-bound]), .reveal-left:not([data-reveal-bound])').forEach(el => {
      el.setAttribute('data-reveal-bound', '1');
      if(skip){ el.classList.add('in-view'); } else { io.observe(el); }
    });
  };
})();
applyScrollReveal();

// Gentle parallax drift for elements with data-parallax="<speed>", e.g. the
// CommuniTree hero photo. Only runs while the element is near the viewport.
(function(){
  if(REDUCED_MOTION) return;
  const els = Array.from(document.querySelectorAll('[data-parallax]'));
  if(!els.length) return;
  let ticking = false;
  const update = () => {
    els.forEach(el => {
      const host = el.parentElement.getBoundingClientRect();
      if(host.bottom < 0 || host.top > window.innerHeight) return;
      const speed = parseFloat(el.dataset.parallax) || 0.25;
      el.style.transform = `translate3d(0, ${(-host.top * speed).toFixed(1)}px, 0) scale(1.08)`;
    });
    ticking = false;
  };
  document.addEventListener('scroll', () => {
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
  update();
})();

// Back-to-top button
(function(){
  const btn = document.getElementById('backTop');
  if(!btn) return;
  const onScroll = () => btn.classList.toggle('show', window.scrollY > 700);
  document.addEventListener('scroll', onScroll, { passive:true });
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });
  onScroll();
})();
