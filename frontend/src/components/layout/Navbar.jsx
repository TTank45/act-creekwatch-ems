import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ACT CreekWatch EMS
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Public Dashboard
          </NavLink>
          <NavLink to="/volunteer" className="nav-link">
            Volunteer
          </NavLink>
          <NavLink to="/upload" className="nav-link">
            Upload CSV
          </NavLink>
          <NavLink to="/alerts" className="nav-link">
            Alerts
          </NavLink>
          <NavLink to="/coordinator" className="nav-link">
  Coordinator
</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;