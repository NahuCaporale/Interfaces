const url = "https://vj.interfaces.jima.com.ar/api/v2";
let home = document.getElementById("games");

async function get() {
  try {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error al obtener datos"- ${res.statusText}`);
    }
    const json = await res.json();
    //limitados para no romper el home
    const limit = json.slice(0, 2);
    return limit;
  } catch (error) {
    console.log(error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  async function imprimir() {
    try {
      let juegos = await get();

      const html = juegos
        .map(
          (game) => `

    <!-- Ejemplo estático (opcional) -->
    
    <div class="grid">
      <article class="card">
        <img class="card__img" src="${game.background_image_low_res}" alt="${game.name}">
        <div class="card__body">
          <h2 class="card__title">${game.name}/h2>
          <p class="card__subtitle">Subtítulo opcional</p>
        </div>
      </article>
    </div>
  </div>
      `
        )
        .join("");
      home.innerHTML = html;
    } catch (error) {
      console.log(error);
    }
  }
  imprimir();
});

