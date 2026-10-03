document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.stack-marquee-track').forEach(track=>{
    const group = track.querySelector('.stack-marquee-group');
    if(group){
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  });

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

  const inquiryForm = document.querySelector('#project-inquiry');
  if(inquiryForm){
    const status = document.querySelector('#inquiry-status');
    const submitButton = inquiryForm.querySelector('[type="submit"]');
    const originalButtonText = submitButton.textContent.trim();

    inquiryForm.addEventListener('submit', async event=>{
      event.preventDefault();
      if(!inquiryForm.reportValidity()) return;

      status.hidden = false;
      status.classList.remove('is-error', 'is-success');

      // Silently discard likely bot submissions caught by the off-screen honeypot.
      if(inquiryForm.elements._honey.value){
        status.textContent = 'Thanks—your inquiry has been received.';
        status.classList.add('is-success');
        inquiryForm.reset();
        status.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      inquiryForm.setAttribute('aria-busy', 'true');
      status.textContent = 'Sending your inquiry securely…';

      try{
        const payload = Object.fromEntries(new FormData(inquiryForm).entries());
        const response = await fetch('https://formsubmit.co/ajax/dopsmind@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if(!response.ok || result.success === false || result.success === 'false' || result.success === '0'){
          throw new Error('The inquiry service did not accept the submission.');
        }

        status.textContent = 'Thanks—your inquiry was sent. We’ll be in touch.';
        status.classList.add('is-success');
        inquiryForm.reset();
      }catch(error){
        status.textContent = 'We couldn’t send your inquiry just now. Please email dopsmind@gmail.com or connect with us on LinkedIn.';
        status.classList.add('is-error');
      }finally{
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        inquiryForm.removeAttribute('aria-busy');
        status.focus();
      }
    });
  }
});
