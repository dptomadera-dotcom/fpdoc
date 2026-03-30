import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'TRANSVERSAL FP | Sistema de Planificación FP',
  description: 'Sistema Inteligente de Planificación y Acompañamiento para Formación Profesional',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TRANSVERSAL FP',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="layout-root">
          {/* Dashboard Sidebar */}
          <aside className="sidebar glass animate-fade-in">
            <div className="sidebar-logo">
              <span className="text-gradient">TRANSVERSAL FP</span>
            </div>
            
            <nav className="nav-links">
              <a href="/" className="nav-item active">
                <span className="icon">📊</span>
                Dashboard
              </a>
              <a href="/projects" className="nav-item">
                <span className="icon">🛠️</span>
                Proyectos (ABP)
              </a>
              <a href="/calendar" className="nav-item">
                <span className="icon">📅</span>
                Calendario
              </a>
              <a href="/evidence" className="nav-item">
                <span className="icon">📂</span>
                Evidencias
              </a>
            </nav>
            
            <div className="sidebar-footer">
              <div className="user-info">
                <div className="avatar">JD</div>
                <div className="details">
                  <span className="name">Juan Docente</span>
                  <span className="role">Profesor / Tutor</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
            <header className="main-header glass animate-fade-in">
              <h1>Panel de Control</h1>
              <div className="header-actions">
                <button className="btn-icon">🔔</button>
                <button className="btn-icon">⚙️</button>
              </div>
            </header>
            
            <section className="page-content">
              {children}
            </section>
          </main>
        </div>

        {/* Inline CSS for initial layout control */}
        <style dangerouslySetInnerHTML={{ __html: `
          .layout-root {
            display: flex;
            min-height: 100vh;
          }
          
          .sidebar {
            width: 280px;
            height: 96vh;
            margin: 2vh;
            display: flex;
            flex-direction: column;
            padding: 2rem 1.5rem;
            position: fixed;
            z-index: 100;
          }
          
          .sidebar-logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.05em;
            margin-bottom: 3rem;
          }
          
          .nav-links {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            flex-grow: 1;
          }
          
          .nav-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1rem;
            border-radius: var(--radius);
            font-weight: 500;
            color: var(--text-muted);
            transition: var(--transition);
          }
          
          .nav-item:hover, .nav-item.active {
            background: rgba(59, 130, 246, 0.1);
            color: var(--text);
            box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
          }
          
          .nav-item.active {
            border: 1px solid rgba(59, 130, 246, 0.4);
            background: rgba(59, 130, 246, 0.15);
          }
          
          .sidebar-footer {
            border-top: 1px solid var(--surface-border);
            padding-top: 1.5rem;
          }
          
          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.8rem;
          }
          
          .details {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
          }
          
          .name { font-size: 0.9rem; font-weight: 600; }
          .role { font-size: 0.75rem; color: var(--text-muted); }
          
          .main-content {
            margin-left: 320px;
            flex-grow: 1;
            padding: 2rem;
            width: calc(100% - 320px);
          }
          
          .main-header {
            width: 100%;
            height: 80px;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          
          .main-header h1 {
            font-size: 1.5rem;
            font-weight: 600;
          }
          
          .header-actions {
            display: flex;
            gap: 1rem;
          }
          
          .btn-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1px solid var(--surface-border);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.03);
            font-size: 1.2rem;
            transition: var(--transition);
          }
          
          .btn-icon:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: scale(1.05);
          }
          
          .page-content {
            max-width: 1200px;
          }
          
          @media (max-width: 1024px) {
            .sidebar { width: 80px; padding: 1.5rem 0.75rem; }
            .sidebar-logo, .details, .nav-item span:not(.icon) { display: none; }
            .main-content { margin-left: 120px; width: calc(100% - 120px); }
          }
        ` }} />
      </body>
    </html>
  );
}
