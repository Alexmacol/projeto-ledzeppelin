# Led Zeppelin - Runas e Sombras

Uma aplicação web dedicada a explorar a história, discografia e músicas da icônica banda de rock Led Zeppelin. A página busca a história da banda de forma dinâmica e apresenta os dados de álbuns e músicas de forma interativa.

## Sobre o Projeto

Este projeto é uma single-page application (SPA) que serve como um portal para fãs e curiosos sobre o Led Zeppelin. Ele combina um backend simples em Node.js com um frontend interativo. Uma característica central é a atualização automática da história da banda no momento da inicialização do servidor, que consome a API do Google Generative AI para obter um resumo atualizado, garantindo que o conteúdo seja sempre relevante.

O frontend permite ao usuário navegar por diferentes seções: a história da banda, os álbuns de estúdio, as compilações e as músicas. A interface é projetada para ser simples e direta, com um design responsivo que se adapta a diferentes tamanhos de tela.

## Funcionalidades Principais

- **História da Banda Atualizada:** A história do Led Zeppelin é gerada dinamicamente pela IA do Google (`gemini-pro-latest`) toda vez que o servidor é iniciado.
- **Exploração de Discografia:** Visualize listas de álbuns de estúdio, compilações e músicas.
- **Interface Interativa:** O usuário pode escolher qual tipo de informação deseja ver, e o conteúdo é carregado dinamicamente na página.
- **Design Responsivo:** A interface se ajusta para uma boa experiência de visualização em desktops, tablets e celulares.

## Tecnologias e Métodos Utilizados

- **Backend:**
  - **Node.js:** Ambiente de execução para o servidor.
  - **Express.js:** Framework para a criação do servidor e da API.
  - **@google/generative-ai:** SDK para interação com a API do Google Gemini.
  - **dotenv:** Para gerenciamento de variáveis de ambiente (como a chave da API).
  - **cors:** Para habilitar o Cross-Origin Resource Sharing entre o backend e o frontend.
  - **Nodemon:** Para reiniciar o servidor automaticamente durante o desenvolvimento.

- **Frontend:**
  - **HTML5, CSS3, JavaScript (ES6 Modules):** Estrutura, estilo e lógica da aplicação.
  - **Fetch API:** Para realizar requisições assíncronas ao backend e aos arquivos locais.
  - **Font Awesome:** Para ícones.

- **Estrutura de Dados:**
  - **JSON:** O arquivo `data.json` é utilizado como um banco de dados simples para armazenar a discografia e a história da banda.

## Arquitetura da API

A arquitetura do backend é minimalista e focada em uma única responsabilidade.

1.  **Inicialização do Servidor:**
    - Ao iniciar, o servidor executa a função `updateHistory()`.
    - Esta função envia um prompt para a API do Google Gemini solicitando um resumo da história do Led Zeppelin.
    - A resposta da API é salva no arquivo `data.json`, sobrescrevendo a história anterior.

2.  **Endpoint da API:**
    - `GET /api/historia/:artista`
    - Este endpoint lê o arquivo `data.json`.
    - Ele busca o artista pelo parâmetro `artista` (ex: `led_zeppelin`).
    - Retorna um objeto JSON contendo a história do artista: `{ "historia": "..." }`.

O frontend, por sua vez, consome este endpoint para a seção "História" e carrega o arquivo `data.json` diretamente para as seções de "Álbuns", "Compilações" e "Músicas".

## Como Executar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- npm (geralmente instalado com o Node.js)
- Uma chave de API do Google Generative AI. Você pode obter uma no [Google AI Studio](https://aistudio.google.com/app/apikey).

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/projeto-ledzeppelin.git
    cd projeto-ledzeppelin
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Adicione sua chave da API do Google neste arquivo:
      ```
      GOOGLE_API_KEY=SUA_CHAVE_DE_API_AQUI
      ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor será iniciado em `http://localhost:3000`.

5.  **Acesse a aplicação:**
    - Abra seu navegador e acesse o arquivo `index.html` diretamente no sistema de arquivos ou use uma extensão como o "Live Server" no VS Code para servi-lo.

Agora você pode interagir com a aplicação e explorar o conteúdo do Led Zeppelin.
