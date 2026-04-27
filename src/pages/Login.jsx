import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import './Auth.css'

export default function Login() {
  const { loginClient, setView } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleLogin() {
    if (!form.email || !form.password) { setError('Preencha e-mail e senha.'); return }
    setLoading(true)
    try {
      await loginClient(form.email, form.password)
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <button className="back-btn" onClick={() => setView('landing')}><ArrowLeft size={16} /> Voltar</button>
        <div className="auth-logo"><Droplets size={28} color="var(--accent)" /><span>AQUACLEAN</span></div>
        <h2 className="auth-title">Área do Cliente</h2>
        <p className="auth-sub">Entre com seu e-mail e senha</p>

        <div className="form-group" style={{ width: '100%' }}>
          <label>E-mail</label>
          <input name="email" type="email" placeholder="seu@email.com" value={form.email}
            onChange={handleChange} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="form-group" style={{ width: '100%' }}>
          <label>Senha</label>
          <div style={{ position: 'relative' }}>
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
              onChange={handleChange} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text3)', padding: 0 }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn-primary btn-full" onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <button className="btn-outline btn-full" style={{ marginTop: 8 }} onClick={() => setView('register')}>
          Criar Conta
        </button>

        <p className="auth-hint">Dúvidas? <button className="link-btn" onClick={() => setView('landing')}>Ver planos</button></p>
      </div>
    </div>
  )
}
