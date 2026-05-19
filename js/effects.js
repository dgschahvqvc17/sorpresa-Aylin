let fireworksRAF = null;
let confettiRAF = null;

// ===== SPARKLES (cover background) =====
function initSparkles(containerId, count = 50) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const size = Math.random() * 4 + 2;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.animationDuration = (Math.random() * 6 + 4) + 's';
    sparkle.style.animationDelay = (Math.random() * 8) + 's';
    sparkle.style.background = ['#ffd700', '#ff6b9d', '#c44dff', '#fff', '#ffe44d'][Math.floor(Math.random() * 5)];
    sparkle.style.boxShadow = `0 0 ${size * 2}px ${sparkle.style.background}`;
    container.appendChild(sparkle);
  }
}

// ===== FIREWORKS =====
function initFireworks(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth || window.innerWidth;
    h = canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const rockets = [];
  const explosions = [];
  let hue = 0;

  class Rocket {
    constructor() {
      this.x = Math.random() * w;
      this.y = h;
      this.targetY = Math.random() * h * 0.4 + h * 0.1;
      this.speed = Math.random() * 3 + 4;
      this.angle = (Math.random() - 0.5) * 0.4;
      this.vx = Math.sin(this.angle) * 1.5;
      this.vy = -this.speed;
      this.trail = [];
      this.alive = true;
    }

    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 12) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      if (this.y <= this.targetY || this.vy > 0) {
        this.alive = false;
        createExplosion(this.x, this.y);
      }
    }

    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        const alpha = i / this.trail.length;
        ctx.beginPath();
        ctx.arc(this.trail[i].x, this.trail[i].y, alpha * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha * 0.6})`;
        ctx.fill();
      }
    }
  }

  function createExplosion(x, y) {
    const count = 40 + Math.floor(Math.random() * 30);
    const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: `hsl(${hue + Math.random() * 60}, 80%, ${50 + Math.random() * 30}%)`,
        life: 1,
        size: Math.random() * 3 + 1.5,
        decay: 0.012 + Math.random() * 0.01,
        gravity: 0.04,
        trail: []
      });
    }
    // Add some white core particles
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#fff',
        life: 1,
        size: Math.random() * 2 + 0.5,
        decay: 0.02 + Math.random() * 0.01,
        gravity: 0.02,
        trail: []
      });
    }
    explosions.push({ particles, age: 0 });
  }

  function updateFireworks() {
    if (Math.random() < 0.04 && rockets.length < 5) {
      rockets.push(new Rocket());
    }
    rockets.forEach(r => r.update());
    for (let i = rockets.length - 1; i >= 0; i--) {
      if (!rockets[i].alive) rockets.splice(i, 1);
    }
    explosions.forEach(ex => {
      ex.particles.forEach(p => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.life -= p.decay;
      });
      ex.age++;
    });
    for (let i = explosions.length - 1; i >= 0; i--) {
      if (explosions[i].age > 120) explosions.splice(i, 1);
    }
  }

  function drawFireworks() {
    ctx.clearRect(0, 0, w, h);
    rockets.forEach(r => r.draw());
    explosions.forEach(ex => {
      ex.particles.forEach(p => {
        if (p.life <= 0) return;
        ctx.globalAlpha = p.life;
        // Draw trail
        for (let t = 0; t < p.trail.length; t++) {
          const ta = t / p.trail.length;
          ctx.beginPath();
          ctx.arc(p.trail[t].x, p.trail[t].y, p.size * ta * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * ta * 0.3;
          ctx.fill();
        }
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    });
    hue = (hue + 0.5) % 360;
  }

  function loop() {
    updateFireworks();
    drawFireworks();
    fireworksRAF = requestAnimationFrame(loop);
  }

  loop();
  return () => { if (fireworksRAF) cancelAnimationFrame(fireworksRAF); };
}

let burstParticles = [];

// ===== CONFETTI =====
function initConfetti(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth || window.innerWidth;
    h = canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4081', '#7c4dff', '#00e5ff', '#76ff03', '#ff9100', '#e040fb', '#fff'];
  const shapes = ['rect', 'circle'];

  class ConfettiParticle {
    constructor(initial = true) {
      this.reset(initial);
    }

    reset(initial = false) {
      this.x = Math.random() * w;
      this.y = initial ? Math.random() * h - h : -20;
      this.w = Math.random() * 8 + 4;
      this.h = Math.random() * 6 + 3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = Math.random() * 2 + 1.5;
      this.opacity = Math.random() * 0.5 + 0.5;
      this.swing = Math.random() * 2;
      this.swingSpeed = Math.random() * 0.03 + 0.01;
      this.swingPhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx + Math.sin(this.swingPhase) * this.swing;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.vy += 0.02;
      this.swingPhase += this.swingSpeed;
      if (this.y > h + 20) this.reset();
      if (this.x < -20 || this.x > w + 20) this.vx *= -1;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const count = Math.min(80, Math.floor((w * h) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new ConfettiParticle(true));
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const p = burstParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.life -= 0.02;
      p.rotation += p.rotSpeed;
      if (p.life <= 0 || p.y > h + 50) {
        burstParticles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    confettiRAF = requestAnimationFrame(loop);
  }

  loop();
  return () => { if (confettiRAF) cancelAnimationFrame(confettiRAF); };
}

// ===== CONFETTI BURST (for special moments) =====
function confettiBurst(x, y, count = 60) {
  const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4081', '#7c4dff', '#00e5ff', '#76ff03', '#fff'];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 8 + 4;
    burstParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      size: Math.random() * 6 + 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.15
    });
  }
}

function fireworkBurst(x, y, count = 40) {
  const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4081', '#7c4dff', '#00e5ff', '#76ff03', '#fff', '#ff9100', '#e040fb'];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    const speed = Math.random() * 7 + 3;
    burstParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      size: Math.random() * 5 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.08
    });
  }
}
