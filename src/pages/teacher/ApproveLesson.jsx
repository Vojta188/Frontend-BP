import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AssignStudents from "../../components/AssignStudents.jsx";
import {
  approveLessonApi,
  getLessonDetailApi,
  updateLessonApi,
  updateQuestionApi,
  deleteQuestionApi,
} from "../../api/endpoints";

export default function ApproveLesson() {
  const { lessonId } = useParams();
  const nav = useNavigate();
const [openId, setOpenId] = useState(null);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

 const load = useCallback(async () => {
  const d = await getLessonDetailApi(lessonId);

  setData({
    lesson: d.lesson,
    questions: d.questions.map((q) => ({ ...q })),
  });
}, [lessonId]);

  useEffect(() => {
  (async () => {
    try {
      await load();
    } catch (e) {
      setErr(e.message);
    }
  })();
}, [load]);

  const saveLesson = async () => {
    setErr(""); setMsg("");
    try {
      await updateLessonApi(lessonId, {
        title: data.lesson.title,
        content_easy: data.lesson.content_easy,
        content_hard: data.lesson.content_hard,
      });
      setMsg("Lekce uložena.");
    } catch (e) {
      setErr(e.message);
    }
  };

  const saveQuestion = async (q) => {
    setErr(""); setMsg("");
    try {
      await updateQuestionApi(q.id, {
        question: q.question,
        a: q.a,
        b: q.b,
        c: q.c,
        d: q.d,
        correct: q.correct,
        explanation: q.explanation,
        difficulty: q.difficulty,
      });
      setMsg(`Otázka #${q.id} uložena.`);
    } catch (e) {
      setErr(e.message);
    }
  };

  const removeQuestion = async (qid) => {
    setErr(""); setMsg("");
    try {
      await deleteQuestionApi(qid);
      setData((prev) => ({ ...prev, questions: prev.questions.filter((x) => x.id !== qid) }));
      setMsg(`Otázka #${qid} smazána.`);
    } catch (e) {
      setErr(e.message);
    }
  };

  const approve = async () => {
    setErr(""); setMsg("");
    try {
      await approveLessonApi(lessonId);
      nav("/ucitel");
    } catch (e) {
      setErr(e.message);
    }
  };

  if (!data) return <div className="card">Načítám…</div>;

  const { lesson, questions } = data;

  return (
    <div className="container">
  <div className="card">
    <div className="hstack">
      <div>
        <div className="sectionTitle">Kontrola + editace lekce</div>
        <div className="subTitle">Uprav obsah a otázky, potom lekci schval.</div>
      </div>
      <span className="badge">
        {lesson.approved ? "Schváleno" : "Neschváleno"}
      </span>
    </div>

    {err && <div className="alert error">{err}</div>}
    {msg && <div className="alert ok">{msg}</div>}

    <div className="vstack">
      <div>
        <label>Název lekce</label>
        <input
          value={lesson.title || ""}
          onChange={(e) => setData((p) => ({ ...p, lesson: { ...p.lesson, title: e.target.value } }))}
        />
      </div>

      <div className="grid2">
        <div>
          <label>Výklad – lehký</label>
          <textarea
            value={lesson.content_easy || ""}
            onChange={(e) => setData((p) => ({ ...p, lesson: { ...p.lesson, content_easy: e.target.value } }))}
          />
        </div>
        <div>
          <label>Výklad – těžký</label>
          <textarea
            value={lesson.content_hard || ""}
            onChange={(e) => setData((p) => ({ ...p, lesson: { ...p.lesson, content_hard: e.target.value } }))}
          />
        </div>
      </div>
<AssignStudents
  lessonId={lessonId}
  disabled={data?.lesson?.approved}   // nebo false, pokud chceš i po schválení
  onSaved={() => {}}
/>
      <div className="btnRow">
        <button className="primary" onClick={saveLesson} disabled={lesson.approved}>Uložit lekci</button>
        <button className="primary" onClick={approve} disabled={lesson.approved}>
          {lesson.approved ? "Už schváleno" : "Schválit lekci"}
        </button>
      </div>

      {lesson.approved && (
        <div className="subTitle">Schválená lekce je zamčená (editace je vypnutá).</div>
      )}
    </div>
  </div>

  <div className="card">
    <div className="hstack">
      <div>
        <div className="sectionTitle">Otázky</div>
        <div className="subTitle">Klikni na otázku pro rozbalení a úpravu.</div>
      </div>
      <span className="badge">{questions.length} ks</span>
    </div>

    <div className="vstack">
      {questions.map((q, i) => {
        const isOpen = openId === q.id;
        return (
          <div key={q.id} className={`qItem ${isOpen ? "open" : ""}`}>
            <div
              className="qHeader"
              onClick={() => setOpenId(isOpen ? null : q.id)}
              role="button"
              tabIndex={0}
            >
              <div>
                <h4>{i + 1}. {q.question || "(bez textu)"}</h4>
                <div className="qMeta">
                  <span>ID: {q.id}</span>
                  <span>•</span>
                  <span>Obtížnost: {q.difficulty}</span>
                  <span>•</span>
                  <span>Správně: {String(q.correct || "A").toUpperCase()}</span>
                </div>
              </div>
              <div className="badge">{isOpen ? "Skrýt" : "Upravit"}</div>
            </div>

            <div className="qBody">
              <div className="hr" />

              <div className="vstack">
                <div>
                  <label>Text otázky</label>
                  <input
                    value={q.question || ""}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        questions: p.questions.map((x) => (x.id === q.id ? { ...x, question: e.target.value } : x)),
                      }))
                    }
                  />
                </div>

                <div className="grid2">
                  <div>
                    <label>A</label>
                    <input value={q.a || ""} onChange={(e) => setData((p) => ({
                      ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, a: e.target.value } : x)
                    }))} />
                  </div>
                  <div>
                    <label>B</label>
                    <input value={q.b || ""} onChange={(e) => setData((p) => ({
                      ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, b: e.target.value } : x)
                    }))} />
                  </div>
                  <div>
                    <label>C</label>
                    <input value={q.c || ""} onChange={(e) => setData((p) => ({
                      ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, c: e.target.value } : x)
                    }))} />
                  </div>
                  <div>
                    <label>D</label>
                    <input value={q.d || ""} onChange={(e) => setData((p) => ({
                      ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, d: e.target.value } : x)
                    }))} />
                  </div>
                </div>

                <div className="grid2">
                  <div>
                    <label>Správná odpověď</label>
                    <select
                      value={(q.correct || "A").toUpperCase()}
                      onChange={(e) => setData((p) => ({
                        ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, correct: e.target.value } : x)
                      }))}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  <div>
                    <label>Obtížnost</label>
                    <select
                      value={q.difficulty || "easy"}
                      onChange={(e) => setData((p) => ({
                        ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, difficulty: e.target.value } : x)
                      }))}
                    >
                      <option value="easy">easy</option>
                      <option value="hard">hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Vysvětlení</label>
                  <textarea
                    value={q.explanation || ""}
                    onChange={(e) => setData((p) => ({
                      ...p, questions: p.questions.map((x) => x.id === q.id ? { ...x, explanation: e.target.value } : x)
                    }))}
                  />
                </div>

                <div className="btnRow">
                  <button className="primary" onClick={() => saveQuestion(q)} disabled={lesson.approved}>Uložit otázku</button>
                  <button className="danger" onClick={() => removeQuestion(q.id)} disabled={lesson.approved}>Smazat otázku</button>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
}
