import './Dashboard.css'

type DashboardProps = {
  usuario: string
  onSair: () => void
}

function Dashboard({ usuario, onSair }: DashboardProps) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🐾</span>
          <div>
            <strong>VetCare</strong>
            <small>Gestão </small>
          </div>
        </div>

        <nav className="menu">
          <button className="menu-item active">
            <span>🏠</span>
            Dashboard
          </button>

          <button className="menu-item">
            <span>👥</span>
            Clientes
          </button>

          <button className="menu-item">
            <span>🐶</span>
            Pets
          </button>

          <button className="menu-item">
            <span>👨‍⚕️</span>
            Veterinários
          </button>

          <button className="menu-item">
            <span>📅</span>
            Consultas
          </button>

          <button className="menu-item">
            <span>📋</span>
            Prontuários
          </button>
        </nav>

        <button className="logout-button" onClick={onSair}>
          <span>🚪</span>
          Sair
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta ao VetCare!</p>
          </div>

          <div className="user-area">
            <div className="user-avatar">
              {usuario.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{usuario}</strong>
              <small>Administrador</small>
            </div>
          </div>
        </header>

        <section className="welcome-card">
          <div>
            <span className="welcome-icon">🐾</span>

            <div>
              <h2>Olá, {usuario}!</h2>
              <p>
                Aqui está o resumo do seu sistema.
              </p>
            </div>
          </div>
        </section>

        <section className="cards">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>

            <div>
              <span>Clientes</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🐶</div>

            <div>
              <span>Pets cadastrados</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>

            <div>
              <span>Consultas hoje</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👨‍⚕️</div>

            <div>
              <span>Veterinários</span>
              <strong>0</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Próximas consultas</h2>
              <p>Consultas agendadas recentemente</p>
            </div>

            <button className="primary-button">
              + Nova consulta
            </button>
          </div>

          <div className="empty-state">
            <span>📅</span>
            <h3>Nenhuma consulta cadastrada</h3>
            <p>
              Quando houver consultas agendadas, elas aparecerão aqui.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard