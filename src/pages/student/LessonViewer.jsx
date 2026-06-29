import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendAnswerApi, startAttemptApi, nextQuestionApi, finishAttemptApi } from "../../api/endpoints";
import QuestionCard from "../../components/QuestionCard";

export default function LessonViewer() {
  const { lessonId } = useParams();
  const [err, setErr] = useState("");
  const [locked, setLocked] = useState(false);

  const [current, setCurrent] = useState(null); // otázka
  const [done, setDone] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  const [results, setResults] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);

  const loadNext = useCallback(async () => {
  const res = await nextQuestionApi(lessonId);

  setDifficulty(res.difficulty || "easy");

  if (res.done) {
    setDone(true);
    setCurrent(null);
    await finishAttemptApi(lessonId);
    return;
  }

  setCurrent(res.question);
}, [lessonId]);

useEffect(() => {
  (async () => {
    try {
      setErr("");
      setDone(false);
      setFeedback(null);
      setResults({ correct: 0, total: 0 });
      await startAttemptApi(lessonId);
      await loadNext();
    } catch (e) {
      setErr(e.message);
    }
  })();
}, [lessonId, loadNext]);

  const answer = async (letter) => {
    if (!current) return;
    setLocked(true);
    setErr("");
    setFeedback(null);
    try {
      const res = await sendAnswerApi({ questionId: current.id, answer: letter });
      setFeedback({ ...res, answer: letter });

      setResults((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (res.correct ? 1 : 0),
      }));

      // krátká pauza na přečtení feedbacku
      setTimeout(async () => {
        try { await loadNext(); } catch (e) { setErr(e.message); }
      }, 600);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLocked(false);
    }
  };

  return (
    <div>
      <h2>Lekce #{lessonId}</h2>
      {err && <div className="error">{err}</div>}

      <div className="card">
        Aktuální obtížnost: <b>{difficulty}</b> • Správně: <b>{results.correct}/{results.total}</b>
      </div>

      {done && (
        <div className="card okCard">
          <b>Hotovo ✅</b>
          <div>Výsledek: <b>{results.correct}/{results.total}</b></div>
          <div className="muted">Lekce je teď splněná a je zamčená, dokud učitel nepovolí opakování.</div>
        </div>
      )}

      {current && (
        <QuestionCard
          q={current}
          disabled={locked}
          onAnswer={answer}
        />
      )}

      {feedback && (
        <div className={`card ${feedback.correct ? "okCard" : "errorCard"}`}>
          <b>{feedback.correct ? "Správně ✅" : "Špatně ❌"}</b>
          <div style={{ marginTop: 6 }}>Tvoje odpověď: <b>{feedback.answer}</b></div>
          {!feedback.correct && feedback.vysvetleni && (
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{feedback.vysvetleni}</div>
          )}
        </div>
      )}
    </div>
  );
}