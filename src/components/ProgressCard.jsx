import React, { useState } from 'react';

const QUESTIONS = [
  { key: 'direction', label: 'How clear do you feel about your direction?' },
  { key: 'motivation', label: 'How motivated are you this week?' },
  { key: 'support', label: 'How supported do you feel?' },
];

function ScoreButton({ value, selected, onSelect, color }) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`w-8 h-8 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center
        ${selected
          ? `${color} text-white scale-110 shadow-lg`
          : 'bg-white/8 text-mair-secondary hover:bg-white/12 hover:text-white'
        }
      `}
    >
      {value}
    </button>
  );
}

function getScoreColor(score) {
  if (score <= 2) return 'bg-red-500/60';
  if (score === 3) return 'bg-yellow-500/60';
  return 'bg-green-500/60';
}

export default function ProgressCard() {
  const [scores, setScores] = useState({ direction: null, motivation: null, support: null });
  const [submitted, setSubmitted] = useState(false);

  const handleScore = (key, value) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const allAnswered = Object.values(scores).every(v => v !== null);
  const avgScore = allAnswered
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / 3).toFixed(1)
    : null;

  const handleSubmit = () => {
    if (allAnswered) setSubmitted(true);
  };

  const getAvgLabel = (avg) => {
    if (!avg) return '';
    const n = parseFloat(avg);
    if (n >= 4) return 'You\'re in a strong place right now.';
    if (n >= 3) return 'Steady progress — keep building momentum.';
    return 'This is exactly when coaching matters most.';
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-sm">Progress Check</h3>
      </div>

      {submitted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-scale-in">
          <div className="text-4xl font-black text-gradient mb-2">{avgScore}<span className="text-2xl">/5</span></div>
          <p className="text-mair-secondary text-xs leading-relaxed">{getAvgLabel(avgScore)}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-xs text-mair-secondary/50 hover:text-mair-secondary transition-colors underline"
          >
            Check in again
          </button>
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {QUESTIONS.map((q) => (
            <div key={q.key}>
              <p className="text-white/70 text-xs leading-snug mb-2">{q.label}</p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(v => (
                  <ScoreButton
                    key={v}
                    value={v}
                    selected={scores[q.key] === v}
                    onSelect={(val) => handleScore(q.key, val)}
                    color={getScoreColor(v)}
                  />
                ))}
                <span className="text-mair-secondary/40 text-xs ml-1">
                  {scores[q.key] ? `${scores[q.key]}/5` : ''}
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 mt-2
              ${allAnswered
                ? 'bg-indigo-500/20 text-mair-highlight hover:bg-indigo-500/30 border border-indigo-500/30'
                : 'bg-white/5 text-mair-secondary/40 cursor-not-allowed'
              }
            `}
          >
            Save check-in
          </button>
        </div>
      )}
    </div>
  );
}
