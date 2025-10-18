/*let count = 1;
const totalSlides = 3; 

setInterval(() => {
  for (let i = 1; i <= totalSlides; i++) {
    document.getElementById(`slide${i}`).classList.remove('active');
  }
  document.getElementById(`slide${count}`).classList.add('active');
  count++;
  if (count > totalSlides) count = 1;
}, 2000);*/
window.addEventListener("load", () => {
  const contenido = document.querySelector(".content-wrapper");
  const loader = document.querySelector(".loader-container");

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      contenido.classList.remove("hide-content");
      setTimeout(() => {
        contenido.style.opacity = 1;
      }, 5);
    }, 10);
  }, 5000);
});

document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.querySelector(".btn-prev");
  const nextBtn = document.querySelector(".btn-next");
  const slides = document.querySelector(".container-slides");

  const scrollAmount = 220; // Ancho de imagen (200px) + gap (20px)

  nextBtn.addEventListener("click", () => {
    slides.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    slides.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const carruseles = document.querySelectorAll('.carrusel-juegos');
  
  carruseles.forEach((carrusel) => {
    const prevBtn = carrusel.querySelector('.btn-prev');
    const nextBtn = carrusel.querySelector('.btn-next');
    const slides = carrusel.querySelector('.container-slides');
    
    const scrollAmount = 230; //ancho +gap de las imagenes en el carrusel, para reposicionar a una nueva imagen en el scroll
    
    nextBtn.addEventListener('click', () => {
      slides.scrollBy({ left: scrollAmount, behavior: 'smooth' });//scrollea una imagen debido al scrollamount
    });
    
    prevBtn.addEventListener('click', () => {
      slides.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  });
});










//Login