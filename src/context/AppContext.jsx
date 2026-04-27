import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AppContext = createContext(null)

const PLANS_FALLBACK = [
  {
    id: 'basic', name: 'Basic', price: 49.90, washes: 1, unlimited: false,
    color: '#555', highlight: false,
    description: 'Ideal para quem usa pouco o carro',
    features: ['1 lavagem por mês', 'Lavagem externa completa', 'Aspiração interna', 'Suporte básico'],
  },
  {
    id: 'standard', name: 'Standard', price: 129.90, washes: 4, unlimited: false,
    color: '#00d4ff', highlight: true,
    description: 'O equilíbrio perfeito para o dia a dia',
    features: ['4 lavagens por mês', 'Lavagem externa + interna', 'Aspiração e perfume', 'Prioridade no atendimento', 'Suporte prioritário'],
  },
  {
    id: 'premium', name: 'Premium', price: 249.90, washes: null, unlimited: true,
    color: '#ffd740', highlight: false,
    description: 'Sem limites para quem exige o melhor',
    features: ['Lavagens ilimitadas', 'Lavagem completa premium', 'Polimento mensal incluso', 'Fila exclusiva VIP', 'Suporte 24h'],
  },
]

function enrichPlan(p) {
  const fallback = PLANS_FALLBACK.find(f => f.id === p.id) || {}
  return {
    ...fallback, ...p,
    unlimited: p.washes === null,
    color: fallback.color || '#888',
    highlight: fallback.highlight || false,
    features: fallback.features || [],
    description: fallback.description || '',
  }
}

export function AppProvider({ children }) {
  const [plans, setPlans] = useState(PLANS_FALLBACK)
  const [clients, setClients] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [view, setView] = useState('landing')
  const [stats, setStats] = useState({ totalClients: 0, activeClients: 0, totalWashes: 0, monthWashes: 0, revenue: 0, byPlan: [] })

  useEffect(() => {
    api.getPlans().then(data => setPlans(data.map(enrichPlan))).catch(() => {})
  }, [])

  useEffect(() => {
    if (api.hasToken()) {
      api.getMe()
        .then(user => { setCurrentUser(user); setView('dashboard') })
        .catch(() => api.clearToken())
    }
  }, [])

  function getPlan(planId) {
    return plans.find(p => p.id === planId) || PLANS_FALLBACK.find(p => p.id === planId) || {}
  }

  async function loginClient(email, password = '') {
    const { token, client } = await api.loginClient(email, password)
    api.saveToken(token)
    setCurrentUser(client)
    setView('dashboard')
    return client
  }

  async function loginAdmin(password) {
    const { token } = await api.loginAdmin(password)
    api.saveToken(token)
    setView('admin')
    return true
  }

  function logout() {
    api.clearToken()
    setCurrentUser(null)
    setView('landing')
  }

  async function addClient(data) {
    return await api.createClient(data)
  }

  async function loginAfterRegister(email, password = '') {
    try {
      const { token, client } = await api.loginClient(email, password)
      api.saveToken(token)
      setCurrentUser(client)
      setView('dashboard')
      return client
    } catch { return null }
  }

  async function loadClients() {
    const data = await api.getClients()
    setClients(data)
    return data
  }

  async function loadStats() {
    const data = await api.getStats()
    setStats(data)
    return data
  }

  async function updateClientStatus(id, status) {
    await api.updateClientStatus(id, status)
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  async function deleteClient(id) {
    await api.deleteClient(id)
    setClients(prev => prev.filter(c => c.id !== id))
  }

  async function registerWash(clientId, data) {
    return await api.registerWash({ client_id: clientId, ...data })
  }

  async function getClientWashes(clientId) {
    try {
      if (currentUser && currentUser.id === clientId) return await api.getMyWashes()
      return await api.getClientWashes(clientId)
    } catch { return [] }
  }

  return (
    <AppContext.Provider value={{
      plans, clients, currentUser, view, setView, stats,
      getPlan, loginClient, loginAdmin, loginAfterRegister, logout,
      addClient, updateClientStatus, deleteClient,
      registerWash, getClientWashes, loadClients, loadStats,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
