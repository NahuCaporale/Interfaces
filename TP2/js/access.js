const toggle = document.querySelector(".toggle");
const loginForm = document.querySelector("form.login");
const registerForm = document.querySelector("form.register");

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  } else {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  }
});

//hacer animacion
document.addEventListener("DOMContentLoaded", () => {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setTimeout(() => {
      window.location.replace("index.html");
    }, 300); // ajustá el tiempo si hace falta
  });
});

//Queda hacer checkeo de inputs
document.addEventListener("DOMContentLoaded", () => {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setTimeout(() => {
      window.location.replace("index.html");
    }, 300); // ajustá el tiempo si hace falta
  });
});
