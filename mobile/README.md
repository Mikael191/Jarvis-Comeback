# JARVIS Mobile

Versão mobile do projeto JARVIS, construída com React Native (Expo).

## 🚀 Como rodar

1.  **Instale as dependências:**
    ```bash
    cd mobile
    npm install
    ```

2.  **Inicie o projeto:**
    ```bash
    npx expo start --clear
    ```
    > **Nota para Windows:** Se encontrar erro de `node:sea`, delete a pasta `.expo` dentro de `mobile/` e tente novamente.

3.  **Abra no seu celular:**
    *   Baixe o app **Expo Go** (Android/iOS).
    *   Escaneie o QR Code.

## 📱 Funcionalidades

*   **Chat:** Interface idêntica ao web.
*   **Voz:** TTS nativo via `expo-speech`.
*   **Música:** Abre deeplinks do YouTube/Spotify.
*   **Memória:** Sincronizada via API (se houver backend) ou Local (AsyncStorage).

## ⚠️ Configuração

*   A URL da API está definida em `src/lib/config.ts`.
*   Para produção, aponte para `https://seu-projeto.vercel.app/api/chat`.
