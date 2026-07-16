import { useState, useRef, useEffect } from 'react'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import Clock from 'react-clock'
import 'react-clock/dist/Clock.css'

import './App.scss'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Task {
  _id: string
  testo: string
  completata: boolean
  data?: string | null
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
  const [inPausa, setInPausa] = useState(false)

  const [taskInModifica, setTaskInModifica] = useState<Task | null>(null)
  const [testoModifica, setTestoModifica] = useState('')

  const [ricerca, setRicerca] = useState('')

  const [newCategory, setNewCategory] = useState('')
  const [categorySelected, setNewCategorySelected] = useState('')

  const [ordine, setOrdine] = useState<'recenti' | 'vecchie'>('recenti')

  const [giornoSelezionato, setGiornoSelezionato] = useState(new Date())

  const [modificaCategoria, setModificaCategoria] = useState('')

  const [ora, setOra] = useState(new Date())

  const [dataModifica, setDataModifica] = useState('')

  const [modaleCattura, setModaleCattura] = useState(false)

  const openEdit = (task: Task) => {
    setDataModifica(task.data ? task.data.slice(0, 10) : '')
    setTaskInModifica(task)
    setTestoModifica(task.testo)
    setModificaCategoria(task.categoria || '')
  }
  const closeEdit = () => setTaskInModifica(null)

  const saveEdit = async () => {
      if (!taskInModifica || !testoModifica.trim()) return
        await updateTask(taskInModifica._id, { testo: testoModifica, categoria: modificaCategoria, data: dataModifica || null, })
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
  setModaleCattura(false)
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

useEffect(() => {
  const timer = setInterval(() => setOra(new Date()), 1000)
  return () => clearInterval(timer)
}, [])

useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()

      if (inAscolto) {
        fermaAscolto()
      } else {
        setModaleCattura(true)
        avviaAscolto()
      }
    }
  }

  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}, [inAscolto])


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

  window.speechSynthesis.cancel()   
  setInPausa(false)

  if (!window.speechSynthesis) {
        setErrore('Il tuo browser non supporta la trascrizione vocale. Usa Chrome o Edge.')
      return
    }

  const frase = tasks.map((t) => t.testo).join('. ')

  const lettura = new SpeechSynthesisUtterance(frase)

  lettura.lang = "it-IT"

  window.speechSynthesis.speak(lettura)

}

function togglePausa() {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
    setInPausa(false)
  } else {
    window.speechSynthesis.pause()
    setInPausa(true)
  }
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

    <datalist id="categorie">
        {categorieEsistenti.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>
    
    <main>
        <section className='alg-cattura-tasks'>
          <h2>Nuovo pensiero</h2>
          <button className="btn-hero" onClick={() => setModaleCattura(true)}></button>
          <p>premi invio oppure barra spaziatrice per iniziare a registrare</p>

        </section>

          <div className='alg-tasks-salvate'>
            <div className='alg-title-order'>
              <h2>Pensieri e idee del giorno</h2>
              <button onClick={() => setOrdine(ordine === 'recenti' ? 'vecchie' : 'recenti')}>
                {ordine === 'recenti' ? 'Più recenti' : 'Più vecchie'}
              </button>
            </div>

            <ul>
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
              <button className='btn-edit' onClick={readingTask}>Ascolta le task</button>
              <button className='btn-delete' onClick={togglePausa}>{inPausa ? 'Riprendi' : 'Pausa'}</button>
            </div>

          </div>
        </main>

    <section className='alg-main'>
      <div className='alg-panel-calendario'>
        <div className="pannello-cerca-categorie">

          <Clock value={ora} size={190} renderNumbers={true} />
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
                  <strong>{taskVisibili.length}</strong> task totali
                </div>
              </div>

          <div className='panel-task-salvate'>
            <h2>Gestione delle task</h2>
              <ul className="lista-task">
                {taskVisibili.slice(0, 5).map((task) => (
                    <li key={task._id} className="task">
                      <p className="testo">{task.testo}</p>

                      {task.categoria && <p className="categoria">{task.categoria}</p>}

                      {task.data && (
                        <p className="task-data">
                          📅 {new Date(task.data).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' })}
                        </p>
                      )}

                      <div className="task-azioni">
                        <label>
                          <input
                            type="checkbox"
                            checked={task.completata}
                            onChange={() => updateTask(task._id, { completata: !task.completata })}
                          />
                          Completata
                        </label>
                       <div className='btn-task'>
                        <button className='btn-edit' onClick={() => openEdit(task)}>Modifica</button>
                        <button className='btn-delete' onClick={() => deleteTask(task._id)}>Elimina</button>
                        </div>
                        
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
        </div>  
      

        <Calendar
          value={giornoSelezionato}
          onChange={(value) => setGiornoSelezionato(value as Date)}
          tileContent={({ date, view }) => {
            if (view !== 'month') return null
            const haTask = tasks.some(
              (t) => t.data && new Date(t.data).toDateString() === date.toDateString()
            )
            return haTask ? <span className="punto-task"></span> : null
          }}
        />
        </section>

    {modaleCattura && (
      <div className="modale-overlay" onClick={() => setModaleCattura(false)}>
        <div className="modale" onClick={(e) => e.stopPropagation()}>
          <h3>Nuovo pensiero</h3>

          <button
            className={inAscolto ? 'registrando' : ''}
            onClick={inAscolto ? fermaAscolto : avviaAscolto}
          >
            {inAscolto ? 'Stoppa registrazione' : 'Parla'}
          </button>

          {errore && <p className="errore">{errore}</p>}

          <label className="modale-campo">
            <span>Testo</span>
            <textarea value={testo} onChange={(e) => setTesto(e.target.value)} />
          </label>

          <label className="modale-campo">
            <span>Categoria</span>
            <input
              value={newCategory}
              list="categorie"
              placeholder="Non è obbligatoria, può rimanere un pensiero libero"
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </label>

          <div className="modale-azioni">
            <div className="modale-azioni-dx">
              <button className="btn-annulla" onClick={() => setModaleCattura(false)}>Annulla</button>
              <button className="btn-salva" onClick={createTask}>Salva</button>
            </div>
          </div>
        </div>
      </div>
    )}

      {taskInModifica && (
        <div className="modale-overlay" onClick={closeEdit}>
          <div className="modale" onClick={(e) => e.stopPropagation()}>
            <h3>Modifica task</h3>

            <label className="modale-campo">
              <span>Testo</span>
              <textarea
                value={testoModifica}
                onChange={(e) => setTestoModifica(e.target.value)}
              />
            </label>

            <label className="modale-campo">
              <span>Categoria</span>
              <input
                value={modificaCategoria}
                list="categorie"
                onChange={(e) => setModificaCategoria(e.target.value)}
              />
            </label>

            <label className="modale-campo">
              <span>Data programmata</span>
              <input
                type="date"
                value={dataModifica}
                onChange={(e) => setDataModifica(e.target.value)}
              />
            </label>

            <div className="modale-azioni">
              <button
                className="btn-elimina"
                onClick={() => {
                  if (window.confirm('Eliminare questo pensiero?')) {
                    deleteTask(taskInModifica._id)
                    closeEdit()
                  }
                }}
              >
                Elimina
              </button>
              <div className="modale-azioni-dx">
                <button className="btn-annulla" onClick={closeEdit}>Annulla</button>
                <button className="btn-salva" onClick={saveEdit}>Salva</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
