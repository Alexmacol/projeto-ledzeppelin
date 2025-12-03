// src/js/api.js

/**
 * Busca a história da banda no servidor backend.
 * @returns {Promise<string>} O texto da história.
 */
export async function fetchHistory() {
  const response = await fetch("/api/historia/led_zeppelin");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.historia;
}

/**
 * Busca os dados dos álbuns do arquivo JSON local.
 * @returns {Promise<Array>} Uma matriz de objetos de álbuns.
 */
export async function fetchLocalData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    if (jsonData.led_zeppelin && jsonData.led_zeppelin.albuns) {
      return jsonData.led_zeppelin.albuns;
    }
    // Fallback para a estrutura antiga, se necessário
    return jsonData;
  } catch (error) {
    console.error("Erro ao carregar dados locais:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}
