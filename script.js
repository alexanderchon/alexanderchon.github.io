// ================================================
// SPLASH SCREEN
// ================================================
const splash = document.getElementById('splash');
const site = document.getElementById('site');
const splashTop = document.getElementById('splashTop');
const splashImg = document.getElementById('splashImg');
const splashBot = document.getElementById('splashBottom');
const splashHint = document.getElementById('splashHint');

let splashDone = false;

function transitionToSite() {
  if (splashDone) return;
  splashDone = true;
  splash.classList.add('hidden');
  setTimeout(() => {
    splash.style.display = 'none';
    site.classList.add('visible');
    // Give the browser a frame to paint, then trigger hero
    requestAnimationFrame(() => requestAnimationFrame(triggerHeroReveals));
  }, 1000);
}

function runSplash() {
  setTimeout(() => splashTop.classList.add('show'), 300);
  setTimeout(() => splashImg.classList.add('show'), 1000);
  setTimeout(() => splashBot.classList.add('show'), 1900);
  setTimeout(() => splashHint.classList.add('show'), 2800);
  setTimeout(transitionToSite, 6500);
}

splash.addEventListener('click', transitionToSite);

// Skip splash when returning from another page (e.g. about.html)
if (new URLSearchParams(window.location.search).get('nosplash') === '1') {
  const targetHash = window.location.hash;
  splashDone = true;
  splash.style.display = 'none';
  site.classList.add('visible');
  window.history.replaceState({}, '', window.location.pathname); // clean up URL
  window.addEventListener('load', () => {
    if (targetHash) {
      const target = document.querySelector(targetHash);
      if (target) target.scrollIntoView();
    }
    requestAnimationFrame(() => requestAnimationFrame(triggerHeroReveals));
  });
} else {
  window.addEventListener('load', runSplash);
}


// ================================================
// HERO REVEALS (staggered on entry, not on scroll)
// ================================================
function triggerHeroReveals() {
  const stagger = document.querySelector('.hero .reveal-stagger');
  if (stagger) {
    setTimeout(() => stagger.classList.add('in-view'), 100);
  }
  const reveals = document.querySelectorAll('.hero .reveal');
  reveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 200 + i * 150);
  });
}


// ================================================
// STORY SECTION — scroll-driven chapter switching
// ================================================
const storySection = document.querySelector('.story-section');
const storyImgs = document.querySelectorAll('.story-img');
const storyChaps = document.querySelectorAll('.story-chapter');
const counterNum = document.querySelector('.counter-num');
const progressFill = document.querySelector('.story-progress-fill');
const CHAPTER_COUNT = 5;
let currentChapter = 0;

function updateStory() {
  if (!storySection) return;
  const rect = storySection.getBoundingClientRect();
  const travel = storySection.offsetHeight - window.innerHeight;
  const scrolled = Math.max(0, Math.min(1, -rect.top / travel));
  const chapterIdx = Math.min(Math.floor(scrolled * CHAPTER_COUNT), CHAPTER_COUNT - 1);

  // Update progress bar (continuous)
  progressFill.style.width = (scrolled * 100) + '%';

  if (chapterIdx === currentChapter) return;
  currentChapter = chapterIdx;

  // Swap active image
  storyImgs.forEach((img, i) => img.classList.toggle('active', i === chapterIdx));
  // Swap active chapter text
  storyChaps.forEach((ch, i) => ch.classList.toggle('active', i === chapterIdx));
  // Update counter
  counterNum.textContent = String(chapterIdx + 1).padStart(2, '0');
}

window.addEventListener('scroll', updateStory, { passive: true });
updateStory();


// ================================================
// PARALLAX — hero photo moves at 40% scroll speed
// ================================================
const heroPhoto = document.querySelector('.hero-photo');
const heroWrap = document.querySelector('.hero-photo-wrap');

function updateParallax() {
  if (!heroPhoto || !heroWrap) return;
  const rect = heroWrap.getBoundingClientRect();
  const viewH = window.innerHeight;
  // How far the centre of the element is from centre of viewport (-1 to 1)
  const progress = (rect.top + rect.height / 2 - viewH / 2) / viewH;
  // Shift photo by 40px max in each direction
  const shift = progress * 60;
  heroPhoto.style.transform = `translateY(${shift}px)`;
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();


// ================================================
// CUSTOM CURSOR
// ================================================
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Expand ring on hover
document.querySelectorAll('a, button, img, .bio-cell, .hero-photo-wrap').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });


// ================================================
// SCROLL REVEAL (IntersectionObserver)
// ================================================
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


// ================================================
// HEADER SCROLL BORDER (subtle emphasis on scroll)
// ================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(245,244,240,0.1)'
    : 'rgba(245,244,240,0.07)';
}, { passive: true });
