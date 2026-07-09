# 🎙️ Voice To-Do App — Cose da fare oggi pomeriggio

> Estratto dal **Progetto 2** su Notion. Obiettivo del pomeriggio: mettere in piedi il progetto
> e arrivare alla prima fetta funzionante (registro la voce → vedo il testo a schermo).
> Stack: TypeScript + React (Vite) + Node/Express + MongoDB.

## 🔧 Setup & Architettura
- [x] Inizializzare il progetto (Vite + React frontend, Node + Express backend)
- [x] Configurare TypeScript (frontend e backend)
- [x] Strutturare le cartelle del progetto (`/client`, `/server`)
- [x] Configurare la connessione a MongoDB (Atlas, db `voice_todo`)
- [x] Commit iniziale + repo su GitHub

## 🎙️ Prima fetta di trascrizione vocale
- [x] Integrare la Web Speech API (nativa del browser, gratuita)
- [x] Bottone registrazione (interruttore Parla/Stop) — _rifinitura "tieni premuto" opzionale, da valutare_
- [x] Conversione audio → testo in tempo reale a schermo
- [x] Gestione errori microfono / browser non supportato

## 📝 Task minime / Feature nuove (MongoDB + Google Calendar)
### Backend
- [x] A. Modello dati Mongoose (Task: testo, completata, data, timestamps)
- [x] B. API CRUD (POST / GET / PUT / DELETE) + cors — testate end-to-end ✅
### Frontend
- [x] C. Bozza modificabile dalla trascrizione → salvataggio "ufficiale" (POST)
- [x] D. Pannello laterale: lista + cancella + checkbox completa + **modifica testo con modale** (fatta a mano) ✅
### Integrazione
- [ ] E. Google Calendar reale (OAuth Google + Calendar API) — pezzo grosso, per ultimo

---
### 🔜 Rimandato ai prossimi giorni (dal piano completo)
- Parsing intelligente del testo (orari, date, priorità, tag automatici)
- Reminder con notifiche browser + modalità focus + sintesi vocale
- Reset automatico a mezzanotte + storico giorni precedenti
- Redis per la sessione, UX/animazioni, responsive
- Deploy su Vercel/Render + README + aggiunta al portfolio pfcv.it
