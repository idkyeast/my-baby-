/**
 * Birthday Surprise — script.js
 * Phase 1: Countdown  →  Phase 2: Birthday reveal on June 19 2026
 * Cheat codes:  "blenhi"  → skip to birthday reveal
 *               "blenbye" → return to countdown
 */

/* ============================================================
   CONFIGURATION
   ============================================================ */
const BIRTHDAY_YEAR  = 2026;
const BIRTHDAY_MONTH = 6;   // 1-indexed
const BIRTHDAY_DAY   = 19;

/* ============================================================
   UTILITY
   ============================================================ */
function pad(n) { return String(n).padStart(2, '0'); }

function isBirthday() {
  const now = new Date();
  return (
    now.getFullYear()  === BIRTHDAY_YEAR &&
    now.getMonth() + 1 === BIRTHDAY_MONTH &&
    now.getDate()      >= BIRTHDAY_DAY
  );
}

function getBirthdayTarget() {
  return new Date(BIRTHDAY_YEAR, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0, 0);
}

/* ============================================================
   PHASE 1 — COUNTDOWN
   ============================================================ */
let countdownInterval = null;

function initCountdown() {
  const daysEl  = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl  = document.getElementById('minutes');
  const secsEl  = document.getElementById('seconds');
  const target  = getBirthdayTarget();

  function tick() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      switchToBirthday();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    function updateEl(el, val) {
      const str = pad(val);
      if (el.textContent !== str) {
        el.textContent = str;
        el.classList.remove('tick');
        void el.offsetWidth;
        el.classList.add('tick');
      }
    }

    updateEl(daysEl,  d);
    updateEl(hoursEl, h);
    updateEl(minsEl,  m);
    updateEl(secsEl,  s);
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

/* ---- Floating hearts ---- */
function initHearts() {
  const container = document.getElementById('heartsContainer');
  const symbols   = ['♥','❤','💕','💗','💖','🌹','♡'];
  for (let i = 0; i < 22; i++) {
    const el   = document.createElement('span');
    el.classList.add('heart-float');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const hue  = Math.random() > 0.5 ? '#ff4d6d' : '#d4a843';
    el.style.cssText = `
      left:${Math.random()*100}%;
      font-size:${0.8+Math.random()*1.4}rem;
      animation-duration:${8+Math.random()*14}s;
      animation-delay:${Math.random()*-16}s;
      color:${hue};
    `;
    container.appendChild(el);
  }
}

/* ---- Rose petals ---- */
function initPetals() {
  const container = document.getElementById('petalsContainer');
  const colors    = ['#c9184a','#d4a843','#ff4d6d','#8b0000','#bf9b30'];
  for (let i = 0; i < 18; i++) {
    const el   = document.createElement('div');
    el.classList.add('petal');
    const size = 8 + Math.random() * 10;
    el.style.cssText = `
      left:${Math.random()*100}%;
      width:${size}px;
      height:${size*1.4}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${6+Math.random()*10}s;
      animation-delay:${Math.random()*-14}s;
      opacity:0.55;
    `;
    container.appendChild(el);
  }
}

/* ============================================================
   PHASE 2 — BIRTHDAY REVEAL
   ============================================================ */
let confettiRafId = null;

function switchToBirthday() {
  if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
  document.getElementById('countdown-page').classList.add('hidden');
  const bp = document.getElementById('birthday-page');
  bp.classList.remove('hidden');
  bp.scrollTop = 0;
  window.scrollTo(0, 0);
  initBirthdayPage();
}

function switchToCountdown() {
  // Cancel confetti
  if (confettiRafId) { cancelAnimationFrame(confettiRafId); confettiRafId = null; }
  const canvas = document.getElementById('confettiCanvas');
  canvas.style.display = '';
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Remove dynamically created balloons so they don't stack on re-entry
  document.getElementById('balloonsContainer').innerHTML = '';

  // Reset fade-ins so they re-animate when re-entering
  document.querySelectorAll('#birthday-page .fade-in').forEach(el => el.classList.remove('visible'));

  document.getElementById('birthday-page').classList.add('hidden');
  document.getElementById('countdown-page').classList.remove('hidden');
  window.scrollTo(0, 0);

  // Restart countdown
  initHearts();
  initPetals();
  initCountdown();
}

function initBirthdayPage() {
  initBalloons();
  initConfetti();
  initFadeIn();
}

/* ---- Balloons ---- */
function initBalloons() {
  const container = document.getElementById('balloonsContainer');
  const colors = [
    ['#ff4d6d','#c9184a'],
    ['#d4a843','#9a7320'],
    ['#ff8fa3','#c9184a'],
    ['#f0c96f','#d4a843'],
    ['#c77dff','#7b2d8b'],
    ['#ff6b6b','#c0392b'],
    ['#74b9ff','#0984e3'],
  ];
  for (let i = 0; i < 7; i++) {
    const pair = colors[i % colors.length];
    const dur  = 14 + Math.random() * 10;
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.cssText = `animation-duration:${dur}s;animation-delay:${-(Math.random()*dur)}s;transform:translateX(${(Math.random()-.5)*30}px);`;
    const body = document.createElement('div');
    body.classList.add('balloon-body');
    body.style.background = `radial-gradient(circle at 35% 30%,${pair[0]},${pair[1]})`;
    const string = document.createElement('div');
    string.classList.add('balloon-string');
    balloon.appendChild(body);
    balloon.appendChild(string);
    container.appendChild(balloon);
  }
}

/* ---- Confetti (canvas) ---- */
function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.style.display = '';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  window.addEventListener('resize', onResize);

  const COLORS = ['#ff4d6d','#c9184a','#d4a843','#f0c96f','#ff8fa3','#c77dff','#74b9ff','#fff'];
  const particles = [];

  function rand(a,b) { return a + Math.random()*(b-a); }
  function mkParticle(x,y) {
    return {
      x:   x ?? rand(0, canvas.width),
      y:   y ?? rand(-40,-10),
      vx:  rand(-2.5,2.5), vy:rand(1.5,4.5),
      w:   rand(6,14),      h: rand(4,10),
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      angle: rand(0, Math.PI*2), spin:rand(-.12,.12), alpha:1,
    };
  }

  for (let i = 0; i < 160; i++) {
    particles.push(mkParticle(rand(canvas.width*.15, canvas.width*.85), rand(-80,0)));
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frame++;
    if (frame < 300 && frame % 4 === 0) particles.push(mkParticle());

    for (let i = particles.length-1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      p.vy += 0.06; p.vx *= 0.998;
      if (p.y > canvas.height + 20) { p.alpha -= 0.04; }
      if (p.alpha <= 0) { particles.splice(i,1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0,p.alpha);
      ctx.translate(p.x,p.y); ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    }

    if (particles.length > 0) {
      confettiRafId = requestAnimationFrame(draw);
    } else {
      canvas.style.display = 'none';
      window.removeEventListener('resize', onResize);
    }
  }
  draw();
}

/* ---- Intersection Observer fade-in ---- */
function initFadeIn() {
  const elements = document.querySelectorAll('#birthday-page .fade-in');
  if (elements.length > 0) setTimeout(() => elements[0].classList.add('visible'), 100);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Trigger gallery confetti burst when the gallery section appears
          if (e.target.id === 'gallerySection') {
            setTimeout(() => fireGalleryConfetti(), 400);
          }
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el, i) => { if (i === 0) return; observer.observe(el); });
}

/* ---- Gallery confetti burst ---- */
function fireGalleryConfetti() {
  const canvas = document.getElementById('galleryConfetti');
  if (!canvas) return;

  const section = document.getElementById('gallerySection');
  canvas.width  = section.offsetWidth;
  canvas.height = section.offsetHeight;

  const ctx = canvas.getContext('2d');
  const COLORS = ['#ff4d6d','#c9184a','#d4a843','#f0c96f','#ff8fa3','#c77dff','#fff','#74b9ff'];
  const particles = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Burst from 5 points across the bottom of the gallery
  const origins = [0.1, 0.3, 0.5, 0.7, 0.9];
  origins.forEach(ox => {
    for (let i = 0; i < 28; i++) {
      particles.push({
        x:     canvas.width * ox,
        y:     canvas.height * 0.85,
        vx:    rand(-5, 5),
        vy:    rand(-12, -4),
        w:     rand(6, 13),
        h:     rand(4, 9),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: rand(0, Math.PI * 2),
        spin:  rand(-0.2, 0.2),
        alpha: 1,
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.35;   // gravity
      p.angle += p.spin;
      p.alpha -= 0.018;
      if (p.alpha <= 0) return;
      alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

/* ============================================================
   CHEAT CODES
   blenhi  → show birthday reveal
   blenbye → return to countdown
   ============================================================ */
function initCheatCodes() {
  const CODES = {
    blenhi:  () => {
      if (!document.getElementById('birthday-page').classList.contains('hidden')) return;
      switchToBirthday();
    },
    blenbye: () => {
      if (document.getElementById('birthday-page').classList.contains('hidden')) return;
      switchToCountdown();
    },
  };

  const maxLen = Math.max(...Object.keys(CODES).map(k => k.length));
  let buffer = '';

  document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
      buffer = (buffer + e.key).slice(-maxLen);
      for (const [code, fn] of Object.entries(CODES)) {
        if (buffer.endsWith(code)) { buffer = ''; fn(); break; }
      }
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCheatCodes();

  if (isBirthday()) {
    switchToBirthday();
  } else {
    initHearts();
    initPetals();
    initCountdown();
  }
});
