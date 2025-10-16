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

      }, 100); 

  }, 5000); 
});
