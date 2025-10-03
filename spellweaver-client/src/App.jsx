import { useState } from 'react'
import Login from './pages/Login.jsx'
import SpellsPage from './pages/SpellsPage.jsx'

function App() {
  const [accessToken, setAccessToken] = useState(null)

  if(!accessToken){
    return <Login onLogin={setAccessToken} />;
  }

  return (
    <>
      <SpellsPage accessToken={accessToken} />
    </>
  )
}

export default App
