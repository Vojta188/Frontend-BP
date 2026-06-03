import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessonsApi, teacherOverviewApi, deleteLessonApi } from "../../api/endpoints";

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState([]);
  const [overview, setOverview] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const nactiData = async () => {
    const [l, o] = await Promise.all([getLessonsApi(), teacherOverviewApi()]);
    setLessons(l);
    setOverview(o);
  };

  const smazatLekci = async (lessonId) => {
    if (!window.confirm("Opravdu chceš lekci smazat? Tohle smaže i otázky a výsledky.")) return;

    setErr("");
    setMsg("");

    try {
      await deleteLessonApi(lessonId);
      await nactiData();
      setMsg("Lekce smazána.");
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await nactiData();
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="card tdash-hero">
        <div>
          <h2>Učitel</h2>
          <div className="muted">
            Správa lekcí, přiřazení žákům a výsledky na jednom místě.
          </div>
        </div>
        <div className="tdash-cta">
          <Link className="linkBtn" to="/ucitel/vytvorit">+ Vytvořit lekci</Link>
        </div>
      </div>

      {err && <div className="error">{err}</div>}
      {msg && <div className="ok">{msg}</div>}

      {overview && (
        <div className="tdash-stats">
          <div className="statCard">
            <div className="statLabel">Odpovědi</div>
            <div className="statValue">{overview.totalAnswers}</div>
            <div className="statHint">Celkem odevzdaných odpovědí studentů.</div>
          </div>

          <div className="statCard">
            <div className="statLabel">Úspěšnost</div>
            <div className="statValue">{overview.successRate}%</div>
            <div className="statHint">Podíl správných odpovědí.</div>
          </div>

          <div className="statCard">
            <div className="statLabel">Studentů</div>
            <div className="statValue">{overview.uniqueStudents}</div>
            <div className="statHint">Počet unikátních studentů v datech.</div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 14 }}>
        <div className="hstack">
          <div>
            <div className="sectionTitle">Moje lekce</div>
            <div className="subTitle">Rychlé akce: schválení, statistiky, správa žáků a mazání.</div>
          </div>
          <span className="badge">{lessons.length} ks</span>
        </div>

        <div className="tableWrap" style={{ marginTop: 10 }}>
          <table className="tableModern">
            <thead>
              <tr>
                <th>Název</th>
                <th>Schváleno</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 900 }}>{l.title}</td>
                  <td>
                    {l.approved ? (
                      <span className="badgeYes">ANO</span>
                    ) : (
                      <span className="badgeNo">NE</span>
                    )}
                  </td>
                  <td>
                    <div className="actionsModern">
                      {!l.approved && (
                        <Link className="linkBtn" to={`/ucitel/schvalit/${l.id}`}>
                          Schválit
                        </Link>
                      )}
                      <Link className="linkBtn" to={`/ucitel/statistiky/${l.id}`}>
                        Statistiky
                      </Link>
                      <Link className="linkBtn" to={`/ucitel/lekce/${l.id}/sprava`}>
                        Správa žáků
                      </Link>
                      <button className="btnDangerSoft" onClick={() => smazatLekci(l.id)}>
                        Smazat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {lessons.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ color: "#6b7280", padding: 16 }}>
                    Zatím nemáš žádné lekce. Klikni na „Vytvořit lekci“.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}