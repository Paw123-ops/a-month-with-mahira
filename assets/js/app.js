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

  // 0. Blooming Flowers Preloader Sequence (3.6s duration)
  initPreloader();
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloader-progress');
    const percentText = document.getElementById('preloader-percent');
    if (!preloader) return;

    let progress = 0;
    const totalDuration = 3600; // 3.6s
    const stepTime = 40;
    const increment = 100 / (totalDuration / stepTime);

    const timer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);

        if (progressBar) progressBar.style.width = '100%';
        if (percentText) percentText.textContent = 'Merekah sempurna... 100% 🌸';

        // Smooth dissolve into lockscreen
        setTimeout(() => {
          preloader.classList.add('preloader-fade-out');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 950);
        }, 350);

      } else {
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentText) {
          const currentPercent = Math.floor(progress);
          if (currentPercent < 35) {
            percentText.textContent = `Menumbuhkan kelopak bunga... ${currentPercent}%`;
          } else if (currentPercent < 75) {
            percentText.textContent = `Menyusun kenangan berdua... ${currentPercent}%`;
          } else {
            percentText.textContent = `Merekahkan kejutan untuk Naya... ${currentPercent}% 🌸`;
          }
        }
      }
    }, stepTime);
  }

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
    let lastTap = 0;
    const handlePress = (e) => {
      if (isUnlocked) return;
      const now = Date.now();
      if (now - lastTap < 90) return; // Prevent double firing
      lastTap = now;

      const key = btn.getAttribute('data-key');
      if (!key) return;

      // Visual flash & ripple class
      btn.classList.add('key-pressed');
      setTimeout(() => btn.classList.remove('key-pressed'), 140);

      // Sound feedback
      playKeySound(false);

      // Touch / Click particle effect
      const rect = btn.getBoundingClientRect();
      const x = (e && e.clientX) ? e.clientX : (rect.left + rect.width / 2);
      const y = (e && e.clientY) ? e.clientY : (rect.top + rect.height / 2);
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

    btn.addEventListener('pointerdown', handlePress);
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
        dot.classList.add('pin-dot-active', 'bg-white', 'border-white', 'shadow-md');
        dot.classList.remove('bg-white/10', 'border-white/50');
        if (isAdding && index === enteredPin.length - 1) {
          dot.classList.add('pin-dot-pop');
          setTimeout(() => dot.classList.remove('pin-dot-pop'), 280);
        }
      } else {
        dot.classList.remove('pin-dot-active', 'bg-white', 'border-white', 'shadow-md', 'pin-dot-pop');
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
        dot.classList.remove('pin-dot-active');
        dot.classList.add('bg-rose-400', 'border-rose-300', 'animate-pulse');
      });

      // Animate lock shackle opening!
      document.getElementById('lock-shackle')?.classList.add('shackle-unlocked');

      // Start audio playback
      playAudio();

      // Trigger celebratory mini confetti
      triggerMiniConfetti();

      // Fluid dissolve dismissal
      setTimeout(() => {
        lockscreen.classList.add('lockscreen-dismiss');
        setTimeout(() => {
          lockscreen.style.display = 'none';
        }, 850);
      }, 450);

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

  // Camera Shutter Sound Synthesizer & Smooth Flash
  function playCameraShutter() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;

      // Click 1: Mechanical shutter trigger click (high-pitch snap)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1600, now);
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.035);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.045);

      // Mechanical friction / mirror flap white noise burst
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.03);
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 2200;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      whiteNoise.start(now);

      // Click 2: Shutter blade close snap (50ms after first click)
      const t2 = now + 0.05;
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(900, t2);
      osc2.frequency.exponentialRampToValueAtTime(140, t2 + 0.05);
      gain2.gain.setValueAtTime(0.4, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.06);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.065);
    } catch (e) {
      console.log('Camera sound unavailable:', e);
    }
  }

  function triggerCameraFlash() {
    let flash = document.getElementById('camera-flash-overlay');
    if (!flash) {
      flash = document.createElement('div');
      flash.id = 'camera-flash-overlay';
      flash.className = 'camera-flash-overlay';
      document.body.appendChild(flash);
    }
    flash.classList.add('flashing');
    setTimeout(() => {
      flash.classList.remove('flashing');
    }, 70);
  }

  // 7. Polaroid Photo Lightbox Modal
  const polaroids = document.querySelectorAll('.polaroid-trigger');
  polaroids.forEach(p => {
    p.addEventListener('click', () => {
      const img = p.querySelector('img');
      const title = p.getAttribute('data-title') || '';
      const quote = p.getAttribute('data-quote') || '';

      // Shutter sound, flash, and haptic feedback
      playCameraShutter();
      triggerCameraFlash();
      if ('vibrate' in navigator) {
        navigator.vibrate(35);
      }

      if (img && imageModal) {
        modalImg.src = img.src;
        modalCaption.innerHTML = `<h4 class="font-serif-title font-semibold text-lg text-rose-900">${title}</h4><p class="font-prose italic text-neutral-700 mt-2 text-base leading-relaxed">${quote}</p>`;
        setTimeout(() => {
          imageModal.classList.remove('hidden');
          setTimeout(() => imageModal.classList.remove('opacity-0'), 15);
        }, 80);
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      playKeySound(false);
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

  // Lockscreen Ambient Stardust & Fireflies
  initLockscreenStardust();
  function initLockscreenStardust() {
    const canvas = document.getElementById('lockscreen-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const sparks = [];
    for (let i = 0; i < 24; i++) {
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.25,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.45 + 0.15),
        color: ['#FFD1DC', '#FFE4E1', '#FFFACD', '#FFFFFF', '#FFB6C1'][Math.floor(Math.random() * 5)]
      });
    }

    function render() {
      if (isUnlocked) return; // Save resources when unlocked
      ctx.clearRect(0, 0, w, h);
      sparks.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.y < -10) s.y = h + 10;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * (0.6 + Math.sin(Date.now() * 0.003 + s.x) * 0.4);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(render);
    }
    render();
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

  // 11. Love Journey Counter (Real-time Live Stopwatch)
  initLoveCounter();
  function initLoveCounter() {
    // Official Anniversary Start Date: 26 October 2026 00:00:00
    const startDate = new Date(2026, 9, 26, 0, 0, 0); // Month is 0-indexed: 9 = October
    const daysEl = document.getElementById('counter-days');
    const hoursEl = document.getElementById('counter-hours');
    const minutesEl = document.getElementById('counter-minutes');
    const secondsEl = document.getElementById('counter-seconds');

    function updateCounter() {
      const now = new Date();
      const diff = Math.max(0, now.getTime() - startDate.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // 12. Polaroid "Love This Memory" Buttons
  initMemoryLikes();
  function initMemoryLikes() {
    const likeBtns = document.querySelectorAll('.like-memory-btn');
    likeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const heartIcon = btn.querySelector('.like-heart');
        const countEl = btn.querySelector('.like-count');
        let count = parseInt(countEl.textContent, 10) || 0;

        playKeySound(false);

        count++;
        countEl.textContent = count;
        heartIcon.textContent = '❤️';
        heartIcon.classList.add('heart-bounce');
        setTimeout(() => heartIcon.classList.remove('heart-bounce'), 400);

        // Spawn 4 floating hearts
        const btnRect = btn.getBoundingClientRect();
        for (let i = 0; i < 4; i++) {
          const heart = document.createElement('div');
          heart.className = 'floating-polaroid-heart';
          heart.textContent = ['❤️', '💖', '💕', '✨'][i % 4];
          heart.style.left = `${btnRect.left + btnRect.width / 2}px`;
          heart.style.top = `${btnRect.top}px`;
          heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 50}px`);
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 850);
        }
      });
    });
  }

  // 13. Month 2 Secret Time Capsule Modal
  initCapsuleModal();
  function initCapsuleModal() {
    const timeCapsuleCard = document.getElementById('time-capsule-card');
    const unlockCapsuleBtn = document.getElementById('unlock-capsule-btn');
    const capsuleModal = document.getElementById('capsule-modal');
    const closeCapsuleBtn = document.getElementById('close-capsule-btn');
    const ackCapsuleBtn = document.getElementById('ack-capsule-btn');
    const capsuleIconWrap = document.getElementById('capsule-icon-wrap');

    function triggerCapsuleOpen() {
      if (capsuleIconWrap) {
        capsuleIconWrap.classList.add('animate-shake');
        setTimeout(() => capsuleIconWrap.classList.remove('animate-shake'), 600);
      }
      playKeySound(false);
      if (capsuleModal) {
        capsuleModal.classList.remove('hidden');
        setTimeout(() => capsuleModal.classList.remove('opacity-0'), 10);
      }
    }

    function closeCapsule() {
      if (capsuleModal) {
        capsuleModal.classList.add('opacity-0');
        setTimeout(() => capsuleModal.classList.add('hidden'), 300);
      }
    }

    if (timeCapsuleCard) timeCapsuleCard.addEventListener('click', triggerCapsuleOpen);
    if (unlockCapsuleBtn) unlockCapsuleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerCapsuleOpen();
    });
    if (closeCapsuleBtn) closeCapsuleBtn.addEventListener('click', closeCapsule);
    if (ackCapsuleBtn) ackCapsuleBtn.addEventListener('click', closeCapsule);
  }

  // 14. 10 Hal yang Paling Paw Suka dari Naya
  initTenThings();
  function initTenThings() {
    const reasonCards = document.querySelectorAll('.reason-card');
    const progressText = document.getElementById('reasons-progress-text');
    const progressIcon = document.getElementById('reasons-progress-icon');
    const tappedSet = new Set();

    reasonCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const index = card.getAttribute('data-index');
        tappedSet.add(index);
        card.classList.add('is-tapped');

        const hint = card.querySelector('.reason-tap-hint');
        if (hint) {
          hint.textContent = 'Paw sayang Naya ❤️';
          hint.classList.add('text-rose-600', 'font-semibold');
        }

        playKeySound(false);

        // Spawn floating hearts from click position or card center
        const rect = card.getBoundingClientRect();
        const clientX = (e.clientX && e.clientX > 0) ? e.clientX : (rect.left + rect.width / 2);
        const clientY = (e.clientY && e.clientY > 0) ? e.clientY : (rect.top + rect.height / 2);

        for (let i = 0; i < 5; i++) {
          const heart = document.createElement('div');
          heart.className = 'floating-reason-heart';
          heart.textContent = ['❤️', '💖', '✨', '💕', '🥰'][i % 5];
          heart.style.left = `${clientX}px`;
          heart.style.top = `${clientY}px`;
          heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 850);
        }

        if (progressText) {
          const count = tappedSet.size;
          if (count === 10) {
            progressText.textContent = 'Semua 10 hal sudah kamu baca! Terima kasih sudah menjadi Naya yang luar biasa untuk Paw ❤️';
            if (progressIcon) progressIcon.textContent = '🎉';
            if (typeof confetti === 'function') {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          } else {
            progressText.textContent = `${count} dari 10 hal sudah kamu baca. Masih ada lagi hal manis tentangmu! 💕`;
          }
        }
      });
    });
  }
});
