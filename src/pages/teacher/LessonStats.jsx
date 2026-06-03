import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherLessonStatsApi } from "../../api/endpoints";

export default function LessonStats() {
  const { lessonId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const d = await teacherLessonStatsApi(lessonId);
        setData(d);
      } catch (e) { setErr(e.message); }
    })();
  }, [lessonId]);

  if (err) return <div className="card"><div className="error">{err}</div></div>;
  if (!data) return <div className="card">Načítám…</div>;

  return (
    <div className="card">
      <h2>Statistiky lekce</h2>
      <div><b>{data.lesson.title}</b></div>
      <div>Odpovědi: <b>{data.totalAnswers}</b></div>
      <div>Úspěšnost: <b>{data.successRate}%</b></div>
      <div>Studentů: <b>{data.uniqueStudents}</b></div>

      <h3>Podle obtížnosti</h3>
      <ul>
        {data.byDifficulty.map((x) => (
          <li key={x.difficulty}>
            {x.difficulty}: {x.successRate}% ({x.correct}/{x.total})
          </li>
        ))}
      </ul>

      <h3>Leaderboard</h3>
      <table className="table">
        <thead><tr><th>Student</th><th>Úspěšnost</th><th>Správně/Celkem</th></tr></thead>
        <tbody>
          {data.leaderboard.map((s) => (
            <tr key={s.studentId}>
              <td>{s.studentName}</td>
              <td>{s.successRate}%</td>
              <td>{s.correct}/{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
