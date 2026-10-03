// HERO typed headline
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.stack-marquee-track').forEach(track=>{
    const group = track.querySelector('.stack-marquee-group');
    if(group){
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  });

  try {
    new Typed('#typed', {
      strings: ['Cloud Platforms', 'AI-Driven DevOps', 'Automation Engines', 'Scalable Infrastructure'],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1100,
      startDelay: 300,
      loop: true
    });
  } catch(e){
    // typed failed, silently continue
    console.warn('typed.js failed', e);
  }

  // small animate-on-scroll utility (no external dependency)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('[data-animate]').forEach(el=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });

  // when element becomes in-view, apply visible styles via a tiny mutation
  document.addEventListener('animationFrame', ()=>{}); // noop; keep event loop consistent

  // reveal helper (set styles when observed)
  const reveal = (el) => {
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
  };

  // Wire observer callback to apply styles
  io.disconnect();
  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        reveal(entry.target);
        io2.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('[data-animate]').forEach(el=> io2.observe(el));

  // metrics count-up (simple)
  document.querySelectorAll('.metric-value[data-count]').forEach(el=>{
    const to = parseFloat(el.getAttribute('data-count') || el.textContent) || 0;
    let start = 0;
    const dur = 900;
    const step = (timestampStart => {
      const startTime = performance.now();
      return function frame(now){
        const t = Math.min(1, (now - startTime) / dur);
        el.textContent = (Math.floor(to * t)).toString();
        if(t < 1) requestAnimationFrame(frame);
        else el.textContent = to.toString();
      };
    })();
    requestAnimationFrame(step);
  });

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }
});
