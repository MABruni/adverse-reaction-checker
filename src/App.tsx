import './App.css'
import { useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './components/dashboard';
import Navigation from './components/nav_bar';
import Results from './components/results';

function App() {
  const [ validation, set_validation ] = useState<Array<string | string[] | string[][]>[]>([])

  const get_validation = (data: Array<string | string[] | string[][]>[]) => {
    set_validation(data)
  }

  return (
    <div className='App'>
      <Router>
        <div className='nav-bar'>
          <Navigation />
        </div>
        <Routes>
          <Route path='/' element={<Dashboard validation={validation} onResult={get_validation} />}/>
          <Route path='/results' element={<Results/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
