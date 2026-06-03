import React, { useEffect, useMemo, useState } from "react";
import {
  lessonStudentsOverviewApi,
  allowRepeatBatchApi,
  teacherStudentsApi,
  addStudentsToLessonApi,
} from "../api/endpoints";

export default function LessonRepeatManager({ lessonId }) {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(new Set());

  // pro přidání nových žáků
  const [query, setQuery] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [addSelected, setAddSelected] = useState(new Set());

  const load = async () => {
    setErr(""); setMsg("");
    const r = await lessonStudentsOverviewApi(lessonId);
    setRows(r || []);
    setSelected(new Set());
  };

  useEffect(() => {
    if (!lessonId) return;
    (async () => {
      try {
        await load();
        const st = await teacherStudentsApi("");
        setAllStudents(st || []);
      } catch (e) {
        setErr(e.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const toggle = (sid) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(sid)) n.delete(sid); else n.add(sid);
      return n;
    });
  };

  const toggleAdd = (sid) => {
    setAddSelected(prev => {
      const n = new Set(prev);
      if (n.has(sid)) n.delete(sid); else n.add(sid);
      return n;
    });
  };

  const canRepeatIds = useMemo(() => {
    // smysl má resetovat hlavně "splněno"
    return rows.filter(r => r.status === "splneno").map(r => r.student_id);
  }, [rows]);

  const povolitOpakovani = async () => {
    setErr(""); setMsg("");
    const ids = Array.from(selected);
    if (ids.length === 0) return setErr("Nejdřív vyber žáky.");

    try {
      await allowRepeatBatchApi(lessonId, ids);
      setMsg("Opakování povoleno ✅");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const povolitVsemSplnenym = async () => {
    setErr(""); setMsg("");
    if (canRepeatIds.length === 0) return setErr("Nikdo nemá lekci splněnou.");

    try {
      await allowRepeatBatchApi(lessonId, canRepeatIds);
      setMsg("Opakování povoleno všem splněným ✅");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const search = async (v) => {
    setQuery(v);
    try {
      const st = await teacherStudentsApi(v);
      setAllStudents(st || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  const pridatZaky = async () => {
    setErr(""); setMsg("");
    const ids = Array.from(addSelected);
    if (ids.length === 0) return setErr("Vyber žáky k přidání.");

    try {
      await addStudentsToLessonApi(lessonId, ids);
      setMsg("Žáci přidáni k lekci ✅");
      setAddSelected(new Set());
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="card">
      <div className="hstack">
        <div>
          <div className="sectionTitle">Opakování lekce</div>
          <div className="subTitle">Správa splnění a možnost opakování pro vybrané žáky.</div>
        </div>
        <span className="badge">Žáků: {rows.length}</span>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      <div className="btnRow">
        <button className="primary" onClick={povolitOpakovani}>
          Povolit opakování vybraným
        </button>
        <button onClick={povolitVsemSplnenym}>
          Povolit opakování všem splněným
        </button>
        <button onClick={load}>Obnovit</button>
      </div>

      <div style={{ marginTop: 12, maxHeight: 280, overflow: "auto" }}>
        {rows.map(r => (
          <div key={r.student_id} className="qItem" style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", margin: 0 }}>
              <input
                type="checkbox"
                checked={selected.has(r.student_id)}
                onChange={() => toggle(r.student_id)}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{r.name}</div>
                <div className="muted">{r.email}</div>
              </div>
              <span className="badge">
                {r.status === "splneno" ? "Splněno" : r.status === "rozpracovano" ? "Rozpracováno" : "Nezačato"}
              </span>
            </label>
            {r.last_completed_at && (
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                Naposledy dokončeno: {String(r.last_completed_at)}
              </div>
            )}
          </div>
        ))}

        {rows.length === 0 && <div className="subTitle">K lekci zatím nejsou přiřazení žádní žáci.</div>}
      </div>

      <div className="hr" />

      <div className="sectionTitle" style={{ marginBottom: 6 }}>Přidat žáky k lekci</div>
      <div className="subTitle">Umožní použít starou lekci z databáze i pro nové žáky.</div>

      <div className="grid2">
        <div>
          <label>Hledat žáka</label>
          <input value={query} onChange={(e) => search(e.target.value)} placeholder="jméno / email" />
        </div>
        <div className="btnRow" style={{ alignSelf: "end" }}>
          <button className="primary" onClick={pridatZaky}>Přidat vybrané</button>
        </div>
      </div>

      <div style={{ marginTop: 10, maxHeight: 240, overflow: "auto" }}>
        {allStudents.map(s => (
          <div key={s.id} className="qItem" style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "center", margin: 0 }}>
              <input
                type="checkbox"
                checked={addSelected.has(s.id)}
                onChange={() => toggleAdd(s.id)}
              />
              <div>
                <div style={{ fontWeight: 800 }}>{s.name}</div>
                <div className="muted">{s.email}</div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}