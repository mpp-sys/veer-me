import React, { useState } from 'react';
import { useUser } from '../context/UserContext.jsx';

const MILESTONES = [
  {
    id: 'started',
    icon: '🎉',
    title: 'Reinvention begins',
    description: 'You\'ve taken the first step — the hardest one.',
    completed: true,
    date: 'Today',
  },
  {
    id: 'profile',
    icon: '🧠',
    title: 'Profile built',
    description: 'Shift knows your strengths, worries, and direction.',
    completed: true,
    date: 'Today',
  },
  {
    id: 'first-chat',
    icon: '💬',
    title: 'First coaching session',
    description: 'You\'ve started a real conversation with Shift.',
    completed: false,
    date: 'Coming up',
  },
  {
    id: 'first-action',
    icon: '⚡',
    title: 'First action taken',
    description: 'You\'ve completed your first weekly focus.',
    completed: false,
    date: 'This week',
  },
];

export default function MilestoneCard() {
  const { userProfile } = useUser();
  const [expanded, setExpanded] = useState(false);

  const completed = MILESTONES.filter(m => m.completed);
  const nextUp = MILESTONES.find(m => !m.completed);

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-sm">Milestones</h3>
        </div>
        <span className="text-mair-highlight text-xs font-semibold">
          {completed.length}/{MILESTONES.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/8 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-700"
          style={{ width: `${(completed.length / MILESTONES.length) * 100}%` }}
        />
      </div>

      {/* Latest milestone celebration */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{completed[completed.length - 1]?.icon}</span>
          <div>
            <p className="text-white text-xs font-semibold">{completed[completed.length - 1]?.title}</p>
            <p className="text-mair-secondary/70 text-xs">{completed[completed.length - 1]?.description}</p>
          </div>
        </div>
      </div>

      {/* Next milestone */}
      {nextUp && (
        <div className="flex items-center gap-2 px-3 py-2 bg-white/4 rounded-lg">
          <span className="text-base opacity-40">{nextUp.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white/50 text-xs font-medium truncate">Next: {nextUp.title}</p>
            <p className="text-mair-secondary/40 text-xs">{nextUp.date}</p>
          </div>
          <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-mair-secondary/50 hover:text-mair-secondary transition-colors text-center"
      >
        {expanded ? 'Show less' : `View all ${MILESTONES.length} milestones`}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {MILESTONES.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs
                ${m.completed ? 'bg-green-500/30 text-green-400' : 'border border-white/20'}
              `}>
                {m.completed ? '✓' : ''}
              </div>
              <span className={`text-xs ${m.completed ? 'text-white/70' : 'text-mair-secondary/40'}`}>
                {m.title}
              </span>
              <span className="text-xs text-mair-secondary/30 ml-auto">{m.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
