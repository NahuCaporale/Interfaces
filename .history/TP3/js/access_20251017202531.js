const toggle = document.querySelector(".toggle");

//botones
let btnForm = document.querySelector(".form-btn");

//login
let labelUser = document.querySelector(".label-user");
let labelPass = document.querySelector(".label-pass");

const loginForm = document.querySelector("form.login");
const logNick = document.getElementById("nicknameLogin");
const logPass = document.getElementById("passwordLogin");
const message = document.querySelector(".message");
//registros
let labelFullname = document.querySelector(".label-registro-nombre");
let labelEmail = document.querySelector(".label-registro-email");
let labelNick = document.querySelector(".label-registro-usuario");
let labelContra = document.querySelector(".label-registro-pass");
let labelRepetirContra = document.querySelector(".label-registro-repPass");

const registerForm = document.querySelector("form.register");
const regPass = document.getElementById("passwordRegister");
const regEmail = document.getElementById("emailRegister");
const regFullname = document.getElementById("fullnameRegister");
const regNickname= document.getElementById("nicknameRegister");

const regRepPass = document.getElementById("repPass");

//label para accesbilidad de login





//cambio a registro y viceversa
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  } else {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  }
});

//simular login
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
      btnForm.classList.add("loading");
      btnForm.value = "⏳";

      setTimeout(() => {
        btnForm.classList.remove("loading");
        btnForm.classList.add("success");
        btnForm.value = "✓";
        setTimeout(() => {
          btnForm.classList.add("form-btn-check");
          window.location.replace("index.html");
        }, 1200);
      }, 1200);
    }
  });
});
//errores de login
function showError(text) {
  const error = document.createElement("p");

  error.textContent = text;
  if (!message.contains(error)) {
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
//registro
document.addEventListener("DOMContentLoaded", () => {
  let btnRegistro = registerForm.querySelector(".form-btn");
  const originalValue = btnRegistro.value;

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();

    // cargando
    btnRegistro.classList.add("loading");
    btnRegistro.value = "⏳";

    setTimeout(() => {
      // inicio correcto
      btnRegistro.classList.remove("loading");
      btnRegistro.classList.add("success");
      btnRegistro.value = "✓";

      setTimeout(() => {
        window.location.replace("index.html");
      }, 1200);
    }, 1200);
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
  error.textContent = text;
  div.style.display = "block";
}



document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos los elementos de ayuda para el campo USUARIO
    const userHelpIcon = document.getElementById('userHelpIcon');
    const userHelpText = document.getElementById('userHelpText');
    
    // Seleccionamos los elementos de ayuda para el campo CONTRASEÑA
    const passHelpIcon = document.getElementById('passHelpIcon');
    const passHelpText = document.getElementById('passHelpText');
    
    // Función para mostrar/ocultar el texto de ayuda del USUARIO
    if (userHelpIcon) {
        userHelpIcon.addEventListener('click', () => {
          userHelpText.classList.toggle('visible');
        });
    }
    
    // Función para mostrar/ocultar el texto de ayuda de la CONTRASEÑA
    if (passHelpIcon) {
        passHelpIcon.addEventListener('click', () => {
            passHelpText.classList.toggle('visible');
        });
    }

});

