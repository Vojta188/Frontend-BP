import React, { useEffect, useState } from "react";
import { teacherStudentsApi, getLessonAssignApi, saveLessonAssignApi } from "../api/endpoints";

export default function AssignStudents({ lessonId, disabled, onSaved }) {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr(""); setMsg("");
    setLoading(true);
    try {
      const [assign, st] = await Promise.all([
        getLessonAssignApi(lessonId),
        teacherStudentsApi(""),
      ]);
      setSelected(new Set(assign?.studentIds || []));
      setStudents(st || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const search = async (value) => {
    setQuery(value);
    try {
      const st = await teacherStudentsApi(value);
      setStudents(st || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    setErr(""); setMsg("");
    try {
      await saveLessonAssignApi(lessonId, Array.from(selected));
      setMsg("Přiřazení žákům uloženo ✅");
      onSaved?.(Array.from(selected));
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="card">
      <div className="hstack">
        <div>
          <div className="sectionTitle">Přiřazení žákům</div>
          <div className="subTitle">Vyber, kterým žákům se lekce zobrazí.</div>
        </div>
        <span className="badge">Vybráno: {selected.size}</span>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      <div className="grid2">
        <div>
          <label>Hledat (jméno nebo email)</label>
          <input
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="např. Novák"
            disabled={loading}
          />
        </div>

        <div style={{ alignSelf: "end" }} className="btnRow">
          <button className="primary" onClick={save} disabled={disabled || loading}>
            Uložit přiřazení
          </button>
          <button onClick={load} disabled={loading}>
            Obnovit
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10, maxHeight: 320, overflow: "auto" }}>
        {students.length === 0 && (
          <div className="subTitle">Žádní žáci nenalezeni.</div>
        )}

        {students.map((s) => {
          const checked = selected.has(s.id);
          return (
            <div key={s.id} className="qItem" style={{ marginBottom: 8 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "center", margin: 0 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(s.id)}
                  disabled={disabled}
                />
                <div>
                  <div style={{ fontWeight: 800 }}>{s.name}</div>
                  <div className="muted">{s.email}</div>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {disabled && (
        <div className="subTitle" style={{ marginTop: 10 }}>
          Tato část je teď zamčená (lekce je schválená). Pokud chceš, aby šlo přiřazovat i po schválení, řekni a upravím to.
        </div>
      )}
    </div>
  );
}