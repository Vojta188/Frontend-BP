import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/endpoints";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await loginApi({ email, password });
      login({ token: data.token, user: data.user });
      nav("/");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="card">
      <h2>Přihlášení</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Heslo</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Login</button>
      </form>
    </div>
  );
}
