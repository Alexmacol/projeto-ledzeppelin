require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- LÓGICA DE ATUALIZAÇÃO DA HISTÓRIA NA INICIALIZAÇÃO ---
// --- Garante que a história da banda seja sempre atualizada ---

async function updateHistory() {
  console.log('Tentando atualizar a história da banda...');
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('A variável de ambiente GOOGLE_API_KEY não está definida.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

    const prompt = 'Aja como um especialista da história do rock n roll. Forneça um resumo bem escrito, sucinto e envolvente sobre a história da banda Led Zeppelin em no máximo 3 parágrafos, inclua datas importantes e destaque os álbuns mais aclamados junto a público e crítica. O texto deve conter apenas a informação solicitada, não inclua na resposta nada do tipo "Claro, aqui está um resumo da história do Led Zeppelin em 3 parágrafos:".Evite caracteres especiais, não use asteriscos apenas devem estar presentes acentos ortográficos pertinentes ao português do Brasil, não invente nada.';

    const result = await model.generateContent(prompt);
    const newHistory = await result.response.text();

    const filePath = path.join(__dirname, 'data.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    // Garante que a estrutura exista antes de tentar atribuir
    if (!jsonData.led_zeppelin) {
      jsonData.led_zeppelin = {};
    }

    jsonData.led_zeppelin.historia = newHistory.trim();

    const updatedFileContent = JSON.stringify(jsonData, null, 2);
    await fs.writeFile(filePath, updatedFileContent, 'utf8');

    console.log('História da banda atualizada com sucesso no data.json.');
  } catch (error) {
    console.warn('AVISO: Não foi possível atualizar a história da banda a partir da API do Google.');
    console.warn(`Motivo: ${error.message}`);
    console.warn('O servidor iniciará com os dados de história existentes no data.json.');
  }
}

// --- ROTAS DA API ---

app.get('/api/historia/:artista', async (req, res) => {
  const { artista } = req.params;

  try {
    const filePath = path.join(__dirname, 'data.json');
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const artistKey = artista.toLowerCase().replace(/ /g, '_');

    if (jsonData[artistKey] && jsonData[artistKey].historia) {
      res.json({ historia: jsonData[artistKey].historia });
    } else {
      res.status(404).json({ error: 'Artista ou história não encontrados' });
    }
  } catch (error) {
    console.error('Erro ao processar a requisição de história:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---

async function startServer() {
  await updateHistory();
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

startServer();

module.exports = app;
