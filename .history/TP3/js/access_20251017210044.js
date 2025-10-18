document.addEventListener('DOMContentLoaded', () => {

    // ----- SELECTORES DE ELEMENTOS -----
    const toggle = document.getElementById("toggle");
    const loginForm = document.getElementById("loguear");
    const registerForm = document.querySelector("form.register");

    // Inputs de Registro
    const regFullname = document.getElementById("fullnameRegister");
    const regNickname = document.getElementById("nicknameRegister");
    const regEmail = document.getElementById("emailRegister");
    const regPass = document.getElementById("passwordRegister");
    const regRepPass = document.getElementById("repPass");

    // Iconos y Textos de Ayuda
    const userHelpIcon = document.getElementById('userHelpIcon');
    const userHelpText = document.getElementById('userHelpText');
    const passHelpIcon = document.getElementById('passHelpIcon');
    const passHelpText = document.getElementById('passHelpText');


    // ----- LÓGICA DEL TOGGLE (INICIAR/REGISTRO) -----
    if (toggle) {
        toggle.addEventListener("change", () => {
            loginForm.classList.toggle("active");
            registerForm.classList.toggle("active");
        });
    }


    // ----- LÓGICA DE ICONOS DE AYUDA (?) -----
    function setupHelpIcon(icon, text) {
        if (icon && text) {
            icon.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita que se cierre si se hace clic en el icono
                text.classList.toggle('visible');
            });
        }
    }

    setupHelpIcon(userHelpIcon, userHelpText);
    setupHelpIcon(passHelpIcon, passHelpText);

    // Cierra los tooltips si se hace clic en cualquier otro lugar
    document.addEventListener('click', () => {
        if (userHelpText.classList.contains('visible')) {
            userHelpText.classList.remove('visible');
        }
        if (passHelpText.classList.contains('visible')) {
            passHelpText.classList.remove('visible');
        }
    });


    // ----- LÓGICA DE VALIDACIÓN CON ICONOS DE ERROR (!) -----
    function addValidation(inputElement) {
        inputElement.addEventListener("focusout", () => {
            if (inputElement.value.trim() === "") {
                showErrorIcon(inputElement);
            } else {
                hideErrorIcon(inputElement);
            }
        });
    }

    addValidation(regFullname);
    addValidation(regNickname);
    addValidation(regEmail);
    addValidation(regPass);

    function showErrorIcon(inputElement) {
        inputElement.classList.add('input-error');
        const errorIcon = inputElement.parentElement.querySelector('.error-icon');
        if (errorIcon) {
            errorIcon.classList.add('visible');
        }
    }

    function hideErrorIcon(inputElement) {
        inputElement.classList.remove('input-error');
        const errorIcon = inputElement.parentElement.querySelector('.error-icon');
        if (errorIcon) {
            errorIcon.classList.remove('visible');
        }
    }

    // ----- MANEJO DE ENVÍO DE FORMULARIOS -----
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Aquí va tu lógica de login (peticiones a servidor, etc.)
        console.log("Intentando iniciar sesión...");
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Aquí va tu lógica de registro
        console.log("Intentando registrar...");
    });

});