// ============================================================
// FRUITLOOP — interactions
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Nav scroll state + mobile toggle ---------- */
const nav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

const burger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMobile.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* ---------- Custom cursor ---------- */
const cursor = document.getElementById('loopCursor');
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .work-item, .founder-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
}

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* Also fade/rise generic sections as they enter view */
const fadeTargets = document.querySelectorAll(
  '.vm-card, .service-card, .work-item, .founder-card, .choose-item, .contact-link'
);
fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .7s cubic-bezier(.16,.84,.32,1), transform .7s cubic-bezier(.16,.84,.32,1)';
});
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, (i % 4) * 70);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadeTargets.forEach(el => fadeObserver.observe(el));

/* ---------- Work filters ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    const filter = btn.dataset.filter;
    workItems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('is-hidden', !show);
    });
  });
});

/* ---------- Showreel play ---------- */
const reelFrame = document.getElementById('reelFrame');
const reelPlay = document.getElementById('reelPlay');
const reelVideo = document.getElementById('reelVideo');
function tryPlayReel() {
  const hasSource = reelVideo.querySelector('source');
  if (hasSource) {
    reelVideo.style.display = 'block';
    reelVideo.setAttribute('controls', '');
    reelVideo.play();
    reelPlay.style.display = 'none';
    document.querySelector('.reel-poster').style.display = 'none';
    document.querySelector('.reel-overlay').style.display = 'none';
  } else {
    reelFrame.classList.add('shake');
    setTimeout(() => reelFrame.classList.remove('shake'), 500);
  }
}
reelPlay.addEventListener('click', tryPlayReel);
reelFrame.addEventListener('click', (e) => { if (e.target === reelFrame) tryPlayReel(); });

/* ---------- Logo marquee: build from assets/logos, duplicated for seamless loop ---------- */
const logoTrack = document.getElementById('logoTrack');
const LOGO_COUNT = 22;
function buildLogos() {
  let html = '';
  for (let rep = 0; rep < 2; rep++) {
    for (let i = 0; i < LOGO_COUNT; i++) {
      const n = String(i).padStart(2, '0');
      html += `<img src="assets/logos/logo-${n}.png" alt="" loading="lazy">`;
    }
  }
  logoTrack.innerHTML = html;
}
buildLogos();

/* ---------- subtle shake keyframe injected for reel no-source click ---------- */
const styleEl = document.createElement('style');
styleEl.textContent = `
@keyframes shake { 10%,90%{transform:translateX(-1px);} 20%,80%{transform:translateX(2px);} 30%,50%,70%{transform:translateX(-4px);} 40%,60%{transform:translateX(4px);} }
.reel-frame.shake { animation: shake .5s; }
`;
document.head.appendChild(styleEl);
