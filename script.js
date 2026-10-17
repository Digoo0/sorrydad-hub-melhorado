const portfolioTrigger = document.querySelector('.portfolio-trigger');
const portfolioModal = document.querySelector('#portfolio-modal');
const portfolioClose = document.querySelector('.portfolio-close');
const portfolioItems = [...document.querySelectorAll('.portfolio-item')];
const lightbox = document.querySelector('#portfolio-lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCounter = document.querySelector('.lightbox-counter');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentImage = 0;
let touchStartX = 0;

function openPortfolio() {
  portfolioModal.showModal();
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => portfolioModal.classList.add('is-visible'));
  });
  portfolioClose.focus();
}

function closePortfolio() {
  portfolioModal.classList.remove('is-visible');
  const finishClose = () => {
    portfolioModal.close();
    document.body.classList.remove('modal-open');
    portfolioTrigger.focus();
  };

  if (prefersReducedMotion.matches) {
    finishClose();
  } else {
    window.setTimeout(finishClose, 240);
  }
}

function showImage(index) {
  currentImage = (index + portfolioItems.length) % portfolioItems.length;
  const sourceImage = portfolioItems[currentImage].querySelector('img');
  lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCounter.textContent = `${currentImage + 1} / ${portfolioItems.length}`;
}

function openLightbox(index) {
  showImage(index);
  lightbox.showModal();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => lightbox.classList.add('is-visible'));
  });
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-visible');
  const finishClose = () => {
    lightbox.close();
    portfolioItems[currentImage].focus();
  };

  if (prefersReducedMotion.matches) finishClose();
  else window.setTimeout(finishClose, 220);
}

portfolioTrigger.addEventListener('click', openPortfolio);
portfolioClose.addEventListener('click', closePortfolio);
portfolioModal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closePortfolio();
});
portfolioModal.addEventListener('click', (event) => {
  if (event.target === portfolioModal) closePortfolio();
});
portfolioItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showImage(currentImage - 1));
lightboxNext.addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeLightbox();
});
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox || event.target === document.querySelector('.lightbox-figure')) closeLightbox();
});
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showImage(currentImage - 1);
  if (event.key === 'ArrowRight') showImage(currentImage + 1);
});
lightboxImage.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
lightboxImage.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) < 45) return;
  showImage(currentImage + (distance < 0 ? 1 : -1));
}, { passive: true });
