import Cam from './pages/Cam'
import Home from './pages/Home'
import Notary from './pages/Notary'
import Social from './pages/Social'
import Vote from './pages/Vote'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/vote' element={<Vote />}></Route>
      <Route path='/cam' element={<Cam />}></Route>
      <Route path='/social' element={<Social />}></Route>
      <Route path='/notary' element={<Notary />}></Route> 
    </Routes>
  )
}

export default App