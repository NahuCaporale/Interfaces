const toggle = document.querySelector(".toggle");

//login
const loginForm = document.querySelector("form.login");
const logNick = document.getElementById("nicknameLogin");
const logPass = document.getElementById("passwordLogin");
const message = document.querySelector(".message");
//registros
const registerForm = document.querySelector("form.register");
const regPass = document.getElementById("passwordRegister");
const regEmail = document.getElementById("emailRegister");
const regFullname = document.getElementById("fullnameRegister");

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
    clearError();
    if (logNick.value === "" && logPass.value === "") {
      showError("Por favor, complete los campos.");
    } else if (logNick != "" && logNick.value != "Nico") {
      showError("Usuario incorrecto");
    } else if (logPass.value != "1234") {
      showError("Contraseña incorrecta");
    } else {
      setTimeout(() => {
        window.location.replace("index.html");
      }, 300); // ajustá el tiempo si hace falta
    }
  });
});


function showError(text) {
  const error = document.createElement("p");

  error.textContent = text; // reemplaza el texto (no acumula)
  if (!message.contains(error)) {
    // solo lo añade si no está presente
    message.appendChild(error);
  }
  message.style.display = "block";
}
function clearError() {
  if (message.contains(message.firstChild)) {
    message.removeChild(message.firstChild);
    message.style.display = "none";
  }
}



//Queda hacer checkeo de inputs
document.addEventListener("DOMContentLoaded", () => {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();
    setTimeout(() => {
      window.location.replace("index.html");
    }, 300); // ajustá el tiempo si hace falta
  });
});





//errores registro
regFullname.addEventListener("focusout", () => {
  const mensaje = document.querySelector(".messageFullname");
  if (regFullname.value === "") {
    showErrorRegister(mensaje, "Por favor, complete el campo.");
  } else {
    mensaje.style.display = "none";
  }
});

regEmail.addEventListener("focusout", () => {
  const mensaje = document.querySelector(".emailMessage");
  if (regEmail.value === "") {
    showErrorRegister(mensaje, "Por favor, complete el campo.");
  } else {
    mensaje.style.display = "none";
  }
});

regPass.addEventListener("focusout", () => {
  const mensaje = document.querySelector(".passMessage");
  if (regPass.value === "") {
    showErrorRegister(mensaje, "Por favor, complete el campo.");
  } else {
    mensaje.style.display = "none";
  }
});
function showErrorRegister(div, text) {
  let error = div.querySelector("p");
  if (!error) {
    error = document.createElement("p");
    error.style.color = "red";
    error.style.fontSize = "12px";
    error.style.margin = "0 0 0 0";
    error.style.fontFamily = "NATS, sans-serif";
    div.appendChild(error);
  }
  error.textContent = text; // reemplaza el texto (no acumula)
  div.style.display = "block";
}
