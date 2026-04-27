import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, LogOut, Car, Calendar, CheckCircle, Clock } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const { currentUser, getPlan, getClientWashes, logout } = useApp()
  const [washes, setWashes] = useState([])

  useEffect(() => {
    if (currentUser) getClientWashes(currentUser.id).then(setWashes)
  }, [currentUser])

  if (!currentUser) return null

  const plan = getPlan(currentUser.plan_id)
  const washesUsed = currentUser.washes_used || 0
  const planWashes = plan.washes
  const washesLeft = plan.unlimited ? '∞' : Math.max(0, planWashes - washesUsed)
  const progress = plan.unlimited ? 100 : Math.min(100, (washesUsed / planWashes) * 100)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><Droplets size={20} color="var(--accent)" /><span>AQUACLEAN</span></div>
        <div className="sidebar-user">
          <div className="user-avatar">{currentUser.name.charAt(0)}</div>
          <div>
            <p className="user-name">{currentUser.name.split(' ')[0]}</p>
            <p className="user-email">{currentUser.email}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-item active"><CheckCircle size={16} /> Minha Assinatura</button>
          <button className="sidebar-item"><Car size={16} /> Meu Veículo</button>
          <button className="sidebar-item"><Calendar size={16} /> Histórico</button>
        </nav>
        <button className="sidebar-logout" onClick={logout}><LogOut size={15} /> Sair</button>
      </aside>
      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Olá, {currentUser.name.split(' ')[0]}! 👋</h1>
            <p className="dash-sub">Acompanhe sua assinatura e histórico de lavagens</p>
          </div>
        </header>
        <div className="dash-grid">
          <div className="dash-card plan-status-card" style={{ '--plan-color': plan.color }}>
            <div className="card-top">
              <div>
                <p className="card-label">Plano Atual</p>
                <h2 className="plan-big-name">{plan.name}</h2>
              </div>
              <span className="badge badge-active">● Ativo</span>
            </div>
            <div className="wash-counter">
              <div className="wash-big">{plan.unlimited ? '∞' : washesLeft}</div>
              <div className="wash-meta">
                <p>{plan.unlimited ? 'lavagens ilimitadas' : `lavagem${washesLeft !== 1 ? 's' : ''} restante${washesLeft !== 1 ? 's' : ''}`}</p>
                {!plan.unlimited && <p className="wash-used">{washesUsed} de {planWashes} usadas este mês</p>}
              </div>
            </div>
            {!plan.unlimited && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%`, background: plan.color }} />
              </div>
            )}
            <div className="plan-price-row">
              <span className="plan-price-tag">R$ {Number(plan.price).toFixed(2).replace('.', ',')}/mês</span>
              <span className="plan-renew">Renova em 30 dias</span>
            </div>
          </div>
          <div className="dash-card vehicle-card">
            <p className="card-label">Meu Veículo</p>
            <div className="vehicle-info">
              <Car size={32} color="var(--text2)" />
              <div>
                <p className="vehicle-name">{currentUser.vehicle}</p>
                <p className="vehicle-sub">Cadastrado desde {new Date(currentUser.join_date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
          <div className="dash-card stat-mini">
            <p className="card-label">Total de Lavagens</p>
            <p className="stat-big">{washesUsed}</p>
            <p className="stat-detail">desde o início</p>
          </div>
        </div>
        <section className="wash-history">
          <h2 className="section-title-sm">Histórico de Lavagens</h2>
          {washes.length === 0 ? (
            <div className="empty-state"><Clock size={32} color="var(--text3)" /><p>Nenhuma lavagem registrada ainda.</p></div>
          ) : (
            <div className="wash-list">
              {washes.map(w => (
                <div key={w.id} className="wash-item fade-in">
                  <div className="wash-dot" />
                  <div className="wash-info">
                    <p className="wash-type">{w.type}</p>
                    {w.notes && <p className="wash-notes">{w.notes}</p>}
                  </div>
                  <div className="wash-right">
                    <p className="wash-date">{new Date(w.date).toLocaleDateString('pt-BR')}</p>
                    <p className="wash-attendant">por {w.attendant}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
