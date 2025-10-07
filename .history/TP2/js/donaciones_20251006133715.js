//icono pregunta, despliega 
const icon = document.querySelector(".text-monto i");
const helpText = document.getElementById("help-text");

icon.addEventListener("click", () => {
  // alterna mostrar/ocultar
  if (helpText.style.display === "block") {
    helpText.style.display = "none";
  } else {
    helpText.style.display = "block";
  }
});




//switch boton mensual-solo esta vez
const buttons = document.querySelectorAll(".frecuencia-buttons button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});