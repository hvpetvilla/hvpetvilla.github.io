/* ===== HV Petvilla — Shared interactivity ===== */

// Nav shadow on scroll
(function(){
  const nav = document.getElementById('mainNav') || document.querySelector('.nav');
  if(!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

// Scroll-reveal for elements with .reveal
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

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
