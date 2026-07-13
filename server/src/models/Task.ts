import mongoose from "mongoose";

interface ITask {
    testo: string;
    completata: boolean;
    data?: Date;
    categoria?: string;
    daGestire: boolean;
    statOrdine: 'recenti' | 'vecchie';
}

const taskSchema = new mongoose.Schema<ITask>({
    testo: { type: String, required: true },
    completata: { type: Boolean, default: false },
    data: { type: Date },
    categoria: { type: String },
    daGestire: { type: Boolean, default: true },
    statOrdine: {
        type: String,
        enum: ['recenti', 'vecchie'],
        default: 'recenti',
        required: true
    },
    
// aggiunge in automatico createdAt e updatedAt
}, { timestamps: true})

// export type Task = mongoose.InferSchemaType<typeof taskSchema>

export default mongoose.model("Task", taskSchema)