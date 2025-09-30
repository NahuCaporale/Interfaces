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