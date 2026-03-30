'use client';

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      {/* Welcome Section */}
      <section className="welcome-banner glass animate-fade-in">
        <div className="banner-text">
          <h2>¡Bienvenido, Juan! 👋</h2>
          <p>Hoy es lunes, 30 de marzo. Tienes 3 sesiones programadas para hoy.</p>
        </div>
        <div className="banner-stats">
          <div className="stat-item">
            <span className="stat-label">Progreso Medio</span>
            <span className="stat-value">68%</span>
          </div>
        </div>
      </section>

      {/* Main Stats / Project Focus */}
      <div className="main-stats-row">
        {/* Current Project Card */}
        <article className="project-feature premium-card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <span className="tag">Proyecto Actual - 1ª Eval</span>
            <h3>Proyecto: Taburete de Taller</h3>
          </div>
          <p className="card-desc">Construcción y ensamblado de taburete funcional siguiendo normativa de seguridad.</p>
          
          <div className="progress-section">
            <div className="progress-info">
              <span>Progreso del Proyecto</span>
              <span>75%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="linked-items">
              <span>RA: 1, 2</span>
              <span>CE: 1.a, 2.c</span>
            </div>
            <button className="btn-primary">Ver Detalles</button>
          </div>
        </article>

        {/* Trimester Overview */}
        <div className="trimester-overview">
          <div className="mini-card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4>1ª Evaluación</h4>
            <div className="mini-progress">
              <div className="bar" style={{ width: '85%', background: 'var(--secondary)' }}></div>
            </div>
            <span>En curso</span>
          </div>
          <div className="mini-card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h4>2ª Evaluación</h4>
            <div className="mini-progress">
              <div className="bar" style={{ width: '0%' }}></div>
            </div>
            <span>Pendiente</span>
          </div>
          <div className="mini-card glass animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h4>3ª Evaluación</h4>
            <div className="mini-progress">
              <div className="bar" style={{ width: '0%' }}></div>
            </div>
            <span>Pendiente</span>
          </div>
        </div>
      </div>

      {/* Recent Activity / Next Sessions */}
      <section className="activity-section glass animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <h3>Próximas Sesiones</h3>
        <div className="session-list">
          <div className="session-item">
            <div className="session-time">08:00 - 10:00</div>
            <div className="session-info">
              <span className="module">Módulo 01</span>
              <span className="topic">Montaje de estructuras</span>
            </div>
            <span className="badge">Taller A</span>
          </div>
          <div className="session-item">
            <div className="session-time">10:30 - 12:30</div>
            <div className="session-info">
              <span className="module">Módulo 04</span>
              <span className="topic">Seguridad e Higiene</span>
            </div>
            <span className="badge">Aula 202</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .welcome-banner {
          padding: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
        }

        .welcome-banner h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .welcome-banner p { color: var(--text-muted); }

        .stat-item { text-align: right; }
        .stat-label { display: block; font-size: 0.8rem; color: var(--text-muted); }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: var(--secondary); }

        .main-stats-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2rem;
        }

        .project-feature { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .tag { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--primary); background: rgba(59, 130, 246, 0.1); padding: 0.25rem 0.75rem; border-radius: 20px; width: fit-content; }
        
        .progress-section { margin: 1rem 0; }
        .progress-info { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .progress-bar-bg { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 4px; }

        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .linked-items { display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.8rem; }

        .btn-primary { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; transition: var(--transition); }
        .btn-primary:hover { background: var(--primary-hover); transform: translateY(-2px); }

        .trimester-overview { display: flex; flex-direction: column; gap: 1rem; }
        .mini-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .mini-progress { height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; }
        .mini-progress .bar { height: 100%; border-radius: 2px; }
        .mini-card span { font-size: 0.75rem; color: var(--text-muted); }

        .activity-section { padding: 2rem; }
        .session-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
        .session-item { display: flex; align-items: center; gap: 2rem; padding: 1rem; border-radius: 8px; background: rgba(255,255,255,0.02); }
        .session-time { font-weight: 600; color: var(--primary); min-width: 100px; }
        .session-info { flex-grow: 1; display: flex; flex-direction: column; }
        .topic { font-size: 0.9rem; color: var(--text-muted); }
        .badge { font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; }

        @media (max-width: 1200px) {
          .main-stats-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
