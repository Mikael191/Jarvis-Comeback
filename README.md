# JARVIS - Assistente Cognitivo e Emocional

Uma Inteligência Artificial focada em desenvolvimento pessoal, organização mental e estratégia de vida. Construída para ser uma companheira inteligente, não apenas um chatbot.

![JARVIS Interface](https://via.placeholder.com/800x400?text=JARVIS+Interface+Preview)

## 🧠 Conceito
JARVIS não é um servo ("Ligue a luz"), é um **Conselheiro**.
- **Identidade:** Estoico, calmo, reflexivo.
- **Objetivo:** Ajudar o humano a pensar melhor, sentir com clareza e agir com estratégia.
- **Privacidade:** Histórico salvo apenas no seu navegador. A chave da API é sua e não fica salva no servidor.

## 🚀 Tecnologias
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion.
- **Backend:** Next.js API Routes (Serverless).
- **IA:** Groq Cloud API (Llama 3 8B - Ultra Rápido).
- **Voz:** Web Speech API (Nativa do navegador - STT e TTS).
- **Música:** YouTube Embed API (Modo Search).

## 🛠️ Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/jarvis.git
   cd jarvis
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse:** Abra `http://localhost:3000` no navegador.

## 🔑 Configuração (API Key)
Para o JARVIS pensar rápido e de graça, usamos a **Groq Cloud**.

1. Crie uma conta em [console.groq.com](https://console.groq.com/).
2. Vá em **API Keys**.
3. Crie uma nova chave (Create API Key).
4. Ao abrir o projeto, clique no ícone de ⚙️ (Configurações) e cole sua chave `gsk_...`.

## 🎵 Comandos de Música
O JARVIS entende pedidos de música e toca vídeos do YouTube automaticamente.
- "Jarvis, toca lofi hip hop"
- "Coloca uma música triste"
- "Quero ouvir rock clássico"

## 📱 Requisitos
- Navegador moderno (Chrome, Edge, Safari) para suporte a reconhecimento de voz.
- Microfone funcional.

## 🤝 Contribuição
Sinta-se à vontade para abrir Issues ou Pull Requests para melhorar a "consciência" do JARVIS.
