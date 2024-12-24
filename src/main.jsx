import { StrictMode } from 'react'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import './css/root.css'
import App from './App.jsx'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import {UserProvider} from "./context"

axios.defaults.withCredentials =true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/:id' element={<App />} />
          <Route path='/Sign-in' element={<SignIn/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </UserProvider>
    </Router>
  </StrictMode>,
)
