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