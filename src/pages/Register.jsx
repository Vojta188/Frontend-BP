import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/endpoints";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      await registerApi({ name, email, password, role });
      setOk("Registrace OK. Teď se přihlas.");
      setTimeout(() => nav("/login"), 600);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="card">
      <h2>Registrace</h2>
      {err && <div className="error">{err}</div>}
      {ok && <div className="ok">{ok}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Jméno</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Heslo</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Učitel</option>
        </select>

        <button>Registrovat</button>
      </form>
    </div>
  );
}
