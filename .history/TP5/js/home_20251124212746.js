document.addEventListener("DOMContentLoaded", function () {
  const loaderContainer = document.querySelector(".loader-container");
  const content = document.querySelector(".hide-content");
  const loaderText = loaderContainer.querySelector("h2");
  const messages = [
    "Cargando recursos...",
    "Preparando juegos...",
    "Casi listo...",
  ];
  let messageIndex = 0;

  // Cambiar texto del loader
  const textInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    loaderText.textContent = messages[messageIndex];
  }, 1000);

  // Simular carga y mostrar contenido
  setTimeout(() => {
    clearInterval(textInterval);
    if (loaderContainer) {
      loaderContainer.style.display = "none";
    }
    if (content) {
      content.classList.remove("hide-content");
    }
  }, 3000); // Oculta el loader después de 3 segundos

  // Lógica para el carrusel principal (slider-juegos)
  const slides = document.querySelector(".carousel-slides");
  const indicators = document.querySelectorAll(".indicator");
  let currentIndex = 0;

  function updateCarousel() {
    if (slides) {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });
    }
  }

  if (indicators.length > 0) {
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });
    });
    // Iniciar el carrusel automáticamente
    setInterval(() => {
      currentIndex = (currentIndex + 1) % indicators.length;
      updateCarousel();
    }, 5000); // Cambia de slide cada 5 segundos
    updateCarousel(); // Estado inicial
  }

  // Lógica para los carruseles de categorías (carrusel-juegos)
  const carousels = document.querySelectorAll(".carrusel-juegos");

  carousels.forEach((carousel) => {
    const container = carousel.querySelector(".container-slides");
    const prevBtn = carousel.querySelector(".btn-prev");
    const nextBtn = carousel.querySelector(".btn-next");
    const items = carousel.querySelectorAll(".slide-item");
    const itemWidth = items.length > 0 ? items[0].offsetWidth + 16 : 0; // Ancho del item + gap
    let scrollPosition = 0;

    if (!container || !prevBtn || !nextBtn || itemWidth === 0) return;

    nextBtn.addEventListener("click", () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (scrollPosition < maxScroll) {
        scrollPosition += itemWidth * 2; // Mover 2 items
        if (scrollPosition > maxScroll) {
          scrollPosition = maxScroll;
        }
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    });

    prevBtn.addEventListener("click", () => {
      if (scrollPosition > 0) {
        scrollPosition -= itemWidth * 2; // Mover 2 items
        if (scrollPosition < 0) {
          scrollPosition = 0;
        }
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
