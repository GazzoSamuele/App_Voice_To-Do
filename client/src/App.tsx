import { useState, useRef, useEffect } from 'react'

import './App.scss'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Task {
  _id: string
  testo: string
  completata: boolean
  data?: string
  createdAt: string
}

function App() {

  // contiene il testo trascritto da mostrare a schermo.
  const [testo, setTesto] = useState('')

  // l'oggetto registratore
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // ricorda se stai registrando
  const [inAscolto, setInAscolto] = useState(false)
  const [errore, setErrore] = useState('')

  const [tasks, setTasks] = useState<Task[]>([])
  
  //CRUD

  // create task
  const createTask = async () => {
  if (!testo.trim()) 
    return

  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ testo })
  })

  if (!res.ok) {
    alert('Errore nel salvataggio della task. Riprova')
    return
  }
  setTesto("")
  downloadTask()
}

// delete task
const deleteTask = async (id: string) => {
  const res = await
    fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE'
    })
    if(!res.ok) {
      alert('errore durante la procedura di eliminazione')
      return
    }
    setTasks(tasks.filter((task) => task._id !== id))
}

// update task
const updateTask = async (task: Task, newState: boolean) => {
  const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ completata: newState })
  })
  if (!res.ok) {
    alert('Errore nella modifica')
    return
  }
  const updateCompleated = await res.json()
  setTasks(tasks.map((t) => (t._id === task._id ? updateCompleated : t)))
}

// download task from sarver
const downloadTask = async () => {
  const res = await fetch(`${API_URL}/api/tasks`)
  const data = await res.json()
  setTasks(data)
}

useEffect(() => {
  downloadTask()
}, [])


function avviaAscolto() {
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

   if (!SpeechRecognition) {
      setErrore('Il tuo browser non supporta la trascrizione vocale. Usa Chrome o Edge.')
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = "it-IT"
  recognition.interimResults = true

  recognition.onresult = (e) =>{
    const trascrizione = Array.from(e.results)
        .map(risultato => risultato[0].transcript)
        .join('')
        setTesto(trascrizione)
  }
  recognition.onerror = (e) => {
      setErrore(`Errore microfono: ${e.error}`)
      setInAscolto(false)
  }

  recognition.onend = () => setInAscolto(false)

  recognition.start()
  setInAscolto(true)
  recognitionRef.current = recognition

}

function fermaAscolto() {
  recognitionRef.current?.stop()
}
  return (
  <>
  <div>
    <h1>🎙️ Voice To-Do</h1>
    <div>

      {/* quando clicchi, se sto ascoltando chiama fermaAscolto, altrimenti avviaAscolto; e mostra l'etichetta giusta di conseguenza */}
      <button onClick={inAscolto ? fermaAscolto : avviaAscolto}>{inAscolto ? 'Stoppa la registrazione' : 'Parla qua'}</button>

      {errore && <p className="errore">{errore}</p>}

      <textarea
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
      />

      <button onClick={createTask}>Salva ✅</button>

    </div>

    <aside className="pannello">
      <h2>Le tue task</h2>
      {tasks.map((task) => (
        <div key={task._id} className="task">
          {task.testo}
          <input
              type="checkbox"
              checked={task.completata}
              onChange={() => updateTask(task, !task.completata)}
            />
          <button onClick={() => deleteTask(task._id)}>Elimina Task 🗑️</button>
        </div>
      ))}
    </aside>
  </div>
  
    </>
  )
}

export default App
