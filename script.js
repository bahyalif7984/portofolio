const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));



const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
document.querySelectorAll('.image-launch').forEach(btn => {
  btn.addEventListener('click', () => {
    modalImage.src = btn.dataset.image;
    modalImage.alt = btn.dataset.title || 'Project artwork';
    modalTitle.textContent = btn.dataset.title || 'Project artwork';
    imageModal.showModal();
    document.body.classList.add('modal-open');
  });
});
function closeImage(){
  imageModal.close();
  document.body.classList.remove('modal-open');
}
imageModal.querySelector('.modal-close').addEventListener('click', closeImage);
imageModal.addEventListener('click', e => { if (e.target === imageModal) closeImage(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (imageModal.open) closeImage();
  }
});


// Footer: always return to the absolute top of the page.
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (history.replaceState) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
}


// Brand/logo: always return to the absolute top of the page.
const brandHome = document.getElementById('brand-home');
if (brandHome) {
  brandHome.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (history.replaceState) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
}


// Email button: Gmail Compose on desktop, native/default email app on mobile/tablet.
// The HTML href remains a mailto: fallback, while this handler explicitly routes
// mobile devices to mailto: and desktop/laptop browsers to Gmail Compose.
const emailButton = document.getElementById('email-me');
if (emailButton) {
  const emailAddress = 'alifbahyfreelancer@gmail.com';
  const emailSubject = 'Project Inquiry';
  const emailBody = 'Hi Bahy,\n\nI would like to discuss a project with you.';

  const mailtoUrl =
    'mailto:' + emailAddress +
    '?subject=' + encodeURIComponent(emailSubject) +
    '&body=' + encodeURIComponent(emailBody);

  const gmailComposeUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    '&to=' + encodeURIComponent(emailAddress) +
    '&su=' + encodeURIComponent(emailSubject) +
    '&body=' + encodeURIComponent(emailBody);

  // Keep a working fallback even if JavaScript is blocked or fails to load.
  emailButton.setAttribute('href', mailtoUrl);

  emailButton.addEventListener('click', (event) => {
    const userAgentMobile = navigator.userAgentData?.mobile === true;
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const coarseSmallScreen =
      window.matchMedia?.('(hover: none) and (pointer: coarse)').matches === true &&
      Math.min(window.screen.width, window.screen.height) <= 1024;

    const isMobileDevice = userAgentMobile || mobileUserAgent || iPadOS || coarseSmallScreen;

    event.preventDefault();

    if (isMobileDevice) {
      // Force Android/iOS to hand the request to an installed/default email app.
      // This avoids Gmail web opening only the Inbox on mobile browsers.
      window.location.href = mailtoUrl;
      return;
    }

    // Desktop/laptop: open Gmail web composer directly.
    const popup = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

    // If the browser blocks the new tab, fall back to the user's default email app.
    if (!popup) {
      window.location.href = mailtoUrl;
    }
  });
}


// Google Drive portfolio embeds.
// Keep the /preview URLs from index.html unchanged.
document.querySelectorAll('iframe[data-drive-file-id]').forEach((frame) => {
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
});


// Desktop-layout recovery after DevTools responsive/device emulation.
// The early <head> rescue owns normal detection; this is a defensive second pass
// after the full app has loaded so stale mobile classes cannot survive on desktop.
(() => {
  const root = document.documentElement;
  const clearStaleMobileMode = () => {
    const ua = navigator.userAgent || '';
    const uaMobile = navigator.userAgentData?.mobile === true ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const sw = Number(window.screen?.width || 0);
    const sh = Number(window.screen?.height || 0);
    const shortSide = sw && sh ? Math.min(sw, sh) : 9999;
    const touchSmall = navigator.maxTouchPoints > 0 && shortSide <= 900;

    if (!uaMobile && !touchSmall && window.innerWidth > 900) {
      root.classList.remove('force-mobile', 'desktop-mobile-request');
      root.style.removeProperty('--mobile-device-width');
      root.style.removeProperty('--mobile-rescue-zoom');
      nav?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  };

  window.addEventListener('resize', clearStaleMobileMode, { passive: true });
  window.addEventListener('pageshow', clearStaleMobileMode);
  clearStaleMobileMode();
})();




// V17 local 1080p portfolio video player.
// MP4 files are NOT requested on initial page load. The source is attached only after Play is clicked.
(() => {
  const videos = Array.from(document.querySelectorAll('.local-portfolio-video'));

  const pauseOthers = (current) => {
    videos.forEach((video) => {
      if (video !== current && !video.paused) video.pause();
    });
  };

  document.querySelectorAll('.local-video-play').forEach((button) => {
    button.addEventListener('click', async () => {
      const screen = button.closest('.local-video-screen');
      const video = screen?.querySelector('.local-portfolio-video');
      if (!video) return;

      pauseOthers(video);

      if (!video.dataset.loaded) {
        video.src = video.dataset.src;
        video.controls = true;
        video.dataset.loaded = 'true';
        video.load();
      }

      button.classList.add('is-hidden');
      screen.classList.add('is-loaded');

      try {
        await video.play();
      } catch (error) {
        // Native controls remain available if browser autoplay policy blocks play().
        button.classList.remove('is-hidden');
      }
    });
  });

  videos.forEach((video) => {
    video.addEventListener('play', () => pauseOthers(video));
  });
})();


/* V18 portrait fullscreen handler */
function openPortraitFullscreen(video){
    const screen = video.closest(".local-video-screen");
    if(!screen) return;

    screen.classList.add("fullscreen-mode");

    if(screen.requestFullscreen){
        screen.requestFullscreen();
    }
}

function closePortraitFullscreen(video){
    const screen = video.closest(".local-video-screen");
    if(screen){
        screen.classList.remove("fullscreen-mode");
    }

    if(document.fullscreenElement){
        document.exitFullscreen();
    }
}

document.addEventListener("fullscreenchange", function(){
    document.querySelectorAll(".local-video-screen").forEach(function(el){
        if(!document.fullscreenElement){
            el.classList.remove("fullscreen-mode");
        }
    });
});
