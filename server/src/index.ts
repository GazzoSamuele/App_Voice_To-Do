import "dotenv/config";

import tasksRouter from "./routes/tasks";
import { connectDB } from "./db";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (errore) {
    console.error("❌ Database non raggiungibile:", errore);
    res
      .status(503)
      .json({ errore: "Database non raggiungibile, riprova tra poco" });
  }
});

app.use("/api/tasks", tasksRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("benvenuti sulla mia applicazione");
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
  });
}

export default app;
