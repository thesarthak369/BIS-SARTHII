import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Scan from './pages/Scan.jsx'
import Forms from './pages/Forms.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-paper-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          {/* Find Standard and Roadmap used to be separate pages; both are now steps
              inside the Scan flow (scan -> matched standards -> compliance roadmap). */}
          <Route path="/scan" element={<Scan />} />
          <Route path="/forms" element={<Forms />} />
        </Routes>
      </main>
    </div>
  )
}
