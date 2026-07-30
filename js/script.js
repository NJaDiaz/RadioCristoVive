// =========================================================
// Radio Cristo Vive — Script principal
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
  initMobileMenu();
  initHeaderScroll();
  initHeroRays();
  initCopyLink();
});

/* ---------- Reproductor (hero + barra flotante) ---------- */
function initPlayer(){
  const audio = document.getElementById('radioAudio');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const playerBar = document.getElementById('playerBar');
  const heroPlay = document.getElementById('heroPlay');
  const heroIcon = document.getElementById('heroIcon');
  const volSlider = document.getElementById('volSlider');

  if(!audio || !playBtn || !heroPlay) return;

  const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
  const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

  let isPlaying = false;

  function setPlayingUI(playing){
    isPlaying = playing;
    playIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    heroIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    playerBar.classList.toggle('paused', !playing);
    heroPlay.classList.toggle('playing', playing);
  }

  async function togglePlay(){
    try{
      if(isPlaying){
        audio.pause();
        setPlayingUI(false);
      } else {
        await audio.play();
        setPlayingUI(true);
      }
    }catch(e){
      console.warn('No se pudo reproducir el stream. Verificá la URL en el tag <audio> de index.html.', e);
    }
  }

  playBtn.addEventListener('click', togglePlay);
  heroPlay.addEventListener('click', togglePlay);

  if(volSlider){
    volSlider.addEventListener('input', (e) => {
      audio.volume = parseFloat(e.target.value);
    });
    audio.volume = parseFloat(volSlider.value || 0.85);
  }

  audio.addEventListener('waiting', () => playerBar.classList.add('paused'));
  audio.addEventListener('playing', () => playerBar.classList.remove('paused'));
}

/* ---------- Menú móvil ---------- */
function initMobileMenu(){
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(!burger || !mobileMenu) return;

  const links = mobileMenu.querySelectorAll('a[href^="#"]');

  function closeMenu(){
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  burger.addEventListener('click', () => {
    const willOpen = !mobileMenu.classList.contains('open');
    burger.classList.toggle('open', willOpen);
    mobileMenu.classList.toggle('open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  links.forEach(a => a.addEventListener('click', closeMenu));
}

/* ---------- Header con fondo al hacer scroll ---------- */
function initHeaderScroll(){
  const header = document.getElementById('siteHeader');
  if(!header) return;

  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

/* ---------- Rayos animados del amanecer (hero) ---------- */
function initHeroRays(){
  const raysContainer = document.querySelector('.rays');
  if(!raysContainer) return;

  const rayCount = 24;
  const frag = document.createDocumentFragment();
  for(let i = 0; i < rayCount; i++){
    const r = document.createElement('span');
    const angle = (360 / rayCount) * i;
    r.style.transform = `rotate(${angle}deg)`;
    r.style.opacity = (i % 2 === 0) ? 0.7 : 0.3;
    frag.appendChild(r);
  }
  raysContainer.appendChild(frag);
}

/* ---------- Copiar enlace de la página ---------- */
function initCopyLink(){
  const copyBtn = document.getElementById('copyLinkBtn');
  if(!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(window.location.href);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Enlace copiado ✓';
      setTimeout(() => { copyBtn.textContent = original; }, 2000);
    }catch(e){
      console.warn('No se pudo copiar el enlace.', e);
    }
  });
}
