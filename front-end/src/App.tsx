
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import { useAppContext } from './contexts/AppContext'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import SignInPage from './pages/SignIn'

const App = () => {

  const {isSignedIn} = useAppContext()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to="/sign-in" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App