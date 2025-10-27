import { useState } from 'react'
import './App.css'
import Login from './components/Login/Login'
import FloatingButton from './components/FloatingButton/FloatingButton'
import UserProfile from './components/UserProfile/UserProfile'

function App() {
  return (
    <div className="App">
      <UserProfile />
    </div>
  )
}

export default App