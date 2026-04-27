import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, LogOut, Users, Droplet, TrendingUp, Search, Trash2, Check, X } from 'lucide-react'
import './Admin.css'

function WashModal({ client, onClose, onDone }) {
  const { registerWash } = useApp()
  const [form, setForm] = useState({ type: 'Lavagem Completa', attendant: '', notes: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!form.attendant) return
    setLoading(true)
    try {
      await registerWash(client.id, form)
      setDone(true)
      onDone && onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 420 }}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        {!done ? (
          <>
            <div className="modal-header">
              <h2>Registrar Lavagem</h2>
              <p className="modal-sub">{client.name} · {client.vehicle}</p>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tipo de Lavagem</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option>Lavagem Externa</option>
                  <option>Lavagem Completa</option>
                  <option>Lavagem Premium</option>
                  <option>Polimento</option>
                </select>
              </div>
              <div className="form-group">
                <label>Atendente</label>
                <input placeholder="Nome do atendente" value={form.attendant} onChange={e => setForm(p => ({ ...p, attendant: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Observações</label>
                <input placeholder="Opcional" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button className="btn-primary btn-full" onClick={handleSave} disabled={!form.attendant || loading}>
                {loading ? 'Salvando...' : 'Confirmar Lavagem'}
              </button>
            </div>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-icon"><Check size={32} color="#000" /></div>
            <h2>Lavagem Registrada!</h2>
            <p>Lavagem de <strong>{client.name}</strong> registrada com sucesso.</p>
            <button className="btn-primary btn-full" style={{ marginTop: 24 }} onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  const { clients, plans, getPlan, stats, deleteClient, updateClientStatus, setView, loadClients, loadStats } = useApp()
  const [search, setSearch] = useState('')
  const [washClient, setWashClient] = useState(null)
  const [tab, setTab] = useState('clients')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadClients(), loadStats()]).finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleToggleStatus(client) {
    const newStatus = client.status === 'active' ? 'inactive' : 'active'
    await updateClientStatus(client.id, newStatus)
  }

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div className="sidebar-logo"><Droplets size={20} color="var(--accent)" /><span>AQUACLEAN</span></div>
        <div className="admin-badge-tag">ADMIN</div>
        <nav className="sidebar-nav">
          <button className={`sidebar-item ${tab === 'clients' ? 'active' : ''}`} onClick={() => setTab('clients')}><Users size={16} /> Clientes</button>
          <button className={`sidebar-item ${tab === 'stats' ? 'active' : ''}`} onClick={() => { setTab('stats'); loadStats() }}><TrendingUp size={16} /> Resumo</button>
        </nav>
        <button className="sidebar-logout" onClick={() => setView('landing')}><LogOut size={15} /> Sair</button>
      </aside>

      <main className="admin-main">
        {tab === 'stats' ? (
          <div className="fade-in">
            <header className="dash-header">
              <h1 className="dash-title">Resumo Geral</h1>
              <p className="dash-sub">Visão geral do negócio</p>
            </header>
            <div className="stats-grid">
              <div className="stat-card"><Users size={20} color="var(--accent)" /><p className="stat-card-num">{stats.activeClients}</p><p className="stat-card-label">Clientes Ativos</p></div>
              <div className="stat-card"><Droplet size={20} color="var(--success)" /><p className="stat-card-num">{stats.monthWashes}</p><p className="stat-card-label">Lavagens este mês</p></div>
              <div className="stat-card"><TrendingUp size={20} color="var(--gold)" /><p className="stat-card-num">R$ {Number(stats.revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p><p className="stat-card-label">Receita Mensal</p></div>
            </div>
            <div className="plans-breakdown">
              <h3 className="section-title-sm">Clientes por Plano</h3>
              {plans.map(plan => {
                const row = stats.byPlan?.find(r => r.id === plan.id)
                const count = row ? parseInt(row.count) : 0
                return (
                  <div key={plan.id} className="plan-row" style={{ '--plan-color': plan.color }}>
                    <span className="plan-row-name" style={{ color: plan.color }}>{plan.name}</span>
                    <div className="plan-row-bar"><div className="plan-row-fill" style={{ width: `${stats.activeClients > 0 ? (count / stats.activeClients) * 100 : 0}%` }} /></div>
                    <span className="plan-row-count">{count} cliente{count !== 1 ? 's' : ''}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <header className="admin-header">
              <div>
                <h1 className="dash-title">Clientes</h1>
                <p className="dash-sub">{stats.activeClients} ativos · {stats.totalClients} total</p>
              </div>
            </header>
            <div className="admin-toolbar">
              <div className="search-box">
                <Search size={15} color="var(--text3)" />
                <input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '0', flex: 1 }} />
              </div>
            </div>
            <div className="clients-table">
              <div className="table-header">
                <span>Cliente</span><span>Plano</span><span>Veículo</span><span>Status</span><span>Lavagens</span><span>Ações</span>
              </div>
              {loading ? (
                <div className="empty-state" style={{ padding: 40 }}><p>Carregando...</p></div>
              ) : filtered.map(client => {
                const plan = getPlan(client.plan_id)
                return (
                  <div key={client.id} className="table-row fade-in">
                    <div className="client-cell">
                      <div className="client-mini-avatar">{client.name.charAt(0)}</div>
                      <div><p className="client-name-sm">{client.name}</p><p className="client-email-sm">{client.email}</p></div>
                    </div>
                    <span className="plan-chip" style={{ color: plan.color, borderColor: plan.color + '40', background: plan.color + '10' }}>{plan.name}</span>
                    <span className="vehicle-sm">{client.vehicle}</span>
                    <button className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-inactive'}`} onClick={() => handleToggleStatus(client)}>
                      {client.status === 'active' ? '● Ativo' : '● Inativo'}
                    </button>
                    <span className="wash-count-sm">{client.washes_used} {plan.unlimited ? '' : `/ ${plan.washes}`}</span>
                    <div className="action-btns">
                      <button className="action-btn wash-btn" title="Registrar lavagem" onClick={() => setWashClient(client)}><Droplet size={14} /></button>
                      <button className="action-btn del-btn" title="Remover" onClick={() => deleteClient(client.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                )
              })}
              {!loading && filtered.length === 0 && (
                <div className="empty-state" style={{ padding: 40 }}><Search size={24} color="var(--text3)" /><p>Nenhum cliente encontrado.</p></div>
              )}
            </div>
          </div>
        )}
      </main>

      {washClient && <WashModal client={washClient} onClose={() => setWashClient(null)} onDone={() => { loadClients(); loadStats() }} />}
    </div>
  )
}
