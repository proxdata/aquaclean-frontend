import { AppProvider, useApp } from './context/AppContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

function Router() {
  const { view } = useApp()
  switch (view) {
    case 'landing': return <Landing />
    case 'login': return <Login />
    case 'register': return <Register />
    case 'admin-login': return <AdminLogin />
    case 'dashboard': return <Dashboard />
    case 'admin': return <Admin />
    default: return <Landing />
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
