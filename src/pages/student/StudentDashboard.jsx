import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessonsApi } from "../../api/endpoints";

export default function StudentDashboard() {
  const [lessons, setLessons] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const l = await getLessonsApi();
        setLessons(l);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  return (
    <div className="studentHome">
      <div className="studentHero card">
        <h2>Moje lekce</h2>
        <div className="muted">Uvidíš jen lekce, které ti učitel přiřadil.</div>
        {err && <div className="error" style={{ marginTop: 10 }}>{err}</div>}
      </div>

      <div className="studentGrid">
        {lessons.map((l) => (
          <div key={l.id} className="card studentLessonCard">
            <div className="hstack">
              <div style={{ fontWeight: 800 }}>{l.title}</div>
              <span className="badge">
                {l.attempt_status === "completed" ? "Splněno" : "Dostupné"}
              </span>
            </div>

            <div className="muted" style={{ marginTop: 8 }}>
              {l.attempt_status === "completed"
                ? "Lekce je zamčená (čeká na povolení opakování)."
                : "Klikni a začni test."}
            </div>

            <div className="btnRow" style={{ marginTop: 12 }}>
              {l.attempt_status === "completed" ? (
                <button disabled>Otevřít</button>
              ) : (
                <Link className="btn" to={`/student/lekce/${l.id}`}>Otevřít</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}