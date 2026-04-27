import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { X, Check, Eye, EyeOff } from 'lucide-react'
import './Modal.css'

export default function RegisterModal({ plan, onClose }) {
  const { addClient, loginAfterRegister } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', plan_id: plan.id, password: '', confirmPassword: '' })
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
      const { password, confirmPassword, ...rest } = form
      await addClient({ ...rest, password })
      setStep(2)
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoToDashboard() {
    await loginAfterRegister(form.email, form.password)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in">
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        {step === 1 ? (
          <>
            <div className="modal-header">
              <h2>Assinar Plano <span style={{ color: plan.color }}>{plan.name}</span></h2>
              <p className="modal-sub">R$ {Number(plan.price).toFixed(2).replace('.', ',')} / mês · {plan.unlimited ? 'Lavagens ilimitadas' : `${plan.washes} lavagem${plan.washes > 1 ? 's' : ''}/mês`}</p>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Nome completo</label><input name="name" placeholder="Seu nome" value={form.name} onChange={handleChange} /></div>
              <div className="form-group"><label>E-mail</label><input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} /></div>
              <div className="form-group"><label>Telefone</label><input name="phone" placeholder="(11) 99999-0000" value={form.phone} onChange={handleChange} /></div>
              <div className="form-group"><label>Veículo (modelo e placa)</label><input name="vehicle" placeholder="Ex: Honda Civic - ABC-1234" value={form.vehicle} onChange={handleChange} /></div>
              <div className="form-group">
                <label>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPass ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text3)', padding: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group"><label>Confirmar senha</label><input name="confirmPassword" type="password" placeholder="Repita a senha" value={form.confirmPassword} onChange={handleChange} /></div>
              {error && <p className="form-error">{error}</p>}
              <button className="btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Cadastrando...' : 'Confirmar Assinatura'}
              </button>
            </div>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-icon"><Check size={32} color="#000" /></div>
            <h2>Assinatura Confirmada!</h2>
            <p>Bem-vindo ao plano <strong style={{ color: plan.color }}>{plan.name}</strong>!<br />Acesse sua área para acompanhar suas lavagens.</p>
            <button className="btn-primary btn-full" style={{ marginTop: 24 }} onClick={handleGoToDashboard}>Acessar Minha Área</button>
          </div>
        )}
      </div>
    </div>
  )
}
