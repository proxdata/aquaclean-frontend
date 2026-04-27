import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Droplets, Check, Zap, Star, Shield } from 'lucide-react'
import RegisterModal from './RegisterModal'
import './Landing.css'

export default function Landing() {
  const { plans, setView } = useApp()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  function handleChoosePlan(plan) {
    setSelectedPlan(plan)
    setShowRegister(true)
  }

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <Droplets size={22} color="var(--accent)" />
          <span>AQUACLEAN</span>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => setView('login')}>Área do Cliente</button>
          <button className="btn-outline" onClick={() => setView('admin-login')}>Admin</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
        </div>
        <div className="hero-content fade-in">
          <div className="hero-tag">
            <Zap size={12} /> Novo jeito de lavar seu carro
          </div>
          <h1 className="hero-title">
            SEU CARRO <br />
            <span className="hero-accent">SEMPRE LIMPO</span>
          </h1>
          <p className="hero-sub">
            Assine um plano e tenha lavagens garantidas todo mês.<br />
            Sem filas, sem surpresas, sem complicação.
          </p>
          <button className="btn-primary hero-cta" onClick={() => document.getElementById('plans').scrollIntoView({ behavior: 'smooth' })}>
            Ver Planos
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><span className="stat-num">500+</span><span className="stat-label">Clientes</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">4.9★</span><span className="stat-label">Avaliação</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-num">2h</span><span className="stat-label">Tempo médio</span></div>
        </div>
      </section>

      {/* Plans */}
      <section className="plans-section" id="plans">
        <div className="section-header">
          <h2 className="section-title">ESCOLHA SEU PLANO</h2>
          <p className="section-sub">Cancele quando quiser, sem multa</p>
        </div>
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.highlight ? 'plan-highlight' : ''}`} style={{ '--plan-color': plan.color }}>
              {plan.highlight && <div className="plan-badge">MAIS POPULAR</div>}
              <div className="plan-header">
                <span className="plan-name">{plan.name}</span>
                <div className="plan-price">
                  <span className="price-currency">R$</span>
                  <span className="price-value">{Number(plan.price).toFixed(2).replace('.', ',')}</span>
                  <span className="price-period">/mês</span>
                </div>
                <p className="plan-desc">{plan.description}</p>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <Check size={14} color="var(--plan-color)" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="btn-plan"
                onClick={() => handleChoosePlan(plan)}
              >
                Assinar {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <Shield size={28} color="var(--accent)" />
            <h3>Sem fidelidade</h3>
            <p>Cancele quando quiser, sem burocracia e sem multa contratual.</p>
          </div>
          <div className="feature-card">
            <Zap size={28} color="var(--success)" />
            <h3>Atendimento rápido</h3>
            <p>Assinantes têm prioridade na fila. Menos espera, mais comodidade.</p>
          </div>
          <div className="feature-card">
            <Star size={28} color="var(--gold)" />
            <h3>Qualidade garantida</h3>
            <p>Produtos premium e equipe treinada para cuidar do seu veículo.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <Droplets size={18} color="var(--accent)" />
          <span>AQUACLEAN</span>
        </div>
        <p>© 2024 AquaClean. Todos os direitos reservados.</p>
      </footer>

      {showRegister && (
        <RegisterModal plan={selectedPlan} onClose={() => setShowRegister(false)} />
      )}
    </div>
  )
}
