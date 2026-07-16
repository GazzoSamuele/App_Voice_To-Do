import "dotenv/config"

import tasksRouter from "./routes/tasks"

import cors from "cors"
import mongoose from "mongoose"
import express from "express"

const app = express()
//MIDDLEWARE

app.use(cors())

app.use(express.json())

app.use("/api/tasks", tasksRouter)

const PORT = process.env.PORT || 3000
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

