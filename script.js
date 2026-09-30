new Typed("#typed", {
  strings: [
    "Cloud Platforms",
    "AI DevOps Systems",
    "Automation Engines",
    "Scalable Infrastructure"
  ],
  typeSpeed: 60,
  backSpeed: 40,
  loop: true
});

/* FADE-IN ANIMATION */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

document.querySelectorAll(".card").forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(40px)";
  observer.observe(el);
});
