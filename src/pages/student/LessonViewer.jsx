import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sendAnswerApi, startAttemptApi, nextQuestionApi, finishAttemptApi } from "../../api/endpoints";
import QuestionCard from "../../components/QuestionCard";

export default function LessonViewer() {
  const { lessonId } = useParams();
  const [err, setErr] = useState("");
  const [locked, setLocked] = useState(false);

  const [current, setCurrent] = useState(null); // otázka
  const [done, setDone] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  const [progress, setProgress] = useState({ answered: 0, correct: 0, totalQuestions: 0 });
  const [feedback, setFeedback] = useState(null);

  const loadNext = useCallback(async () => {
  const res = await nextQuestionApi(lessonId);

  setDifficulty(res.difficulty || "easy");
  setProgress(res.progress);

  if (res.done) {
    await finishAttemptApi(lessonId);
    setDone(true);
    setCurrent(null);
    setFeedback(null);
    return;
  }

  setCurrent(res.question);
  setFeedback(null);
}, [lessonId]);

useEffect(() => {
  (async () => {
    try {
      setErr("");
      setDone(false);
      setFeedback(null);
      setProgress({ answered: 0, correct: 0, totalQuestions: 0 });
      await startAttemptApi(lessonId);
      await loadNext();
    } catch (e) {
      setErr(e.message);
    }
  })();
}, [lessonId, loadNext]);

  const answer = async (letter) => {
    if (!current || locked || feedback) return;
    setLocked(true);
    setErr("");
    setFeedback(null);
    try {
      const res = await sendAnswerApi({ questionId: current.id, answer: letter });
      setFeedback({ ...res, answer: letter });

      setProgress((prev) => ({
        ...prev,
        answered: prev.answered + 1,
        correct: prev.correct + (res.correct ? 1 : 0),
      }));

    } catch (e) {
      setErr(e.message);
    } finally {
      setLocked(false);
    }
  };

  const continueTest = async () => {
    if (!feedback || locked) return;
    setLocked(true);
    setErr("");
    try {
      await loadNext();
    } catch (e) {
      
      setErr(e.message);
    } finally {
      setLocked(false);
    }
  };

  return (
    <div>
      <h2>Lekce {lessonId}</h2>
      {err && <div className="error">{err}</div>}

      <div className="card">
        {progress.totalQuestions > 0 && (
          <>
            <div>
              {done ? "Zodpovězeno" : "Otázka"}: <b>
                {done ? progress.answered : Math.min(progress.answered + (feedback ? 0 : 1), progress.totalQuestions)}
                {" z "}{progress.totalQuestions}
              </b>
            </div>
            <div>Správně: <b>{progress.correct}</b></div>
          </>
        )}
        {!done && <div>Aktuální obtížnost: <b>{difficulty}</b></div>}
      </div>

      {done && (
        <div className="card okCard">
          <b>Hotovo ✅</b>
          <div>Výsledek: <b>{progress.correct}/{progress.totalQuestions}</b></div>
          <div className="muted">Lekce je teď splněná a je zamčená, dokud učitel nepovolí opakování.</div>
          <div className="btnRow"><Link className="btn" to="/student">Zpět do hlavního menu</Link></div>
        </div>
      )}

      {current && (
        <QuestionCard
          q={current}
          disabled={locked || Boolean(feedback)}
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
          <button type="button" onClick={continueTest} disabled={locked} style={{ marginTop: 12 }}>
            {locked ? "Načítání…" : "Pokračovat"}
          </button>
        </div>
      )}
    </div>
  );
}
