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

document.querySelectorAll('a, button, img, .award-image, .about-bio-image').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });


// ================================================
// HEADER SCROLL BORDER
// ================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(245,244,240,0.1)'
    : 'rgba(245,244,240,0.07)';
}, { passive: true });


// ================================================
// SCROLL REVEAL (IntersectionObserver)
// ================================================
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Trigger hero reveals immediately on load
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.about-hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 180 + i * 140);
  });
});
