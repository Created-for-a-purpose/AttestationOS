import Home from './pages/Home'
import Vote from './pages/Vote'
import Cam from './pages/Cam'
import Social from './pages/Social'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/vote' element={<Vote />}></Route>
      <Route path='/cam' element={<Cam />}></Route>
      <Route path='/social' element={<Social />}></Route>
    </Routes>
  )
}

export default App