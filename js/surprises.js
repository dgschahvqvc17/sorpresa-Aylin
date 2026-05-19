function initSurprises() {
  const cards = document.querySelectorAll('.surprise-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.dataset.index);
      showSurprise(index);
    });
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
}

function closeModal() {
  const modal = document.getElementById('surprise-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function showSurprise(index) {
  const modal = document.getElementById('surprise-modal');
  const body = document.getElementById('modal-body');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  body.innerHTML = '<div class="surprise-content"><h3>Cargando...</h3></div>';

  const actions = [
    showStars,
    showHearts,
    showBalloons,
    showFlowers,
    showButterflies,
    showCake
  ];

  setTimeout(() => {
    actions[index]();
    addCloseButton(index);
    launchSurpriseEffects(index);
  }, 100);
}

function launchSurpriseEffects(index) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 3;

  const bursts = index === 5 ? 8 : 4;
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      const x = cx + (Math.random() - 0.5) * w * 0.7;
      const y = cy + (Math.random() - 0.5) * h * 0.5;
      confettiBurst(x, y, 25 + Math.floor(Math.random() * 20));
      fireworkBurst(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60, 20 + Math.floor(Math.random() * 15));
    }, i * 200);
  }
}

function addCloseButton(surpriseIndex) {
  const body = document.getElementById('modal-body');
  const content = body.querySelector('.surprise-content');
  if (!content) return;
  const existing = content.querySelector('.btn-close-surprise');
  if (existing) return;
  const btn = document.createElement('button');
  btn.className = 'btn-close-surprise';
  btn.textContent = surpriseIndex === 5 ? 'Ver mensaje final 💫' : 'Cerrar ✕';
  btn.addEventListener('click', () => {
    if (surpriseIndex === 5) {
      closeModal();
      if (typeof goToCoverWithFinal === 'function') {
        setTimeout(() => goToCoverWithFinal(), 300);
      }
    } else {
      closeModal();
    }
  });
  content.appendChild(btn);
}

function getModalBody() {
  return document.getElementById('modal-body');
}

// ===== SURPRISE 1: STARS =====
function showStars() {
  const body = getModalBody();
  body.innerHTML = `
    <div class="surprise-content">
      <h3>✨ Lluvia de Estrellas ✨</h3>
      <div class="surprise-stars" id="stars-container">
        ${Array.from({ length: 30 }, (_, i) => {
          const styles = [
            `animation-delay: -${i * 0.12}s`,
            `font-size: ${1 + Math.random() * 2.5}rem`,
            `opacity: ${0.4 + Math.random() * 0.6}`,
            `transform: rotate(${Math.random() * 360}deg)`
          ].join(';');
          const emojis = ['⭐', '✨', '🌟', '💫'];
          return `<span class="floating-item" style="${styles}">${emojis[i % emojis.length]}</span>`;
        }).join('')}
      </div>
      <p style="color: rgba(255,255,255,0.7); margin-top: 1.5rem; font-size: 0.95rem;">
        Que cada estrella ilumine tu camino ✨
      </p>
    </div>
  `;
  triggerConfettiBurst();
}

// ===== SURPRISE 2: HEARTS =====
function showHearts() {
  const body = getModalBody();
  body.innerHTML = `
    <div class="surprise-content">
      <h3>💕 Corazones Flotantes 💕</h3>
      <div class="surprise-hearts" id="hearts-container">
        ${Array.from({ length: 25 }, (_, i) => {
          const styles = [
            `animation-delay: -${i * 0.15}s`,
            `font-size: ${1.2 + Math.random() * 2.2}rem`,
            `opacity: ${0.5 + Math.random() * 0.5}`,
            `color: ${['#ff6b9d', '#ff4081', '#ff1493', '#ff9ec4', '#ff3355'][i % 5]}`
          ].join(';');
          const emojis = ['💕', '❤️', '💗', '💖', '💝'];
          return `<span class="floating-item" style="${styles}">${emojis[i % emojis.length]}</span>`;
        }).join('')}
      </div>
      <p style="color: rgba(255,255,255,0.7); margin-top: 1.5rem; font-size: 0.95rem;">
        Que el amor y la alegría te rodeen siempre 💕
      </p>
    </div>
  `;
  triggerConfettiBurst();
}

// ===== SURPRISE 3: BALLOONS =====
function showBalloons() {
  const body = getModalBody();
  const balloonColors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4081', '#7c4dff', '#00e5ff', '#76ff03'];
  body.innerHTML = `
    <div class="surprise-content">
      <h3>🎈 Globos de Colores 🎈</h3>
      <div class="surprise-balloons" id="balloons-container">
        ${Array.from({ length: 15 }, (_, i) => {
          const color = balloonColors[i % balloonColors.length];
          const size = 2 + Math.random() * 2;
          const styles = [
            `animation-delay: -${i * 0.2}s`,
            `font-size: ${size}rem`,
            `animation-duration: ${2.5 + Math.random() * 2}s`
          ].join(';');
          const balloons = ['🎈', '🎈', '🎈', '🎉', '🎊'];
          return `<span class="floating-item" style="${styles}">${balloons[i % balloons.length]}</span>`;
        }).join('')}
      </div>
      <p style="color: rgba(255,255,255,0.7); margin-top: 1.5rem; font-size: 0.95rem;">
        Que tus sueños vuelen tan alto como estos globos 🎈
      </p>
    </div>
  `;
  triggerConfettiBurst();
}

// ===== SURPRISE 4: FLOWERS =====
function showFlowers() {
  const body = getModalBody();
  body.innerHTML = `
    <div class="surprise-content">
      <h3>🌸 Flores Primaverales 🌸</h3>
      <div class="surprise-flowers" id="flowers-container">
        ${Array.from({ length: 20 }, (_, i) => {
          const styles = [
            `animation-delay: -${i * 0.18}s`,
            `font-size: ${1.5 + Math.random() * 2}rem`,
            `animation-duration: ${3 + Math.random() * 2}s`
          ].join(';');
          const flowers = ['🌸', '🌺', '🌹', '🌷', '🌻', '💐'];
          return `<span class="floating-item" style="${styles}">${flowers[i % flowers.length]}</span>`;
        }).join('')}
      </div>
      <p style="color: rgba(255,255,255,0.7); margin-top: 1.5rem; font-size: 0.95rem;">
        Que la vida te regale flores y colores hermosos 🌸
      </p>
    </div>
  `;
  triggerConfettiBurst();
}

// ===== SURPRISE 5: BUTTERFLIES =====
function showButterflies() {
  const body = getModalBody();
  body.innerHTML = `
    <div class="surprise-content">
      <h3>🦋 Mariposas de Luz 🦋</h3>
      <div class="surprise-butterflies" id="butterflies-container">
        ${Array.from({ length: 18 }, (_, i) => {
          const styles = [
            `animation-delay: -${i * 0.2}s`,
            `font-size: ${1.8 + Math.random() * 2}rem`,
            `animation-duration: ${3 + Math.random() * 3}s`,
            `filter: hue-rotate(${Math.random() * 360}deg) brightness(1.2)`
          ].join(';');
          const emojis = ['🦋', '🦋', '🦋', '✨', '💫'];
          return `<span class="floating-item" style="${styles}">${emojis[i % emojis.length]}</span>`;
        }).join('')}
      </div>
      <p style="color: rgba(255,255,255,0.7); margin-top: 1.5rem; font-size: 0.95rem;">
        Que la transformación te traiga cosas maravillosas 🦋
      </p>
    </div>
  `;
  triggerConfettiBurst();
}

// ===== SURPRISE 6: CAKE (ESPECIAL) =====
function showCake() {
  const body = getModalBody();
  body.innerHTML = `
    <div class="surprise-content">
      <h3>🎂 ¡Tarta Sorpresa! 🎉</h3>
      <div class="cake-container" id="cake-container">
        <div class="gift-box" id="gift-box">
          <div class="gift-box-lid">
            <div class="gift-ribbon-h"></div>
            <div class="gift-ribbon-v"></div>
          </div>
          <div class="gift-box-body">
            <div class="gift-ribbon-h"></div>
            <div class="gift-ribbon-v"></div>
          </div>
          <div class="gift-bow">🎀</div>
        </div>
        <div class="cake" id="cake">
          <div class="cake-top">
            <div class="cake-frosting"></div>
            <div class="candle candle-1"></div>
            <div class="candle candle-2"></div>
            <div class="candle candle-3"></div>
            <span class="cake-deco cake-deco-1">🌸</span>
            <span class="cake-deco cake-deco-2">✨</span>
          </div>
          <div class="cake-middle">
            <div class="cake-frosting"></div>
            <span class="cake-deco cake-deco-3">💕</span>
          </div>
          <div class="cake-base">
            <div class="cake-frosting"></div>
          </div>
          <div class="cake-platform"></div>
          <div class="cake-celebration-text">¡Feliz Cumpleaños Aylin! 🎉</div>
        </div>
      </div>
    </div>
  `;

  triggerConfettiBurst();

  const giftBox = document.getElementById('gift-box');
  const cake = document.getElementById('cake');

  setTimeout(() => {
    giftBox.classList.add('open');
    setTimeout(() => {
      giftBox.style.display = 'none';
      cake.classList.add('show');
      setTimeout(() => {
        cake.classList.add('bouncing');
        launchCakeConfetti();
      }, 500);
    }, 800);
  }, 500);
}

function launchCakeConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  let count = 0;
  const interval = setInterval(() => {
    confettiBurst(
      cx + (Math.random() - 0.5) * rect.width * 0.6,
      cy + (Math.random() - 0.5) * rect.height * 0.4,
      30
    );
    count++;
    if (count >= 5) clearInterval(interval);
  }, 300);
}

function triggerConfettiBurst() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 3;
  setTimeout(() => confettiBurst(cx, cy, 50), 200);
}
