import React, { StrictMode, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage' 
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

    const {theme} = useThemeStore();
  
  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
   <div data-theme={theme}>
    <Toaster position="top-center" />
    <Navbar/>
    
    <Routes>
            <Route path="/" element={authUser?<Home />:<Navigate to= "/login"/>} />
            <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
            <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"/>} />
            <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to= "/login"/>} /> 
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    </div>
  )
}

export default App    
