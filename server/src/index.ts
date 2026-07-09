import "dotenv/config"

import tasksRouter from "./routes/tasks"

import cors from "cors"
import mongoose from "mongoose"
import express from "express"

const app = express()
//MIDDLEWARE

// aggiunge gli header che autorizzano il browser su localhost:5173 a chiamare il server su localhost:3000
app.use(cors())

// legge il corpo (body) JSON delle richieste in arrivo e lo mette in req.body. 
// Senza questo, quando il client invia una task, req.body è undefined
app.use(express.json())

app.use("/api/tasks", tasksRouter)

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI manca nel file .env')
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connesso a MongoDB ✅'))
  .catch((err) => console.error('Errore connessione MongoDB:', err))

app.get("/", (req,res) => {
    res.send( "benvenuti sulla mia applicazione")
})

app.listen(PORT, () => {
    console.log(`server pronto sulla porta http://localhost:${PORT}`)
})

