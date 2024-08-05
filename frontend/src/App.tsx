import Home from './pages/Home'
import Vote from './pages/Vote'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/vote' element={<Vote />}></Route>
    </Routes>
  )
}

export default App