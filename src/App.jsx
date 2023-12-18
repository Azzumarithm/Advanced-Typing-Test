import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useGlobalContext } from './components/Context/context'
import Home from './components/Home/Home'



function App() {
  
  const {} = useGlobalContext()
  
  return (
    <>
      <main className={`app`}>
        <Home/>
      </main>
    </>
  )
}

export default App
