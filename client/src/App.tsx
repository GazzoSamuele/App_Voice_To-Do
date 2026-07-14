import { useState, useRef, useEffect } from 'react'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import './App.scss'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Task {
  _id: string
  testo: string
  completata: boolean
  data?: string
  createdAt: string
  categoria?: string
  daGestire?: boolean
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
  const [categorySelected, setNewCategorySelected] = useState('')

  const [ordine, setOrdine] = useState<'recenti' | 'vecchie'>('recenti')

  const [giornoSelezionato, setGiornoSelezionato] = useState(new Date())

  const [modificaCategoria, setModificaCategoria] = useState('')

  const openEdit = (task: Task) => {
    setTaskInModifica(task)
    setTestoModifica(task.testo)
    setModificaCategoria(task.categoria || '')
  }
  const closeEdit = () => setTaskInModifica(null)

  const saveEdit = async () => {
      if (!taskInModifica || !testoModifica.trim()) return
        await updateTask(taskInModifica._id, { testo: testoModifica, categoria: modificaCategoria })
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

function readingTask() {

  if (!window.speechSynthesis) {
        setErrore('Il tuo browser non supporta la trascrizione vocale. Usa Chrome o Edge.')
      return
    }

  const frase = tasks.map((t) => t.testo).join('. ')

  const lettura = new SpeechSynthesisUtterance(frase)

  lettura.lang = "it-IT"

  window.speechSynthesis.speak(lettura)

}

// estrai la categoria da ogni task (alcune saranno vuote/undefined)
const tutteLeCategorie = tasks.map((t) => t.categoria)

// scarta quelle vuote
const senzaVuoti = tutteLeCategorie.filter((c) => c)

// togli i doppioni
const categorieEsistenti = [...new Set(senzaVuoti)]

const taskVisibili = tasks.filter((task) => {
const matchTesto = task.testo.toLowerCase().includes(ricerca.toLowerCase())
const matchCategoria = categorySelected === "" || task.categoria === categorySelected
  return matchTesto && matchCategoria
})
  return (
    <>
      {/* <header>
        <h1>🎙️ Voice To-Do</h1>
      </header> */}
    <section className='alg-main'>
      <div className='alg-panel-calendario'>
        <div className="pannello-cerca-categorie">
          <span className="eyebrow">Archivio</span>
            <h2>Le tue task</h2>
              <div className="riga">
                <label htmlFor="ricerca">Cerca</label>
                <input
                  id="ricerca"
                  type="search"
                  value={ricerca}
                  onChange={(e) => setRicerca(e.target.value)}
                />
              </div>
        
            <select
                value={categorySelected}
                onChange={(e) => setNewCategorySelected(e.target.value)}
            >
              <option value="">Tutte le categorie</option>
                {categorieEsistenti.map((cat) => (
                  <option 
                    key={cat}
                    value={cat}
                    >{cat}</option>
                ))}
            </select>

            <div className="conta-task">
              <strong>{taskVisibili.length}</strong> task visibili
            </div>
        </div>
          <div className='panel-task-salvate'>
            <div className="panel-header">
              <span className="eyebrow">Salvate</span>
              <span className="badge-count">{taskVisibili.length}</span>
            </div>
              <ul className="lista-task">
                {taskVisibili.map((task) => (
                    <li key={task._id} className="task">
                      <p className="testo">{task.testo}</p>

                      {task.categoria && <p className="categoria">{task.categoria}</p>}
                      <div className="task-azioni">
                        <label>
                          <input
                            type="checkbox"
                            checked={task.completata}
                            onChange={() => updateTask(task._id, { completata: !task.completata })}
                          />
                          Completata
                        </label>
                        <button onClick={() => updateTask(task._id, { daGestire: false})}>Segna gestita</button>
                        <button onClick={() => openEdit(task)}>✏️ Modifica</button>
                        <button onClick={() => deleteTask(task._id)}>Elimina 🗑️</button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
        </div>  
      

        <Calendar
          className= "calendario" 
          value={giornoSelezionato}
          onChange={(value) => setGiornoSelezionato(value as Date)}/>
        </section>
        
      <main>
        <section className='alg-cattura-tasks'>
          <div className="cattura">
            <span className="eyebrow">Cattura</span>
            <h2>Nuovo pensiero</h2>

            {tasks.filter((task) => task.daGestire).length > 0 && (
              <p>{tasks.filter((task) => task.daGestire).length} note da gestire</p>
            )}

            <div className="riga">
              <label htmlFor="testo-task">Testo</label>
              <textarea
                id="testo-task"
                value={testo}
                onChange={(e) => setTesto(e.target.value)}
              />
            </div>

            <div className="riga">
              <label htmlFor="categoria-task">Categoria (scegline una o creane una nuova)</label>
              <input
                id="categoria-task"
                value={newCategory}
                list="categorie"
                placeholder='Non è obbligatoria, può rimanere un pensiero libero'
                onChange={(e) => setNewCategory(e.target.value)}
              />
              
              <datalist id="categorie">
                {categorieEsistenti.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <aside>
            <div className="riga">
              <button
                className={inAscolto ? 'registrando' : ''}
                onClick={inAscolto ? fermaAscolto : avviaAscolto}
              >
                {inAscolto ? 'Stoppa registrazione' : 'Parla qua'}
              </button>
            </div>

            {errore && <p className="errore">{errore}</p>}

            <div className="riga">
              <button className='salva-task-ascoltata' onClick={createTask}>Salva</button>
            </div>
          </aside>
        </section>

          <div className='alg-tasks-salvate'>
            <h2>Pensieri e idee del giorno</h2>
            <ul>
              {/* <button onClick={() => setOrdine(ordine === 'recenti' ? 'vecchie' : 'recenti')}>Ordine Descrescente</button> */}
              {tasks.filter((task) => {
                  const taskDaySelected = new Date(task.createdAt).toDateString() === giornoSelezionato.toDateString()
                  return taskDaySelected
                })
                .sort((a, b) => {
                  const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  return ordine === 'recenti' ? diff : -diff
                })
                .map((task) => (
                  <li key={task._id}>{task.testo}</li>
                ))}
            </ul>

            <div className="chat-actions">
              <button onClick={() => setOrdine(ordine === 'recenti' ? 'vecchie' : 'recenti')}>
                {ordine === 'recenti' ? 'Più recenti' : 'Più vecchie'}
              </button>
              <button onClick={readingTask}>Ascolta</button>
            </div>

          </div>
        </main>

      {taskInModifica && (
        <div className="modale-overlay" onClick={closeEdit}>
          <div className="modale" onClick={(e) => e.stopPropagation()}>
            <h3>Modifica task</h3>
            <input
              value={testoModifica}
              onChange={(e) => setTestoModifica(e.target.value)}
            />
            <input
              value={modificaCategoria}
              list="categorie"
              onChange={(e) => setModificaCategoria(e.target.value)}
            />
            <div className="modale-azioni">
              <button onClick={saveEdit}>Salva</button>
              <button onClick={closeEdit}>Annulla</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
