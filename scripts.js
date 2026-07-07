/* ─── Canvas particles ─── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1e6, y: -1e6 };

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.size = Math.random() * 2 + .5;
  this.speedX = (Math.random() - .5) * .35;
  this.speedY = (Math.random() - .5) * .35;
  this.opacity = Math.random() * .5 + .1;
}

Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
  if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

  const dx = mouse.x - this.x;
  const dy = mouse.y - this.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 120) {
    this.x -= dx * .02;
    this.y -= dy * .02;
  }
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
  ctx.fill();
};

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor(canvas.width * canvas.height / 8000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 92, 231, ${(1 - dist / 130) * .12})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}

resize();
initParticles();
animate();

addEventListener('resize', () => { resize(); initParticles(); });
addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
addEventListener('mouseleave', () => { mouse.x = -1e6; mouse.y = -1e6; });

/* ─── Terminal typing ─── */
const phrases = [
  'echo "building cool stuff since 2024"',
  'cat about.md',
  'npm run portfolio',
  'git commit -m "make it pop"',
  
];

let idx = 0;
let charIdx = 0;
let isDeleting = false;
const el = document.querySelector('.typing');

function typeEffect() {
  const current = phrases[idx];

  if (!isDeleting) {
    el.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    el.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      charIdx = 0;
      idx = (idx + 1) % phrases.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 30 : 70);
}

typeEffect();

/* ─── Scroll reveal ─── */
function reveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < innerHeight - 60) el.classList.add('visible');
  });
}

/* ─── Skill bars ─── */
function fillBars() {
  document.querySelectorAll('.fill').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < innerHeight - 50 && !bar.dataset.filled) {
      bar.dataset.filled = 'true';
      bar.style.width = bar.dataset.w + '%';
    }
  });
}

/* ─── Counter animation ─── */
function countUp() {
  document.querySelectorAll('.num').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < innerHeight - 50 && !el.dataset.counted) {
      el.dataset.counted = 'true';
      const target = +el.dataset.target;
      let val = 0;
      const step = Math.ceil(target / 40);
      const iv = setInterval(() => {
        val += step;
        if (val >= target) { val = target; clearInterval(iv); }
        el.textContent = val + (target < 100 ? '' : '+');
      }, 30);
    }
  });
}

/* ─── Nav highlight ─── */
function highlightNav() {
  const links = document.querySelectorAll('nav a');
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 200) current = section.id;
  });
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── Theme toggle ─── */
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  toggle.textContent = document.body.classList.contains('light') ? '☀' : '◐';
});

/* ─── Scroll listener ─── */
function onScroll() {
  reveal();
  fillBars();
  countUp();
  highlightNav();
}

addEventListener('scroll', onScroll);
addEventListener('load', () => { onScroll(); setTimeout(onScroll, 200); });
