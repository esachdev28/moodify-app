/**
 * Winter Mode Integration for Moodify App
 * Powered by winter-mode NPM Package: https://github.com/esachdev28/npm_package
 */

(function () {
  'use strict';

  function initWinterIntegration() {
    var toggleBtn = document.getElementById('winter-toggle-btn');
    var isEnabled = localStorage.getItem('moodify_winter_mode') === 'true';

    // Helper to update toggle button UI
    function updateButtonUI(active) {
      if (!toggleBtn) return;
      if (active) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '❄️ Winter: ON';
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '❄️ Winter Mode';
      }
    }

    // Start or stop based on saved preference
    if (typeof WinterMode !== 'undefined') {
      if (isEnabled) {
        WinterMode.start({
          flakes: 150,
          speed: 1,
          wind: 0.2,
          crystals: true,
          stick: true,
          ground: true
        });
        updateButtonUI(true);
      } else {
        updateButtonUI(false);
      }
    }

    // Toggle button event listener
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        if (typeof WinterMode === 'undefined') return;

        if (WinterMode.isRunning()) {
          WinterMode.stop();
          localStorage.setItem('moodify_winter_mode', 'false');
          updateButtonUI(false);
          showToast('❄️ Winter Mode disabled');
        } else {
          WinterMode.start({
            flakes: 150,
            speed: 1,
            wind: 0.2,
            crystals: true,
            stick: true,
            ground: true
          });
          localStorage.setItem('moodify_winter_mode', 'true');
          updateButtonUI(true);
          showToast('❄️ Winter Mode active! Hover over text to shake snow.');
        }
      });
    }

    // Listen for 'Chill' mood clicks on Home page
    var chillCard = document.querySelector('.moodcard.chill');
    if (chillCard) {
      chillCard.addEventListener('click', function () {
        localStorage.setItem('moodify_winter_mode', 'true');
        if (typeof WinterMode !== 'undefined' && !WinterMode.isRunning()) {
          WinterMode.start({ flakes: 180, wind: 0.3 });
        }
      });
    }
  }

  // Toast notification for delightful UX
  function showToast(message) {
    var existing = document.getElementById('winter-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'winter-toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#0284c7';
    toast.style.color = '#ffffff';
    toast.style.padding = '10px 22px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.18)';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '2147483647';
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(-5px)';
    });

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(0)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWinterIntegration);
  } else {
    initWinterIntegration();
  }
})();
