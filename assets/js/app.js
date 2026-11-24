// Mahira 1st Month Anniversary Microsite
// Created with love by Paw for Naya (Mahira Fauzia Abhinaya)
// Date: 26.10.2026 -> 26.11.2026

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const lockscreen = document.getElementById('lockscreen');
  const lockIcon = document.getElementById('lock-icon');
  const unlockIcon = document.getElementById('unlock-icon');
  const clockEl = document.getElementById('lockscreen-clock');
  const dateEl = document.getElementById('lockscreen-date');
  const pinDots = document.querySelectorAll('.pin-dot');
  const pinErrorMsg = document.getElementById('pin-error');
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  const hintBtn = document.getElementById('hint-btn');
  const hintModal = document.getElementById('hint-modal');
  const closeHintBtn = document.getElementById('close-hint-btn');

  // Audio Elements
  const bgAudio = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicDisc = document.getElementById('music-disc');
  const musicIconPlay = document.getElementById('music-icon-play');
  const musicIconPause = document.getElementById('music-icon-pause');

  // Letter & Flower Elements
  const waxSeal = document.getElementById('wax-seal');
  const envelope = document.getElementById('envelope-container');
  const fullLetterModal = document.getElementById('full-letter-modal');
  const openLetterBtn = document.getElementById('open-letter-btn');
  const closeLetterBtn = document.getElementById('close-letter-btn');

  // Closing & Confetti
  const loveBtn = document.getElementById('love-btn');
  const loveResponse = document.getElementById('love-response');

  // Image Modal
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // State
  let enteredPin = '';
  const CORRECT_PIN = '26102026';
  let isUnlocked = false;
  let isAudioPlaying = false;

  // 1. Clock & Date Initialization
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${hours}:${minutes}`;

    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Audio Synthesizer for gentle glass key tap sound
  let audioCtx = null;
  function playKeySound(isSuccess = false) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (isSuccess) {
        // Sweet bell chime on unlocking
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        // Gentle crystal key tap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(780, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      }
    } catch (e) {}
  }

  // Floating sparkle / heart particle from key press
  function createTapParticle(x, y) {
    const symbols = ['❤️', '✨', '💕', '🌸', '💫'];
    const p = document.createElement('div');
    p.className = 'key-tap-particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    document.body.appendChild(p);
    setTimeout(() => {
      p.remove();
    }, 700);
  }

  // 2. PIN Keypad Interaction
  keypadBtns.forEach(btn => {
    // Trigger on pointerdown or click for ultra-responsive feel
    const handlePress = (e) => {
      if (isUnlocked) return;
      const key = btn.getAttribute('data-key');

      // Visual flash & ripple class
      btn.classList.add('key-pressed');
      setTimeout(() => btn.classList.remove('key-pressed'), 140);

      // Sound feedback
      playKeySound(false);

      // Touch / Click particle effect
      const rect = btn.getBoundingClientRect();
      const x = e.clientX || (rect.left + rect.width / 2);
      const y = e.clientY || (rect.top + rect.height / 2);
      createTapParticle(x, y);
      
      // Haptic-like vibration on mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }

      if (key === 'backspace') {
        if (enteredPin.length > 0) {
          enteredPin = enteredPin.slice(0, -1);
          updatePinDots();
        }
      } else if (key === 'hint') {
        openHint();
      } else if (enteredPin.length < 8) {
        enteredPin += key;
        updatePinDots(true);

        if (enteredPin.length === 8) {
          validatePin();
        }
      }
    };

    btn.addEventListener('click', handlePress);
  });

  // Keyboard support for desktop testing
  window.addEventListener('keydown', (e) => {
    if (isUnlocked) return;
    if (e.key >= '0' && e.key <= '9') {
      if (enteredPin.length < 8) {
        // Trigger matching button animation if on screen
        const matchingBtn = document.querySelector(`button[data-key="${e.key}"]`);
        if (matchingBtn) {
          matchingBtn.classList.add('key-pressed');
          setTimeout(() => matchingBtn.classList.remove('key-pressed'), 140);
          const rect = matchingBtn.getBoundingClientRect();
          createTapParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        playKeySound(false);
        enteredPin += e.key;
        updatePinDots(true);
        if (enteredPin.length === 8) validatePin();
      }
    } else if (e.key === 'Backspace') {
      if (enteredPin.length > 0) {
        playKeySound(false);
        enteredPin = enteredPin.slice(0, -1);
        updatePinDots();
      }
    }
  });

  function updatePinDots(isAdding = false) {
    pinDots.forEach((dot, index) => {
      if (index < enteredPin.length) {
        dot.classList.add('bg-white', 'border-white', 'shadow-md');
        dot.classList.remove('bg-white/10', 'border-white/50');
        if (isAdding && index === enteredPin.length - 1) {
          dot.classList.add('pin-dot-pop');
          setTimeout(() => dot.classList.remove('pin-dot-pop'), 250);
        }
      } else {
        dot.classList.remove('bg-white', 'border-white', 'shadow-md', 'pin-dot-pop');
        dot.classList.add('bg-white/10', 'border-white/50');
      }
    });
  }

  function validatePin() {
    if (enteredPin === CORRECT_PIN) {
      // SUCCESS!
      isUnlocked = true;
      pinErrorMsg.classList.add('opacity-0');
      
      // Success feedback
      playKeySound(true);
      pinDots.forEach(dot => {
        dot.classList.remove('bg-white');
        dot.classList.add('bg-rose-400', 'border-rose-300', 'animate-pulse');
      });

      if (lockIcon) lockIcon.classList.add('hidden');
      if (unlockIcon) unlockIcon.classList.remove('hidden');

      // Start audio playback
      playAudio();

      // Trigger celebratory mini confetti
      triggerMiniConfetti();

      // Slide up lockscreen after short delightful delay
      setTimeout(() => {
        lockscreen.classList.add('-translate-y-full', 'opacity-0');
        setTimeout(() => {
          lockscreen.style.display = 'none';
        }, 800);
      }, 500);

    } else {
      // WRONG PIN
      const pinContainer = document.getElementById('pin-dots-container');
      pinContainer.classList.add('animate-shake');
      pinErrorMsg.textContent = "Ups, coba ingat-ingat tanggal spesial kita ya sayang... 💕";
      pinErrorMsg.classList.remove('opacity-0');
      
      pinDots.forEach(dot => {
        dot.classList.add('bg-red-400/80', 'border-red-300');
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([80, 50, 80]);
      }

      setTimeout(() => {
        pinContainer.classList.remove('animate-shake');
        enteredPin = '';
        updatePinDots();
        pinDots.forEach(dot => {
          dot.classList.remove('bg-red-400/80', 'border-red-300');
        });
      }, 700);
    }
  }

  // 3. Hint Modal
  function openHint() {
    if (hintModal) {
      hintModal.classList.remove('hidden');
      setTimeout(() => hintModal.classList.remove('opacity-0'), 10);
    }
  }
  function closeHint() {
    if (hintModal) {
      hintModal.classList.add('opacity-0');
      setTimeout(() => hintModal.classList.add('hidden'), 300);
    }
  }
  if (hintBtn) hintBtn.addEventListener('click', openHint);
  if (closeHintBtn) closeHintBtn.addEventListener('click', closeHint);

  // 4. Audio Control
  function playAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      updateMusicUI(true);
      // Smooth fade in
      let vol = 0;
      const fadeInterval = setInterval(() => {
        if (vol < 0.75) {
          vol += 0.05;
          bgAudio.volume = Math.min(vol, 0.75);
        } else {
          clearInterval(fadeInterval);
        }
      }, 120);
    }).catch(err => {
      console.log('Audio autoplay prevented or error:', err);
    });
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateMusicUI(true);
      });
    } else {
      bgAudio.pause();
      isAudioPlaying = false;
      updateMusicUI(false);
    }
  }

  function updateMusicUI(playing) {
    if (!musicDisc) return;
    if (playing) {
      musicDisc.classList.add('animate-spin-slow');
      if (musicIconPlay) musicIconPlay.classList.add('hidden');
      if (musicIconPause) musicIconPause.classList.remove('hidden');
    } else {
      musicDisc.classList.remove('animate-spin-slow');
      if (musicIconPlay) musicIconPlay.classList.remove('hidden');
      if (musicIconPause) musicIconPause.classList.add('hidden');
    }
  }
  if (musicToggle) musicToggle.addEventListener('click', toggleAudio);

  // 5. Love Letter Modal Interaction
  function openLetter() {
    if (envelope) envelope.classList.add('envelope-open');
    if (fullLetterModal) {
      fullLetterModal.classList.remove('hidden');
      setTimeout(() => {
        fullLetterModal.classList.remove('opacity-0', 'pointer-events-none');
        fullLetterModal.querySelector('.modal-content')?.classList.remove('scale-95');
      }, 20);
    }
  }

  function closeLetter() {
    if (fullLetterModal) {
      fullLetterModal.classList.add('opacity-0', 'pointer-events-none');
      fullLetterModal.querySelector('.modal-content')?.classList.add('scale-95');
      setTimeout(() => {
        fullLetterModal.classList.add('hidden');
      }, 300);
    }
  }

  if (waxSeal) waxSeal.addEventListener('click', openLetter);
  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetter);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetter);

  // 6. Interactive 4-Flower Bouquet
  const flowerCards = document.querySelectorAll('.flower-card');
  const flowerModal = document.getElementById('flower-modal');
  const flowerModalIcon = document.getElementById('flower-modal-icon');
  const flowerModalName = document.getElementById('flower-modal-name');
  const flowerModalMeaning = document.getElementById('flower-modal-meaning');
  const flowerModalQuote = document.getElementById('flower-modal-quote');
  const closeFlowerBtn = document.getElementById('close-flower-btn');

  const flowerData = {
    rose: {
      name: "Rose (Mawar Merah Muda)",
      icon: "🌹",
      meaning: "The Bloom of Deepening Love",
      quote: "For a love that blooms softly, growing deeper and fonder with each passing day. With you, every thorn of life softens into quiet devotion."
    },
    tulip: {
      name: "Tulip",
      icon: "🌷",
      meaning: "Our Pure Beginning",
      quote: "For our new beginning—the purest, most beautiful chapter I have ever had the grace to open. A symbol of true romance, rooted in gratitude."
    },
    lily: {
      name: "Lily",
      icon: "🌸",
      meaning: "Grace & Serenity",
      quote: "For the quiet grace of your soul, and a smile that never fails to bring stillness to my world. You are my calmest sanctuary."
    },
    jasmine: {
      name: "Jasmine (Melati)",
      icon: "🤍",
      meaning: "Timeless Sincerity & Warmth",
      quote: "For the timeless warmth and gentle comfort your presence brings to my life. Pure, fragrant, and soothing in every season."
    }
  };

  flowerCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-flower');
      const data = flowerData[type];
      if (data && flowerModal) {
        flowerModalIcon.textContent = data.icon;
        flowerModalName.textContent = data.name;
        flowerModalMeaning.textContent = data.meaning;
        flowerModalQuote.textContent = `"${data.quote}"`;

        // Small petal burst
        triggerPetalConfetti();

        flowerModal.classList.remove('hidden');
        setTimeout(() => flowerModal.classList.remove('opacity-0'), 10);
      }
    });
  });

  if (closeFlowerBtn) {
    closeFlowerBtn.addEventListener('click', () => {
      if (flowerModal) {
        flowerModal.classList.add('opacity-0');
        setTimeout(() => flowerModal.classList.add('hidden'), 300);
      }
    });
  }

  // 7. Polaroid Photo Lightbox Modal
  const polaroids = document.querySelectorAll('.polaroid-trigger');
  polaroids.forEach(p => {
    p.addEventListener('click', () => {
      const img = p.querySelector('img');
      const title = p.getAttribute('data-title') || '';
      const quote = p.getAttribute('data-quote') || '';
      if (img && imageModal) {
        modalImg.src = img.src;
        modalCaption.innerHTML = `<h4 class="font-serif-title font-semibold text-lg text-rose-900">${title}</h4><p class="font-prose italic text-neutral-700 mt-2 text-base leading-relaxed">${quote}</p>`;
        imageModal.classList.remove('hidden');
        setTimeout(() => imageModal.classList.remove('opacity-0'), 10);
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (imageModal) {
        imageModal.classList.add('opacity-0');
        setTimeout(() => imageModal.classList.add('hidden'), 300);
      }
    });
  }

  // 8. Closing Love Button & Confetti Explosion
  if (loveBtn) {
    loveBtn.addEventListener('click', () => {
      // Full Celebration Confetti
      triggerFullConfetti();
      loveBtn.classList.add('scale-105', 'bg-rose-700');
      loveBtn.innerHTML = `<span>Forever & Always, Paw ❤️</span>`;
      if (loveResponse) {
        loveResponse.classList.remove('hidden');
        setTimeout(() => loveResponse.classList.remove('opacity-0'), 20);
      }
    });
  }

  // 9. Confetti Helpers
  function triggerMiniConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E89999', '#A3485E', '#FFFFFF', '#FFD1DC']
    });
  }

  function triggerPetalConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7']
    });
  }

  function triggerFullConfetti() {
    if (typeof confetti !== 'function') return;
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#E89999', '#A3485E', '#FFB6C1', '#D4AF37', '#FAF8F5']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#E89999', '#A3485E', '#FFB6C1', '#D4AF37', '#FAF8F5']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // 10. Background Ambient Canvas Floating Hearts
  initAmbientHearts();
  function initAmbientHearts() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(window.innerWidth < 600 ? 16 : 28, 30);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 5,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.35 + 0.1,
        color: ['rgba(232, 153, 153, ', 'rgba(163, 72, 94, ', 'rgba(255, 209, 220, '][Math.floor(Math.random() * 3)]
      });
    }

    function drawHeart(x, y, size, color, opacity) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(x, y);
      ctx.scale(size / 20, size / 20);
      ctx.fillStyle = color + opacity + ')';
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -10, -15, 5, 0, 15);
      ctx.bezierCurveTo(15, 5, 10, -10, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        drawHeart(p.x, p.y, p.size, p.color, p.opacity);
      });
      requestAnimationFrame(animate);
    }
    animate();
  }
});
