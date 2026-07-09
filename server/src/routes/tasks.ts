import { Router } from "express";
import Task from "../models/Task";

const router = Router()


router.get("/", async (req,res) => {

    // ordina i risultati per data di creazione, dal più recente
    const tasks = await Task.find(). sort({ createdAt: -1})
    res.json(tasks)
})

router.post("/", async (req,res) => {
    try {
        const newTask = await Task.create({
            testo: req.body.testo,
            data: req.body.data,
        })
        res.status(201).json(newTask)
    }   catch (err) {
        res.status(400).json({ errore: "Dati non validi" })
    }
})

router.put('/:id', async (req,res) => {
    try{
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if(!updateTask) {
            return res.status(404).json({ error: 'Task non trovata'})
        }
        res.status(200).json(updateTask)
    }   catch(err) {
        res.status(400).json({ error: 'Richiesta non valida'})
    }
})

router.delete('/:id', async (req,res) => {
    try{
        const deleteTask = await Task.findByIdAndDelete(req.params.id)
        if (!deleteTask) {
            return res.status(404).json({ error: 'Task non trovata'})
        }
        res.status(200).json({ message: 'Task eliminata' })
    }   catch (err) {
        res.status(400).json({ error: 'ID non valido' })
    }
})

export default router