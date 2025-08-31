import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Header from './components/Header'
import Container from './components/Container'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="py-6 sm:py-8">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
          </Routes>
        </Container>
      </main>
    </div>
  )
}

export default App
