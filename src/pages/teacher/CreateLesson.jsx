import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLessonApi } from "../../api/endpoints";

export default function CreateLesson() {
  const nav = useNavigate();
  const [tema, setTema] = useState("");
  const [pocetOtazek, setPocetOtazek] = useState(8);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await createLessonApi({ tema, pocetOtazek: Number(pocetOtazek) });
      nav(`/ucitel/schvalit/${data.lessonId}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Vytvořit lekci</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Téma</label>
        <input value={tema} onChange={(e) => setTema(e.target.value)} />

        <label>Počet otázek</label>
        <input type="number" min="2" max="30" value={pocetOtazek} onChange={(e) => setPocetOtazek(e.target.value)} />

        <button disabled={loading}>{loading ? "Generuji..." : "Vytvořit"}</button>
      </form>
    </div>
  );
}
