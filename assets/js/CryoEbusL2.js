document.addEventListener('DOMContentLoaded', () => {
  console.log('▶ CryoEbusL2: inicializando carruseles y overlay');

  // Overlay
  const focusOverlay = document.getElementById('carouselFocus');
  const focusContent = focusOverlay ? focusOverlay.querySelector('.focus-content') : null;
  const closeFocusBtn = document.getElementById('closeFocus');

  if (!focusOverlay || !focusContent || !closeFocusBtn) {
    console.warn('⚠️ Elementos de overlay faltan en el DOM (carouselFocus / focus-content / closeFocus).');
  }

  // Inicializador reusable de un carrusel (original o clon)
  function initCarousel(container) {
    if (!container) return;
    const images = container.querySelectorAll('.carousel img');
    const prev = container.querySelector('.prev');
    const next = container.querySelector('.next');

    if (!images || images.length === 0) return;

    // Índice actual (busca .active)
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;

    // Asegura que solo una tenga active
    images.forEach((img, i) => img.classList.toggle('active', i === currentIndex));

    function showImage(newIndex) {
      images[currentIndex].classList.remove('active');
      currentIndex = (newIndex + images.length) % images.length;
      images[currentIndex].classList.add('active');
    }

    // Prev/next con stopPropagation para que no burbujeen
    if (next) {
      next.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
      });
    }
    if (prev) {
      prev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
      });
    }
  }

  // Inicializa todos los carruseles existentes
  const containers = document.querySelectorAll('.carousel-container');
  containers.forEach(container => {
    initCarousel(container);

    // Añadimos click a cada imagen para abrir overlay (modo enfoque)
    container.querySelectorAll('.carousel img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openFocus(container);
      });
    });
  });

  // Abre el overlay clonando el contenedor
  function openFocus(container) {
    if (!focusOverlay || !focusContent) {
      console.warn('Overlay no inicializado.');
      return;
    }
    console.log('✦ Abriendo enfoque para carrusel:', container);

    // Clonar (sin listeners) y añadir al overlay
    const clone = container.cloneNode(true);
    focusContent.innerHTML = '';
    focusContent.appendChild(clone);

    // Mostrar overlay y bloquear scroll de fondo
    focusOverlay.classList.add('active');
    focusOverlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Inicializa carrusel dentro del clon (añade listeners a sus botones)
    initCarousel(clone);
  }

  // Cerrar overlay
  function closeFocus() {
    if (!focusOverlay || !focusContent) return;
    focusOverlay.classList.remove('active');
    focusOverlay.setAttribute('aria-hidden', 'true');
    focusContent.innerHTML = '';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    console.log('✕ Overlay cerrado');
  }

  // Eventos de cierre
  closeFocusBtn && closeFocusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeFocus();
  });

  focusOverlay && focusOverlay.addEventListener('click', (e) => {
    if (e.target === focusOverlay) closeFocus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFocus();
  });
});
