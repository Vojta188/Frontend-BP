import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand"></Link>
        <div className="nav-right">
          {user ? (
            <>
              <span className="muted">{user.name} ({user.role})</span>
              <button onClick={onLogout}>Odhlásit</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/registrace">Registrace</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
