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
- [x] ~~E. Google Calendar / OAuth~~ → ABBANDONATO (pivot: vedi sotto)

## 🧭 PIVOT — raccoglitore di pensieri (focus: ritrovare, non pianificare)
- [x] Ricerca tra i pensieri (barra, case-insensitive, live)
- [x] Tag / categorie: modello + salvataggio (POST) + visualizzazione + datalist con suggerimenti
  - [ ] ⏰ **DA FARE DOMANI MATTINA (09/07→10/07):** filtro per categoria. Stato: `<select>` abbozzato ma commentato in App.tsx (righe ~178-186) + stato `categorySelected` commentato (riga 37). Da sistemare: 1 solo select controllato con opzioni da `categorieEsistenti` (copiare la logica del datalist ma con `<option value={cat}>{cat}</option>`), + aggiungere la condizione categoria al `.filter` della lista (riga ~212): "filtro vuoto OPPURE task.categoria === categorySelected", combinata con && alla ricerca.
- [ ] 📅 **IN CORSO:** Vista calendario/timeline con `react-calendar` come DIARIO (task per giorno via `createdAt`, non planner)
- [ ] Assegnare categoria anche a task esistenti (input categoria nella modale di modifica)

---
### 🔜 Rimandato ai prossimi giorni (dal piano completo)
- Parsing intelligente del testo (orari, date, priorità, tag automatici)
- Reminder con notifiche browser + modalità focus + sintesi vocale
- Reset automatico a mezzanotte + storico giorni precedenti
- Redis per la sessione, UX/animazioni, responsive
- Deploy su Vercel/Render + README + aggiunta al portfolio pfcv.it
