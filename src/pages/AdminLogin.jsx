import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, ArrowLeft } from 'lucide-react'
import './Auth.css'

export default function AdminLogin() {
  const { loginAdmin, setView } = useApp()
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    try {
      await loginAdmin(pass)
    } catch (err) {
      setError(err.message || 'Senha incorreta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <button className="back-btn" onClick={() => setView('landing')}><ArrowLeft size={16} /> Voltar</button>
        <div className="auth-logo"><Droplets size={28} color="var(--accent)" /><span>AQUACLEAN</span></div>
        <h2 className="auth-title">Painel Admin</h2>
        <p className="auth-sub">Senha padrão: <strong>admin123</strong></p>
        <div className="form-group" style={{ width: '100%' }}>
          <label>Senha</label>
          <input type="password" placeholder="••••••••" value={pass}
            onChange={e => { setPass(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn-primary btn-full" onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar como Admin'}
        </button>
      </div>
    </div>
  )
}
