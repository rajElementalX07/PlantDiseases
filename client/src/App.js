import { useEffect } from 'react';
import './App.css';
import Aos from 'aos';
import { Toaster } from 'react-hot-toast';
import {  Route, Routes,  } from 'react-router-dom';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';
import MapScreen from './components/MapScreen';
import ProtectedRoute from './utils/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import Analyzer from './pages/Analyzer';
import Notifications from './pages/Notifications';
import History from './pages/History';

function App() {
  useEffect(()=>{
        
    Aos.init();

},[]);

const protectedRoutes = [
    
  { path: '/dashboard/profile', element: <ProfilePage /> },
  { path: '/dashboard/analyzer', element: <Analyzer /> },
  { path: '/dashboard/notifications', element: <Notifications /> },
  { path: '/dashboard/history', element: <History /> },
  
];

  return (
    <>
    <Toaster position="top-center"  reverseOrder={false} toastOptions={{duration: 5000}}/>
   <Header/>
    <Routes>
    {protectedRoutes.map((route, index) => (
        <Route path={route.path} key={index}  element={<ProtectedRoute>{route.element}</ProtectedRoute>} />
        ))}
      <Route path='/' element={<HomePage/>}  />   
      <Route path='/auth/farmer-login' element={<AuthPage/>}  />   
      <Route path='/auth/farmer-reg' element={<AuthPage/>}  />   
      <Route path='/map' element={<MapScreen/>}  />   
      <Route path='/map' element={<MapScreen/>}  />   
      <Route path='*' element={<NotFound/>}  />   
    </Routes>
    </>
  );
}

export default App;
