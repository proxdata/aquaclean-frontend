import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import './Auth.css'

export default function Register() {
  const { addClient, loginAfterRegister, setView, plans } = useApp()
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', plan_id: 'basic', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.phone || !form.vehicle || !form.password) {
      setError('Preencha todos os campos.'); return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('E-mail inválido.'); return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.'); return
    }
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.'); return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...data } = form
      await addClient(data)
      await loginAfterRegister(form.email, form.password)
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <button className="back-btn" onClick={() => setView('login')}><ArrowLeft size={16} /> Voltar</button>
        <div className="auth-logo"><Droplets size={28} color="var(--accent)" /><span>AQUACLEAN</span></div>
        <h2 className="auth-title">Criar Conta</h2>
        <p className="auth-sub">Escolha seu plano e comece agora</p>

        <div className="form-group" style={{ width: '100%' }}>
          <label>Plano</label>
          <select name="plan_id" value={form.plan_id} onChange={handleChange}>
            {plans.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — R$ {Number(p.price).toFixed(2).replace('.', ',')} / mês
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <label>Nome completo</label>
          <input name="name" placeholder="Seu nome" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <label>E-mail</label>
          <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <label>Telefone</label>
          <input name="phone" placeholder="(11) 99999-0000" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <label>Veículo (modelo e placa)</label>
          <input name="vehicle" placeholder="Ex: Honda Civic - ABC-1234" value={form.vehicle} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <label>Senha</label>
          <div style={{ position: 'relative' }}>
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text3)', padding: 0 }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <label>Confirmar senha</label>
          <input name="confirmPassword" type="password" placeholder="Repita a senha" value={form.confirmPassword} onChange={handleChange} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Criar Conta'}
        </button>

        <p className="auth-hint">Já tem conta? <button className="link-btn" onClick={() => setView('login')}>Entrar</button></p>
      </div>
    </div>
  )
}
