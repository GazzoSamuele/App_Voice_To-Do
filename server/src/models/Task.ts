import mongoose from "mongoose";

interface ITask {
    testo: string;
    completata: boolean;
    data?: Date;
    categoria?: string;
}

const taskSchema = new mongoose.Schema<ITask>({
    testo: { type: String, required: true },
    completata: { type: Boolean, default: false },
    data: { type: Date },
    categoria: { type: String },
    
// aggiunge in automatico createdAt e updatedAt
}, { timestamps: true})

// export type Task = mongoose.InferSchemaType<typeof taskSchema>

export default mongoose.model("Task", taskSchema)