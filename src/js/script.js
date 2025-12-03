// src/js/script.js

import { fetchHistory, fetchLocalData } from "./api.js";
import {
  renderHistory,
  renderAlbumsAndCompilations,
  renderSongs,
  renderLoading,
  renderError,
  clearContainer,
} from "./ui.js";

// --- ELEMENTOS DO DOM ---
const cardContainer = document.querySelector(".card-container");
const filterSelect = document.getElementById("filter-select");
const searchButton = document.getElementById("info-search-button");
const mainContent = document.getElementById("main-content");
const header = document.querySelector("header");

// --- ESTADO DA APLICAÇÃO ---
let allData = [];
let dataLoaded = false;

// --- FUNÇÕES PRINCIPAIS ---

/**
 * Rola suavemente até o conteúdo principal, considerando a altura do cabeçalho.
 */
function smoothScrollToContent() {
  if (mainContent && header) {
    const headerHeight = header.offsetHeight;
    const elementPosition = mainContent.offsetTop;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

/**
 * Lida com a busca de conteúdo com base no filtro selecionado.
 */
async function handleSearch() {
  const filterType = filterSelect.value;

  if (!filterType) {
    clearContainer(cardContainer);
    return;
  }

  renderLoading(cardContainer);
  smoothScrollToContent();

  try {
    if (filterType === "history") {
      const historyText = await fetchHistory();
      renderHistory(cardContainer, historyText);
    } else {
      if (!dataLoaded) {
        allData = await fetchLocalData();
        dataLoaded = true;
      }
      renderContent(filterType);
    }
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    renderError(
      cardContainer,
      "Desculpe, não foi possível carregar o conteúdo solicitado. Verifique o console para mais detalhes."
    );
  }

  filterSelect.value = ""; // Reseta o select
  searchButton.disabled = true;
}

/**
 * Renderiza o conteúdo (álbuns, compilações, músicas) com base no filtro.
 * @param {string} filterType 
 */
function renderContent(filterType) {
  const albums = allData.filter(
    (item) =>
      !item.album.includes("Box Set") &&
      !item.album.includes("Remasters") &&
      !item.album.includes("Boxed Set") &&
      !item.album.includes("Early Days and Latter Days") &&
      !item.album.includes("Mothership")
  );
  const compilations = allData.filter(
    (item) =>
      item.album.includes("Box Set") ||
      item.album.includes("Remasters") ||
      item.album.includes("Boxed Set") ||
      item.album.includes("Early Days and Latter Days") ||
      item.album.includes("Mothership")
  );

  switch (filterType) {
    case "albums":
      renderAlbumsAndCompilations(cardContainer, albums);
      break;
    case "compilations":
      renderAlbumsAndCompilations(cardContainer, compilations);
      break;
    case "songs":
      renderSongs(cardContainer, allData);
      break;
    default:
      clearContainer(cardContainer);
      break;
  }
}

// --- INICIALIZAÇÃO ---

/**
 * Adiciona os event listeners aos elementos do DOM.
 */
function initialize() {
  // Garante que o botão comece desabilitado
  searchButton.disabled = true;

  searchButton.addEventListener("click", handleSearch);

  filterSelect.addEventListener("change", () => {
    searchButton.disabled = !filterSelect.value;
  });

  // Carrega os dados locais em segundo plano para agilizar a primeira busca
  fetchLocalData().then((data) => {
    allData = data;
    dataLoaded = true;
  });
}

// Inicia a aplicação após o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", initialize);
