import { useState, useRef, useEffect } from 'react'

import './App.scss'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Task {
  _id: string
  testo: string
  completata: boolean
  data?: string
  createdAt: string
  categoria?: string
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

  const [taskInModifica, setTaskInModifica] = useState<Task | null>(null)
  const [testoModifica, setTestoModifica] = useState('')

  const [ricerca, setRicerca] = useState('')

  const [newCategory, setNewCategory] = useState('')

  const openEdit = (task: Task) => {
    setTaskInModifica(task)
    setTestoModifica(task.testo)
  }
  const closeEdit = () => setTaskInModifica(null)

  const saveEdit = async () => {
      if (!taskInModifica || !testoModifica.trim()) return
        await updateTask(taskInModifica._id, { testo: testoModifica })
    closeEdit()
  }

  
  //CRUD

  // create task
  const createTask = async () => {
  if (!testo.trim()) 
    return

  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ testo, categoria: newCategory })
  })

  if (!res.ok) {
    alert('Errore nel salvataggio della task. Riprova')
    return
  }
  setTesto("")
  setNewCategory("")
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
const updateTask = async (id: string, campi: Partial<Task>) => {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify( campi )
  })
  if (!res.ok) {
    alert('Errore nella modifica')
    return
  }
  const updateCompleated = await res.json()
  setTasks(tasks.map((t) => (t._id === id ? updateCompleated : t)))
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

// estrai la categoria da ogni task (alcune saranno vuote/undefined)
const tutteLeCategorie = tasks.map((t) => t.categoria)

// scarta quelle vuote
const senzaVuoti = tutteLeCategorie.filter((c) => c)

// togli i doppioni
const categorieEsistenti = [...new Set(senzaVuoti)]

  return (
  <>
  <div>
    <h1>🎙️ Voice To-Do</h1>
    <label>Cerca la tua Task
        <input 
          // key={task._id}
          type='search'
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
        ></input>
      </label>
    <div>

      {/* quando clicchi, se sto ascoltando chiama fermaAscolto, altrimenti avviaAscolto; e mostra l'etichetta giusta di conseguenza */}
      <button onClick={inAscolto ? fermaAscolto : avviaAscolto}>{inAscolto ? 'Stoppa la registrazione' : 'Parla qua'}</button>

      {errore && <p className="errore">{errore}</p>}

    <label>Categoria (scegline una o creane una nuova)
      <input
        value={newCategory}
        list="categorie"
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <datalist id="categorie">
        {categorieEsistenti.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>
    </label>
      


      <textarea
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
      />

      <button onClick={createTask}>Salva ✅</button>

    </div>

    <aside className="pannello">
      <h2>Le tue task</h2>
      {tasks.filter((task) => task.testo.toLowerCase().includes(ricerca.toLowerCase()))
      .map((task) => (
        <div key={task._id} className="task">

          {task.categoria && <p>{task.categoria}</p>}

          {task.testo}
          <input
              type="checkbox"
              checked={task.completata}
              onChange={() => updateTask(task._id, { completata: !task.completata })}
            />
          <button onClick={() => deleteTask(task._id)}>Elimina Task 🗑️</button>
          <button onClick={() => openEdit(task)}>✏️ Modifica</button>

        </div>
      ))}
    </aside>
    {taskInModifica && (
      <div className="modale-overlay" onClick={closeEdit}>
        <div className="modale" onClick={(e) => e.stopPropagation()}>
          <h3>Modifica task</h3>
          <input
            value={testoModifica}
            onChange={(e) => setTestoModifica(e.target.value)}
          />
          <div className="modale-azioni">
            <button onClick={saveEdit}>Salva</button>
            <button onClick={closeEdit}>Annulla</button>
          </div>
        </div>
      </div>
    )}
  </div>
  
    </>
  )
}

export default App
