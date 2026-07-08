# 🎙️ Voice To-Do App — Cose da fare oggi pomeriggio

> Estratto dal **Progetto 2** su Notion. Obiettivo del pomeriggio: mettere in piedi il progetto
> e arrivare alla prima fetta funzionante (registro la voce → vedo il testo a schermo).
> Stack: TypeScript + React (Vite) + Node/Express + MongoDB.

## 🔧 Setup & Architettura
- [x] Inizializzare il progetto (Vite + React frontend, Node + Express backend)
- [x] Configurare TypeScript (frontend e backend)
- [x] Strutturare le cartelle del progetto (`/client`, `/server`)
- [x] Configurare la connessione a MongoDB (Atlas, db `voice_todo`)
- [ ] Commit iniziale + repo su GitHub

## 🎙️ Prima fetta di trascrizione vocale
- [ ] Integrare la Web Speech API (nativa del browser, gratuita)
- [ ] Bottone registrazione: tieni premuto → parla → rilascia
- [ ] Conversione audio → testo in tempo reale a schermo
- [ ] Gestione errori microfono / browser non supportato

## 📝 Task minime (per chiudere il giro)
- [ ] Creare una task dal testo trascritto (modificabile prima di salvare)
- [ ] Lista task del giorno con checkbox di completamento
- [ ] Salvare le task su MongoDB

---
### 🔜 Rimandato ai prossimi giorni (dal piano completo)
- Parsing intelligente del testo (orari, date, priorità, tag automatici)
- Reminder con notifiche browser + modalità focus + sintesi vocale
- Reset automatico a mezzanotte + storico giorni precedenti
- Redis per la sessione, UX/animazioni, responsive
- Deploy su Vercel/Render + README + aggiunta al portfolio pfcv.it
