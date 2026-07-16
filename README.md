# 🎙️ Voice To-Do — Raccoglitore di pensieri vocali

> Cattura un'idea **prima di dimenticarla**: parla, e il pensiero è salvato. Poi lo ritrovi quando ti serve.

App full-stack che trasforma la voce in appunti. Non è un'agenda con scadenze: è un **raccoglitore di pensieri** — idee, promemoria, spunti che arrivano a caso — pensato per essere velocissimo in **cattura** e potente nel **ritrovamento** (ricerca, categorie, diario sul calendario).

---

## ✨ Funzionalità

### 🎤 Cattura
- **Trascrizione vocale** in tempo reale tramite **Web Speech API** (nativa del browser, gratuita)
- **Modale di cattura** con bottone-hero animato: un click e parli
- **Scorciatoia da tastiera** (`Spazio` / `Invio`) per aprire la modale e avviare la registrazione all'istante
- Testo **modificabile prima di salvare** (la voce sbaglia, tu correggi)
- Gestione errori microfono e browser non supportato

### 🗂️ Organizzazione
- **Categorie personalizzate**: le crei tu al volo, con suggerimenti automatici (`<datalist>`) delle categorie già usate
- **Inbox "da gestire"**: le note nuove nascono da sistemare, con contatore e pulsante "segna gestita"
- **Completamento** task con checkbox (testo barrato)
- **Modale di modifica**: testo, categoria, data programmata ed eliminazione con conferma

### 🔍 Ritrovamento
- **Ricerca live** sul testo (case-insensitive)
- **Filtro per categoria** combinabile con la ricerca
- **Ordinamento** per data di creazione (più recenti / più vecchie)

### 📅 Calendario
- **Diario**: clicca un giorno e vedi i pensieri catturati in quella data
- **Programmazione**: assegna una data a una task per pianificare un lavoro
- **Puntini** sui giorni che hanno task programmate

### 🔊 Sintesi vocale
- L'app **legge ad alta voce** i pensieri (`speechSynthesis`)
- **Pausa / Riprendi** della lettura

### 🎨 Interfaccia
- Layout a dashboard con pannelli tematici e **orologio analogico** live
- **Responsive** completo (da desktop a smartphone), con griglie che non si rompono a nessuna larghezza
- Animazioni: bottone di registrazione pulsante, card con hover, bolle chat

---

## 🛠️ Stack tecnologico

| Livello | Tecnologie |
|---|---|
| **Frontend** | React 19 · TypeScript · Vite · SCSS (Sass) · react-calendar · react-clock |
| **Backend** | Node.js · Express 5 · TypeScript · Mongoose 9 |
| **Database** | MongoDB (Atlas) |
| **API browser** | Web Speech API (`SpeechRecognition` + `speechSynthesis`) |

---

## 📁 Struttura del progetto

```
App_Voice_To-Do/
├── client/                 # Frontend React + TypeScript + Vite
│   └── src/
│       ├── App.tsx         # Componente principale (stati, CRUD, voce, calendario)
│       ├── App.scss        # Stili + responsive
│       └── index.scss      # Reset e variabili di base
└── server/                 # Backend Node + Express + TypeScript
    └── src/
        ├── index.ts        # Entry point: middleware, connessione DB, avvio
        ├── models/
        │   └── Task.ts     # Schema Mongoose
        └── routes/
            └── tasks.ts    # Rotte CRUD /api/tasks
```

---

## 🚀 Installazione e avvio

### Prerequisiti
- **Node.js 18+**
- Un database **MongoDB** (locale o [Atlas](https://www.mongodb.com/atlas))
- **Chrome** o **Edge** (necessari per la trascrizione vocale)

### 1. Clona il repository
```bash
git clone https://github.com/GazzoSamuele/App_Voice_To-Do.git
cd App_Voice_To-Do
```

### 2. Configura il backend
```bash
cd server
npm install
```

Crea un file **`server/.env`**:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<utente>:<password>@<cluster>.mongodb.net/voice_todo
```
> ⚠️ Il `.env` è escluso dal versionamento: non committare mai le credenziali.

### 3. Configura il frontend
```bash
cd ../client
npm install
```

Opzionale — se il backend non gira su `localhost:3000`, crea **`client/.env`**:
```env
VITE_API_URL=https://url-del-tuo-backend
```

### 4. Avvia (due terminali)
```bash
# Terminale 1 — backend
cd server && npm run dev      # → http://localhost:3000

# Terminale 2 — frontend
cd client && npm run dev      # → http://localhost:5173
```

---

## 📜 Script disponibili

**Server**
| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia in sviluppo con ricarica automatica (tsx watch) |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm start` | Esegue la build compilata |

**Client**
| Comando | Descrizione |
|---|---|
| `npm run dev` | Server di sviluppo Vite |
| `npm run build` | Type-check + build di produzione |
| `npm run preview` | Anteprima della build |
| `npm run lint` | ESLint |

---

## 🔌 API

Base URL: `/api/tasks`

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/tasks` | Elenco delle task (ordinate dalla più recente) |
| `POST` | `/api/tasks` | Crea una task — body: `{ testo, categoria?, data? }` |
| `PUT` | `/api/tasks/:id` | Aggiorna i campi passati nel body |
| `DELETE` | `/api/tasks/:id` | Elimina la task |

### Modello dati (`Task`)
| Campo | Tipo | Note |
|---|---|---|
| `testo` | `String` | **obbligatorio** — il pensiero |
| `completata` | `Boolean` | default `false` |
| `categoria` | `String` | opzionale, libera |
| `data` | `Date` | opzionale — data programmata sul calendario |
| `daGestire` | `Boolean` | default `true` — inbox |
| `createdAt` / `updatedAt` | `Date` | automatici (timestamps) |

---

## ⚠️ Note sui browser

La trascrizione vocale usa la **Web Speech API**, che:
- funziona su **Chrome** ed **Edge** (su Firefox non è supportata);
- richiede una **connessione internet** (l'audio viene elaborato da servizi esterni del browser);
- funziona solo in **contesto sicuro** (`https://` o `localhost`);
- richiede il **permesso del microfono**.

L'app rileva il mancato supporto e mostra un messaggio esplicativo.

---

## 🗺️ Sviluppi futuri

- [ ] Deploy (frontend su Vercel, backend su Render, DB su Atlas)
- [ ] Riconoscimento automatico dei tag/categoria dal testo
- [ ] Notifiche locali per i pensieri programmati
- [ ] PWA installabile, poi versione mobile (React Native) / desktop (Electron)

---

## 👤 Autore

**Samuele Gazzo** — [GitHub](https://github.com/GazzoSamuele)

Progetto realizzato come esercizio full-stack: dalla progettazione del modello dati alle API REST, fino all'interfaccia e al responsive.
