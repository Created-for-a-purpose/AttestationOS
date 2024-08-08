import Home from './pages/Home'
import Vote from './pages/Vote'
import Cam from './pages/Cam'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/vote' element={<Vote />}></Route>
      <Route path='/cam' element={<Cam />}></Route>
    </Routes>
  )
}

export default App