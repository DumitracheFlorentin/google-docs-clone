import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'

import Home from './pages/Home'
import Document from './pages/Document'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documents/:id" element={<Document />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
