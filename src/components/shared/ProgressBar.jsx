import React from 'react';

export default function ProgressBar({ step, totalSteps = 4 }) {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className="w-full px-6 pt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-mair-secondary font-medium tracking-wider uppercase">
          Step {step} of {totalSteps}
        </span>
        <span className="text-xs text-mair-indigo font-semibold">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="progress-bar-fill h-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
