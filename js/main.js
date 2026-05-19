let musicPlaying = false;
let letterOpened = false;

document.addEventListener('DOMContentLoaded', () => {
  initSparkles('sparkles-container', 80);
  initFireworks('fireworks-canvas');
  initConfetti('confetti-canvas');
  initFireworks('letter-fireworks');
  initConfetti('letter-confetti');
  initSurprises();
  setupMusic();
  setupCover();
  setupLetter();
});

// ===== FUNCTION WRAPPERS (for inline use) =====
function triggerConfettiBurst(x, y, count) {
  if (typeof confettiBurst === 'function') {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      confettiBurst(x || rect.width / 2, y || rect.height / 3, count || 50);
    }
  }
}

// ===== MUSIC =====
function setupMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-control');
  const icon = btn.querySelector('.music-icon');

  audio.volume = 0.12;

  btn.addEventListener('click', () => {
    if (musicPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      icon.textContent = '🎵';
      musicPlaying = false;
    } else {
      audio.play().then(() => {
        btn.classList.add('playing');
        icon.textContent = '🔊';
        musicPlaying = true;
      }).catch(() => {
        icon.textContent = '🎵';
      });
    }
  });

  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

function tryAutoPlayMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-control');
  const icon = btn.querySelector('.music-icon');
  if (!musicPlaying) {
    audio.volume = 0.12;
    audio.play().then(() => {
      btn.classList.add('playing');
      icon.textContent = '🔊';
      musicPlaying = true;
    }).catch(() => {});
  }
}

// ===== COVER =====
function setupCover() {
  document.getElementById('openBtn').addEventListener('click', () => {
    tryAutoPlayMusic();
    goToLetter();
  });
}

// ===== LETTER =====
function setupLetter() {
  const envelope = document.getElementById('envelope');
  const flap = document.getElementById('envelope-flap');
  const paper = document.getElementById('letter-paper');
  const continueBtn = document.getElementById('continueBtn');

  envelope.addEventListener('click', () => {
    if (letterOpened) return;
    letterOpened = true;
    flap.classList.add('open');
    triggerConfettiBurst();
    setTimeout(() => {
      envelope.classList.add('hidden');
      paper.classList.add('show');
      paper.style.display = 'block';
    }, 800);
  });

  continueBtn.addEventListener('click', () => {
    triggerConfettiBurst();
    goToSurprises();
  });
}

function goToLetter() {
  const cover = document.getElementById('cover');
  const letterSection = document.getElementById('letter-section');
  cover.style.display = 'none';
  letterSection.classList.add('active');
  letterSection.style.display = 'flex';
  window.scrollTo(0, 0);
}

function goToSurprises() {
  const letterSection = document.getElementById('letter-section');
  const surprisesSection = document.getElementById('surprises-section');
  letterSection.classList.remove('active');
  letterSection.style.display = 'none';
  surprisesSection.classList.add('active');
  surprisesSection.style.display = 'flex';
  window.scrollTo(0, 0);
}

function goToCoverWithFinal() {
  const letterSection = document.getElementById('letter-section');
  const surprisesSection = document.getElementById('surprises-section');
  letterSection.classList.remove('active');
  letterSection.style.display = 'none';
  surprisesSection.classList.remove('active');
  surprisesSection.style.display = 'none';
  document.getElementById('cover').style.display = 'flex';
  window.scrollTo(0, 0);
  showFinalMessage();
}

function showFinalMessage() {
  const el = document.getElementById('final-message');
  el.classList.remove('hidden');
  triggerConfettiBurst();
  for (let i = 0; i < 5; i++) {
    setTimeout(() => triggerConfettiBurst(), (i + 1) * 400);
  }
  spawnHearts();
  const closeBtn = document.getElementById('final-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      el.classList.add('hidden');
      resetPage();
    });
  }
  const backdrop = el.querySelector('.final-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      el.classList.add('hidden');
      resetPage();
    });
  }
}

function resetPage() {
  letterOpened = false;
  document.getElementById('cover').style.display = 'flex';
  document.getElementById('final-message').classList.add('hidden');
  const envelope = document.getElementById('envelope');
  envelope.classList.remove('hidden');
  envelope.style.display = '';
  const flap = document.getElementById('envelope-flap');
  flap.classList.remove('open');
  const paper = document.getElementById('letter-paper');
  paper.classList.remove('show');
  paper.style.display = '';
  const letterSection = document.getElementById('letter-section');
  letterSection.classList.remove('active');
  letterSection.style.display = '';
  const surprisesSection = document.getElementById('surprises-section');
  surprisesSection.classList.remove('active');
  surprisesSection.style.display = '';
  window.scrollTo(0, 0);
}

function spawnHearts() {
  const container = document.getElementById('final-hearts');
  if (!container) return;
  const emojis = ['💕', '❤️', '💗', '💖', '💝', '✨', '💫'];
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const span = document.createElement('span');
    span.className = 'final-heart';
    span.textContent = emojis[i % emojis.length];
    span.style.animationDelay = `-${i * 0.4}s`;
    container.appendChild(span);
  }
}
