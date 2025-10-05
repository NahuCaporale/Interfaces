let count = 1;
const totalSlides = 3; 

setInterval(() => {
  for (let i = 1; i <= totalSlides; i++) {
    document.getElementById(`slide${i}`).classList.remove('active');
  }
  document.getElementById(`slide${count}`).classList.add('active');
  count++;
  if (count > totalSlides) count = 1;
}, 2000);