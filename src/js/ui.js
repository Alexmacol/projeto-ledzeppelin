// src/js/ui.js

/**
 * Limpa o conteúdo do container.
 * @param {HTMLElement} container 
 */
export function clearContainer(container) {
  container.innerHTML = "";
}

/**
 * Exibe uma mensagem de carregamento no container.
 * @param {HTMLElement} container 
 */
export function renderLoading(container) {
  container.innerHTML = "<p>Carregando...</p>";
}

/**
 * Exibe uma mensagem de erro no container.
 * @param {HTMLElement} container 
 * @param {string} message 
 */
export function renderError(container, message) {
  container.innerHTML = `<p>${message}</p>`;
}

/**
 * Renderiza o card com a história da banda.
 * @param {HTMLElement} container 
 * @param {string} historyText 
 */
export function renderHistory(container, historyText) {
  clearContainer(container);
  const card = document.createElement("article");
  card.classList.add("card");
  card.innerHTML = `
    <h2>A História do Led Zeppelin</h2>
    <p>${historyText.replace(/\n/g, "<br>")}</p>
  `;
  container.appendChild(card);
}

/**
 * Renderiza os cards de álbuns ou compilações.
 * @param {HTMLElement} container 
 * @param {Array} data A lista de álbuns/compilações.
 */
export function renderAlbumsAndCompilations(container, data) {
  clearContainer(container);
  const fragment = document.createDocumentFragment(); 
  data.forEach((element) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-content-split">
        <div class="left-side">
          <h2>${element.album}</h2>
          <p><strong>Ano:</strong> ${element.year}</p>
          <p>${element.description}</p>
        </div>
        <div class="right-side">
          <p><strong>Músicas:</strong></p>
          <ul>
            ${element.tracks.map((track) => `<li>${track}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
    fragment.appendChild(card); 
  });
  container.appendChild(fragment); 
}

/**
 * Renderiza os cards de músicas, agrupadas por ano, garantindo que cada música apareça apenas uma vez.
 * @param {HTMLElement} container 
 * @param {Array} data A lista de todos os álbuns.
 */
export function renderSongs(container, data) {
  clearContainer(container);

  const normalizeTrackName = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

  // Ordena os álbuns por ano para processar os lançamentos originais primeiro
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  const processedSongs = new Set();
  const songsByYear = {};

  sortedData.forEach((album) => {
    album.tracks.forEach((track) => {
      const normalizedTrack = normalizeTrackName(track);
      // Se a música normalizada ainda não foi processada, é o seu lançamento original
      if (!processedSongs.has(normalizedTrack)) {
        if (!songsByYear[album.year]) {
          songsByYear[album.year] = new Set();
        }
        // Adiciona o nome original da música, mas rastreia a versão normalizada
        songsByYear[album.year].add(track);
        processedSongs.add(normalizedTrack); // Marca a música como processada
      }
    });
  });

  const sortedYears = Object.keys(songsByYear).sort((a, b) => a - b);
  const fragment = document.createDocumentFragment();

  sortedYears.forEach((year) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-content-split">
        <div class="left-side">
          <h2>Músicas de ${year}</h2>
        </div>
        <div class="right-side">
          <ul>
            ${Array.from(songsByYear[year])
              .sort()
              .map((track) => `<li>${track}</li>`)
              .join("")}
          </ul>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
}