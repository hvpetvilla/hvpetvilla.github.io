/* ===== HV Petvilla — Shared interactivity ===== */

// Nav shadow on scroll
(function(){
  const nav = document.getElementById('mainNav') || document.querySelector('.nav');
  if(!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

// Scroll-reveal for elements with .reveal. Exposed as window.applyScrollReveal
// so pages that render content asynchronously (e.g. product/review cards
// fetched after page load) can re-run it once that content exists in the DOM —
// a one-time querySelectorAll at script-load time would otherwise miss it.
window.applyScrollReveal = (function(){
  const noObserver = !('IntersectionObserver' in window);
  const io = noObserver ? null : new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  return function applyScrollReveal(){
    const els = document.querySelectorAll('.reveal:not([data-reveal-bound])');
    els.forEach(el => {
      el.setAttribute('data-reveal-bound', '1');
      if(noObserver){ el.classList.add('in-view'); } else { io.observe(el); }
    });
  };
})();
applyScrollReveal();

// Animated stat counters (elements with data-count)
(function(){
  const nums = document.querySelectorAll('[data-count]');
  if(!nums.length) return;
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const dur = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if(!('IntersectionObserver' in window)){
    nums.forEach(animate);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => io.observe(el));
  }
})();

// Back-to-top button
(function(){
  const btn = document.getElementById('backTop');
  if(!btn) return;
  const onScroll = () => btn.classList.toggle('show', window.scrollY > 480);
  document.addEventListener('scroll', onScroll, { passive:true });
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  onScroll();
})();

// Staggered word-reveal for headlines: wraps each word in its own span
// so CSS (.word-reveal span) can animate them in with a per-word delay.
// Walks the DOM (rather than splitting innerHTML as a string) so nested
// markup like a <span class="hi"> highlight or a <br> survives intact —
// each word inside a nested element still gets wrapped and staggered.
(function(){
  document.querySelectorAll('.word-reveal-init').forEach(el => {
    let i = 0;
    function wrap(node){
      if(node.nodeType === Node.TEXT_NODE){
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if(part.trim() === ''){
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.textContent = part;
            span.style.animationDelay = (i++ * 0.06).toFixed(2) + 's';
            frag.appendChild(span);
          }
        });
        node.replaceWith(frag);
      } else if(node.nodeType === Node.ELEMENT_NODE){
        Array.from(node.childNodes).forEach(wrap);
      }
    }
    Array.from(el.childNodes).forEach(wrap);
    el.classList.add('word-reveal');
  });
})();
