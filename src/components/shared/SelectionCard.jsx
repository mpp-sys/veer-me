import React from 'react';

export default function SelectionCard({
  emoji,
  title,
  subtitle,
  value,
  selected,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`selection-card p-6 flex items-start gap-4 ${selected ? 'selected' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(value)}
      aria-pressed={selected}
    >
      <div className={`
        text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center
        rounded-xl transition-all duration-200
        ${selected
          ? 'bg-indigo-500/20'
          : 'bg-white/5'
        }
      `}>
        {emoji}
      </div>
      <div className="flex-1">
        <p className={`font-semibold text-base leading-snug transition-colors ${
          selected ? 'text-white' : 'text-white/90'
        }`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-mair-secondary text-sm mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`
        w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center
        ${selected
          ? 'border-mair-indigo bg-mair-indigo'
          : 'border-white/20'
        }
      `}>
        {selected && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  );
}
