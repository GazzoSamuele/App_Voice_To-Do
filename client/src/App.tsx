import { useState, useRef } from 'react'

import './App.scss'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'


function App() {

  // contiene il testo trascritto da mostrare a schermo.
  const [testo, setTesto] = useState('')

  // l'oggetto registratore
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // ricorda se stai registrando
  const [inAscolto, setInAscolto] = useState(false)

  const [errore, setErrore] = useState('')
  
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

      <p>{testo}</p>
    </div>
  </div>
  
    </>
  )
}

export default App