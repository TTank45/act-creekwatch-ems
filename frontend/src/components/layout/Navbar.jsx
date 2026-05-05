import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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

          {user?.role === "volunteer" && (
            <>
              <NavLink to="/volunteer" className="nav-link">
                Volunteer
              </NavLink>

              <NavLink to="/upload" className="nav-link">
                Upload CSV
              </NavLink>
            </>
          )}

          {user?.role === "coordinator" && (
            <NavLink to="/coordinator" className="nav-link">
              Coordinator
            </NavLink>
          )}

          <NavLink to="/alerts" className="nav-link">
            Alerts
          </NavLink>

          {!user ? (
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
          ) : (
            <>
              <span
                style={{
                  marginLeft: "10px",
                  fontWeight: "bold",
                }}
              >
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "10px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;