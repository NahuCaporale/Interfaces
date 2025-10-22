// Estado del juego
const estadoJuego = {
  nivelActual: 1,
  imagenActual: null,
  intervaloTemporizador: null,
  tiempoInicio: 0,
  tiempoTranscurrido: 0,
  estaJugando: false,
  piezas: [
    { rotacion: 0, rotacionCorrecta: 0 },
    { rotacion: 0, rotacionCorrecta: 0 },
    { rotacion: 0, rotacionCorrecta: 0 },
    { rotacion: 0, rotacionCorrecta: 0 },
  ],
  mejoresTiempos: {
    1: null,
    2: null,
    3: null,
  },
}

// Banco de imágenes
const bancoImagenes = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
]

// Filtros por nivel
const filtrosNivel = {
  1: "escalaGrises",
  2: "brillo",
  3: "negativo",
}

// Configuración del canvas
const canvas = document.getElementById("canvas-juego")
const ctx = canvas ? canvas.getContext("2d") : null
const TAMANIO_CANVAS = 500
const TAMANIO_PIEZA = TAMANIO_CANVAS / 2

if (canvas) {
  canvas.width = TAMANIO_CANVAS
  canvas.height = TAMANIO_CANVAS
}

// Configuración del canvas de victoria
const canvasVictoria = document.getElementById("canvas-victoria")
const ctxVictoria = canvasVictoria ? canvasVictoria.getContext("2d") : null
const TAMANIO_VICTORIA = 400

if (canvasVictoria) {
  canvasVictoria.width = TAMANIO_VICTORIA
  canvasVictoria.height = TAMANIO_VICTORIA
}

// Cargar mejores tiempos desde localStorage
function cargarMejoresTiempos() {
  const guardado = localStorage.getItem("blocka-records")
  if (guardado) {
    estadoJuego.mejoresTiempos = JSON.parse(guardado)
    actualizarMostrarRecords()
  }
}

// Guardar mejores tiempos en localStorage
function guardarMejoresTiempos() {
  localStorage.setItem("blocka-records", JSON.stringify(estadoJuego.mejoresTiempos))
}

// Actualizar visualización de records
function actualizarMostrarRecords() {
  for (let nivel = 1; nivel <= 3; nivel++) {
    const elementoRecord = document.getElementById(`record-${nivel}`)
    if (elementoRecord) {
      const record = estadoJuego.mejoresTiempos[nivel]
      elementoRecord.textContent = record ? `Mejor tiempo: ${formatearTiempo(record)}` : "Mejor tiempo: --"
    }
  }
}

// Navegación entre pantallas
function mostrarPantalla(idPantalla) {
  document.querySelectorAll(".screen").forEach((pantalla) => {
    pantalla.classList.remove("active")
  })
  document.getElementById(idPantalla).classList.add("active")
}

function mostrarMenuPrincipal() {
  mostrarPantalla("menu-principal")
  detenerTemporizador()
}

function mostrarInstrucciones() {
  mostrarPantalla("instrucciones")
}

function mostrarSeleccionNivel() {
  mostrarPantalla("seleccion-nivel")
  detenerTemporizador()
  actualizarMostrarRecords()
}

function mostrarPantallaJuego() {
  mostrarPantalla("pantalla-juego")
}

function mostrarPantallaVictoria() {
  mostrarPantalla("pantalla-victoria")
}

// Manejo de niveles
function iniciarNivel(nivel) {
  estadoJuego.nivelActual = nivel
  estadoJuego.estaJugando = false
  estadoJuego.tiempoTranscurrido = 0

  mostrarGaleriaAnimada(nivel)
}

function mostrarGaleriaAnimada(nivel) {
  mostrarPantalla("preview-imagenes")

  document.getElementById("nivel-preview").textContent = nivel

  // Elegir imagen aleatoria
  const indiceAleatorio = Math.floor(Math.random() * bancoImagenes.length)
  const urlImagenSeleccionada = bancoImagenes[indiceAleatorio]

  // Limpiar galería
  const galeria = document.getElementById("galeria-imagenes")
  galeria.innerHTML = ""

  // Crear imágenes de la galería
  bancoImagenes.forEach((url, indice) => {
    const img = document.createElement("img")
    img.src = url
    img.className = "galeria-imagen"
    img.alt = `Imagen ${indice + 1}`
    img.dataset.indice = indice
    galeria.appendChild(img)
  })

  // Animación de hover secuencial
  const imagenes = galeria.querySelectorAll(".galeria-imagen")
  let indiceActual = 0
  let ciclos = 0
  const totalCiclos = 2 // Cantidad de veces que recorre todas las imágenes

  const intervaloHover = setInterval(() => {
    // Quitar hover de todas las imágenes
    imagenes.forEach((img) => img.classList.remove("hover"))

    // Agregar hover a la imagen actual
    imagenes[indiceActual].classList.add("hover")

    indiceActual++

    // Si llegamos al final, reiniciar
    if (indiceActual >= imagenes.length) {
      indiceActual = 0
      ciclos++

      // Después de completar los ciclos, seleccionar la imagen
      if (ciclos >= totalCiclos) {
        clearInterval(intervaloHover)

        // Pequeña pausa antes de seleccionar
        setTimeout(() => {
          // Quitar hover de todas
          imagenes.forEach((img) => img.classList.remove("hover"))

          // Marcar la seleccionada
          imagenes[indiceAleatorio].classList.add("seleccionada")

          // Esperar un momento y cargar el juego
          setTimeout(() => {
            cargarJuegoConImagen(urlImagenSeleccionada, nivel)
          }, 1000)
        }, 300)
      }
    }
  }, 200) // Velocidad del hover
}

function cargarJuegoConImagen(urlImagen, nivel) {
  document.getElementById("nivel-actual").textContent = nivel
  document.getElementById("cronometro").textContent = "00:00"
  document.getElementById("boton-empezar").style.display = "block"

  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    estadoJuego.imagenActual = img
    inicializarPiezas()
    dibujarJuego()

    mostrarPantallaJuego()
  }
  img.src = urlImagen
}

function siguienteNivel() {
  const proximoNivel = estadoJuego.nivelActual + 1
  if (proximoNivel <= 3) {
    iniciarNivel(proximoNivel)
  } else {
    mostrarSeleccionNivel()
  }
}

// Inicializar piezas con rotaciones aleatorias
function inicializarPiezas() {
  for (let i = 0; i < 4; i++) {
    const rotacionCorrecta = 0
    let rotacionAleatoria
    do {
      rotacionAleatoria = Math.floor(Math.random() * 4) * 90
    } while (rotacionAleatoria === rotacionCorrecta)

    estadoJuego.piezas[i] = {
      rotacion: rotacionAleatoria,
      rotacionCorrecta: rotacionCorrecta,
    }
  }
}

// Controles del juego
function empezarJuego() {
  if (!estadoJuego.estaJugando) {
    estadoJuego.estaJugando = true
    estadoJuego.tiempoInicio = Date.now() - estadoJuego.tiempoTranscurrido
    iniciarTemporizador()
    document.getElementById("boton-empezar").style.display = "none"
  }
}

// Funciones del temporizador
function iniciarTemporizador() {
  detenerTemporizador()
  estadoJuego.intervaloTemporizador = setInterval(() => {
    estadoJuego.tiempoTranscurrido = Date.now() - estadoJuego.tiempoInicio
    document.getElementById("cronometro").textContent = formatearTiempo(estadoJuego.tiempoTranscurrido)
  }, 100)
}

function detenerTemporizador() {
  if (estadoJuego.intervaloTemporizador) {
    clearInterval(estadoJuego.intervaloTemporizador)
    estadoJuego.intervaloTemporizador = null
  }
}

function formatearTiempo(ms) {
  const segundosTotales = Math.floor(ms / 1000)
  const minutos = Math.floor(segundosTotales / 60)
  const segundos = segundosTotales % 60
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
}

// Funciones de dibujo
function dibujarJuego() {
  if (!ctx || !estadoJuego.imagenActual) return

  ctx.clearRect(0, 0, TAMANIO_CANVAS, TAMANIO_CANVAS)

  const filtro = filtrosNivel[estadoJuego.nivelActual]

  for (let i = 0; i < 4; i++) {
    const fila = Math.floor(i / 2)
    const columna = i % 2
    const x = columna * TAMANIO_PIEZA
    const y = fila * TAMANIO_PIEZA

    dibujarPieza(i, x, y, filtro)
  }
}

function dibujarPieza(indice, x, y, filtro) {
  const pieza = estadoJuego.piezas[indice]
  const fila = Math.floor(indice / 2)
  const columna = indice % 2

  ctx.save()

  // Mover al centro de la pieza
  ctx.translate(x + TAMANIO_PIEZA / 2, y + TAMANIO_PIEZA / 2)

  // Rotar
  ctx.rotate((pieza.rotacion * Math.PI) / 180)

  // Dibujar la pieza
  ctx.drawImage(
    estadoJuego.imagenActual,
    columna * (estadoJuego.imagenActual.width / 2),
    fila * (estadoJuego.imagenActual.height / 2),
    estadoJuego.imagenActual.width / 2,
    estadoJuego.imagenActual.height / 2,
    -TAMANIO_PIEZA / 2,
    -TAMANIO_PIEZA / 2,
    TAMANIO_PIEZA,
    TAMANIO_PIEZA,
  )

  ctx.restore()

  // Aplicar filtro
  if (filtro) {
    aplicarFiltro(x, y, TAMANIO_PIEZA, TAMANIO_PIEZA, filtro)
  }

  // Dibujar borde
  ctx.strokeStyle = "#667eea"
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, TAMANIO_PIEZA, TAMANIO_PIEZA)
}

function aplicarFiltro(x, y, ancho, alto, tipoFiltro) {
  const datosImagen = ctx.getImageData(x, y, ancho, alto)
  const datos = datosImagen.data

  // Recorrer pixel por pixel con doble for
  for (let fila = 0; fila < alto; fila++) {
    for (let columna = 0; columna < ancho; columna++) {
      // Calcular el índice en el array de datos (cada pixel tiene 4 valores: R, G, B, A)
      const indice = (fila * ancho + columna) * 4

      const r = datos[indice]
      const g = datos[indice + 1]
      const b = datos[indice + 2]
      // datos[indice + 3] es el alpha, no lo modificamos

      switch (tipoFiltro) {
        case "escalaGrises":
          // Convertir a escala de grises usando el método de luminosidad
          const gris = 0.299 * r + 0.587 * g + 0.114 * b
          datos[indice] = gris
          datos[indice + 1] = gris
          datos[indice + 2] = gris
          break

        case "brillo":
          // Reducir brillo al 30%
          const factor = 0.3
          datos[indice] = r * factor
          datos[indice + 1] = g * factor
          datos[indice + 2] = b * factor
          break

        case "negativo":
          // Invertir colores
          datos[indice] = 255 - r
          datos[indice + 1] = 255 - g
          datos[indice + 2] = 255 - b
          break
      }
    }
  }

  ctx.putImageData(datosImagen, x, y)
}

// Manejadores de clicks en el canvas
if (canvas) {
  canvas.addEventListener("click", (e) => {
    if (!estadoJuego.estaJugando) return
    manejarClickPieza(e, false)
  })

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if (!estadoJuego.estaJugando) return
    manejarClickPieza(e, true)
  })
}

function manejarClickPieza(e, esClickDerecho) {
  const rect = canvas.getBoundingClientRect()
  const escalaX = canvas.width / rect.width
  const escalaY = canvas.height / rect.height
  const x = (e.clientX - rect.left) * escalaX
  const y = (e.clientY - rect.top) * escalaY

  const columna = Math.floor(x / TAMANIO_PIEZA)
  const fila = Math.floor(y / TAMANIO_PIEZA)
  const indicePieza = fila * 2 + columna

  if (indicePieza >= 0 && indicePieza < 4) {
    rotarPieza(indicePieza, esClickDerecho)
  }
}

function rotarPieza(indice, sentidoHorario) {
  const pieza = estadoJuego.piezas[indice]

  if (sentidoHorario) {
    pieza.rotacion = (pieza.rotacion + 90) % 360
  } else {
    pieza.rotacion = (pieza.rotacion - 90 + 360) % 360
  }

  dibujarJuego()
  verificarVictoria()
}
function verificarVictoria() {
  const todasCorrectas = estadoJuego.piezas.every((pieza) => pieza.rotacion === pieza.rotacionCorrecta)

  if (todasCorrectas) {
    detenerTemporizador()

    // Actualizar record
    const tiempoActual = estadoJuego.tiempoTranscurrido
    const nivel = estadoJuego.nivelActual
    if (!estadoJuego.mejoresTiempos[nivel] || tiempoActual < estadoJuego.mejoresTiempos[nivel]) {
      estadoJuego.mejoresTiempos[nivel] = tiempoActual
      guardarMejoresTiempos()
    }

    // Mostrar pantalla de victoria
    document.getElementById("tiempo-final").textContent = formatearTiempo(tiempoActual)

    const mensajeNivel = document.getElementById("nivel-completado")
    if (nivel < 3) {
      mensajeNivel.textContent = ${nivel}
    } else {
      mensajeNivel.textContent = "¡Completaste todos los niveles!"
    }

    // Mostrar/ocultar botón de siguiente nivel
    const botonSiguiente = document.getElementById("boton-siguiente-nivel")
    if (nivel < 3) {
      botonSiguiente.style.display = "block"
    } else {
      botonSiguiente.style.display = "none"
    }

    // Dibujar imagen completa en el canvas de victoria
    dibujarImagenVictoria()

    mostrarPantallaVictoria()
  }
}

function dibujarImagenVictoria() {
  if (!ctxVictoria || !estadoJuego.imagenActual) return

  ctxVictoria.clearRect(0, 0, TAMANIO_VICTORIA, TAMANIO_VICTORIA)
  ctxVictoria.drawImage(estadoJuego.imagenActual, 0, 0, TAMANIO_VICTORIA, TAMANIO_VICTORIA)
}

// Inicializar al cargar
cargarMejoresTiempos()
mostrarMenuPrincipal()
