import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="page page-home">
      <div className="container home-hero">
        <div className="hero-content">
          <span className="hero-kicker">Environmental Monitoring System</span>
          <h1>ACT CreekWatch EMS</h1>
          <p>
            A modern platform for creek data collection, volunteer uploads,
            environmental alerts, public reporting, and water-quality monitoring
            across ACT creek sites.
          </p>

          <div className="hero-buttons">
            <Link to="/volunteer" className="btn btn-primary">
              Volunteer Dashboard
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              View Public Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-logo-card">
            <div className="logo-circle">
              <span className="logo-mark">🌿</span>
            </div>
            <h2>ACT CreekWatch EMS</h2>
            <p>Environmental data collection and analysis for healthier creek systems.</p>
          </div>

          <div className="hero-mini-grid">
            <div className="hero-mini-card">
              <span>pH</span>
              <strong>7.2</strong>
            </div>
            <div className="hero-mini-card">
              <span>Oxygen</span>
              <strong>8.4</strong>
            </div>
            <div className="hero-mini-card">
              <span>Temp</span>
              <strong>18.6°C</strong>
            </div>
            <div className="hero-mini-card">
              <span>Status</span>
              <strong>Good</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;