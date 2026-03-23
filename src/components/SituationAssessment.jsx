import React, { useState, useEffect } from 'react';
import ProgressBar from './shared/ProgressBar.jsx';
import SelectionCard from './shared/SelectionCard.jsx';
import Button from './shared/Button.jsx';
import { useUser } from '../context/UserContext.jsx';

const SITUATION_OPTIONS = [
  {
    value: 'at-risk',
    emoji: '🧭',
    title: 'My job feels at risk from AI',
    subtitle: 'Automation is threatening my role and I need to act',
  },
  {
    value: 'reinvent',
    emoji: '🚀',
    title: 'I want to reinvent my career entirely',
    subtitle: 'I\'m ready for something new — AI is the catalyst I needed',
  },
  {
    value: 'opportunity',
    emoji: '💡',
    title: 'I want to use AI as an opportunity, not a threat',
    subtitle: 'I see the potential and want to stay ahead of the curve',
  },
];

export default function SituationAssessment({ onNext }) {
  const { userProfile, updateProfile } = useUser();
  const [selected, setSelected] = useState(userProfile.situation);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (!selected) return;
    updateProfile({ situation: selected });
    onNext();
  };

  return (
    <div className="min-h-screen bg-mair-gradient flex flex-col relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-violet-600/8 blur-[80px] pointer-events-none" />

      <ProgressBar step={1} totalSteps={4} />

      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto w-full transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Shift avatar + intro */}
        <div className="glass-card p-5 mb-8 w-full animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-mair-highlight text-sm font-semibold">Shift</span>
                <div className="shift-dot" />
              </div>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                Hi, I'm Shift — your reinvention companion. I'm here to help you navigate the AI revolution. Let's start by understanding where you are right now.
              </p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6 w-full animate-slide-up delay-100">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            What's bringing you here today?
          </h2>
          <p className="text-mair-secondary text-sm">Choose the one that resonates most</p>
        </div>

        {/* Selection cards */}
        <div className="w-full space-y-3 mb-8">
          {SITUATION_OPTIONS.map((option, i) => (
            <div key={option.value} className={`animate-slide-up delay-${(i + 2) * 100}`}>
              <SelectionCard
                emoji={option.emoji}
                title={option.title}
                subtitle={option.subtitle}
                value={option.value}
                selected={selected === option.value}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full animate-slide-up delay-500">
          <Button
            onClick={handleNext}
            disabled={!selected}
            variant="primary"
            size="lg"
            fullWidth
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
