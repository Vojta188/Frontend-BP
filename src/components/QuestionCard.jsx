import React from "react";

export default function QuestionCard({ q, onAnswer, disabled }) {
  return (
    <div className="card">
      <h3>{q.question}</h3>
      <div className="options">
        {["A", "B", "C", "D"].map((k) => {
          const key = k.toLowerCase();
          return (
            <button
  key={k}
  className="option"
  disabled={disabled}
  onClick={() => onAnswer(k)}
>
  <b>{k})</b> {q[key]}
</button>

          );
        })}
      </div>
      <div className="muted">Obtížnost: {q.difficulty}</div>
    </div>
  );
}
